namespace WarehouseManagementSystem.Api.Models
{
    public static class UserRole
    {
        public const string Logistic = "Logistic";
        public const string Manager = "Manager";
        public const string SuperAdmin = "SuperAdmin";

        public static readonly string[] AllRoles = new[] { Logistic, Manager, SuperAdmin };
    }
} 