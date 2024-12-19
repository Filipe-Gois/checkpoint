using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace web_api_checkpoint.Domains
{

    [Table("SquadGestor")]
    public class SquadGestor
    {
        [Key]
        public Guid IdSquadGestor { get; set; } = Guid.NewGuid();

        public Guid? IdUsuario { get; set; }

        [ForeignKey("IdUsuario")]
        public Usuario? Usuario { get; set; }


        public Guid? IdSquad { get; set; }

        [ForeignKey("IdSquad")]
        public Squad? Squad { get; set; }

    }
}
