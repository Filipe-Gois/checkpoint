import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "../input";
import useCadastrarSquad from "@/hooks/Squad/useCadastrarSquad";
import React, { useEffect } from "react";
import { ModalProps } from ".";
import { z } from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { MultiSelect } from "../MultiSelect";
import { BeatLoader } from "react-spinners";
import { userStats } from "@/types/userTypes";
import { useToast } from "@/hooks/use-toast";
import { FormControl, FormErrorMessage } from "@chakra-ui/react";

const schema = z.object({
    nome: z.string().min(1, "Insira o nome!"),
    idEstagiarios: z.array(z.string().min(1, "Selecione ao menos um estagiário!"))
        .min(1, "Selecione ao menos um estagiário!")
        .max(6, "Não pode selecionar mais de 6 estagiários!"), // Validação de no máximo 6 estagiários
    idGestores: z.array(z.string().min(1, "Selecione ao menos um gestor!"))
        .min(1, "Selecione ao menos um gestor!"),
});

type formValue = z.infer<typeof schema>;

type ModalAddSquadProps = ModalProps & {
    estagiarios: userStats[]
    gestores: userStats[]
}

export default function ModalAddSquad({ isOpen, setIsOpen, estagiarios, gestores }: ModalAddSquadProps) {
    const { toast } = useToast();
    const { mutate: cadastrarSquad, isSuccess, isPending, isError } = useCadastrarSquad();
    const { register, handleSubmit, control, formState: { errors }, setValue } = useForm<formValue>({
        resolver: zodResolver(schema),
        defaultValues: {
            idEstagiarios: [],
            idGestores: [],
        }
    });

    const submitSquad = ({ nome, idEstagiarios, idGestores }: formValue) => {
        cadastrarSquad({
            nome,
            idEstagiarios: idEstagiarios,
            idGestores: idGestores
        })
    }

    useEffect(() => {
        if (isSuccess) {
            toast({
                title: "Sucesso",
                description: `Squad cadastrado!`
            });
            setIsOpen(false);
        }
        if (isError) {
            toast({
                title: "Erro",
                description: `Erro ao cadastrar squad.`
            });
            setIsOpen(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isSuccess, isError]);

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="flex flex-col justify-evenly items-center h-4/6 w-3/4 md:w-full md:max-w-[700px] rounded font-poppins">
                <DialogHeader className="flex flex-col justify-center items-center mb-8">
                    <DialogTitle className="font-poppins text-2xl md:text-4xl font-semibold text-blueScale-600">Cadastro de squad</DialogTitle>
                    <DialogDescription className="mb-12 font-poppins text-lg font-normal text-gray-400">Cadastre um squad dentro da plataforma!</DialogDescription>
                </DialogHeader>
                <div className="w-full max-h-[400px] overflow-y-auto rounded-md overflow-x-hidden">

                    <form onSubmit={handleSubmit(submitSquad)} className="flex flex-col gap-4 w-full max-w-full px-2">
                        <label htmlFor="nome" className="w-full max-w-full">Nome</label>
                        <Input
                            registerInput={register}
                            placeholder="Nome do Squad"
                            nameInput="nome"
                            errorMessage={errors.nome?.message}
                            className="w-full max-w-full"
                        />

                        <FormControl isInvalid={!!errors.idEstagiarios} className="w-full max-w-full">
                            <label htmlFor="estagiarios" className="w-full max-w-full">Estagiários</label>
                            <Controller
                                name="idEstagiarios"
                                control={control}
                                render={({ field }) => (
                                    <MultiSelect
                                        {...field}
                                        onValueChange={(value) => {
                                            setValue("idEstagiarios", value)
                                        }}
                                        options={estagiarios.map(g => ({ label: g.nome + " " + g.sobreNome, value: g.idUsuario }))}
                                        className="w-full max-w-full !bg-[#ECECEC]"
                                        placeholder="Selecioar estagiários"
                                        variant="inverted"
                                        animation={2}
                                        maxCount={2}
                                    />
                                )}
                            />
                            <FormErrorMessage>{errors.idEstagiarios?.message}</FormErrorMessage>
                        </FormControl>

                        <FormControl isInvalid={!!errors.idGestores} className="w-full max-w-full">
                            <label htmlFor="gestores" className="w-full max-w-full">Mentores</label>
                            <Controller
                                name="idGestores"
                                control={control}
                                render={({ field }) => (
                                    <MultiSelect
                                        {...field}
                                        options={gestores.map(g => ({ label: g.nome + " " + g.sobreNome, value: g.idUsuario }))}
                                        className="w-full max-w-full !bg-[#ECECEC]"
                                        onValueChange={(value) => {
                                            setValue("idGestores", value)
                                        }}
                                        placeholder="Selecionar mentores"
                                        variant="inverted"
                                        animation={2}
                                        maxCount={2}
                                    />
                                )}
                            />
                            <FormErrorMessage>{errors.idGestores?.message}</FormErrorMessage>
                        </FormControl>

                        <div className="flex justify-center !w-full">
                            <Button
                                type="submit"
                                className="font-bold rounded-[15px] w-full h-[53.36px] shadow-md"
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
