import { Link, useNavigate } from "react-router-dom";
import { Form } from "react-final-form";
import MainButton from "../components/shared/buttons/MainButton";
import TextInput from "../components/shared/formInputs/TextInput";
import AuthLayout from "../components/auth/AuthLayout";
import type { RegisterFormData } from "../types/auth";

export default function Register() {
  const navigate = useNavigate();

  const validate = (values: RegisterFormData) => {
    const errors: Partial<RegisterFormData> = {};

    if (!values.firstName) errors.firstName = "First Name is required";
    if (!values.lastName) errors.lastName = "Last Name is required";
    if (!values.email) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
      errors.email = "Invalid email address";
    }
    if (!values.nationalId) {
      errors.nationalId = "National ID is required";
    } else if (!/^\d{14}$/.test(values.nationalId)) {
      errors.nationalId = "National ID must be exactly 14 digits";
    }
    if (!values.phoneNumber) {
      errors.phoneNumber = "Phone Number is required";
    } else if (!/^\d{11,13}$/.test(values.phoneNumber)) {
      errors.phoneNumber = "Phone must be 11-13 digits";
    }
    if (!values.password) errors.password = "Password is required";
    if (!values.confirmPassword) {
      errors.confirmPassword = "Confirm Password is required";
    } else if (values.password !== values.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    return errors;
  };

  const onSubmit = (values: RegisterFormData) => {
    console.log("Registration Data:", values);
    setTimeout(() => {
      navigate("/email_verification"); // Redirect to Email Verification page
    }, 2000);
  };

  return (
    <AuthLayout imgSrc="src/assets/register.svg">
      <div className="flex w-full flex-col overflow-auto p-6 md:w-1/2 lg:p-8">
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
              <div className="flex flex-wrap gap-x-5">
                {RegisterformData.map((item, index) => (
                  <TextInput
                    key={index}
                    name={item.name}
                    type={item.type}
                    placeholder={item.placeholder}
                    inputLabel={item.inputLabel}
                    containerClassName={item.containerClassName}
                  />
                ))}
              </div>

              <div className="mt-6">
                <MainButton
                  disabled={submitting || pristine || hasValidationErrors}
                  loading={submitting}
                  label="Register"
                />
              </div>
            </form>
          )}
        />
        <div className="mt-5 text-center">
          <p className="text-primary text-sm">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-secondary font-medium transition-colors"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </AuthLayout>
  );
}

const RegisterformData = [
  {
    name: "firstName",
    type: "text",
    placeholder: "First Name",
    inputLabel: "First Name",
    containerClassName: "!w-full sm:!w-[calc(50%-10px)]",
  },
  {
    name: "lastName",
    type: "text",
    placeholder: "Last Name",
    inputLabel: "Last Name",
    containerClassName: "!w-full sm:!w-[calc(50%-10px)]",
  },
  {
    name: "email",
    type: "email",
    placeholder: "Email Address",
    inputLabel: "Email Address",
  },
  {
    name: "nationalId",
    type: "text",
    placeholder: "National ID",
    inputLabel: "National ID",
    containerClassName: "!w-full sm:!w-[calc(50%-10px)]",
  },
  {
    name: "phoneNumber",
    type: "text",
    placeholder: "Phone Number",
    inputLabel: "Phone Number",
    containerClassName: "!w-full sm:!w-[calc(50%-10px)]",
  },
  {
    name: "password",
    type: "password",
    placeholder: "Password",
    inputLabel: "Password",
  },
  {
    name: "confirmPassword",
    type: "password",
    placeholder: "Confirm Password",
    inputLabel: "Confirm Password",
  },
];
