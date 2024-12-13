import { Button } from "@/components/ui/button";
import { ComponentProps, ReactNode } from "react";
import { BeatLoader } from "react-spinners";

type ButtonLoginProps = ComponentProps<"button"> & {
  children: ReactNode;
  isLoading?: boolean;
  onClick?: ReactNode;
};

export function ButtonLogin({
  children,
  isLoading,
  ...rest
}: ButtonLoginProps) {
  return (
    <Button className="!w-full" disabled={isLoading} {...rest} type="submit">
      {!isLoading ? children : <BeatLoader color="white" size={10} />}
    </Button>
  );
}

export function ButtonDate({ children, ...rest }: ButtonLoginProps) {
  return (
    <button
      {...rest}
      type="button"
      className="w-[8vh] h-[5vh] flex items-center justify-center px-4 py-2 bg-sky-950 hover:bg-sky-800 text-white font-semibold rounded-lg shadow-md focus:outline-none"
    >
      {children}
    </button>
  );
}

