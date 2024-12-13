import { ComponentProps, ReactNode } from "react";

type TitleProps = ComponentProps<"h1"> & {
  children: ReactNode;
  styles?: ReactNode;
};

export const Title = ({ ...rest }: TitleProps) =>
  <h1 {...rest} className={`font-poppins text-4xl font-semibold ${rest.styles}`}>{rest.children}</h1>

export function TextLink({ ...rest }: TitleProps) {
  return (
    <div className={`relative after:absolute after:bg-grayScale-100 after:bottom-0 after:left-0 after:h-px after:w-full after:origin-bottom-right after:scale-x-0 hover:after:origin-bottom-left hover:after:scale-x-100 after:transition-transform after:ease-in-out after:duration-300`}>
      <span className={`text-grayScale-100 ${rest.styles}`}>{rest.children}</span>
    </div>
  );
}


export function SubTitle({ ...rest }: TitleProps) {
  return <h3 className={`w-[90%] sm:w-[80%] text-center font-poppins mt-4 font-medium sm:text-xl text-lg text-white ${rest.styles}`}>{rest.children}</h3>
}

export function TextContent({ ...rest }: TitleProps) {
  return (
    <p
      className={`md:text-md text-sm text-center align-middle font-medium text-white ${rest.styles}`}
    >
      {rest.children}
    </p>
  );
}

export function Label({ ...rest }: TitleProps) {
  return (
    <span
      className={`text-sm md:text-md text-left align-middle font-semibold text-black ${rest.styles}`}
    >
      {rest.children}
    </span>
  );
}
