import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { ModalProps, ModalViewMoreJustification } from ".";
import { justificativaFaltaType, } from "@/types/justificativaFaltaTypes";
import { useListarTodasAsJustificativasDeFalta } from "@/hooks/JustificativaFaltaHooks/useListarTodasAsJustificativasDeFalta";
import { useState } from "react";
import { Clock, ThumbsDown, ThumbsUp } from "lucide-react";
import moment from "moment";
import { tv } from "tailwind-variants";
import NoContentSearch from "../NoContentSearch";

const JustificationCard = ({ justificativa, }: { justificativa: justificativaFaltaType; }) => {
    const size = 30;
    const color = tv({
        variants: {
            status: {
                Aprovado: "text-darkBlue",
                Pendente: "text-[#FBC02D]",
                Rejeitado: "text-[#D32F2F]",
            },
        },
        defaultVariants: {
            status: "Pendente", // Valor padrão caso não seja especificado
        },
    })
    const [isOpen, setIsOpen] = useState(false);

    const validarIcon = justificativa.statusValidacao === "Aprovado" ? <ThumbsUp color="#002346" size={size} /> : justificativa.statusValidacao === "Pendente" ? <Clock size={size} color={"#FBC02D "} /> : <ThumbsDown color="#D32F2F " size={size} />

    return (
        <div className="transition-all duration-300 ease-in-out shadow-lg justify-between flex items-center w-full font-poppins h-max mb-4 rounded py-2 px-4 md:py-4 md:px-8 border hover:border-blueScale-200">

            <div className="flex-col md:flex-row flex gap-4 justify-between w-full h-full items-center">
                <div className="p-2 rounded transition-all duration-300 ease-in-out hover:scale-110 cursor-pointer">
                    {validarIcon}
                </div>
                <div className="flex w-full flex-col md:flex-row h-full justify-between">

                    <div className="flex flex-col">
                        <span className="text-center md:text-start font-bold">{justificativa.nome + " " + justificativa.sobreNome}</span>
                        <span className="text-center md:text-start font-normal">Matrícula: {justificativa.matrícula}</span>
                        <span className="text-center md:text-start font-normal">{moment(justificativa.data).format("DD/MM/YYYY")}</span>
                    </div>

                    <div className="flex flex-col justify-between">
                        <span className={color({ status: justificativa.statusValidacao, className: "text-center md:text-start font-poppins" })}>{justificativa.statusValidacao}</span>
                        <button className=" underline md:text-end transition-all duration-300 ease-in-out hover:scale-110 font-poppins" onClick={() => setIsOpen(prev => !prev)}>Ver mais</button>
                    </div>


                </div>

            </div>

            <ModalViewMoreJustification isOpen={isOpen} setIsOpen={setIsOpen} justificativa={justificativa} />
        </div>
    );
}

const ModalViewJustification = ({ isOpen, setIsOpen, }: ModalProps) => {
    const { data: justificativas } = useListarTodasAsJustificativasDeFalta();

    const height = window.innerHeight;

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="h-4/6 w-3/4 md:w-full md:max-w-[700px] rounded">
                <DialogHeader className="flex flex-col h-max gap-6">
                    <DialogTitle className="md:text-4xl text-2xl font-semibold  text-center text-blueScale-600 font-poppins">
                        Justificativas de falta
                    </DialogTitle>
                    <DialogDescription className="font-poppins text-lg text-center">Analise as justificativas de falta dos estagiários.</DialogDescription>
                </DialogHeader>
                <div className="h-full">
                    <div style={{ maxHeight: height * 0.3 }} className={`w-full rounded-md overflow-x-hidden`}>
                        {justificativas && justificativas.length ? (
                            justificativas.map((justificativa) => (
                                <JustificationCard
                                    key={justificativa.idJustificativaFalta}
                                    justificativa={justificativa}
                                />
                            ))
                        ) : (
                            <NoContentSearch text="Nenhuma justificativa encontrada!" />
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}


export default ModalViewJustification