import Api, { tarefaRoute } from "@/Service/Api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
export interface Tarefa {
  titulo: string;
  descricao: string;
  prazo: string;
  dificuldade: number;
  idEstagiarioAtribuido: string;
  arquivosDeImagens?: File[];
}

const cadastrarTarefa = async ({
  titulo,
  descricao,
  prazo,
  dificuldade,
  idEstagiarioAtribuido,
  arquivosDeImagens,
}: Tarefa) => {
  const formData = new FormData();

  formData.append("titulo", titulo);
  formData.append("descricao", descricao);
  formData.append("prazo", prazo);
  formData.append("dificuldade", dificuldade.toString()); // Envia dificuldade como número (não mais como string)
  formData.append("idEstagiarioAtribuido", idEstagiarioAtribuido);

  if (arquivosDeImagens && arquivosDeImagens.length > 0) {
    arquivosDeImagens.forEach((file) => {
      if (file instanceof File) {
        formData.append(`arquivosDeImagens`, file);
      }
    });
  }

  await Api.postForm(`/${tarefaRoute}/CadastrarTarefa`, formData);
};

const useCadastrarTarefa = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: cadastrarTarefa,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["listarTarefasParaOsGestores"],
      });
    },
  });
};

export default useCadastrarTarefa;
