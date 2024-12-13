import Api, { estagiarioRoute } from "@/Service/Api";
import { useQuery } from "@tanstack/react-query";
import { AxiosResponse } from "axios";

const gerarRelatorioEstagiario = async ({
  queryKey,
}: {
  queryKey: [string];
}) => {
  const [idEstagiario] = queryKey;

  const response: AxiosResponse<Blob> = await Api.get(
    `/${estagiarioRoute}/GerarRelatorioEstagiario?idEstagiario=${idEstagiario}`,
    {
      responseType: "blob",
    }
  );
  return response.data;
};

export const useGerarRelatorioEstagiario = (params: {
  idEstagiario: string;
}) => {
  const shouldFetch = !!params.idEstagiario;
  return useQuery({
    queryKey: [params.idEstagiario],
    queryFn: gerarRelatorioEstagiario,
    enabled: shouldFetch,
    retry: false,
  });
};
