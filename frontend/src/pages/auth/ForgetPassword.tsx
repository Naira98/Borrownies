import { useEffect, useState } from "react";
import { Form } from "react-final-form";
import AuthLayout from "../../components/auth/AuthLayout";
import MainButton from "../../components/shared/buttons/MainButton";
import TextInput from "../../components/shared/formInputs/TextInput";
import type { EmailFormValues } from "../../types/auth";

const ForgetPassword = () => {
  const [showResendButton, setShowResendButton] = useState(false);
  const [resendCountdown, setResendCountdown] = useState(30);
  const [emailSent, setEmailSent] = useState(false);

  useEffect(() => {
    if (emailSent && resendCountdown > 0) {
      const timer = setTimeout(() => {
        setResendCountdown(resendCountdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (emailSent && resendCountdown === 0) {
      setShowResendButton(true);
    }
  }, [emailSent, resendCountdown]);

  const onSubmit = (values: EmailFormValues) => {
    console.log("Email submitted:", values.email);
    setEmailSent(true);
    setResendCountdown(30);
    setShowResendButton(false);
  };

  const onResend = () => {
    console.log("Re-sending email...");
    setEmailSent(true);
    setResendCountdown(30);
    setShowResendButton(false);
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
    <AuthLayout title="Forget Password">
      <div className="flex flex-1 flex-col overflow-auto md:flex-row-reverse">
        <div className="hidden w-1/2 items-center justify-center md:flex">
          <img
            src="src/assets/forget-password.svg"
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
                {!emailSent ? (
                  <>
                    <TextInput name="email" placeholder="Enter your email" />
                    <div className="mt-12">
                      <MainButton
                        disabled={submitting || pristine || hasValidationErrors}
                        loading={submitting}
                        label="Send emai"
                      />
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center space-y-4">
                    <p className="text-center">
                      An email has been sent to your inbox. Please check it to reset your password.
                    </p>
                    {showResendButton ? (
                      <MainButton
                        onClick={onResend}
                        label="Re-send email"
                      />
                    ) : (
                      <p className="text-sm text-gray-500">
                        You can re-send the email in {resendCountdown} seconds.
                      </p>
                    )}
                  </div>
                )}
              </form>
            )}
          />
        </div>
      </div>
    </AuthLayout>
  );
};

export default ForgetPassword;