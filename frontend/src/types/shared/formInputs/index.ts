import { type InputHTMLAttributes } from "react";

export interface TextInputTypes extends InputHTMLAttributes<HTMLInputElement> {
  placeholder?: string;
  type?: string;
  inputLabel?: string;
  containerClassName?: string;
  name: string;
}
