import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';


export class LoginDTO {
    @IsOptional() 
    @IsEmail({}, { message: 'Email không hợp lệ' }) 
    email?: string;

    @IsNotEmpty({ message: 'Mật khẩu không được để trống' }) 
    @IsString({ message: 'Mật khẩu phải là một chuỗi' }) 
    password!: string;

    @IsOptional() // Cho phép phone là tùy chọn
    @IsString({ message: 'Số điện thoại phải là một chuỗi' }) // Kiểm tra kiểu dữ liệu
    phone_number?: string;

    constructor(data: any) {
        this.phone_number = data.phone_number;
        this.password = data.password!;
    }
}