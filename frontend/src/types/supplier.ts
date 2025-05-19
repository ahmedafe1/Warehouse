export interface SupplierDto {
    id: number;
    name: string;
    contactName?: string;
    email?: string;
    phoneNumber?: string;
    address?: string;
}

export interface CreateSupplierDto {
    name: string;
    contactName?: string;
    email?: string;
    phoneNumber?: string;
    address?: string;
}

export interface UpdateSupplierDto {
    name: string;
    contactName?: string;
    email: string;
    phoneNumber?: string;
    address?: string;
} 