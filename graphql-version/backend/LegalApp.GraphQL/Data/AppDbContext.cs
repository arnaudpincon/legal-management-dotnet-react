using Microsoft.EntityFrameworkCore;
using LegalApp.GraphQL.Models;

namespace LegalApp.GraphQL.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<Client> Clients { get; set; }
        public DbSet<Case> Cases { get; set; }
        public DbSet<User> Users { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Client data samples
            modelBuilder.Entity<Client>().HasData(
                new Client { Id = 1, Name = "Jean Dupont", Email = "jean@example.com", CompanyName = "Dupont SARL" },
                new Client { Id = 2, Name = "Marie Martin", Email = "marie@example.com", CompanyName = "Martin & Co" }
            );

            modelBuilder.Entity<Case>().HasData(
                new Case { Id = 1, Title = "Contrat commercial", Description = "Révision contrat", ClientId = 1, Status = "In Progress" },
                new Case { Id = 2, Title = "Litige employé", Description = "Rupture conventionnelle", ClientId = 2, Status = "Open" }
            );

            // user data samples
            modelBuilder.Entity<User>().HasData(
                new User 
                { 
                    Id = 1, 
                    Username = "admin", 
                    Email = "admin@legal.com",
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword("password123"),
                    Role = "Admin"
                },
                new User 
                { 
                    Id = 2, 
                    Username = "lawyer", 
                    Email = "lawyer@legal.com",
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword("lawyer123"),
                    Role = "Lawyer"
                }
            );
        }
    }
}