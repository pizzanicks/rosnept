import { doc, updateDoc } from "firebase/firestore";
import db from "@/lib/firebase";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const { formData, userId } = req.body;

  if (!userId || !formData) {
    return res.status(400).json({ message: "Missing userId or formData" });
  }

  try {
    const userRef = doc(db, "USERS", userId);

    // Only include known fields to avoid accidentally writing unwanted keys
    const fieldsToUpdate = {
      fullName: formData.fullName || "",
      email: formData.email || "",
      phone: formData.phone || "",
      userName: formData.userName || "",
      dob: formData.dob || "",
      address: formData.address || "",
      country: formData.country || "",
      telegram: formData.telegram || "",
    };

    await updateDoc(userRef, fieldsToUpdate);

    return res.status(200).json({ message: "User information updated successfully." });
  } catch (error) {
    console.error("Error updating user:", error);
    return res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
}
