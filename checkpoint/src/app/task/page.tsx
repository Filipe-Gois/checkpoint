"use client";
import { Title } from "@/components/text";
import { SelectFilter } from "../../components/select/index";
import { useContext, useState } from "react";
import * as Tables from '@/components/table';
import { MainContainer } from "@/components/container";
import { useListarTarefasDoEstagiario } from "@/hooks/Tarefa/useListarTarefasDoEstagiario";
import { AuthContext } from "@/providers/AuthProvider";
import { statusExibicaoTarefaType, tarefaType } from "@/types/tarefaTypes";
import { Plus } from "lucide-react";
import * as Modals from "@/components/modals";
import useListarTarefasParaOsGestores from "@/hooks/Tarefa/useListarTarefasParaOsGestores";
import ToastNotification from "@/components/ToastNotification";

export default function TaskPage() {
  const { userGlobalData } = useContext(AuthContext);
  const [selectedStatus, setSelectedStatus] = useState<statusExibicaoTarefaType | "null">("null");
  const [tarefaSelecionada, setTarefaSelecionada] = useState<tarefaType | null>(null);
  //arrumar a lógica dos states depois quando houver tempo. Em resumo: não é uma boa prática criar um state para cada modal. Devo reunir tudo isso em um só lugar:)
  const [isModalVerTarefas, setIsModalVerTarefas] = useState(false);
  const [isModalOpenAdicionarTarefa, setIsModalOpenAdicionarTarefa] = useState(false);

  const { data: tarefasEstagiario } = useListarTarefasDoEstagiario(userGlobalData?.Role === "Estagiario" ? userGlobalData.idUsuario : "")

  const { data: tarefasGestor } = useListarTarefasParaOsGestores(userGlobalData?.Role === "Gestor" ? userGlobalData.idUsuario : "");

  const filteredTarefas = userGlobalData?.Role === "Estagiario" && tarefasEstagiario ? tarefasEstagiario : tarefasGestor ? tarefasGestor : []

  return (
    <MainContainer>
      <section className="md:w-[75vw] lg:w-[80vw] xl:w-[85vw] p-8 !overflow-x-hidden">
        <Title styles="md:ml-4 text-center md:text-start">Tarefas</Title>

        <div className="w-full p-4 flex flex-col gap-4 md:flex-row items-end justify-between !overflow-x-hidden">
          <SelectFilter className="filtro-tarefas-1" defaultValueLabel="Todas" setSelectedValue={setSelectedStatus} filterContent={["Pendentes", "Realizadas"]} />

          {userGlobalData?.Role === "Gestor" && (
            <button className="cadastrar-tarefas-2 p-2 transition-all ease-in-out duration-300 bg-sky-950 hover:bg-sky-800 text-white font-semibold rounded-lg shadow-md focus:outline-none"
              onClick={() => setIsModalOpenAdicionarTarefa(prev => !prev)}
            >
              <Plus className="" />
            </button>
          )}
        </div>


        {filteredTarefas.length ? (
          <Tables.TableTask
            setIsOpen={setIsModalVerTarefas}
            setTarefaSelecionada={setTarefaSelecionada}
            tarefas={filteredTarefas}
            selectedStatus={selectedStatus}
          />
        ) : (
          <p>Nenhuma Tarefa</p>
        )}

        <ToastNotification />
      </section>
      {isModalVerTarefas && <Modals.ModalViewTask tarefa={tarefaSelecionada} setIsOpen={setIsModalVerTarefas} isOpen={isModalVerTarefas} />}
      {isModalOpenAdicionarTarefa && (<Modals.ModalAddTask setIsOpen={setIsModalOpenAdicionarTarefa} isOpen={isModalOpenAdicionarTarefa} />
      )}
    </MainContainer>
  );
}
