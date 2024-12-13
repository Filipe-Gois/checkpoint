import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { FaCrown } from "react-icons/fa";
import useExibirRanking from "@/hooks/estagiarioHooks/useExibirRanking";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";
import { filtroRankingTypes } from "@/types/ranking";
import NoContentSearch from "../NoContentSearch";

interface TableRankingProps {
  selectedStatusRanking: filtroRankingTypes | "null";
  searchBarValue: string;
}

const RankingTable = ({
  selectedStatusRanking,
  searchBarValue,
}: TableRankingProps) => {
  const { data: ranking, isLoading, isError } = useExibirRanking();

  if (isLoading) {
    return <p>Carregando...</p>;
  }

  if (isError) {
    return <p>Ocorreu um erro ao carregar os usuários.</p>;
  }

  if (!ranking || ranking.length === 0) {
    return <p>Nenhum usuário encontrado.</p>;
  }

  // Ordena o ranking original
  const orderedRanking = [...ranking];
  if (selectedStatusRanking === "Pontuação") {
    orderedRanking.sort((a, b) => b.pontuacao - a.pontuacao);
  } else if (selectedStatusRanking === "Frequência") {
    orderedRanking.sort((a, b) => b.presenca - a.presenca);
  }

  // Filtra o ranking sem alterar a ordem original
  const filteredRanking = orderedRanking.filter(
    (user) =>
      user.nome.toLowerCase().includes(searchBarValue.toLowerCase()) ||
      user.sobreNome.toLowerCase().includes(searchBarValue.toLowerCase())
  );

  return (
    <ScrollArea>
      {filteredRanking.length ? <Table className="shadow-md w-full rounded-lg mt-10 font-poppins font-medium">
        <TableHeader className="rounded-t-lg hover:rounded-t-lg">
          <TableRow className="h-8 hover:rounded-t-lg">
            <TableHead className="h-8 font-semibold text-black"></TableHead>
            <TableHead className="h-8 font-semibold text-black">Posição</TableHead>
            <TableHead className="h-8 font-semibold text-black">Nome</TableHead>
            <TableHead className="h-8 font-semibold text-black">Frequência</TableHead>
            <TableHead className="h-8 font-semibold text-black">Pontuação</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredRanking.map((user) => {
            // Encontra a posição original do usuário no ranking ordenado
            const originalPosition = orderedRanking.findIndex(
              (u) => u.idEstagiario === user.idEstagiario
            );

            return (
              <TableRow
                key={user.idEstagiario}
                className="bg-white text-blueScale-600 hover:bg-blueScale-600 hover:text-white ease-in-out duration-500 transition-all group"
              >
                <TableCell className="font-semibold text-lg"></TableCell>
                <TableCell className="font-semibold text-lg">
                  {originalPosition === 0 ? (
                    <FaCrown color="#F9BD25" size={25} />
                  ) : (
                    originalPosition + 1
                  )}
                </TableCell>
                <TableCell className="font-semibold">
                  {user.nome + " " + user.sobreNome}
                </TableCell>
                <TableCell className="font-semibold">{user.presenca}%</TableCell>
                <TableCell className="font-semibold flex w-max h-full justify-center items-center">
                  <span className="transition-all duration-300 ease-out text-center py-2 w-20 max-w-full bg-blueScale-600 rounded group-hover:bg-white group-hover:text-black text-white">
                    {user.pontuacao}
                  </span>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table> : <NoContentSearch text="Nenhum usuário encontrado!" />}

      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
};

export default RankingTable;


