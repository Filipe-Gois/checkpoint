"use client";
import { notificacaoType } from "@/types/notificacaoType";
import moment from "moment";
import { CircleCheck, FileCheck2, ShieldCheck, Upload, UserPen } from "lucide-react";
import { tv } from "tailwind-variants";
import TooltipComponent from "@/components/TooltipComponent";

const NotificationCard = (noti: notificacaoType) => {

    const { dataEHora, descricao, idNotificacao, titulo, tipoNotificacao } = noti;

    const validarTipoNotificacao = () => {

        const color = "#000"
        const size = 25

        return tipoNotificacao === "LancamentoDeTarefa" ? <Upload color={color} size={size} /> : tipoNotificacao === "EntregaDeTarefa" ? <CircleCheck color={color} size={size} /> : tipoNotificacao === "CorrecaoDeTarefa" ? <UserPen color={color} size={size} /> : tipoNotificacao === "EnvioDeJustificativaDeFalta" ? <FileCheck2 color={color} size={size} /> : <ShieldCheck color={color} size={size} />
    }

    const bgIconStyle = tv({
        base: "p-2 rounded",
        variants: {
            tipo: {
                LancamentoDeTarefa: "bg-blue-100", // Mantido
                EntregaDeTarefa: "bg-green-100", // Mantido
                CorrecaoDeTarefa: "bg-yellow-100", // Mantido
                EnvioDeJustificativaDeFalta: "bg-red-100", // Mantido
                ValidacaoDeJustificativaDeFalta: "bg-[#77A6C6]", // Substituição do roxo
                Default: "bg-gray-100", // Mantido
            },
        },
        defaultVariants: {
            tipo: "Default",
        },
    });

    return (
        <div className="flex w-full justify-between items-center h-full gap-5" key={idNotificacao}>
            <div className={bgIconStyle({ tipo: tipoNotificacao })}>
                {validarTipoNotificacao()}
            </div>

            <div className="flex w-full h-full flex-col">
                <div className="flex w-full h-full justify-between">
                    <TooltipComponent triggerClassName="font-poppins font-bold" text={titulo} />
                    <span>{moment(dataEHora).format('DD/MM/YYYY')}</span>
                </div>
                <TooltipComponent triggerClassName="font-dmsans font-medium" text={descricao} />
            </div>
        </div>
    )
}

export default NotificationCard