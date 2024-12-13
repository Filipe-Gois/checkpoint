import Api, { usuarioRoute } from "@/Service/Api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

type ParamsType = {
  idUsuario: string;
};

const arquivarUsuario = async ({ idUsuario }: ParamsType) => {
  await Api.put(`/${usuarioRoute}/ArquivarUsuario?idUsuario=${idUsuario}`);
};

export const useArquivarUsuario = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: arquivarUsuario,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["usuarios"] });
    },
  });
};
