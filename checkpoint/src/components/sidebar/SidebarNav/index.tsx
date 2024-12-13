"use client";
import {
    Dispatch,
    RefObject,
    SetStateAction,
    useState,
} from "react";
import {
    Bell,
    ChartNoAxesColumn,
    Crown,
    Grid2x2Check,
    UserRound,
    UsersRound,
} from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { userRole } from "@/types/userTypes";
import { usePathname } from "next/navigation";
import SidebarButton from "../SidebarButton";
import NotificationBar from "@/components/NotificationBar";

type SidebarNavProps = { userType: userRole, inputRef: RefObject<HTMLInputElement> | null, setIsOpen: Dispatch<SetStateAction<boolean>> }

const SidebarNav = ({ userType, inputRef, setIsOpen }: SidebarNavProps) => {
    const [isNotificationBarOpen, setIsNotificationBarOpen] = useState(false);
    const pathname = usePathname();

    const abrirOuFecharNotificationBar = () =>
        setIsNotificationBarOpen((prev) => !prev);

    const sidebarItems = [
        ...(userType === "Administrador"
            ? [
                {
                    href: "/usercontrol",
                    label: "Usuários",
                    icon: <UserRound size={32} color="#b3b3b3" className="w-8 h-8" />,
                },
                {
                    href: "/squadcontrol",
                    label: "Squads",
                    icon: <UsersRound size={32} color="#b3b3b3" className="w-8 h-8" />,
                },
            ]
            : [
                {
                    href: "/task",
                    label: "Tarefas",
                    icon: <Grid2x2Check size={32} color="#b3b3b3" className="w-8 h-8" />,
                },
            ]),
        {
            href: "/dashboard",
            label: "Dashboard",
            icon: <ChartNoAxesColumn size={32} color="#b3b3b3" className="w-8 h-8" />,
        },
        {
            href: "/ranking",
            label: "Ranking",
            icon: <Crown size={32} color="#b3b3b3" className="w-8 h-8" />,
        },
    ];

    const fecharSideBar = () => {
        if (inputRef && inputRef.current) {
            inputRef.current.checked = !inputRef.current.checked;
            setIsOpen(prev => !prev)
        }
    }

    return (
        <div className="flex flex-col gap-5">
            <motion.div
                className="flex flex-col gap-5"
                initial="hidden"
                animate="visible"
                variants={{
                    hidden: { opacity: 0, y: 10 },
                    visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.1 } },
                }}
            >
                {sidebarItems.map((item, index) => (
                    <motion.div
                        key={item.href}
                        initial={{
                            x: -100, opacity: 0
                        }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                        <Link href={item.href}>
                            <SidebarButton
                                onClick={fecharSideBar}
                                isCurrentRoute={pathname === item.href}
                                label={item.label}
                            >
                                {item.icon}
                            </SidebarButton>
                        </Link>
                    </motion.div>
                ))}
                {/* Notificações */}
                <motion.div
                    variants={{
                        hidden: { opacity: 0, y: 10 },
                        visible: { opacity: 1, y: 0 },
                    }}
                >
                    <SidebarButton onClick={abrirOuFecharNotificationBar} label="Notificações">
                        <Bell size={32} color="#b3b3b3" className="w-8 h-8" />
                    </SidebarButton>
                </motion.div>
                <NotificationBar
                    isOpen={isNotificationBarOpen}
                    setIsOpen={setIsNotificationBarOpen}
                />
            </motion.div>
        </div>
    );
};

export default SidebarNav;