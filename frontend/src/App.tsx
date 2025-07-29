import { Routes, Route, BrowserRouter} from 'react-router-dom' ;
import Home from './pages/Home';
import Register from './pages/Register';
import LoginPage from './pages/LoginPage';
import EmailVerification from './pages/EmailVerification';

const App = () => {
  return (
     <BrowserRouter>
         <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/email_verification" element={<EmailVerification />} />
        </Routes>
     </BrowserRouter>
  );
};

export default App;




















// import { Routes, Route, BrowserRouter} from 'react-router-dom';
// import Home from './pages/Home';
// import Register from './pages/Register';
// import Login from './pages/Login';
// import EmailVerification from './pages/EmailVerification';


// const App = () => {
//   return (
//      <BrowserRouter>
//          <Routes>
//           <Route path="/" element={<Home />} />
//           <Route path="/register" element={<Register />} />
//           <Route path="/login" element={<Login />} />
//           <Route path="/email_verification" element={<EmailVerification />} />
//         </Routes>
//      </BrowserRouter>
//   );
// };
// export default App;
