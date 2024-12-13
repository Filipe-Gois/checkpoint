import { Step } from "react-joyride";

const DashboardSteps: Step[] = [
  {
    target: ".selecionar-squad-1",
    content: "Selecione um squad para gerenciar.",
  },
  {
    target: ".selecionar-estagiario-squad-2",
    content: "Selecione um estagiário nesse squad.",
  },
  {
    target: ".gerar-relatorio-estagiario-3",
    content: "Gere um relatório em pdf com as métricas do estagiário.",
  },
  {
    target: ".filtro-pontuacao-squad-4",
    content: "Filtre as métricas do squad de acordo com o tempo.",
  },
];

const TaskSteps: Step[] = [
  {
    target: ".filtro-tarefas-1",
    content: "Filtre as tarefas por aqui.",
  },
  {
    target: ".cadastrar-tarefas-2",
    content: "Cadastre uma tarefa.",
  },
  {
    target: ".visualizar-tarefa-3",
    content: "Visualize os dados da tarefa aqui.",
  },
];

const RankingSteps: Step[] = [
  {
    target: ".filtro-ranking-nome-1",
    content: "Encontre um estagiário pelo nome.",
  },
  {
    target: ".filtro-ranking-tipo-2",
    content: "Ordene a tabela de acordo com o filtro.",
  },
];

const UserControlSteps: Step[] = [
  {
    target: ".filtro-usercontrol-parametros-1",
    content: "Encontre um usuário pelo nome, matrícula ou email.",
  },
  {
    target: ".justificativas-usercontrol-2",
    content: "Visualize as justificativas de falta dos estagiários.",
  },
  {
    target: ".cadastrar-usuario-usercontrol-3",
    content: "Cadastre um novo usuário.",
  },
  {
    target: ".visualizar-usuario-4",
    content: "Visualize os dados de um usuário.",
  },

  {
    target: ".arquivar-desarquivar-usuario-usercontrol-5",
    content: "Arquive ou desarquive um usuário.",
  },
];

const SquadControlSteps: Step[] = [
  {
    target: ".filtro-squadcontrol-nome-1",
    content: "Encontre um squad pelo nome.",
  },
  {
    target: ".cadastrar-squad-squadcontrol-2",
    content: "Cadastre um novo squad.",
  },
  {
    target: ".editar-squad-3",
    content: "Edite os dados de um squad.",
  },
];

const AllStepsTour = [
  ...DashboardSteps,
  ...TaskSteps,
  ...RankingSteps,
  ...UserControlSteps,
  ...SquadControlSteps,
];

export default AllStepsTour;
