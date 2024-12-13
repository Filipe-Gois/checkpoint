"use client";
import { MainContainer } from "@/components/container"
import { Searchbar } from "@/components/searchbar";
import { SelectFilter } from "@/components/select";
import { RankingTable } from "@/components/table";
import { Title } from "@/components/text"
import { filtroRankingTypes } from "@/types/ranking";
import { useState } from "react";

export default function RankingScreen() {
  const [selectedStatusRanking, setSelectedStatusRanking] = useState<filtroRankingTypes | "null">("null");
  const [searchBarValue, setSearchBarValue] = useState("");

  return (
    <MainContainer>
      <section className="w-full flex flex-col items-center">

        <Title styles="w-full pt-10 md:pl-14 md:text-start text-center">Ranking</Title>
        <div className="w-full px-8 md:px-14 pb-8">

          <div className=" gap-4 md:gap-0 flex-col md:flex-row w-full flex mt-10 justify-between">
            <Searchbar value={searchBarValue} onchange={e => setSearchBarValue(e.target.value)} styles="filtro-ranking-nome-1 w-full" placeholder="Pesquise..." />
            <SelectFilter className="filtro-ranking-tipo-2" setSelectedValue={setSelectedStatusRanking} filterContent={["Pontuação", "Frequência"]} />
          </div>
          <RankingTable searchBarValue={searchBarValue} selectedStatusRanking={selectedStatusRanking} />
        </div>
      </section>
    </MainContainer>
  )
}