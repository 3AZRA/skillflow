import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Circle, CheckCircle2, Filter, Calendar, Clock } from 'lucide-react';
import Modal from '../common/Modal';

const TimelineItem = ({ task, onComplete, onDelete }) => (
  <motion.div 
    className="flex items-start space-x-4 p-4 bg-white/5 rounded-lg backdrop-blur-sm"
    whileHover={{ scale: 1.02 }}
  >
    <button 
      onClick={() => onComplete(task.id)}
      className="mt-1 flex-shrink-0"
    >
      {task.completed ? (
        <CheckCircle2 className="text-green-400 h-5 w-5" />
      ) : (
        <Circle className="text-purple-300 h-5 w-5" />
      )}
    </button>
    <div className="flex-grow">
      <h4 className="text-white font-medium">{task.title}</h4>
      <p className="text-purple-200 text-sm">{task.description}</p>
      <div className="flex justify-between items-center mt-2">
        <span className="text-xs text-purple-300">Due: {task.dueDate}</span>
        <span className={`text-xs px-2 py-1 rounded-full ${
          task.priority === 'high' ? 'bg-pink-500/20 text-pink-300' :
          task.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-300' :
          'bg-blue-500/20 text-blue-300'
        }`}>
          {task.priority}
        </span>
      </div>
    </div>
    <button
      onClick={() => onDelete(task.id)}
      className="text-purple-200 hover:text-white transition-colors"
    >
      <Clock size={20} />
    </button>
  </motion.div>
);

const Timeline = () => {
  const [tasks, setTasks] = useState([
    {
      id: 1,
      title: 'Learn React Basics',
      description: 'Complete fundamental React concepts and hooks',
      dueDate: '2024-03-20',
      priority: 'high',
      completed: false
    },
    {
      id: 2,
      title: 'Build Portfolio Project',
      description: 'Create a showcase project using learned skills',
      dueDate: '2024-04-15',
      priority: 'medium',
      completed: false
    },
    // Add more sample tasks as needed
  ]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filter, setFilter] = useState('all'); // all, active, completed
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    dueDate: '',
    priority: 'medium'
  });

  const handleAddTask = (e) => {
    e.preventDefault();
    const task = {
      id: Date.now(),
      ...newTask,
      completed: false
    };
    setTasks([...tasks, task]);
    setNewTask({ title: '', description: '', dueDate: '', priority: 'medium' });
    setIsModalOpen(false);
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === 'active') return !task.completed;
    if (filter === 'completed') return task.completed;
    return true;
  });

  const handleDeleteTask = (taskId) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  const handleCompleteTask = (taskId) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-4">
          <h2 className="text-xl font-bold text-white">Project Timeline</h2>
          <div className="relative">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="appearance-none bg-white/10 backdrop-blur-md border border-white/20 rounded-lg 
                       px-4 py-2 text-sm text-white cursor-pointer
                       focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500
                       hover:bg-white/20 transition-colors"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='white'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 8px center',
                backgroundSize: '16px',
                paddingRight: '32px'
              }}
            >
              <option value="all" className="bg-indigo-900 text-white">All Tasks</option>
              <option value="active" className="bg-indigo-900 text-white">Active</option>
              <option value="completed" className="bg-indigo-900 text-white">Completed</option>
            </select>
          </div>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="gradient-button px-4 py-2 rounded-lg text-white text-sm flex items-center space-x-2"
          onClick={() => setIsModalOpen(true)}
        >
          <Plus className="h-4 w-4" />
          <span>Add Task</span>
        </motion.button>
      </div>

      <div className="space-y-4">
        {filteredTasks.map(task => (
          <TimelineItem 
            key={task.id} 
            task={task} 
            onComplete={handleCompleteTask}
            onDelete={handleDeleteTask}
          />
        ))}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setNewTask({ title: '', description: '', dueDate: '', priority: 'medium' });
        }}
        title="Add New Task"
      >
        <form onSubmit={handleAddTask} className="space-y-6">
          {/* Title Input */}
          <div className="space-y-2">
            <label className="text-sm text-purple-200 font-medium">Title</label>
            <input
              type="text"
              value={newTask.title}
              onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
              className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm
                       placeholder-purple-300 focus:border-pink-400 focus:ring-pink-400 transition-colors"
              placeholder="Enter task title"
              required
              autoFocus
            />
          </div>

          {/* Description Input */}
          <div className="space-y-2">
            <label className="text-sm text-purple-200 font-medium">Description</label>
            <textarea
              value={newTask.description}
              onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
              className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm
                       placeholder-purple-300 focus:border-pink-400 focus:ring-pink-400 transition-colors resize-none"
              placeholder="Enter task description"
              rows="3"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Due Date Input */}
            <div className="space-y-2">
              <label className="text-sm text-purple-200 font-medium">Due Date</label>
              <input
                type="date"
                value={newTask.dueDate}
                onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm
                         focus:border-pink-400 focus:ring-pink-400 transition-colors"
                required
                min={new Date().toISOString().split('T')[0]}
              />
            </div>

            {/* Priority Select */}
            <div className="space-y-2">
              <label className="text-sm text-purple-200 font-medium">Priority</label>
              <select
                value={newTask.priority}
                onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm
                         focus:border-pink-400 focus:ring-pink-400 transition-colors appearance-none cursor-pointer"
              >
                <option value="low" className="bg-indigo-900">Low</option>
                <option value="medium" className="bg-indigo-900">Medium</option>
                <option value="high" className="bg-indigo-900">High</option>
              </select>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-white/10">
            <motion.button
              type="button"
              onClick={() => {
                setIsModalOpen(false);
                setNewTask({ title: '', description: '', dueDate: '', priority: 'medium' });
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
              Add Task
            </motion.button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Timeline; 