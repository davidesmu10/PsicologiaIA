namespace PsicologiaIAAPI.Models
{
    public class ChatLog
    {


        public int Id { get; set; }
        public int UserId { get; set; }
        public User? User { get; set; }

        public string Role { get; set; } = string.Empty; 
        public string Message { get; set; } = string.Empty;
        public DateTime Timestamp { get; set; } = DateTime.UtcNow;
    }
}
