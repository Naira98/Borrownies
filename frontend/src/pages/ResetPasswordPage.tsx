import { Form, Field } from "react-final-form";
import { useNavigate } from "react-router-dom";

interface ResetPasswordValues {
  newPassword: string;
  confirmPassword: string;
}

const ResetPasswordPage = () => {
  const navigate = useNavigate();

  const onSubmit = (values: ResetPasswordValues) => {
    if (values.newPassword !== values.confirmPassword) {
      return { confirmPassword: "Passwords do not match" };
    }
    console.log("Password reset:", values.newPassword);
    alert("Password reset successfully!");
    navigate("/login");
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
    <div className="bg-background flex min-h-screen items-center justify-center p-4">
      <div className="flex min-h-[500px] w-full max-w-5xl flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg md:min-h-[550px]">
        <div className="relative w-full p-6 text-center">
          <img
            src="src/assets/logo.svg"
            className="pointer-events-none absolute top-1/2 left-1/2 h-32 w-32 -translate-x-1/2 -translate-y-1/2 transform opacity-10"
          />

          <h2 className="text-primary relative z-10 text-2xl font-bold">
            Set New Password
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

                  <div className="flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => navigate(-1)}
                      className="text-primary hover:bg-background hover:text-primary rounded-md border border-gray-300 px-4 py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      disabled={submitting || pristine || hasValidationErrors}
                      className="group bg-primary hover:bg-background hover:text-primary relative flex justify-center rounded-md border border-transparent px-4 py-2 text-sm font-medium text-white transition-colors focus:ring-2 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {submitting ? (
                        <div className="flex items-center"></div>
                      ) : (
                        "Reset Password"
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

export default ResetPasswordPage;