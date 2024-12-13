import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import React, { Dispatch, SetStateAction, useContext, useEffect } from "react";
import moment from "moment";
import { useJustificarFalta } from "@/hooks/JustificativaFaltaHooks/useJustificarFalta";
import { AuthContext } from "@/providers/AuthProvider";
import { useForm } from "react-hook-form";
import { ModalProps } from ".";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { BeatLoader } from "react-spinners";
import Dropzone from "../Dropzone";
import { FormControl, FormErrorMessage } from "@chakra-ui/react";
import { useToast } from "@/hooks/use-toast";

type ModalJustifyProps = ModalProps & {
    setIsOpenSelecionarData: Dispatch<SetStateAction<boolean>>
    isOpenSelecionarData: boolean
    data: Date | null
}

const schema = z.object({
    Arquivo: z.array(z.instanceof(File))
        .min(1, { message: "Anexe um arquivo!" })
        .max(1, { message: "Somente 1 arquivo é permitido!" })
        .refine(
            (files) => files[0]?.size <= 5 * 1024 * 1024,
            { message: "O arquivo deve ter no máximo 5MB!" }
        ),
});

type formValue = z.infer<typeof schema>

export default function ModalJustify({ isOpen, setIsOpen, setIsOpenSelecionarData, data }: ModalJustifyProps) {

    const { mutate, isSuccess, isPending, isError } = useJustificarFalta()
    const { userGlobalData } = useContext(AuthContext)
    const { formState: { errors }, handleSubmit, setValue, watch, } = useForm<formValue>({
        resolver: zodResolver(schema)
    });
    const { toast } = useToast()
    const arquivo = watch("Arquivo");

    const justificarFalta = ({ Arquivo }: formValue) => mutate({ Data: moment(data).format("YYYY-MM-DD"), IdEstagiario: userGlobalData?.idUsuario ?? "", Arquivo: Arquivo[0] })


    const fecharModais = () => {
        setIsOpen(prev => !prev)
        setIsOpenSelecionarData(prev => !prev)
    }

    useEffect(() => {

        if (isSuccess) {
            toast({
                title: "Sucesso",
                description: "Falta justificada com sucesso!"
            })
            fecharModais();
        }
        if (isError) {
            toast({
                title: "Erro",
                description: "Erro ao enviar justificativa de falta."
            })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isSuccess, isError]);

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>

            <DialogContent className="flex flex-col justify-evenly items-center h-4/6 w-3/4 md:w-full md:max-w-[700px] rounded">
                <DialogHeader className="flex flex-col justify-center items-center">
                    <DialogTitle className="text-2xl md:text-4xl  text-blueScale-600 font-poppins">Justificar falta</DialogTitle>
                    <DialogDescription className="font-poppins text-lg">
                        A falta será analisada e justificada para o dia {moment(data).format("DD/MM/YYYY") ?? ""}
                    </DialogDescription>
                </DialogHeader>
                <form
                    onSubmit={handleSubmit(justificarFalta)}
                    className="flex flex-col items-center gap-4 w-[80%]">
                    <FormControl isInvalid={!!errors.Arquivo?.message}>
                        <Dropzone
                            onFilesChange={(file) => setValue("Arquivo", file)}
                            maximoArquivos={1}
                            totalArquivos={arquivo ? arquivo.length : 0}
                        />
                        {errors.Arquivo?.message && <FormErrorMessage>{errors.Arquivo?.message ?? "Anexe um arquivo!"}</FormErrorMessage>}
                    </FormControl>
                    {/* por algum motivo é preciso envolver o button em uma div, caso contrário não é possível alterar sua largura */}
                    <div className="w-full flex justify-center hover: scale-125 transition-all duration-200">
                        <Button type="submit" className="font-bold w-full rounded-[15px] font-poppins mt-2" disabled={isPending}>
                            {isPending ? <BeatLoader color="white" size={10} /> : "Confirmar"}
                        </Button>
                    </div>
                </form>

            </DialogContent>
        </Dialog>
    );
}
