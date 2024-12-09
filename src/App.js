import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login.tsx';
import Register from './pages/Register.tsx';
import Profile from './pages/Profile.tsx';
import MainPage from './pages/MainPage.tsx';
import './App.css'
import Navbar from './components/Navbar.tsx';

const App = () => {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        {/* Navbar */}
        <Navbar />

        {/* Main Content */}
        <main className="container mx-auto px-4 py-6">
          <Routes>
          <Route path='/main' element={<MainPage />} />
            <Route path='/profile' element={<Profile />} />
            <Route path="/signin" element={<Login />} />
            <Route path="/signup" element={<Register />} />
            <Route path="/" element={<h1 className="text-center">Welcome!</h1>} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;
