import AuthLayout from "../../components/auth/AuthLayout";

const EmailVerification = () => {

  return (
    <AuthLayout>
      <div className="flex flex-1 flex-col overflow-auto md:flex-row-reverse">
        <div className="flex w-full flex-col items-center justify-center overflow-auto p-6 md:w-1/2 lg:p-8">
          <p className="text-center">
            We've sent a verification link to your email address. <br />
            Please check your inbox.
          </p>
        </div>
        <div className="hidden w-1/2 items-center justify-center md:flex">
          <img
            src="src/assets/email-sent.svg"
            className="max-w-[60%] object-contain"
            alt="Books"
          />
        </div>
      </div>
    </AuthLayout>
  );
};

export default EmailVerification;
