import { dificuldadeTarefaType, statusExibicaoTarefaType, statusTarefaType, tarefaType } from "@/types/tarefaTypes";
import { userRole } from "@/types/userTypes";
import moment from "moment"
import { Dispatch, SetStateAction } from "react";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";
import NoContentSearch from "../NoContentSearch";

type TableTaskProps = {
    selectedStatus: statusExibicaoTarefaType | "null";
    userType?: userRole;
    tarefas: tarefaType[]
    setIsOpen: Dispatch<SetStateAction<boolean>>
    setTarefaSelecionada: Dispatch<SetStateAction<tarefaType | null>>
}

const TableTask = ({ selectedStatus, setIsOpen, tarefas, setTarefaSelecionada }: TableTaskProps) => {

    const statusMap: Record<statusTarefaType, statusExibicaoTarefaType> = {
        Pendente: "Pendentes",
        EmAnalise: "Realizadas",
        Certa: "Realizadas",
        Errada: "Realizadas",
    };

    const filteredData = selectedStatus === "Pendentes" || selectedStatus === "Realizadas"
        ? tarefas.filter((row) => statusMap[row.status] === selectedStatus)
        : tarefas;


    const getDifficultyButtonStyle = (difficulty: dificuldadeTarefaType): string => {
        switch (difficulty) {
            case "Facil":
                return "bg-green-500 text-white px-2 py-2 rounded w-auto sm:w-[25%] lg:w-[40%] flex items-center justify-center text-center";
            case "Medio":
                return "bg-yellow-500 text-white px-2 py-2 rounded w-auto sm:w-[25%] lg:w-[40%] flex items-center justify-center text-center";
            case "Dificil":
                return "bg-red-500 text-white px-2 py-2 rounded w-auto sm:w-[25%] lg:w-[40%] flex items-center justify-center text-center";
            default:
                return "";
        }
    };

    const abrirModalVerMais = (tarefa: tarefaType) => {
        setIsOpen(prev => !prev)
        setTarefaSelecionada(tarefa)
    }

    return (
        <ScrollArea>
            {filteredData.length ? <table className="w-full h-full text-left font-poppins">
                <thead>
                    <tr>
                        <th className="px-6 py-3 text-sm font-medium text-black">Título</th>
                        <th className="px-6 py-3 text-sm font-medium text-black">Prazo</th>
                        <th className="px-6 py-3 text-sm font-medium text-black">Dificuldade</th>
                        <th className="px-6 py-3 text-sm font-medium text-black"></th>
                    </tr>
                </thead>
                <tbody>
                    {filteredData.map((row, index) => (
                        <tr onClick={() => abrirModalVerMais(row)} key={row.idTarefa} className={`cursor-pointer border bg-white text-black hover:text-white hover:bg-sky-950 hover:transition-all duration-100 `}>
                            <td className="px-6 py-4 text-sm">{row.titulo}</td>
                            <td className="px-6 py-4 text-sm">{moment(row.prazo).format("DD/MM/YYYY")}</td>
                            <td className="px-6 py-4 text-sm">
                                <span className={getDifficultyButtonStyle(row.dificuldade)}>
                                    {/* <FontAwesomeIcon icon={faCircle} className="text-[10px] mx-1" /> */}
                                    {row.dificuldade}
                                </span>
                            </td>
                            <td className="px-6 py-4 text-lg md:text-md">
                                <button className={`px-4 py-2 ${index === 0 ? "visualizar-tarefa-3" : ""} `} >
                                    Ver mais
                                </button>
                            </td>

                        </tr>
                    ))}
                </tbody>
            </table> : <NoContentSearch text="Nenhum tarefa encontrada!" />}

            <ScrollBar orientation="horizontal" />
        </ScrollArea>

    );
};

export default TableTask;