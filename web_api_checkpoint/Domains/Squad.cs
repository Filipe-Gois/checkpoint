using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace web_api_checkpoint.Domains
{

    [Table("Squad")]
    public class Squad
    {

        [Key]
        public Guid IdSquad { get; set; } = Guid.NewGuid();

        [Column(TypeName = "VARCHAR(100)")]
        [Required(ErrorMessage = "O Nome é obrigatório!")]
        public string? Nome { get; set; }


        [Column(TypeName = "BIT")]
        public bool IsActive { get; set; } = true;

    }
}
