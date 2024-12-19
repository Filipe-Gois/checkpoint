import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "../input";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import useCadastrarUsuario from "@/hooks/usuarioHooks/useCadastrarUsuario";
import { SelectItem } from "@radix-ui/react-select";
import { useEffect } from "react";
import useListarExpediente from "@/hooks/Expediente/useListarExpediente";
import { ModalProps } from ".";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { BeatLoader } from "react-spinners";
import { useToast } from "@/hooks/use-toast";
import { FormControl, FormErrorMessage } from "@chakra-ui/react";

const schema = z
    .object({
        nome: z.string().min(1, "Insira o nome!"),
        sobreNome: z.string().min(1, "Insira o sobrenome!"),
        emailPessoal: z.string().email("O email deve ser válido!"),
        emailCorporativo: z.string().email("O email deve ser válido!"),
        senha: z.string().min(5, "A senha deve conter no mínimo 5 dígitos!"),
        role: z.string().refine((value) => ["0", "1", "2"].includes(value), {
            message: "Informe um tipo de usuário válido!",
        }),
        idExpediente: z.string().optional(),
    })
    .refine((data) => data.role !== "2" || !!data.idExpediente, {
        message: "O campo 'idExpediente' é obrigatório para o tipo de usuário 'Estagiário'!",
        path: ["idExpediente"],
    });

type formValue = z.infer<typeof schema>;

type inputArr = { name: "nome" | "sobreNome" | "emailPessoal" | "emailCorporativo" | "senha", label: "Nome" | "SobreNome" | "Email" | "Email Corporativo" | "Senha", placeholder: string }

const inputs: inputArr[] = [
    { name: "nome", label: "Nome", placeholder: "Nome do Usuário" },
    { name: "sobreNome", label: "SobreNome", placeholder: "Sobrenome do Usuário" },
    { name: "emailPessoal", label: "Email", placeholder: "Digite seu email..." },
    { name: "emailCorporativo", label: "Email Corporativo", placeholder: "Digite seu email corporativo..." },
    { name: "senha", label: "Senha", placeholder: "Digite sua senha..." },
]

export default function ModalAddUser({ isOpen, setIsOpen }: ModalProps) {
    const { mutate: cadastrarUsuario, isSuccess, isPending, isError } = useCadastrarUsuario();
    const { data: expedientes, isLoading: isExpedienteLoading, isError: isExpedienteError } = useListarExpediente();
    const { toast } = useToast();
    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
        control,
    } = useForm<formValue>({
        resolver: zodResolver(schema),
        defaultValues: {
            role: "0",
        },
    });
    const roleValue = watch("role");
    const expedienteValue = watch("idExpediente");

    const handleSubmitUser = (data: formValue) => {
        cadastrarUsuario({
            ...data,
            role: Number(data.role),
        });

    };

    const tipoUsuarioEscolhido =
        roleValue === "2" ? "Estagiário" : roleValue === "1" ? "Gestor" : "Administrador";

    useEffect(() => {
        if (isSuccess) {
            toast({
                title: "Sucesso",
                description: `Usuário cadastrado!`,
            });
            setIsOpen(false);
        }
        if (isError) {
            toast({
                title: "Erro",
                description: `Erro ao cadastrar usuário.`,
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isSuccess, isError]);

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogHeader className="hidden">
            </DialogHeader>
            <DialogContent className="rounded flex flex-col justify-evenly items-center h-4/6 w-3/4 md:w-full md:max-w-[700px] font-poppins">
                <DialogTitle className="text-center font-poppins md:text-4xl text-2xl font-semibold text-blueScale-600">
                    Cadastro de usuário
                </DialogTitle>
                <DialogDescription className="text-center font-poppins text-lg font-normal text-gray-400">
                    Cadastre um usuário dentro da plataforma!
                </DialogDescription>
                <div className="w-full max-h-[400px] overflow-y-auto rounded-md overflow-x-hidden">
                    <form onSubmit={handleSubmit(handleSubmitUser)} className="flex flex-col w-full gap-2 px-4">
                        {inputs.map((field) => (
                            <FormControl key={field.name} isInvalid={!!errors[field.name as keyof formValue]}>
                                <label htmlFor={field.name}>{field.label}</label>
                                <Input
                                    isPassword={field.name === "senha"}
                                    nameInput={field.name}
                                    registerInput={register}
                                    placeholder={field.placeholder}
                                />
                                <FormErrorMessage>{errors[field.name as keyof formValue]?.message}</FormErrorMessage>
                            </FormControl>
                        ))}

                        <FormControl isInvalid={!!errors.role}>
                            <label htmlFor="tipoUsuario">Tipo de Usuário</label>
                            <Controller
                                name="role"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        onValueChange={(value) => {
                                            if (value && value.trim() !== "") {
                                                field.onChange(value);
                                            }
                                        }}
                                        value={field.value}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Selecione a função...">
                                                {tipoUsuarioEscolhido}
                                            </SelectValue>
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="0">Administrador</SelectItem>
                                            <SelectItem value="1">Gestor</SelectItem>
                                            <SelectItem value="2">Estagiário</SelectItem>
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                            <FormErrorMessage>{errors.role?.message}</FormErrorMessage>
                        </FormControl>

                        {roleValue === "2" && (
                            <FormControl isInvalid={!!errors.idExpediente}>
                                <label htmlFor="expediente">Expediente</label>
                                <Controller
                                    name="idExpediente"
                                    control={control}
                                    render={({ field }) => (
                                        <Select
                                            value={field.value}
                                            onValueChange={(value) => {
                                                if (value && value.trim() !== "") {
                                                    field.onChange(value);
                                                }
                                            }}
                                        >
                                            <SelectTrigger className="mt-4">
                                                <SelectValue placeholder="Selecione o expediente...">
                                                    {
                                                        expedientes?.find(
                                                            (expediente) =>
                                                                expediente.idExpediente === expedienteValue
                                                        )?.descricao ?? "Selecione o expediente..."
                                                    }
                                                </SelectValue>
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectGroup>
                                                    {isExpedienteLoading ? (
                                                        <p>Carregando...</p>
                                                    ) : isExpedienteError ? (
                                                        <p>Erro ao carregar expedientes.</p>
                                                    ) : expedientes ? (
                                                        expedientes.map((exp) => (
                                                            <SelectItem
                                                                key={exp.idExpediente}
                                                                value={exp.idExpediente}
                                                            >
                                                                {`${exp.descricao}: ${exp.inicioExpediente.substring(
                                                                    0,
                                                                    5
                                                                )} - ${exp.fimExpediente.substring(0, 5)}`}
                                                            </SelectItem>
                                                        ))
                                                    ) : (
                                                        <p>Nenhum expediente encontrado.</p>
                                                    )}
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                    )}
                                />
                                <FormErrorMessage>{errors.idExpediente?.message}</FormErrorMessage>
                            </FormControl>
                        )}

                        <div className="flex justify-center w-full">
                            <Button
                                type="submit"
                                className="font-bold rounded-[15px] !w-full h-[53.36px] shadow-md mt-2"
                            >
                                {isPending ? <BeatLoader color="white" size={10} /> : "Cadastrar"}
                            </Button>
                        </div>
                    </form>
                </div>
            </DialogContent>
        </Dialog>
    );
}
