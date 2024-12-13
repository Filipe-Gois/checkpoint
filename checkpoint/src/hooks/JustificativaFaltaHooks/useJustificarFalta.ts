import Api, { justificativaFaltaRoute } from "@/Service/Api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

type params = {
  IdEstagiario: string;
  Data: string;
  Arquivo: File;
};

const justificarFalta = async ({ Arquivo, Data, IdEstagiario }: params) => {
  const formData = new FormData();

  formData.append("Arquivo", Arquivo);
  formData.append("IdEstagiario", IdEstagiario);
  formData.append("Data", Data);

  await Api.postForm(`/${justificativaFaltaRoute}`, formData);
};

export const useJustificarFalta = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: justificarFalta,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["justificativas"],
      });
    },
  });
};
