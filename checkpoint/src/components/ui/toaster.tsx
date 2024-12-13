"use client";

import { useToast } from "@/hooks/use-toast";
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast";

const titleColors: Record<"Sucesso" | "Erro" | "Alerta", string> = {
  Sucesso: "#002346",
  Erro: "#FF0000",
  Alerta: "#FFC107",
};

export function Toaster() {
  const { toasts } = useToast();

  return (
    <ToastProvider>
      {toasts.map(({ id, title, description, action, ...props }) => {
        const backgroundColor = title ? titleColors[title as keyof typeof titleColors] : undefined;

        return (
          <Toast
            key={id}
            {...props}
            style={{
              backgroundColor: backgroundColor || "#000", color: "#FFF" // Cor padrão caso o título não seja válido
            }}
          >
            <div className="grid gap-1">
              {title && <ToastTitle>{title}</ToastTitle>}
              {description && <ToastDescription>{description}</ToastDescription>}
            </div>
            {action}
            <ToastClose />
          </Toast>
        );
      })}
      <ToastViewport />
    </ToastProvider>
  );
}
