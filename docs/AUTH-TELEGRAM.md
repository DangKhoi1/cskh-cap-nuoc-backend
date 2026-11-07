# Nối Telegram với đăng ký số điện thoại

## Trạng thái

Backend đã dùng plugin phoneNumber: xin OTP, xác minh để tạo tài khoản,
thiết lập mật khẩu và đăng nhập bằng số điện thoại. Phần bot Telegram,
webhook và liên kết số điện thoại với chat chưa triển khai.

## Điểm tích hợp

Cài đặt hàm `otpSender.send` tại
`src/modules/auth/infrastructure/otp-sender.ts`. Better Auth truyền vào
`{ phoneNumber, code }`. Hàm cần tra chat đã xác minh thuộc số điện thoại,
gửi mã và báo lỗi nếu gửi thất bại. Hiện hàm trả lỗi 503 khi chưa cấu hình.
Không thay cơ chế kiểm tra OTP của plugin bằng hàm luôn trả true.

Phần bot cần xử lý riêng:

1. Người dùng mở bot, bấm Start và chia sẻ contact.
2. Kiểm tra webhook secret, private chat và contact.user_id khớp người gửi.
3. Lưu liên kết số điện thoại đã chuẩn hóa với Telegram user/chat ID.
4. Chỉ gửi OTP tới liên kết hợp lệ; không cho ghi đè bằng contact người khác.

Không gửi mật khẩu cho bot, không log OTP/token bot và không trả mã về frontend.
Xác minh qua Telegram không phải xác minh SMS của nhà mạng.

## Luồng frontend

1. Hoàn thành liên kết contact với bot sau khi chức năng bot được triển khai.
2. Gọi POST /auth/register/otp với phoneNumber.
3. Nhận mã qua Telegram.
4. Gọi POST /auth/register với userName, phoneNumber, password và otp.
5. Backend xác minh OTP qua plugin, tạo user/session, đặt mật khẩu lần đầu
   và trả cookie. Những lần sau gọi POST /auth/login bằng phoneNumber/password.

OTP gồm 6 chữ số, thời hạn 5 phút, tối đa 3 lần thử sai theo plugin.
Cooldown theo số điện thoại, giới hạn gửi Telegram và lưu contact cần triển khai
trong phần tích hợp; hiện chưa có bảo đảm cooldown 60 giây ở database.

Chi tiết API, cấu hình, xử lý lỗi giữa các bước và kiểm tra nằm trong
[README auth](../src/modules/auth/README.md).

## Tham khảo

- [Better Auth Phone Number](https://better-auth.com/docs/plugins/phone-number)
- [Telegram Bot API](https://core.telegram.org/bots/api)
