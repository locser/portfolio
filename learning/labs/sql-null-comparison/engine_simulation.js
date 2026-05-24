/**
 * DATABASE ENGINE SIMULATOR - PHYSICAL NULL STORAGE & 3VL EVALUATOR
 * Co-written for Learn-With-Me Session: SQL NULL Comparison
 */

// 1. Định nghĩa trạng thái Logic 3 trị (Three-Valued Logic)
const TVL = {
  TRUE: 'TRUE',
  FALSE: 'FALSE',
  UNKNOWN: 'UNKNOWN'
};

// Hàm logic hỗ trợ phép phủ định NOT trong 3VL
function tvlNot(val) {
  if (val === TVL.TRUE) return TVL.FALSE;
  if (val === TVL.FALSE) return TVL.TRUE;
  return TVL.UNKNOWN; // NOT UNKNOWN = UNKNOWN
}

// 2. Định nghĩa cấu trúc Bảng mô phỏng
// Bảng có 2 cột:
//   - Cột 0: "id" (Kiểu INT, 4 bytes, NOT NULL)
//   - Cột 1: "age" (Kiểu INT, 4 bytes, NULLABLE)
const SCHEMA = [
  { name: 'id', size: 4, nullable: false, bitIndex: 0 },
  { name: 'age', size: 4, nullable: true, bitIndex: 1 }
];

// 3. Hàm mã hóa dữ liệu thành byte thô (Simulate Page/Row Writer)
// Cấu trúc Row trong bộ nhớ thô:
// [1 Byte: Null Bitmap] [4 Bytes: id] [4 Bytes: age]
function writeRow(id, age) {
  const rowBuffer = Buffer.alloc(9); // 1 + 4 + 4 = 9 bytes
  let nullBitmap = 0;

  // Ghi giá trị cột ID (không được NULL)
  rowBuffer.writeInt32BE(id, 1);

  // Xử lý cột AGE
  if (age === null || age === undefined) {
    // Nếu NULL, set bit thứ 1 trong Null Bitmap thành 1
    nullBitmap |= (1 << 1);
    // Cố tình ghi đè "rác" vào vùng dữ liệu của age để thực chứng DB Engine bỏ qua dữ liệu thô tại đây
    rowBuffer.writeInt32BE(0xDEADBEEF, 5); 
  } else {
    rowBuffer.writeInt32BE(age, 5);
  }

  // Ghi Null Bitmap vào byte đầu tiên (offset 0)
  rowBuffer.writeUInt8(nullBitmap, 0);

  return rowBuffer;
}

// 4. Database Engine Reader & Evaluator
class EngineEvaluator {
  constructor(rowBuffer) {
    this.buffer = rowBuffer;
    this.nullBitmap = rowBuffer.readUInt8(0);
  }

  // Đọc giá trị vật lý thô từ vùng nhớ (Không quan tâm Null Bitmap)
  readRawValue(colName) {
    const col = SCHEMA.find(c => c.name === colName);
    if (col.name === 'id') return this.buffer.readInt32BE(1);
    if (col.name === 'age') return this.buffer.readInt32BE(5);
  }

  // Kiểm tra xem cột có bị đánh dấu NULL trong Bitmap hay không
  isColNull(colName) {
    const col = SCHEMA.find(c => c.name === colName);
    if (!col.nullable) return false;
    // Kiểm tra xem bit tương ứng có được set thành 1 hay không
    return (this.nullBitmap & (1 << col.bitIndex)) !== 0;
  }

  // Lấy giá trị logic (có xử lý Null Bitmap)
  getValue(colName) {
    if (this.isColNull(colName)) {
      return null;
    }
    return this.readRawValue(colName);
  }

  // GIẢ LẬP TOÁN TỬ SO SÁNH "=" CỦA ENGINE (Bị lỗi logic với NULL)
  evaluateEqualOperator(colName, compareValue) {
    const isNull = this.isColNull(colName);
    
    console.log(`\n--- Đang đánh giá: [${colName}] = ${compareValue} ---`);
    console.log(`   + Trạng thái Null Bitmap của cột [${colName}]: ${isNull ? 'ĐÃ ĐÁNH DẤU NULL' : 'Bình thường'}`);
    console.log(`   + Giá trị thô trong ô nhớ vật lý: 0x${this.readRawValue(colName).toString(16).toUpperCase()} (${this.readRawValue(colName)})`);

    if (isNull || compareValue === null) {
      console.log(`   => [3VL Cảnh báo] Phát hiện toán tử so sánh '=' chạm vào vùng NULL. Trả về UNKNOWN.`);
      return TVL.UNKNOWN;
    }

    const value = this.readRawValue(colName);
    const result = (value === compareValue) ? TVL.TRUE : TVL.FALSE;
    console.log(`   => Kết quả so sánh vật lý: ${result}`);
    return result;
  }

  // GIẢ LẬP TOÁN TỬ TRẠNG THÁI "IS NULL"
  evaluateIsNullOperator(colName) {
    console.log(`\n--- Đang đánh giá: [${colName}] IS NULL ---`);
    const isNull = this.isColNull(colName);
    console.log(`   + Đọc trực tiếp Null Bitmap: bitIndex[${SCHEMA.find(c => c.name === colName).bitIndex}] = ${isNull ? '1 (TRUE)' : '0 (FALSE)'}`);
    return isNull ? TVL.TRUE : TVL.FALSE;
  }
}

// 5. CHẠY THỰC NGHIỆM
console.log("=== KHỞI CHẠY PHÒNG THÍ NGHIỆM THỰC CHỨNG ENGINE ===");

// Tạo 2 hàng dữ liệu thô
const row1 = writeRow(1, 25);   // Hàng 1: id=1, age=25
const row2 = writeRow(2, null); // Hàng 2: id=2, age=NULL (vùng age vật lý chứa rác 0xDEADBEEF)

console.log("\n[Vật lý] Byte thô lưu trữ của Row 1 (age = 25):");
console.log(row1);
console.log("[Vật lý] Byte thô lưu trữ của Row 2 (age = NULL):");
console.log(row2);
console.log("-> Để ý byte đầu tiên (Null Bitmap) của Row 2 là 0x02 (tức là bit thứ 1 đã được set).");

// --- TEST CASE 1: Chạy câu query WHERE age = 25 ---
console.log("\n=================== TEST CASE 1: WHERE age = 25 ===================");
const evalRow1 = new EngineEvaluator(row1);
const res1 = evalRow1.evaluateEqualOperator('age', 25);
console.log(`>> Row 1: WHERE age = 25 -> Kết quả: ${res1} (Dòng này ${res1 === TVL.TRUE ? 'ĐƯỢC CHỌN' : 'BỊ LOẠI BỎ'})`);

const evalRow2_test1 = new EngineEvaluator(row2);
const res2 = evalRow2_test1.evaluateEqualOperator('age', 25);
console.log(`>> Row 2: WHERE age = 25 -> Kết quả: ${res2} (Dòng này ${res2 === TVL.TRUE ? 'ĐƯỢC CHỌN' : 'BỊ LOẠI BỎ'})`);

// --- TEST CASE 2: LỖI LẬP TRÌNH - Chạy câu query WHERE age = NULL ---
console.log("\n=================== TEST CASE 2: WHERE age = NULL (LỖI KINH ĐIỂN) ===================");
const evalRow2_test2 = new EngineEvaluator(row2);
const res3 = evalRow2_test2.evaluateEqualOperator('age', null);
console.log(`>> Row 2: WHERE age = NULL -> Kết quả: ${res3} (Dòng này ${res3 === TVL.TRUE ? 'ĐƯỢC CHỌN' : 'BỊ LOẠI BỎ'})`);

// --- TEST CASE 3: GIẢI PHÁP ĐÚNG - Chạy câu query WHERE age IS NULL ---
console.log("\n=================== TEST CASE 3: WHERE age IS NULL ===================");
const evalRow2_test3 = new EngineEvaluator(row2);
const res4 = evalRow2_test3.evaluateIsNullOperator('age');
console.log(`>> Row 2: WHERE age IS NULL -> Kết quả: ${res4} (Dòng này ${res4 === TVL.TRUE ? 'ĐƯỢC CHỌN' : 'BỊ LOẠI BỎ'})`);
