using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using SharpCompress.Archives.Tar;
using web_api_checkpoint.Contexts;
using web_api_checkpoint.Domains;
using web_api_checkpoint.Hubs;
using web_api_checkpoint.Interfaces;
using web_api_checkpoint.ViewModels.Notificacao;
using web_api_checkpoint.ViewModels.Tarefa;
using WebAPI.Utils.BlobStorage;

namespace web_api_checkpoint.Repositories
{
    public class TarefaRepository : ITarefaRepository
    {
        private readonly CheckpointContext ctx;
        private readonly IHubProvider _hubContext;

        public TarefaRepository(CheckpointContext _ctx, IHubProvider hubContext)
        {
            ctx = _ctx;
            _hubContext = hubContext;
        }

        public List<ExibirTarefa> ListarTodasAsTarefas()
        {
            Type dificuldadeEnumType = typeof(DificuldadeEnum);
            Type statusCorrecaoEnumType = typeof(StatusCorrecaoEnum);


            List<ExibirTarefa> tarefas = ctx.Tarefa
                .Select(t => new ExibirTarefa
                {
                    IdTarefa = t.IdTarefa,
                    Titulo = t.Titulo,
                    Descricao = t.Descricao,
                    Prazo = t.Prazo,

                    Status = Enum.GetName(statusCorrecaoEnumType, t.StatusCorrecao),
                    Dificuldade = Enum.GetName(dificuldadeEnumType, t.Dificuldade),

                    UrlMidias = ctx.TarefaMidia
                        .Include(x => x.Midia)
                        .Where(tm => tm.IdTarefa == t.IdTarefa)
                        .Select(tm => tm.Midia!.Url)
                        .ToList()!
                })
                .ToList();

            return tarefas;
        }
        public bool ArquivarOuDesarquivarTarefa(Guid id)
        {
            throw new NotImplementedException();
        }

        public async Task<bool> AtualizarEntregaTarefa(Guid id, List<IFormFile> arquivos)
        {
            // Busca a tarefa para verificar se existe
            var tarefa = ctx.Tarefa.FirstOrDefault(t => t.IdTarefa == id);

            if (tarefa == null)
                return false; // Tarefa não encontrada

            // Obtem as mídias atualmente associadas à entrega da tarefa
            var midiasAtuais = ctx.TarefaEstagiarioMidia
                                  .Where(te => te.IdTarefa == id)
                                  .Select(te => te.Midia)
                                  .ToList();

            // Lista das mídias para remover
            var midiasARemover = midiasAtuais
                .Where(m => !arquivos.Any(a => a.FileName.Contains(m.Url!))) // Verifica se a mídia atual não está na lista de novos arquivos
                .ToList();

            // Remove as mídias que não foram enviadas novamente
            foreach (var midia in midiasARemover)
            {
                // Deleta a mídia do BlobStorage
                await AzureBlobStorageHelper.DeleteBlobAsync(midia.BlobStorageName!);

                // Remove a relação da mídia com a entrega da tarefa
                var tarefaEstagiarioMidia = ctx.TarefaEstagiarioMidia
                                               .FirstOrDefault(te => te.IdMidia == midia.IdMidia);

                if (tarefaEstagiarioMidia != null)
                {
                    ctx.TarefaEstagiarioMidia.Remove(tarefaEstagiarioMidia);
                    if (tarefaEstagiarioMidia.Midia != null)
                    {
                        ctx.Midia.Remove(tarefaEstagiarioMidia.Midia);
                    }
                }
            }

            // Adiciona as novas mídias que foram enviadas e ainda não estão associadas à tarefa
            foreach (var arquivo in arquivos)
            {
                // Verifica se o arquivo já está associado à tarefa
                var midiaExistente = midiasAtuais.FirstOrDefault(m => m.Url == arquivo.FileName);
                if (midiaExistente == null)
                {
                    // Upload da nova mídia para o BlobStorage
                    var novaMidia = await AzureBlobStorageHelper.UploadImageBlobAsync(arquivo);

                    // Adiciona a nova mídia ao contexto
                    ctx.Midia.Add(novaMidia);

                    // Cria a relação entre a tarefa e a mídia do estagiário
                    var tarefaEstagiarioMidia = new TarefaEstagiarioMidia
                    {
                        IdTarefa = id,
                        IdMidia = novaMidia.IdMidia
                    };

                    ctx.TarefaEstagiarioMidia.Add(tarefaEstagiarioMidia);
                }
            }

            // Salva as alterações no banco de dados
            await ctx.SaveChangesAsync();

            return true;
        }


        public async Task<bool> AtualizarTarefa(Guid id, AtualizarTarefa atualizarTarefa)
        {
            var tarefa = ctx.Tarefa.Where(t => t.IdTarefa == id).FirstOrDefault();

            if (tarefa == null)
                return false;  // Tarefa não encontrada

            // Atualiza os dados básicos da tarefa
            if (!string.IsNullOrEmpty(atualizarTarefa.Titulo))
                tarefa.Titulo = atualizarTarefa.Titulo;

            if (!string.IsNullOrEmpty(atualizarTarefa.Descricao))
                tarefa.Descricao = atualizarTarefa.Descricao;

            //if (atualizarTarefa.Prazo.HasValue)
            //    tarefa.Prazo = atualizarTarefa.Prazo;

            //if (atualizarTarefa.Dificuldade != null)
            //    tarefa.Dificuldade = atualizarTarefa.Dificuldade;

            // Obtem as midias atualmente associadas à tarefa
            var midiasAtuais = ctx.TarefaMidia
                                         .Where(tm => tm.IdTarefa == id)
                                         .Select(tm => tm.Midia)
                                         .ToList();

            // Lista de arquivos de imagens enviados na atualização
            var arquivosImagens = atualizarTarefa.ArquivosDeImagens;

            // Lista de midias para remover
            var midiasARemover = midiasAtuais
                .Where(m => !arquivosImagens.Any(ai => ai.FileName.Contains(m.Url!)))  // Verifica se a mídia não está na lista de arquivos de imagem
                .ToList();

            // Remove as midias que não foram enviadas
            foreach (var midia in midiasARemover)
            {
                // Deleta a mídia do BlobStorage
                await AzureBlobStorageHelper.DeleteBlobAsync(midia.BlobStorageName!);

                // Deleta a associação da mídia com a tarefa
                var tarefaMidia = ctx.TarefaMidia
                                            .Where(tm => tm.IdMidia == midia.IdMidia)
                                            .FirstOrDefault();

                if (tarefaMidia != null)
                {
                    ctx.TarefaMidia.Remove(tarefaMidia);

                    if (tarefaMidia.Midia != null)
                    {
                        ctx.Midia.Remove(tarefaMidia.Midia);
                    }

                }
            }

            // Adiciona as novas imagens que foram enviadas e não estão associadas à tarefa
            foreach (var arquivoImagem in arquivosImagens)
            {
                // Verifica se a imagem já existe associada à tarefa (por URL)
                var midiaExistente = midiasAtuais.FirstOrDefault(m => m.Url == arquivoImagem.FileName);
                if (midiaExistente == null)  // Se a mídia não existe, faz o upload
                {
                    var midia = await AzureBlobStorageHelper.UploadImageBlobAsync(arquivoImagem);
                    ctx.Midia.Add(midia);

                    // Cria a relação entre a tarefa e a mídia
                    var tarefaMidia = new TarefaMidia
                    {
                        IdTarefa = id,
                        IdMidia = midia.IdMidia
                    };

                    ctx.TarefaMidia.Add(tarefaMidia);
                }
            }

            // Salva as alterações no banco
            await ctx.SaveChangesAsync();

            return true;
        }


        public async Task<bool> CadastrarTarefa(CadastrarTarefa cadastrarTarefa)
        {

            Tarefa novaTarefa = new()
            {
                Descricao = cadastrarTarefa.Descricao,
                Dificuldade = cadastrarTarefa.Dificuldade,
                Prazo = cadastrarTarefa.Prazo,
                Titulo = cadastrarTarefa.Titulo,
                IdEstagiario = cadastrarTarefa.IdEstagiarioAtribuido
            };
            ctx.Tarefa.Add(novaTarefa);

            foreach (IFormFile arquivo in cadastrarTarefa.ArquivosDeImagens!)
            {
                Midia midia = await AzureBlobStorageHelper.UploadImageBlobAsync(arquivo);


                TarefaMidia tarefaMidia = new()
                {
                    IdMidia = midia.IdMidia,
                    IdTarefa = novaTarefa.IdTarefa
                };
                ctx.Midia.Add(midia);
                ctx.TarefaMidia.Add(tarefaMidia);
            }

            ctx.SaveChanges();


            Notificacao notificacao = new()
            {
                Descricao = $"Você recebeu uma nova tarefa: {novaTarefa.Titulo}",
                Titulo = novaTarefa.Titulo,
                IdDestinatarios = [novaTarefa.IdEstagiario ?? Guid.Empty],
                TipoNotificacao = (int)NotificacaoEnum.LancamentoDeTarefa
            };

            await _hubContext.EnviarNotificacao(notificacao);

            return true;
        }

        public async Task<bool> CorrigirTarefa(Guid idTarefa, int statusCorrecao, string descricaoCorrecao)
        {
            Tarefa tarefaBuscada = ctx.Tarefa.FirstOrDefault(x => x.IdTarefa == idTarefa)!;

            if (statusCorrecao == (int)StatusCorrecaoEnum.EmAnalise || statusCorrecao == (int)StatusCorrecaoEnum.Pendente || tarefaBuscada == null) return false;

            tarefaBuscada.StatusCorrecao = statusCorrecao;
            tarefaBuscada.DescricaoCorrecao = descricaoCorrecao ?? tarefaBuscada.DescricaoCorrecao;
            ctx.Tarefa.Update(tarefaBuscada);
            ctx.SaveChanges();

            Notificacao notificacao = new()
            {
                Descricao = $"Sua tarefa '{tarefaBuscada.Titulo}' foi corrigida.",
                Titulo = tarefaBuscada.Titulo,
                IdDestinatarios = [tarefaBuscada.IdEstagiario ?? Guid.Empty],
                TipoNotificacao = (int)NotificacaoEnum.CorrecaoDeTarefa
            };

            await _hubContext.EnviarNotificacao(notificacao);

            return true;
        }

        public async Task<bool> EntregarTarefa(Guid idTarefa, List<IFormFile> arquivos)
        {

            if (arquivos.Count == 0) return false;

            List<TarefaEstagiarioMidia> midiasDaTarefaEntregue = ctx.TarefaEstagiarioMidia.Where(x => x.IdTarefa == idTarefa).ToList();

            if (midiasDaTarefaEntregue.Count != 0) return false;

            Tarefa tarefaBuscada = ctx.Tarefa
                .Include(x => x.Estagiario).ThenInclude(x => x!.Usuario)
                .FirstOrDefault(x => x.IdTarefa == idTarefa)!;

            List<Guid?> idGestores = ctx.SquadGestor.Include(x => x.Squad).Where(x => x.IdSquad == tarefaBuscada.Estagiario!.IdSquad).Select(x => x.IdUsuario).ToList();

            if (tarefaBuscada == null) return false;

            tarefaBuscada.StatusCorrecao = (int)StatusCorrecaoEnum.EmAnalise;

            List<Midia> midias = [];
            List<TarefaEstagiarioMidia> tarefaEstagiarioMidias = [];

            foreach (IFormFile arquivo in arquivos)
            {
                Midia midia = await AzureBlobStorageHelper.UploadImageBlobAsync(arquivo);
                TarefaEstagiarioMidia tarefaEstagiarioMidia = new()
                {
                    IdMidia = midia.IdMidia,
                    IdTarefa = tarefaBuscada.IdTarefa,
                };

                midias.Add(midia);
                tarefaEstagiarioMidias.Add(tarefaEstagiarioMidia);
            }

            ctx.Midia.AddRange(midias);
            ctx.TarefaEstagiarioMidia.AddRange(tarefaEstagiarioMidias);
            ctx.Tarefa.Update(tarefaBuscada);
            ctx.SaveChanges();

            string nomeEstagiarioCompleto = tarefaBuscada.Estagiario!.Usuario!.Nome + " " + tarefaBuscada.Estagiario.Usuario.SobreNome;

            Notificacao notificacao = new()
            {
                Descricao = "",
                Titulo = $"{tarefaBuscada.Titulo}: Entrega.",
                IdDestinatarios = idGestores,
                TipoNotificacao = (int)NotificacaoEnum.EntregaDeTarefa
            };

            notificacao.Descricao = $"{nomeEstagiarioCompleto} entregou a tarefa '{tarefaBuscada.Titulo}'.";

            await _hubContext.EnviarNotificacao(notificacao);

            return true;
        }

        public List<ExibirTarefa> ListarTarefasDoEstagiario(Guid idEstagiario)
        {
            Type dificuldadeEnumType = typeof(DificuldadeEnum);
            Type statusCorrecaoEnumType = typeof(StatusCorrecaoEnum);
            List<ExibirTarefa> tarefas = ctx.Tarefa
                .Where(t => t.IdEstagiario == idEstagiario)
                .Select(t => new ExibirTarefa
                {
                    DescricaoCorrecao = t.DescricaoCorrecao,
                    IdTarefa = t.IdTarefa,
                    Titulo = t.Titulo,
                    Descricao = t.Descricao,
                    Prazo = t.Prazo,
                    Status = Enum.GetName(statusCorrecaoEnumType, t.StatusCorrecao),
                    Dificuldade = Enum.GetName(dificuldadeEnumType, t.Dificuldade),
                    UrlMidias = ctx.TarefaMidia
                    .Include(x => x.Midia)
                        .Where(tm => tm.IdTarefa == t.IdTarefa)
                        .Select(tm => tm.Midia!.Url!)
                        .ToList(),
                    UrlMidiasEntreguesEstagiario = ctx.TarefaEstagiarioMidia.Include(x => x.Midia).Where(x => x.IdTarefa == t.IdTarefa).Select(x => x.Midia!.Url!).ToList(),
                })
                .ToList();

            return tarefas;
        }

        public List<ExibirTarefaCorrecao> ListarTarefasParaOsGestores(Guid idGestor)
        {

            // 1. Obter as squads associadas ao gestor
            var squadsDoGestor = ctx.SquadGestor
                .Where(sg => sg.IdUsuario == idGestor)
                .Select(sg => sg.IdSquad)
                .ToList();

            // 2. Obter os estagiários dessas squads
            var estagiariosDasSquads = ctx.Estagiario
                .Where(e => squadsDoGestor.Contains(e.IdSquad.Value))
                .Select(e => e.IdEstagiario)
                .ToList();

            // 3. Obter as tarefas associadas aos estagiários
            var tarefas = ctx.Tarefa
                .Where(t => estagiariosDasSquads.Contains(t.IdEstagiario.Value))
                .Include(t => t.Estagiario.Usuario) // Para nome e sobrenome
                .ToList();

            // 4. Montar a lista de ExibirTarefaCorrecao
            var resultado = tarefas.Select(t => new ExibirTarefaCorrecao
            {
                DescricaoCorrecao = t.DescricaoCorrecao,
                IdTarefa = t.IdTarefa,
                Titulo = t.Titulo,
                Descricao = t.Descricao,
                Prazo = t.Prazo,
                Dificuldade = ((DificuldadeEnum)t.Dificuldade).ToString(),
                Status = ((StatusCorrecaoEnum)t.StatusCorrecao).ToString(),
                Nome = t.Estagiario?.Usuario?.Nome,
                SobreNome = t.Estagiario?.Usuario?.SobreNome,
                UrlMidias = ctx.TarefaMidia
               .Include(x => x.Midia)
                    .Where(tm => tm.IdTarefa == t.IdTarefa)
                    .Select(tm => tm.Midia.Url) // Substitua por sua propriedade de URL
                    .ToList()!,
                UrlMidiasEntreguesEstagiario = ctx.TarefaEstagiarioMidia
                .Include(x => x.Midia)
                    .Where(tem => tem.IdTarefa == t.IdTarefa)
                    .Select(tem => tem.Midia.Url) // Substitua por sua propriedade de URL
                    .ToList()!
            }).ToList();

            return resultado;

        }

    }


  
}
