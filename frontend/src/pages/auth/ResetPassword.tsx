import { Form } from "react-final-form";
import AuthLayout from "../../components/auth/AuthLayout";
import MainButton from "../../components/shared/buttons/MainButton";
import TextInput from "../../components/shared/formInputs/TextInput";
import type { ResetPasswordValues } from "../../types/auth";

const ResetPassword = () => {
  const onSubmit = (values: ResetPasswordValues) => {
    console.log("Reset Password form submitted:", values);
  };

  const validate = (values: ResetPasswordValues) => {
    const errors: Partial<ResetPasswordValues> = {};

    if (!values.newPassword) {
      errors.newPassword = "Password is required";
    } else if (values.newPassword.length < 6) {
      errors.newPassword = "Password must be at least 6 characters";
    }

    if (!values.confirmPassword) {
      errors.confirmPassword = "Please confirm your password";
    }

    return errors;
  };

  return (
    <AuthLayout title="Reset Password">
      <div className="flex flex-1 flex-col overflow-auto md:flex-row-reverse">
        <div className="hidden w-1/2 items-center justify-center md:flex">
          <img
            src="src/assets/reset-password.svg"
            className="max-w-[50%] object-contain"
            alt="Books"
          />
        </div>
        <div className="flex w-full flex-col justify-center p-8 md:w-1/2">
          <Form
            onSubmit={onSubmit}
            validate={validate}
            render={({
              handleSubmit,
              submitting,
              pristine,
              hasValidationErrors,
            }) => (
              <form onSubmit={handleSubmit} className="space-y-6">
                {formData.map((item, index) => (
                  <TextInput
                    key={index}
                    name={item.name}
                    type={item.type}
                    placeholder={item.placeholder}
                  />
                ))}

                <div className="mt-6">
                  <MainButton
                    disabled={submitting || pristine || hasValidationErrors}
                    loading={submitting}
                    label="Reset Password"
                  />
                </div>
              </form>
            )}
          />
        </div>
      </div>
    </AuthLayout>
  );
};

export default ResetPassword;

const formData = [
  {
    name: "password",
    type: "password",
    placeholder: "New Password",
  },
  {
    name: "confirm-password",
    type: "password",
    placeholder: "Confirm Password",
  },
];
