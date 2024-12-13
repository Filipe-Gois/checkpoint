import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "../text";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../ui/select";
import { Button } from "../ui/button";
import { z } from "zod";
import { justificativaFaltaType } from "@/types/justificativaFaltaTypes";
import { Controller, useForm } from "react-hook-form";
import { useValidarJustificativaFalta } from "@/hooks/JustificativaFaltaHooks/useValidarJustificarFalta";
import { ModalProps } from ".";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import moment from "moment";
import { useToast } from "@/hooks/use-toast";
import { FormControl, FormErrorMessage } from "@chakra-ui/react";
import { Input } from "../input";

const schema = z.object({
    motivoRejeicao: z.string().nullable(),
    statusValidacao: z.string().refine((value) => ["1", "2"].includes(value), {
        message: "Informe um status válido!",
    }),
}).refine((data) => data.statusValidacao !== "2" || !!data.motivoRejeicao, {
    message: "Campo obrigatório para o status da validacao 'Rejeitado'!",
    path: ["motivoRejeicao"], // Especifica onde o erro será exibido
});

type formValues = z.infer<typeof schema>;

type ModalViewMoreJustificationProps = ModalProps & {
    justificativa: justificativaFaltaType
}

const ModalViewMoreJustification = ({ justificativa, isOpen, setIsOpen }: ModalViewMoreJustificationProps) => {

    const stringToNumberStatus = justificativa.statusValidacao === "Pendente" ? "0" : justificativa.statusValidacao === "Aprovado" ? "1" : "2";
    const { toast } = useToast();
    const { register, control, watch, handleSubmit, setValue, formState: { errors } } = useForm<formValues>({
        resolver: zodResolver(schema),
        defaultValues: {
            statusValidacao: stringToNumberStatus,
            motivoRejeicao: justificativa.motivoRejeicao
        }
    });

    const statusValidacaoSelecionado = watch("statusValidacao")

    const { mutate, isSuccess, isError } = useValidarJustificativaFalta();

    const submitForm = ({ statusValidacao, motivoRejeicao }: formValues) => {
        mutate({
            statusValidacao: Number(statusValidacao),
            motivoRejeicao,
            idJustificativaFalta: justificativa.idJustificativaFalta
        });
    };

    useEffect(() => {
        if (isSuccess) {
            const status = statusValidacaoSelecionado === "1" ? "aprovada" : "reprovada"
            toast({
                title: "Sucesso",
                description: `Justificativa ${status}!`
            });
            setIsOpen(prev => !prev)
        }
        if (isError) {
            toast({
                title: "Erro",
                description: `Erro ao validar justificativa de falta!`
            });
            setIsOpen(prev => !prev)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isSuccess, isError]);


    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="flex flex-col justify-around h-4/6 w-3/4 md:w-full md:max-w-[700px] rounded font-poppins">
                <DialogHeader>
                    <DialogTitle className="md:text-2xl text-center text-xl font-semibold text-blueScale-600 w-full font-poppins">
                        {justificativa.nome} {justificativa.sobreNome}
                    </DialogTitle>
                    <DialogDescription className="hidden"></DialogDescription>
                </DialogHeader>
                <form className="w-full" onSubmit={handleSubmit(submitForm)}>
                    <Label styles={"text-semibold text-center"}>
                        {moment(justificativa.data).format("DD/MM/YYYY")}
                    </Label>

                    <ul className="mt-2 w-full">
                        <li className="flex cursor-pointer justify-between p-2 text-sm text-gray-700 bg-gray-200 rounded-md my-1"
                            onClick={() => window.open(justificativa.urlArquivo, "_blank")}
                        >
                            {justificativa.urlArquivo.split("/").pop()}
                        </li>

                    </ul>

                    <Label>Status</Label>

                    <Controller
                        name="statusValidacao"
                        control={control}
                        render={({ field }) => (
                            <FormControl isInvalid={!!errors.statusValidacao?.message}>
                                <Select
                                    value={field.value?.toString()}
                                    onValueChange={(value) => {
                                        field.onChange(value);
                                        setValue("motivoRejeicao", null)
                                    }}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent id="status">
                                        <SelectItem value={"0"} disabled>
                                            Pendente
                                        </SelectItem>
                                        <SelectItem value={"1"}>Aprovado</SelectItem>
                                        <SelectItem value={"2"}>Rejeitado</SelectItem>
                                    </SelectContent>
                                </Select>

                                {errors.statusValidacao?.message && <FormErrorMessage>{errors.statusValidacao?.message}</FormErrorMessage>}
                            </FormControl>

                        )}
                    />
                    {statusValidacaoSelecionado === "2" && (
                        <div className="my-4">
                            <Label styles={"text-black"}>Descrição</Label>
                            <Input
                                label="Motivo da rejeição"
                                placeholder="Motivo da rejeição"
                                registerInput={register}
                                nameInput="motivoRejeicao"
                                errorMessage={errors.motivoRejeicao?.message}
                            />
                        </div>
                    )}

                    <Button
                        type="submit"
                        className="flex self-center font-bold rounded-[15px] !scale-100 !w-full mt-4"
                    >
                        CONFIRMAR
                    </Button>

                </form>
            </DialogContent>
        </Dialog>
    );
}

export default ModalViewMoreJustification