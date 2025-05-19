using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;
using WarehouseManagementSystem.Api.Dtos;
using WarehouseManagementSystem.Api.Models;

namespace WarehouseManagementSystem.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "SuperAdmin")]
    public class UserController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly ILogger<UserController> _logger;

        public UserController(
            UserManager<ApplicationUser> userManager,
            RoleManager<IdentityRole> roleManager,
            ILogger<UserController> logger)
        {
            _userManager = userManager;
            _roleManager = roleManager;
            _logger = logger;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<UserDto>>> GetUsers()
        {
            var users = _userManager.Users.ToList();
            var userDtos = new List<UserDto>();

            foreach (var user in users)
            {
                var roles = await _userManager.GetRolesAsync(user);
                userDtos.Add(new UserDto
                {
                    Id = user.Id,
                    Username = user.UserName ?? string.Empty,
                    Email = user.Email ?? string.Empty,
                    Role = roles.FirstOrDefault() ?? string.Empty
                });
            }

            return Ok(userDtos);
        }

        [HttpPost]
        public async Task<ActionResult<UserDto>> CreateUser([FromBody] CreateUserDto createUserDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var userExists = await _userManager.FindByEmailAsync(createUserDto.Email);
            if (userExists != null)
            {
                return Conflict(new { Message = "User with this email already exists." });
            }

            userExists = await _userManager.FindByNameAsync(createUserDto.Username);
            if (userExists != null)
            {
                return Conflict(new { Message = "Username already taken." });
            }

            var newUser = new ApplicationUser
            {
                Email = createUserDto.Email,
                UserName = createUserDto.Username,
                SecurityStamp = Guid.NewGuid().ToString()
            };

            var result = await _userManager.CreateAsync(newUser, createUserDto.Password);
            if (!result.Succeeded)
            {
                return BadRequest(new { Message = "User creation failed.", Errors = result.Errors });
            }

            // Add role
            if (await _roleManager.RoleExistsAsync(createUserDto.Role))
            {
                await _userManager.AddToRoleAsync(newUser, createUserDto.Role);
            }
            else
            {
                await _userManager.DeleteAsync(newUser);
                return BadRequest(new { Message = $"Role '{createUserDto.Role}' does not exist." });
            }

            var role = (await _userManager.GetRolesAsync(newUser)).FirstOrDefault() ?? string.Empty;
            return Ok(new UserDto
            {
                Id = newUser.Id,
                Username = newUser.UserName ?? string.Empty,
                Email = newUser.Email ?? string.Empty,
                Role = role
            });
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<UserDto>> UpdateUser(string id, [FromBody] UpdateUserDto updateUserDto)
        {
            var user = await _userManager.FindByIdAsync(id);
            if (user == null)
            {
                return NotFound(new { Message = "User not found." });
            }

            if (!string.IsNullOrEmpty(updateUserDto.Email) && updateUserDto.Email != user.Email)
            {
                var emailExists = await _userManager.FindByEmailAsync(updateUserDto.Email);
                if (emailExists != null)
                {
                    return Conflict(new { Message = "Email already in use." });
                }
                user.Email = updateUserDto.Email;
            }

            if (!string.IsNullOrEmpty(updateUserDto.Username) && updateUserDto.Username != user.UserName)
            {
                var usernameExists = await _userManager.FindByNameAsync(updateUserDto.Username);
                if (usernameExists != null)
                {
                    return Conflict(new { Message = "Username already taken." });
                }
                user.UserName = updateUserDto.Username;
            }

            var result = await _userManager.UpdateAsync(user);
            if (!result.Succeeded)
            {
                return BadRequest(new { Message = "User update failed.", Errors = result.Errors });
            }

            if (!string.IsNullOrEmpty(updateUserDto.Password))
            {
                var token = await _userManager.GeneratePasswordResetTokenAsync(user);
                result = await _userManager.ResetPasswordAsync(user, token, updateUserDto.Password);
                if (!result.Succeeded)
                {
                    return BadRequest(new { Message = "Password update failed.", Errors = result.Errors });
                }
            }

            if (!string.IsNullOrEmpty(updateUserDto.Role))
            {
                if (!await _roleManager.RoleExistsAsync(updateUserDto.Role))
                {
                    return BadRequest(new { Message = $"Role '{updateUserDto.Role}' does not exist." });
                }

                var currentRoles = await _userManager.GetRolesAsync(user);
                await _userManager.RemoveFromRolesAsync(user, currentRoles);
                await _userManager.AddToRoleAsync(user, updateUserDto.Role);
            }

            var role = (await _userManager.GetRolesAsync(user)).FirstOrDefault() ?? string.Empty;
            return Ok(new UserDto
            {
                Id = user.Id,
                Username = user.UserName ?? string.Empty,
                Email = user.Email ?? string.Empty,
                Role = role
            });
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteUser(string id)
        {
            var user = await _userManager.FindByIdAsync(id);
            if (user == null)
            {
                return NotFound(new { Message = "User not found." });
            }

            var result = await _userManager.DeleteAsync(user);
            if (!result.Succeeded)
            {
                return BadRequest(new { Message = "User deletion failed.", Errors = result.Errors });
            }

            return Ok(new { Message = "User deleted successfully." });
        }
    }
} 