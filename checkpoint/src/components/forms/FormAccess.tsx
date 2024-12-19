import { ButtonLogin } from "../button";
import { Input } from "../input";
import { useForm } from "react-hook-form";
import { authSchema, FormValuesAuth } from "@/types/formTypes";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProps } from ".";
import { TextLink } from "../text";
import Link from "next/link";

const FormAccess = ({ onSubmit, isLoading }: FormProps<FormValuesAuth>) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValuesAuth>({
    resolver: zodResolver(authSchema),
    defaultValues: {
      email: "fythoy@gmail.com",
      senha: "12345",
    },
  });

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-[90%] flex flex-col gap-4 items-center mt-5"
    >
      <label className="text-start w-full text-white" htmlFor="email">Informe seu E-mail</label>
      <Input
        type="email"
        id="email"
        registerInput={register}
        nameInput="email"
        placeholder="E-mail..."
        errorMessage={errors.email?.message}
        isWhite
        label="E-mail"
      />

      <label className="text-start w-full text-white" htmlFor="senha">Informe sua senha</label>
      <Input
        registerInput={register}
        nameInput="senha"
        isPassword
        placeholder="Senha..."
        errorMessage={errors.senha?.message}
        isWhite
      />

      <div className="w-full flex justify-end mt-3 mb-3">
        <TextLink>
          <Link href="/emailcheck">Esqueceu sua senha?</Link>
        </TextLink>
      </div>

      <ButtonLogin isLoading={isLoading}>Login</ButtonLogin>
    </form>
  );
};

export default FormAccess;
