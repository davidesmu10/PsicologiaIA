using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PsicologiaIAAPI.Data;
using PsicologiaIAAPI.Models;

namespace PsicologiaIA.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AppointmentController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public AppointmentController(ApplicationDbContext context)
        {
            _context = context;
        }

        // 1. AGENDAR CITA PROGRAMADA
        [HttpPost("schedule")]
        public async Task<IActionResult> ScheduleAppointment([FromBody] CreateAppointmentDto dto)
        {
            try
            {
                var appointment = new Appointment
                {
                    UserId = dto.UserId,
                    PsychologistId = dto.PsychologistId, 
                    AppointmentDate = dto.AppointmentDate,
                    IsImmediate = false,
                    Status = "Pending"
                };

                _context.Appointments.Add(appointment);
                await _context.SaveChangesAsync(); 

                return Ok(new { message = "Cita programada con éxito", appointment });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    message = "Error interno",
                    detalle = ex.InnerException?.Message ?? ex.Message
                });
            }
        }



        [HttpPost("immediate/{userId}")]
        public async Task<IActionResult> RequestImmediateAppointment(int userId)
        {
            // Buscar si hay algún psicólogo libre en este momento
            var availablePsychologist = await _context.Psychologists
                .FirstOrDefaultAsync(p => p.IsAvailableForImmediate == true);

            var appointment = new Appointment
            {
                UserId = userId,
                AppointmentDate = DateTime.UtcNow,
                IsImmediate = true,
                Status = availablePsychologist != null ? "Active" : "Pending", 
                PsychologistId = availablePsychologist?.Id 
            };

            _context.Appointments.Add(appointment);
            await _context.SaveChangesAsync();

            if (availablePsychologist == null)
            {
                return Ok(new
                {
                    status = "En Espera",
                    message = "No hay profesionales disponibles ya mismo, pero tu solicitud quedó en cola prioritaria.",
                    appointmentId = appointment.Id
                });
            }

            return Ok(new
            {
                status = "Asignada",
                message = $"Cita de inmediato asignada con el Dr(a). {availablePsychologist.FullName}",
                appointment
            });
        }


        [HttpGet("professionals")]
        public async Task<IActionResult> GetProfessionals()
        {
            try
            {
                // Traemos los psicólogos directamente de tu tabla Psychologists
                var psychologists = await _context.Psychologists
                    .Select(p => new
                    {
                        p.Id,
                        p.FullName,
                        p.Specialty
                    })
                    .ToListAsync();

                return Ok(psychologists);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error al consultar la base de datos", error = ex.Message });
            }
        }


        [HttpGet("psychologist/{psychologistId}")]
        public async Task<IActionResult> GetPsychologistAgenda(int psychologistId)
        {
            try
            {
                var agenda = await _context.Appointments
                    .Where(a => a.PsychologistId == psychologistId)
                    .Include(a => a.User) 
                    .Select(a => new
                    {
                        a.Id,
                        a.AppointmentDate,
                        a.IsImmediate,
                        a.Status,
                        PatientName = a.User != null ? a.User.FullName : "Paciente Anónimo",
                        PatientEmail = a.User != null ? a.User.Email : ""
                    })
                    .OrderBy(a => a.AppointmentDate) 
                    .ToListAsync();

                return Ok(agenda);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error al cargar la agenda", error = ex.Message });
            }
        }

        [HttpPut("confirm/{appointmentId}")]
        public async Task<IActionResult> ConfirmAppointment(int appointmentId)
        {
            try
            {
                var appointment = await _context.Appointments.FindAsync(appointmentId);

                if (appointment == null)
                    return NotFound(new { message = "La cita no existe" });

                appointment.Status = "Confirmed"; 
                await _context.SaveChangesAsync();

                return Ok(new { message = "Cita confirmada con éxito", status = appointment.Status });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error al confirmar la cita", error = ex.Message });
            }
        }


        public class CreateAppointmentDto
        {
            public int UserId { get; set; }
            public int PsychologistId { get; set; }
            public DateTime AppointmentDate { get; set; }
        }
    }
}