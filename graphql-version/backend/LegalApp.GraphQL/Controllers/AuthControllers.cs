using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using LegalApp.GraphQL.Data;
using LegalApp.GraphQL.Models;

namespace LegalApp.GraphQL.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IConfiguration _configuration;

        public AuthController(AppDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        [HttpPost("login")]
        public async Task<ActionResult<LoginResponse>> Login(LoginRequest request)
        {
            // Find user
            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Username == request.Username && u.IsActive);

            if (user == null)
                return Unauthorized("This user dos not exist or is inactive");

            // Check pqssword
            if (!BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
                return Unauthorized("Incorrect password");

            var token = GenerateJwtToken(user);

            return Ok(new LoginResponse
            {
                Token = token,
                Username = user.Username,
                Role = user.Role
            });
        }

        private string GenerateJwtToken(User user)
        {
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes("SuperSecretKeyForJWTAuthentication123456789!@#$%^&*()"));
            var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Name, user.Username),
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.Role, user.Role)
            };

            var token = new JwtSecurityToken(
                issuer: "LegalApp",
                audience: "LegalApp",
                claims: claims,
                expires: DateTime.Now.AddHours(24),
                signingCredentials: credentials
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        [HttpPost("register")]
        public async Task<ActionResult<LoginResponse>> Register(RegisterRequest request)
        {
            if (await _context.Users.AnyAsync(u => u.Username == request.Username))
                return BadRequest("Username already exists");

            // Create new user
            var user = new User
            {
                Username = request.Username,
                Email = request.Email,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password),
                Role = "User"
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            var token = GenerateJwtToken(user);

            return Ok(new LoginResponse
            {
                Token = token,
                Username = user.Username,
                Role = user.Role
            });
        }
    }
}