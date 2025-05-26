import { createContext, useContext, useEffect, useState } from 'react';
import { collection, onSnapshot, doc, query, where, getDocs, getDoc } from 'firebase/firestore';
import db, { auth } from './firebase';

const FirebaseContext = createContext(null);
export const useFirebase = () => useContext(FirebaseContext);

export const FirebaseProvider = ({ children }) => {
    const [userId, setUserId] = useState(null);
    const [userToken, setUserToken] = useState(null);
    const [inactivity, setInactivity] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isVerified, setIsVerified] = useState(true);
    const [userData, setUserData] = useState(null);
    const [userInvestment, setUserInvestment] = useState([]);
    const [userWallets, setUserWallets] = useState([]);
    const [userHistory, setUserHistory] = useState([]);
    const [basicKycPassed, setBasicKycPassed] = useState(false);
    const [docKycPassed, setDocKycPassed] = useState(false);


    useEffect(() => {
        const unsubscribeAuth = auth.onAuthStateChanged(async (user) => {
            if (user) {
                try {
                    const token = await user.getIdToken();
                    setUserId(user.uid);
                    setUserToken(token);
                    setIsAuthenticated(true); // User is authenticated

                } catch (error) {
                    console.error("Error getting user token:", error);
                    setUserId(null);
                    setIsAuthenticated(false); // Authentication failed
                }
            } else {
                setUserId(null);
                setIsAuthenticated(false); // No authenticated user
                // console.log("No authenticated user");
            }
        });

        let logoutTimer;

        const startLogoutTimer = () => {
            logoutTimer = setTimeout(() => {
                // Log out the user after 30 minutes of inactivity
                logoutUser();
            }, 30 * 60 * 1000); // 30 minutes in milliseconds
        };

        const resetLogoutTimer = () => {
            clearTimeout(logoutTimer);
            startLogoutTimer();
        };

        if (userId) {
            startLogoutTimer();
        }

        // Add event listeners for user activity
        const handleUserActivity = () => {
            resetLogoutTimer();
        };

        // Listen for mouse movement and keypress events
        document.addEventListener('mousemove', handleUserActivity);
        document.addEventListener('keydown', handleUserActivity);

        return () => {
            clearTimeout(logoutTimer);
            unsubscribeAuth();
            // Remove event listeners on component unmount
            document.removeEventListener('mousemove', handleUserActivity);
            document.removeEventListener('keydown', handleUserActivity);
        };
    }, [userId]);

    const logoutUser = () => {
        auth.signOut().then(() => {
            // console.log("User logged out due to inactivity");
            setInactivity(true);
            setIsAuthenticated(false); // User logged out
            setTimeout(() => {
                setInactivity(false);
            }, 3000);
        }).catch((error) => {
            console.error("Error logging out:", error);
        });
    };

    useEffect(() => {
        if (userId) {
            const userDocRef = doc(db, "USERS", userId);

            // USER DATA
            const unsubscribeSnapshot1 = onSnapshot(userDocRef, (docSnapshot) => {

                if (docSnapshot.exists()) {
                    const userData = docSnapshot.data();
                    setUserData(userData);
                    setIsVerified(userData?.verified)
                    // console.log("User data:", userData);

                          // Check basic KYC fields
                    const hasBasicKYC =
                    userData.fullName?.trim() !== "" &&
                    userData.userName?.trim() !== "" &&
                    userData.email?.trim() !== "" &&
                    userData.phone?.trim() !== "" &&
                    userData.address?.trim() !== "";

                    console.log("has passed kyc:", hasBasicKYC);
                    setBasicKycPassed(hasBasicKYC);

                    // Check document KYC
                    const hasDocKYC =
                    !!userData.kycFrontFileUrl && !!userData.kycBackFileUrl;

                    console.log("has submitted doc kyc:", hasDocKYC);
                    setDocKycPassed(hasDocKYC);
                    
                } else {
                    console.log("User document does not exist.");
                }

            }, (error) => {
                console.error("Error fetching user data:", error);
            });


            // INVESTMENT DATA
            const investmentDocRef = doc(db, "INVESTMENT", userId);

            const unsubscribeSnapshot2 = onSnapshot(investmentDocRef, (docSnapshot) => {

                if (docSnapshot.exists()) {
                    const investmentData = docSnapshot.data();
                    setUserInvestment(investmentData);
                    console.log("Investment data:", investmentData);
                } else {
                    console.log("Investment document does not exist");
                }

            }, (error) => {
                console.error("Error fetching investment data:", error);
            });


            // WALLET DATA
            const userWalletsRef = collection(doc(db, "WALLET", userId), "wallets");

            const unsubscribeSnapshot3 = onSnapshot(userWalletsRef, (querySnapshot) => {
            const wallets = [];
            querySnapshot.forEach((docSnapshot) => {
                wallets.push({ id: docSnapshot.id, ...docSnapshot.data() });
            });

            setUserWallets(wallets);
            console.log("User Wallets:", wallets);
            }, (error) => {
            console.error("Error fetching wallet data:", error);
            });


            // DEPOSIT HISTORY DATA
            const userHistoryRef = collection(doc(db, "HISTORY", userId), "history");

            const unsubscribeSnapshot4 = onSnapshot(
            userHistoryRef,
            (querySnapshot) => {
                const history = [];
                querySnapshot.forEach((docSnapshot) => {
                history.push({ id: docSnapshot.id, ...docSnapshot.data() });
                });

                setUserHistory(history);
                console.log("User History:", history);
            },
            (error) => {
                console.error("Error fetching history data:", error);
            }
            );



            return () => {
                unsubscribeSnapshot1();
                unsubscribeSnapshot2();
                unsubscribeSnapshot3();
                unsubscribeSnapshot4();
            };
        }
    }, [userId]);

    return (
        <FirebaseContext.Provider value={{ userToken, inactivity, isAuthenticated, userData, userInvestment, isVerified, userId, userWallets, userHistory, basicKycPassed, docKycPassed }}>
            {children}
        </FirebaseContext.Provider>
    );
};