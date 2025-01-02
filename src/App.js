import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login.tsx';
import Register from './pages/Register.tsx';
import Profile from './pages/Profile.tsx';
import MainPage from './pages/MainPage.tsx';
import './App.css'
import "@fontsource/inter";
import Navbar from './components/Navigation/Navbar.tsx';
import HomePage from './pages/Homepage.tsx';
import { ToastContainer, Bounce } from 'react-toastify';

const App = () => {
  return (
    <Router>
      <div className="font-sans">
        {/* Navbar */}
        <Navbar />

        {/* Main Content */}
        <main>
          <Routes>
            <Route path='/main' element={<MainPage />} />
            <Route path='/profile' element={<Profile />} />
            <Route path="/signin" element={<Login />} />
            <Route path="/signup" element={<Register />} />
            <Route path="/" element={<HomePage />} />
          </Routes>
        </main>
        <ToastContainer
          className="z-100"
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss={false}
          draggable={false}
          pauseOnHover={false}
          theme="light"
          transition={Bounce}
        />
      </div>
    </Router>
  );
};

export default App;
