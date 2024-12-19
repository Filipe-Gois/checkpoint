import axios from "axios";

const urlApi = process.env.NEXT_PUBLIC_API_ROUTE as string;

const Api = axios.create({ baseURL: urlApi });

//rotas
export const estagiarioRoute = `Estagiario`;
export const expedienteRoute = `Expediente`;
export const loginRoute = `Login`;
export const pontuacaoRoute = `Pontuacao`;
export const presencaRoute = `Presenca`;
export const recuperarSenhaRoute = `RecuperarSenha`;
export const squadRoute = `Squad`;
export const tarefaRoute = `Tarefa`;
export const usuarioRoute = `Usuario`;
export const justificativaFaltaRoute = `JustificativaFalta`;
export const notificacaoRoute = `Notificacao`;

export default Api;
