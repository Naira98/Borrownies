import React from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import EmailVerification from './pages/EmailVerification';

import logo from './assets/logo.svg'; 

const App: React.FC = () => {
  const location = useLocation();
  const hideNavbar = ['/register', '/login'].includes(location.pathname);

  return (
    <div className="min-h-screen bg-background text-primary">
      {!hideNavbar && (
        <nav className="bg-primary p-4 shadow-lg flex items-center justify-between">
          <Link to="/" className="flex items-center ml-20">
            <img src={logo} alt="logo" className="h-10 mr-20" />
          </Link>
          <ul className="flex space-x-8 mr-20"> 
            <li>
              <Link to="/" className="text-white hover:text-secondary font-semibold text-lg transition duration-300">Home</Link>
            </li>
            <li>
              <Link to="/register" className="text-white hover:text-secondary font-semibold text-lg transition duration-300">Register</Link>
            </li>
            <li>
              <Link to="/login" className="text-white hover:text-secondary font-semibold text-lg transition duration-300">Login</Link>
            </li>
          </ul>
        </nav>
      )}

      <main className="container mx-auto">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/EmailVerification" element={<EmailVerification />} />

        </Routes>
      </main>
    </div>
  );
};

export default App;
