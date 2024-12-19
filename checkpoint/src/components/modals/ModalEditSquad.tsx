import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "../input";
import React, { useEffect } from "react";
import { ModalProps } from ".";
import { squadTypes } from "@/types/squadTypes";
import { z } from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAtualizarSquad } from "@/hooks/Squad/useAtualizarSquad";
import { BeatLoader } from "react-spinners";
import { MultiSelect } from "../MultiSelect";
import { userStats } from "@/types/userTypes";
import { useToast } from "@/hooks/use-toast";
import { FormControl, FormErrorMessage } from "@chakra-ui/react";

type ModalEditSquadProps = ModalProps & {
    squadSelecionado: squadTypes | null
    estagiarios: userStats[]
    gestores: userStats[]
}

type optionsType = { value: string, label: string }

const schema = z.object({
    nome: z.string().min(1, "Insira o nome!"),
    idEstagiarios: z.array(z.string().min(1, "Selecione ao menos um estagiário!"))
        .min(1, "Selecione ao menos um estagiário!")
        .max(6, "Não pode selecionar mais de 6 estagiários!"), // Validação de no máximo 6 estagiários
    idGestores: z.array(z.string().min(1, "Selecione ao menos um gestor!"))
        .min(1, "Selecione ao menos um gestor!"),
});

type formValue = z.infer<typeof schema>;

export default function ModalEditSquad({ isOpen, setIsOpen, squadSelecionado, estagiarios, gestores }: ModalEditSquadProps) {
    const todosOsEstagiarios: optionsType[] = [...squadSelecionado?.estagiarios.map(g => ({ value: g.idUsuario, label: g.nome + " " + g.sobreNome })) ?? [], ...estagiarios.map(x => ({ label: x.nome + " " + x.sobreNome, value: x.idUsuario }))]

    const { mutate, isSuccess, isPending, isError } = useAtualizarSquad()
    const { toast } = useToast();
    const { register, handleSubmit, control, formState: { errors }, setValue } = useForm<formValue>({
        resolver: zodResolver(schema),
        defaultValues: {
            nome: squadSelecionado?.nome ?? "",
            idEstagiarios: squadSelecionado?.estagiarios.map(x => x.idUsuario) ?? [],
            idGestores: squadSelecionado?.gestores.map(x => x.idUsuario) ?? [],
        }
    });

    const submitForm = (params: formValue) => {
        mutate({ ...params, idSquad: squadSelecionado?.idSquad ?? "" })
    }

    useEffect(() => {
        if (isSuccess) {
            toast({
                title: "Sucesso",
                description: `Squad atualizado!`
            });
            setIsOpen(prev => !prev)
        }
        if (isError) {
            toast({
                title: "Erro",
                description: `Erro ao atualizar squad.`
            });
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isSuccess, isError]);

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>

            <DialogContent className="flex flex-col justify-evenly items-center gap-9 h-4/6 w-3/4 md:w-full md:max-w-[700px] rounded">
                <DialogHeader className="flex flex-col justify-center items-center mb-4 font-poppins">
                    <DialogTitle className="md:text-4xl text-2xl text-blueScale-600">EDITAR SQUAD</DialogTitle>
                    <DialogDescription>Editar as equipes responsáveis por desempenhar as tarefas</DialogDescription>
                </DialogHeader>

                <div className="w-full max-h-[400px] overflow-y-auto rounded-md overflow-x-hidden">
                    <form
                        onSubmit={handleSubmit(submitForm)}
                        className="flex flex-col gap-4 w-full px-4">

                        <label htmlFor="nome">Nome</label>
                        <Input
                            idInput="nome"
                            registerInput={register}
                            placeholder="Nome do Squad"
                            nameInput="nome"
                            errorMessage={errors.nome?.message}
                            className="w-full max-w-full"
                        />

                        <FormControl isInvalid={!!errors.idEstagiarios} className="w-full max-w-full">
                            <label htmlFor="estagiarios">Estagiários</label>
                            <Controller
                                name="idEstagiarios"
                                control={control}
                                render={({ field }) => (
                                    <MultiSelect
                                        {...field}
                                        defaultValue={squadSelecionado?.estagiarios.map(e => e.idUsuario)}
                                        options={todosOsEstagiarios}
                                        className="!w-full !bg-[#ECECEC]"
                                        onValueChange={(value) => {
                                            setValue("idEstagiarios", value);
                                        }}
                                        placeholder="Selecione os estagiários"
                                        variant="inverted"
                                        animation={2}
                                        maxCount={2}
                                    />
                                )}
                            />
                            <FormErrorMessage>{errors.idEstagiarios?.message}</FormErrorMessage>
                        </FormControl>

                        <FormControl isInvalid={!!errors.idEstagiarios} className="w-full max-w-full">
                            <label htmlFor="gestores">Mentores</label>
                            <Controller
                                name="idGestores"
                                control={control}
                                render={({ field }) => (
                                    <MultiSelect
                                        {...field}

                                        defaultValue={squadSelecionado?.gestores.map(x => x.idUsuario)}
                                        options={gestores.map(g => ({ label: g.nome + " " + g.sobreNome, value: g.idUsuario }))}
                                        className="!w-full bg-[#ECECEC]"
                                        onValueChange={(value) => {
                                            setValue("idGestores", value);
                                        }}
                                        placeholder="Selecione os mentores"
                                        variant="inverted"
                                        animation={2}
                                        maxCount={2}
                                    />
                                )}
                            />
                            <FormErrorMessage>{errors.idGestores?.message}</FormErrorMessage>
                        </FormControl>

                        <div className="flex justify-center w-full">
                            <Button
                                type="submit"
                                className="font-bold rounded-[15px] !w-full h-[53.36px] shadow-md font-poppins mt-4"
                                disabled={isPending}
                            >
                                {isPending ? <BeatLoader color="white" size={10} /> : "Atualizar"}
                            </Button>
                        </div>
                    </form>
                </div>
            </DialogContent>
        </Dialog>
    );
}