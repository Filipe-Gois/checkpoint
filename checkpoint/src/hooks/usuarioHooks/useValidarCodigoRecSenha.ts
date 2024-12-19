import Api, { recuperarSenhaRoute } from "@/Service/Api";
import { useMutation } from "@tanstack/react-query";

type paramsType = {
  email: string;
  codigo: string;
};

const validarCodigoRecSenha = async ({ email, codigo }: paramsType) =>
  await Api.post(
    `${recuperarSenhaRoute}/ValidarCodigo?email=${email}&codigo=${codigo}`
  );

const useValidarCodigoRecSenha = () => {
  return useMutation({
    mutationFn: validarCodigoRecSenha,
  });
};

export default useValidarCodigoRecSenha;
