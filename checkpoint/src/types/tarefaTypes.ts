export type dificuldadeTarefaType = "Facil" | "Medio" | "Dificil";
export type statusTarefaType = "Pendente" | "EmAnalise" | "Certa" | "Errada";
export type statusExibicaoTarefaType = "Pendentes" | "Realizadas";

export type tarefaType = {
  idTarefa: string;
  titulo: string;
  descricao: string;
  prazo: string;
  dificuldade: dificuldadeTarefaType;
  status: statusTarefaType;
  urlMidias: string[];
  urlMidiasEntreguesEstagiario: string[];
  nome?: string;
  sobreNome?: string;
  descricaoCorrecao?: string;
};

export type cadastrarTarefaUsuarioType = {
  idEstagiario: string;
  nome: string;
  sobrenome: string;
};
