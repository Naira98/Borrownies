import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { Form, Field } from 'react-final-form';

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

const Register: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); 
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
      navigate('/EmailVerification'); // Redirect to Email Verification page
    }, 2000);
  };

  useEffect(() => {
    document.title = 'Book Nook - Register';
  }, []);

  const getLabelClass = (metaActive: boolean | undefined, inputValue: string) => {
    return `absolute left-3 text-gray-500 transition-all duration-200 px-1 bg-white pointer-events-none
      ${(inputValue || metaActive) ? '-top-4 text-xs' : 'top-3 text-sm'} peer-focus:-top-4 peer-focus:text-xs`;
  };

  return (
    <div className="min-h-screen h-[100dvh] w-full overflow-hidden flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-100 p-4">
      {notification && (
        <div className="absolute top-4 right-4 bg-green-100 text-green-800 px-4 py-2 rounded-md shadow-md text-sm z-50">
          ✅ Registered successfully!
        </div>
      )}
      <div className="bg-white shadow-xl rounded-xl w-full max-w-[1400px] h-[calc(100vh-4rem)] grid grid-cols-1 md:grid-cols-2 overflow-hidden">
        <div className="relative p-8 flex flex-col justify-center bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-cover bg-no-repeat bg-center">
          <div className="mb-4">
            <h1 className="text-xl font-semibold text-primary mb-1">Welcome to</h1>
            <h2 className="text-3xl font-extrabold text-secondary leading-snug tracking-tight">Book Nook</h2>
            <p className="text-sm mt-3 text-gray-700">Discover a world of books tailored to your taste!</p>
          </div>
          <img
            src={imageUrl}
            alt="Book Nook Illustration"
            className="w-full h-auto mt-6 object-contain rounded-[3rem] shadow-md"
            style={{ maxHeight: '400px' }}
          />
        </div>
        <div className="p-8 md:p-12 flex flex-col justify-center overflow-y-auto">
          <h2 className="text-3xl font-bold text-primary mb-6 text-center">Create Your Book Nook Account</h2>
          <Form
            onSubmit={onSubmit}
            validate={validate}
            render={({ handleSubmit, submitting, pristine }) => ( 
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {['firstName', 'lastName'].map((fieldName) => (
                    <Field key={fieldName} name={fieldName}>
                      {({ input, meta }) => (
                        <div className="relative">
                          <input
                            {...input}
                            type="text"
                            placeholder=" "
                            className="peer w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                            autoComplete="off"
                          />
                          <label htmlFor={input.name} className={getLabelClass(meta.active, input.value)}>
                            {fieldName === 'firstName' ? 'First Name' : 'Last Name'}
                          </label>
                          {meta.error && meta.touched && (
                            <p className="text-red-500 text-xs mt-1">{meta.error}</p>
                          )}
                        </div>
                      )}
                    </Field>
                  ))}
                </div>
                <Field name="email">
                  {({ input, meta }) => (
                    <div className="relative">
                      <input
                        {...input}
                        type="email"
                        placeholder=" "
                        className={`peer w-full p-3 border ${meta.error && meta.touched ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-primary`}
                        autoComplete="off"
                      />
                      <label htmlFor={input.name} className={getLabelClass(meta.active, input.value)}>
                        Email Address
                      </label>
                      {meta.error && meta.touched && (
                        <p className="text-red-500 text-xs mt-1">{meta.error}</p>
                      )}
                    </div>
                  )}
                </Field>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {[
                    { name: 'nationalId', label: 'National ID' },
                    { name: 'phoneNumber', label: 'Phone Number' }
                  ].map(({ name, label }) => (
                    <Field key={name} name={name}>
                      {({ input, meta }) => (
                        <div className="relative">
                          <input
                            {...input}
                            type="text"
                            placeholder=" "
                            className={`peer w-full p-3 border ${meta.error && meta.touched ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-primary`}
                            autoComplete="off"
                          />
                          <label htmlFor={input.name} className={getLabelClass(meta.active, input.value)}>
                            {label}
                          </label>
                          {meta.error && meta.touched && (
                            <p className="text-red-500 text-xs mt-1">{meta.error}</p>
                          )}
                        </div>
                      )}
                    </Field>
                  ))}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {['password', 'confirmPassword'].map((fieldName) => (
                    <Field key={fieldName} name={fieldName}>
                      {({ input, meta }) => (
                        <div className="relative">
                          <input
                            {...input}
                            type={(fieldName === 'password' && !showPassword) || (fieldName === 'confirmPassword' && !showConfirmPassword) ? 'password' : 'text'}
                            placeholder=" "
                            className={`peer w-full p-3 border ${meta.error && meta.touched ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-primary`}
                            autoComplete="off"
                          />
                          <label htmlFor={input.name} className={getLabelClass(meta.active, input.value)}>
                            {fieldName === 'password' ? 'Password' : 'Confirm Password'}
                          </label>
                          <div
                            className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500"
                            onClick={() => fieldName === 'password' ? setShowPassword(!showPassword) : setShowConfirmPassword(!showConfirmPassword)} 
                          >
                            {(fieldName === 'password' && showPassword) || (fieldName === 'confirmPassword' && showConfirmPassword) ? <EyeOff size={18} /> : <Eye size={18} />}
                          </div>
                          {meta.error && meta.touched && (
                            <p className="text-red-500 text-xs mt-1">{meta.error}</p>
                          )}
                        </div>
                      )}
                    </Field>
                  ))}
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
                <button
                  type="submit"
                  className="w-full bg-primary text-white py-2 rounded-md font-semibold text-base hover:bg-primary/90 transition duration-300 ease-in-out hover:shadow-lg"
                  disabled={submitting || pristine}
                >
                  Sign Up
                </button>
              </form>
            )}
          />
          <p className="text-center text-primary mt-6 text-sm">
            Already have an account?{' '}
            <Link to="/login" className="text-secondary hover:underline font-semibold">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
