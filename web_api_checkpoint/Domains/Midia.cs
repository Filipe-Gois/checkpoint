using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace web_api_checkpoint.Domains
{

    [Table("Midia")]
    public class Midia
    {
        [Key]
        public Guid IdMidia { get; set; } = Guid.NewGuid();

        [Column(TypeName = "TEXT")]
        public string? Url { get; set; }

        [Column(TypeName = "TEXT")]
        public string? BlobStorageName { get; set; }
    }
}
