import { getFirestore, doc, collection, getDocs, updateDoc } from "firebase/firestore";
import db from "@/lib/firebase";

export default async function handler(req, res) {
  if (req.method !== "PUT") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const { account, userId } = req.body;

  if (!account?.id || !account?.method || !userId) {
    return res.status(400).json({ message: "Invalid account data" });
  }

  try {
    
    const userWalletsRef = collection(doc(db, "WALLET", userId), "wallets");

    const snapshot = await getDocs(userWalletsRef);

    let docToUpdate = null;

    snapshot.forEach((docSnap) => {
      if (docSnap.id === account.id) {
        docToUpdate = docSnap.ref;
      }
    });

    if (!docToUpdate) {
      return res.status(404).json({ message: "Account not found" });
    }

    // Prepare update data
    const updateData =
      account.method === "crypto"
        ? { walletAddress: account.walletAddress }
        : {
            bankName: account.bankName,
            accountNumber: account.accountNumber,
          };

    await updateDoc(docToUpdate, updateData);

    return res.status(200).json({ message: "Account updated successfully", updatedAccount: account });
  } catch (error) {
    console.error("Error updating account:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
