using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PsicologiaIAAPI.Data;
using PsicologiaIAAPI.Models;

namespace PsicologiaIA.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public UserController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpPost]
        public async Task<IActionResult> CreateUser([FromBody] User user)
        {
            var exists = await _context.Users.AnyAsync(u => u.Email == user.Email);
            if (exists) return BadRequest("El correo electrónico ya está registrado.");

            user.CreatedAt = DateTime.UtcNow;

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Usuario creado con éxito", user });
        }

        [HttpPost("psychologist")]
        public async Task<IActionResult> CreatePsychologist([FromBody] Psychologist psychologist)
        {
            psychologist.CreatedAt = DateTime.UtcNow;

            _context.Psychologists.Add(psychologist);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Psicólogo registrado con éxito", psychologist });
        }

        [HttpPut("psychologist/{id}/availability")]
        public async Task<IActionResult> ToggleAvailability(int id, [FromBody] bool isAvailable)
        {
            var psycho = await _context.Psychologists.FindAsync(id);
            if (psycho == null) return NotFound("Psicólogo no encontrado");

            psycho.IsAvailableForImmediate = isAvailable;
            await _context.SaveChangesAsync();

            return Ok(new { message = $"Disponibilidad actualizada a: {isAvailable}", psychologist = psycho });
        }
    }
}