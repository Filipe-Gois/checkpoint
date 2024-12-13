import Api, { justificativaFaltaRoute } from "@/Service/Api";
import { justificativaFaltaType } from "@/types/justificativaFaltaTypes";
import { useQuery } from "@tanstack/react-query";

const obterJustificativa = async () => {
  const response = await Api.get<justificativaFaltaType[]>(
    `/${justificativaFaltaRoute}/ListarTodasAsJustificativasDeFalta`
  );
  return response.data;
}; 

export const useListarTodasAsJustificativasDeFalta = () => {
  return useQuery({
    queryKey: ["justificativas"],
    queryFn: obterJustificativa,
  });
};
