using web_api_checkpoint.ViewModels.Presenca;

namespace web_api_checkpoint.Interfaces
{
    public interface IPresencaRepository
    {
        List<ExibirPresenca> ListarPresencasDoEstagiario(Guid id);

        void GerarPresenca();

        bool BaterPontoSaida(Guid idEstagiario);
        List<DateTime> ListarFaltasNaoJustificadasDoEstagiarioNosUltimos30Dias(Guid idEstagiario);
    }
}
