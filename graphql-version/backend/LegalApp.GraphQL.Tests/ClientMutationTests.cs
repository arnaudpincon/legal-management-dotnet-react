using Microsoft.EntityFrameworkCore;
using FluentAssertions;
using LegalApp.GraphQL.Data;
using LegalApp.GraphQL.Models;
using LegalApp.GraphQL.GraphQL.Mutations;
using LegalApp.GraphQL.GraphQL.Queries;
using LegalApp.GraphQL.GraphQL.Types.InputTypes;
using HotChocolate;

namespace LegalApp.GraphQL.Tests;

public class ClientMutationTests : IDisposable
{
    private readonly AppDbContext _context;

    public ClientMutationTests()
    {
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;

        _context = new AppDbContext(options);
        _context.Database.EnsureCreated();
    }

    [Fact]
    public async Task CreateClient_ShouldWork()
    {
        // Arrange
        var mutation = new LegalAppMutation();
        var input = new CreateClientInput
        {
            Name = "Test Client",
            Email = "test@example.com",
            CompanyName = "Test Co"
        };

        // Act
        var result = await mutation.CreateClientAsync(input, _context);

        // Assert
        result.Name.Should().Be("Test Client");
        result.Email.Should().Be("test@example.com");
    }

    [Fact]
    public async Task CreateClient_WithEmptyName_ShouldFail()
    {
        var mutation = new LegalAppMutation();
        var input = new CreateClientInput
        {
            Name = "",
            Email = "test@example.com",
            CompanyName = "Test Co"
        };

        await Assert.ThrowsAsync<GraphQLException>(() => 
            mutation.CreateClientAsync(input, _context));
    }

    [Fact]
    public void GetClients_ShouldReturnActiveClients()
    {
        var query = new LegalAppQuery();

        var result = query.GetClients(_context).ToList();

        result.Should().HaveCount(2);
        result.All(c => c.IsActive).Should().BeTrue();
    }

    [Fact]
    public async Task UpdateClient_ShouldWork()
    {
        var mutation = new LegalAppMutation();
        var input = new UpdateClientInput
        {
            Id = 1,
            Name = "Updated Client",
            Email = "updated@example.com",
            CompanyName = "Updated Co"
        };

        var result = await mutation.UpdateClientAsync(input, _context);

        result.Name.Should().Be("Updated Client");
        result.Email.Should().Be("updated@example.com");
    }

    [Fact]
    public async Task DeleteClient_ShouldDeactivate()
    {
        var mutation = new LegalAppMutation();
        var result = await mutation.DeleteClientAsync(1, _context);

        result.Should().BeTrue();
        
        var client = await _context.Clients.FindAsync(1);
        client!.IsActive.Should().BeFalse();
    }

    public void Dispose()
    {
        _context.Dispose();
    }
}