// components/Dashboard/OurPlan.jsx
import React, { useState, useEffect } from 'react';
import { FiCheckCircle } from 'react-icons/fi';
import { collection, onSnapshot } from 'firebase/firestore';
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

  if (loading) return <p>Loading plans...</p>;
  if (!userId) return <p>Please login to view investment plans.</p>;

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

    const minimumAmount = parseFloat(
      selectedPlan.highlights?.find(h => h.includes('Minimum'))?.split(': ')[1]?.replace(/[^0-9.-]+/g, "")
    ) || 0;

    const maximumAmount = parseFloat(
      selectedPlan.highlights?.find(h => h.includes('Maximum'))?.split(': ')[1]?.replace(/[^0-9.-]+/g, "")
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
    if (!userId) {
      setNotificationType('error');
      setNotificationMessage('User not authenticated. Please log in again.');
      setShowNotification(true);
      return;
    }

    if (!selectedPlan || !parsedAmount) {
      setNotificationType('error');
      setNotificationMessage('Please select a plan and enter a valid amount.');
      setShowNotification(true);
      return;
    }

    setActivating(true);
    try {
      const payloadToSend = {
        userInvestment: { userId: userId },
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

  const closeSuccessModal = () => {
    setShowModal(false);
    router.push('/dashboard');
  };

  return (
    <div className='space-y-8 p-2 lg:p-8'>
      <h1 className="text-xl lg:text-3xl font-bold text-blue-900 mb-2">Investment Plans</h1>
      <h2 className="text-xs lg:text-sm text-gray-600 mb-4">Choose your favourite plan and start earning now.</h2>

      {userInvestment?.activePlan?.isActive && (
        <div className="bg-blue-50 border border-blue-200 rounded p-4 mb-8">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">Your Active Plan</h3>
          <p className="text-sm text-gray-600 mb-1">Plan: {userInvestment.activePlan.planName}</p>
          <p className="text-sm text-gray-600 mb-1">Amount: {userInvestment.activePlan.amount} USDT</p>
          <p className="text-sm text-gray-600 mb-1">Daily ROI: 4%</p>
          <p className="text-sm text-gray-600 mb-1">Days Completed: {userInvestment.activePlan.daysCompleted}</p>
          {userInvestment.activePlan.daysCompleted >= 7 && (
            <button
              className="mt-3 bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition"
              onClick={() => handleInvestNow(plans.find(p => p.plan === userInvestment.activePlan.planName))}
            >
              Restart Investment Cycle
            </button>
          )}
        </div>
      )}

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
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {plans.map(plan => (
            <motion.div
              key={plan.id}
              className="bg-white rounded-lg shadow-lg p-6 flex flex-col justify-between hover:shadow-2xl transition-all duration-300"
              whileHover={{ scale: 1.05 }}
            >
              <div>
                <h3 className="text-base lg:text-lg font-semibold text-blue-900">{plan.plan}</h3>
                <p className="text-xs lg:text-sm text-gray-500 mb-2">{plan.subTitle}</p>
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
                disabled={!plan.enabled || activating}
                className={`mt-4 py-2 rounded font-medium transition ${
                  plan.enabled
                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                    : 'bg-gray-300 text-gray-600 cursor-not-allowed'
                }`}
              >
                {plan.enabled ? 'Invest Now' : 'Unavailable'}
              </button>
            </motion.div>
          ))}
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
const SinglePlanDetailModal = ({ plan, amount, setAmount, amountError, activating, handleBack, handleContinue, walletBal }) => (
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
        />
        {amountError && <p className="text-red-500 text-sm mt-1">{amountError}</p>}
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
          disabled={activating}
          className={`py-2 px-4 rounded font-medium transition ${
            activating ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          {activating ? 'Activating...' : 'Continue'}
        </button>
      </div>
    </div>
  </div>
);

export default OurPlan;
