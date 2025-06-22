// components/Dashboard/OurPlan.js
import React, { useState, useEffect } from 'react';
import { FiCreditCard, FiInfo, FiArrowRight, FiCheckCircle, FiAlertTriangle } from 'react-icons/fi';
import dayjs from 'dayjs';
import { collection, onSnapshot } from 'firebase/firestore';
import db from '@/lib/firebase';
import { motion, AnimatePresence } from 'framer-motion';
// --- FIX: Import userId directly from useFirebase ---
import { useFirebase } from '@/lib/firebaseContext';
// --- END FIX ---
import Notification from '../Notification/notification';
import { useRouter } from 'next/router';

const PlanPurchase = () => {
  const [plans, setPlans] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [amount, setAmount] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [amountError, setAmountError] = useState("");
  // --- FIX: Destructure userId here ---
  const { userInvestment, userId } = useFirebase(); // Get userId alongside userInvestment
  // --- END FIX ---
  const [activating, setActivating] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationType, setNotificationType] = useState('');
  const [notificationMessage, setNotificationMessage] = useState('');
  const router = useRouter();

  const [isViewingSinglePlanDetails, setIsViewingSinglePlanDetails] = useState(false);


  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'MANAGE_PLAN'), (snapshot) => {
      const fetchedPlans = snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(plan => plan.enabled);
      setPlans(fetchedPlans);
    });

    return () => unsubscribe();
  }, []);

  const slideVariants = {
    initial: { x: "100%", opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: "-100%", opacity: 0 },
    transition: { type: "spring", stiffness: 300, damping: 30 },
  };

  const handleInvestNow = (plan) => {
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

    const minimumAmount = parseFloat(selectedPlan.highlights.find(h => h.includes('Minimum'))?.split(': ')[1]?.replace(/[^0-9.-]+/g, "")) || 0;
    const maximumAmount = parseFloat(selectedPlan.highlights.find(h => h.includes('Maximum'))?.split(': ')[1]?.replace(/[^0-9.-]+/g, "")) || Infinity;

    const parsedAmount = parseFloat(amount);

    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setAmountError("Please enter a valid amount.");
      return;
    }

    if (parsedAmount < minimumAmount) {
      setAmountError(`Amount must be at least ${minimumAmount.toLocaleString()} USDT.`);
      return;
    }
    
    if (parsedAmount > userInvestment?.walletBal) {
      setNotificationType('error');
      setNotificationMessage('Insufficient wallet balance. Please deposit funds to proceed.');
      setShowNotification(true);
      return; // Stop the investment process for now, show notification.
    }

    if (parsedAmount > maximumAmount) {
      setAmountError(`Amount must not exceed ${maximumAmount.toLocaleString()} USDT.`);
      return;
    }

    setAmountError("");
    activatePlan(); // Directly activate if all checks pass
  };

  const activatePlan = async () => {
    // --- Add a check here to ensure userId is available before calling API ---
    if (!userId) {
      setNotificationType('error');
      setNotificationMessage('User not authenticated. Please log in again.');
      setShowNotification(true);
      return;
    }

    if (!selectedPlan || !amount || parseFloat(amount) <= 0) {
      setNotificationType('error');
      setNotificationMessage('Please select a plan and enter a valid amount.');
      setShowNotification(true);
      return;
    }

    const parsedAmount = parseFloat(amount);

    setActivating(true);
    try {
      const response = await fetch('/api/activatePlan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // --- CRITICAL FIX: Use the top-level userId from useFirebase ---
        body: JSON.stringify({ userId: userId, selectedPlan, amount: parsedAmount }),
        // --- END FIX ---
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Unknown error activating plan.' }));
        throw new Error(errorData.message || 'Failed to activate plan');
      }

      await response.json();
      setShowModal(true);
      setIsViewingSinglePlanDetails(false);
      setAmount('');
      setSelectedPlan(null);
    } catch (error) {
      console.error("Error activating plan:", error);
      setNotificationMessage(`An error occurred while activating plan: ${error.message}`);
      setNotificationType('error');
      setShowNotification(true);
    } finally {
      setActivating(false);
      setTimeout(() => {
        setShowNotification(false);
      }, 5000);
    }
  };

  const closeSuccessModal = () => {
    setShowModal(false);
    router.push('/dashboard');
  };

  return (
    <div className='space-y-8 p-2 lg:p-8'>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center justify-between border-b border-gray-300 pb-8">
        <div>
          <h1 className="text-xl lg:text-3xl font-bold text-blue-900 mb-8">Investment Plans</h1>
          <h2 className="text-xs lg:text-sm text-gray-600">Choose your favourite plan and start earning now.</h2>
        </div>
      </div>

      {userInvestment?.activePlan?.isActive && (
        <div className="bg-blue-50 border border-blue-200 rounded p-4 mb-8">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">Your Active Plan</h3>
          <p className="text-sm text-gray-600 mb-1">Plan: {userInvestment.activePlan.planName}</p>
          <p className="text-sm text-gray-600 mb-1">Amount: {userInvestment.activePlan.amount} USDT</p>
          <p className="text-sm text-gray-600 mb-1">Daily ROI: 4%</p>
          <p className="text-sm text-gray-600 mb-1">Days Completed: {userInvestment.activePlan.daysCompleted}</p>
          {userInvestment.activePlan.daysCompleted >= 7 && (
            <button
              className="mt-3 bg-green-600 text-white py-2 px-4 rounded"
              onClick={() => handleInvestNow(plans.find(p => p.plan === userInvestment.activePlan.planName))}
            >
              Restart Investment Cycle
            </button>
          )}
        </div>
      )}

      {isViewingSinglePlanDetails && selectedPlan ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-lg shadow-lg p-6 space-y-4"
        >
          <button onClick={handleBackToPlans} className="text-blue-600 hover:underline mb-4 text-sm">← Back to all plans</button>

          <h3 className="text-xl lg:text-2xl font-bold text-blue-900">{selectedPlan.plan}</h3>
          <p className="text-sm lg:text-base text-gray-600">{selectedPlan.subTitle}</p>
          <p className="text-gray-700 mt-2">{selectedPlan.description}</p>

          <div className="border-t border-gray-300 my-4" />

          <div className="flex justify-between items-center text-sm lg:text-base">
            <div>
              <div className="font-bold">{selectedPlan.roi}</div>
              <div className="text-gray-500">Weekly ROI</div>
            </div>
            <div>
              <span className="font-bold">
                {selectedPlan.highlights.find(h => h.includes('Duration'))?.split(': ')[1]}
              </span>
              <div className="text-gray-500">Duration</div>
            </div>
          </div>

          <div className="border-t border-gray-300 my-4" />

          <ul className="space-y-2">
            {selectedPlan.highlights?.map((highlight, index) => {
              const [label, value] = highlight.split(': ');
              return (
                <li key={index} className="flex justify-between text-sm text-gray-600">
                  <span>{label}</span>
                  <span>-</span>
                  <span>{value}</span>
                </li>
              );
            })}
            {selectedPlan.points?.map((point, index) => (
              point.enabled && (
                <li key={`point-${index}`} className="flex items-center text-sm text-gray-600">
                  <FiCheckCircle className="text-green-500 mr-2" />
                  <span>{point.text}</span>
                </li>
              )
            ))}
          </ul>

          <div className="border-t border-gray-300 my-4" />

          <div className="space-y-3">
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
              Enter Investment Amount (USDT)
            </label>
            <input
              type="number"
              id="amount"
              value={amount}
              onChange={(e) => {
                setAmount(e.target.value);
                setAmountError("");
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder={`Min: ${parseFloat(selectedPlan.highlights.find(h => h.includes('Minimum'))?.split(': ')[1]?.replace(/[^0-9.-]+/g, "")) || 0} USDT`}
              min={parseFloat(selectedPlan.highlights.find(h => h.includes('Minimum'))?.split(': ')[1]?.replace(/[^0-9.-]+/g, ""))}
              disabled={activating}
            />
            {amountError && <p className="text-red-500 text-xs mt-1">{amountError}</p>}
            
            <p className="text-sm text-gray-600">
              Your Wallet Balance:{" "}
              <span className="font-semibold text-blue-800">
                {userInvestment?.walletBal?.toLocaleString() || "0"} USDT
              </span>
            </p>

            <div className="flex space-x-4 mt-6">
                <button
                    onClick={handleContinue}
                    className={`flex-1 py-3 px-4 rounded-md font-medium text-white transition ${activating ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
                    disabled={activating}
                >
                    {activating ? (
                        <div className="flex items-center justify-center">
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                            Activating...
                        </div>
                    ) : (
                        "Confirm Investment"
                    )}
                </button>
            </div>
            {showNotification && notificationType === 'error' && notificationMessage.includes('Insufficient') && (
                <button
                    onClick={() => router.push('/dashboard/deposit')}
                    className="mt-4 w-full py-3 px-4 rounded-md font-medium text-blue-700 bg-blue-100 hover:bg-blue-200 transition"
                >
                    Go to Deposit Page
                </button>
            )}
          </div>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {plans.map(plan => (
            <div key={plan.id} className="bg-white rounded shadow-lg p-6">
              <h3 className="text-base lg:text-lg font-semibold text-blue-900">{plan.plan}</h3>
              <p className="text-xs lg:text-sm text-gray-600">{plan.subTitle}</p>
              <div className="border-t border-gray-300 mt-4 mb-2 lg:mt-6 lg:mb-4" />
              <div className='w-full flex justify-between items-center'>
                <div className="my-4">
                  <div className="text-base lg:text-xl font-bold text-blue-900">{plan.roi}</div>
                  <div className="text-xs text-gray-500">Weekly ROI</div>
                </div>
                <div className="my-4">
                  <span className="text-base lg:text-xl font-bold text-blue-900">
                    {plan.highlights.find(h => h.includes('Duration'))?.split(': ')[1]}
                  </span>
                  <div className="text-xs text-gray-500">Duration</div>
                </div>
              </div>
              <div className="border-t border-gray-300 mt-2 mb-4 lg:mt-6 lg:mb-6" />
              <ul className="space-y-2">
                {plan.highlights?.map((highlight, index) => {
                  const [label, value] = highlight.split(': ');
                  return (
                    <li key={index} className="flex justify-between text-xs text-gray-600">
                      <span>{label}</span>
                      <span>-</span>
                      <span>{value}</span>
                    </li>
                  );
                })}
              </ul>
              <button
                onClick={() => handleInvestNow(plan)}
                className={`${plan.buttonStyle} w-full mt-4 py-2 rounded font-medium text-sm lg:text-base`}
              >
                Invest Now
              </button>
            </div>
          ))}
        </div>
      )}

      {showNotification && (
        <Notification
          type={notificationType}
          message={notificationMessage}
          onClose={() => setShowNotification(false)}
          show={true}
        />
      )}

      {/* Success Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white p-6 shadow-lg rounded text-center w-full max-w-sm space-y-4">
            <FiCheckCircle size={40} className="text-green-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Success!</h3>
            <p className="text-sm text-gray-600">Your investment plan has been activated successfully.</p>
            <button
              onClick={closeSuccessModal}
              className="text-sm rounded bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 w-full"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlanPurchase;
