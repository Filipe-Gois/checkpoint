"use client";
import { LoginContainer } from "@/components/container";
import FormPasswordValidate from "@/components/forms/FormPasswordValidate";
import { SubTitle } from "@/components/text";
import { useToast } from "@/hooks/use-toast";
import useAlterarSenhaUsuario from "@/hooks/usuarioHooks/useAlterarSenhaUsuario";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Cookie from "js-cookie";
import { AnimatePresence, motion } from "framer-motion";
import { FormValueValidateSenha } from "@/types/formTypes";

export default function PasswordValidate() {
  const pathname = usePathname();
  const router = useRouter();
  const { toast } = useToast();

  const [emailRecuperarSenha] = useState(Cookie.get("emailRecuperarSenha"));

  const { isPending, isError, mutate, isSuccess } = useAlterarSenhaUsuario();

  useEffect(() => {
    if (isSuccess) {
      Cookie.remove("emailRecuperarSenha");
      router.replace("/");
    }
    if (isError) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess, isError]);

  const onSubmitForm = ({ senha }: FormValueValidateSenha) => mutate({ senha, email: JSON.parse(emailRecuperarSenha || "") });

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

            <SubTitle>Digite e confirme sua nova senha.</SubTitle>

            <FormPasswordValidate
              onSubmit={onSubmitForm}
              isLoading={isPending}
            />
          </LoginContainer>
        </div>
      </motion.section>
    </AnimatePresence>
  );
}
