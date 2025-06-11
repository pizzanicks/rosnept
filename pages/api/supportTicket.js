import { collection, addDoc, Timestamp } from "firebase/firestore";
import db from "@/lib/firebase";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    const { subject, message } = req.body;
    console.log("dataa:", subject, message);

    if (!subject || !message) {
      return res.status(400).json({ message: "Subject and message are required." });
    }

    await addDoc(collection(db, "CUSTOMERTICKETS"), {
      subject,
      message,
      createdAt: Timestamp.now()
    });

    return res.status(200).json({ message: "Ticket submitted successfully." });
  } catch (error) {
    console.error("Error submitting ticket:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
