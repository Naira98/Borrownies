import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';


// logo image
import logo from './assets/logo.svg'; 

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-background text-primary">
      <nav className="bg-primary p-4 shadow-lg flex items-center justify-between">
  
        <Link to="/" className="flex items-center ml-20">
          <img src={logo} alt="logo" className="h-10 mr-20" />
          {/* <span className="text-secondary hover:text-white font-semibold text-xl transition duration-300">BookNook</span> */}
        </Link>

        {/* Navigation links - Now aligned to the right */}
        <ul className="flex space-x-8 mr-20"> 
          <li>
            <Link to="/" className="text-secondary hover:text-white font-semibold text-lg transition duration-300">Home</Link>
          </li>
          <li>
            <Link to="/register" className="text-secondary hover:text-white font-semibold text-lg transition duration-300">Register</Link>
          </li>
          <li>
            <Link to="/login" className="text-secondary hover:text-white font-semibold text-lg transition duration-300">Login</Link>
          </li>
        </ul>
      </nav>

      <main className="container mx-auto">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </main>
    </div>
  );
};

export default App;

