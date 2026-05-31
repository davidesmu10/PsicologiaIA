namespace PsicologiaIAAPI.Models
{
    public class Appointment
    {

        public int Id { get; set; }
        public int UserId { get; set; }
        public User? User { get; set; }

        public int? PsychologistId { get; set; }
        public Psychologist? Psychologist { get; set; }

        public DateTime AppointmentDate { get; set; }
        public bool IsImmediate { get; set; } = false;
        public string Status { get; set; } = "Pending"; 
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
