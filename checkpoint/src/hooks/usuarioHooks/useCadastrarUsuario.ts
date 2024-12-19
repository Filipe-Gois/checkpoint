import Api, { usuarioRoute } from "@/Service/Api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export interface Usuario {
  nome: string;
  sobreNome: string;
  emailPessoal: string;
  emailCorporativo: string;
  senha: string;
  role: number;
  idExpediente?: string;
}

const cadastrarUsuario = async ({
  nome,
  sobreNome,
  emailPessoal,
  emailCorporativo,
  senha,
  role,
  idExpediente,
}: Usuario) => {
  const response = await Api.post(`/${usuarioRoute}`, {
    nome,
    sobreNome,
    emailPessoal,
    emailCorporativo,
    senha,
    role,
    idExpediente,
  });

  return response.data;
};

const useCadastrarUsuario = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: cadastrarUsuario,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["usuarios"],
      });
    },
  });
};

export default useCadastrarUsuario;
