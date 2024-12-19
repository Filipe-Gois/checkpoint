using System.Globalization;
using web_api_checkpoint.Contexts;
using web_api_checkpoint.Domains;
using web_api_checkpoint.Interfaces;
using web_api_checkpoint.ViewModels.Expediente;

namespace web_api_checkpoint.Repositories
{
    public class ExpedienteRepository : IExpedienteRepository
    {
        private readonly CheckpointContext ctx;

        public ExpedienteRepository(CheckpointContext _ctx)
        {
            ctx = _ctx;
        }

        public bool Cadastrar(CadastrarExpediente cadastrarExpediente)
        {
            Expediente expedienteBuscado = ctx.Expediente.FirstOrDefault(x => x.Descricao == cadastrarExpediente.Descricao)!;

            if (expedienteBuscado != null) return false;


            Expediente expediente = new()
            {
                Descricao = cadastrarExpediente.Descricao,
                FimExpediente = TimeOnly.ParseExact(cadastrarExpediente.FimExpediente!, "HH:mm:ss", CultureInfo.InvariantCulture),
                InicioExpediente = TimeOnly.ParseExact(cadastrarExpediente.InicioExpediente!, "HH:mm:ss", CultureInfo.InvariantCulture),
            };

            ctx.Expediente.Add(expediente);
            ctx.SaveChanges();

            return true;
        }

        public List<Expediente> ListarExpedientes() => ctx.Expediente.ToList();
    }
}
