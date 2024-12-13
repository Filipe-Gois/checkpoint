import { ModalProps } from ".";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { z } from "zod";
import { Input } from "../input";
import { Controller, useForm } from "react-hook-form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import useCadastrarTarefa from "@/hooks/Tarefa/useCadastrarTarefa";
import { DatePicker } from "../DatePicker";
import Dropzone from "../Dropzone";
import { useContext, useEffect, useState } from "react";
import moment from "moment"
import { useToast } from "@/hooks/use-toast";
import { useListarEstagiariosDoGestor } from "@/hooks/usuarioHooks/useListarEstagiariosDoGestor";
import { AuthContext } from "@/providers/AuthProvider";
import { FormControl, FormErrorMessage } from "@chakra-ui/react";

const schema = z.object({
  titulo: z.string().min(1, "O título é obrigatório."),
  descricao: z.string().min(1, "A descrição é obrigatória."),
  dificuldade: z.union([
    z.literal(10),
    z.literal(25),
    z.literal(50),
  ]).refine(value => [10, 25, 50].includes(value), {
    message: "A dificuldade deve ser 10, 25 ou 50.",
  }),
  idEstagiarioAtribuido: z
    .string()
    .min(5, "O identificador do estagiário deve conter no mínimo 5 caracteres."),
  arquivosDeImagens: z
    .array(z.instanceof(File))
    .refine((files) => files.length > 0, {
      message: "Anexe pelo menos um arquivo!",
    })
    .refine(
      (files) => files.every((file) => file.size <= 5 * 1024 * 1024),
      "Cada arquivo deve ter no máximo 5MB!"
    ),
});

type formValue = z.infer<typeof schema>;

type ModalAddTaskProps = ModalProps;

const ModalAddTask = ({ isOpen, setIsOpen }: ModalAddTaskProps): JSX.Element => {
  const { mutate: cadastrarTarefa, isPending, isSuccess, isError } = useCadastrarTarefa();
  const { userGlobalData } = useContext(AuthContext)
  const { data: estagiarios, isLoading: isEstagiariosLoading } = useListarEstagiariosDoGestor(userGlobalData?.Role === "Gestor" ? userGlobalData.idUsuario : "");
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
    setValue,
  } = useForm<formValue>({
    resolver: zodResolver(schema),
  });

  const arquivos = watch("arquivosDeImagens")
  const dificuldadeWatch = watch("dificuldade");
  const dificuldadeSelecionada = dificuldadeWatch === 50 ? "Difícil" : dificuldadeWatch === 25 ? "Médio" : "Fácil"
  const [date, setDate] = useState<Date | undefined>(undefined);

  const estagiarioWatch = watch("idEstagiarioAtribuido");

  const estagiarioNomeSelecionado = () => {
    const estagiario = estagiarios?.find(x => x.idEstagiario === estagiarioWatch);


    if (!estagiario) {
      return null
    }
    return estagiario?.nome + " " + estagiario?.sobrenome
  }

  const onSubmit = (data: formValue) => {
    if (!date) {
      return
    }

    cadastrarTarefa({
      ...data,
      dificuldade: Number(data.dificuldade),
      prazo: moment(date).format("YYYY-MM-DD"),
    });
  };


  useEffect(() => {
    if (isSuccess) {
      toast({
        title: "Sucesso",
        description: `Tarefa cadastrada!`,
      });
      setIsOpen(prev => !prev)

    }
    if (isError) {
      toast({
        title: "Erro",
        description: `Erro ao cadastrar tarefa.`,
      });
      setIsOpen(prev => !prev)

    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess, isError]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="rounded flex flex-col justify-evenly items-center h-4/6 w-3/4 md:w-full md:max-w-[700px] font-poppins">
        <DialogHeader className="flex flex-col justify-center items-center">
          <DialogTitle className="md:text-4xl font-semibold text-blueScale-600 text-2xl w-full font-poppins text-center">
            CADASTRAR TAREFA
          </DialogTitle>
          <DialogDescription className="font-poppins">
            Cadastrar tarefa para um estagiário.
          </DialogDescription>
        </DialogHeader>
        <div className="w-full max-h-[400px] overflow-y-auto rounded-md overflow-x-hidden">

          <form
            className="flex flex-col min-h-[60vh] p-2 justify-around items-center h-full gap-4"
            onSubmit={handleSubmit(onSubmit)}
          >
            <Dropzone totalArquivos={arquivos ? arquivos.length : 0} onFilesChange={(files) => setValue("arquivosDeImagens", files)} />

            <div className="w-full">
              <label htmlFor="titulo" className="block text-sm font-medium text-gray-700">
                Título
              </label>
              <Input
                nameInput="titulo"
                registerInput={register}
                placeholder="Digite o título da tarefa..."
                errorMessage={errors.titulo?.message}
              />
            </div>

            <div className="w-full">
              <label htmlFor="descricao" className="block text-sm font-medium text-gray-700">
                Descrição
              </label>
              <Input
                registerInput={register}
                nameInput="descricao"
                placeholder="Digite a descrição da tarefa..."
              />
              {errors.descricao && <p className="text-red-500">{errors.descricao.message}</p>}
            </div>

            <FormControl isInvalid={!date} className="w-full">
              <label htmlFor="prazo" className="block text-sm font-medium text-gray-700">
                Prazo
              </label>

              <DatePicker
                date={date}
                setDate={setDate}
              />

              {!date && <FormErrorMessage>Informe uma data!</FormErrorMessage>}

            </FormControl>


            <div className="flex flex-col md:flex-row w-full justify-between md:gap-10">
              <div className="w-full">
                <label htmlFor="dificuldade" className="block text-sm font-medium text-gray-700">
                  Dificuldade
                </label>
                <Controller
                  name="dificuldade"
                  control={control}
                  render={({ field }) => (
                    <Select value={String(field.value)} onValueChange={(value) => field.onChange(parseInt(value))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a dificuldade...">{dificuldadeSelecionada}</SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="10">Fácil</SelectItem>
                        <SelectItem value="25">Médio</SelectItem>
                        <SelectItem value="50">Difícil</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.dificuldade && <p className="text-red-500">{errors.dificuldade.message}</p>}
              </div>

              <div className="w-full">
                <label htmlFor="idEstagiarioAtribuido" className="block text-sm font-medium text-gray-700">
                  Estagiário
                </label>
                <Controller
                  name="idEstagiarioAtribuido"
                  control={control}
                  render={({ field }) => (
                    <Select value={String(field.value)} onValueChange={(value) => field.onChange(value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o estagiário...">{estagiarioNomeSelecionado() ?? " Selecione o estagiário"}</SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {isEstagiariosLoading ? (
                          <SelectItem value="loading">Carregando...</SelectItem>
                        ) : (
                          estagiarios && estagiarios.map((estagiario) => (
                            <SelectItem key={Math.random()} value={estagiario.idEstagiario}>
                              {estagiario.nome + " " + estagiario.sobrenome}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={isPending}
              className="font-bold rounded-md hover:!scale-100 px-5 !w-full h-[53.36px] shadow-md"
            >
              {isPending ? "Cadastrando..." : "Cadastrar Tarefa"}
            </Button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ModalAddTask;
