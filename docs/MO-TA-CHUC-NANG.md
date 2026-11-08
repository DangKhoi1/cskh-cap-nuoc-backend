# Luồng chức năng app CSKH cấp nước

## 1. Đăng ký tài khoản

1. Người dùng mở app và chọn Đăng ký.
2. Người dùng nhập số điện thoại, mật khẩu và xác nhận lại mật khẩu.
3. App đối chiếu ô Mật khẩu với ô Xác nhận mật khẩu. Nếu không trùng khớp, app hiển thị thông báo “Mật khẩu xác nhận không khớp” và yêu cầu nhập lại; người dùng chưa thể tiếp tục đăng ký.
4. Khi hai mật khẩu trùng khớp và thông tin hợp lệ, người dùng mở bot Telegram, bấm Start và chia sẻ số điện thoại của chính tài khoản Telegram đang sử dụng.
5. Hệ thống kiểm tra và lưu liên kết giữa số điện thoại với tài khoản Telegram. Người dùng yêu cầu gửi OTP và hệ thống gửi mã đến Telegram đã liên kết.
6. Người dùng nhập OTP trên app và xác nhận đăng ký. App kiểm tra lại hai ô mật khẩu trước khi gửi yêu cầu hoàn tất đăng ký.
7. Hệ thống kiểm tra mã. Nếu hợp lệ, hệ thống hoàn tất đăng ký và đưa người dùng vào app. Nếu mã sai hoặc hết hạn, app thông báo để người dùng nhập lại hoặc yêu cầu mã mới.
8. Khi chưa liên kết khách hàng cấp nước, app hiển thị số điện thoại để nhận diện tài khoản và chức năng Liên kết khách hàng.

Người dùng không cần nhập tên hoặc email. Đăng ký tài khoản app chưa tạo liên kết với khách hàng trên hệ thống QLKH cấp nước v2.

## 2. Đăng nhập và đăng xuất

### Đăng nhập

1. Người dùng mở app và nhập số điện thoại, mật khẩu.
2. Hệ thống kiểm tra thông tin đăng nhập.
3. Nếu hợp lệ, app mở trang chủ. Nếu chưa có liên kết khách hàng, app hiển thị chức năng Liên kết khách hàng; nếu đã liên kết, app hiển thị các khách hàng tương ứng.
4. Nếu thông tin không đúng, app thông báo và cho phép nhập lại.

### Đăng xuất

1. Người dùng chọn Đăng xuất.
2. Hệ thống kết thúc phiên đăng nhập.
3. App đưa người dùng về màn hình đăng nhập.

## 3. Liên kết khách hàng cấp nước

1. Người dùng đã đăng nhập chọn Liên kết khách hàng.
2. Người dùng nhập mã khách hàng trên hóa đơn tiền nước.
3. App gửi yêu cầu liên kết đến backend CSKH.
4. Backend xác định tài khoản đang đăng nhập, lấy số điện thoại của tài khoản và gửi cùng mã khách hàng sang hệ thống QLKH v2.
5. Hệ thống v2 đối chiếu mã khách hàng và số điện thoại.
6. Nếu khớp, v2 trả thông tin khách hàng. Backend lưu liên kết và app hiển thị tên khách hàng, mã khách hàng cùng địa chỉ sử dụng nước.
7. Nếu không khớp, app thông báo không thể liên kết và yêu cầu kiểm tra lại thông tin. Nếu hệ thống v2 chưa phản hồi, app thông báo để người dùng thử lại sau.
8. Người dùng có thể tiếp tục liên kết thêm mã khách hàng khác. Nếu mã đã được liên kết với tài khoản, hệ thống thông báo đã liên kết, không tạo bản trùng.

Một tài khoản có thể quản lý nhiều mã khách hàng. Ví dụ, Nguyễn Văn A liên kết hai mã `01030001` và `01030002` tương ứng với hai căn nhà. Tên hiển thị được lấy từ v2 theo từng mã khách hàng, không yêu cầu người dùng tự nhập và không gộp thành một tên chung cho tài khoản app.

## 4. Xem hóa đơn chưa thanh toán

1. Người dùng mở trang chủ hoặc mục Hóa đơn.
2. App hiển thị các khách hàng đã liên kết để người dùng chọn một nhà hoặc xem tất cả.
3. App gửi yêu cầu lấy hóa đơn đến backend CSKH.
4. Backend kiểm tra khách hàng được chọn thuộc các liên kết của tài khoản đang đăng nhập, sau đó lấy dữ liệu hóa đơn tương ứng từ v2.
5. App hiển thị các hóa đơn chưa thanh toán, ưu tiên kỳ gần nhất, kèm mã khách hàng, tên khách hàng, địa chỉ, kỳ hóa đơn, lượng nước tiêu thụ và số tiền.
6. Nếu có nhiều hóa đơn chưa thanh toán, app hiển thị danh sách để người dùng xem và chọn thanh toán.
7. Nếu không có hóa đơn chưa thanh toán, app thông báo người dùng không còn khoản tiền nước cần thanh toán.

## 5. Thanh toán hóa đơn tiền nước

1. Người dùng chọn hóa đơn chưa thanh toán và bấm Thanh toán.
2. App gửi yêu cầu đến backend CSKH.
3. Backend kiểm tra hóa đơn thuộc khách hàng đã liên kết, xác nhận trạng thái chưa thanh toán và số tiền cần trả.
4. Backend lấy dữ liệu thanh toán từ hệ thống cung cấp, trả mã QR để app hiển thị cùng thông tin hóa đơn và số tiền.
5. Người dùng mở ứng dụng ngân hàng, quét mã QR và thực hiện thanh toán.
6. Backend nhận hoặc tra cứu kết quả từ hệ thống xác nhận thanh toán rồi cập nhật trạng thái cho app.
7. Khi kết quả được xác nhận thành công, app tự động thông báo thành công và quay lại trang chủ. Hóa đơn được cập nhật sang trạng thái đã thanh toán.
8. Nếu chưa nhận được kết quả, app hiển thị đang chờ xác nhận. Nếu giao dịch thất bại hoặc hết hạn, app thông báo để người dùng kiểm tra hoặc thực hiện lại.

## 6. Xem lịch sử hóa đơn

1. Người dùng mở mục Lịch sử và chọn khách hàng đã liên kết.
2. Người dùng chọn tháng hoặc khoảng thời gian cần xem.
3. App gửi yêu cầu đến backend CSKH.
4. Backend kiểm tra quyền truy cập của tài khoản và lấy danh sách hóa đơn tương ứng từ v2.
5. App hiển thị hóa đơn theo kỳ, gồm lượng nước tiêu thụ, số tiền và trạng thái thanh toán.
6. Người dùng chọn một hóa đơn để xem chi tiết. Nếu khoảng thời gian đã chọn không có dữ liệu, app thông báo chưa có hóa đơn.

## 7. Xem biểu đồ sử dụng nước

1. Người dùng chọn khách hàng đã liên kết và mở mục Tình hình sử dụng nước.
2. Người dùng chọn khoảng thời gian muốn theo dõi.
3. Backend kiểm tra quyền truy cập và lấy số liệu tiêu thụ theo tháng từ v2.
4. App hiển thị biểu đồ lượng nước sử dụng theo từng tháng để người dùng so sánh.
5. Khi người dùng đổi nhà hoặc khoảng thời gian, app cập nhật biểu đồ theo lựa chọn mới.
6. Nếu tháng nào chưa có số liệu, app thể hiện chưa có dữ liệu cho tháng đó.

## 8. Luồng trao đổi dữ liệu giữa hai hệ thống

1. Người dùng thao tác trên app; app gửi yêu cầu đến backend CSKH.
2. Backend kiểm tra phiên đăng nhập và quyền truy cập khách hàng của tài khoản.
3. Backend gửi yêu cầu đến QLKH v2 qua kết nối đã được xác thực giữa hai hệ thống.
4. V2 kiểm tra yêu cầu và trả dữ liệu khách hàng, hóa đơn hoặc tình hình sử dụng nước phù hợp.
5. Backend xử lý kết quả và trả dữ liệu cần hiển thị cho app.
6. Nếu yêu cầu không hợp lệ hoặc người dùng không có quyền, hệ thống từ chối cung cấp dữ liệu. Nếu kết nối gặp lỗi, app nhận thông báo để người dùng thử lại sau.

Trong giai đoạn chưa kết nối v2, backend dùng dữ liệu giả lập để thực hiện các luồng trên. Thanh toán giả lập chỉ mô phỏng QR và kết quả, không yêu cầu chuyển tiền thật. Khi có kết nối chính thức, hệ thống thay nguồn dữ liệu giả lập bằng dữ liệu từ v2.
