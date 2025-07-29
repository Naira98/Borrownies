// src/components/AuthLayout.tsx
import type { ReactNode } from 'react';
import { useState } from 'react';
import { Form } from 'react-final-form';
// No longer importing AuthInputField directly here, it's used in Register/Login

// Type for the props passed to the children render prop
interface AuthLayoutChildrenProps {
  showPassword: boolean;
  togglePassword: () => void;
  showConfirmPassword: boolean;
  toggleConfirmPassword: () => void;
}

interface AuthLayoutProps<FormValues> {
  onSubmit: (values: FormValues) => void;
  validate?: (values: FormValues) => Partial<FormValues>;
  initialValues?: FormValues;
  formTitle: string;
  submitButtonText: string;
  bottomLink: ReactNode;
  children: (props: AuthLayoutChildrenProps) => ReactNode;
}

// Make AuthLayout a generic component to avoid 'any'
const AuthLayout = <FormValues extends object>({
  onSubmit,
  validate,
  initialValues,
  formTitle,
  submitButtonText,
  bottomLink,
  children,
}: AuthLayoutProps<FormValues>) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const togglePassword = () => setShowPassword((prev) => !prev);
  const toggleConfirmPassword = () => setShowConfirmPassword((prev) => !prev);

  return (
    <div className="p-8 md:p-12 flex flex-col justify-center overflow-y-auto">
      <h2 className="text-3xl font-bold text-primary mb-6 text-center">{formTitle}</h2>
      <Form<FormValues> // Specify the generic type here for Form
        onSubmit={onSubmit}
        validate={validate}
        initialValues={initialValues}
        render={({ handleSubmit, submitting, pristine }) => (
          <form onSubmit={handleSubmit} className="space-y-6">
            {children({
              showPassword,
              togglePassword,
              showConfirmPassword,
              toggleConfirmPassword,
            })}
            <button
              type="submit"
              className="w-full bg-primary text-white py-2 rounded-md font-semibold text-base hover:bg-primary/90 transition duration-300 ease-in-out hover:shadow-lg"
              disabled={submitting || pristine}
            >
              {submitButtonText}
            </button>
          </form>
        )}
      />
      {bottomLink}
    </div>
  );
};

export default AuthLayout;