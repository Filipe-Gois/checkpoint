"use client";

import { useEffect, useState } from "react";
import Cookie from "js-cookie";
import { LoginContainer } from "@/components/container";
import FormCodeValidate from "@/components/forms/FormCodeValidate";
import { SubTitle, TextLink } from "@/components/text";
import ToastNotification from "@/components/ToastNotification";
import { useToast } from "@/hooks/use-toast";
import useValidarCodigoRecSenha from "@/hooks/usuarioHooks/useValidarCodigoRecSenha";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";

export default function CodeValidate() {
  const [emailRecuperarSenha, setEmailRecuperarSenha] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  const pathname = usePathname();
  const { isError, isPending, isSuccess, mutate } = useValidarCodigoRecSenha();
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    // Define que a página foi montada no cliente
    setIsMounted(true);

    // Obtém o email dos cookies
    const email = Cookie.get("emailRecuperarSenha");
    if (email) {
      setEmailRecuperarSenha(JSON.parse(email));
    }
  }, []);

  const onSubmitForm = ({ pin }: { pin: string }) => {
    mutate({ codigo: pin, email: emailRecuperarSenha ?? "" });
  };

  useEffect(() => {
    if (isSuccess) {
      router.replace("passwordvalidate");
    }
    if (isError) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Código inválido!",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess, isError]);

  if (!isMounted) {
    // Evita a renderização no servidor
    return null;
  }

  return (
    <AnimatePresence mode="wait">
      <motion.section
        key={pathname}
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 100 }}
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
            className="hidden sm:flex w-[80%] h-[70%]"
          />
        </motion.div>

        <div className="w-full sm:w-1/2 h-full flex flex-col items-center justify-center bg-white">
          <LoginContainer>
            <Image
              src={"/images/LogoImage.png"}
              alt="Logo da aplicação."
              width={250}
              height={250}
              className=""
            />

            <SubTitle styles="mb-10 mt-14">
              Enviamos um código de recuperação de senha para o seguinte email:
              <TextLink styles="text-blueScale-500 underline">
                {emailRecuperarSenha || ""}
              </TextLink>
            </SubTitle>

            <FormCodeValidate isLoading={isPending} onSubmit={onSubmitForm} />
          </LoginContainer>
        </div>
      </motion.section>
      <ToastNotification />
    </AnimatePresence>
  );
}
