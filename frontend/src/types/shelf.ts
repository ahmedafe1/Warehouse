export interface ShelfDto {
    id: number;
    code: string;
    warehouseId: number;
    warehouse: {
        id: number;
        name: string;
        location: string;
    };
    stocks: any[]; // You might want to type this properly based on your stock type
}

export interface CreateShelfDto {
    code: string;
    warehouseId: number;
}

export interface UpdateShelfDto {
    code?: string;
    warehouseId?: number;
} 