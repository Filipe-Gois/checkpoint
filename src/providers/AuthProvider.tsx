import { userAuth } from "@/types/userTypes";
import { createContext, ReactNode, useEffect, useState } from "react";
import Cookie from "js-cookie";

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

  useEffect(() => {
    const userData = Cookie.get("usuario");
    if (userData) {
      setUserGlobalData(JSON.parse(userData));
    }
  }, []);

  return (
    <AuthContext.Provider value={{ userGlobalData, setUserGlobalData }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
