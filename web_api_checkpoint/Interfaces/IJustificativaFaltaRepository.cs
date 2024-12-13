using web_api_checkpoint.ViewModels.Justificativa;
using web_api_checkpoint.ViewModels.JustificativaFalta;

namespace web_api_checkpoint.Interfaces
{
    public interface IJustificativaFaltaRepository
    {
        Task<bool> CadastrarJustificativa(CadastrarJustificativaFalta cadastrarJustificativaFalta);
        Task<bool> ValidarJustificativa(ValidarJustificativaFalta validarJustificativaFalta);

        List<ExibirJustificativaFalta> ListarTodasAsJustificativasDeFalta();
    }
}
