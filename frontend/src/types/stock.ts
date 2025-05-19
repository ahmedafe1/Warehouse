export interface StockDto {
    id: number;
    itemId: number;
    shelfId: number;
    quantity: number;
    lastUpdated: string;
    item?: {
        id: number;
        name: string;
        price: number;
    };
    shelf?: {
        id: number;
        code: string;
    };
}

export interface CreateStockDto {
    itemId: number;
    shelfId: number;
    quantity: number;
}

export interface UpdateStockDto {
    itemId: number;
    shelfId: number;
    quantity: number;
} 