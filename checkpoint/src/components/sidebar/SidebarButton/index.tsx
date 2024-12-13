"use client";
import { TextContent } from "@/components/text";
import {
    Dot
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { ReactNode } from "react";

type SidebarButtonProps = {
    children: ReactNode;
    label: string;
    onClick?: () => void;
    isCurrentRoute?: boolean
}

const SidebarButton = ({
    children,
    label,
    onClick,
    isCurrentRoute
}: SidebarButtonProps) => {

    return (
        <motion.div
            className="flex items-center justify-start gap-2 w-full"
            initial={{ x: 0 }}
            animate={isCurrentRoute ? { x: 20 } : { x: 0 }} // Move para a direita se for a rota atual
            exit={{ x: 0 }}
            transition={{
                type: "spring",
                stiffness: 200, // Reduz a força da mola
                damping: 25, // Suaviza o movimento
                duration: 2
            }}
        >
            <motion.button
                onClick={onClick}
                whileHover={{ scale: 1.1 }}
                className="flex items-center gap-2 transition-all ease-in-out duration-300"
            >
                <AnimatePresence>
                    {isCurrentRoute && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                        >
                            <Dot color="#FFF" />
                        </motion.div>
                    )}
                </AnimatePresence>
                {children}
                <TextContent className="cursor-pointer">{label}</TextContent>
            </motion.button>
        </motion.div>
    );
};


export default SidebarButton