import React from 'react';
import { motion } from 'framer-motion';
import { Moon, Sun, Bell, Shield, Palette, Monitor } from 'lucide-react';
import Modal from './Modal';
import { useSettings } from '../../context/SettingsContext';

const SettingsOption = ({ icon: Icon, title, description, children }) => (
  <div className="p-4 bg-white/5 rounded-lg space-y-2">
    <div className="flex items-center space-x-3">
      <Icon className="text-purple-400 h-5 w-5" />
      <div>
        <h3 className="text-white font-medium">{title}</h3>
        <p className="text-purple-200 text-sm">{description}</p>
      </div>
    </div>
    <div className="pl-8">
      {children}
    </div>
  </div>
);

const Settings = ({ isOpen, onClose }) => {
  const { settings, updateSettings } = useSettings();

  const colorSchemes = {
    purple: {
      from: '#8B5CF6',
      to: '#EC4899',
      name: 'Purple Pink'
    },
    blue: {
      from: '#3B82F6',
      to: '#8B5CF6',
      name: 'Blue Purple'
    },
    green: {
      from: '#10B981',
      to: '#3B82F6',
      name: 'Green Blue'
    },
    pink: {
      from: '#EC4899',
      to: '#F472B6',
      name: 'Pink Rose'
    }
  };

  const handleSave = () => {
    onClose();
  };

  const handleColorSchemeChange = (scheme) => {
    updateSettings({ colorScheme: scheme });
    // Force update gradients
    document.documentElement.style.setProperty('--button-gradient', 
      `linear-gradient(to right, var(--gradient-from), var(--gradient-to))`
    );
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Settings">
      <div className="space-y-4">
        {/* Theme Settings */}
        <SettingsOption
          icon={settings.theme === 'dark' ? Moon : Sun}
          title="Theme"
          description="Choose your preferred theme"
        >
          <div className="flex space-x-3">
            <button
              onClick={() => updateSettings({ theme: 'dark' })}
              className={`px-3 py-1 rounded-md text-sm ${
                settings.theme === 'dark' 
                  ? 'bg-purple-500 text-white' 
                  : 'bg-white/10 text-purple-200'
              }`}
            >
              Dark
            </button>
            <button
              onClick={() => updateSettings({ theme: 'light' })}
              className={`px-3 py-1 rounded-md text-sm ${
                settings.theme === 'light' 
                  ? 'bg-purple-500 text-white' 
                  : 'bg-white/10 text-purple-200'
              }`}
            >
              Light
            </button>
          </div>
        </SettingsOption>

        {/* Notifications */}
        <SettingsOption
          icon={Bell}
          title="Notifications"
          description="Manage your notification preferences"
        >
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={settings.notifications}
              onChange={(e) => updateSettings({ notifications: e.target.checked })}
              className="w-4 h-4 rounded border-purple-300 text-pink-500 focus:ring-pink-400 bg-white/20"
            />
            <span className="text-sm text-purple-200">Enable notifications</span>
          </label>
        </SettingsOption>

        {/* Privacy */}
        <SettingsOption
          icon={Shield}
          title="Privacy"
          description="Control who can see your progress"
        >
          <select
            value={settings.privacy}
            onChange={(e) => updateSettings({ privacy: e.target.value })}
            className="bg-white/10 border border-white/20 rounded-md px-3 py-1 text-sm text-white"
          >
            <option value="public" className="bg-indigo-900">Public</option>
            <option value="friends" className="bg-indigo-900">Friends Only</option>
            <option value="private" className="bg-indigo-900">Private</option>
          </select>
        </SettingsOption>

        {/* Color Scheme */}
        <SettingsOption
          icon={Palette}
          title="Color Scheme"
          description="Customize your interface colors"
        >
          <div className="flex space-x-2">
            {Object.entries(colorSchemes).map(([color, { from, to, name }]) => (
              <button
                key={color}
                onClick={() => handleColorSchemeChange(color)}
                className={`group relative w-8 h-8 rounded-full ${
                  settings.colorScheme === color ? 'ring-2 ring-white ring-offset-2 ring-offset-indigo-900' : ''
                }`}
                style={{
                  background: `linear-gradient(135deg, ${from}, ${to})`
                }}
              >
                <span className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs text-purple-200 opacity-0 group-hover:opacity-100 whitespace-nowrap transition-opacity">
                  {name}
                </span>
              </button>
            ))}
          </div>
        </SettingsOption>

        {/* Display */}
        <SettingsOption
          icon={Monitor}
          title="Display"
          description="Adjust your view preferences"
        >
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={settings.compactMode}
              onChange={(e) => updateSettings({ compactMode: e.target.checked })}
              className="w-4 h-4 rounded border-purple-300 text-pink-500 focus:ring-pink-400 bg-white/20"
            />
            <span className="text-sm text-purple-200">Compact mode</span>
          </label>
        </SettingsOption>

        {/* Save Button */}
        <div className="pt-4 border-t border-white/10">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSave}
            className="w-full py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-md"
          >
            Save Changes
          </motion.button>
        </div>
      </div>
    </Modal>
  );
};

export default Settings; 