import Api, { presencaRoute } from "@/Service/Api";
import { useQuery } from "@tanstack/react-query";

const listarFaltasNaoJustificadasDoEstagiarioNosUltimos30Dias = async ({
  queryKey,
}: {
  queryKey: [string];
}) => {
  const idEstagiario = queryKey[0];
  const { data } = await Api.get<string[]>(
    `/${presencaRoute}/ListarFaltasNaoJustificadasDoEstagiarioNosUltimos30Dias?idEstagiario=${idEstagiario}`
  );
  return data;
};

export const useListarFaltasNaoJustificadasDoEstagiarioNosUltimos30Dias = (
  idEstagiario: string
) => {
  return useQuery({
    queryKey: [idEstagiario],
    queryFn: listarFaltasNaoJustificadasDoEstagiarioNosUltimos30Dias,
    enabled: !!idEstagiario,
  });
};
