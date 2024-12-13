import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { tv } from "tailwind-variants";

type TooltipComponentProps = {
    text: string;
    maxLength?: number;
    triggerClassName?: string; // Para permitir estilos externos
};

const tooltipTriggerStyles = tv({
    base: "text-black w-max",
    variants: {
        isTruncated: {
            true: "cursor-pointer font-semibold", // Estilo quando o texto está truncado
            false: "font-normal", // Estilo quando o texto não está truncado
        },
    },
});

const TooltipComponent = ({ text, maxLength = 10, triggerClassName }: TooltipComponentProps) => {
    const isTextoMaiorQueOEsperado = text.length > maxLength;

    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger
                    className={tooltipTriggerStyles({
                        isTruncated: isTextoMaiorQueOEsperado,
                        className: triggerClassName, // Permite adicionar classes externas
                    })}
                >
                    {isTextoMaiorQueOEsperado
                        ? text.substring(0, maxLength) + "..."
                        : text}
                </TooltipTrigger>
                <TooltipContent className="text-black">
                    {text}
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
};

export default TooltipComponent;
