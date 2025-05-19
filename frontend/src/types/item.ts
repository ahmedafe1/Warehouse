export interface ItemDto {
    id: number;
    name: string;
    sku: string; // Stock Keeping Unit - usually a unique identifier for the product type
    description?: string;
    price: number;
    supplierId: number;
    supplier?: {
        id: number;
        name: string;
    };
    createdAt: string;
    updatedAt: string;
    // price?: number; // If you track item price
    // Add any other general item properties like supplier, category, dimensions, weight etc.
}

export interface CreateItemDto {
    name: string;
    sku: string;
    description?: string;
    price: number;
    supplierId: number;
    // price?: number;
}

export interface UpdateItemDto {
    name?: string;
    sku?: string;       // SKU might be unchangeable after creation depending on business rules
    description?: string;
    price?: number;
    supplierId?: number;
    // price?: number;
}

// This DTO might be useful if you have a page showing items on a specific shelf with quantities.
// However, your main "Stock" entity already handles item, shelf, and quantity.
// For now, we focus on managing the Item definitions themselves.
// export interface ItemOnShelfDto extends ItemDto {
//     quantityOnShelf: number;
//     shelfId: number;
// } 