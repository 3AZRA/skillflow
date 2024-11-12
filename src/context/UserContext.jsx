import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, db } from '../config/firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        // Get user data from Firestore
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          setUserData(userDoc.data());
        } else {
          // Create new user document if it doesn't exist
          const newUserData = {
            uid: user.uid,
            email: user.email,
            name: user.displayName || 'User',
            avatar: user.photoURL || 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
            tasks: [],
            skills: [],
            mindMap: [],
            settings: {
              theme: 'dark',
              notifications: true,
              privacy: 'friends',
              colorScheme: 'purple',
              compactMode: false
            }
          };
          await setDoc(doc(db, 'users', user.uid), newUserData);
          setUserData(newUserData);
        }
      } else {
        setUserData(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const updateUserData = async (newData) => {
    if (!auth.currentUser) return;

    try {
      await setDoc(doc(db, 'users', auth.currentUser.uid), newData, { merge: true });
      setUserData(prev => ({ ...prev, ...newData }));
    } catch (error) {
      console.error('Error updating user data:', error);
    }
  };

  return (
    <UserContext.Provider value={{ userData, updateUserData, loading }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}; 