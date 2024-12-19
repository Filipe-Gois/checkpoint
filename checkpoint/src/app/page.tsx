"use client";
import { LoginContainer } from "@/components/container";
import FormAccess from "@/components/forms/FormAccess";
import Image from "next/image";
import { motion } from "framer-motion";
import { usePathname, useRouter } from "next/navigation";
import useLogin from "@/hooks/usuarioHooks/useLogin";
import { useContext, useEffect } from "react";
import { userAuth, userPayloadTokenType, userRole } from "@/types/userTypes";
import { AuthContext } from "@/providers/AuthProvider";
import ToastNotification from "@/components/ToastNotification";
import { useToast } from "@/hooks/use-toast";
import { jwtDecode } from "jwt-decode";
import Cookie from "js-cookie";
import { FormValuesAuth } from "@/types/formTypes";

export default function Login() {
  const pathname = usePathname();
  const { setUserGlobalData } = useContext(AuthContext);
  const { toast } = useToast();
  const router = useRouter();

  const {
    mutate: loginMutate,
    isSuccess: isSuccessLogin,
    isError: isErrorLogin,
    isPending,
    data: token,
  } = useLogin();

  const validarNavegacaoPorTipoDeUsuario = (role: userRole) => router.replace(role === "Administrador" ? "usercontrol" : "dashboard");

  useEffect(() => {
    if (isSuccessLogin) {
      autenticarUsuario();
    }

    if (isErrorLogin) {
      toast({
        title: "Erro",
        description: "Usuário não encontrado!",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccessLogin, isErrorLogin]);

  const submitForm = ({ email, senha }: FormValuesAuth) =>
    loginMutate({
      email,
      senha,
    });

  const autenticarUsuario = () => {
    if (isSuccessLogin) {
      const { EmailCorporativo, Role, SobreNome, email, jti, name } =
        jwtDecode<userPayloadTokenType>(token);

      const usuario: userAuth = {
        email,
        EmailCorporativo,
        idUsuario: jti,
        name,
        Role,
        SobreNome,
      };

      setUserGlobalData(usuario);

      Cookie.set("usuario", JSON.stringify(usuario), { expires: 1 });

      validarNavegacaoPorTipoDeUsuario(Role);
    }
  };

  return (
    <motion.main
      key={pathname}
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -100 }}
      transition={{ duration: 0.5 }}
      className="w-full h-screen flex overflow-hidden"
    >
      <motion.div
        animate={{
          y: [0, -50, 0],
        }}
        transition={{
          duration: 3,
          ease: "easeInOut",
          repeat: Infinity,
          repeatType: "loop",
        }}
        className="flex sm:w-1/2 h-full items-center justify-center"
      >
        <Image
          src={"/images/SignUpImage.svg"}
          alt="Imagem da tela de login."
          width={1000}
          height={1000}
          className="hidden sm:flex w-4/5 h-[70%]"
        />
      </motion.div>

      <div className="w-full sm:w-1/2 h-full flex flex-col items-center justify-center bg-white">
        <LoginContainer>
          <Image
            src={"/images/LogoImage.png"}
            alt="Logo da aplicação."
            width={250}
            height={250}
          />
          <FormAccess isLoading={isPending} onSubmit={submitForm} />
        </LoginContainer>
      </div>
      <ToastNotification />
    </motion.main>
  );
}
