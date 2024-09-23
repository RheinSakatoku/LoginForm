using Microsoft.EntityFrameworkCore;
using Microsoft.Identity.Client;

namespace LoginAPI.Models
{
    public class DataBaseContecst:DbContext
    {
        public DataBaseContecst(DbContextOptions options) : base(options)
        {
            
        }

        public DbSet<Contacts> Contacts { get; set; }
        public DbSet<Message> Message { get; set; }
        public DbSet<MessageThemes> MessageThemes { get; set; }
    }
}
