import {
  doc,
  setDoc,
  serverTimestamp,
  collection,
  addDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import db from "@/lib/firebase";

// Function to generate unique referral link
const generateReferralLink = (length = 8) => {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let referralCode = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    referralCode += characters[randomIndex];
  }

  return `http://localhost:3000/auth/signup?referralCode=${referralCode}`;
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    const { userData } = req.body;
    console.log("user data:", userData);

    const { userId, email, fullName, referralCode } = userData;

    if (!userId || !email || !fullName) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const referralLink = generateReferralLink(8);
    const createdAt = new Date().toISOString();

    // USERS collection
    const userDocRef = doc(db, "USERS", userId);
    await setDoc(userDocRef, {
      fullName,
      email,
      userName: "",
      address: "",
      phone: "",
      country: "",
      gender: "",
      dob: "",
      telegram: "",
      userId,
      kycVerified: false,
      hasProvidedKYC: false,
      verified: false,
      suspended: false,
      referredby: referralCode,
      referralLink,
      createdAt: serverTimestamp(),
    });

    // INVESTMENT collection
    const investmentDocRef = doc(db, "INVESTMENT", userId);
    await setDoc(investmentDocRef, {
      userId,
      hasActivePlan: false,
      activePlan: null,
      walletBal: 0,
      lockedBal: 0,
      totalDeposit: 0,
      totalWithdrawal: 0,
      currency: "USDT",
      activatedOn: null,
      timestamp: serverTimestamp(),
      fullName,
    });

    // REFERRAL collection (basic record)
    if (referralCode) {
      const referralDocRef = doc(db, "REFERRAL", userId);
      await setDoc(referralDocRef, {
        referredBy: referralCode,
        referredUserId: userId,
        createdAt: serverTimestamp(),
      });

      // Search for the referrer by matching referralCode inside referralLink
      const usersSnapshot = await getDocs(collection(db, "USERS"));
      let referrerId = null;

      usersSnapshot.forEach((docSnap) => {
        const data = docSnap.data();
        if (data.referralLink?.endsWith(referralCode)) {
          referrerId = docSnap.id;
        }
      });

      // If found, add referred user to REFLIST
      if (referrerId) {
        await addDoc(collection(db, "REFLIST", referrerId, "list"), {
          fullName,
          email,
          createdAt,
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
