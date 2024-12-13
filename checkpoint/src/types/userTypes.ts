export type userAuth = {
  idUsuario: string;
  email: string;
  EmailCorporativo: string;
  name: string;
  SobreNome: string;
  Role: userRole;
};

export type userRole = "Administrador" | "Gestor" | "Estagiario";

export type userPayloadTokenType = {
  jti: string;
  email: string;
  EmailCorporativo: string;
  name: string;
  SobreNome: string;
  Role: userRole;
  exp: number;
  iss: string;
  aud: string;
};

export type userStats = {
  isBolsista: boolean;
  pontuacao: number;
  inicioExpediente: string;
  fimExpediente: string;
  matrícula?: string;
  presencas: string;
  idUsuario: string;
  nome: string;
  sobreNome: string;
  emailPessoal: string;
  emailCorporativo: string;
  role: userRole;
  isActive: boolean;
  squad?: {
    idSquad: string;
    nome: string;
  };
};

export type cadastrarUsuarioType = {
  nome: string;
  sobreNome: string;
  emailPessoal: string;
  emailCorporativo: string;
  role: "0" | "1" | "2";
  idExpediente?: string;
};
