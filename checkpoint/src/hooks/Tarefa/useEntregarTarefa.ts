import Api, { tarefaRoute } from "@/Service/Api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export interface MarkTaskAsDoneParams {
  idTarefa: string;
  arquivos?: File[];
}

const entregarTarefa = async ({ idTarefa, arquivos }: MarkTaskAsDoneParams) => {
  const formData = new FormData();

  if (arquivos && arquivos.length > 0) {
    arquivos.forEach((file) => {
      formData.append("arquivos", file);
    });
  }

  await Api.postForm(
    `/${tarefaRoute}/EntregarTarefa?idTarefa=${idTarefa}`,
    formData
  );
};

const useEntregarTarefa = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: entregarTarefa,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["listarTarefasParaOsGestores"],
      });
      queryClient.invalidateQueries({
        queryKey: ["listarTarefasDoEstagiario"],
      });
    },
  });
};

export default useEntregarTarefa;
