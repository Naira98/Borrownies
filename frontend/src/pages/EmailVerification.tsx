import React, { useEffect } from 'react';
import { MailCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

const EmailVerification: React.FC = () => {
  useEffect(() => {
    document.title = 'Verify Your Email - Book Nook';
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-100 p-4">
      <div className="bg-white shadow-xl rounded-xl max-w-md w-full p-8 text-center">
        <div className="flex justify-center mb-4">
          <MailCheck className="text-primary" size={48} />
        </div>
        <h2 className="text-2xl font-bold text-primary mb-2">Check Your Email</h2>
        <p className="text-gray-700 mb-6">
          We've sent a verification link to your email address. <br />
          Please click the link to verify your account.
        </p>

        <Link
          to="/login"
          className="text-sm text-secondary hover:underline font-semibold"
        >
          Go to Login
        </Link>
      </div>
    </div>
  );
};

export default EmailVerification;
