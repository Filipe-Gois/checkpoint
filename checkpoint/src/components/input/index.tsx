import { useState } from "react";
import { Input as ChakraInput, FormControl, FormErrorMessage, InputGroup, InputRightElement, Button, FormControlProps } from "@chakra-ui/react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { FieldValues, Path, UseFormRegister } from "react-hook-form";

type InputProps<T extends FieldValues> = FormControlProps & {
  placeholder: string;
  isPassword?: boolean;
  registerInput: UseFormRegister<T>;
  nameInput: Path<T>;
  type?: string;
  errorMessage?: string;
  idInput?: string;
  isWhite?: boolean
  disabledInput?: boolean
};

export const Input = <T extends FieldValues>({
  placeholder,
  isPassword = false,
  nameInput,
  registerInput,
  type = "text",
  errorMessage,
  isWhite = false,
  disabledInput = false,
  idInput,
  ...rest
}: InputProps<T>) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  return (
    <FormControl {...rest} isInvalid={!!errorMessage}>

      <InputGroup className={`${isWhite ? "bg-white" : "bg-[#ECECEC]"} rounded !m-0`}>
        <ChakraInput
          disabled={disabledInput}
          {...registerInput(nameInput)}
          type={isPassword && !isPasswordVisible ? "password" : type}
          placeholder={placeholder}
          autoComplete="off"
          id={idInput}
          focusBorderColor="blue.400"
          className="focus:outline-none w-full h-14 outline-none py-2 px-4 font-poppins font-thin rounded"
        />

        {isPassword && (
          <InputRightElement className="md:!w-[6%]">
            <Button

              size="sm"
              onClick={() => setIsPasswordVisible(prev => !prev)}
              variant="ghost"
            >
              {isPasswordVisible ? <AiOutlineEyeInvisible size={100} /> : <AiOutlineEye size={100} />}
            </Button>
          </InputRightElement>
        )}
      </InputGroup>

      {errorMessage && <FormErrorMessage>{errorMessage}</FormErrorMessage>}
    </FormControl>
  );
};
