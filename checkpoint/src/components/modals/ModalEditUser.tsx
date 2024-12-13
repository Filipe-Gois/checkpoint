import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
} from "@/components/ui/alert-dialog";
import { userStats } from "@/types/userTypes";

interface AlertDialogDeleteUserProps {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  usuario: userStats | null;
  onDelete: (idUsuario: string) => void;
}

export default function AlertDialogDeleteUser({
  isOpen,
  setIsOpen,
  usuario,
  onDelete,
}: AlertDialogDeleteUserProps) {
  const handleDelete = () => {
    if (usuario) {
      onDelete(usuario.idUsuario);
      setIsOpen(false);
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent className="w-3/4 md:w-full md:max-w-[700px] rounded" >
        <AlertDialogHeader className="font-poppins">
          <AlertDialogTitle>Deseja mesmo continuar?</AlertDialogTitle>
          <AlertDialogDescription className="font-poppins">
            Você irá{" "}
            <span className="font-bold">
              {usuario?.isActive ? "desativar" : "ativar"}
            </span>{" "}
            o usuário{" "}
            <span className="font-bold">{usuario?.nome + " " + usuario?.sobreNome}</span>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="font-poppins">
          <AlertDialogCancel className="w-full" onClick={() => setIsOpen(false)}>
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction className="w-full bg-darkBlue hover:bg-darkBlue" onClick={handleDelete}>
            {usuario?.isActive ? "Desativar" : "Ativar"} Usuário
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
