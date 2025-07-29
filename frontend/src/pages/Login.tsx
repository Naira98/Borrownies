import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Form, Field } from 'react-final-form';



interface LoginFormValues {
  email: string;
  password: string;
  role: string;
}

const Login= () => {
  const [showPassword, setShowPassword] = useState(false);
  const [notification, setNotification] = useState(false);

  const imageUrl = "https://img.freepik.com/premium-photo/hand-drawn-flat-design-book-club-illustration_978521-30357.jpg";

  const rolesList = ['Manager', 'Client', 'Employee', 'Courier'];

  const validate = (values: LoginFormValues) => {
    const errors: Partial<LoginFormValues> = {};

    if (!values.email) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
      errors.email = 'Invalid email address';
    }

    if (!values.password) {
      errors.password = 'Password is required';
    }

    if (!values.role) {
      errors.role = 'Please select your role';
    }

    return errors;
  };

  const onSubmit = (values: LoginFormValues) => {
    console.log('Login Data:', values);
    setNotification(true);
    setTimeout(() => {
      setNotification(false);
    }, 3000);
  };

  useEffect(() => {
    document.title = 'Book Nook - Login';
  }, []);

  // getLabelClass adapted for fields that use peer-focus logic
  const getLabelClass = (metaActive: boolean | undefined, inputValue: string) => {
    return `absolute left-3 text-gray-500 transition-all duration-200 px-1 bg-white pointer-events-none
      ${(inputValue || metaActive) ? '-top-4 text-xs' : 'top-3 text-sm'} peer-focus:-top-4 peer-focus:text-xs`;
  };

  return (
    <div className="min-h-screen h-[100dvh] w-full overflow-hidden flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-100 p-4">
      {notification && (
        <div className="absolute top-4 right-4 bg-green-100 text-green-800 px-4 py-2 rounded-md shadow-md text-sm z-50">
          ✅ Logged in successfully!
        </div>
      )}

      <div className="bg-white shadow-xl rounded-xl w-full max-w-[1400px] h-[calc(100vh-4rem)] grid grid-cols-1 md:grid-cols-2 overflow-hidden">
        <div className="relative p-8 flex flex-col justify-center bg-gray-50 bg-[url('https://www.transparenttextures.com/patterns/clean-gray-paper.png')] bg-cover bg-no-repeat bg-center">
          <div className="mb-4">
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-1">Step into Your Next Story</h1>
            <h2 className="text-4xl lg:text-5xl font-extrabold text-secondary leading-snug tracking-tight drop-shadow-lg">Book Nook Awaits</h2>
            <p className="text-base mt-3 text-gray-700 max-w-sm">Your literary journey begins here. Log in to explore endless tales and connect with a community of book lovers.</p>
          </div>
          <img
            src={imageUrl}
            alt="Book Nook Illustration"
            className="w-full h-auto mt-6 object-contain rounded-[3rem] shadow-md"
            style={{ maxHeight: '400px' }}
          />
        </div>

        <div className="p-8 md:p-12 flex flex-col justify-center overflow-y-auto">
          <h2 className="text-3xl font-bold text-primary mb-6 text-center">Login to Your Account</h2>
          <Form
            onSubmit={onSubmit}
            validate={validate}
            render={({ handleSubmit, submitting, pristine }) => (
              <form onSubmit={handleSubmit} className="space-y-6">
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

                <Field name="password">
                  {({ input, meta }) => (
                    <div className="relative">
                      <input
                        {...input}
                        type={showPassword ? 'text' : 'password'}
                        placeholder=" "
                        className={`peer w-full p-3 border ${meta.error && meta.touched ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-primary`}
                        autoComplete="off"
                      />
                      <label htmlFor={input.name} className={getLabelClass(meta.active, input.value)}>
                        Password
                      </label>
                      <div
                        className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {/*showPassword ? <EyeOff size={18} /> : <Eye size={18} />*/}
                      </div>
                      {meta.error && meta.touched && (
                        <p className="text-red-500 text-xs mt-1">{meta.error}</p>
                      )}
                    </div>
                  )}
                </Field>

                {/* Select Role Dropdown */}
                <div className="relative">
                  <Field name="role">
                    {({ input, meta }) => (
                      <>
                        <select
                          {...input}
                          id="role"
                          className={`w-full p-3 border ${meta.error && meta.touched ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-gray-700`}
                        >
                          <option value="" disabled>Select your role</option>
                          {rolesList.map((role) => (
                            <option key={role} value={role.toLowerCase()}>{role}</option>
                          ))}
                        </select>
                        <label htmlFor="role" className="block text-primary text-sm font-semibold mb-2 mt-2">Your Role</label>
                        {meta.error && meta.touched && (
                          <p className="text-red-500 text-xs mt-1">{meta.error}</p>
                        )}
                      </>
                    )}
                  </Field>
                </div>

                <div className="text-right">
                  <Link to="/forgot-password" className="text-secondary hover:underline text-sm font-semibold">
                    Forgot Password?
                  </Link>
                </div>

                <button
                  type="submit"
                  className="w-full bg-primary text-white py-2 rounded-md font-semibold text-base hover:bg-primary/90 transition duration-300 ease-in-out hover:shadow-lg"
                  disabled={submitting || pristine}
                >
                  Sign In
                </button>
              </form>
            )}
          />

          {/* Social Login Options */}
          <div className="mt-8 text-center">
            <p className="text-gray-600 text-sm mb-4">Or login with</p>
            <div className="flex justify-center space-x-4">
              <button className="flex items-center justify-center p-3 border border-gray-300 rounded-full shadow-sm hover:shadow-md transition duration-200 focus:outline-none focus:ring-2 focus:ring-primary">
               {/*<FaGoogle size={20} className="text-green-500" />*/} 
              </button>
              <button className="flex items-center justify-center p-3 border border-gray-300 rounded-full shadow-sm hover:shadow-md transition duration-200 focus:outline-none focus:ring-2 focus:ring-primary">
                 {/*<FaFacebook size={20} className="text-blue-600" />*/}
              </button>
              <button className="flex items-center justify-center p-3 border border-gray-300 rounded-full shadow-sm hover:shadow-md transition duration-200 focus:outline-none focus:ring-2 focus:ring-primary">
                {/** <FaGithub size={20} className="text-gray-800" />*/}
              </button>
              
            </div>
          </div>

          <p className="text-center text-primary mt-6 text-sm">
            Don't have an account?{' '}
            <Link to="/register" className="text-secondary hover:underline font-semibold">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
