"use client";
import { MainContainer } from "@/components/container";
import { Searchbar } from "@/components/searchbar";
import { Title } from "@/components/text";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { SquadTable } from "@/components/table";
import { useState } from "react";
import { ModalAddSquad } from "@/components/modals";
import useListarUsuarios from "@/hooks/usuarioHooks/useListarTodosOsUsuarios";
import ToastNotification from "@/components/ToastNotification";

export default function SquadControl() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchBarValue, setSearchBarValue] = useState("");
  const { data: usuarios } = useListarUsuarios();
  const estagiarios = usuarios?.filter((usuario) => usuario.role === "Estagiario" && !usuario.squad) ?? [];
  const gestores = usuarios?.filter((usuario) => usuario.role === "Gestor") ?? [];

  return (
    <MainContainer>
      <section className="w-full pb-8">
        <Title styles="w-full pt-10 md:pl-14 md:text-start text-center">Controle de squads</Title>
        <div className="px-8 flex flex-col justify-between w-full gap-4 md:w-[90%] my-4 md:ml-10">

          <div className=" gap-4 md:gap-4 flex-col md:flex-row w-full  flex mt-10 justify-between">
            <Searchbar styles="filtro-squadcontrol-nome-1" value={searchBarValue} onchange={(e) => setSearchBarValue(e.target.value)} placeholder="Pesquise..." />
            <Button
              className="cadastrar-squad-squadcontrol-2 h-10 md:w-[30%]  w-full align-middle font-medium rounded"
              size={"lg"}
              onClick={() => setIsModalOpen(prev => !prev)}
            >
              Cadastrar Squad
              <Plus strokeWidth={4} />
            </Button>
          </div>

          <SquadTable estagiarios={estagiarios} gestores={gestores} searchBarValue={searchBarValue} />
        </div>
        <ToastNotification />
      </section>
      {isModalOpen && <ModalAddSquad estagiarios={estagiarios} gestores={gestores} isOpen={isModalOpen} setIsOpen={setIsModalOpen} />}
    </MainContainer>
  );
}