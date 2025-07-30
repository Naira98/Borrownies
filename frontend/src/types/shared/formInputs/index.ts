import { type InputHTMLAttributes } from "react";

export interface TextInputTypes extends InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  touched: undefined | boolean;
  placeholder?: string;
  type?: string;
  inputLabel?: string;
  containerClassName?: string;
}
