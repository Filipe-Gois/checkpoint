import Api, { squadRoute } from "@/Service/Api";
import { squadTypes } from "@/types/squadTypes";
import { useQuery } from "@tanstack/react-query";

const listarSquads = async (): Promise<squadTypes[]> => {
  try {
    const response = await Api.get<squadTypes[]>(
      `${squadRoute}/ListarTodosOsSquads`
    );
    return response.data;
  } catch (error) {
    console.error("Erro ao listar squads:", error);
    throw new Error("Erro ao buscar os squads.");
  }
};

const useListarSquads = () => {
  return useQuery<squadTypes[]>({
    queryKey: ["squads"],
    queryFn: listarSquads,
  });
};

export default useListarSquads;
