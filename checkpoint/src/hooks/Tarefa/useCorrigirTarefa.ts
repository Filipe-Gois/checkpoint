import Api, { tarefaRoute } from "@/Service/Api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

type params = {
  idTarefa: string;
  statusCorrecao: number;
  descricaoCorrecao: string;
};

const corrigirTarefa = async ({
  descricaoCorrecao,
  idTarefa,
  statusCorrecao,
}: params) => {
  await Api.put(
    `/${tarefaRoute}/CorrigirTarefa?idTarefa=${idTarefa}&statusCorrecao=${statusCorrecao}&descricaoCorrecao=${descricaoCorrecao}`
  );
};

export const useCorrigirTarefa = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: corrigirTarefa,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["listarTarefasParaOsGestores"],
      });
      queryClient.invalidateQueries({
        queryKey: ["listarTarefasDoEstagiario"],
      });
    },
  });
};
