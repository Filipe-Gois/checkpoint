import { motion } from "framer-motion"
import { usePathname } from "next/navigation";

type ContainerProps = {
  children: React.ReactNode;
  styles?: React.ReactNode;
};

export const MainContainer = ({ children, styles }: ContainerProps) => {
  const pathname = usePathname()

  return (
    <motion.main
      key={pathname}
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -100 }}
      transition={{ duration: 0.5 }}
      className={`w-screen md:w-[75vw] lg:w-[80vw] xl:w-[85vw] h-full bg-[#F4F4F4] md:ml-[24vw] lg:ml-[19vw] xl:ml-[14vw] ${styles}`}>
      {children}
    </motion.main>
  );
};

type LoginContainerProps = {
  children: React.ReactNode;
  className?: string
};

export const LoginContainer = ({ children, className }: LoginContainerProps) => {
  return (
    <section className={`w-full h-full m-0 rounded-none sm:h-[99%] sm:w-[99%] sm:m-1 bg-blueGradient sm:rounded-lg flex flex-col items-center justify-center ${className}`}>
      {children}
    </section>
  );
};
