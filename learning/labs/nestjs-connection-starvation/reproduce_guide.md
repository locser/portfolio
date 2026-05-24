# [REPRODUCTION LAB] - CONNECTION POOL STARVATION IN NESTJS WITH TYPEORM
*   **Môi trường đề xuất:** Node.js (v18+) + Docker Desktop (Windows)

## Step 1: Dựng môi trường (Environment Setup)
Tạo tệp `docker-compose.yml` để chạy một database PostgreSQL với tài nguyên giới hạn kết nối:

```yaml
version: '3.8'
services:
  postgres-db:
    image: postgres:15-alpine
    container_name: test-postgres
    ports:
      - "5432:5432"
    environment:
      POSTGRES_USER: test_user
      POSTGRES_PASSWORD: test_password
      POSTGRES_DB: test_learning
    command: ["postgres", "-c", "max_connections=10"] # Giới hạn tối đa 10 kết nối toàn database
```
*Chạy lệnh:* `docker-compose up -d` để khởi động database.

## Step 2: Kích hoạt Lỗi (Triggering the Issue)
Trong project NestJS của bạn, cấu hình TypeORM Module với kích thước connection pool cực kỳ nhỏ (`max: 2`) để dễ tái hiện lỗi:

```typescript
// app.module.ts
TypeOrmModule.forRoot({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'test_user',
  password: 'test_password',
  database: 'test_learning',
  entities: [User],
  synchronize: true,
  extra: {
    max: 2, // Giới hạn pool chỉ có 2 kết nối cho instance NestJS này
    connectionTimeoutMillis: 2000, // Timeout 2 giây nếu không lấy được kết nối từ pool
  }
})
```

### Viết Bad-Code gây nghẽn kết nối (Connection Leak / Slow Transaction)
Cố ý viết một endpoint thực hiện transaction nhưng bị nghẽn (ví dụ: chờ một tác vụ I/O rất lâu bằng setTimeout trước khi commit/rollback):

```typescript
// user.service.ts
@Injectable()
export class UserService {
  constructor(private dataSource: DataSource) {}

  async badEndpoint() {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    
    try {
      // Thực hiện một thao tác bất kỳ
      await queryRunner.query('SELECT 1');
      
      // Giả lập tác vụ I/O nghẽn nặng (ví dụ call API bên thứ ba mất 10 giây)
      // Mắc lỗi nghiêm trọng: Giữ kết nối mở trong lúc chờ tác vụ phi-database!
      await new Promise(resolve => setTimeout(resolve, 10000));
      
      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
    } finally {
      // Cố tình quên giải phóng queryRunner: await queryRunner.release();
      // Điều này gây ra Connection Leak!
    }
  }
}
```

### Stress Test kích hoạt lỗi
Cài đặt `autocannon` trên máy của bạn: `npm install -g autocannon`
Chạy lệnh stress test với 10 clients đồng thời:
`autocannon -c 10 -d 5 http://localhost:3000/users/bad`

## Step 3: Quan sát và Phân tích (Symptom Analysis)
- **Hiện tượng:** Sau 2 giây đầu tiên, tất cả các request gửi đến API tiếp theo sẽ bị đứng im (pending) và sau đó sập hàng loạt với lỗi:
  `ConnectionTimeoutError: timeout expired when trying to acquire connection`
- **Quan sát Database:** Chạy câu lệnh SQL sau trong PostgreSQL để xem số lượng connection đang bị giữ mở ở trạng thái `idle in transaction`:
  ```sql
  SELECT pid, state, query, age(clock_timestamp(), query_start) 
  FROM pg_stat_activity 
  WHERE state IS NOT NULL;
  ```
  Bạn sẽ thấy 2 kết nối từ NestJS bị treo vĩnh viễn ở trạng thái `idle in transaction` do thiếu lệnh `release()`.

## Step 4: Khắc phục & Tối ưu (Resolution & Optimization)
1. **Luôn giải phóng tài nguyên:** Đảm bảo mã nguồn trong khối `finally` luôn chạy lệnh giải phóng query runner:
   ```typescript
   finally {
     await queryRunner.release(); // Giải phóng kết nối trả lại pool lập tức!
   }
   ```
2. **Không thực hiện tác vụ phi-database trong Transaction:** Di chuyển toàn bộ các đoạn code chờ I/O, call API ngoài ra khỏi khối transaction. Chỉ start transaction ngay trước khi ghi dữ liệu và commit nhanh nhất có thể.
   ```typescript
   // Tác vụ I/O chạy ngoài transaction trước
   const externalData = await this.callExternalApi(); 
   
   // Bắt đầu transaction nhanh
   await queryRunner.startTransaction();
   try {
     await queryRunner.manager.save(new User(externalData));
     await queryRunner.commitTransaction();
   } finally {
     await queryRunner.release();
   }
   ```
3. **Chạy lại Stress Test:** Lệnh benchmark sẽ chạy mượt mà 100% không gặp bất kỳ lỗi nghẽn nào, mặc dù pool max vẫn chỉ ở mức `2` kết nối!
