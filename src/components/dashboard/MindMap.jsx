import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2, Edit2 } from 'lucide-react';
import Modal from '../common/Modal';

const MindMapNode = ({ node, onAddChild, onDelete, onEdit }) => (
  <motion.div
    className="relative group"
    whileHover={{ scale: 1.05 }}
  >
    <div className="bg-white/10 backdrop-blur-md p-4 rounded-lg border border-white/20">
      <h3 className="text-white font-medium">{node.title}</h3>
      <p className="text-purple-200 text-sm">{node.description}</p>
      
      <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity flex space-x-1">
        <button
          onClick={() => onEdit(node)}
          className="p-1 hover:bg-white/10 rounded-full"
        >
          <Edit2 className="h-4 w-4 text-blue-400" />
        </button>
        <button
          onClick={() => onAddChild(node.id)}
          className="p-1 hover:bg-white/10 rounded-full"
        >
          <Plus className="h-4 w-4 text-green-400" />
        </button>
        <button
          onClick={() => onDelete(node.id)}
          className="p-1 hover:bg-white/10 rounded-full"
        >
          <Trash2 className="h-4 w-4 text-pink-400" />
        </button>
      </div>

      {/* Connection Lines */}
      {node.children.map(childId => (
        <div
          key={childId}
          className="absolute top-1/2 right-0 w-8 h-px bg-gradient-to-r from-purple-500 to-pink-500"
        />
      ))}
    </div>
  </motion.div>
);

const MindMap = () => {
  const [nodes, setNodes] = useState([
    {
      id: 1,
      title: 'Web Development',
      description: 'Core concepts and technologies',
      children: [2, 3]
    },
    {
      id: 2,
      title: 'Frontend',
      description: 'UI/UX and client-side',
      children: []
    },
    {
      id: 3,
      title: 'Backend',
      description: 'Server and databases',
      children: []
    }
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNode, setEditingNode] = useState(null);
  const [parentId, setParentId] = useState(null);
  const [newNode, setNewNode] = useState({
    title: '',
    description: ''
  });

  const handleAddNode = () => {
    setEditingNode(null);
    setParentId(null);
    setNewNode({ title: '', description: '' });
    setIsModalOpen(true);
  };

  const handleAddChild = (parentId) => {
    setEditingNode(null);
    setParentId(parentId);
    setNewNode({ title: '', description: '' });
    setIsModalOpen(true);
  };

  const handleEditNode = (node) => {
    setEditingNode(node);
    setNewNode({ title: node.title, description: node.description });
    setIsModalOpen(true);
  };

  const handleDeleteNode = (nodeId) => {
    setNodes(nodes.map(node => ({
      ...node,
      children: node.children.filter(id => id !== nodeId)
    })).filter(node => node.id !== nodeId));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (editingNode) {
      // Edit existing node
      setNodes(nodes.map(node => 
        node.id === editingNode.id 
          ? { ...node, ...newNode }
          : node
      ));
    } else {
      // Add new node
      const newNodeId = Math.max(...nodes.map(n => n.id)) + 1;
      const newNodeData = {
        id: newNodeId,
        ...newNode,
        children: []
      };
      
      setNodes(prevNodes => {
        const updatedNodes = [...prevNodes, newNodeData];
        if (parentId) {
          return updatedNodes.map(node =>
            node.id === parentId
              ? { ...node, children: [...node.children, newNodeId] }
              : node
          );
        }
        return updatedNodes;
      });
    }

    setIsModalOpen(false);
    setNewNode({ title: '', description: '' });
    setEditingNode(null);
    setParentId(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-white">Mind Map</h2>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="gradient-button px-4 py-2 rounded-lg text-white text-sm flex items-center space-x-2"
          onClick={handleAddNode}
        >
          <Plus className="h-4 w-4" />
          <span>Add Node</span>
        </motion.button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {nodes.map(node => (
          <MindMapNode
            key={node.id}
            node={node}
            onAddChild={handleAddChild}
            onDelete={handleDeleteNode}
            onEdit={handleEditNode}
          />
        ))}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setNewNode({ title: '', description: '' });
          setEditingNode(null);
        }}
        title={editingNode ? "Edit Node" : "Add Node"}
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm text-purple-200 font-medium">Title</label>
            <input
              type="text"
              value={newNode.title}
              onChange={(e) => setNewNode({ ...newNode, title: e.target.value })}
              className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm
                       placeholder-purple-300 focus:border-pink-400 focus:ring-pink-400 transition-colors"
              placeholder="Enter node title"
              required
              autoFocus
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm text-purple-200 font-medium">Description</label>
            <textarea
              value={newNode.description}
              onChange={(e) => setNewNode({ ...newNode, description: e.target.value })}
              className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm
                       placeholder-purple-300 focus:border-pink-400 focus:ring-pink-400 transition-colors resize-none"
              placeholder="Enter node description"
              rows="3"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-white/10">
            <motion.button
              type="button"
              onClick={() => {
                setIsModalOpen(false);
                setNewNode({ title: '', description: '' });
                setEditingNode(null);
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
              {editingNode ? "Update" : "Add"}
            </motion.button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default MindMap; 