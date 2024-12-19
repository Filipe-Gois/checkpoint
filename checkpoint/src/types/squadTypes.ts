import { estagiarioType, estatisticasEstagiario } from "./estagiarioTypes";
import { gestorType } from "./gestorTypes";
import { pontuacaoEstagiario } from "./pontuacaoTypes";

export type squadTypes = {
  idSquad: string;
  nome: string;
  gestores: gestorType[];
  estagiarios: estagiarioType[];
};

export type squadBuscarEstagiarioTypes = {
  idSquad: string;
  nome: string;
  gestores: gestorType[];
  estagiariosPontuacao: pontuacaoEstagiario[];
};

//objeto vindo da rota "listarSquadsComEstatisticasDosEstagiarios"
export type squadsComEstatisticasEstagiariosType = {
  gestores: gestorType[];
  estagiarios: estatisticasEstagiario[];
  idSquad: string;
  nome: string;
};
