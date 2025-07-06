// pages/api/createUser.js
// This file runs on your Next.js server, not in the user's browser

import {
  doc,
  setDoc,
  serverTimestamp, // Keep serverTimestamp for robust timestamps
  collection,
  addDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";

// IMPORTANT: Ensure this `db` import provides a Firestore instance
// initialized with the Firebase Admin SDK for a server-side API route.
// Using client-side `firebase/firestore` (which `db from "@/lib/firebase"` often implies)
// directly in API routes is generally not recommended for production due to security
// and performance implications. If '@/lib/firebase' is indeed for client-side,
// you should adjust your Firebase setup for API routes to use 'firebase-admin'.
import db from "@/lib/firebase"; 

// Function to generate unique referral code (for the new user's OWN referral link)
const generateReferralCode = (length = 8) => {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let referralCode = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    referralCode += characters[randomIndex];
  }
  return referralCode; // Returns just the code, not the full URL
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    const { userData } = req.body;
    console.log("Incoming user data from frontend:", userData);

    // Validate essential fields directly from userData
    const { userId, email, fullName } = userData;
    if (!userId || !email || !fullName) {
      return res.status(400).json({ message: "Missing required fields (userId, email, fullName)" });
    }

    // Generate the unique referral code for THIS new user (their own referral link)
    const ownReferralCode = generateReferralCode(8);
    const ownReferralLink = `http://localhost:3000/auth/signup?referralCode=${ownReferralCode}`;

    // USERS collection: This is the critical change
    const userDocRef = doc(db, "USERS", userId);
    await setDoc(userDocRef, {
      ...userData, // <<<--- THIS IS THE MOST IMPORTANT CHANGE: Spread all incoming fields
      // Override or ensure essential server-side controlled fields:
      userId: userId, // Ensure userId matches the document ID
      referralLink: ownReferralLink, // Use the server-generated unique referral link for THIS user
      referredby: userData.referralCode || null, // Use referralCode from frontend (if referred)
      createdAt: serverTimestamp(), // Always use serverTimestamp for creation time
      updatedAt: serverTimestamp(), // Set initial update time

      // Ensure other fields have correct default values if they weren't explicitly passed
      // or if you want server-side control over their initial state.
      // The `|| userData.fieldName` part allows frontend to provide it,
      // otherwise it uses the server's default.
      userName: userData.userName || fullName, // Default to fullName if userName not provided
      address: userData.address || "",
      phone: userData.phone || "",
      country: userData.country || "",
      gender: userData.gender || "",
      dob: userData.dob || "",
      telegram: userData.telegram || "",
      kycVerified: userData.kycVerified || false,
      hasProvidedKYC: userData.hasProvidedKYC || false,
      verified: userData.verified || false,
      suspended: userData.suspended || false,
      
      // Ensure the *newly added* fields from `signup.js` are initialized correctly
      hasActiveInvestments: userData.hasActiveInvestments || false,
      walletBalance: userData.walletBalance || 0,
      currentPlanDaysCompleted: userData.currentPlanDaysCompleted || 0,
      currentPlanRoiPercentage: userData.currentPlanRoiPercentage || 0,
      lastRoiPaymentDate: userData.lastRoiPaymentDate || '',
      adminNote: userData.adminNote || '',
      transactionHistory: userData.transactionHistory || [],
      kycDocs: userData.kycDocs || [],
      earningStatus: userData.earningStatus || 'inactive', // Default status
    });

    // INVESTMENT collection (remains mostly the same, ensure serverTimestamp)
    const investmentDocRef = doc(db, "INVESTMENT", userId);
    await setDoc(investmentDocRef, {
      userId,
      hasActivePlan: false,
      activePlan: null,
      walletBal: 0, // This is `walletBal` in INVESTMENT, distinct from `walletBalance` in USERS
      lockedBal: 0,
      totalDeposit: 0,
      totalWithdrawal: 0,
      currency: "USDT",
      activatedOn: null,
      timestamp: serverTimestamp(), // Use serverTimestamp for consistency
      fullName, // User's full name
    });

    // REFERRAL collection (basic record)
    // Check if the user was referred by someone (i.e., `userData.referralCode` was present)
    if (userData.referralCode) {
      const referralDocRef = doc(db, "REFERRAL", userId);
      await setDoc(referralDocRef, {
        referredByCode: userData.referralCode, // The code of the person who referred them
        referredUserId: userId,               // The new user's ID
        createdAt: serverTimestamp(),
      });

      // Search for the referrer by matching their referralLink in USERS collection
      const usersRef = collection(db, "USERS");
      const referrerQuery = query(usersRef, where("referralLink", "==", `http://localhost:3000/auth/signup?referralCode=${userData.referralCode}`));
      const referrerSnapshot = await getDocs(referrerQuery);
      
      let referrerId = null;
      if (!referrerSnapshot.empty) {
          referrerId = referrerSnapshot.docs[0].id; // Get the ID of the referrer
      }
      
      // If referrer found, add the new user to the referrer's REFLIST
      if (referrerId) {
        await addDoc(collection(db, "REFLIST", referrerId, "list"), {
          fullName, // Full name of the newly referred user
          email,    // Email of the newly referred user
          createdAt: serverTimestamp(), // Use serverTimestamp
        });
      }
    }

    return res.status(201).json({ message: "User created successfully!" });
  } catch (error) {
    console.error("Error storing user data:", error);
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
}