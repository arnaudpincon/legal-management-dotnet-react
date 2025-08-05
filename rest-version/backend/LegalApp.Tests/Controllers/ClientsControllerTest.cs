using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using FluentAssertions;
using LegalApp.API.Controllers;
using LegalApp.API.Data;
using LegalApp.API.Models;

namespace LegalApp.Tests.Controllers
{
    public class ClientsControllerTests : IDisposable
    {
        private readonly AppDbContext _context;
        private readonly ClientsController _controller;

        public ClientsControllerTests()
        {
            var options = new DbContextOptionsBuilder<AppDbContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;

            _context = new AppDbContext(options);
            _controller = new ClientsController(_context);

            SeedTestData();
        }

        private void SeedTestData()
        {
            var clients = new List<Client>
            {
                new Client { Id = 1, Name = "Test Client 1", Email = "test1@example.com", CompanyName = "Test Company 1", IsActive = true },
                new Client { Id = 2, Name = "Test Client 2", Email = "test2@example.com", CompanyName = "Test Company 2", IsActive = true },
                new Client { Id = 3, Name = "Deleted Client", Email = "deleted@example.com", CompanyName = "Deleted Company", IsActive = false }
            };

            _context.Clients.AddRange(clients);
            _context.SaveChanges();
        }

        [Fact]
        public async Task GetClients_ShouldReturnOnlyActiveClients()
        {
            // Arrange - Setup test data (already done in constructor)
            // Act - Execute the method under test
            var result = await _controller.GetClients();

            var actionResult = result.Result as OkObjectResult;
            actionResult.Should().NotBeNull();
            
            // Assert - Verify the result
            var clients = actionResult!.Value as IEnumerable<Client>;
            clients.Should().NotBeNull();
            clients!.Count().Should().Be(2);
            clients.All(c => c.IsActive).Should().BeTrue();
        }

        [Fact]
        public async Task GetClient_WithValidId_ShouldReturnClient()
        {
            var result = await _controller.GetClient(1);

            var actionResult = result.Result as OkObjectResult;
            actionResult.Should().NotBeNull();
            
            var client = actionResult!.Value as Client;
            client.Should().NotBeNull();
            client!.Id.Should().Be(1);
            client.Name.Should().Be("Test Client 1");
        }
        [Fact]
        public async Task GetClient_WithInvalidId_ShouldReturnNotFound()
        {
            var result = await _controller.GetClient(999);

            result.Result.Should().BeOfType<NotFoundResult>();
        }

        [Fact]
        public async Task GetClient_WithInactiveClient_ShouldReturnNotFound()
        {
            var result = await _controller.GetClient(3);

            result.Result.Should().BeOfType<NotFoundResult>();
        }

        [Fact]
        public async Task CreateClient_WithValidData_ShouldCreateClient()
        {
            var request = new CreateClientRequest
            {
                Name = "New Client",
                Email = "new@example.com",
                CompanyName = "New Company"
            };

            var result = await _controller.CreateClient(request);

            result.Should().NotBeNull();
            var actionResult = result.Result as CreatedAtActionResult;
            actionResult.Should().NotBeNull();
            
            var client = actionResult!.Value as Client;
            client.Should().NotBeNull();
            client!.Name.Should().Be("New Client");
            client.Email.Should().Be("new@example.com");
            client.IsActive.Should().BeTrue();

            var savedClient = await _context.Clients.FindAsync(client.Id);
            savedClient.Should().NotBeNull();
            savedClient!.Name.Should().Be("New Client");
        }

        [Fact]
        public async Task CreateClient_WithDuplicateEmail_ShouldReturnBadRequest()
        {
            var request = new CreateClientRequest
            {
                Name = "Duplicate Client",
                Email = "test1@example.com",
                CompanyName = "Duplicate Company"
            };

            var result = await _controller.CreateClient(request);

            result.Result.Should().BeOfType<BadRequestObjectResult>();
        }

        [Fact]
        public async Task CreateClient_WithEmptyName_ShouldReturnBadRequest()
        {
            var request = new CreateClientRequest
            {
                Name = "",
                Email = "empty@example.com",
                CompanyName = "Empty Company"
            };

            var result = await _controller.CreateClient(request);

            result.Result.Should().BeOfType<BadRequestObjectResult>();
        }

        [Fact]
        public async Task UpdateClient_WithValidData_ShouldUpdateClient()
        {
            var request = new UpdateClientRequest
            {
                Name = "Updated Client",
                Email = "updated@example.com",
                CompanyName = "Updated Company"
            };

            var result = await _controller.UpdateClient(1, request);

            result.Should().BeOfType<OkObjectResult>();
            
            var updatedClient = await _context.Clients.FindAsync(1);
            updatedClient.Should().NotBeNull();
            updatedClient!.Name.Should().Be("Updated Client");
            updatedClient.Email.Should().Be("updated@example.com");
        }

        [Fact]
        public async Task DeleteClient_WithValidId_ShouldSoftDeleteClient()
        {
            var result = await _controller.DeleteClient(1);

            result.Should().BeOfType<NoContentResult>();
            
            var deletedClient = await _context.Clients.FindAsync(1);
            deletedClient.Should().NotBeNull();
            deletedClient!.IsActive.Should().BeFalse();
        }

        [Fact]
        public async Task DeleteClient_WithInvalidId_ShouldReturnNotFound()
        {
            var result = await _controller.DeleteClient(999);

            result.Should().BeOfType<NotFoundResult>();
        }

        public void Dispose()
        {
            _context.Dispose();
        }
    }
}