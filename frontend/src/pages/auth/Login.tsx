import { Form, Field } from "react-final-form";
import TextInput from "../../components/shared/formInputs/TextInput";
import type { LoginFormData } from "../../types/auth";
import MainButton from "../../components/shared/buttons/MainButton";
import { Link } from "react-router-dom";
import AuthLayout from "../../components/auth/AuthLayout";

const LoginPage = () => {
  const onSubmit = async (values: LoginFormData) => {
    console.log("Login form submitted:", values);
    // fake await to handle loading state
    await new Promise((resolve) => setTimeout(resolve, 1000));
  };

  // recives the current values
  const validate = (values: LoginFormData) => {
    const errors: Partial<LoginFormData> = {};

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
    <AuthLayout cardClassName="md:min-h-[550px]">
      <div className="flex flex-1 flex-col overflow-auto md:flex-row">
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
              <form onSubmit={handleSubmit}>
                {formData.map((item, index) => (
                  <TextInput
                    key={index}
                    name={item.name}
                    type={item.type}
                    placeholder={item.placeholder}
                  />
                ))}
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Field name="rememberMe" type="checkbox">
                      {({ input }) => (
                        <label className="flex items-center">
                          <input
                            {...input}
                            type="checkbox"
                            className="text-primary focus:ring-primary mr-2 h-4 w-4 rounded border-gray-300"
                          />
                          Remember me
                        </label>
                      )}
                    </Field>
                  </div>
                  <div className="text-sm">
                    <Link
                      to="/forget-password"
                      className="text-primary font-medium transition-colors"
                    >
                      Forgot your password?
                    </Link>
                  </div>
                </div>
                <div className="mt-12">
                  <MainButton
                    disabled={submitting || pristine || hasValidationErrors}
                    loading={submitting}
                    label="Login"
                  />
                </div>
                <div className="mt-5 text-center">
                  <p className="text-primary text-sm">
                    Don't have an account?{" "}
                    <Link
                      to="/register"
                      className="text-secondary font-medium transition-colors"
                    >
                      Register
                    </Link>
                  </p>
                </div>
              </form>
            )}
          />
        </div>
      </div>
    </AuthLayout>
  );
};

export default LoginPage;

const formData = [
  {
    name: "email",
    type: "email",
    placeholder: "Enter your email",
    inputLabel: "Email Address",
  },
  {
    name: "password",
    type: "password",
    placeholder: "*********",
    inputLabel: "Password",
  },
];
