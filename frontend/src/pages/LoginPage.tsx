import { Form, Field } from "react-final-form";

interface LoginFormValues {
  email: string;
  password: string;
}
// this will handle all validations for checking email and password
const LoginPage = () => {
  const onSubmit = (values: LoginFormValues) => {
    console.log("Login form submitted:", values);
    // TODO////
  };
  // recives the current values
  const validate = (values: LoginFormValues) => {
    const errors: Partial<LoginFormValues> = {};
    
    if (!values.email) {
      errors.email = "Email is required";
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) {
      errors.email = "Invalid email address";
    }

    if (!values.password) {
      errors.password = "Password is required";
      //  dummy check
    } else if (values.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
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
            Welcome to BookNook
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
                            // this spread all properties
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
                    <label
                      htmlFor="password"
                      className="text-primary mb-2 block text-sm font-medium"
                    >
                      Password
                    </label>
                    <Field name="password">
                      {({ input, meta }) => (
                        <div>
                          <input
                            {...input}
                            type="password"
                            id="password"
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

                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <input
                        id="remember-me"
                        name="remember-me"
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <label
                        htmlFor="remember-me"
                        className="text-primary ml-2 block text-sm"
                      >
                        Remember me
                      </label>
                    </div>
                    <div className="text-sm">
                      <a
                        href="#"
                        className="font-medium text-blue-600 transition-colors hover:text-blue-500"
                      >
                        Forgot your password?
                      </a>
                    </div>
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
                        "Sign in"
                      )}
                    </button>
                  </div>

                  <div className="text-center">
                    <p className="text-primary text-sm">
                      Don't have an account?{" "}
                      <a
                        href="#"
                        className="font-medium text-blue-600 transition-colors hover:text-blue-500"
                      >
                        Sign up
                      </a>
                    </p>
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

export default LoginPage;
