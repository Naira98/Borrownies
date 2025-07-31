import { Form, Field } from "react-final-form";
import { useNavigate } from "react-router-dom";

interface EmailFormValues {
  email: string;
}

const EmailPage = () => {
  const navigate = useNavigate();

  const onSubmit = (values: EmailFormValues) => {
    console.log("Email submitted:", values.email);
    navigate("/reset-password");
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
    <div className="bg-background flex min-h-screen items-center justify-center p-4">
      <div className="flex min-h-[500px] w-full max-w-5xl flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg md:min-h-[550px]">
        <div className="relative w-full p-6 text-center">
          <img
            src="src/assets/logo.svg"
            className="pointer-events-none absolute top-1/2 left-1/2 h-32 w-32 -translate-x-1/2 -translate-y-1/2 transform opacity-10"
          />

          <h2 className="text-primary relative z-10 text-2xl font-bold">
            Reset Your Password
          </h2>
        </div>

        <div className="flex flex-1 flex-col md:flex-row">
          <div className="hidden w-1/2 items-center justify-center md:flex">
            <img
              src="src/assets/undraw_bookshelves_vhu6 (2).svg"
              className="max-h-[80%] max-w-[80%] object-contain"
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

                  <div>
                    <button
                      type="submit"
                      disabled={submitting || pristine || hasValidationErrors}
                      className="group bg-primary hover:bg-background hover:text-primary relative flex w-full justify-center rounded-md border border-transparent px-4 py-2 text-sm font-medium text-white transition-colors focus:ring-2 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {submitting ? (
                        <div className="flex items-center"></div>
                      ) : (
                        "Next"
                      )}
                    </button>
                  </div>
                </form>
              )}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailPage;