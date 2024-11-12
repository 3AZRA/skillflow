import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Star, Trophy, BookOpen, Edit2, Trash2 } from 'lucide-react';
import Modal from '../common/Modal';

const SkillCard = ({ skill, onEdit, onDelete }) => {
  // Calculate actual progress based on achievements and resources
  const totalPossibleAchievements = 10; // Maximum achievements possible
  const totalPossibleResources = 15;    // Maximum resources possible
  
  const achievementProgress = (skill.achievements / totalPossibleAchievements) * 100;
  const resourceProgress = (skill.resources / totalPossibleResources) * 100;
  
  // Calculate overall progress as average of achievements, resources, and skill level
  const levelProgress = (skill.level / 5) * 100; // 5 is max level
  const actualProgress = Math.round((achievementProgress + resourceProgress + levelProgress) / 3);

  return (
    <motion.div
      className="bg-white/10 backdrop-blur-md p-4 rounded-lg border border-white/20 relative group"
      whileHover={{ scale: 1.02 }}
    >
      <div className="flex justify-between items-start mb-2">
        <div>
          <h3 className="text-white font-medium">{skill.name}</h3>
          <p className="text-purple-200 text-sm">{skill.description}</p>
        </div>
        <div className="flex items-center space-x-2">
          <motion.button
            onClick={() => onEdit(skill)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="p-1.5 hover:bg-white/10 rounded-lg text-blue-400 hover:text-blue-300 transition-colors"
          >
            <Edit2 className="h-4 w-4" />
          </motion.button>
          <motion.button
            onClick={() => onDelete(skill.id)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="p-1.5 hover:bg-white/10 rounded-lg text-pink-400 hover:text-pink-300 transition-colors"
          >
            <Trash2 className="h-4 w-4" />
          </motion.button>
        </div>
      </div>

      <div className="flex items-center space-x-1 mb-4">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`h-4 w-4 ${
              i < skill.level ? 'text-yellow-400' : 'text-gray-600'
            }`}
          />
        ))}
      </div>
      
      <div className="mt-4">
        <div className="flex justify-between text-sm text-purple-200 mb-2">
          <span>Progress</span>
          <span>{actualProgress}%</span>
        </div>
        <div className="h-2 bg-purple-950 rounded-full overflow-hidden">
          <motion.div
            className="h-full gradient-button"
            initial={{ width: 0 }}
            animate={{ width: `${actualProgress}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Trophy className="h-4 w-4 text-yellow-400" />
          <span className="text-xs text-purple-200">
            {skill.achievements}/{totalPossibleAchievements} achievements
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <BookOpen className="h-4 w-4 text-purple-400" />
          <span className="text-xs text-purple-200">
            {skill.resources}/{totalPossibleResources} resources
          </span>
        </div>
      </div>
    </motion.div>
  );
};

const LearningPath = ({ onProgressUpdate }) => {
  const [skills, setSkills] = useState([
    {
      id: 1,
      name: 'React Development',
      description: 'Modern React with Hooks and Context',
      level: 3,
      progress: 65,
      achievements: 4,
      resources: 8
    },
    {
      id: 2,
      name: 'UI/UX Design',
      description: 'User Interface and Experience Design',
      level: 2,
      progress: 40,
      achievements: 2,
      resources: 5
    }
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState(null);
  const [newSkill, setNewSkill] = useState({
    name: '',
    description: '',
    level: 1,
    progress: 0,
    achievements: 0,
    resources: 0
  });

  const handleAddSkill = () => {
    setEditingSkill(null);
    setNewSkill({
      name: '',
      description: '',
      level: 1,
      progress: 0,
      achievements: 0,
      resources: 0
    });
    setIsModalOpen(true);
  };

  const handleEditSkill = (skill) => {
    setEditingSkill(skill);
    setNewSkill(skill);
    setIsModalOpen(true);
  };

  const handleDeleteSkill = (skillId) => {
    setSkills(skills.filter(skill => skill.id !== skillId));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (editingSkill) {
      // Edit existing skill
      setSkills(skills.map(skill => 
        skill.id === editingSkill.id 
          ? { ...skill, ...newSkill }
          : skill
      ));
    } else {
      // Add new skill
      const newSkillId = Math.max(...skills.map(s => s.id), 0) + 1;
      setSkills([...skills, { ...newSkill, id: newSkillId }]);
    }

    setIsModalOpen(false);
    setEditingSkill(null);
  };

  // Calculate overall progress for all skills
  const calculateOverallProgress = (skills) => {
    if (skills.length === 0) return 0;
    
    const totalProgress = skills.reduce((sum, skill) => {
      const achievementProgress = (skill.achievements / 10) * 100;
      const resourceProgress = (skill.resources / 15) * 100;
      const levelProgress = (skill.level / 5) * 100;
      return sum + (achievementProgress + resourceProgress + levelProgress) / 3;
    }, 0);

    return Math.round(totalProgress / skills.length);
  };

  // Update progress whenever skills change
  useEffect(() => {
    const overallProgress = calculateOverallProgress(skills);
    onProgressUpdate(overallProgress); // Call the prop function with the new progress
  }, [skills, onProgressUpdate]);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-white">Learning Path</h2>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="gradient-button px-4 py-2 rounded-lg text-white text-sm flex items-center space-x-2"
          onClick={handleAddSkill}
        >
          <Plus className="h-4 w-4" />
          <span>Add Skill</span>
        </motion.button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {skills.map(skill => (
          <SkillCard 
            key={skill.id} 
            skill={skill}
            onEdit={handleEditSkill}
            onDelete={handleDeleteSkill}
          />
        ))}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingSkill(null);
        }}
        title={editingSkill ? "Edit Skill" : "Add New Skill"}
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm text-purple-200 font-medium">Skill Name</label>
            <input
              type="text"
              value={newSkill.name}
              onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
              className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm
                       placeholder-purple-300 focus:border-pink-400 focus:ring-pink-400 transition-colors"
              placeholder="Enter skill name"
              required
              autoFocus
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm text-purple-200 font-medium">Description</label>
            <textarea
              value={newSkill.description}
              onChange={(e) => setNewSkill({ ...newSkill, description: e.target.value })}
              className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm
                       placeholder-purple-300 focus:border-pink-400 focus:ring-pink-400 transition-colors resize-none"
              placeholder="Enter skill description"
              rows="3"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm text-purple-200 font-medium">Skill Level (1-5)</label>
              <input
                type="number"
                min="1"
                max="5"
                value={newSkill.level}
                onChange={(e) => setNewSkill({ ...newSkill, level: parseInt(e.target.value) })}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm
                         focus:border-pink-400 focus:ring-pink-400 transition-colors"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm text-purple-200 font-medium">Progress (%)</label>
              <input
                type="number"
                min="0"
                max="100"
                value={newSkill.progress}
                onChange={(e) => setNewSkill({ ...newSkill, progress: parseInt(e.target.value) })}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm
                         focus:border-pink-400 focus:ring-pink-400 transition-colors"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-white/10">
            <motion.button
              type="button"
              onClick={() => {
                setIsModalOpen(false);
                setEditingSkill(null);
              }}
              className="px-4 py-2 text-sm text-purple-200 hover:text-white transition-colors
                       rounded-lg hover:bg-white/5"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Cancel
            </motion.button>
            <motion.button
              type="submit"
              className="gradient-button px-4 py-2 rounded-lg text-white text-sm"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {editingSkill ? "Update Skill" : "Add Skill"}
            </motion.button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default LearningPath; 