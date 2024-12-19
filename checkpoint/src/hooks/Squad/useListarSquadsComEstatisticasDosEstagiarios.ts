import Api, { squadRoute } from "@/Service/Api";
import { squadsComEstatisticasEstagiariosType } from "@/types/squadTypes";
import { useQuery } from "@tanstack/react-query";

const listarSquadsComEstatisticasDosEstagiarios = async () => {
  const { data } = await Api.get<squadsComEstatisticasEstagiariosType[]>(
    `/${squadRoute}/ListarSquadsComEstatisticasDosEstagiarios`
  );
  return data;
};

export const useListarSquadsComEstatisticasDosEstagiarios = () => {
  return useQuery({
    queryKey: ["listarSquadsComEstatisticasDosEstagiarios"],
    queryFn: listarSquadsComEstatisticasDosEstagiarios,
  });
};
