import Api, { usuarioRoute } from "@/Service/Api";
import { useMutation } from "@tanstack/react-query";

type params = {
  senha: string;
  email: string;
};
const alterarSenhaUsuario = async ({ email, senha }: params) =>
  await Api.put(
    `${usuarioRoute}/AlterarSenha?email=${email}&senhaNova=${senha}`
  );

const useAlterarSenhaUsuario = () => {
  return useMutation({
    mutationFn: alterarSenhaUsuario,
  });
};

export default useAlterarSenhaUsuario;
