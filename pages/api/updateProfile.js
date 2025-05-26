import { doc, updateDoc } from "firebase/firestore";
import db from "@/lib/firebase";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    const { formData, userId } = req.body;

    // console.log("form Data:", formData);
    // console.log("user id:", userId);

    if (!userId || !formData) {
      return res.status(400).json({ message: "Missing userId or formData" });
    }

    const {
      fullName,
      userName,
      email,
      phone,
      address,
      country,
      gender,
      dob,
      telegram
    } = formData;

    const userRef = doc(db, "USERS", userId);

    await updateDoc(userRef, {
      fullName,
      userName,
      email,
      phone,
      address,
      country,
      gender,
      dob,
      telegram,
      updatedAt: new Date()
    });

    return res.status(200).json({ message: "Profile updated successfully" });
  } catch (error) {
    console.error("Error updating profile:", error);
    return res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
}
