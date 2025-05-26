import { collection, getDocs, doc, runTransaction, addDoc } from "firebase/firestore";
import db from "@/lib/firebase";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    const { recipient, amount, userId } = req.body;

    if (!recipient || !amount || !userId) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      return res.status(400).json({ message: "Invalid amount" });
    }

    // 1. Find recipient's userId in USERS collection
    const usersSnapshot = await getDocs(collection(db, "USERS"));
    let recipientId = null;

    usersSnapshot.forEach((docSnap) => {
      const data = docSnap.data();
      if (data.userName === recipient) {
        recipientId = docSnap.id;
      }
    });

    if (!recipientId) {
      return res.status(422).json({ message: "Invalid recipient username" });
    }

    // 2. Start transaction
    await runTransaction(db, async (transaction) => {
      const senderRef = doc(db, "INVESTMENT", userId);
      const recipientRef = doc(db, "INVESTMENT", recipientId);

      const senderSnap = await transaction.get(senderRef);
      const recipientSnap = await transaction.get(recipientRef);

      if (!senderSnap.exists()) {
        throw new Error("Sender investment not found");
      }

      if (!recipientSnap.exists()) {
        throw new Error("Recipient investment not found");
      }

      const senderData = senderSnap.data();
      const recipientData = recipientSnap.data();

      const senderWallet = parseFloat(senderData.walletBal || 0);
      const recipientWallet = parseFloat(recipientData.walletBal || 0);

      if (senderWallet < amountNum) {
        throw new Error("Insufficient funds");
      }

      const newSenderBal = senderWallet - amountNum;
      const newRecipientBal = recipientWallet + amountNum;

      transaction.update(senderRef, { walletBal: newSenderBal });
      transaction.update(recipientRef, { walletBal: newRecipientBal });
    });

    // 3. Log to sender's history
    const senderHistoryRef = await addDoc(collection(db, "HISTORY", userId, "history"), {
      amount: amountNum,
      selectedWallet: {},
      userId,
      status: "completed",
      createdAt: new Date().toISOString(),
      type: "withdrawal",
      recipient,
    });

    // Update docId field after document is created
    await runTransaction(db, async (transaction) => {
      const docRef = doc(db, "HISTORY", userId, "history", senderHistoryRef.id);
      transaction.update(docRef, {
        docId: senderHistoryRef.id,
      });
    });

    // 4. Log to recipient's history
    const recipientHistoryRef = await addDoc(collection(db, "HISTORY", recipientId, "history"), {
      amount: amountNum,
      selectedWallet: {},
      userId: recipientId,
      status: "completed",
      createdAt: new Date().toISOString(),
      type: "credit",
    });

    // Update docId field for recipient history
    await runTransaction(db, async (transaction) => {
      const docRef = doc(db, "HISTORY", recipientId, "history", recipientHistoryRef.id);
      transaction.update(docRef, {
        docId: recipientHistoryRef.id,
      });
    });

    return res.status(200).json({ message: "Transfer successful" });

  } catch (error) {
    console.error("Transfer error:", error.message);

    if (error.message === "Insufficient funds") {
      return res.status(400).json({ message: "Insufficient funds" });
    }

    if (
      error.message === "Sender investment not found" ||
      error.message === "Recipient investment not found"
    ) {
      return res.status(404).json({ message: error.message });
    }

    return res.status(500).json({ message: "Server error", error: error.message });
  }
}
