// pages/api/manageActivePlan.js
import db from '@/lib/firebase';
import { runTransaction, doc, serverTimestamp } from 'firebase/firestore';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { userId, action } = req.body;

    console.log('🔄 Plan management request:', { userId, action });

    if (!userId || !action) {
      return res.status(400).json({ message: 'Missing required fields: userId and action' });
    }

    const validActions = ['pause', 'resume', 'stop', 'restart'];
    if (!validActions.includes(action)) {
      return res.status(400).json({ message: `Invalid action. Must be one of: ${validActions.join(', ')}` });
    }

    const investmentRef = doc(db, 'INVESTMENT', userId);

    const result = await runTransaction(db, async (transaction) => {
      const investmentDoc = await transaction.get(investmentRef);
      
      if (!investmentDoc.exists()) {
        throw new Error('User investment document not found');
      }

      const currentData = investmentDoc.data();
      console.log('📊 Current investment data:', currentData);
      
      // Check if user has an active plan
      if (!currentData.activePlan && action !== 'restart') {
        throw new Error('No active investment plan found');
      }

      const updateData = {
        updatedAt: new Date().toISOString()
      };

      let message = '';

      switch (action) {
        case 'pause':
          if (currentData.activePlan.status === 'paused') {
            throw new Error('Plan is already paused');
          }
          if (currentData.activePlan.daysCompleted >= 7) {
            throw new Error('Cannot pause a completed plan');
          }
          updateData['activePlan.status'] = 'paused';
          updateData['activePlan.pausedAt'] = serverTimestamp();
          updateData['activePlan.isActive'] = false;
          message = 'Plan paused successfully. ROI accumulation will stop until resumed.';
          break;

        case 'resume':
          if (currentData.activePlan.status !== 'paused') {
            throw new Error('Plan is not paused');
          }
          updateData['activePlan.status'] = 'active';
          updateData['activePlan.resumedAt'] = serverTimestamp();
          updateData['activePlan.isActive'] = true;
          message = 'Plan resumed successfully. ROI accumulation will continue.';
          break;

        case 'stop':
          if (currentData.activePlan.daysCompleted >= 7) {
            throw new Error('Plan is already completed');
          }
          if (currentData.activePlan.status === 'stopped') {
            throw new Error('Plan is already stopped');
          }
          
          // Return locked balance to wallet
          const refundAmount = currentData.activePlan.amount || currentData.lockedBal || 0;
          updateData.walletBal = (currentData.walletBal || 0) + refundAmount;
          updateData.lockedBal = 0;
          updateData.hasActivePlan = false;
          updateData['activePlan.isActive'] = false;
          updateData['activePlan.status'] = 'stopped';
          updateData['activePlan.stoppedAt'] = serverTimestamp();
          updateData['activePlan.stoppedDay'] = currentData.activePlan.daysCompleted || 0;
          message = `Plan stopped successfully. ${refundAmount.toLocaleString()} USDT returned to your wallet.`;
          break;

        case 'restart':
          // For restart, we need to check if there was a previous completed plan
          if (!currentData.activePlan) {
            throw new Error('No previous plan found to restart');
          }
          if (currentData.activePlan.daysCompleted < 7) {
            throw new Error('Plan must be completed (7 days) before restarting');
          }
          if (currentData.hasActivePlan) {
            throw new Error('You already have an active plan');
          }
          
          // Restart the same plan with same amount
          const planAmount = currentData.activePlan.amount || 0;
          if (planAmount <= 0) {
            throw new Error('Invalid plan amount');
          }
          if (planAmount > (currentData.walletBal || 0)) {
            throw new Error(`Insufficient balance to restart plan. Needed: ${planAmount} USDT, Available: ${currentData.walletBal || 0} USDT`);
          }
          
          updateData.walletBal = (currentData.walletBal || 0) - planAmount;
          updateData.lockedBal = planAmount;
          updateData.hasActivePlan = true;
          updateData.activePlan = {
            ...currentData.activePlan, // Keep all original plan details
            daysCompleted: 0,
            isActive: true,
            status: 'active',
            startDate: serverTimestamp(),
            restartedAt: serverTimestamp(),
            pausedAt: null,
            resumedAt: null,
            stoppedAt: null
          };
          message = 'Plan restarted successfully with the same amount and settings.';
          break;

        default:
          throw new Error('Invalid action');
      }

      transaction.update(investmentRef, updateData);
      return { success: true, message };
    });

    console.log('✅ Plan management successful:', result.message);
    return res.status(200).json(result);

  } catch (error) {
    console.error('❌ Error managing active plan:', error);
    
    // Specific error handling
    if (error.message.includes('not found') || error.message.includes('No active investment plan')) {
      return res.status(404).json({ 
        message: 'No active investment plan found',
        error: error.message 
      });
    }
    
    if (error.message.includes('already') || error.message.includes('already')) {
      return res.status(400).json({ 
        message: error.message,
        error: error.message 
      });
    }
    
    if (error.message.includes('Insufficient balance')) {
      return res.status(400).json({ 
        message: error.message,
        error: error.message 
      });
    }

    return res.status(500).json({ 
      message: 'Failed to manage active plan', 
      error: error.message 
    });
  }
}