import Api, { tarefaRoute } from "@/Service/Api";
import { tarefaType } from "@/types/tarefaTypes";
import { useQuery } from "@tanstack/react-query";

const listarTarefasDoEstagiario = async ({
  queryKey,
}: {
  queryKey: [string, string];
}) => {
  const idEstagiario = queryKey[1];

  const { data } = await Api.get<tarefaType[]>(
    `${tarefaRoute}/ListarTarefasDoEstagiario?id=${idEstagiario}`
  );
  return data;
};

export const useListarTarefasDoEstagiario = (idEstagiario: string) => {
  return useQuery({
    queryKey: ["listarTarefasDoEstagiario", idEstagiario],
    queryFn: listarTarefasDoEstagiario,
    enabled: !!idEstagiario,
  });
};
