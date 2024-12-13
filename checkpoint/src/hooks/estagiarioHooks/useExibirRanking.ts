import Api, { estagiarioRoute, usuarioRoute } from "@/Service/Api";
import { rankingType } from "@/types/ranking";
import { useQuery } from "@tanstack/react-query";

const exibirRanking = async (): Promise<rankingType[]> => {
  try {
    const response = await Api.get<rankingType[]>(
      `${estagiarioRoute}/ExibirRanking`
    );
    return response.data;
  } catch (error) {
    console.error("Erro ao exibir o ranking:", error);
    throw new Error("Erro ao buscar os dados do ranking.");
  }
};

const useExibirRanking = () => {
  return useQuery<rankingType[]>({
    queryKey: ["useExibirRanking"],
    queryFn: exibirRanking,
  });
};

export default useExibirRanking;
