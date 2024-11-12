import { useState, useEffect } from 'react';
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, 
         FacebookAuthProvider, TwitterAuthProvider } from 'firebase/auth';
import { auth } from '../../config/firebase';
import { motion, useAnimation } from 'framer-motion';
import { Star, ArrowRight, Users, BarChart2, TrendingUp } from 'lucide-react';
import { FaGoogle, FaFacebookF, FaTwitter, FaLinkedinIn } from 'react-icons/fa';
import './Login.css';

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

const FeatureItem = ({ icon: Icon, text }) => (
  <motion.div
    className="flex items-center space-x-2 bg-white/10 rounded-lg p-2"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    whileHover={{ scale: 1.05, backgroundColor: "rgba(255, 255, 255, 0.15)" }}
  >
    <Icon size={16} className="text-pink-400 flex-shrink-0" />
    <span className="text-xs text-purple-200 font-medium">{text}</span>
  </motion.div>
);

const SocialLoginButton = ({ provider, icon: Icon, onClick }) => (
  <button
    onClick={onClick}
    className="w-full bg-white/10 text-white hover:bg-white/20 hover:text-pink-400 transition-colors text-xs py-1 px-3 rounded-md flex items-center justify-center space-x-1"
  >
    <Icon className="h-3 w-3" />
    <span>{provider}</span>
  </button>
);

const Login = ({ setIsLoggedIn }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const controls = useAnimation();

  useEffect(() => {
    controls.start({
      scale: [1, 1.05, 1],
      transition: { duration: 2, repeat: Infinity, ease: "easeInOut" }
    });
  }, [controls]);

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setIsLoggedIn(rememberMe);
    } catch (err) {
      setError('Invalid email or password');
    }
  };

  const handleSocialLogin = async (provider) => {
    try {
      const authProvider = {
        google: new GoogleAuthProvider(),
        facebook: new FacebookAuthProvider(),
        twitter: new TwitterAuthProvider(),
      }[provider];

      await signInWithPopup(auth, authProvider);
      setIsLoggedIn(rememberMe);
    } catch (err) {
      setError(`Failed to sign in with ${provider}`);
    }
  };

  return (
    <div className="h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex flex-col items-center justify-between p-4 overflow-hidden">
      {[...Array(20)].map((_, i) => (
        <Particle key={i} delay={i * 0.2} />
      ))}
      
      <div className="w-full max-w-md flex flex-col items-center justify-center flex-grow">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full"
        >
          <div className="bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl rounded-lg p-6">
            <div className="space-y-1 pb-4">
              <motion.div
                className="flex items-center justify-center mb-4"
                animate={controls}
              >
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-2 rounded-full shadow-lg">
                  <Star size={24} className="text-white" />
                </div>
              </motion.div>
              <h2 className="text-2xl font-bold text-center text-white">SkillFlow</h2>
              <p className="text-center text-purple-200 text-xs">Nurture your growth, track your journey</p>
            </div>

            <form onSubmit={handleEmailLogin} className="space-y-3">
              <div className="space-y-1">
                <label className="text-purple-100 text-xs">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white/20 border border-purple-300 rounded-md h-8 text-sm text-white placeholder-purple-300 focus:border-pink-400 focus:ring-pink-400 px-3"
                  placeholder="m@example.com"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-purple-100 text-xs">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white/20 border border-purple-300 rounded-md h-8 text-sm text-white placeholder-purple-300 focus:border-pink-400 focus:ring-pink-400 px-3"
                  required
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="rememberMe"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-purple-300 text-pink-500 focus:ring-pink-400 bg-white/20"
                />
                <label htmlFor="rememberMe" className="text-purple-100 text-xs">
                  Remember me
                </label>
              </div>

              {error && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-pink-400 text-xs text-center bg-pink-400/10 p-2 rounded-md"
                >
                  {error}
                </motion.div>
              )}

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold h-8 text-sm rounded-md transition-all duration-300 transform hover:scale-105 flex items-center justify-center"
              >
                Start Your Journey
                <ArrowRight className="ml-2 h-3 w-3" />
              </button>
            </form>

            <div className="mt-4 mb-4">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-white/20" />
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="bg-transparent px-2 text-purple-200 text-[10px] uppercase">Or continue with</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 mt-4">
                <SocialLoginButton 
                  provider="Google" 
                  icon={FaGoogle} 
                  onClick={() => handleSocialLogin('google')} 
                />
                <SocialLoginButton 
                  provider="Facebook" 
                  icon={FaFacebookF} 
                  onClick={() => handleSocialLogin('facebook')} 
                />
                <SocialLoginButton 
                  provider="Twitter" 
                  icon={FaTwitter} 
                  onClick={() => handleSocialLogin('twitter')} 
                />
                <SocialLoginButton 
                  provider="LinkedIn" 
                  icon={FaLinkedinIn} 
                  onClick={() => handleSocialLogin('linkedin')} 
                />
              </div>
            </div>

            <div className="flex justify-between text-xs text-purple-200">
              <a href="#" className="hover:text-pink-400 transition-colors duration-300">Forgot password?</a>
              <a href="#" className="hover:text-pink-400 transition-colors duration-300">Create account</a>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="w-full max-w-md grid grid-cols-3 gap-2 mt-2">
        <FeatureItem icon={Users} text="Collaborate" />
        <FeatureItem icon={BarChart2} text="Track Skills" />
        <FeatureItem icon={TrendingUp} text="Grow" />
      </div>
    </div>
  );
};

export default Login;