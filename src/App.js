import React from 'react';
import Login from './components/auth/Login';
import Dashboard from './components/dashboard/Dashboard';
import { SettingsProvider } from './context/SettingsContext';
import { UserProvider } from './context/UserContext';
import { useUser } from './context/UserContext';
import { motion } from 'framer-motion';

const LoadingScreen = () => (
  <div className="h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center">
    <motion.div
      animate={{
        scale: [1, 1.2, 1],
        rotate: [0, 180, 360],
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }}
      className="w-16 h-16 border-4 border-purple-500 border-t-pink-500 rounded-full"
    />
  </div>
);

const AppContent = () => {
  const { userData, loading } = useUser();

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <div className="App">
      {userData ? <Dashboard /> : <Login />}
    </div>
  );
};

function App() {
  return (
    <UserProvider>
      <SettingsProvider>
        <AppContent />
      </SettingsProvider>
    </UserProvider>
  );
}

export default App; 