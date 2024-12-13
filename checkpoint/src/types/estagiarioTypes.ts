import { pontuacaoEstagiario } from "./pontuacaoTypes";
import { totalPresencasType } from "./presencasType";
import { squadBuscarEstagiarioTypes, squadTypes } from "./squadTypes";
import { userRole } from "./userTypes";

export type estagiarioType = {
  isBolsista: boolean;
  pontuacao: number;
  inicioExpediente: string;
  fimExpediente: string;
  matrícula: string;
  squad: squadTypes[];
  presencas: totalPresencasType;
  idUsuario: string;
  nome: string;
  sobreNome: string;
  emailPessoal: string;
  emailCorporativo: string;
  role: userRole;
  isActive: boolean;
};

//objeto vindo da rota "BuscarEstagiario"
export type estagiarioUniqueType = {
  presencas: totalPresencasType;
  inicioExpediente: string;
  fimExpediente: string;
  matrícula: string;
  squad: squadBuscarEstagiarioTypes;
};

//objeto vindo da rota "listarSquadsComEstatisticasDosEstagiarios" dentro do squad
export type estatisticasEstagiario = {
  presencas: totalPresencasType;
  inicioExpediente: string;
  fimExpediente: string;
  matrícula: string;
  idEstagiario: string;
  nome: string;
  sobreNome: string;
  estagiariosPontuacao: pontuacaoEstagiario[];
};
