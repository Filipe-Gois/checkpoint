import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import useListarUsuarios from "@/hooks/usuarioHooks/useListarTodosOsUsuarios";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";
import { useArquivarUsuario } from "@/hooks/usuarioHooks/useArquivarUsuario";
import AlertDialogDeleteUser from "../modals/ModalEditUser";
import { useEffect, useState } from "react";
import { userStats } from "@/types/userTypes";
import { ModalViewUser } from "../modals";
import { ArchiveRestore, ArchiveX, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import NoContentSearch from "../NoContentSearch";
import TooltipComponent from "../TooltipComponent";

const UserTable = ({ searchBarValue }: { searchBarValue: string }) => {
  const iconSize = 25;
  const { data: usuarios } = useListarUsuarios();
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenVerUsuario, setIsOpenVerUsuario] = useState(false);
  const [usuarioSelecionado, setUsuarioSelecionado] = useState<userStats | null>(null);
  const { toast } = useToast();

  const usuario = usuarios && !searchBarValue ? usuarios : usuarios && searchBarValue ? usuarios.filter(u => u.nome.toLowerCase().includes(searchBarValue.toLowerCase()) || u.sobreNome.toLowerCase().includes(searchBarValue.toLowerCase()) || u.emailPessoal.toLowerCase().includes(searchBarValue.toLowerCase()) || u.matrícula?.toLowerCase().includes(searchBarValue.toLowerCase())) : []

  const handleEditClick = (usuario: userStats | null) => {
    setUsuarioSelecionado(usuario);
    setIsOpen(true);
  };

  const { mutate, isSuccess, isError } = useArquivarUsuario();

  const handleDeleteUser = (idUsuario: string) => {
    mutate({ idUsuario });
  };

  const verUsuario = (usuario: userStats) => {
    setIsOpenVerUsuario(prev => !prev);
    setUsuarioSelecionado(usuario);
  }

  const statusUsuario: "arquivado" | "desarquivado" = usuarioSelecionado?.isActive ? "arquivado" : "desarquivado";

  useEffect(() => {
    if (isSuccess) {
      toast({
        title: "Sucesso",
        description: `Usuário ${statusUsuario}!`
      });
    }
    if (isError) {
      toast({
        title: "Erro",
        description: `Erro ao ${usuarioSelecionado?.isActive ? "arquivar" : "desarquivar"} usuário.`
      });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess, isError]);

  return (
    <ScrollArea>
      {usuario.length ? <Table className="mt-4 w-full shadow-md bg-white rounded-lg font-poppins font-thin">
        <TableHeader className="rounded-t-lg">
          <TableRow className="h-8">
            <TableHead className="h-8 font-semibold">Status</TableHead>
            <TableHead className="h-8 font-semibold">Nome</TableHead>
            <TableHead className="h-8 font-semibold">Email</TableHead>
            <TableHead className="h-8 font-semibold">RA</TableHead>
            <TableHead className="h-8 font-semibold">Tipo</TableHead>
            <TableHead className="h-8 font-semibold">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>

          {usuario.map((x) => (
            <TableRow key={x.idUsuario}>
              <TableCell className={`font-semibold uppercase ${x.isActive ? "text-blueScale-600" : "text-[#D30000]"} `}>{x.isActive ? "Ativo" : "Inativo"}</TableCell>
              <TableCell className="font-semibold">
                <TooltipComponent
                  text={x.nome + " " + x.sobreNome} triggerClassName="font-semibold" maxLength={10} />
              </TableCell>
              <TableCell className="font-semibold text-grayScale-900 underline">
                <TooltipComponent
                  text={x.emailCorporativo} triggerClassName="font-semibold" maxLength={10} />
              </TableCell>
              <TableCell className="font-semibold text-grayScale-900">{x.matrícula}</TableCell>
              <TableCell className="font-semibold">{x.role === "Estagiario" ? "Estagiário" : x.role}</TableCell>
              <TableCell className="visualizar-usuario-4 font-semibold cursor-pointer" onClick={() => verUsuario(x)}><Eye size={iconSize} /></TableCell>
              <TableCell className="arquivar-desarquivar-usuario-usercontrol-5 w-20 cursor-pointer">
                <button onClick={() => handleEditClick(x)}>
                  {x.isActive ? <ArchiveX size={iconSize} /> : <ArchiveRestore size={iconSize} />}
                </button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table> : <NoContentSearch text="Nenhum usuário encontrado!" />}
      <ScrollBar orientation="horizontal" />

      {isOpen && (
        <AlertDialogDeleteUser
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          usuario={usuarioSelecionado}
          onDelete={handleDeleteUser}
        />
      )}
      {isOpenVerUsuario && (
        <ModalViewUser
          isOpen={isOpenVerUsuario}
          setIsOpen={setIsOpenVerUsuario}
          usuario={usuarioSelecionado}
        />
      )}
    </ScrollArea>
  );
};

export default UserTable
