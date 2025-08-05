using Microsoft.EntityFrameworkCore;
using LegalApp.GraphQL.Data;
using LegalApp.GraphQL.Models;
using HotChocolate.Authorization;
using HotChocolate.Data;
using HotChocolate.Types;

namespace LegalApp.GraphQL.GraphQL.Queries
{
    public class LegalAppQuery
    {
        // Get active clients
        [UseProjection]
        [UseFiltering]
        [UseSorting]
        public IQueryable<Client> GetClients([Service] AppDbContext context)
        {
            return context.Clients.Where(c => c.IsActive);
        }

        // Get client by ID
        public async Task<Client?> GetClientAsync(
            int id,
            [Service] AppDbContext context)
        {
            return await context.Clients
                .Where(c => c.Id == id && c.IsActive)
                .FirstOrDefaultAsync();
        }

        // Get all cases
        [UseProjection]
        [UseFiltering]
        [UseSorting]
        public IQueryable<Case> GetCases([Service] AppDbContext context)
        {
            return context.Cases.Include(c => c.Client);
        }

        // Get case by ID client
        public async Task<IEnumerable<Case>> GetClientCasesAsync(
            int clientId,
            [Service] AppDbContext context)
        {
            return await context.Cases
                .Where(c => c.ClientId == clientId)
                .Include(c => c.Client)
                .ToListAsync();
        }

        // Search clients by name, email, or company name
        public async Task<IEnumerable<Client>> SearchClientsAsync(
            string searchTerm,
            [Service] AppDbContext context)
        {
            return await context.Clients
                .Where(c => c.IsActive && 
                    (c.Name.Contains(searchTerm) || 
                     c.Email.Contains(searchTerm) ||
                     c.CompanyName.Contains(searchTerm)))
                .ToListAsync();
        }
    }
}