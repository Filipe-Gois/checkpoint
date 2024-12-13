import Api, { squadRoute } from "@/Service/Api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

type ParamsType = {
  nome: string;
  idGestores: string[];
  idEstagiarios: string[];
};

const cadastrarSquad = async ({
  nome,
  idGestores,
  idEstagiarios,
}: ParamsType) => {
  await Api.post(`/${squadRoute}`, {
    nome,
    idGestores,
    idEstagiarios,
  });
};

const useCadastrarSquad = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: cadastrarSquad,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["squads"],
      });
      queryClient.invalidateQueries({
        queryKey: ["usuarios"],
      });
    },
  });
};

export default useCadastrarSquad;
