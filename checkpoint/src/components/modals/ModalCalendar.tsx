import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { useContext, useState } from "react";
import { Calendar } from "../ui/calendar";
import { ptBR } from "date-fns/locale";
import * as Modals from ".";
import { useListarFaltasNaoJustificadasDoEstagiarioNosUltimos30Dias } from "@/hooks/Presenca/useListarFaltasNaoJustificadasDoEstagiarioNosUltimos30Dias";
import { AuthContext } from "@/providers/AuthProvider";

export default function ModalCalendar({ isOpen, setIsOpen }: Modals.ModalProps) {
    const [date, setDate] = useState<Date | undefined>(undefined);
    const [isOpenModal, setIsOpenModal] = useState(false);
    const { userGlobalData } = useContext(AuthContext);

    const { data: faltas } = useListarFaltasNaoJustificadasDoEstagiarioNosUltimos30Dias(userGlobalData?.idUsuario ?? "");

    const isDateEqual = (date1: Date, date2: Date) => {
        const d1 = new Date(date1);
        const d2 = new Date(date2);
        d1.setHours(0, 0, 0, 0);
        d2.setHours(0, 0, 0, 0);
        return d1.getTime() === d2.getTime();
    };

    const submitButton = () => {
        setIsOpenModal(prev => !prev);
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="flex flex-col justify-around items-center h-4/6 w-3/4 md:w-full md:max-w-[700px] rounded">
                <DialogHeader>
                    <DialogTitle className="md:text-3xl text-xl font-semibold font-poppins text-blueScale-600 w-full">
                        Calendário
                    </DialogTitle>
                </DialogHeader>

                <Calendar
                    classNames={{
                        nav_button: "text-blueScale-600 hover:bg-blueScale-100 p-2 rounded-md",
                        day_selected: "bg-blueScale-600 text-white font-bold",
                        day: "w-full h-full rounded transition-all duration-300",
                    }}
                    disabled={(date) => Array.isArray(faltas) ? !faltas.some(falta => isDateEqual(new Date(falta), date)) : false}
                    locale={ptBR}
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    className="rounded-md border shadow-md"
                />

                <button
                    onClick={submitButton}
                    disabled={!date}
                    className={`font-bold p-3 rounded-xl w-full max-w-[278px] font-poppins ${date ? "bg-blueScale-600" : "bg-gray-500"} text-white`}
                    type="submit">
                    {date ? "Justificar falta" : "Selecione uma data"}
                </button>
            </DialogContent>

            {isOpenModal && <Modals.ModalJustify isOpenSelecionarData={isOpen} setIsOpenSelecionarData={setIsOpen} data={date!} isOpen={isOpenModal} setIsOpen={setIsOpenModal} />}
        </Dialog>
    );
}
