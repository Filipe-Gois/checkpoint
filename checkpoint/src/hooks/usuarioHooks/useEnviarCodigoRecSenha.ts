import Api, { recuperarSenhaRoute } from "@/Service/Api";
import { useMutation } from "@tanstack/react-query";

const enviarCodigoRecSenha = async (email: string) =>
  await Api.post(`${recuperarSenhaRoute}?email=${email}`);

const useEnviarCodigoRecSenha = () => {
  return useMutation({
    mutationFn: enviarCodigoRecSenha,
  });
};

export default useEnviarCodigoRecSenha;
