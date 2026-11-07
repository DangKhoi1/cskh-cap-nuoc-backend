# Đăng ký và đăng nhập bằng số điện thoại

Backend dùng plugin `phoneNumber` của Better Auth. Email tạm chỉ được tạo khi
plugin tạo user; đăng nhập tra cứu bằng số điện thoại, không đổi sang email.

## Cấu hình

Điền cấu hình PostgreSQL, BETTER_AUTH_SECRET và BETTER_AUTH_URL trong `.env`.
Schema Better Auth phải tồn tại. Chạy `npm run db:migrate:phone` nếu chưa có
cột phoneNumber và phoneNumberVerified. Không tự xác minh tài khoản cũ.

Phần Telegram chưa triển khai. Nối hàm `otpSender.send` trong
`infrastructure/otp-sender.ts` với bot. Hàm nhận `{ phoneNumber, code }`;
chỉ gửi đến chat đã đối chiếu với số điện thoại. Khi chưa nối, API xin OTP trả
503. Không có OTP cố định, không log mã và không trả mã về frontend.

## API

Base URL local: `http://localhost:8080`. Gửi JSON, Origin hợp lệ với cấu hình
Better Auth và giữ cookie giữa các request.

1. `POST /auth/register/otp`: `{ "phoneNumber": "0912345678" }`.
2. `POST /auth/register`: `{ "userName": "Nguyen Van A", "phoneNumber": "0912345678", "password": "TestPassword123!", "otp": "123456" }`.
3. `POST /auth/login`: `{ "phoneNumber": "0912345678", "password": "TestPassword123!" }`.
4. `GET /users/me`: gửi cookie để lấy hồ sơ.
5. `POST /auth/logout`: body `{}`, thu hồi session và xóa cookie.

OTP gồm 6 chữ số, hết hạn sau 5 phút, tối đa 3 lần thử sai theo plugin.
Số Việt Nam được chuẩn hóa thành dạng `+84`. Mật khẩu dài 8–128 ký tự.
Đăng ký trả 201, đăng nhập trả 200, kèm EC/EM/user và Set-Cookie.
Response app không chứa email nội bộ, mật khẩu, OTP hay session token.

## Luồng code

- `dto/`: kiểm tra số điện thoại, tên, mật khẩu và OTP.
- `auth.controller.ts`: nhận request, chuyển cookie về trình duyệt.
- `auth.service.ts`: xin OTP, đăng ký, đăng nhập và định dạng EC/EM.
- `infrastructure/better-auth.client.ts`: gọi handler, chuyển lỗi; dùng session
  từ bước xác minh OTP để thiết lập mật khẩu lần đầu và cập nhật tên.
- `auth.ts`: cấu hình plugin, tạo email tạm khi tạo user, tắt đăng ký/đăng nhập email.
- `infrastructure/otp-sender.ts`: điểm nối chức năng gửi OTP.
- `phone-number.ts`: chuẩn hóa số điện thoại.

Đăng ký gọi `/phone-number/verify`: plugin kiểm tra OTP, tạo user và session.
Sau đó backend gọi API server-only `setPassword`, cập nhật tên và trả cookie.
Đăng nhập gọi `/sign-in/phone-number` với số điện thoại và mật khẩu.
Tài khoản cũ có số điện thoại và credential vẫn đăng nhập được; không tự đổi
phoneNumberVerified của chúng chỉ vì đăng nhập thành công.

Các bước xác minh, đặt mật khẩu và cập nhật tên không nằm trong một transaction.
Nếu lỗi sau xác minh, tài khoản có thể đã tồn tại; session của lần hoàn tất lỗi
được yêu cầu thu hồi. Nếu chưa đặt được mật khẩu, xin OTP mới rồi thử lại.
Nếu mật khẩu đã được lưu, đăng nhập và sửa tên qua PATCH /users/me.
Đăng ký lại không ghi đè mật khẩu đã có.

Route plugin gốc dưới `/api/auth` giữ response riêng. `/phone-number/verify`
cũng cho phép đăng nhập bằng OTP theo thiết kế plugin. Email sign-up/sign-in
và các route reset mật khẩu bằng số điện thoại đã tắt.
Giới hạn request theo IP dùng cấu hình Better Auth; chưa bổ sung cooldown
60 giây theo số điện thoại hoặc cơ chế chống gửi đồng thời riêng.

## Kiểm tra

`npm run test:auth` dùng NestJS, Better Auth và PostgreSQL thật; giả lập hàm gửi
OTP trong test, không gọi Telegram. Test tạo tài khoản tạm và dọn sau khi chạy.
