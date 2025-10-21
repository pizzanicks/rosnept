import React, { useState, useEffect } from 'react';
import { FiCheckCircle, FiPause, FiPlay, FiStopCircle, FiRefreshCw } from 'react-icons/fi';
import { collection, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import db from '@/lib/firebase';
import { motion } from 'framer-motion';
import { useFirebase } from '@/lib/firebaseContext';
import Notification from '../Notification/notification';
import { useRouter } from 'next/router';

const OurPlan = () => {
  const { userInvestment, user, loading } = useFirebase();
  const userId = user?.uid;

  const [plans, setPlans] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [amount, setAmount] = useState('');
  const [amountError, setAmountError] = useState('');
  const [activating, setActivating] = useState(false);
  const [managingPlan, setManagingPlan] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationType, setNotificationType] = useState('');
  const [notificationMessage, setNotificationMessage] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [isViewingSinglePlanDetails, setIsViewingSinglePlanDetails] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'MANAGE_PLAN'), (snapshot) => {
      const fetchedPlans = snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(plan => plan.enabled);
      setPlans(fetchedPlans);
    });
    return () => unsubscribe();
  }, []);

  // Check if a plan is the currently active plan
  const isActivePlan = (plan) => {
    return userInvestment?.activePlan?.isActive && 
           userInvestment.activePlan.planName === plan.plan;
  };

  if (loading) return <p>Loading plans...</p>;
  if (!userId) return <p>Please login to view investment plans.</p>;

  const handleInvestNow = (plan) => {
    if (userInvestment?.activePlan?.isActive && !isActivePlan(plan)) {
      setNotificationType('error');
      setNotificationMessage('You already have an active investment plan. Please manage your current plan first.');
      setShowNotification(true);
      return;
    }
    
    setSelectedPlan(plan);
    setAmount('');
    setAmountError('');
    setIsViewingSinglePlanDetails(true);
  };

  const handleBackToPlans = () => {
    setSelectedPlan(null);
    setAmount('');
    setAmountError('');
    setIsViewingSinglePlanDetails(false);
  };

  const handleContinue = () => {
    if (!selectedPlan) return;

    const minimumAmount = parseFloat(
      selectedPlan.highlights?.find(h => h.toLowerCase().includes('minimum'))?.split(': ')[1]?.replace(/[^0-9.-]+/g, "")
    ) || 0;

    const maximumAmount = parseFloat(
      selectedPlan.highlights?.find(h => h.toLowerCase().includes('maximum'))?.split(': ')[1]?.replace(/[^0-9.-]+/g, "")
    ) || Infinity;

    const parsedAmount = parseFloat(amount);

    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setAmountError("Please enter a valid amount.");
      return;
    }

    if (parsedAmount < minimumAmount) {
      setAmountError(`Amount must be at least ${minimumAmount.toLocaleString()} USDT.`);
      return;
    }

    if (parsedAmount > (userInvestment?.walletBal || 0)) {
      setNotificationType('error');
      setNotificationMessage('Insufficient wallet balance. Please deposit funds to proceed.');
      setShowNotification(true);
      return;
    }

    if (parsedAmount > maximumAmount) {
      setAmountError(`Amount must not exceed ${maximumAmount.toLocaleString()} USDT.`);
      return;
    }

    setAmountError('');
    activatePlan(parsedAmount);
  };

  const activatePlan = async (parsedAmount) => {
    if (!userId || !selectedPlan || !parsedAmount) {
      setNotificationType('error');
      setNotificationMessage('Please fill all required fields.');
      setShowNotification(true);
      return;
    }

    setActivating(true);
    try {
      const payloadToSend = {
        userId: userId,
        selectedPlan: selectedPlan,
        amount: parsedAmount
      };

      const response = await fetch('/api/activatePlan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payloadToSend)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Unknown error activating plan.' }));
        throw new Error(errorData.message || 'Failed to activate plan');
      }

      await response.json();
      setShowModal(true);
      setIsViewingSinglePlanDetails(false);
      setSelectedPlan(null);
      setAmount('');
      
      // Page reload to update UI
      setTimeout(() => {
        window.location.reload();
      }, 1000);
      
    } catch (error) {
      console.error("Error activating plan:", error);
      setNotificationType('error');
      setNotificationMessage(`An error occurred: ${error.message}`);
      setShowNotification(true);
    } finally {
      setActivating(false);
      setTimeout(() => setShowNotification(false), 5000);
    }
  };

  // New function to manage active plan (pause/stop/resume)
  const manageActivePlan = async (action) => {
    if (!userId || !userInvestment?.activePlan) return;

    setManagingPlan(true);
    try {
      const response = await fetch('/api/manageActivePlan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: userId,
          action: action
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Failed to ${action} plan`);
      }

      const result = await response.json();
      
      setNotificationType('success');
      setNotificationMessage(result.message);
      setShowNotification(true);
      
      setTimeout(() => {
        window.location.reload();
      }, 1000);
      
    } catch (error) {
      console.error(`Error ${action}ing plan:`, error);
      setNotificationType('error');
      setNotificationMessage(`Failed to ${action} plan: ${error.message}`);
      setShowNotification(true);
    } finally {
      setManagingPlan(false);
      setTimeout(() => setShowNotification(false), 5000);
    }
  };

  // NEW: restartPlan function (keeps behavior consistent with other manage functions)
  const restartPlan = async () => {
    if (!userId) return;
    setManagingPlan(true);
    try {
      const response = await fetch('/api/restartPlan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Unknown error restarting plan.' }));
        throw new Error(errorData.message || 'Failed to restart plan');
      }

      const result = await response.json();
      setNotificationType('success');
      setNotificationMessage(result.message || 'Plan restarted successfully.');
      setShowNotification(true);
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      console.error('Error restarting plan:', error);
      setNotificationType('error');
      setNotificationMessage(`Failed to restart plan: ${error.message}`);
      setShowNotification(true);
    } finally {
      setManagingPlan(false);
      setTimeout(() => setShowNotification(false), 5000);
    }
  };

  const closeSuccessModal = () => {
    setShowModal(false);
    router.push('/dashboard');
  };

  const isPlanCompleted = userInvestment?.activePlan?.daysCompleted >= 7;
  const isPlanPaused = userInvestment?.activePlan?.status === 'paused';
  const isPlanActive = userInvestment?.activePlan?.isActive && !isPlanPaused;

  return (
    <div className='space-y-8 p-2 lg:p-8'>
      <h1 className="text-xl lg:text-3xl font-bold text-blue-900 mb-2">Investment Plans</h1>
      <h2 className="text-xs lg:text-sm text-gray-600 mb-4">Choose your favourite plan and start earning now.</h2>

      {/* Active Plan Management Section */}
      {userInvestment?.activePlan && (
        <div className={`border rounded p-6 mb-8 ${
          isPlanCompleted ? 'bg-green-50 border-green-200' :
          isPlanPaused ? 'bg-yellow-50 border-yellow-200' :
          'bg-blue-50 border-blue-200'
        }`}>
          <h3 className="text-lg font-semibold mb-3">
            {isPlanCompleted ? '✅ Plan Completed' : 
             isPlanPaused ? '⏸️ Plan Paused' : 
             '📈 Active Investment Plan'}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-sm"><strong>Plan:</strong> {userInvestment.activePlan.planName}</p>
              <p className="text-sm"><strong>Amount:</strong> {userInvestment.activePlan.amount} USDT</p>
              <p className="text-sm"><strong>Daily ROI:</strong> {Number((userInvestment.activePlan.roiPercent * 100).toFixed(2))}%</p>
            </div>
            <div>
              <p className="text-sm"><strong>Days:</strong> {userInvestment.activePlan.daysCompleted || 0}/7</p>
              <p className="text-sm"><strong>Status:</strong> 
                <span className={`font-semibold ${
                  isPlanCompleted ? 'text-green-600' :
                  isPlanPaused ? 'text-yellow-600' :
                  'text-blue-600'
                }`}>
                  {isPlanCompleted ? ' Completed' : 
                   isPlanPaused ? ' Paused' : 
                   ' Active'}
                </span>
              </p>
              <p className="text-sm"><strong>Total ROI Earned:</strong> 
                {((userInvestment.activePlan.amount || 0) * (userInvestment.activePlan.roiPercent || 0) * (userInvestment.activePlan.daysCompleted || 0)).toFixed(2)} USDT
              </p>
            </div>
          </div>

          {/* Plan Management Buttons */}
          <div className="flex flex-wrap gap-2">
            {!isPlanCompleted && isPlanActive && (
              <>
                <button
                  onClick={() => manageActivePlan('pause')}
                  disabled={managingPlan}
                  className="flex items-center bg-yellow-500 hover:bg-yellow-600 text-white py-2 px-4 rounded text-sm transition"
                >
                  <FiPause className="mr-1" /> Pause Plan
                </button>
                <button
                  onClick={() => manageActivePlan('stop')}
                  disabled={managingPlan}
                  className="flex items-center bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded text-sm transition"
                >
                  <FiStopCircle className="mr-1" /> Stop Plan
                </button>
              </>
            )}
            
            {isPlanPaused && (
              <button
                onClick={() => manageActivePlan('resume')}
                disabled={managingPlan}
                className="flex items-center bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded text-sm transition"
              >
                <FiPlay className="mr-1" /> Resume Plan
              </button>
            )}
            
            {isPlanCompleted && (
              <button
                onClick={() => manageActivePlan('restart')}
                disabled={managingPlan}
                className="flex items-center bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded text-sm transition"
              >
                <FiRefreshCw className="mr-1" /> Restart Same Plan
              </button>
            )}

            {/* Show Restart button only when plan.status === 'stopped' */}
            {userInvestment?.activePlan?.status === 'stopped' && (
              <button
                onClick={restartPlan}
                disabled={managingPlan}
                className="flex items-center bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded text-sm transition"
              >
                <FiRefreshCw className="mr-1" /> Restart Plan
              </button>
            )}
          </div>
        </div>
      )}

      {/* Plan Selection */}
      {isViewingSinglePlanDetails && selectedPlan ? (
        <SinglePlanDetailModal
          plan={selectedPlan}
          amount={amount}
          setAmount={setAmount}
          amountError={amountError}
          activating={activating}
          handleBack={handleBackToPlans}
          handleContinue={handleContinue}
          walletBal={userInvestment?.walletBal}
          hasActivePlan={userInvestment?.activePlan?.isActive}
          isActivePlan={isActivePlan(selectedPlan)}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {plans.map(plan => {
            const active = isActivePlan(plan);
            const isDisabled = !plan.enabled || (userInvestment?.activePlan?.isActive && !active);
            
            const roiHighlight = plan.highlights?.find(h => /roi/i.test(h));
            const roiText = plan.roi ?? (roiHighlight ? roiHighlight.split(': ')[1] : null) ?? 'N/A';

            const durationHighlight = plan.highlights?.find(h => h.toLowerCase().includes('duration'));
            const durationText = durationHighlight ? durationHighlight.split(': ')[1] : (plan.duration ?? 'N/A');

            const minimumHighlight = plan.highlights?.find(h => h.toLowerCase().includes('minimum'));
            const minimumText = minimumHighlight ? minimumHighlight.split(': ')[1] : (plan.minimum ?? 'N/A');

            return (
              <motion.div
                key={plan.id}
                className={`rounded-lg p-6 flex flex-col justify-between transition-all duration-300 ${
                  active 
                    ? 'bg-gradient-to-br from-green-50 to-blue-50 border-2 border-green-400 shadow-xl transform scale-105' 
                    : 'bg-white shadow-lg hover:shadow-2xl'
                }`}
                whileHover={isDisabled ? {} : { scale: active ? 1.05 : 1.02 }}
              >
                {/* Active Plan Badge */}
                {active && (
                  <div className="absolute -top-2 -right-2 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg z-10">
                    ACTIVE
                  </div>
                )}
                
                <div>
                  <h3 className={`text-base lg:text-lg font-semibold ${active ? 'text-green-700' : 'text-blue-900'}`}>
                    {plan.plan}
                  </h3>
                  <p className="text-xs lg:text-sm text-gray-500 mb-2">{plan.subTitle}</p>

                  <div className="flex items-center justify-between mb-3 gap-4">
                    <div>
                      <div className={`text-lg font-bold ${active ? 'text-green-600' : 'text-green-600'}`}>{roiText}</div>
                      <div className="text-xs text-gray-500">ROI</div>
                    </div>
                    <div>
                      <div className={`text-sm font-semibold ${active ? 'text-green-600' : 'text-gray-700'}`}>{durationText}</div>
                      <div className="text-xs text-gray-500">Duration</div>
                    </div>
                    <div>
                      <div className={`text-sm font-medium ${active ? 'text-green-600' : 'text-gray-700'}`}>{minimumText}</div>
                      <div className="text-xs text-gray-500">Minimum</div>
                    </div>
                  </div>

                  <p className="text-sm text-gray-700 mb-3">{plan.description}</p>

                  <ul className="space-y-1">
                    {plan.highlights?.map((highlight, idx) => {
                      const [label, value] = highlight.split(': ');
                      return (
                        <li key={idx} className="flex justify-between text-xs text-gray-600">
                          <span>{label}</span>
                          <span>-</span>
                          <span>{value}</span>
                        </li>
                      );
                    })}

                    {plan.points?.map((point, idx) => point.enabled && (
                      <li key={idx} className="flex items-center text-xs text-gray-600">
                        <FiCheckCircle className="text-green-500 mr-2" />
                        <span>{point.text}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  onClick={() => handleInvestNow(plan)}
                  disabled={isDisabled || active}
                  className={`mt-4 py-2 rounded font-medium transition ${
                    active 
                      ? 'bg-green-500 hover:bg-green-600 text-white shadow-lg cursor-not-allowed' 
                      : isDisabled
                        ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                        : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }`}
                >
                  {active ? 'Manage Active Plan' : 
                   userInvestment?.activePlan?.isActive ? 'Active Plan Running' : 
                   plan.enabled ? 'Invest Now' : 'Unavailable'}
                </button>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Success Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 space-y-4 w-11/12 max-w-md text-center">
            <h3 className="text-xl font-bold text-green-600">Investment Activated!</h3>
            <p className="text-gray-700">Your selected plan has been successfully activated. You can track your earnings in the dashboard.</p>
            <button
              onClick={closeSuccessModal}
              className="mt-4 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded transition"
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      )}

      {/* Notification */}
      {showNotification && (
        <Notification type={notificationType} message={notificationMessage} />
      )}
    </div>
  );
};

// Modal component for single plan details
const SinglePlanDetailModal = ({ plan, amount, setAmount, amountError, activating, handleBack, handleContinue, walletBal, hasActivePlan, isActivePlan }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-auto p-4">
    <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6 space-y-4">
      <h3 className="text-xl font-bold text-blue-900">{plan.plan}</h3>
      <p className="text-sm text-gray-600">{plan.subTitle}</p>
      <p className="text-sm text-gray-700">{plan.description}</p>

      <ul className="space-y-1 mt-2">
        {plan.highlights?.map((highlight, idx) => {
          const [label, value] = highlight.split(': ');
          return (
            <li key={idx} className="flex justify-between text-sm text-gray-600">
              <span>{label}</span>
              <span>{value}</span>
            </li>
          );
        })}
        {plan.points?.map((point, idx) => point.enabled && (
          <li key={idx} className="flex items-center text-sm text-gray-600">
            <FiCheckCircle className="text-green-500 mr-2" />
            <span>{point.text}</span>
          </li>
        ))}
      </ul>

      <div className="mt-4">
        <label className="block text-sm text-gray-700 mb-1">Enter Amount (Wallet: {walletBal} USDT)</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          min="0"
          disabled={hasActivePlan && !isActivePlan}
        />
        {amountError && <p className="text-red-500 text-sm mt-1">{amountError}</p>}
        {hasActivePlan && !isActivePlan && <p className="text-yellow-600 text-sm mt-1">You have an active plan. Complete it first.</p>}
        {isActivePlan && <p className="text-green-600 text-sm mt-1">You can restart this plan after completion.</p>}
      </div>

      <div className="flex justify-between mt-4">
        <button
          onClick={handleBack}
          className="bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 px-4 rounded transition"
        >
          Back
        </button>
        <button
          onClick={handleContinue}
          disabled={activating || (hasActivePlan && !isActivePlan)}
          className={`py-2 px-4 rounded font-medium transition ${
            activating || (hasActivePlan && !isActivePlan) ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          {activating ? 'Activating...' : 
           hasActivePlan && !isActivePlan ? 'Active Plan Running' : 
           isActivePlan ? 'Restart Plan' : 'Continue'}
        </button>
      </div>
    </div>
  </div>
);

export default OurPlan;
