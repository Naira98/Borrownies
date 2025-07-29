// src/components/AuthInputField.tsx
import type { FC } from 'react';
import { Field } from 'react-final-form';
import { EyeIcon, EyeOffIcon } from './Icons'; // Import icons from the new Icons file

// eslint-disable-next-line react-refresh/only-export-components
export const getLabelClass = (metaActive: boolean | undefined, inputValue: string) => {
  return `absolute left-3 text-gray-500 transition-all duration-200 px-1 bg-white pointer-events-none
    ${(inputValue || metaActive) ? '-top-2.5 text-xs' : 'top-3 text-sm'} peer-focus:-top-2.5 peer-focus:text-xs`;
};

interface AuthInputFieldProps {
  name: string;
  label: string;
  type?: string;
  isPassword?: boolean;
  showPasswordState?: boolean;
  togglePasswordVisibility?: () => void;
}

export const AuthInputField: FC<AuthInputFieldProps> = ({ name, label, type = 'text', isPassword = false, showPasswordState, togglePasswordVisibility }) => (
  <Field name={name}>
    {({ input, meta }) => (
      <div className="relative">
        <input
          {...input}
          type={isPassword ? (showPasswordState ? 'text' : 'password') : type}
          placeholder=" "
          className={`peer w-full p-3 border ${meta.error && meta.touched ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-primary`}
          autoComplete="off"
        />
        <label htmlFor={input.name} className={getLabelClass(meta.active, input.value)}>
          {label}
        </label>
        {isPassword && (
          <div
            className="absolute right-4 top-1/3 -translate-y-1/5 cursor-pointer text-gray-500"
            onClick={togglePasswordVisibility}
          >
            {showPasswordState ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
          </div>
        )}
        {meta.error && meta.touched && (
          <p className="text-red-500 text-xs mt-1">{meta.error}</p>
        )}
      </div>
    )}
  </Field>
);