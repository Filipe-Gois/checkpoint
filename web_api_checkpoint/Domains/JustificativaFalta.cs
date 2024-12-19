using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace web_api_checkpoint.Domains
{
    enum StatusValidacaoEnum
    {
        Pendente,
        Aprovado,
        Rejeitado
    }
    [Table("JustificativaFalta")]
    public class JustificativaFalta
    {
        [Key]
        public Guid IdJustificativaFalta { get; set; } = Guid.NewGuid();

        [Column(TypeName = "INT")]
        public int StatusValidacao { get; set; } = (int)StatusValidacaoEnum.Pendente;

        [Column(TypeName = "TEXT")]
        public string? MotivoRejeicao { get; set; }

        public Guid? IdPresenca { get; set; }

        [ForeignKey("IdPresenca")]
        public Presenca? Presenca { get; set; }

        public Guid? IdMidia { get; set; }

        [ForeignKey("IdMidia")]
        public Midia? Midia { get; set; }
    }
}
