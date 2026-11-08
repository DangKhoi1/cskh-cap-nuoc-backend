# Luồng xác thực OTP qua Telegram

## 1. Liên kết số điện thoại với Telegram

1. Người dùng mở bot Telegram của ứng dụng.
2. Người dùng bấm **Start**.
3. Bot yêu cầu người dùng chia sẻ số điện thoại của chính tài khoản Telegram đang sử dụng.
4. Người dùng bấm **Chia sẻ số điện thoại**.
5. Hệ thống kiểm tra số điện thoại được chia sẻ có thuộc tài khoản Telegram đang nhắn với bot hay không.
6. Nếu hợp lệ, hệ thống lưu liên kết giữa số điện thoại và tài khoản Telegram, sau đó thông báo liên kết thành công.
7. Nếu không hợp lệ, bot yêu cầu người dùng chia sẻ lại đúng số điện thoại của mình.

## 2. Nhận OTP khi đăng ký

1. Người dùng nhập số điện thoại, mật khẩu và xác nhận lại mật khẩu trên app.
2. App kiểm tra mật khẩu và xác nhận mật khẩu có trùng nhau hay không.
3. Người dùng yêu cầu gửi OTP.
4. Hệ thống tìm tài khoản Telegram đã liên kết với số điện thoại đăng ký.
5. Nếu đã liên kết, bot gửi mã OTP đến người dùng qua Telegram.
6. Nếu chưa liên kết, hệ thống thông báo người dùng mở bot và chia sẻ số điện thoại trước khi yêu cầu lại.
7. Người dùng nhập OTP trên app để hoàn tất đăng ký.
8. Nếu OTP hợp lệ, tài khoản được tạo và người dùng được đăng nhập.
9. Nếu OTP sai hoặc hết hạn, app thông báo để người dùng nhập lại hoặc yêu cầu mã mới.

## 3. Đăng nhập

1. Người dùng nhập số điện thoại và mật khẩu đã đăng ký.
2. Hệ thống kiểm tra thông tin đăng nhập.
3. Nếu hợp lệ, người dùng được đưa vào trang chủ.
4. Người dùng không cần nhận OTP Telegram trong mỗi lần đăng nhập.
