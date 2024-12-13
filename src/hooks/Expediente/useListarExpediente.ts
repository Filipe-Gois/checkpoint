import Api, { expedienteRoute } from "@/Service/Api";
import { expedienteTypes } from "@/types/expedienteTypes";
import { useQuery } from "@tanstack/react-query";

const listarExpediente = async (): Promise<expedienteTypes[]> => {
  try {
    const response = await Api.get<expedienteTypes[]>(`/${expedienteRoute}`);
    return response.data;
  } catch (error) {
    console.error("Erro ao listar expediente:", error);
    throw new Error("Erro ao buscar os expedientes.");
  }
};

const useListarExpediente = () => {
  return useQuery<expedienteTypes[]>({
    queryKey: ["expedientes"],
    queryFn: listarExpediente,
  });
};

export default useListarExpediente;
