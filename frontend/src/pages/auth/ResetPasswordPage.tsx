import { Form, Field } from "react-final-form";
import AuthLayout from "../../components/auth/AuthLayout";
import MainButton from "../../components/shared/buttons/MainButton";
import type { ResetPasswordValues } from "../../types/auth";

const ResetPasswordPage = () => {
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
            src="src/assets/login.svg"
            className="max-w-[80%] object-contain"
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
                <div>
                  <label
                    htmlFor="newPassword"
                    className="text-primary mb-2 block text-sm font-medium"
                  >
                    New Password
                  </label>
                  <Field name="newPassword">
                    {({ input, meta }) => (
                      <div>
                        <input
                          {...input}
                          type="password"
                          id="newPassword"
                          className={`focus:ring-background focus:border-background mb-5 w-full rounded-md border px-3 py-2 placeholder-gray-400 shadow-sm transition-colors focus:ring-2 focus:outline-none ${
                            meta.error && meta.touched
                              ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                              : "border-gray-300"
                          }`}
                          placeholder="******"
                        />
                        {meta.error && meta.touched && (
                          <p className="mt-1 text-sm text-red-600">
                            {meta.error}
                          </p>
                        )}
                      </div>
                    )}
                  </Field>
                </div>

                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="text-primary mb-2 block text-sm font-medium"
                  >
                    Confirm Password
                  </label>
                  <Field name="confirmPassword">
                    {({ input, meta }) => (
                      <div>
                        <input
                          {...input}
                          type="password"
                          id="confirmPassword"
                          className={`focus:ring-background focus:border-background mb-5 w-full rounded-md border px-3 py-2 placeholder-gray-400 shadow-sm transition-colors focus:ring-2 focus:outline-none ${
                            meta.error && meta.touched
                              ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                              : "border-gray-300"
                          }`}
                          placeholder="******"
                        />
                        {meta.error && meta.touched && (
                          <p className="mt-1 text-sm text-red-600">
                            {meta.error}
                          </p>
                        )}
                      </div>
                    )}
                  </Field>
                </div>

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

export default ResetPasswordPage;
