using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace web_api_checkpoint.Domains
{

    [Table("TarefaMidia")]
    public class TarefaMidia
    {
        [Key]
        public Guid IdTarefaMidia { get; set; } = Guid.NewGuid();

        public Guid? IdMidia { get; set; }

        [ForeignKey("IdMidia")]
        public Midia? Midia { get; set; }

        public Guid? IdTarefa { get; set; }

        [ForeignKey("IdTarefa")]
        public Tarefa? Tarefa { get; set; }
    }
}
