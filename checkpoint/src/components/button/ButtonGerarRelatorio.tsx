import { useGerarRelatorioEstagiario } from '@/hooks/estagiarioHooks/useGerarRelatorioEstagiario';
import { FileText } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import { useToast } from '@/hooks/use-toast';

type props = {
    nomeEstagiario: string;
    raEstagiario: string;
    idEstagiario: string,
};

const ButtonGerarRelatorio = ({ nomeEstagiario, raEstagiario, idEstagiario }: props) => {

    const { data: relatorio, isLoading, isSuccess, isError } = useGerarRelatorioEstagiario({ idEstagiario });
    const [shouldDownload, setShouldDownload] = useState(false);
    const { toast } = useToast()
    const gerarRelatorio = () => {
        setShouldDownload(true);
    };

    const baixarRelatorio = () => {
        if (relatorio) {
            const url = window.URL.createObjectURL(relatorio);
            const a = document.createElement('a');
            a.href = url;
            a.download = `relatorio_estagiario_${nomeEstagiario}_${raEstagiario}.pdf`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        }
    };

    useEffect(() => {
        if (isSuccess && shouldDownload) {
            baixarRelatorio();
            setShouldDownload(false);
            toast({
                title: "Sucesso",
                description: "Relatório gerado com sucesso!"
            })

        }
        if (isError) {
            toast({
                title: "Erro",
                description: "Erro ao gerar relatório."
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isSuccess, shouldDownload, isError]);

    return (

        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger
                    disabled={isLoading}
                    onClick={gerarRelatorio}
                    className="gerar-relatorio-estagiario-3 flex rounded px-2 justify-center items-center transition-all ease-out duration-300 hover:scale-125"
                >
                    <FileText color="#002346" />
                </TooltipTrigger>
                <TooltipContent className="text-black">
                    Gerar relatório
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>

    );
};

export default ButtonGerarRelatorio;
