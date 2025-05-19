export type UserRole = 'Logistic' | 'Manager' | 'SuperAdmin';

export interface User {
  id: string;
  username: string;
  email: string;
  role: UserRole;
}

export interface CreateUserDto {
  username: string;
  email: string;
  password: string;
  role: UserRole;
}

export interface UpdateUserDto {
  username?: string;
  email?: string;
  password?: string;
  role?: UserRole;
} 