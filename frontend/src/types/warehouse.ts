export interface WarehouseMinimalDto {
    id: number;
    name: string;
    location?: string;
}

export interface StockMinimalDto {
    id: number;
    itemId: number;
    itemName: string;
    quantity: number;
}

export interface ShelfMinimalDto {
    id: number;
    code: string;
}

export interface WarehouseDto {
    id: number;
    name: string;
    location?: string;
    capacity?: number;
    createdAt: string;
    updatedAt: string;
    shelves?: ShelfMinimalDto[];
}

export interface CreateWarehouseDto {
    name: string;
    location?: string;
    capacity?: number;
}

export interface UpdateWarehouseDto {
    name?: string;
    location?: string;
    capacity?: number;
} 