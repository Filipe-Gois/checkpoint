"use client";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet"
import { useBuscarNotificacoesDoUsuario } from "@/hooks/NotificacaoHooks/useBuscarNotificacoesDoUsuario";
import { AuthContext } from "@/providers/AuthProvider";
import { Dispatch, SetStateAction, useContext } from "react";
import { Separator } from "../ui/separator";
import { motion } from "framer-motion"
import NoContentSearch from "../NoContentSearch";
import NotificationCard from "./NotificationBar";

type NotificationBarProps = {
    setIsOpen: Dispatch<SetStateAction<boolean>>
    isOpen: boolean
}

const NotificationBar = ({ isOpen, setIsOpen }: NotificationBarProps) => {
    const { userGlobalData } = useContext(AuthContext)

    const { data: notificacoes } = useBuscarNotificacoesDoUsuario(userGlobalData?.idUsuario ?? "")

    return (
        <Sheet onOpenChange={setIsOpen} open={isOpen} >
            <SheetContent className="!pb-12">
                <SheetHeader>
                    <SheetTitle className="text-xl hidden">Notificações</SheetTitle>
                    <SheetDescription className="hidden"></SheetDescription>

                    <div className="flex flex-col gap-5 pb-6" >
                        <div className={`w-full max-h-screen overflow-y-auto rounded-md overflow-x-hidden p-4 !pb-12 gap-5`}>
                            {notificacoes && notificacoes.length ? notificacoes.map((noti, index) => (
                                <motion.div
                                    initial={{ opacity: 0, x: 200 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 200 }}
                                    transition={{ duration: 0.2, delay: 0.5 + index * 0.2 }}

                                    className={`flex flex-col w-full h-full gap-5 ${index === 0 ? "" : "mt-5"}`} key={noti.idNotificacao}>
                                    <NotificationCard  {...noti} />
                                    <Separator />

                                </motion.div >

                            )) : <NoContentSearch className="!w-full" isNotification text="Nenhuma notificação!" />}
                        </div>
                    </div>
                </SheetHeader>
            </SheetContent>
        </Sheet>

    );
};
export default NotificationBar;

