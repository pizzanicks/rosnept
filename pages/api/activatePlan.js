// pages/api/activatePlan.js
import db from '@/lib/firebase';
import { runTransaction, serverTimestamp, doc } from 'firebase/firestore';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { userInvestment, selectedPlan, amount } = req.body;

    if (!userInvestment?.userId || !selectedPlan?.plan || !amount) {
      return res.status(400).json({ message: 'Invalid request data' });
    }

    const investmentRef = doc(db, 'INVESTMENT', userInvestment.userId);

    await runTransaction(db, async (transaction) => {
      const investmentDoc = await transaction.get(investmentRef);

      if (!investmentDoc.exists()) {
        throw new Error('User investment document does not exist');
      }

      const currentData = investmentDoc.data();

      if (typeof currentData.walletBal !== 'number') {
        throw new Error('Invalid wallet balance');
      }

      if (currentData.walletBal < amount) {
        throw new Error('Insufficient balance');
      }

      // ✅ MAIN STRUCTURED PLAN OBJECT
      const activePlan = {
        planName: selectedPlan.plan,
        amount: amount,
        roiPercent: 0.04, // 4% daily
        startDate: serverTimestamp(), // now
        endDate: null,                // we'll set this during 7-day ROI logic
        nextPayoutDate: null,        // will be updated each day
        isActive: true,
        daysCompleted: 0,
      };

      transaction.update(investmentRef, {
        activePlan: activePlan,
        activatedOn: serverTimestamp(),
        hasActivePlan: true,
        walletBal: currentData.walletBal - amount,
        lockedBal: amount,
      });
    });

    return res.status(200).json({ message: 'Plan activated successfully' });
  } catch (error) {
    console.error('Error activating plan:', error);
    return res.status(500).json({ message: 'Failed to activate plan', error: error.message });
  }
}
