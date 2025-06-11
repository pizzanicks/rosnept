import { collection, doc, setDoc, runTransaction } from "firebase/firestore";
import db from "@/lib/firebase";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const { amount, selectedWallet, userId, name } = req.body;

  if (!amount || !selectedWallet || !userId || !name) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const withdrawalAmount = Number(amount);
    const newWithdrawalRef = doc(collection(db, "WITHDRAWREQUEST"));

    await runTransaction(db, async (transaction) => {
      // 1. Reference the user's investment document
      const userInvestmentRef = doc(db, "INVESTMENT", userId);
      const userInvestmentSnap = await transaction.get(userInvestmentRef);

      if (!userInvestmentSnap.exists()) {
        throw new Error("User investment data not found");
      }

      const userData = userInvestmentSnap.data();
      const currentBalance = Number(userData.walletBal) || 0;

      if (currentBalance < withdrawalAmount) {
        throw new Error("Insufficient wallet balance");
      }

      // 2. Deduct the withdrawal amount
      const newBalance = currentBalance - withdrawalAmount;
      transaction.update(userInvestmentRef, { walletBal: newBalance });

      const withdrawalData = {
        amount: withdrawalAmount,
        selectedWallet,
        userId,
        status: "pending",
        createdAt: new Date().toISOString(),
        docId: newWithdrawalRef.id,
        type: "withdrawal",
        name,
      };

      // 3. Save to WITHDRAWREQUEST
      transaction.set(newWithdrawalRef, withdrawalData);

      // 4. Save to user's HISTORY subcollection
      const userHistoryRef = doc(db, "HISTORY", userId, "history", newWithdrawalRef.id);
      transaction.set(userHistoryRef, withdrawalData);

      // 5. Save to top-level ALLHISTORY collection
      const allHistoryRef = doc(db, "ALLHISTORY", newWithdrawalRef.id);
      transaction.set(allHistoryRef, withdrawalData);
    });

    return res.status(200).json({
      message: "Withdrawal request submitted and balance updated successfully",
      docId: newWithdrawalRef.id,
    });
  } catch (error) {
    console.error("Transaction failed:", error);
    return res.status(500).json({
      message: error.message || "Server Error",
    });
  }
}
