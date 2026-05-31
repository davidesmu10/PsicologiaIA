using Microsoft.EntityFrameworkCore;
using PsicologiaIAAPI.Models;

namespace PsicologiaIAAPI.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }
        public DbSet<User> Users { get; set; }
        public DbSet<Psychologist> Psychologists { get; set; }
        public DbSet<Appointment> Appointments { get; set; }
        public DbSet<ChatLog> ChatLogs { get; set; }
    }
}
