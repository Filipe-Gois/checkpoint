import { ModalProps } from ".";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { userStats } from "@/types/userTypes";
import { Button } from "../ui/button";

type ModalViewProps = ModalProps & {
    usuario: userStats | null;
};

const ModalViewUser = ({
    isOpen,
    setIsOpen,
    usuario,
}: ModalViewProps) => {

    const user = usuario ? {
        Nome: `${usuario.nome} ${usuario.sobreNome}`,
        RA: usuario.matrícula,
        "Email pessoal": usuario.emailPessoal,
        "Email corporativo": usuario.emailCorporativo,
        "Tipo de usuário": usuario.role === "Estagiario" ? "Estagiário" : usuario.role,
    } : null

    const height = window.innerHeight;
    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="flex flex-col justify-around items-center gap-4 h-4/6 w-3/4 md:w-full md:max-w-[700px] rounded font-poppins">
                <DialogHeader className="justify-center items-center">
                    <DialogTitle className="font-poppins text-2xl font-semibold rounded text-blueScale-600 w-full text-center">
                        Informações do usuário
                    </DialogTitle>
                    <DialogDescription className="mb-8">Confira as Informações do usuario {usuario?.nome} {usuario?.sobreNome}</DialogDescription>
                </DialogHeader>
                <div style={{ maxHeight: height * 0.3 }} className="w-full flex flex-col px-2 rounded-md overflow-x-hidden">
                    <div className="flex flex-col gap-4 w-full px-2">

                        {user && Object.entries(user).map(([key, value]) => (
                            <div key={key} className="flex flex-col w-[80%]">
                                <p className="text-base font-semibold uppercase">{key}</p>
                                <p className="font-light">
                                    {value}
                                </p>
                            </div>

                        ))}

                    </div>
                </div>

                <Button className="mb-0 !w-full" onClick={() => setIsOpen(false)}>
                    Fechar
                </Button>
            </DialogContent>
        </Dialog>
    );
}

export default ModalViewUser