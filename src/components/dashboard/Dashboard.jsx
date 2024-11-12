import React, { useState, useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { 
  Star, 
  Settings as SettingsIcon,
  LogOut, 
  GanttChart, 
  Brain, 
  TrendingUp,
  Users,
  BarChart2,
  Calendar,
  Plus,
  User
} from 'lucide-react';
import { signOut } from 'firebase/auth';
import { auth } from '../../config/firebase';
import Timeline from './Timeline';
import MindMap from './MindMap';
import LearningPath from './LearningPath';
import Settings from '../common/Settings';
import Profile from './Profile';
import Modal from '../common/Modal';

const Particle = ({ delay }) => (
  <motion.div
    className="absolute rounded-full bg-gradient-to-r from-purple-400 to-pink-400"
    style={{
      width: Math.random() * 6 + 2,
      height: Math.random() * 6 + 2,
    }}
    initial={{ 
      x: Math.random() * window.innerWidth,
      y: window.innerHeight + 50,
      opacity: 0 
    }}
    animate={{
      y: -50,
      opacity: [0, 1, 1, 0],
    }}
    transition={{
      duration: Math.random() * 10 + 10,
      repeat: Infinity,
      delay: delay,
    }}
  />
);

const FeatureCard = ({ icon: Icon, title, description }) => (
  <motion.div 
    className="bg-[var(--bg-card)] backdrop-blur-md border border-white/20 rounded-lg p-6"
    whileHover={{ scale: 1.02 }}
    transition={{ duration: 0.2 }}
  >
    <div className="flex items-center space-x-2 mb-4">
      <Icon size={24} className="gradient-text" />
      <h3 className="text-lg font-semibold text-[var(--text-primary)]">{title}</h3>
    </div>
    <p className="text-sm text-[var(--text-secondary)]">{description}</p>
  </motion.div>
);

const TabButton = ({ active, children, onClick }) => (
  <motion.button
    onClick={onClick}
    className={`flex-1 py-2 px-4 text-sm font-medium transition-all duration-300
      ${active 
        ? 'bg-gradient-to-r from-purple-500/50 to-pink-500/50 text-white border-b-2 border-pink-500' 
        : 'hover:bg-white/10 text-purple-200 hover:text-white'}`}
    whileHover={{ scale: active ? 1 : 1.02 }}
    whileTap={{ scale: 0.98 }}
  >
    {children}
  </motion.button>
);

const Dashboard = ({ setIsLoggedIn }) => {
  const [activeTab, setActiveTab] = useState('timeline');
  const [overallProgress, setOverallProgress] = useState(0);
  const controls = useAnimation();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const handleProgressUpdate = (progress) => {
    setOverallProgress(progress);
  };

  useEffect(() => {
    controls.start({
      scale: [1, 1.05, 1],
      transition: { duration: 2, repeat: Infinity, ease: "easeInOut" }
    });
  }, [controls]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setIsLoggedIn(false);
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <div className="relative h-screen overflow-hidden"
         style={{
           background: `linear-gradient(135deg, 
             var(--bg-gradient-from) 0%, 
             var(--bg-gradient-via) 50%, 
             var(--bg-gradient-to) 100%)`
         }}>
      {/* Particles with lower z-index */}
      <div className="absolute inset-0 z-0">
        {[...Array(20)].map((_, i) => (
          <Particle key={i} delay={i * 0.2} />
        ))}
      </div>
      
      <div className="relative z-10 h-full">
        {/* Fixed Header */}
        <motion.header 
          className="fixed top-0 left-0 right-0 backdrop-blur-md z-20 px-4 py-4"
          style={{
            background: `linear-gradient(135deg, 
              var(--bg-gradient-from) 0%, 
              var(--bg-gradient-via) 50%, 
              var(--bg-gradient-to) 100%)`
          }}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <motion.div
              className="flex items-center space-x-2"
              animate={controls}
            >
              <div className="gradient-button p-2 rounded-full shadow-lg">
                <Star size={24} className="text-white" />
              </div>
              <h1 className="text-2xl font-bold text-[var(--text-primary)]">SkillFlow</h1>
            </motion.div>
            <div className="flex items-center space-x-4">
              <motion.button 
                className="p-2 hover:bg-white/10 rounded-lg transition-colors text-[var(--text-primary)]"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsProfileOpen(true)}
              >
                <User className="h-5 w-5" />
              </motion.button>
              <motion.button 
                className="p-2 hover:bg-white/10 rounded-lg transition-colors text-[var(--text-primary)]"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsSettingsOpen(true)}
              >
                <SettingsIcon className="h-5 w-5" />
              </motion.button>
              <motion.button 
                onClick={handleLogout}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors text-[var(--text-primary)]"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <LogOut className="h-5 w-5" />
              </motion.button>
            </div>
          </div>
        </motion.header>

        {/* Scrollable Content */}
        <main className="relative z-10 space-y-6 pt-24 px-4 pb-6 overflow-y-auto h-screen scrollbar-hide">
          {/* Feature Cards */}
          <motion.section 
            className="grid grid-cols-1 md:grid-cols-3 gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <FeatureCard 
              icon={GanttChart}
              title="Project Timeline"
              description="Visualize your project progress and upcoming milestones."
            />
            <FeatureCard 
              icon={Brain}
              title="Mind Map Organizer"
              description="Organize your thoughts and project structure visually."
            />
            <FeatureCard 
              icon={TrendingUp}
              title="Learning Path"
              description="Track your skill development and learning objectives."
            />
          </motion.section>

          {/* Progress Section */}
          <motion.section 
            className="bg-[var(--bg-card)] backdrop-blur-md border border-white/20 rounded-lg p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-xl font-semibold mb-4 text-[var(--text-primary)]">Your Progress</h2>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-[var(--text-secondary)]">Overall Completion</span>
                <span className="text-sm text-[var(--text-secondary)]">{overallProgress}%</span>
              </div>
              <div className="h-2 bg-purple-950 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full gradient-button"
                  initial={{ width: 0 }}
                  animate={{ width: `${overallProgress}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                />
              </div>
            </div>
          </motion.section>

          {/* Tabs Section */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="bg-white/10 backdrop-blur-md rounded-lg overflow-hidden">
              <div className="flex border-b border-white/20">
                {['timeline', 'mindmap', 'learningpath', 'profile'].map((tab) => (
                  <TabButton
                    key={tab}
                    active={activeTab === tab}
                    onClick={() => setActiveTab(tab)}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </TabButton>
                ))}
              </div>
              <motion.div 
                className="p-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                {activeTab === 'timeline' && <Timeline />}
                {activeTab === 'mindmap' && <MindMap />}
                {activeTab === 'learningpath' && (
                  <LearningPath onProgressUpdate={handleProgressUpdate} />
                )}
                {activeTab === 'profile' && <Profile />}
              </motion.div>
            </div>
          </motion.section>
        </main>
      </div>

      <Settings 
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
      
      <Modal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        title="Profile"
      >
        <Profile onClose={() => setIsProfileOpen(false)} />
      </Modal>
    </div>
  );
};

export default Dashboard;