namespace web_api_checkpoint.ViewModels.Tarefa
{
    public class ExibirTarefaCorrecao : ExibirTarefa
    {
        public string? Nome { get; set; }
        public string? SobreNome { get; set; }
        public string? DescricaoCorrecao { get; set; }
        public List<string>? UrlMidiasEntreguesEstagiario { get; set; } = [];
    }
}
