"use client";
import { FrequencyChart, PointsChart, SquadPointsChart } from "@/components/charts";
import { MainContainer } from "@/components/container";
import { Title } from "@/components/text";
import { AuthContext } from "@/providers/AuthProvider";
import { CalendarDays } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ModalCalendar } from "@/components/modals";
import ButtonGerarRelatorio from "@/components/button/ButtonGerarRelatorio";
import SquadCard from "@/components/Card/SquadCard";
import { Slide, Slider } from "@/components/Slider";
import { SwiperProps } from "swiper/react";
import { useListarSquadsComEstatisticasDosEstagiarios } from "@/hooks/Squad/useListarSquadsComEstatisticasDosEstagiarios";
import { squadsComEstatisticasEstagiariosType } from "@/types/squadTypes";
import { estatisticasEstagiario } from "@/types/estagiarioTypes";
import { totalPresencasType } from "@/types/presencasType";
import { pontuacaoEstagiario } from "@/types/pontuacaoTypes";
import ToastNotification from "@/components/ToastNotification";

export default function Dashboard() {
  const defaultPresence = {
    diasLetivos: 0,
    totalAtrasos: 0,
    totalFaltas: 0,
    totalPresencas: 0,
  }

  const { userGlobalData } = useContext(AuthContext);
  const { data: squads } = useListarSquadsComEstatisticasDosEstagiarios();
  const [selectedSquad, setSelectedSquad] = useState<squadsComEstatisticasEstagiariosType | null>(null);
  const [selectedEstagiario, setSelectedEstagiario] = useState<estatisticasEstagiario | null>(null);
  const [isOpenModalJustificarFalta, setIsOpenModalJustificarFalta] = useState(false);
  const [settingsSlides, setSettingsSlides] = useState<SwiperProps>({
    spaceBetween: 0,
    slidesPerView: 5,
  });

  const abrirModalJustificarFalta = () => setIsOpenModalJustificarFalta(prev => !prev)

  const handleAlterarEstagiario = (value: string) => {
    //flatMap: Combina todos os estagiários de todos os squads em um único array. Juncao de .flat() e .map()
    const estagiarioBuscado = squads?.flatMap(s => s.estagiarios).find(e => e.idEstagiario === value) ?? null
    setSelectedEstagiario(estagiarioBuscado)
  }

  const frequenciaEstagiario = (): totalPresencasType => {
    if (!squads) {
      return defaultPresence;
    }

    switch (userGlobalData?.Role) {
      case "Estagiario":
        const presencas = squads
          .flatMap(squad => squad.estagiarios) // Obtem todos os estagiários de todos os squads
          .filter(estagiario => estagiario.idEstagiario === userGlobalData.idUsuario)
          .map(estagiario => estagiario.presencas);

        return presencas.reduce<totalPresencasType>(
          (acumulador, atual) => ({
            diasLetivos: acumulador.diasLetivos + atual.diasLetivos,
            totalPresencas: acumulador.totalPresencas + atual.totalPresencas,
            totalFaltas: acumulador.totalFaltas + atual.totalFaltas,
            totalAtrasos: acumulador.totalAtrasos + atual.totalAtrasos,
          }),
          { diasLetivos: 0, totalPresencas: 0, totalFaltas: 0, totalAtrasos: 0 } // Valor inicial do acumulador
        );

      default:
        if (!selectedEstagiario) { return defaultPresence; }
        return selectedEstagiario.presencas
    }

  };

  const validarSePossuiPontuacao = (): pontuacaoEstagiario[] => {

    return [];
  }

  const pontuacaoSquad = (): pontuacaoEstagiario[] => {
    if (!squads) {
      return [];
    }

    switch (userGlobalData?.Role) {
      case "Estagiario":
        // Retorna estatísticas de todos os estagiários do squad do estagiário logado

        const dadosEstagiario = squads
          .filter(squad => squad.estagiarios.some(estagiario => estagiario.idEstagiario === userGlobalData.idUsuario))  // Filtra o squad que contém o estagiário logado
          .flatMap(squad => squad.estagiarios)  // Obtém todos os estagiários do squad
          .flatMap(estagiario => estagiario.estagiariosPontuacao);

        return dadosEstagiario; // Extrai a pontuação de todos os estagiários do squad



      default:
        // Retorna estatísticas apenas dos estagiários do squad selecionado
        if (!selectedSquad) {
          return [];
        }

        const dados = selectedSquad.estagiarios.flatMap(estagiario => estagiario.estagiariosPontuacao);
        return dados
    }
  };

  const pontuacaoEstagiario = (): pontuacaoEstagiario[] => {
    if (!squads) {
      return [];
    }

    switch (userGlobalData?.Role) {
      case "Estagiario":

        return squads.flatMap(squad => squad.estagiarios)
          .flatMap(x => x.estagiariosPontuacao)
          .filter(x => x.idEstagiario === userGlobalData.idUsuario);

      default:
        if (!selectedEstagiario) {
          return [];
        }

        return selectedEstagiario.estagiariosPontuacao;
    }
  }

  const alterarSquad = (squad: squadsComEstatisticasEstagiariosType) => {

    const estagiarioJaSelecionado = squad.estagiarios.some(x => x.idEstagiario === selectedEstagiario?.idEstagiario);

    if (!estagiarioJaSelecionado) {
      setSelectedEstagiario(squad.estagiarios[0])
    }

    setSelectedSquad(squad)
  }

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setSettingsSlides({ ...settingsSlides, slidesPerView: 1 });
      }

      else if (window.innerWidth < 1024) {
        setSettingsSlides({ ...settingsSlides, slidesPerView: 2 });
      }

      else if (window.innerWidth < 1280) {
        setSettingsSlides({ ...settingsSlides, slidesPerView: 3 });
      }
      else if (window.innerWidth < 1500) {
        setSettingsSlides({ ...settingsSlides, slidesPerView: 4 });
      }
      else {
        setSettingsSlides({ ...settingsSlides, slidesPerView: 5 });
      }
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  return (

    <MainContainer styles="pl-5">
      <section className="p-4 justify-center flex flex-col w-full h-full">
        <div className="flex flex-col md:flex-row justify-between w-full h-max mb-4 gap-4 md:gap-0">
          <Title styles="text-center">Dashboard</Title>

          <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-0 items-end">
            {userGlobalData?.Role !== "Estagiario" &&

              <Select value={selectedEstagiario?.idEstagiario} onValueChange={handleAlterarEstagiario}>
                <SelectTrigger
                  className="!w-full md:w-[160px] rounded-lg selecionar-estagiario-squad-2"
                  aria-label="Selecione um estagiário"
                >
                  <SelectValue placeholder={selectedEstagiario ? selectedEstagiario.nome + " " + selectedEstagiario.sobreNome : "Selecione um estagiário"} />
                </SelectTrigger>
                <SelectContent className="rounded-xl ">
                  <SelectGroup>

                    {selectedSquad &&
                      selectedSquad.estagiarios.map(estagiario => (
                        <SelectItem key={estagiario.idEstagiario} value={estagiario.idEstagiario}>
                          {`${estagiario.nome}  ${estagiario.sobreNome}`}
                        </SelectItem>
                      ))
                    }
                  </SelectGroup>
                </SelectContent>
              </Select>
            }

            {userGlobalData?.Role === "Estagiario" ?
              <button onClick={abrirModalJustificarFalta} className={`flex rounded py-1 px-2 bg-[#002346] hover:bg-blueScale-600 justify-center items-center transition-all ease-out duration-300 hover:scale-125`}>
                <CalendarDays color="white" />
              </button>
              : <ButtonGerarRelatorio idEstagiario={selectedEstagiario?.idEstagiario ?? ""} nomeEstagiario={selectedEstagiario ? selectedEstagiario?.nome + " " + selectedEstagiario?.sobreNome : ""} raEstagiario={selectedEstagiario?.matrícula ?? ""} />}
          </div>
        </div>

        {/* cards dos squads, genio */}
        {squads && userGlobalData?.Role !== "Estagiario" && (
          <div className="w-full h-max">
            <Slider settings={settingsSlides}>
              {squads
                .filter((x) =>
                  userGlobalData?.Role === "Administrador" ||
                  x.gestores.some(x => x.idUsuario === userGlobalData?.idUsuario)
                )
                .map((x, index) => (
                  <Slide
                    className="!flex !justify-center md:!justify-start"
                    onClick={() => alterarSquad(x)}
                    key={x.idSquad}
                  >
                    <SquadCard
                      className={index === 0 ? "selecionar-squad-1" : ""}
                      isSelected={selectedSquad?.idSquad === x.idSquad}
                      nome={x.nome}
                      totalIntegrantes={x.estagiarios.length}
                    />
                  </Slide>
                ))}
            </Slider>
          </div>
        )}

        <div className="flex flex-col gap-4 pb-8 md:pb-0">
          <SquadPointsChart data={pontuacaoSquad()} />
          {/* <SquadPointsChart data={estagiario && estagiario.squad ? estagiario.squad.estagiariosPontuacao : []} /> */}

          <div className="flex flex-col gap-4 md:flex-row md:justify-center">
            <FrequencyChart role={userGlobalData?.Role ?? "Estagiario"} data={frequenciaEstagiario()} />

            <PointsChart role={userGlobalData ? userGlobalData.Role : "Estagiario"} data={pontuacaoEstagiario()} />
          </div>
        </div>
      </section >
      <ToastNotification />
      {isOpenModalJustificarFalta && <ModalCalendar isOpen={isOpenModalJustificarFalta} setIsOpen={setIsOpenModalJustificarFalta} />
      }

    </MainContainer >
  )
}