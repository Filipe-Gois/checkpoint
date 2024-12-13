import Api, { justificativaFaltaRoute } from "@/Service/Api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

type putJustificativaTypes = {
  idJustificativaFalta: string;
  motivoRejeicao: string | null;
  statusValidacao: number;
};

const validarJustificativaFalta = async (params: putJustificativaTypes) =>
  await Api.put(`/${justificativaFaltaRoute}`, params);

export const useValidarJustificativaFalta = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: validarJustificativaFalta,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["justificativas"],
      });
    },
  });
};
