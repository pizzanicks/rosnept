import { collection, addDoc, updateDoc } from "firebase/firestore";
import db from "@/lib/firebase";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const { amount, crypto, userId } = req.body;

  console.log("req body:", amount, crypto, userId);
  

  if (!amount || !crypto || !userId) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    // Step 1: Prepare base data (without wallet.id)
    const baseData = {
      userId,
      amount,
      selectedWallet: {
        currency: crypto,
        method: "crypto",
        id: "", // temporary, will be overwritten
      },
      status: "pending",
      createdAt: new Date().toISOString(),
      type: "deposit",
    };

    // Step 2: Save to DEPOSITREQUEST and get doc ID
    const depositRef = await addDoc(
      collection(db, "DEPOSITREQUEST", userId, "depositRequests"),
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

    const historyRef = await addDoc(
      collection(db, "HISTORY", userId, "history"),
      historyData
    );

    await updateDoc(historyRef, { id: historyRef.id });

    return res.status(200).json({ message: "Deposit request saved successfully" });
  } catch (error) {
    console.error("Error saving deposit request:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
  }
