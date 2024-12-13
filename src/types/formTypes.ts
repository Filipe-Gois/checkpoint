import { z } from "zod";

export const authSchema = z.object({
  email: z.string().email("O email deve ser válido!"),
  senha: z.string().min(5, "A senha deve conter no mínimo 5 dígitos!"),
});

export type FormValuesAuth = z.infer<typeof authSchema>;

export const validateEmailSchema = z.object({
  email: z.string().email("O email deve ser válido!"),
});

export type FormValueValidateEmail = z.infer<typeof validateEmailSchema>;

export const validateCodeSchema = z.object({
  code: z.string().length(6),
});

export type FormValueValidateCode = z.infer<typeof validateEmailSchema>;

export const validateSenhaSchema = z
  .object({
    senha: z.string().min(5, "A senha deve ter no mínimo 5 dígitos!"),
    senha2: z.string().min(5, "A senha deve ter no mínimo 5 dígitos!"),
  })
  .refine((data) => data.senha === data.senha2, {
    message: "As senhas devem ser iguais.",
    path: ["senha"], // Aponta o erro para o campo 'senha2'
  });

export type FormValueValidateSenha = z.infer<typeof validateSenhaSchema>;
