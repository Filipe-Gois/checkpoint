import Api, { tarefaRoute } from "@/Service/Api";
import { tarefaType } from "@/types/tarefaTypes";
import { useQuery } from "@tanstack/react-query";

const listarTarefasParaOsGestores = async ({
  queryKey,
}: {
  queryKey: [string, string];
}) => {
  const idGestor = queryKey[1];

  const { data } = await Api.get<tarefaType[]>(
    `/${tarefaRoute}/ListarTarefasParaOsGestores?id=${idGestor}`
  );
  return data;
};

const useListarTarefasParaOsGestores = (idGestor: string) => {
  return useQuery({
    queryKey: ["listarTarefasParaOsGestores", idGestor],
    queryFn: listarTarefasParaOsGestores,
    enabled: !!idGestor,
  });
};

export default useListarTarefasParaOsGestores;
