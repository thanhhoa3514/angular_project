# Shopapp Angular

## Triển khai Router Guard

Dự án đã được cập nhật với các route được bảo vệ (protected routes) để đảm bảo người dùng phải đăng nhập trước khi truy cập vào các trang cá nhân. Dưới đây là tóm tắt những gì đã được triển khai:

### 1. AuthGuard

- Tạo AuthGuard để bảo vệ các route yêu cầu xác thực
- Chuyển hướng người dùng chưa đăng nhập đến trang đăng nhập
- Lưu URL hiện tại để redirect sau khi đăng nhập thành công

### 2. AuthService

- Quản lý trạng thái đăng nhập của người dùng
- Lưu thông tin người dùng vào localStorage
- Cung cấp các phương thức: login, logout, isLoggedIn, getCurrentUser

### 3. Protected Routes

Các route sau đây đã được bảo vệ bởi AuthGuard:
- `/profile`: Trang thông tin cá nhân người dùng
- `/order`: Trang quản lý đơn hàng

### 4. Trang đăng nhập

- Giao diện đăng nhập với form validation
- Xử lý lưu thông tin người dùng sau khi đăng nhập
- Chuyển hướng người dùng đến trang yêu cầu ban đầu sau khi đăng nhập thành công

### 5. Trang Profile

- Hiển thị thông tin người dùng
- Menu điều hướng đến các trang con: đơn hàng, địa chỉ, sản phẩm yêu thích
- Chức năng đăng xuất

## Cách sử dụng

1. Truy cập vào các trang được bảo vệ như `/profile` hoặc `/order`
2. Hệ thống sẽ tự động chuyển hướng đến trang đăng nhập
3. Đăng nhập với bất kỳ tên người dùng và mật khẩu nào (demo)
4. Sau khi đăng nhập thành công, hệ thống sẽ chuyển hướng đến trang ban đầu

## Lưu ý

- Đây là triển khai cơ bản cho mục đích demo
- Trong môi trường thực tế, cần tích hợp với backend API để xác thực người dùng
- Cần bổ sung thêm các tính năng như đăng ký, quên mật khẩu, v.v.
