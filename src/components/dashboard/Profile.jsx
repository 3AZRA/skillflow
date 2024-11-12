import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Phone, MapPin, Globe, Camera, Edit2, Save, Upload } from 'lucide-react';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../../config/firebase';
import Modal from '../common/Modal';

const ProfileField = ({ icon: Icon, label, value, editable, onChange, isEditing }) => (
  <div className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg">
    <Icon className="text-purple-400 h-5 w-5 flex-shrink-0" />
    <div className="flex-grow">
      <p className="text-xs text-purple-200">{label}</p>
      {isEditing && editable ? (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-white/10 border border-white/20 rounded-md px-2 py-1 text-sm text-white mt-1"
        />
      ) : (
        <p className="text-sm text-white">{value}</p>
      )}
    </div>
  </div>
);

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
  const [profileData, setProfileData] = useState({
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+1 234 567 890',
    location: 'New York, USA',
    website: 'johndoe.dev',
    bio: 'Full-stack developer passionate about creating amazing user experiences.',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
    skills: ['React', 'Node.js', 'Python', 'UI/UX'],
    socialLinks: {
      github: 'github.com/johndoe',
      linkedin: 'linkedin.com/in/johndoe',
      twitter: 'twitter.com/johndoe'
    }
  });

  const [newSkill, setNewSkill] = useState('');
  const [isSkillModalOpen, setIsSkillModalOpen] = useState(false);

  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleSave = () => {
    // Here you would typically save to a backend
    setIsEditing(false);
  };

  const handleAddSkill = () => {
    if (newSkill.trim()) {
      setProfileData(prev => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()]
      }));
      setNewSkill('');
      setIsSkillModalOpen(false);
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setProfileData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
  };

  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB');
      return;
    }

    try {
      setIsUploading(true);
      setUploadProgress(0);

      // Create a reference to the file location
      const storageRef = ref(storage, `avatars/${Date.now()}_${file.name}`);

      // Create a file reader to show preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileData(prev => ({
          ...prev,
          avatar: e.target.result // temporary preview
        }));
      };
      reader.readAsDataURL(file);

      // Upload file
      const uploadTask = uploadBytes(storageRef, file);
      
      // Handle successful upload
      const snapshot = await uploadTask;
      const downloadURL = await getDownloadURL(snapshot.ref);

      // Update profile with new avatar URL
      setProfileData(prev => ({
        ...prev,
        avatar: downloadURL
      }));

      setIsUploading(false);
      setIsAvatarModalOpen(false);
    } catch (error) {
      console.error('Error uploading file:', error);
      setIsUploading(false);
      alert('Failed to upload image. Please try again.');
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleFileSelect({ target: { files: [files[0]] } });
    }
  };

  // Update the Avatar Modal content
  const renderAvatarModal = () => (
    <Modal
      isOpen={isAvatarModalOpen}
      onClose={() => setIsAvatarModalOpen(false)}
      title="Change Profile Picture"
    >
      <div className="space-y-4">
        <div
          className="border-2 border-dashed border-white/20 rounded-lg p-8 text-center cursor-pointer"
          onClick={() => fileInputRef.current?.click()}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          {isUploading ? (
            <div className="space-y-3">
              <Upload className="h-12 w-12 text-purple-400 mx-auto animate-bounce" />
              <p className="text-sm text-purple-200">Uploading...</p>
              <div className="w-full bg-white/10 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          ) : (
            <>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                accept="image/*"
                className="hidden"
              />
              <Camera className="h-12 w-12 text-purple-400 mx-auto mb-4" />
              <p className="text-sm text-purple-200">
                Drag and drop an image here, or click to select
              </p>
              <p className="text-xs text-purple-300 mt-2">
                Maximum file size: 5MB
              </p>
            </>
          )}
        </div>

        {/* Preview section */}
        {profileData.avatar && !isUploading && (
          <div className="text-center">
            <p className="text-sm text-purple-200 mb-2">Preview</p>
            <img
              src={profileData.avatar}
              alt="Preview"
              className="w-24 h-24 rounded-full mx-auto object-cover"
            />
          </div>
        )}
      </div>
    </Modal>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-white">Profile</h2>
        {isEditing ? (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSave}
            className="gradient-button px-4 py-2 rounded-lg text-white text-sm flex items-center space-x-2"
          >
            <Save className="h-4 w-4" />
            <span>Save Changes</span>
          </motion.button>
        ) : (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsEditing(true)}
            className="gradient-button px-4 py-2 rounded-lg text-white text-sm flex items-center space-x-2"
          >
            <Edit2 className="h-4 w-4" />
            <span>Edit Profile</span>
          </motion.button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Avatar Section */}
        <div className="col-span-1">
          <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 text-center">
            <div className="relative inline-block">
              <img
                src={profileData.avatar}
                alt="Profile"
                className="w-32 h-32 rounded-full mx-auto mb-4"
              />
              <button
                onClick={() => setIsAvatarModalOpen(true)}
                className="absolute bottom-0 right-0 p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full text-white hover:from-purple-600 hover:to-pink-600 transition-colors"
              >
                <Camera className="h-4 w-4" />
              </button>
            </div>
            <h3 className="text-lg font-semibold text-white">{profileData.name}</h3>
            <p className="text-sm text-purple-200">{profileData.bio}</p>
          </div>
        </div>

        {/* Main Info Section */}
        <div className="col-span-2 space-y-4">
          <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 space-y-4">
            <ProfileField
              icon={User}
              label="Full Name"
              value={profileData.name}
              editable={true}
              onChange={(value) => setProfileData(prev => ({ ...prev, name: value }))}
              isEditing={isEditing}
            />
            <ProfileField
              icon={Mail}
              label="Email"
              value={profileData.email}
              editable={true}
              onChange={(value) => setProfileData(prev => ({ ...prev, email: value }))}
              isEditing={isEditing}
            />
            <ProfileField
              icon={Phone}
              label="Phone"
              value={profileData.phone}
              editable={true}
              onChange={(value) => setProfileData(prev => ({ ...prev, phone: value }))}
              isEditing={isEditing}
            />
            <ProfileField
              icon={MapPin}
              label="Location"
              value={profileData.location}
              editable={true}
              onChange={(value) => setProfileData(prev => ({ ...prev, location: value }))}
              isEditing={isEditing}
            />
            <ProfileField
              icon={Globe}
              label="Website"
              value={profileData.website}
              editable={true}
              onChange={(value) => setProfileData(prev => ({ ...prev, website: value }))}
              isEditing={isEditing}
            />
          </div>

          {/* Skills Section */}
          <div className="bg-white/10 backdrop-blur-md rounded-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-white">Skills</h3>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsSkillModalOpen(true)}
                className="gradient-button px-3 py-1 rounded-lg text-white text-xs"
              >
                Add Skill
              </motion.button>
            </div>
            <div className="flex flex-wrap gap-2">
              {profileData.skills.map((skill, index) => (
                <div
                  key={index}
                  className="bg-white/10 px-3 py-1 rounded-full text-sm text-purple-200 flex items-center space-x-2"
                >
                  <span>{skill}</span>
                  {isEditing && (
                    <button
                      onClick={() => handleRemoveSkill(skill)}
                      className="text-pink-400 hover:text-pink-300"
                    >
                      ×
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Add Skill Modal */}
      <Modal
        isOpen={isSkillModalOpen}
        onClose={() => setIsSkillModalOpen(false)}
        title="Add New Skill"
      >
        <div className="space-y-4">
          <input
            type="text"
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            placeholder="Enter skill name"
            className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm"
          />
          <div className="flex justify-end space-x-3">
            <button
              onClick={() => setIsSkillModalOpen(false)}
              className="px-4 py-2 text-sm text-purple-200 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleAddSkill}
              className="gradient-button px-4 py-2 rounded-lg text-white text-sm"
            >
              Add Skill
            </button>
          </div>
        </div>
      </Modal>

      {/* Avatar Modal */}
      {renderAvatarModal()}
    </div>
  );
};

export default Profile; 