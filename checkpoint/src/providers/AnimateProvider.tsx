import { AnimatePresence } from "framer-motion";

type AnimateProviderProps = {
    children: React.ReactNode
}

const AnimateProvider = ({ children }: AnimateProviderProps) => {
    return (
        <AnimatePresence mode="wait">
            {children}
        </AnimatePresence>
    );
};

export default AnimateProvider;