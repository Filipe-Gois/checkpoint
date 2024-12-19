
using WebAPI.Utils.Mail;

namespace web_api_checkpoint.Utils.Mail
{
    public class EmailSendingService
    {
        private readonly IEmailService emailService;

        private readonly string UrlLogoCheckPoint = "https://blobcheckpointgabriel.blob.core.windows.net/containercheckpoint/logo_checkpoint.png";

        public EmailSendingService(IEmailService service)
        {
            emailService = service;
        }

        public async Task SendWelcomeEmail(string email, string userName)
        {
            if (!string.IsNullOrEmpty(email))
            {
                try
                {
                    MailRequest request = new()
                    {
                        ToEmail = email,
                        Subject = "Bem-vindo ao CheckPoint!",
                        Body = GetHtmlContent(userName)
                    };

                    await emailService.SendEmailAsync(request);
                }
                catch (Exception)
                {

                    throw;
                }
            }
        }

        //metodo para envio de email de recuperacao de senha
        public async Task SendRecovery(string email, int codigo)
        {
            if (!string.IsNullOrEmpty(email))
            {
                try
                {
                    MailRequest request = new()
                    {
                        ToEmail = email,
                        Subject = "Recuperação de senha",
                        Body = GetHtmlContentRecovery(codigo),
                    };

                    await emailService.SendEmailAsync(request);
                }
                catch (Exception)
                {

                    throw;
                }
            }

        }

        private string GetHtmlContent(string userName)
        {
            // Constrói o conteúdo HTML do e-mail, incluindo o nome do usuário
            string Response = @$"
<div style=""width:100%; background-color:rgba(43, 60, 100, 1); padding: 20px;"">
    <div style=""max-width: 600px; margin: 0 auto; background-color:#FFFFFF; border-radius: 10px; padding: 20px;"">
        <img src=""{UrlLogoCheckPoint}"" alt=""Logotipo da Aplicação"" style=""display: block; margin: 0 auto; max-width: 200px;"" />
        <h1 style=""color: #333333; text-align: center;"">Bem-vindo ao CheckPoint!</h1>
        <p style=""color: #666666; text-align: center;"">Olá <strong>" + userName + @"</strong>,</p>
        <p style=""color: #666666; text-align: center;"">Estamos muito felizes por você ter se inscrito na plataforma CheckPoint.</p>
        <p style=""color: #666666; text-align: center;"">Explore todas as funcionalidades que oferecemos.</p>
        <p style=""color: #666666; text-align: center;"">Se tiver alguma dúvida ou precisar de assistência, nossa equipe de suporte está sempre pronta para ajudar.</p>
        <p style=""color: #666666; text-align: center;"">Aproveite sua experiência conosco!</p>
        <p style=""color: #666666; text-align: center;"">Atenciosamente,<br>Equipe CheckPoint</p>
    </div>
</div>";

            // Retorna o conteúdo HTML do e-mail
            return Response;
        }

        private string GetHtmlContentRecovery(int codigo)
        {
            string Response = @$"
<div style=""width:100%; background-color:rgba(43, 60, 100, 1); padding: 20px;"">
    <div style=""max-width: 600px; margin: 0 auto; background-color:#FFFFFF; border-radius: 10px; padding: 20px;"">
        <img src=""{UrlLogoCheckPoint}"" alt=""Logotipo da Aplicação"" style=""display: block; margin: 0 auto; max-width: 200px;"" />
        <h1 style=""color: #333333; text-align: center;"">Recuperação de senha</h1>
        <p style=""color: #666666; font-size: 24px; text-align: center;"">Código de confirmação: <strong>" + codigo + @"</strong></p>
    </div>
</div>
";

            return Response;
        }
    }
}
