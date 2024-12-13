using web_api_checkpoint.ViewModels.Usuario;

namespace web_api_checkpoint.Interfaces
{
    public interface IUsuarioRepository
    {
        ExibirUsuario BuscarPorEmailESenhaLogar(LoginViewModel loginViewModel);
        List<Object> ListarTodosOsUsuarios();
        List<Object> ListarEstagiariosDoGestor(Guid idGestor);
        bool CadastrarUsuario(CadastrarUsuario cadastrarUsuario);

        bool AlterarSenha(string email, string senhaNova);
        bool ArquivarOuDesarquivarUsuario(Guid idUsuario);

        /// <summary>
        /// Descontinuado
        /// </summary>
        /// <param name="idUsuario"></param>
        /// <param name="atualizarUsuario"></param>
        /// <returns></returns>
        bool AtualizarUsuario(Guid idUsuario, AtualizarUsuario atualizarUsuario);
    }
}
