// components/Dashboard/OurPlan.js
import React, { useState, useEffect } from 'react';
import { FiCreditCard, FiInfo, FiArrowRight, FiCheckCircle, FiAlertTriangle } from 'react-icons/fi';
import dayjs from 'dayjs';
import { collection, onSnapshot } from 'firebase/firestore';
import db from '@/lib/firebase'; // <--- VERIFY THIS PATH ON YOUR CLIENT PROJECT'S FILE SYSTEM
import { motion, AnimatePresence } from 'framer-motion';
import { useFirebase } from '@/lib/firebaseContext';
import Notification from '../Notification/notification'; // <--- VERIFY THIS PATH ON YOUR CLIENT PROJECT'S FILE SYSTEM
import { useRouter } from 'next/router';

const PlanPurchase = () => {
  const [plans, setPlans] = useState([]);
  const [step, setStep] = useState(1);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [amount, setAmount] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [startInvestment, setStartInvestment] = useState(false);
  const [amountError, setAmountError] = useState("");
  const { userInvestment } = useFirebase();
  const [activating, setActivating] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationType, setNotificationType] = useState('success');
  const [notificationMessage, setNotificationMessage] = useState('N/a');
  const router = useRouter();

  useEffect(() => {
    // --- CRITICAL FIX: Changed collection name from 'plans' to 'MANAGE_PLAN' ---
    const unsubscribe = onSnapshot(collection(db, 'MANAGE_PLAN'), (snapshot) => {
      const fetchedPlans = snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(plan => plan.enabled); // Only show plans that are marked as 'enabled'
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

  const handleContinue = () => {
    const minimumAmount = selectedPlan 
      ? parseFloat(selectedPlan.highlights.find(h => h.includes('Minimum'))?.split(': ')[1]?.replace(/[^0-9.-]+/g, "")) 
      : 0;

    const parsedAmount = parseFloat(amount);

    if (isNaN(parsedAmount) || parsedAmount < minimumAmount || parsedAmount > userInvestment?.walletBal) {
      setAmountError(
        `Amount must be at least ${minimumAmount.toLocaleString()} USDT and not greater than ${
          typeof userInvestment?.walletBal === 'number'
            ? userInvestment.walletBal.toLocaleString()
            : 'N/A'
        } USDT`
      );
      return;
    }

    setAmountError("");
    setStep(2);
  };

  const handleInvestNow = (plan) => {
    setSelectedPlan(plan);
    setStartInvestment(true);
    setStep(1);
  };

  const activatePlan = async () => {
    setActivating(true);
    try {
      const response = await fetch('/api/activatePlan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userInvestment, selectedPlan, amount }),
      });

      if (!response.ok) throw new Error('Failed to activate plan');

      await response.json();
      setShowModal(true);
    } catch (error) {
      setNotificationMessage('An error occurred while activating plan.');
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

      {/* ✅ Show Active Plan if exists */}
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

      {!startInvestment && (
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
                {/* Ensure 'highlights' is an array before mapping */}
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
