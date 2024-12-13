import { TextContent } from "../text";
import { dificuldadeTarefaType } from "@/types/tarefaTypes";

export const DifficultyIcon = ({
  difficulty,
  isLarge,
}: {
  difficulty: dificuldadeTarefaType;
  isLarge: boolean | undefined;
}) => {

  const validarDificuldade = difficulty === "Dificil" ? "Difícil" : difficulty === "Facil" ? "Fácil" : "Médio"

  return (
    <div
      className={`${difficulty === "Facil"
        ? "bg-green-500"
        : difficulty === "Medio"
          ? "bg-yellow-500"
          : "bg-red-500"
        } text-white rounded-lg w-24 h-10 flex items-center justify-center text-center`}
    >
      {isLarge ? (
        <TextContent styles={"text-xl text-left"}>{validarDificuldade}</TextContent>
      ) : (
        <TextContent>{validarDificuldade}</TextContent>
      )}
    </div>
  );
};
