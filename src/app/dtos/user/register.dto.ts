export interface RegisterDto {
    fullname: string;
  email: string;
  address: string;
  phone_number: string;
  password: string;
  retype_password: string;
  date_of_birth?: string | null; // Có thể là null nếu không có
  facebook_account_id?: number;
  google_account_id?: number;
  role_id: number;
}
