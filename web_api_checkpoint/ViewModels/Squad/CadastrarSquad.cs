namespace web_api_checkpoint.ViewModels.Squad
{
    public class CadastrarSquad
    {
        public string? Nome { get; set; }

        public List<Guid> IdGestores { get; set; } = [];
        public List<Guid> IdEstagiarios { get; set; } = [];
    }
}
