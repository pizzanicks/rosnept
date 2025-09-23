// pages/api/activatePlan.js
import db from '@/lib/firebase';
import { runTransaction, serverTimestamp, doc } from 'firebase/firestore';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { userId, selectedPlan, amount } = req.body;

    console.log('📥 Received activation request:', { 
      userId, 
      planName: selectedPlan?.plan,
      amount 
    });

    if (!userId || !selectedPlan?.plan || !amount) {
      return res.status(400).json({ message: 'Missing required fields: userId, selectedPlan, or amount' });
    }

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      return res.status(400).json({ message: 'Invalid amount' });
    }

    const investmentRef = doc(db, 'INVESTMENT', userId);

    const result = await runTransaction(db, async (transaction) => {
      const investmentDoc = await transaction.get(investmentRef);
      
      if (!investmentDoc.exists()) {
        throw new Error('User investment document not found');
      }

      const currentData = investmentDoc.data();
      console.log('📊 Current user data:', currentData);

      // Check if user already has an active plan
      if (currentData.hasActivePlan) {
        throw new Error('User already has an active investment plan');
      }

      // Validate wallet balance
      const currentBalance = currentData.walletBal || 0;
      if (typeof currentBalance !== 'number' || currentBalance < parsedAmount) {
        throw new Error(`Insufficient balance. Current: $${currentBalance}, Required: $${parsedAmount}`);
      }

      // FIXED ROI CALCULATION - Use plan's actual ROI instead of hardcoded 4%
      let roiPercent = 0.04; // Fallback default

      // Get ROI from plan's 'roi' field (e.g., '70.4%' → 0.704)
      if (selectedPlan.roi) {
        // Remove the '%' sign and convert to number, then divide by 100
        roiPercent = parseFloat(selectedPlan.roi.replace('%', '')) / 100;
      } else if (selectedPlan.roiPercentage) {
        roiPercent = selectedPlan.roiPercentage > 1 ? selectedPlan.roiPercentage / 100 : selectedPlan.roiPercentage;
      } else if (selectedPlan.roiPercent) {
        roiPercent = selectedPlan.roiPercent > 1 ? selectedPlan.roiPercent / 100 : selectedPlan.roiPercent;
      }

      console.log('💰 Using ROI percentage:', roiPercent * 100 + '%');

      // Create active plan object
      const activePlan = {
        planName: selectedPlan.plan,
        amount: parsedAmount,
        roiPercent: roiPercent,
        startDate: serverTimestamp(),
        isActive: true,
        daysCompleted: 0,
        durationDays: 7,
        status: 'active'
      };

      // Calculate new balances
      const newWalletBal = currentBalance - parsedAmount;
      const newLockedBal = (currentData.lockedBal || 0) + parsedAmount;

      console.log('🔄 Balance update:', {
        oldWallet: currentBalance,
        newWallet: newWalletBal,
        oldLocked: currentData.lockedBal || 0,
        newLocked: newLockedBal
      });

      // Update the document
      transaction.update(investmentRef, {
        activePlan: activePlan,
        activatedOn: serverTimestamp(),
        hasActivePlan: true,
        walletBal: newWalletBal,
        lockedBal: newLockedBal,
        totalDeposit: (currentData.totalDeposit || 0) + parsedAmount,
        updatedAt: new Date().toISOString()
      });

      return {
        success: true,
        plan: selectedPlan.plan,
        amount: parsedAmount,
        roiPercentage: roiPercent * 100
      };
    });

    console.log('✅ Plan activated successfully for user:', userId);
    return res.status(200).json({ 
      message: 'Plan activated successfully',
      ...result
    });

  } catch (error) {
    console.error('❌ Error activating plan:', error);
    
    if (error.message.includes('already has an active investment')) {
      return res.status(400).json({ 
        message: 'You already have an active investment plan',
        error: error.message 
      });
    }
    
    if (error.message.includes('Insufficient balance')) {
      return res.status(400).json({ 
        message: 'Insufficient wallet balance',
        error: error.message 
      });
    }

    return res.status(500).json({ 
      message: 'Failed to activate plan', 
      error: error.message 
    });
  }
}