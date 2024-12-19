import { userAuth } from "@/types/userTypes";
import { createContext, ReactNode, useEffect, useState } from "react";
import Cookie from "js-cookie";
import { useBaterPontoSaidaEstagiario } from "@/hooks/Presenca/useBaterPontoSaidaEstagiario";

type AuthProviderProps = {
  children: ReactNode;
};

type AuthContextProps = {
  userGlobalData: userAuth | null;
  setUserGlobalData: (user: userAuth | null) => void;
};

const defaultValueAuthContext: AuthContextProps = {
  userGlobalData: null,
  setUserGlobalData: () => { },
};

export const AuthContext = createContext<AuthContextProps>(
  defaultValueAuthContext
);


const AuthProvider = ({ children }: AuthProviderProps) => {
  const [userGlobalData, setUserGlobalData] = useState<userAuth | null>(null);

  const { mutate } = useBaterPontoSaidaEstagiario()

  useEffect(() => {
    const userData = Cookie.get("usuario");
    if (userData) {
      setUserGlobalData(JSON.parse(userData));
    }
  }, []);

  useEffect(() => {
    // Adiciona o listener para o evento `beforeunload`
    const handleBeforeUnload = () => {
      if (userGlobalData?.Role === "Estagiario" && userGlobalData?.idUsuario) {
        // Faz a mutação para bater o ponto
        mutate(userGlobalData.idUsuario);
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      // Remove o listener quando o componente é desmontado
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [userGlobalData, mutate]);

  return (
    <AuthContext.Provider value={{ userGlobalData, setUserGlobalData }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
