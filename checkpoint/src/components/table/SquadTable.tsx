import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import Image from "next/image";
import { useState } from "react";
import useListarSquads from "@/hooks/Squad/useListarTodosSquads";
import { ModalEditSquad } from "../modals";
import { squadTypes } from "@/types/squadTypes";
import { userStats } from "@/types/userTypes";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { ScrollBar } from "../ui/scroll-area";
import NoContentSearch from "../NoContentSearch";

type SquadTableProps = {
    estagiarios: userStats[]
    gestores: userStats[]
    searchBarValue: string
}

const SquadTable = ({ searchBarValue, estagiarios, gestores }: SquadTableProps) => {
    const { data: squads } = useListarSquads();

    const squad = squads && !searchBarValue ? squads : squads && searchBarValue ? squads.filter(s => s.nome.toLowerCase().includes(searchBarValue.toLowerCase())) : []

    const [squadSelecionado, setSquadSelecionado] = useState<squadTypes | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = (squad: squadTypes) => {
        setSquadSelecionado(squad);
        setIsModalOpen(true);
    };

    return (
        <ScrollArea>
            {squad.length ? <Table className="shadow-md w-full rounded-lg mt-4 font-poppins font-medium">
                <TableHeader className="rounded-t-lg">
                    <TableRow className="h-8">
                        <TableHead className="h-8 font-semibold">Nome</TableHead>
                        <TableHead className="h-8 font-semibold text-center">Editar</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {squad && Array.isArray(squad) ? (
                        squad.map((x) => (
                            <TableRow key={x.idSquad}>
                                <TableCell className="font-semibold">{x.nome}</TableCell>
                                <TableCell className="flex items-center justify-center h-full w-full">
                                    <button className="editar-squad-3" onClick={() => openModal(x)}>
                                        <Image
                                            className="w-auto h-auto"
                                            alt="Símbolo de um lápis preto, edita ao clicar"
                                            width={12}
                                            height={12}
                                            src="/icons/EditIcon.png"
                                        />
                                    </button>

                                </TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <></>
                    )}
                </TableBody>

                {isModalOpen && <ModalEditSquad estagiarios={estagiarios} gestores={gestores} squadSelecionado={squadSelecionado} isOpen={isModalOpen} setIsOpen={setIsModalOpen} />}
            </Table> : <NoContentSearch text="Nenhum squad encontrado!" />}
            <ScrollBar orientation="horizontal" />
        </ScrollArea>
    );
};


export default SquadTable