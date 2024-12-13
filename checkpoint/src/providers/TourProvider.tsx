import dynamic from 'next/dynamic';
import React, { useState } from 'react';
import AllStepsTour from '@/Utils/TourSteps';
import ButtonHelperTour from '@/components/button/ButtonHelperTour';
import { usePathname } from 'next/navigation';

// Importação dinâmica do Joyride com SSR desativado
const Joyride = dynamic(() => import('react-joyride'), { ssr: false });

import { CallBackProps, STATUS } from 'react-joyride';

type TourProps = {
    children: React.ReactNode;
};

const TourProvider = ({ children }: TourProps) => {
    const pathname = usePathname();
    const [run, setRun] = useState(false); // Controle para iniciar o Joyride
    const [stepIndex, setStepIndex] = useState(0); // Índice do passo atual

    const handleJoyrideCallback = (data: CallBackProps) => {
        const { status, index } = data;

        // Verifica se o status atual é 'skipped' ou 'finished'
        const finishedStatuses: Array<typeof STATUS.FINISHED | typeof STATUS.SKIPPED> = [
            STATUS.FINISHED,
            STATUS.SKIPPED,
        ];

        if (finishedStatuses.includes(status as typeof STATUS.FINISHED | typeof STATUS.SKIPPED)) {
            setRun(false); // Parar o tutorial se o usuário finalizar ou pular
        } else {
            setStepIndex(index); // Atualiza o passo atual
        }
    };

    const deveExibirTour = ["/dashboard", "/task", "/ranking", "/usercontrol", "/squadcontrol"].includes(pathname);

    if (!deveExibirTour) return children;

    return (
        <div>
            <Joyride
                continuous // Permite "continuar" para o próximo passo
                callback={handleJoyrideCallback} // Callback para monitorar eventos
                run={run}
                steps={AllStepsTour}
                showSkipButton
                locale={{
                    back: 'Voltar',
                    close: 'Fechar',
                    last: 'Finalizar',
                    next: 'Próximo',
                    skip: 'Pular',
                }}
                styles={{
                    options: {
                        zIndex: 10000, // Garantir que o Joyride esteja no topo
                        primaryColor: '#1E52B4', // Cor primária dos botões (Next e Done)
                        textColor: '#002346', // Cor do texto do botão
                    },
                    buttonNext: {
                        backgroundColor: '#1E52B4', // Cor de fundo do botão Next
                        color: '#fff', // Cor do texto
                        fontSize: '16px', // Tamanho da fonte
                        borderRadius: '4px', // Borda arredondada
                    },
                    buttonBack: {
                        color: '#1E52B4', // Cor do texto do botão Back
                        fontSize: '16px', // Tamanho da fonte
                    },
                    buttonSkip: {
                        color: '#D30000', // Cor do texto do botão Skip
                        fontWeight: 'bold', // Deixar o texto em negrito
                    },
                }}
            />
            <ButtonHelperTour onClick={() => setRun(true)} />
            {children}
        </div>
    );
};

export default TourProvider;
