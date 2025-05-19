using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using WarehouseManagementSystem.Api.Dtos;
using WarehouseManagementSystem.Api.Models;

namespace WarehouseManagementSystem.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly SignInManager<ApplicationUser> _signInManager;
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly IConfiguration _configuration;
        private readonly ILogger<AuthController> _logger;

        public AuthController(
            UserManager<ApplicationUser> userManager,
            SignInManager<ApplicationUser> signInManager,
            RoleManager<IdentityRole> roleManager,
            IConfiguration configuration,
            ILogger<AuthController> logger)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _roleManager = roleManager;
            _configuration = configuration;
            _logger = logger;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterDto registerDto)
        {
            _logger.LogInformation("Registration attempt for {Email}", registerDto.Email);
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var userExists = await _userManager.FindByEmailAsync(registerDto.Email);
            if (userExists != null)
            {
                _logger.LogWarning("User with email {Email} already exists.", registerDto.Email);
                return Conflict(new AuthResponseDto { Message = "User with this email already exists." });
            }

            userExists = await _userManager.FindByNameAsync(registerDto.Username);
            if (userExists != null)
            {
                _logger.LogWarning("User with username {Username} already exists.", registerDto.Username);
                return Conflict(new AuthResponseDto { Message = "Username already taken." });
            }

            var newUser = new ApplicationUser
            {
                Email = registerDto.Email,
                UserName = registerDto.Username,
                SecurityStamp = Guid.NewGuid().ToString()
            };

            var result = await _userManager.CreateAsync(newUser, registerDto.Password);

            if (!result.Succeeded)
            {
                _logger.LogError("User creation failed for {Email}: {Errors}", registerDto.Email, string.Join(", ", result.Errors.Select(e => e.Description)));
                return BadRequest(new AuthResponseDto { Message = "User creation failed.", User = null });
            }

            string defaultRole = "Logistic"; 
            if (!await _roleManager.RoleExistsAsync(defaultRole))
            {
                await _roleManager.CreateAsync(new IdentityRole(defaultRole));
                 _logger.LogInformation("Role {DefaultRole} created.", defaultRole);
            }
            await _userManager.AddToRoleAsync(newUser, defaultRole);
            _logger.LogInformation("User {Email} registered successfully and assigned to role {DefaultRole}", registerDto.Email, defaultRole);

            var tokenDetails = GenerateJwtToken(newUser, new List<string> { defaultRole });

            var userDto = new UserDto
            {
                Id = newUser.Id,
                Username = newUser.UserName ?? string.Empty,
                Email = newUser.Email ?? string.Empty,
                Role = defaultRole
            };

            return Ok(new AuthResponseDto
            {
                Message = "User registered successfully!",
                Token = tokenDetails.Token,
                Expiration = tokenDetails.Expiration,
                User = userDto
            });
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto loginDto)
        {
            _logger.LogInformation("Login attempt for {Username}", loginDto.Username);
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var user = await _userManager.FindByNameAsync(loginDto.Username);
            if (user == null || !await _userManager.CheckPasswordAsync(user, loginDto.Password))
            {
                _logger.LogWarning("Invalid login attempt for {Username}", loginDto.Username);
                return Unauthorized(new AuthResponseDto { Message = "Invalid username or password." });
            }

            var userRoles = await _userManager.GetRolesAsync(user);
            var tokenDetails = GenerateJwtToken(user, userRoles);
            _logger.LogInformation("User {Username} logged in successfully.", loginDto.Username);

            var userDto = new UserDto
            {
                Id = user.Id,
                Username = user.UserName ?? string.Empty,
                Email = user.Email ?? string.Empty,
                Role = userRoles.FirstOrDefault() ?? string.Empty
            };

            return Ok(new AuthResponseDto
            {
                Message = "Login successful!",
                Token = tokenDetails.Token,
                Expiration = tokenDetails.Expiration,
                User = userDto
            });
        }

        private (string Token, DateTime Expiration) GenerateJwtToken(ApplicationUser user, IList<string> roles)
        {
            var jwtSecret = _configuration["JWT:Secret"];
            var jwtIssuer = _configuration["JWT:ValidIssuer"];
            var jwtAudience = _configuration["JWT:ValidAudience"];

            if (string.IsNullOrEmpty(jwtSecret) || string.IsNullOrEmpty(jwtIssuer) || string.IsNullOrEmpty(jwtAudience))
            {
                _logger.LogError("JWT configuration (Secret, Issuer, or Audience) is missing or empty.");
                throw new InvalidOperationException("JWT configuration is missing or invalid. Cannot generate token.");
            }

            var authClaims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id),
                new Claim(JwtRegisteredClaimNames.Sub, user.UserName ?? string.Empty),
                new Claim(JwtRegisteredClaimNames.Email, user.Email ?? string.Empty),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
            };

            foreach (var role in roles)
            {
                authClaims.Add(new Claim(ClaimTypes.Role, role));
            }

            var authSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSecret));
            var tokenValidityInMinutes = _configuration.GetValue<int>("JWT:TokenValidityInMinutes", 120);

            var token = new JwtSecurityToken(
                issuer: jwtIssuer,
                audience: jwtAudience,
                expires: DateTime.Now.AddMinutes(tokenValidityInMinutes),
                claims: authClaims,
                signingCredentials: new SigningCredentials(authSigningKey, SecurityAlgorithms.HmacSha256)
            );

            return (new JwtSecurityTokenHandler().WriteToken(token), token.ValidTo);
        }
    }
} 