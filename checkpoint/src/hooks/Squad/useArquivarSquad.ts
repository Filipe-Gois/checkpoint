import Api, { squadRoute } from "@/Service/Api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

type ParamsType = {
  idSquad: string;
};

const arquivarSquad = async ({ idSquad }: ParamsType) => {
  await Api.put(`/${squadRoute}/ArquivarOuDesarquivarSquad?idSquad=${idSquad}`);
};

export const useArquivarSquad = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: arquivarSquad,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["squads"] });
    },
  });
};
