import { useState } from "react";
import classnames from "classnames";
import type { TextInputTypes } from "../../../types/shared/formInputs";

export default function TextInput({
  error,
  touched,
  type = "text",
  placeholder,
  inputLabel,
  containerClassName,
  ...props
}: TextInputTypes) {
  const [isPassword, changeIsPassword] = useState<boolean>(true);

  return (
    <div className={classnames("mb-9 w-full", containerClassName)}>
      <label
        htmlFor={props.name}
        className={classnames("mb-2 block text-[14px]")}
      >
        {inputLabel ? inputLabel : placeholder}
      </label>
      <div className="relative">
        <input
          onClick={(e) => e.stopPropagation()}
          type={!isPassword ? "text" : type}
          id={props.name}
          placeholder={placeholder ? placeholder : ""}
          className={classnames(
            `focus:ring-background focus:border-background w-full rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm transition-colors focus:ring-2 focus:outline-none`,
            {
              "border-red-300 focus:border-red-500 focus:!ring-1 focus:ring-red-500":
                error && touched,
            },
          )}
          {...props}
        />
        {type == "password" && (
          <span
            onClick={() => changeIsPassword(!isPassword)}
            className="absolute top-1/2 right-[4%] -translate-y-1/2 cursor-pointer"
          >
            {!isPassword ? (
              <img
                onClick={() => changeIsPassword(!isPassword)}
                src="src/assets/eye.svg"
                alt="eye icon"
                className="w-4"
              />
            ) : (
              <img
                onClick={() => changeIsPassword(!isPassword)}
                src="src/assets/eye-off.svg"
                alt="invisible eye icon"
                className="w-4"
              />
            )}
          </span>
        )}
        {error && touched && (
          <p
            className={`absolute top-full left-0 inline-block translate-y-2 text-xs text-red-500`}
          >
            {error}
          </p>
        )}
      </div>
    </div>
  );
}
