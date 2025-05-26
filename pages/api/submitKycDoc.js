import { doc, setDoc, updateDoc, Timestamp } from "firebase/firestore";
import db from "@/lib/firebase";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    const { selectedCountry, selectedDocType, frontFileUrl, backFileUrl, userId, fullName, email } = req.body;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required." });
    }

    // Prepare the KYC data with Firebase Timestamp
    const kycData = {
      country: selectedCountry,
      documentType: selectedDocType,
      frontFileUrl,
      backFileUrl,
      fullName,
      email,
      userId,
      submittedAt: Timestamp.now(),
    };

    // Update user profile in USERS collection
    const userRef = doc(db, "USERS", userId);
    await updateDoc(userRef, {
      kycCountry: selectedCountry,
      kycDocumentType: selectedDocType,
      kycFrontFileUrl: frontFileUrl,
      kycBackFileUrl: backFileUrl,
      kycSubmittedAt: Timestamp.now(),
    });

    // Create or update document in CUSTOMERKYC collection
    const kycRef = doc(db, "CUSTOMERKYC", userId);
    await setDoc(kycRef, kycData, { merge: true });

    return res.status(200).json({ message: "KYC submitted successfully." });
  } catch (error) {
    console.error("Error submitting KYC:", error);
    return res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
}
