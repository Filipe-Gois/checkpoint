import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { useContext, useEffect } from "react";
import { Label } from "../text";
import { DifficultyIcon } from "../icons";
import moment from "moment";
import { tarefaType } from "@/types/tarefaTypes";
import { ModalProps } from ".";
import useEntregarTarefa from "@/hooks/Tarefa/useEntregarTarefa";
import Dropzone from "../Dropzone";
import { z } from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AuthContext } from "@/providers/AuthProvider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { useCorrigirTarefa } from "@/hooks/Tarefa/useCorrigirTarefa";
import { Input } from "../input";
import { useToast } from "@/hooks/use-toast";
import { FormControl, FormErrorMessage } from "@chakra-ui/react";
import { Textarea } from '../ui/textarea';

type ModalViewTaskPros = ModalProps & {
    tarefa: tarefaType | null;
};

const schemaEntrega = z.object({
    arquivosDeImagens: z
        .array(z.instanceof(File))
        .refine((files) => files.length > 0, {
            message: "Anexe pelo menos um arquivo!",
        })
        .refine(
            (files) => files.every((file) => file.size <= 5 * 1024 * 1024), // 5MB
            "Cada arquivo deve ter no máximo 5MB!"
        ),
});

const schemaCorrecao = z.object({
    statusCorrecao: z.union([
        z.literal("2"),
        z.literal("3"),
    ]),
    descricaoCorrecao: z.string().min(1, { message: "Informe a descrição da correção!" })
});

type formValues = z.infer<typeof schemaEntrega> & z.infer<typeof schemaCorrecao>;

export default function ModalViewTask({ isOpen, setIsOpen, tarefa }: ModalViewTaskPros) {
    const { userGlobalData } = useContext(AuthContext);
    const isEstagiario = userGlobalData?.Role === "Estagiario";
    const { mutate: entregarTarefa, isPending: isPendingEntregarTarefa, isSuccess: isSuccessEntregarTarefa, isError: isErrorEntregarTarefa } = useEntregarTarefa();
    const { mutate: corrigirTarefa, isPending: isPendingCorrigirTarefa, isSuccess: isSuccessCorrigirTarefa, isError: isErrorCorrigirTarefa } = useCorrigirTarefa();
    const { toast } = useToast();
    const schemaAtual = isEstagiario ? schemaEntrega : schemaCorrecao;

    const {
        watch,
        setValue,
        handleSubmit,
        register,
        control,
        formState: { errors }
    } = useForm<formValues>({
        resolver: zodResolver(schemaAtual),
        defaultValues: {
            statusCorrecao: tarefa?.status === "Errada" ? "2" : "3",
            descricaoCorrecao: tarefa?.descricaoCorrecao ?? ""
        }
    });
    const statusSelecionado = watch("statusCorrecao")
    const arquivos = watch("arquivosDeImagens")

    const submitForm = (data: formValues) => {

        if (isEstagiario) {
            entregarTarefa({
                idTarefa: tarefa!.idTarefa,
                arquivos: data.arquivosDeImagens
            });
            return
        }
        corrigirTarefa({
            idTarefa: tarefa!.idTarefa,
            descricaoCorrecao: data.descricaoCorrecao ?? "",
            statusCorrecao: Number(data.statusCorrecao)
        });
    };

    useEffect(() => {

        if (isSuccessCorrigirTarefa) {
            toast({
                title: "Sucesso",
                description: `Tarefa corrigida!`,
            });

        }

        if (isSuccessEntregarTarefa) {
            toast({
                title: "Sucesso",
                description: `Tarefa entregue com sucesso!`,
            });
        }
        if (isErrorCorrigirTarefa) {
            toast({
                title: "Erro",
                description: `Erro ao corrigir tarefa.`,
            });

        }

        if (isErrorEntregarTarefa) {
            toast({
                title: "Erro",
                description: `Erro ao entregar tarefa.`,
            });
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isSuccessCorrigirTarefa, isSuccessEntregarTarefa, isErrorCorrigirTarefa, isErrorEntregarTarefa]);

    const height = window.innerHeight;

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogHeader></DialogHeader>
            <DialogContent className="h-4/6 w-3/4 md:w-full md:max-w-[700px] flex flex-col justify-evenly rounded font-poppins gap-12">
                <DialogTitle className="md:text-2xl text-center text-xl font-semibold text-blueScale-600">
                    {isEstagiario ? tarefa?.titulo : `${tarefa?.titulo} - ${tarefa?.nome + " " + tarefa?.sobreNome}`}
                </DialogTitle>
                <DialogDescription className="hidden"></DialogDescription>
                <form
                    className="flex w-full h-full flex-col justify-center px-2 gap-4"
                    onSubmit={handleSubmit(submitForm)}
                >
                    <div style={{ maxHeight: height * 0.4 }} className={`w-full flex flex-col px-2 rounded-md overflow-x-hidden`}>
                        {isEstagiario && tarefa?.status === "Pendente" ?
                            <FormControl isInvalid={!!errors.arquivosDeImagens?.message}>
                                <Dropzone totalArquivos={arquivos ? arquivos.length : 0} onFilesChange={(files) => setValue("arquivosDeImagens", files)} />
                                {errors.arquivosDeImagens?.message && <FormErrorMessage>{errors.arquivosDeImagens?.message}</FormErrorMessage>}
                            </FormControl>
                            : (!isEstagiario || isEstagiario && tarefa?.status !== "Pendente") &&

                            <div className="w-full flex flex-col">

                                <Label styles={"text-black text-left"}>Arquivos anexados pelo estagiário:</Label>
                                {/* Mídias anexadas pelo estagiario */}
                                {tarefa && tarefa.urlMidiasEntreguesEstagiario && tarefa.urlMidiasEntreguesEstagiario.length > 0 ? (
                                    <ul className="w-full">
                                        {tarefa.urlMidiasEntreguesEstagiario.map((url, index) => (
                                            <li
                                                key={index}
                                                className="flex justify-between p-2 text-sm text-gray-700 bg-gray-200 cursor-pointer rounded-md my-1"
                                                onClick={() => window.open(url, "_blank")}
                                            >
                                                {url.split("/").pop()}
                                            </li>
                                        )
                                        )}
                                    </ul>
                                ) : <p>Nenhum arquivo anexado pelo estagiário.</p>}
                            </div>
                        }


                        <div className="flex flex-col md:flex-row justify-between w-full h-max">
                            <div className="flex flex-col w-3/5">

                                <Label styles={"text-black"}>Descrição:</Label>
                                <p>{tarefa?.descricao}</p>
                            </div>

                            <div className="">
                                <Label styles={"text-black text-left"}>Prazo:</Label>
                                <DialogDescription className={"text-black text-left"}>
                                    {moment(tarefa?.prazo).format("DD/MM/YYYY")}
                                </DialogDescription>
                            </div>

                        </div>
                        <div>
                            <div className="flex flex-col md:flex-row justify-between gap-4 mb-4">
                                <div className="flex flex-col justify-center w-max !h-full">
                                    <Label styles={"text-black"}>Dificuldade:</Label>
                                    <DifficultyIcon
                                        difficulty={tarefa?.dificuldade ?? "Facil"}
                                        isLarge={false}
                                    />
                                </div>

                                <div className="flex flex-col justify-center w-max !h-full">
                                    <Label styles={"text-black"}>Status:</Label>
                                    <div className={`${tarefa?.status === "Certa"
                                        ? "bg-green-500"
                                        : tarefa?.status === "EmAnalise" || tarefa?.status === "Pendente"
                                            ? "bg-yellow-500"
                                            : "bg-red-500"
                                        } text-white rounded-lg w-24 h-10 flex items-center justify-center text-center`}>{tarefa?.status === "EmAnalise" ? "Em análise" : tarefa?.status}</div>
                                </div>


                            </div>

                            <div className="">

                                <Label styles={"text-black text-left"}>Arquivos disponibilizados pelo gestor:</Label>
                                {/* Mídias anexadas pelo gestor */}
                                {tarefa?.urlMidias && tarefa.urlMidias.length > 0 ? (
                                    <ul className="w-full">
                                        {tarefa.urlMidias.map((url, index) => (
                                            <li
                                                key={index}
                                                className="flex justify-between p-2 text-sm text-gray-700 bg-gray-200 cursor-pointer rounded-md my-1"
                                                onClick={() => window.open(url, "_blank")}
                                            >
                                                {url.split("/").pop()}
                                            </li>
                                        ))}
                                    </ul>
                                ) : <p>Nenhum arquivo foi disponibilizado.</p>}


                            </div>


                            <div className="flex flex-col w-full gap-4 mt-4">
                                {
                                    !isEstagiario &&
                                    <div className="w-full">
                                        <label htmlFor="dificuldade" className="block text-sm font-bold text-gray-700">
                                            Correção
                                        </label>
                                        <Controller
                                            name="statusCorrecao"
                                            control={control}
                                            render={({ field }) => (
                                                <Select value={String(field.value)} onValueChange={(value) => field.onChange(value)}>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Selecione o status...">{statusSelecionado === "2" ? "Errada" : "Certa"}</SelectValue>
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="2">Errada</SelectItem>
                                                        <SelectItem value="3">Certa</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            )}
                                        />
                                    </div>
                                }

                                {(!isEstagiario || (isEstagiario && tarefa?.descricaoCorrecao)) && (
                                    <div className="w-full">
                                        <label htmlFor="descricaoCorrecao" className="block text-sm font-bold text-gray-700">
                                            Descrição da correção
                                        </label>
                                        <FormControl isInvalid={!!errors.descricaoCorrecao?.message}>
                                            <Textarea
                                                disabled={isEstagiario}
                                                {...register("descricaoCorrecao")}
                                                id="descricaoCorrecao"
                                                placeholder="Digite a descrição da correção da tarefa..."
                                                className="resize-none h-32 rounded-md focus-visible:ring-blue-400 focus-visible:outline-none bg-gray-100"
                                            />
                                            {errors.descricaoCorrecao?.message && (
                                                <FormErrorMessage>{errors.descricaoCorrecao?.message}</FormErrorMessage>
                                            )}
                                        </FormControl>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="flex items-end flex-col w-full h-full mt-4">
                            <Button
                                type="submit"
                                className={`font-bold text-xl rounded-2xl !w-full h-12 self-center ${(tarefa?.status === "Pendente" && !isEstagiario) || (tarefa?.status !== "Pendente" && isEstagiario) || isSuccessCorrigirTarefa || isSuccessEntregarTarefa ? "bg-gray-500" : ""}`}
                                disabled={isPendingEntregarTarefa || isPendingCorrigirTarefa || (tarefa?.status === "Pendente" && !isEstagiario) || (tarefa?.status !== "Pendente" && isEstagiario) || isSuccessCorrigirTarefa || isSuccessEntregarTarefa}
                            >
                                {isEstagiario ? "Entregar" : "Corrigir"}
                            </Button>
                        </div>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
