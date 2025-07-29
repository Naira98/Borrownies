// src/pages/Register.tsx
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Field } from 'react-final-form';
import AuthLayout from '../components/AuthLayout'; // Import AuthLayout
import { AuthInputField } from '../components/AuthInputField'; // Import AuthInputField
interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  nationalId: string;
  phoneNumber: string;
  password: string;
  confirmPassword: string;
  interests: string;
}

const Register = () => {
  const [notification, setNotification] = useState(false);
  const navigate = useNavigate();

  const interestsList = ['Fiction', 'Science', 'History', 'Fantasy', 'Biography'];

  const imageUrl = "https://img.freepik.com/premium-vector/people-learn-gain-knowledge-creative-design-schedule-students-learn-books-vector_566886-948.jpg";

  const validate = (values: FormData) => {
    const errors: Partial<FormData> = {};

    if (!values.firstName) errors.firstName = 'First Name is required';
    if (!values.lastName) errors.lastName = 'Last Name is required';
    if (!values.email) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
      errors.email = 'Invalid email address';
    }
    if (!values.nationalId) {
      errors.nationalId = 'National ID is required';
    } else if (!/^\d{14}$/.test(values.nationalId)) {
      errors.nationalId = 'National ID must be exactly 14 digits';
    }
    if (!values.phoneNumber) {
      errors.phoneNumber = 'Phone Number is required';
    } else if (!/^\d{11,13}$/.test(values.phoneNumber)) {
      errors.phoneNumber = 'Phone must be 11-13 digits';
    }
    if (!values.password) errors.password = 'Password is required';
    if (!values.confirmPassword) {
      errors.confirmPassword = 'Confirm Password is required';
    } else if (values.password !== values.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    return errors;
  };

  const onSubmit = (values: FormData) => {
    console.log('Registration Data:', values);
    setNotification(true);
    setTimeout(() => {
      setNotification(false);
      navigate('/email_verification'); // Redirect to Email Verification page
    }, 2000);
  };

  useEffect(() => {
    document.title = 'Book Nook - Register';
  }, []);

  return (
    <div className="min-h-screen h-[100dvh] w-full overflow-hidden flex items-center justify-center bg-gradient-to-br from-blue-100  p-4">
      {notification && (
        <div className="absolute top-4 right-4 bg-green-100 text-green-800 px-4 py-2 rounded-md shadow-md text-sm z-50">
          ✅ Registered successfully!
        </div>
      )}
      <div className="bg-white shadow-xl rounded-xl w-full max-w-[1400px] h-[calc(100vh-4rem)] grid grid-cols-1 md:grid-cols-2 overflow-hidden">
        <div className="relative p-8 flex flex-col justify-center bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-cover bg-no-repeat bg-center">
          <div className="mb-4">
            <h1 className="text-2xl font-semibold text-primary mb-1">Welcome to</h1>
            <h2 className="text-5xl font-extrabold text-secondary leading-snug tracking-tight">Book Nook</h2>
            <p className="text-l mt-3 text-gray-700">Discover a world of books tailored to your taste!</p>
          </div>
          <img
            src={imageUrl}
            alt="Book Nook Illustration"
            className="w-full h-auto mt-6 object-contain rounded-[3rem] shadow-md"
            style={{ maxHeight: '400px' }}
          />
        </div>
        {/* AuthLayout will now contain the form */}
        <AuthLayout<FormData> // Specify the type of FormValues here
          onSubmit={onSubmit}
          validate={validate}
          formTitle="Create Your Book Nook Account"
          submitButtonText="Sign Up"
          bottomLink={
            <p className="text-center text-primary mt-6 text-sm">
              Already have an account?{' '}
              <Link to="/login" className="text-secondary hover:underline font-semibold">
                Sign In
              </Link>
            </p>
          }
        >
          {({ showPassword, togglePassword, showConfirmPassword, toggleConfirmPassword }) => (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <AuthInputField name="firstName" label="First Name" />
                <AuthInputField name="lastName" label="Last Name" />
              </div>
              <AuthInputField name="email" label="Email Address" type="email" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <AuthInputField name="nationalId" label="National ID" />
                <AuthInputField name="phoneNumber" label="Phone Number" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <AuthInputField
                  name="password"
                  label="Password"
                  isPassword
                  showPasswordState={showPassword}
                  togglePasswordVisibility={togglePassword}
                />
                <AuthInputField
                  name="confirmPassword"
                  label="Confirm Password"
                  isPassword
                  showPasswordState={showConfirmPassword}
                  togglePasswordVisibility={toggleConfirmPassword}
                />
              </div>
              <div className="relative">
                <Field name="interests">
                  {({ input, meta }) => (
                    <>
                      <select
                        {...input}
                        id="interests"
                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-gray-700"
                      >
                        <option value="" disabled>Select your interests</option>
                        {interestsList.map((interest) => (
                          <option key={interest} value={interest}>{interest}</option>
                        ))}
                      </select>
                      <label htmlFor="interests" className="block text-primary text-sm font-semibold mb-2 mt-2">Interests (Optional)</label>
                      {meta.error && meta.touched && (
                        <p className="text-red-500 text-xs mt-1">{meta.error}</p>
                      )}
                    </>
                  )}
                </Field>
              </div>
            </>
          )}
        </AuthLayout>
      </div>
    </div>
  );
};

export default Register;

