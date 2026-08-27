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
  onSnapshot, 
  serverTimestamp 
} from '../lib/firebase';

const AuthContext = createContext();

const CACHE_USER_KEY = 'agrisphere_cached_user';
const CACHE_PROFILE_KEY = 'agrisphere_cached_profile';

const getInitialCachedUser = () => {
  try {
    const raw = localStorage.getItem(CACHE_USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
};

const getInitialCachedProfile = () => {
  try {
    const raw = localStorage.getItem(CACHE_PROFILE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(getInitialCachedUser);
  const [userProfile, setUserProfile] = useState(getInitialCachedProfile);
  // If we have cached credentials, don't flash a login screen, keep loading till Firebase verifies
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  // Sync user profile to Firestore & local cache
  const syncUserProfile = async (firebaseUser, additionalData = {}) => {
    if (!firebaseUser) return null;

    const baseData = {
      uid: firebaseUser.uid,
      email: firebaseUser.email,
      displayName: additionalData.displayName || firebaseUser.displayName || (firebaseUser.email ? firebaseUser.email.split('@')[0] : 'Farmer'),
      photoURL: firebaseUser.photoURL || null,
      updatedAt: serverTimestamp(),
      role: 'farmer',
      state: additionalData.state || 'Punjab',
      preferredCrop: additionalData.preferredCrop || 'Wheat',
      preferredLanguage: additionalData.preferredLanguage || 'hi',
      ...additionalData
    };

    // Optimistically update local profile state
    setUserProfile(prev => ({ ...(prev || {}), ...baseData }));
    try {
      localStorage.setItem(CACHE_PROFILE_KEY, JSON.stringify({ ...baseData }));
    } catch (e) {}

    // Persist to Firestore with merge: true (handles offline & online automatically)
    try {
      const userRef = doc(db, 'users', firebaseUser.uid);
      await setDoc(userRef, baseData, { merge: true });
    } catch (err) {
      // Soft notice if offline or initializing
      console.warn("Firestore user profile offline queue notice:", err?.message || err);
    }

    return baseData;
  };

  useEffect(() => {
    let profileUnsubscribe = null;

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (profileUnsubscribe) {
        profileUnsubscribe();
        profileUnsubscribe = null;
      }

      if (currentUser) {
        setUser(currentUser);
        const cachedBase = {
          uid: currentUser.uid,
          email: currentUser.email,
          displayName: currentUser.displayName || (currentUser.email ? currentUser.email.split('@')[0] : 'Farmer'),
          photoURL: currentUser.photoURL || null
        };
        
        try {
          localStorage.setItem(CACHE_USER_KEY, JSON.stringify(cachedBase));
        } catch (e) {}

        // Listen in real-time to the user profile document in Firestore (handles cache & offline natively)
        const userRef = doc(db, 'users', currentUser.uid);
        profileUnsubscribe = onSnapshot(userRef, (snapshot) => {
          if (snapshot.exists()) {
            const data = snapshot.data();
            setUserProfile(prev => ({ ...(prev || {}), ...data }));
            try {
              localStorage.setItem(CACHE_PROFILE_KEY, JSON.stringify(data));
            } catch (e) {}
          }
        }, (err) => {
          console.warn("Firestore profile sync notice (offline or network initializing):", err?.message || err);
        });

        // Background write
        syncUserProfile(currentUser).catch((e) => {
          console.warn("Profile background sync notice:", e?.message || e);
        });
      } else {
        setUser(null);
        setUserProfile(null);
        try {
          localStorage.removeItem(CACHE_USER_KEY);
          localStorage.removeItem(CACHE_PROFILE_KEY);
        } catch (e) {}
      }
      setLoading(false);
    });

    return () => {
      unsubscribe();
      if (profileUnsubscribe) profileUnsubscribe();
    };
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
