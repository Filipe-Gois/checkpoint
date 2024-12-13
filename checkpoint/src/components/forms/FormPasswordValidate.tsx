import { ButtonLogin } from "../button";
import { Input } from "../input";
import { useForm, } from "react-hook-form";
import { FormValueValidateSenha, validateSenhaSchema, } from "@/types/formTypes";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProps } from ".";

const FormPasswordValidate = ({
    onSubmit,
    isLoading,
}: FormProps<FormValueValidateSenha>) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormValueValidateSenha>({
        resolver: zodResolver(validateSenhaSchema),
    });

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="w-[90%] flex flex-col gap-2 items-center"
        >
            <label className="text-start w-full text-white" htmlFor="email">Informe sua senha</label>
            <Input
                registerInput={register}
                nameInput="senha"
                isPassword
                placeholder="Senha..."
                label="Informe sua Senha"
                errorMessage={errors.senha?.message}
                isWhite
            />
            <label className="text-start w-full text-white" htmlFor="email">Confirme sua senha</label>
            <Input
                registerInput={register}
                nameInput="senha2"
                isPassword
                placeholder="Confirmar senha..."
                label="Confirme sua Senha"
                errorMessage={errors.senha2?.message}
                isWhite
            />


            <div className="w-full sm:w-full flex justify-center mt-10 mb-3">
                <ButtonLogin isLoading={isLoading}>Confirmar</ButtonLogin>
            </div>
        </form>
    );
};

export default FormPasswordValidate