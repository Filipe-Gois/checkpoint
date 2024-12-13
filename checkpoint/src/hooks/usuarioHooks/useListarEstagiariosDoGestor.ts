import Api, { usuarioRoute } from "@/Service/Api";
import { cadastrarTarefaUsuarioType } from "@/types/tarefaTypes";
import { useQuery } from "@tanstack/react-query";

const listarEstagiariosDoGestor = async ({
  queryKey,
}: {
  queryKey: [string];
}) => {
  const idGestor = queryKey[0];
  const { data } = await Api.get<cadastrarTarefaUsuarioType[]>(
    `/${usuarioRoute}/ListarEstagiariosDoGestor?idGestor=${idGestor}`
  );
  return data;
};

export const useListarEstagiariosDoGestor = (idGestor: string) => {
  return useQuery({
    queryKey: [idGestor],
    queryFn: listarEstagiariosDoGestor,
  });
};
