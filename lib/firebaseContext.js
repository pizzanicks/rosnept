// lib/firebaseContext.js
import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import db, { auth } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, onSnapshot, doc } from 'firebase/firestore';

const FirebaseContext = createContext(null);

export function FirebaseProvider({ children }) {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(undefined);
  const [userInvestment, setUserInvestment] = useState(undefined);
  const [userWallets, setUserWallets] = useState(undefined);
  const [userHistory, setUserHistory] = useState(undefined);

  const [loadingAuth, setLoadingAuth] = useState(true);
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState(null);

  const userDataLoadedRef = useRef(false);
  const userInvestmentLoadedRef = useRef(false);
  const userWalletsLoadedRef = useRef(false);
  const userHistoryLoadedRef = useRef(false);

  const checkAllDataLoaded = () => {
    if (
      userDataLoadedRef.current &&
      userInvestmentLoadedRef.current &&
      userWalletsLoadedRef.current &&
      userHistoryLoadedRef.current
    ) {
      setLoadingData(false);
      console.log('FirebaseContext: All Firestore data loaded.');
    }
  };

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(
      auth,
      (currentUser) => {
        setUser(currentUser);
        setLoadingAuth(false);
        setError(null);

        setUserData(undefined);
        setUserInvestment(undefined);
        setUserWallets(undefined);
        setUserHistory(undefined);

        userDataLoadedRef.current = false;
        userInvestmentLoadedRef.current = false;
        userWalletsLoadedRef.current = false;
        userHistoryLoadedRef.current = false;

        if (!currentUser) {
          setLoadingData(false);
        } else {
          setLoadingData(true);
        }
      },
      (authError) => {
        console.error('FirebaseContext Auth Error:', authError);
        setError('Authentication failed. Please try again.');
        setLoadingAuth(false);
        setLoadingData(false);
      }
    );

    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    if (!user) return;

    const listeners = [];

    // USER DATA
    const userDocRef = doc(db, 'USERS', user.uid);
    listeners.push(
      onSnapshot(
        userDocRef,
        (docSnapshot) => {
          setUserData(docSnapshot.exists() ? docSnapshot.data() : null);
          userDataLoadedRef.current = true;
          checkAllDataLoaded();
        },
        (err) => {
          console.error('User data error:', err);
          setUserData(null);
          userDataLoadedRef.current = true;
          checkAllDataLoaded();
        }
      )
    );

    // INVESTMENT DATA
    const investmentDocRef = doc(db, 'INVESTMENT', user.uid);
    listeners.push(
      onSnapshot(
        investmentDocRef,
        (docSnapshot) => {
          setUserInvestment(docSnapshot.exists() ? docSnapshot.data() : null);
          userInvestmentLoadedRef.current = true;
          checkAllDataLoaded();
        },
        (err) => {
          console.error('Investment data error:', err);
          setUserInvestment(null);
          userInvestmentLoadedRef.current = true;
          checkAllDataLoaded();
        }
      )
    );

    // WALLET DATA
    const userWalletsRef = collection(doc(db, 'WALLET', user.uid), 'wallets');
    listeners.push(
      onSnapshot(
        userWalletsRef,
        (querySnapshot) => {
          const wallets = [];
          querySnapshot.forEach((doc) => wallets.push({ id: doc.id, ...doc.data() }));
          setUserWallets(wallets);
          userWalletsLoadedRef.current = true;
          checkAllDataLoaded();
        },
        (err) => {
          console.error('Wallets data error:', err);
          setUserWallets([]);
          userWalletsLoadedRef.current = true;
          checkAllDataLoaded();
        }
      )
    );

    // HISTORY DATA
    const userHistoryRef = collection(doc(db, 'HISTORY', user.uid), 'history');
    listeners.push(
      onSnapshot(
        userHistoryRef,
        (querySnapshot) => {
          const history = [];
          querySnapshot.forEach((doc) => history.push({ id: doc.id, ...doc.data() }));
          setUserHistory(history);
          userHistoryLoadedRef.current = true;
          checkAllDataLoaded();
        },
        (err) => {
          console.error('History data error:', err);
          setUserHistory([]);
          userHistoryLoadedRef.current = true;
          checkAllDataLoaded();
        }
      )
    );

    return () => listeners.forEach((unsubscribe) => unsubscribe());
  }, [user]);

  const contextValue = {
    user,
    userId: user?.uid || null, // ✅ Add userId here
    db,
    userData,
    userInvestment,
    userWallets,
    userHistory,
    loading: loadingAuth || loadingData,
    error,
  };

  return <FirebaseContext.Provider value={contextValue}>{children}</FirebaseContext.Provider>;
}

export function useFirebase() {
  const context = useContext(FirebaseContext);
  if (!context) throw new Error('useFirebase must be used within a FirebaseProvider');
  return context;
}
