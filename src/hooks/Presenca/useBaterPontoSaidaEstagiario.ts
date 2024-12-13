import Api, { presencaRoute } from "@/Service/Api";
import { useMutation } from "@tanstack/react-query";

const baterPontoSaidaEstagiario = async (idEstagiario: string) => {
  await Api.put(`/${presencaRoute}?idEstagiario=${idEstagiario}`);
};

export const useBaterPontoSaidaEstagiario = () => {
  return useMutation({
    mutationFn: baterPontoSaidaEstagiario,
  });
};
