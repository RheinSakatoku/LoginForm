using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace LoginAPI.Models
{
    public class Contacts
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Contact_ID { get; set; }
        [Column(TypeName = "nvarchar(100)")]
        public string Email { get; set; } = "";
        [Column(TypeName = "nvarchar(12)")]
        public string PhoneNumber { get; set; } = "";
        [Column(TypeName = "nvarchar(100)")]
        public string Name { get; set; } = "";
       /*[ForeignKey("Message")]
        public int message { get; set; }
        public Message Message_Id { get; set; }

        [ForeignKey("MessageThemes")]
        public int MessageThemeId { get; set; }
        public MessageThemes MT_ID { get; set; }*/
    }
}
