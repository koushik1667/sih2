import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  auth, 
  googleProvider, 
  signInWithPopup, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  updateProfile,
  onAuthStateChanged,
  sendPasswordResetEmail,
  db,
  doc,
  setDoc,
  getDoc,
  serverTimestamp
} from '../lib/firebase';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  // Sync user profile to Firestore
  const syncUserProfile = async (firebaseUser, additionalData = {}) => {
    if (!firebaseUser) return null;
    try {
      const userRef = doc(db, 'users', firebaseUser.uid);
      const userSnap = await getDoc(userRef);
      
      const baseData = {
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        displayName: additionalData.displayName || firebaseUser.displayName || (firebaseUser.email ? firebaseUser.email.split('@')[0] : 'Farmer'),
        photoURL: firebaseUser.photoURL || null,
        updatedAt: serverTimestamp(),
        ...additionalData
      };

      if (!userSnap.exists()) {
        // Initial setup
        const initialDoc = {
          ...baseData,
          createdAt: serverTimestamp(),
          role: 'farmer',
          phone: additionalData.phone || '',
          state: additionalData.state || 'Punjab',
          preferredCrop: additionalData.preferredCrop || 'Wheat',
          preferredLanguage: additionalData.preferredLanguage || 'hi'
        };
        await setDoc(userRef, initialDoc, { merge: true });
        setUserProfile(initialDoc);
        return initialDoc;
      } else {
        await setDoc(userRef, baseData, { merge: true });
        const merged = { ...userSnap.data(), ...baseData };
        setUserProfile(merged);
        return merged;
      }
    } catch (err) {
      console.error("Error syncing user profile to Firestore:", err);
      // Fallback local representation
      const fallback = {
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        displayName: firebaseUser.displayName || 'Farmer',
        photoURL: firebaseUser.photoURL || null
      };
      setUserProfile(fallback);
      return fallback;
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        await syncUserProfile(currentUser);
      } else {
        setUserProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Google Login
  const loginWithGoogle = async () => {
    setAuthError(null);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const profile = await syncUserProfile(result.user);
      return { user: result.user, profile };
    } catch (error) {
      console.error("Google Auth Error:", error);
      let msg = error.message;
      if (error.code === 'auth/popup-closed-by-user') {
        msg = "Sign in popup was closed. Please try again.";
      } else if (error.code === 'auth/popup-blocked') {
        msg = "Sign-in popup was blocked by browser. Please allow popups.";
      } else if (error.code === 'auth/account-exists-with-different-credential') {
        msg = "An account already exists with this email address.";
      } else if (error.code === 'auth/unauthorized-domain') {
        msg = `The domain "${window.location.hostname}" is not authorized in Firebase Authentication. Please add "${window.location.hostname}" to Firebase Console -> Authentication -> Settings -> Authorized Domains. In the meantime, you can create an account or sign in with Email & Password.`;
      } else if (error.code === 'auth/operation-not-allowed') {
        msg = "Google Sign-In is not enabled in Firebase Console. Please enable it under Authentication -> Sign-in method, or sign in with Email & Password.";
      }
      setAuthError(msg);
      throw new Error(msg);
    }
  };

  // Email & Password Sign In
  const loginWithEmail = async (email, password) => {
    setAuthError(null);
    try {
      const result = await signInWithEmailAndPassword(auth, email.trim(), password);
      const profile = await syncUserProfile(result.user);
      return { user: result.user, profile };
    } catch (error) {
      console.error("Email Login Error:", error);
      let msg = "Invalid email or password.";
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
        msg = "Invalid email or password combination. Please check and retry.";
      } else if (error.code === 'auth/invalid-email') {
        msg = "Please enter a valid email address.";
      } else if (error.code === 'auth/too-many-requests') {
        msg = "Too many failed attempts. Please try again later or reset password.";
      }
      setAuthError(msg);
      throw new Error(msg);
    }
  };

  // Email & Password Sign Up
  const signupWithEmail = async (email, password, displayName, extraDetails = {}) => {
    setAuthError(null);
    try {
      const result = await createUserWithEmailAndPassword(auth, email.trim(), password);
      if (displayName) {
        await updateProfile(result.user, { displayName });
      }
      const profile = await syncUserProfile(result.user, { displayName, ...extraDetails });
      return { user: result.user, profile };
    } catch (error) {
      console.error("Email Signup Error:", error);
      let msg = error.message;
      if (error.code === 'auth/email-already-in-use') {
        msg = "An account with this email already exists. Please login instead.";
      } else if (error.code === 'auth/weak-password') {
        msg = "Password should be at least 6 characters.";
      } else if (error.code === 'auth/invalid-email') {
        msg = "Please enter a valid email address.";
      }
      setAuthError(msg);
      throw new Error(msg);
    }
  };

  // Password Reset
  const resetPassword = async (email) => {
    setAuthError(null);
    try {
      await sendPasswordResetEmail(auth, email.trim());
      return true;
    } catch (error) {
      console.error("Password Reset Error:", error);
      let msg = "Failed to send password reset email.";
      if (error.code === 'auth/user-not-found') {
        msg = "No account found with this email address.";
      }
      setAuthError(msg);
      throw new Error(msg);
    }
  };

  // Logout
  const logout = async () => {
    setAuthError(null);
    try {
      await signOut(auth);
      setUser(null);
      setUserProfile(null);
    } catch (error) {
      console.error("Sign Out Error:", error);
      setAuthError(error.message);
    }
  };

  // Update user profile in Firestore
  const updateUserData = async (updates) => {
    if (!user) return;
    try {
      const userRef = doc(db, 'users', user.uid);
      await setDoc(userRef, { ...updates, updatedAt: serverTimestamp() }, { merge: true });
      setUserProfile(prev => ({ ...prev, ...updates }));
    } catch (err) {
      console.error("Failed to update user profile in Firestore:", err);
      throw err;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        userProfile,
        loading,
        authError,
        setAuthError,
        loginWithGoogle,
        loginWithEmail,
        signupWithEmail,
        resetPassword,
        logout,
        updateUserData,
        isAuthenticated: !!user
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
