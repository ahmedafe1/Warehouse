export interface User {
    id: string;
    username: string;
    email: string;
    roles: string[];
}

export interface RegisterUserDto {
    username: string;
    email: string;
    password: string;
}

// Interface for the expected response from the login endpoint (if it returns more than just a token string)
export interface LoginResponseDto {
    token: string;
    user: AuthenticatedUser;
}

// Interface for the data sent to the login endpoint
export interface LoginUserDto {
    email: string;
    password: string;
}

// You might also want a DTO for the user object you'll store in context/state
export interface AuthenticatedUser {
    id: string;
    email: string;
    username: string;
    roles: string[];
} 