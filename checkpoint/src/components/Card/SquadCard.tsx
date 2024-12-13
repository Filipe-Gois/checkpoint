import { UsersRound } from "lucide-react";
import clsx from "clsx";
import TooltipComponent from "../TooltipComponent";

type SquadCardProps = {
    nome: string;
    totalIntegrantes: number;
    isSelected: boolean;
    className?: string

};
const SquadCard = ({ nome, totalIntegrantes, isSelected, className }: SquadCardProps) => {

    return (
        <div
            className={clsx(
                "transition-all ease-in-out duration-300 hover:scale-105 cursor-pointer font-normal flex w-52 h-28 rounded-2xl flex-col p-6 gap-2 group",
                {
                    "bg-[#002346] text-white": isSelected, // Estado selecionado
                    "bg-transparent border-2 border-[#002346] text-[#002346] hover:bg-[#002346] hover:text-white": !isSelected,
                }, className
            )}
        >
            <span>
                <TooltipComponent
                    text={nome}
                    maxLength={10}
                    triggerClassName={clsx(
                        "text-[#002346] font-poppins font-semibold",
                        {
                            "text-white": isSelected,
                            "group-hover:text-white": !isSelected,
                        }
                    )}
                />
            </span>
            <span className="flex font-normal w-full h-full justify-between font-poppins">
                <p>Integrantes: {totalIntegrantes}</p>
                <UsersRound size={20} />
            </span>
        </div>

    );
};

export default SquadCard;
