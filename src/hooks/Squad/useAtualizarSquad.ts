import Api, { squadRoute } from "@/Service/Api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

type ParamsType = {
  nome: string;
  idGestores: string[];
  idSquad: string;
  idEstagiarios: string[];
};

const atualizarSquad = async (params: ParamsType) => {
  await Api.put(
    `/${squadRoute}/AtualizarSquad?idSquad=${params.idSquad}`,
    params
  );
};

export const useAtualizarSquad = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: atualizarSquad,
    onSuccess: async () => {
      queryClient.invalidateQueries({
        queryKey: ["squads"],
      });
      queryClient.invalidateQueries({
        queryKey: ["usuarios"],
      });
    },
  });
};
