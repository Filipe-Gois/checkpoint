"use client";
import { LoginContainer } from "@/components/container";
import FormEmailCheck from "@/components/forms/FormEmailCheck";
import { SubTitle } from "@/components/text";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { usePathname, useRouter } from "next/navigation";
import useEnviarCodigoRecSenha from "@/hooks/usuarioHooks/useEnviarCodigoRecSenha";
import { useEffect, useState } from "react";
import ToastNotification from "@/components/ToastNotification";
import { useToast } from "@/hooks/use-toast";
import Cookie from "js-cookie";

export default function EmailCheck() {
  const pathname = usePathname();
  const router = useRouter();
  const { toast } = useToast();

  const [email, setEmail] = useState("");

  const submitForm = ({ email }: { email: string }) => {
    setEmail(email);
    enviarCodigoMutate(email);
  };

  const {
    mutate: enviarCodigoMutate,
    isSuccess: isSuccessEnviarCodigo,
    isPending,
    isError,
  } = useEnviarCodigoRecSenha();

  useEffect(() => {
    if (isSuccessEnviarCodigo) {
      Cookie.set("emailRecuperarSenha", JSON.stringify(email));
      router.replace("codevalidate");
    }

    if (isError) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Email não encontrado!",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccessEnviarCodigo, isError]);

  return (
    <AnimatePresence mode="wait">
      <motion.section
        key={pathname}
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 100 }}
        transition={{ duration: 0.5 }}
        className="w-full h-dvh flex overflow-hidden"
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
            layout="responsive"
            width={200}
            height={200}
            className="hidden sm:flex "
          />
        </motion.div>

        <div className="w-full sm:w-1/2 h-full flex flex-col items-center justify-center bg-white">
          <LoginContainer className="flex flex-col gap-4">
            <Image
              src={"/images/LogoImage.png"}
              alt="Logo da aplicação."
              width={250}
              height={250}
              className=""
            />

            <SubTitle>
              Insira seu email para receber o código de recuperação de senha.
            </SubTitle>

            <FormEmailCheck isLoading={isPending} onSubmit={submitForm} />
          </LoginContainer>
        </div>
      </motion.section>
      <ToastNotification />
    </AnimatePresence>
  );
}
