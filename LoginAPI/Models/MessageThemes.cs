using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace LoginAPI.Models
{
    public class MessageThemes
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int MT_ID { get; set; }
        [Column(TypeName = "nvarchar(100)")]
        public string MessageTheme { get; set; } = "";
    }
}
