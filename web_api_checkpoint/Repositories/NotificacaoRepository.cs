using MongoDB.Driver;
using System.Data;
using web_api_checkpoint.Domains;
using web_api_checkpoint.Interfaces;
using web_api_checkpoint.Services;
using web_api_checkpoint.ViewModels.Notificacao;

namespace web_api_checkpoint.Repositories
{
    public class NotificacaoRepository : INotificacaoRepository
    {
        private readonly MongoDBService _mongoDBService;
        private readonly IMongoCollection<Notificacao> _notificacao;
        public NotificacaoRepository(MongoDBService mongoDBService)
        {
            _mongoDBService = mongoDBService;
            _notificacao = _mongoDBService.GetDatabase.GetCollection<Notificacao>("Notificacao");
        }

        public async Task<List<ExibirNotificacao>> BuscarNotificacoesDoUsuario(Guid idUsuario)
        {
            // Criar o filtro para verificar se o IdDestinatarios contém o idUsuario
            FilterDefinition<Notificacao> filtro = Builders<Notificacao>.Filter.AnyEq(x => x.IdDestinatarios, idUsuario);


            // Buscar as notificações que correspondem ao filtro
            List<Notificacao> notificacoesBuscadas = await _notificacao
         .Find(filtro)
         .SortByDescending(x => x.DataEHora) // Ordenação
         .ToListAsync();

            List<ExibirNotificacao> notificacoes = [];

            foreach (var item in notificacoesBuscadas)
            {
                ExibirNotificacao exibirNotificacao = new()
                {
                    Titulo = item.Titulo,
                    DataEHora = item.DataEHora,
                    Descricao = item.Descricao,
                    IdDestinatarios = item.IdDestinatarios,
                    IdNotificacao = item.IdNotificacao,
                    TipoNotificacao = Enum.GetName(typeof(NotificacaoEnum), item.TipoNotificacao)

                };
                notificacoes.Add(exibirNotificacao);
            }

            return notificacoes;
        }

        public async Task CadastrarNotificacao(Notificacao notificacao)
        {
            await _notificacao.InsertOneAsync(notificacao);
        }
    }
}
