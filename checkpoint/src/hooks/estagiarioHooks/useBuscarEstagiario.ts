import Api, { estagiarioRoute } from "@/Service/Api";
import { estagiarioUniqueType } from "@/types/estagiarioTypes";
import { useQuery } from "@tanstack/react-query";

const buscarEstagiario = async ({ queryKey }: { queryKey: [string] }) => {
  const idEstagiario = queryKey[0];
  const { data } = await Api.get<estagiarioUniqueType>(
    `${estagiarioRoute}/BuscarEstagiario?idEstagiario=${idEstagiario}`
  );
  return data;
};

export const useBuscarEstagiario = (idEstagiario: string) => {
  return useQuery({
    queryKey: [idEstagiario],
    queryFn: buscarEstagiario,
    enabled: !!idEstagiario,
  });
};
