import { collection, addDoc, doc, getFirestore } from "firebase/firestore";
import db from "@/lib/firebase";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const {accountData, userId} = req.body;

  // Extract data from the request body
  const { method, currency, walletAddress, bankName, accountNumber } = accountData;

  // Ensure all required fields are present
  if (!userId || !method || (method === 'crypto' && (!currency || !walletAddress)) || (method === 'bank' && (!bankName || !accountNumber))) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    // Create a reference to the user's wallet subcollection under the WALLETS collection
    const userWalletsRef = collection(doc(db, "WALLET", userId), "wallets");

    // Save wallet information based on the selected payment method
    if (method === 'crypto') {
      // Save cryptocurrency account details
      await addDoc(userWalletsRef, {
        method: "crypto",
        currency,
        walletAddress,
        createdAt: new Date().toISOString(),
      });
    } else if (method === 'bank') {
      // Save bank account details
      await addDoc(userWalletsRef, {
        method: "bank",
        currency : "usd",
        bankName,
        accountNumber,
        createdAt: new Date().toISOString(),
      });
    }

    return res.status(200).json({
      message: "Payment account saved successfully",
    });
  } catch (error) {
    console.error("Error saving payment account:", error);
    return res.status(500).json({ message: "Server Error", error: error.message });
  }
}
