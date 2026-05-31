using System.ComponentModel.DataAnnotations;

namespace PsicologiaIAAPI.Models
{
    public class Psychologist
    {

        public int Id { get; set; }

        public string FullName { get; set; } = string.Empty;

        public string Email { get; set; } = string.Empty;

        public string Specialty { get; set; } = string.Empty;

        public bool IsAvailableForImmediate { get; set; } = false;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
