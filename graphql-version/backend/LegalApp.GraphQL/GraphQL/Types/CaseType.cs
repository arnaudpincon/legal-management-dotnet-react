using Microsoft.EntityFrameworkCore;
using LegalApp.GraphQL.Data;
using LegalApp.GraphQL.Models;
using HotChocolate;
using HotChocolate.Types;

namespace LegalApp.GraphQL.GraphQL.Types
{
    public class CaseType : ObjectType<Case>
    {
        protected override void Configure(IObjectTypeDescriptor<Case> descriptor)
        {
            descriptor.Field(c => c.Id).Type<NonNullType<IntType>>();
            descriptor.Field(c => c.Title).Type<NonNullType<StringType>>();
            descriptor.Field(c => c.Description).Type<StringType>();
            descriptor.Field(c => c.ClientId).Type<NonNullType<IntType>>();
            descriptor.Field(c => c.Status).Type<NonNullType<StringType>>();
            descriptor.Field(c => c.CreatedAt).Type<NonNullType<DateTimeType>>();
            
            // Relation to client object
            descriptor.Field("client")
                .ResolveWith<CaseResolvers>(r => r.GetClientAsync(default!, default!))
                .Type<ClientType>();
        }
    }

    public class CaseResolvers
    {
        public async Task<Client?> GetClientAsync(
            [Parent] Case case_,
            [Service] AppDbContext context)
        {
            return await context.Clients.FindAsync(case_.ClientId);
        }
    }
}