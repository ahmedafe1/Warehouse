import {
  WarehouseDto,
  CreateWarehouseDto,
  UpdateWarehouseDto,
} from "@/types/warehouse";
import { RegisterUserDto, LoginUserDto, LoginResponseDto } from "@/types/auth";
import { ShelfDto, CreateShelfDto, UpdateShelfDto } from "@/types/shelf";
import { ItemDto, CreateItemDto, UpdateItemDto } from "@/types/item";
import { jwtDecode } from "jwt-decode";
import {
  SupplierDto,
  CreateSupplierDto,
  UpdateSupplierDto,
} from "@/types/supplier";
import { CreateStockDto, UpdateStockDto, StockDto } from "@/types/stock";
import axios, {
  InternalAxiosRequestConfig,
  AxiosResponse,
  AxiosError,
} from "axios";
import { User, CreateUserDto, UpdateUserDto } from "@/types/user";

// Default to localhost:5000 if not specified in environment
const baseURL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export const apiService = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
  // Add timeout to prevent hanging requests
  timeout: 10000,
});

// Add a request interceptor to add the auth token to requests
apiService.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem("authToken");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    console.error("Request error:", error);
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle common errors
apiService.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    if (error.code === "ECONNABORTED") {
      console.error("Request timeout - server might be down or unreachable");
      throw new Error(
        "Request timeout - please check if the server is running"
      );
    }

    if (error.code === "ERR_NETWORK") {
      console.error("Network error - unable to connect to the server");
      throw new Error(
        "Unable to connect to the server - please check if the server is running"
      );
    }

    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem("authToken");
      window.location.href = "/auth/login";
    }

    return Promise.reject(error);
  }
);

// Helper function to handle API responses
const handleResponse = <T>(response: AxiosResponse<T>): T => {
  return response.data;
};

// Helper function to handle API errors
const handleError = (error: AxiosError): never => {
  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    throw new Error(
      `API Error: ${error.response.status} - ${JSON.stringify(
        error.response.data
      )}`
    );
  } else if (error.request) {
    // The request was made but no response was received
    throw new Error(
      "No response from server - please check if the server is running"
    );
  } else {
    // Something happened in setting up the request that triggered an Error
    throw new Error(`Request Error: ${error.message}`);
  }
};

// Auth related API calls
export const loginUser = async (credentials: {
  email: string;
  password: string;
}) => {
  try {
    const response = await apiService.post("/api/auth/login", credentials);
    const { token, user } = response.data;
    localStorage.setItem("authToken", token);
    return { token, user };
  } catch (error) {
    return handleError(error as AxiosError);
  }
};

export const registerUser = async (userData: {
  username: string;
  email: string;
  password: string;
}) => {
  try {
    const response = await apiService.post("/api/auth/register", userData);
    return handleResponse(response);
  } catch (error) {
    return handleError(error as AxiosError);
  }
};

export const logoutUser = () => {
  localStorage.removeItem("authToken");
};

// User Management API calls
export const getUsers = async (): Promise<User[]> => {
  try {
    const response = await apiService.get<User[]>("/api/user");
    return handleResponse(response);
  } catch (error) {
    return handleError(error as AxiosError);
  }
};

export const createUser = async (userData: CreateUserDto): Promise<User> => {
  try {
    const response = await apiService.post<User>("/api/user", userData);
    return handleResponse(response);
  } catch (error) {
    return handleError(error as AxiosError);
  }
};

export const updateUser = async (
  id: string,
  userData: UpdateUserDto
): Promise<User> => {
  try {
    const response = await apiService.put<User>(`/api/user/${id}`, userData);
    return handleResponse(response);
  } catch (error) {
    return handleError(error as AxiosError);
  }
};

export const deleteUser = async (id: string): Promise<void> => {
  try {
    const response = await apiService.delete(`/api/user/${id}`);
    return handleResponse(response);
  } catch (error) {
    return handleError(error as AxiosError);
  }
};

// Warehouse API functions
export async function getWarehouses(): Promise<WarehouseDto[]> {
  if (!baseURL) {
    console.error(
      "API_BASE_URL is not defined. Check your .env.local file and ensure it's loaded."
    );
    throw new Error("API base URL is not configured.");
  }
  try {
    const response = await apiService.get<WarehouseDto[]>("/api/warehouses");
    return response.data;
  } catch (error) {
    console.error("Error in getWarehouses:", error);
    throw error;
  }
}

export async function createWarehouse(
  warehouseData: CreateWarehouseDto
): Promise<WarehouseDto> {
  if (!baseURL) {
    console.error("API_BASE_URL is not defined.");
    throw new Error("API base URL is not configured.");
  }
  try {
    const response = await apiService.post<WarehouseDto>(
      "/api/warehouses",
      warehouseData
    );
    return response.data;
  } catch (error) {
    console.error("Error in createWarehouse:", error);
    throw error;
  }
}

export async function getWarehouseById(
  id: number
): Promise<WarehouseDto | null> {
  if (!baseURL) {
    console.error("API_BASE_URL is not defined.");
    throw new Error("API base URL is not configured.");
  }
  try {
    const response = await apiService.get<WarehouseDto>(
      `/api/warehouses/${id}`
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      console.warn(`Warehouse with ID ${id} not found.`);
      return null;
    }
    console.error(`Error in getWarehouseById for ID ${id}:`, error);
    throw error;
  }
}

export async function updateWarehouse(
  id: number,
  warehouseData: UpdateWarehouseDto
): Promise<void> {
  if (!baseURL) {
    console.error("API_BASE_URL is not defined.");
    throw new Error("API base URL is not configured.");
  }
  try {
    await apiService.put(`/api/warehouses/${id}`, warehouseData);
  } catch (error) {
    console.error(`Error in updateWarehouse for ID ${id}:`, error);
    throw error;
  }
}

export async function deleteWarehouse(id: number): Promise<void> {
  if (!baseURL) {
    console.error("API_BASE_URL is not defined.");
    throw new Error("API base URL is not configured.");
  }
  try {
    await apiService.delete(`/api/warehouses/${id}`);
  } catch (error) {
    console.error(`Error in deleteWarehouse for ID ${id}:`, error);
    throw error;
  }
}

// Shelf Service Functions

// Get all shelves for a specific warehouse
export async function getShelvesByWarehouse(
  warehouseId: number
): Promise<ShelfDto[]> {
  if (!baseURL) throw new Error("API base URL is not configured.");

  try {
    const response = await apiService.get<ShelfDto[]>(
      `/api/shelves?warehouseId=${warehouseId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error in getShelvesByWarehouse:", error);
    throw error;
  }
}

// Get a single shelf by its ID
export async function getShelfById(shelfId: number): Promise<ShelfDto | null> {
  try {
    const response = await apiService.get<ShelfDto>(`/api/shelves/${shelfId}`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      return null;
    }
    console.error(`Error in getShelfById for ID ${shelfId}:`, error);
    throw error;
  }
}

// Create a new shelf
export const createShelf = async (
  shelfData: CreateShelfDto
): Promise<ShelfDto> => {
  try {
    const response = await apiService.post<ShelfDto>("/api/shelves", shelfData);
    return response.data;
  } catch (error) {
    console.error("Error in createShelf:", error);
    throw error;
  }
};

// Update an existing shelf
export async function updateShelf(
  shelfId: number,
  shelfData: UpdateShelfDto
): Promise<void> {
  try {
    await apiService.put(`/api/shelves/${shelfId}`, shelfData);
  } catch (error) {
    console.error(`Error in updateShelf for ID ${shelfId}:`, error);
    throw error;
  }
}

// Delete a shelf
export async function deleteShelf(shelfId: number): Promise<void> {
  try {
    await apiService.delete(`/api/shelves/${shelfId}`);
  } catch (error) {
    console.error(`Error in deleteShelf for ID ${shelfId}:`, error);
    throw error;
  }
}

// Item Service Functions

// Get all items
export async function getItems(): Promise<ItemDto[]> {
  try {
    const response = await apiService.get<ItemDto[]>("/api/items");
    return response.data;
  } catch (error) {
    console.error("Error in getItems:", error);
    throw error;
  }
}

// Get a single item by its ID
export async function getItemById(itemId: number): Promise<ItemDto | null> {
  try {
    const response = await apiService.get<ItemDto>(`/api/items/${itemId}`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      return null;
    }
    console.error(`Error in getItemById for ID ${itemId}:`, error);
    throw error;
  }
}

// Create a new item
export async function createItem(itemData: CreateItemDto): Promise<ItemDto> {
  try {
    const response = await apiService.post<ItemDto>("/api/items", itemData);
    return response.data;
  } catch (error) {
    console.error("Error in createItem:", error);
    throw error;
  }
}

// Update an existing item
export async function updateItem(
  itemId: number,
  itemData: UpdateItemDto
): Promise<void> {
  try {
    await apiService.put(`/api/items/${itemId}`, itemData);
  } catch (error) {
    console.error(`Error in updateItem for ID ${itemId}:`, error);
    throw error;
  }
}

// Delete an item
export async function deleteItem(itemId: number): Promise<void> {
  try {
    await apiService.delete(`/api/items/${itemId}`);
  } catch (error) {
    console.error(`Error in deleteItem for ID ${itemId}:`, error);
    throw error;
  }
}

// Supplier Service Functions

// Get all suppliers
export async function getSuppliers(): Promise<SupplierDto[]> {
  try {
    const response = await apiService.get<SupplierDto[]>("/api/suppliers");
    return response.data;
  } catch (error) {
    console.error("Error in getSuppliers:", error);
    throw error;
  }
}

// Get a single supplier by ID
export async function getSupplierById(
  supplierId: number
): Promise<SupplierDto | null> {
  try {
    const response = await apiService.get<SupplierDto>(
      `/api/suppliers/${supplierId}`
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      return null;
    }
    console.error(`Error in getSupplierById for ID ${supplierId}:`, error);
    throw error;
  }
}

// Create a new supplier
export async function createSupplier(
  supplierData: CreateSupplierDto
): Promise<SupplierDto> {
  try {
    const response = await apiService.post<SupplierDto>(
      "/api/suppliers",
      supplierData
    );
    return response.data;
  } catch (error) {
    console.error("Error in createSupplier:", error);
    throw error;
  }
}

// Update an existing supplier
export async function updateSupplier(
  supplierId: number,
  supplierData: UpdateSupplierDto
): Promise<void> {
  try {
    await apiService.put(`/api/suppliers/${supplierId}`, supplierData);
  } catch (error) {
    console.error(`Error in updateSupplier for ID ${supplierId}:`, error);
    throw error;
  }
}

// Delete a supplier
export async function deleteSupplier(supplierId: number): Promise<void> {
  try {
    await apiService.delete(`/api/suppliers/${supplierId}`);
  } catch (error) {
    console.error(`Error in deleteSupplier for ID ${supplierId}:`, error);
    throw error;
  }
}

// Stock API functions
export const getStocks = async (): Promise<StockDto[]> => {
  try {
    const response = await apiService.get<StockDto[]>("/api/stocks");
    return response.data;
  } catch (error) {
    console.error("Error in getStocks:", error);
    throw error;
  }
};

export const createStock = async (data: CreateStockDto): Promise<StockDto> => {
  try {
    const response = await apiService.post<StockDto>("/api/stocks", data);
    return response.data;
  } catch (error) {
    console.error("Error in createStock:", error);
    throw error;
  }
};

export const updateStock = async (
  id: number,
  data: UpdateStockDto
): Promise<StockDto> => {
  try {
    await apiService.put(`/api/stocks/${id}/quantity`, {
      quantity: data.quantity,
    });
    return await getStockById(id);
  } catch (error) {
    console.error("Error in updateStock:", error);
    throw error;
  }
};

export const getStockById = async (id: number): Promise<StockDto> => {
  try {
    const response = await apiService.get<StockDto>(`/api/stocks/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error in getStockById:", error);
    throw error;
  }
};

export const deleteStock = async (id: number): Promise<void> => {
  try {
    await apiService.delete(`/api/stocks/${id}`);
  } catch (error) {
    console.error(`Error in deleteStock for ID ${id}:`, error);
    throw error;
  }
};

// Shelf API functions
export const getShelves = async (): Promise<ShelfDto[]> => {
  try {
    const response = await apiService.get<ShelfDto[]>("/api/shelves");
    return response.data;
  } catch (error) {
    console.error("Error in getShelves:", error);
    throw error;
  }
};

export const getShelf = async (id: number): Promise<ShelfDto> => {
  try {
    const response = await apiService.get<ShelfDto>(`/api/shelves/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error in getShelf for ID ${id}:`, error);
    throw error;
  }
};
