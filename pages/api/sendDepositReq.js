import { collection, addDoc, updateDoc, setDoc, doc } from "firebase/firestore";
import db from "@/lib/firebase";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const { amount, crypto, userId, name } = req.body;

  if (!amount || !crypto || !userId || !name) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    // Step 1: Prepare base data (without wallet.id)
    const baseData = {
      userId,
      amount: Number(amount),
      selectedWallet: {
        currency: crypto,
        method: "crypto",
        id: "", // temporary, will be overwritten
      },
      status: "pending",
      createdAt: new Date().toISOString(),
      type: "deposit",
      name,
    };

    // Step 2: Save to DEPOSITREQUEST and get doc ID
    const depositRef = await addDoc(
      collection(db, "DEPOSITREQUEST"),
      baseData
    );

    // Step 3: Update deposit doc with doc ID
    await updateDoc(depositRef, {
      id: depositRef.id,
      "selectedWallet.id": depositRef.id,
    });

    // Step 4: Save same data (with updated ID) to HISTORY
    const historyData = {
      ...baseData,
      id: depositRef.id,
      selectedWallet: {
        ...baseData.selectedWallet,
        id: depositRef.id,
      },
    };

    // Create historyRef with same ID as depositRef
    const historyRef = doc(db, "HISTORY", userId, "history", depositRef.id);

    await setDoc(historyRef, {
      ...historyData,
      id: depositRef.id,
    });

    // Step 5: Save to ALLHISTORY (top-level)
    await setDoc(doc(db, "ALLHISTORY", depositRef.id), historyData);

    return res.status(200).json({ message: "Deposit request saved successfully" });
  } catch (error) {
    console.error("Error saving deposit request:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
