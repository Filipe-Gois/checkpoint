import Api, { loginRoute } from "@/Service/Api";
import { useMutation } from "@tanstack/react-query";

type loginResponse = {
  token: string;
};

type loginParams = {
  email: string;
  senha: string;
};

const login = async ({ email, senha }: loginParams) => {
  const {
    data: { token },
  } = await Api.post<loginResponse>(loginRoute, {
    email,
    senha,
  });

  return token;
};

const useLogin = () => {
  return useMutation({
    mutationFn: login,
  });
};

export default useLogin;
