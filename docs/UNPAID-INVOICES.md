# Danh sách hóa đơn chưa thanh toán

## Nghiệp vụ

Một tài khoản app có thể liên kết nhiều điểm cấp nước, ví dụ hai căn nhà với hai
đồng hồ. Mỗi liên kết có linkId, mã điểm cấp nước, mã khách hàng, địa chỉ và mã
đồng hồ. Tên trên hóa đơn không dùng để xác định quyền truy cập.

Người dùng xem tất cả hóa đơn chưa thanh toán hoặc chọn một nhà. Chỉ trả trạng
thái UNPAID, gồm cả hóa đơn quá hạn và chưa đến hạn. Không trả PAID hoặc CANCELLED.
Sắp xếp kỳ hóa đơn (billingPeriod, dạng YYYY-MM) giảm dần để kỳ mới nhất
hiển thị trước; cùng kỳ thì theo mã hóa đơn tăng dần. Vẫn trả tất cả hóa đơn
chưa thanh toán, gồm các kỳ cũ, và tính tổng nợ đầy đủ. Chưa phân trang.

## API

- Tất cả nhà: `GET /invoices/unpaid`
- Nhà 1: `GET /invoices/unpaid?linkId=mock-home-1`
- Nhà 2: `GET /invoices/unpaid?linkId=mock-home-2`

Gửi cookie session từ bước đăng nhập. Không gửi body hoặc userId.
Query chỉ hỗ trợ linkId (chuỗi 1–100 ký tự); page và limit không còn được nhận.

Response giữ cấu trúc EC/EM/source/data. Bên trong data:

| Trường | Nội dung |
| --- | --- |
| selectedLinkId | Liên kết đang chọn, null nếu xem tất cả |
| customerLinks | Các điểm cấp nước thuộc tài khoản, dùng cho bộ chọn nhà |
| summary.totalInvoices | Số hóa đơn chưa thanh toán trong phạm vi đang chọn |
| summary.totalUnpaidAmount | Tổng tiền của các hóa đơn đó |
| summary.currency | VND |
| invoices | Toàn bộ hóa đơn chưa thanh toán trong phạm vi đang chọn |

Mỗi hóa đơn có invoiceId, customerName, property, billingPeriod, dueDate,
consumptionM3, amount, currency và status. property chứa thông tin liên kết,
địa chỉ và đồng hồ hiện tại. Kỳ có dạng YYYY-MM, hạn thanh toán YYYY-MM-DD;
số tiền là số nguyên VND, lượng nước tính bằng m³. Không còn trường pagination.

Không có liên kết hoặc không có nợ: invoices rỗng và các tổng bằng 0.
customerLinks vẫn chứa các liên kết không có nợ để người dùng chọn nhà.

| HTTP | Ý nghĩa |
| --- | --- |
| 200 | Thành công, kể cả danh sách rỗng |
| 400 | Query không hợp lệ hoặc có trường không hỗ trợ |
| 401 | Chưa đăng nhập hoặc session hết hạn |
| 404 | Liên kết không tồn tại hoặc không thuộc tài khoản |
| 503 | Chạy production nhưng chưa cấu hình nguồn dữ liệu thật |
| 500 | Lỗi ngoài dự kiến |

## Đường đi dữ liệu và code

1. Frontend gọi API kèm cookie.
2. Guard Better Auth xác thực session; DTO kiểm tra linkId.
3. InvoiceController lấy userId từ session, gọi ListUnpaidInvoicesUseCase.
4. Use case lấy liên kết của tài khoản; nếu chọn nhà thì kiểm tra quyền trước.
5. Adapter lấy hóa đơn theo các điểm cấp nước được phép.
6. Use case kiểm tra lại mã điểm cấp nước và mã khách hàng, lọc UNPAID,
   sắp xếp và tính tổng tiền.
7. Controller định dạng JSON và trả về frontend.

Các file trong `src/modules/invoices/`:

- `domain/`: kiểu dữ liệu hóa đơn và liên kết điểm cấp nước.
- `application/ports/invoice-source.port.ts`: hợp đồng đọc dữ liệu.
- `application/use-cases/list-unpaid-invoices.use-case.ts`: xử lý nghiệp vụ.
- `infrastructure/mock-invoice-source.ts`: dữ liệu mô phỏng.
- `presentation/dtos/list-invoices.dto.ts`: kiểm tra query.
- `presentation/controllers/invoice.controller.ts`: nhận request và tạo response.
- `invoice.module.ts`: nối các thành phần bằng dependency injection.

## Dữ liệu mock và kiểm tra

Chưa có kết nối QLKH v2 hoặc chức năng xác nhận liên kết thật.
Điền `MOCK_INVOICE_USER_ID=<userId>` vào .env và khởi động lại backend.
Lấy userId từ GET /users/me, không dùng số điện thoại thay ID.

Tài khoản được cấu hình có hai liên kết mẫu, cùng chủ hợp đồng
`Nguyen Van An (mock)`. Đây không phải tên lấy từ hồ sơ tài khoản.

- Xem tất cả: 3 hóa đơn, tổng 350000 VND.
- Nhà 1: 2 hóa đơn, tổng 270000 VND.
- Nhà 2: 1 hóa đơn, tổng 80000 VND.
- Tài khoản khác: danh sách rỗng; cố chọn liên kết trên trả 404.
- Không có cookie: 401. Gửi page, limit hoặc userId: 400.

Mock không ghi database, không tạo liên kết thật và bị chặn ở production.
Không dùng hóa đơn mock để chuyển tiền. Chạy `npm run test:auth` để kiểm tra
trên PostgreSQL thật với chức năng gửi OTP giả lập; bài kiểm tra dọn tài khoản tạm.

## Tích hợp v2

Thay provider INVOICE_SOURCE bằng nguồn đọc liên kết đã xác nhận từ database
CSKH và lấy hóa đơn từ API v2. Cập nhật source trong response khi thay adapter.
Cần thống nhất mã điểm cấp nước, quan hệ với mã khách hàng và đồng hồ, đơn vị,
trạng thái, xác thực, timeout và lỗi với đội v2. Mã đồng hồ lịch sử trên hóa đơn
cần lấy riêng nếu đồng hồ đã thay; không dùng mã hiện tại thay cho lịch sử.

Thông tin xác thực v2 chỉ nằm ở backend. Lỗi v2 phải trả lỗi dịch vụ, không biến
thành danh sách rỗng. Hiện lấy toàn bộ hóa đơn trong bộ nhớ; khi dữ liệu lớn,
cần bổ sung phân trang và cách tính tổng phù hợp với API v2.
