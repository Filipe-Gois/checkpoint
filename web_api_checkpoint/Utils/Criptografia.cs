namespace web_api_checkpoint.Utils
{
    public static class Criptografia
    {
        public static string GerarHash(string senha) => BCrypt.Net.BCrypt.HashPassword(senha);
        public static bool CompararHash(string senhaForm, string senhaBanco) => BCrypt.Net.BCrypt.Verify(senhaForm, senhaBanco);

    }
}
