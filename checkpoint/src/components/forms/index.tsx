"use client";
import { FieldErrors, FieldValues, SubmitHandler, } from "react-hook-form";

export type FormProps<T extends FieldValues> = {
  onSubmit: SubmitHandler<T>;
  isLoading: boolean;
  errorInput?: string;
  fieldErrosAuthForm?: FieldErrors<T>;
};




