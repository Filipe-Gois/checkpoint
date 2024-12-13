export type justificativaFaltaType = {
  idJustificativaFalta: string;
  statusValidacao: "Pendente" | "Aprovado" | "Rejeitado";
  motivoRejeicao?: string;
  data: string;
  urlArquivo: string;
  matrícula: string;
  nome: string;
  sobreNome: string;
};
