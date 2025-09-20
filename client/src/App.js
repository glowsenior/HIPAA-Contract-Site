import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ConfigProvider, App as AntApp } from 'antd';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// import { medicalTheme } from './theme/medicalTheme';
import { AuthProvider } from './contexts/AuthContext';
import { ContractProvider } from './contexts/ContractContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Contracts from './pages/Contracts';
import CreateContract from './pages/CreateContract';
import ContractDetails from './pages/ContractDetails';
import Profile from './pages/Profile';
import './App.css';

function App() {
  return (
    <ConfigProvider>
      <AntApp>
        <AuthProvider>
          <ContractProvider>
            <div className="App">
              <Navbar />
              <main className="main-content">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/dashboard" element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  } />
                  <Route path="/contracts" element={
                    <ProtectedRoute>
                      <Contracts />
                    </ProtectedRoute>
                  } />
                  <Route path="/contracts/create" element={
                    <ProtectedRoute>
                      <CreateContract />
                    </ProtectedRoute>
                  } />
                  <Route path="/contracts/:id" element={
                    <ProtectedRoute>
                      <ContractDetails />
                    </ProtectedRoute>
                  } />
                  <Route path="/profile" element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  } />
                </Routes>
              </main>
              <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
              />
            </div>
          </ContractProvider>
        </AuthProvider>
      </AntApp>
    </ConfigProvider>
  );
}

export default App;
