using Microsoft.EntityFrameworkCore;
using LegalApp.GraphQL.Data;
using LegalApp.GraphQL.Models;
using LegalApp.GraphQL.GraphQL.Types.InputTypes;
using HotChocolate.Authorization;
using HotChocolate.Types;

namespace LegalApp.GraphQL.GraphQL.Mutations
{
    public class LegalAppMutation
    {
        // Create new client
        [Authorize]
        public async Task<Client> CreateClientAsync(
            CreateClientInput input,
            [Service] AppDbContext context)
        {
            // Validation
            if (string.IsNullOrEmpty(input.Name) || string.IsNullOrEmpty(input.Email))
                throw new GraphQLException("Name and email are required");

            if (await context.Clients.AnyAsync(c => c.Email == input.Email && c.IsActive))
                throw new GraphQLException("This email is already in use");

            var client = new Client
            {
                Name = input.Name,
                Email = input.Email,
                CompanyName = input.CompanyName,
                CreatedAt = DateTime.UtcNow,
                IsActive = true
            };

            context.Clients.Add(client);
            await context.SaveChangesAsync();

            return client;
        }

        // Update client
        [Authorize]
        public async Task<Client> UpdateClientAsync(
            UpdateClientInput input,
            [Service] AppDbContext context)
        {
            var client = await context.Clients.FindAsync(input.Id);
            
            if (client == null || !client.IsActive)
                throw new GraphQLException("Client not found");

            // Validation
            if (string.IsNullOrEmpty(input.Name) || string.IsNullOrEmpty(input.Email))
                throw new GraphQLException("Name and email are required");

            if (await context.Clients.AnyAsync(c => c.Email == input.Email && c.Id != input.Id && c.IsActive))
                throw new GraphQLException("This email is already in use");

            // Update props
            client.Name = input.Name;
            client.Email = input.Email;
            client.CompanyName = input.CompanyName;

            await context.SaveChangesAsync();
            
            return client;
        }

        // Deactivate client
        [Authorize]
        public async Task<bool> DeleteClientAsync(
            int id,
            [Service] AppDbContext context)
        {
            var client = await context.Clients.FindAsync(id);
            
            if (client == null || !client.IsActive)
                throw new GraphQLException("Client not found");

            client.IsActive = false;
            await context.SaveChangesAsync();

            return true;
        }

        // Restore an inactive client
        [Authorize]
        public async Task<Client> RestoreClientAsync(
            int id,
            [Service] AppDbContext context)
        {
            var client = await context.Clients.FindAsync(id);
            
            if (client == null)
                throw new GraphQLException("Client not found");

            client.IsActive = true;
            await context.SaveChangesAsync();

            return client;
        }
    }
}