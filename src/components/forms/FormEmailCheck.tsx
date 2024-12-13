import Link from "next/link";
import { ButtonLogin } from "../button";
import { Input } from "../input";
import { TextLink } from "../text";
import { useForm, } from "react-hook-form";
import { FormValueValidateEmail, validateEmailSchema, } from "@/types/formTypes";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProps } from ".";

const FormEmailCheck = ({
    onSubmit,
    isLoading,
}: FormProps<{ email: string }>) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormValueValidateEmail>({
        resolver: zodResolver(validateEmailSchema),
    });

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="w-[90%] flex flex-col items-center gap-4"
        >
            <label className="text-start w-full text-white" htmlFor="email">Informe seu E-mail</label>
            <Input
                type="email"
                registerInput={register}
                nameInput="email"
                placeholder="E-mail..."
                errorMessage={errors.email?.message}
                label="Informe seu E-mail"
                isWhite
            />

            <ButtonLogin isLoading={isLoading}>Continuar</ButtonLogin>
            <TextLink>
                <Link href="/">Cancelar</Link>
            </TextLink>
        </form>
    );
};
export default FormEmailCheck