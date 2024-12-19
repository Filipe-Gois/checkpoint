"use client";
import {
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import Image from "next/image";
import { LogOut } from "lucide-react";
import { motion } from "framer-motion";
import Cookie from "js-cookie";
import { AuthContext } from "@/providers/AuthProvider";
import { usePathname, useRouter } from "next/navigation";
import { useBaterPontoSaidaEstagiario } from "@/hooks/Presenca/useBaterPontoSaidaEstagiario";
import ToggleMobileSidebar from "./ToggleMobileSidebar";
import SidebarButton from "./SidebarButton";
import SidebarNav from "./SidebarNav";

export const Sidebar = () => {
  const router = useRouter()
  const pathname = usePathname()
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const { userGlobalData, setUserGlobalData } = useContext(AuthContext);
  const { mutate, isSuccess, isError } = useBaterPontoSaidaEstagiario();

  const handleLogout = () => mutate(userGlobalData?.idUsuario ?? "")

  useEffect(() => {
    //isError p caso não for um dia letivo
    if (isSuccess || isError) {
      setUserGlobalData(null);
      Cookie.remove("usuario");

      router.replace("/")
    }

  }, [isSuccess, isError]);

  const deveExibirSideBar = !["/", "/codevalidate", "/emailcheck", "/passwordvalidate",].includes(pathname);

  if (!deveExibirSideBar) return null;

  return (
    <motion.div
      initial={{ x: -300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      data-exibenavbar={inputRef.current?.checked}
      className={`transition-all ease-in-out data-[exibenavbar=true]:left-0 left-[-65vw] duration-300 !z-50 font-poppins !fixed md:fixed h-screen w-[65vw] md:w-[25vw] lg:w-[20vw] xl:w-[15vw] md:!left-0 px-8 py-8 bg-[#002346] flex flex-col justify-between md:flex`}
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <Image
          src="/images/LogoImage.png"
          alt="Logo da aplicação."
          width={1000}
          height={1000}
          className="bg-[#002346]"
        />

      </motion.div>
      <SidebarNav setIsOpen={setIsOpen} inputRef={inputRef} userType={userGlobalData?.Role ?? "Estagiario"} />

      <div className="flex flex-row justify-between">
        <SidebarButton onClick={handleLogout} label={"Logout"}>
          <LogOut size={32} color="#FFFFFF" className=" w-8 h-8" />
        </SidebarButton>
        <ToggleMobileSidebar isOpen={isOpen} setIsOpen={setIsOpen} inputRef={inputRef} />
      </div>

    </motion.div>

  );
};