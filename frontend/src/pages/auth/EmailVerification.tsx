import { useEffect } from "react";
import AuthLayout from "../../components/auth/AuthLayout";

const EmailVerification = () => {
  useEffect(() => {
    document.title = "Verify Your Email - Book Nook";
  }, []);

  return (
    <AuthLayout title="Check Your Email">
      <div className="flex w-full flex-1 flex-col items-center justify-center rounded-xl bg-white p-8 text-center shadow-xl">
        {/* <h2 className="text-primary mb-2 text-2xl font-bold">
          Check Your Email
        </h2> */}
        <p className="mb-6 text-gray-700">
          We've sent a verification link to your email address. <br />
          Please check your inbox.
        </p>
      </div>
    </AuthLayout>
  );
};

export default EmailVerification;
