import Api, { notificacaoRoute } from "@/Service/Api";
import { notificacaoType } from "@/types/notificacaoType";
import { useQuery } from "@tanstack/react-query";

const buscarNotificacoes = async ({
  queryKey,
}: {
  queryKey: [string, string];
}) => {
  const [, idUsuario] = queryKey;
  const { data } = await Api.get<notificacaoType[]>(
    `/${notificacaoRoute}/BuscarNotificacoesDoUsuario?idUsuario=${idUsuario}`
  );
  return data;
};

export const useBuscarNotificacoesDoUsuario = (idUsuario: string) => {
  return useQuery({
    queryKey: ["notificacoes", idUsuario],
    queryFn: buscarNotificacoes,
    enabled: !!idUsuario,
  });
};
