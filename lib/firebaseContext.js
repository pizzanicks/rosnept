// lib/firebaseContext.js
import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
// CORRECTED IMPORT: db is imported as default, auth as named
import db, { auth } from './firebase'; // Import initialized db as default, auth as named
import { onAuthStateChanged } from 'firebase/auth';
import { collection, onSnapshot, doc } from 'firebase/firestore'; // Removed unused imports like query, where, getDocs, getDoc

const FirebaseContext = createContext(null);

export function FirebaseProvider({ children }) {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(undefined);
  const [userInvestment, setUserInvestment] = useState(undefined);
  const [userWallets, setUserWallets] = useState(undefined); // Track wallets loading
  const [userHistory, setUserHistory] = useState(undefined); // Track history loading

  const [loadingAuth, setLoadingAuth] = useState(true); // Tracks Firebase Auth state loading
  const [loadingData, setLoadingData] = useState(true); // Tracks all Firestore data loading
  const [error, setError] = useState(null);

  // Use refs to track if initial snapshots have fired for each data type
  const userDataLoadedRef = useRef(false);
  const userInvestmentLoadedRef = useRef(false);
  const userWalletsLoadedRef = useRef(false);
  const userHistoryLoadedRef = useRef(false);

  // Helper function to check if all data has been loaded
  const checkAllDataLoaded = () => {
    if (userDataLoadedRef.current && userInvestmentLoadedRef.current &&
        userWalletsLoadedRef.current && userHistoryLoadedRef.current) {
      setLoadingData(false);
      console.log("FirebaseContext: ALL Firestore data streams have settled. Setting loadingData to false.");
    }
  };

  // Effect 1: Listen for Auth State Changes
  useEffect(() => {
    console.log("FirebaseContext: Auth Effect Init");
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoadingAuth(false); // Auth state has been determined
      setError(null); // Clear any previous errors

      console.log("FirebaseContext: Auth State Changed. User:", currentUser ? currentUser.uid : "No User");

      // Reset data states and loading flags when auth changes
      setUserData(undefined);
      setUserInvestment(undefined);
      setUserWallets(undefined);
      setUserHistory(undefined);

      userDataLoadedRef.current = false;
      userInvestmentLoadedRef.current = false;
      userWalletsLoadedRef.current = false;
      userHistoryLoadedRef.current = false;

      if (!currentUser) {
        // If no user, no data to fetch, so data loading is also complete
        setLoadingData(false);
        console.log("FirebaseContext: No user logged in. Data loading also complete.");
      } else {
        // If user logged in, data loading starts
        setLoadingData(true);
        console.log("FirebaseContext: User logged in. Starting data loading...");
      }
    }, (authError) => {
      console.error("FirebaseContext: Auth error:", authError);
      setError("Authentication failed. Please try again.");
      setLoadingAuth(false);
      setLoadingData(false); // Stop all loading on auth error
    });

    return () => {
      console.log("FirebaseContext: Auth Effect Cleanup");
      unsubscribeAuth();
    };
  }, []); // Run once on component mount

  // Effect 2: Fetch Firestore Data based on 'user'
  useEffect(() => {
    if (!user || !db) {
      console.log("FirebaseContext: Data Fetch Effect - User or DB not ready. Skipping data fetch.");
      // If no user or db, ensure data states are reset and loading is handled by auth effect.
      // This prevents trying to fetch data before auth is resolved.
      setUserData(undefined);
      setUserInvestment(undefined);
      setUserWallets(undefined);
      setUserHistory(undefined);
      userDataLoadedRef.current = false;
      userInvestmentLoadedRef.current = false;
      userWalletsLoadedRef.current = false;
      userHistoryLoadedRef.current = false;

      // If auth is already loaded and no user, data loading is effectively done.
      if (!user && !loadingAuth) {
        setLoadingData(false);
      }
      return;
    }

    console.log("FirebaseContext: Data Fetch Effect - Starting listeners for user:", user.uid);

    const listeners = [];

    // Listener for USER DATA (from 'USERS' collection)
    try {
      const userDocRef = doc(db, 'USERS', user.uid);
      listeners.push(onSnapshot(userDocRef, (docSnapshot) => {
        setUserData(docSnapshot.exists() ? docSnapshot.data() : null);
        userDataLoadedRef.current = true;
        console.log("FirebaseContext: User Data Snapshot. Exists:", docSnapshot.exists(), "Data:", docSnapshot.data());
        checkAllDataLoaded();
      }, (err) => {
        console.error("FirebaseContext: Error fetching user data:", err);
        setError("Failed to load user profile data.");
        setUserData(null);
        userDataLoadedRef.current = true; // Mark as loaded even on error
        checkAllDataLoaded();
      }));
    } catch (e) {
      console.error("FirebaseContext: Error setting up user data listener:", e);
      setError("Error setting up user data listener.");
      setUserData(null);
      userDataLoadedRef.current = true;
      checkAllDataLoaded();
    }


    // Listener for INVESTMENT DATA (from 'INVESTMENT' collection)
    try {
      const investmentDocRef = doc(db, 'INVESTMENT', user.uid);
      listeners.push(onSnapshot(investmentDocRef, (docSnapshot) => {
        setUserInvestment(docSnapshot.exists() ? docSnapshot.data() : null);
        userInvestmentLoadedRef.current = true;
        console.log("FirebaseContext: Investment Data Snapshot. Exists:", docSnapshot.exists(), "Data:", docSnapshot.data());
        checkAllDataLoaded();
      }, (err) => {
        console.error("FirebaseContext: Error fetching investment data:", err);
        setError("Failed to load investment data.");
        setUserInvestment(null);
        userInvestmentLoadedRef.current = true; // Mark as loaded even on error
        checkAllDataLoaded();
      }));
    } catch (e) {
      console.error("FirebaseContext: Error setting up investment data listener:", e);
      setError("Error setting up investment data listener.");
      setUserInvestment(null);
      userInvestmentLoadedRef.current = true;
      checkAllDataLoaded();
    }


    // Listener for WALLET DATA (from 'WALLET' collection and subcollection 'wallets')
    try {
      const userWalletsRef = collection(doc(db, "WALLET", user.uid), "wallets");
      listeners.push(onSnapshot(userWalletsRef, (querySnapshot) => {
        const wallets = [];
        querySnapshot.forEach((docSnapshot) => {
          wallets.push({ id: docSnapshot.id, ...docSnapshot.data() });
        });
        setUserWallets(wallets);
        userWalletsLoadedRef.current = true;
        console.log("FirebaseContext: Wallets Data Snapshot. Count:", wallets.length, "Data:", wallets);
        checkAllDataLoaded();
      }, (err) => {
        console.error("FirebaseContext: Error fetching wallet data:", err);
        setError("Failed to load wallet data.");
        setUserWallets([]); // Set to empty array on error
        userWalletsLoadedRef.current = true; // Mark as loaded even on error
        checkAllDataLoaded();
      }));
    } catch (e) {
      console.error("FirebaseContext: Error setting up wallet data listener:", e);
      setError("Error setting up wallet data listener.");
      setUserWallets([]);
      userWalletsLoadedRef.current = true;
      checkAllDataLoaded();
    }


    // Listener for DEPOSIT HISTORY DATA (from 'HISTORY' collection and subcollection 'history')
    try {
      const userHistoryRef = collection(doc(db, "HISTORY", user.uid), "history");
      listeners.push(onSnapshot(userHistoryRef, (querySnapshot) => {
        const history = [];
        querySnapshot.forEach((docSnapshot) => {
          history.push({ id: docSnapshot.id, ...docSnapshot.data() });
        });
        setUserHistory(history);
        userHistoryLoadedRef.current = true;
        console.log("FirebaseContext: History Data Snapshot. Count:", history.length, "Data:", history);
        checkAllDataLoaded();
      }, (err) => {
        console.error("FirebaseContext: Error fetching history data:", err);
        setError("Failed to load transaction history.");
        setUserHistory([]); // Set to empty array on error
        userHistoryLoadedRef.current = true; // Mark as loaded even on error
        checkAllDataLoaded();
      }));
    } catch (e) {
      console.error("FirebaseContext: Error setting up history data listener:", e);
      setError("Error setting up history data listener.");
      setUserHistory([]);
      userHistoryLoadedRef.current = true;
      checkAllDataLoaded();
    }


    // Cleanup listeners on unmount or user change
    return () => {
      console.log("FirebaseContext: Data Fetch Effect Cleanup. Unsubscribing all listeners.");
      listeners.forEach(unsubscribe => unsubscribe());
    };
  }, [user, db, loadingAuth]); // Depend on user, db, and loadingAuth (to ensure it runs after auth is ready)

  // Log the current context state for debugging
  useEffect(() => {
    console.log(
      "FirebaseContext State Update - Overall Loading:", loadingAuth || loadingData,
      "Auth Loading:", loadingAuth,
      "Data Loading:", loadingData,
      "User:", !!user,
      "UserData:", userData !== undefined ? (userData ? "Loaded" : "Null") : "Undefined",
      "UserInvestment:", userInvestment !== undefined ? (userInvestment ? "Loaded" : "Null") : "Undefined",
      "UserWallets:", userWallets !== undefined ? (userWallets.length > 0 ? "Loaded" : "Empty") : "Undefined",
      "UserHistory:", userHistory !== undefined ? (userHistory.length > 0 ? "Loaded" : "Empty") : "Undefined",
      "Error:", error
    );
  }, [loadingAuth, loadingData, user, userData, userInvestment, userWallets, userHistory, error]);


  const contextValue = {
    user,
    db, // Pass db instance
    userData,
    userInvestment,
    userWallets,
    userHistory,
    loading: loadingAuth || loadingData, // Overall loading state
    error,   // Pass any errors
    // You can add other states like isAuthenticated, isVerified, etc. here if needed by components
    // isAuthenticated, isVerified, userId, userToken, inactivity, basicKycPassed, docKycPassed
  };

  return (
    <FirebaseContext.Provider value={contextValue}>
      {children}
    </FirebaseContext.Provider>
  );
}

export function useFirebase() {
  const context = useContext(FirebaseContext);
  if (context === undefined) {
    throw new Error('useFirebase must be used within a FirebaseProvider');
  }
  return context;
}
