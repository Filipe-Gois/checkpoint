"use client";
import { MainContainer } from "@/components/container";
import { Searchbar } from "@/components/searchbar";
import { Title } from "@/components/text";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { UserTable } from "@/components/table";
import { useState } from "react";
import * as Modals from "@/components/modals";
import ToastNotification from "@/components/ToastNotification";

export default function UserControl() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isJustifyModalOpen, setIsJustifyModalOpen] = useState(false);
  const [searchBarValue, setSearchBarValue] = useState("");

  return (
    <MainContainer>
      <section className="w-full pb-8  ml-0 overflow-x-hidden">
        <Title styles="w-full pt-10 md:pl-14 md:text-start text-center">Controle de usuários</Title>
        <div className="w-full px-8 md:px-14 pb-8">

          <div className=" gap-4  flex-col md:flex-row w-full flex mt-10 justify-between">
            <Searchbar styles="filtro-usercontrol-parametros-1" value={searchBarValue} onchange={(e) => setSearchBarValue(e.target.value)} placeholder="Pesquise..." />
            <Button
              className="justificativas-usercontrol-2 w-full h-10 md:w-[22%] align-middle font-medium rounded"
              size={"lg"}
              onClick={() => setIsJustifyModalOpen(prev => !prev)}
            >
              Justificativas de Falta
            </Button>
            <Button
              className="cadastrar-usuario-usercontrol-3 w-full h-10 md:w-[22%] align-middle font-medium rounded"
              size={"lg"}
              onClick={() => setIsModalOpen(prev => !prev)}
            >
              Cadastrar usuario
              <Plus strokeWidth={4} />
            </Button>
          </div>
          <UserTable searchBarValue={searchBarValue} />
        </div>
        <ToastNotification />
      </section>
      {isModalOpen && <Modals.ModalAddUser isOpen={isModalOpen} setIsOpen={setIsModalOpen} />}
      {isJustifyModalOpen && <Modals.ModalViewJustification isOpen={isJustifyModalOpen} setIsOpen={setIsJustifyModalOpen} />}

    </MainContainer>
  );
}
