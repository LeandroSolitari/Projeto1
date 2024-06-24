using CustomerManagement.Models;
using Microsoft.EntityFrameworkCore;

namespace CustomerManagement.Data
{
    public class CustomerContext : DbContext
    {
        public CustomerContext(DbContextOptions<CustomerContext> options) : base(options)
        {
        }

        public DbSet<Customer> Customers { get; set; }

        // Outras entidades DbSet aqui...

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
                optionsBuilder.UseSqlite("Data Source=mydatabase.db");
            }
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Configurações do modelo aqui (opcional)
        }
    }
}
