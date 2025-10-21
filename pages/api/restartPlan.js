import db from "@/lib/firebase"; // adjust path if your firebase file is elsewhere
import { doc, getDoc, updateDoc } from "firebase/firestore";

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    const { userId } = req.body;
    if (!userId) {
      return res.status(400).json({ error: "Missing userId" });
    }

    // Reference to user's investment document
    const userInvestmentRef = doc(db, "INVESTMENT", userId);
    const userInvestmentSnap = await getDoc(userInvestmentRef);

    if (!userInvestmentSnap.exists()) {
      return res.status(404).json({ error: "User investment not found" });
    }

    const userInvestment = userInvestmentSnap.data();

    // Grab current status from activePlan
    const currentStatus = userInvestment.activePlan?.status;

    if (!currentStatus) {
      return res.status(400).json({ error: "Cannot restart. Current status is undefined." });
    }

    if (currentStatus !== "stopped") {
      return res.status(400).json({
        error: `Cannot restart. Current status is "${currentStatus}".`,
      });
    }

    // Restart the stopped plan
    const now = new Date();

    const updatedInvestment = {
      ...userInvestment,
      hasActivePlan: true,
      activePlan: {
        ...userInvestment.activePlan,
        status: "active",
        isActive: true,
        isPaused: false,
        isStopped: false,
        daysCompleted: 0,
        startDate: now,
        resumedAt: now,
        stoppedAt: null,
        stoppedDay: 0,
        lastRoiPaymentDate: now,
      },
      updatedAt: now.toISOString(),
    };

    await updateDoc(userInvestmentRef, updatedInvestment);

    return res.status(200).json({
      message: "Investment restarted successfully",
      updatedInvestment,
    });
  } catch (error) {
    console.error("Restart Plan Error:", error);
    return res.status(500).json({ error: "Failed to restart plan" });
  }
}
