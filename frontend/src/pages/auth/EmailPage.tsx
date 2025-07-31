import { Form, Field } from "react-final-form";
import AuthLayout from "../../components/auth/AuthLayout";
import MainButton from "../../components/shared/buttons/MainButton";
import type { EmailFormValues } from "../../types/auth";
const EmailPage = () => {
  const onSubmit = (values: EmailFormValues) => {
    console.log("Email submitted:", values.email);
  };

  const validate = (values: EmailFormValues) => {
    const errors: Partial<EmailFormValues> = {};

    if (!values.email) {
      errors.email = "Email is required";
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) {
      errors.email = "Invalid email address";
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
                    htmlFor="email"
                    className="text-primary mb-2 block text-sm font-medium"
                  >
                    Email Address
                  </label>
                  <Field name="email">
                    {({ input, meta }) => (
                      <div>
                        <input
                          {...input}
                          type="email"
                          id="email"
                          className={`focus:ring-background focus:border-background mb-5 w-full rounded-md border px-3 py-2 placeholder-gray-400 shadow-sm transition-colors focus:ring-2 focus:outline-none ${
                            meta.error && meta.touched
                              ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                              : "border-gray-300"
                          }`}
                          placeholder="example@ex.com"
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
                    label="Send emai"
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

export default EmailPage;
