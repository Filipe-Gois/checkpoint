import Api, { usuarioRoute } from "@/Service/Api";
import { userStats } from "@/types/userTypes";
import { useQuery } from "@tanstack/react-query";

const listarUsuarios = async (): Promise<userStats[]> => {
  try {
    const response = await Api.get<userStats[]>(
      `${usuarioRoute}/ListarTodosOsUsuarios`
    );
    return response.data;
  } catch (error) {
    console.error("Erro ao listar usuários:", error);
    throw new Error("Erro ao buscar os usuários.");
  }
};

const useListarUsuarios = () => {
  return useQuery<userStats[]>({
    queryKey: ["usuarios"],
    queryFn: listarUsuarios,
  });
};

export default useListarUsuarios;
