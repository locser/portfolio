
// Ép Next.js không chạy thử lúc build (bỏ qua prerender)
export const dynamic = "force-dynamic";

export async function GET() {
  // Cố tình ném lỗi chỉ khi chạy thực tế (runtime)
  throw new Error("Lỗi giả lập tại runtime để test Rollback!");
}
