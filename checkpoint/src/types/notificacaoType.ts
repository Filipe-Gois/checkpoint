export type notificacaoType = {
  idNotificacao: string;
  titulo: string;
  descricao: string;
  dataEHora: string;
  idDestinatarios: string[];
  tipoNotificacao:
    | "LancamentoDeTarefa"
    | "EntregaDeTarefa"
    | "CorrecaoDeTarefa"
    | "EnvioDeJustificativaDeFalta"
    | "ValidacaoDeJustificativaDeFalta";
};
