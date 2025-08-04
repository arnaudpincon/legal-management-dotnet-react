using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using LegalApp.API.Data;
using LegalApp.API.Models;

namespace LegalApp.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class ClientsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ClientsController(AppDbContext context)
        {
            _context = context;
        }

        // READ all clients
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Client>>> GetClients()
        {
            return await _context.Clients.Where(c => c.IsActive).ToListAsync();
        }

        // READ client by ID
        [HttpGet("{id}")]
        public async Task<ActionResult<Client>> GetClient(int id)
        {
            var client = await _context.Clients.FindAsync(id);
            
            if (client == null || !client.IsActive)
                return NotFound();
                
            return client;
        }

        // CREATE client
        [HttpPost]
        public async Task<ActionResult<Client>> CreateClient(CreateClientRequest request)
        {
            // Validation
            if (string.IsNullOrEmpty(request.Name) || string.IsNullOrEmpty(request.Email))
                return BadRequest("Name and email are required");

            if (await _context.Clients.AnyAsync(c => c.Email == request.Email && c.IsActive))
                return BadRequest("This email is already in use");

            var client = new Client
            {
                Name = request.Name,
                Email = request.Email,
                CompanyName = request.CompanyName,
                CreatedAt = DateTime.UtcNow,
                IsActive = true
            };

            _context.Clients.Add(client);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetClient), new { id = client.Id }, client);
        }

        // UPDATE client
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateClient(int id, UpdateClientRequest request)
        {
            var client = await _context.Clients.FindAsync(id);
            
            if (client == null || !client.IsActive)
                return NotFound();

            // Validation
            if (string.IsNullOrEmpty(request.Name) || string.IsNullOrEmpty(request.Email))
                return BadRequest("Nom et email obligatoires");

            if (await _context.Clients.AnyAsync(c => c.Email == request.Email && c.Id != id && c.IsActive))
                return BadRequest("This email is already in use");

            // Update client details
            client.Name = request.Name;
            client.Email = request.Email;
            client.CompanyName = request.CompanyName;

            await _context.SaveChangesAsync();
            
            return Ok(client);
        }

        // Deactivate client
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteClient(int id)
        {
            var client = await _context.Clients.FindAsync(id);
            
            if (client == null || !client.IsActive)
                return NotFound();

            // the client is inactive 5not deleted
            client.IsActive = false;
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // READ client's cases
        [HttpGet("{id}/cases")]
        public async Task<ActionResult<IEnumerable<Case>>> GetClientCases(int id)
        {
            var client = await _context.Clients.FindAsync(id);
            if (client == null || !client.IsActive)
                return NotFound();

            return await _context.Cases
                .Where(c => c.ClientId == id)
                .Include(c => c.Client)
                .ToListAsync();
        }
    }
}