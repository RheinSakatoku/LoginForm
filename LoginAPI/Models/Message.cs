using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace LoginAPI.Models
{
    public class Message
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Message_Id { get; set; }
        [Column(TypeName = "nvarchar(100)")]
        public string Message_Text { get; set; } = "";
        [Column(TypeName = "nvarchar(100)")]
        public string Client_Id { get; set; } = "";
        [Column(TypeName = "nvarchar(100)")]
        public string Theme_Id { get; set; } = "";
    }
}
