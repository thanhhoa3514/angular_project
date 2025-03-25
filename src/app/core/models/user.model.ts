export interface User {
    id?: number;
    fullName: string;
    phoneNumber: string;
    address?: string;
    dateOfBirth?: Date;
    email?: string;
    password?: string;
    role?: string;
    active?: boolean;
    created_at?: Date;
    updated_at?: Date;
}