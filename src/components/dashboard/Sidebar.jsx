import React from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart2, 
  Brain, 
  Calendar, 
  LogOut, 
  Settings, 
  User 
} from 'lucide-react';
import { auth } from '../../config/firebase';
import { signOut } from 'firebase/auth';

const Sidebar = ({ setIsLoggedIn }) => {
  const menuItems = [
    { icon: BarChart2, label: 'Timeline' },
    { icon: Brain, label: 'Mind Map' },
    { icon: Calendar, label: 'Learning Path' },
    { icon: User, label: 'Profile' },
    { icon: Settings, label: 'Settings' },
  ];

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setIsLoggedIn(false);
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <div className="w-64 bg-indigo-900 text-white p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">SkillFlow</h1>
      </div>
      
      <nav>
        <ul className="space-y-4">
          {menuItems.map((item, index) => (
            <motion.li 
              key={item.label}
              whileHover={{ x: 5 }}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <a 
                href="#" 
                className="flex items-center space-x-3 p-2 rounded-lg hover:bg-indigo-800 transition-colors"
              >
                <item.icon size={20} />
                <span>{item.label}</span>
              </a>
            </motion.li>
          ))}
        </ul>
      </nav>

      <div className="absolute bottom-6">
        <button 
          onClick={handleLogout}
          className="flex items-center space-x-2 text-red-300 hover:text-red-400 transition-colors"
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar; 