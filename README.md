# Warehouse Management System

A full-stack warehouse management system built with .NET Core and Next.js, featuring real-time inventory tracking, supplier management, and user authentication.

## Features

- 🔐 **Authentication & Authorization**
  - User registration and login
  - Role-based access control (SuperAdmin, Manager, Logistic)
  - JWT token-based authentication

- 🏭 **Warehouse Management**
  - Create and manage warehouses
  - Track warehouse capacity and location
  - View warehouse statistics

- 📦 **Inventory Management**
  - Track items and stock levels
  - Manage shelves and storage locations
  - Real-time stock updates
  - Low stock alerts

- 👥 **Supplier Management**
  - Manage supplier information
  - Track supplier items
  - Supplier performance metrics


## Tech Stack

### Backend
- .NET Core 8.0
- Entity Framework Core
- PostgreSQL
- JWT Authentication

### Frontend
- Next.js 14
- TypeScript
- Tailwind CSS
- Axios for API calls
- React Query for data fetching

## Prerequisites

- .NET Core 8.0 SDK
- Node.js 18+ and npm
- PostgreSQL
- Visual Studio 2022 or VS Code
- Git

## Getting Started

### Backend Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/ahmedafe1/Warehouse.git
   cd Warehouse
   ```

2. Navigate to the backend directory:
   ```bash
   cd WarehouseManagementSystem.Api
   ```

3. Update the connection string in `appsettings.json`:
   ```json
   "ConnectionStrings": {
     "DefaultConnection": "Server=your_server;Database=WarehouseDB;Trusted_Connection=True;"
   }
   ```

4. Run database migrations:
   ```bash
   dotnet ef database update
   ```

5. Start the backend server:
   ```bash
   dotnet run
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env.local` file:
   ```
   NEXT_PUBLIC_API_URL=http://localhost:5000
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

   "Defaults user

   "Email": "superadmin@example.com",
   "Username": "superadmin",
   "Password": "SuperAdminP@ssw0rd!"

Important only SuperAdmin can access users management page

## Project Structure

```
Warehouse/
├── WarehouseManagementSystem.Api/     # Backend API
│   ├── Controllers/                   # API Controllers
│   ├── Data/                         # Database Context & Repositories
│   ├── Dtos/                         # Data Transfer Objects
│   ├── Models/                       # Entity Models
│   └── Services/                     # Business Logic
│
├── frontend/                         # Next.js Frontend
│   ├── src/
│   │   ├── app/                     # Next.js App Router
│   │   ├── components/              # React Components
│   │   ├── services/                # API Services
│   │   └── types/                   # TypeScript Types
│   └── public/                      # Static Assets
│
└── README.md
```

## API Documentation


## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, email ahmedafe1@gmail.com or create an issue in the repository. 