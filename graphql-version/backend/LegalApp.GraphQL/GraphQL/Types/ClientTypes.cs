using Microsoft.EntityFrameworkCore;
using LegalApp.GraphQL.Data;
using LegalApp.GraphQL.Models;
using HotChocolate;
using HotChocolate.Types;

namespace LegalApp.GraphQL.GraphQL.Types
{
    public class ClientType : ObjectType<Client>
    {
        protected override void Configure(IObjectTypeDescriptor<Client> descriptor)
        {
            descriptor.Field(c => c.Id).Type<NonNullType<IntType>>();
            descriptor.Field(c => c.Name).Type<NonNullType<StringType>>();
            descriptor.Field(c => c.Email).Type<NonNullType<StringType>>();
            descriptor.Field(c => c.CompanyName).Type<StringType>();
            descriptor.Field(c => c.CreatedAt).Type<NonNullType<DateTimeType>>();
            descriptor.Field(c => c.IsActive).Type<NonNullType<BooleanType>>();
            
            // relation to cases object
            descriptor.Field("cases")
                .ResolveWith<ClientResolvers>(r => r.GetCasesAsync(default!, default!))
                .Type<ListType<CaseType>>();
        }
    }

    public class ClientResolvers
    {
        public async Task<IEnumerable<Case>> GetCasesAsync(
            [Parent] Client client,
            [Service] AppDbContext context)
        {
            return await context.Cases
                .Where(c => c.ClientId == client.Id)
                .ToListAsync();
        }
    }
}