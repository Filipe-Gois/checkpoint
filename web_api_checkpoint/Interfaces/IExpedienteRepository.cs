using web_api_checkpoint.Domains;
using web_api_checkpoint.ViewModels.Expediente;

namespace web_api_checkpoint.Interfaces
{
    public interface IExpedienteRepository
    {
        bool Cadastrar(CadastrarExpediente cadastrarExpediente);

        List<Expediente> ListarExpedientes();
    }
}
