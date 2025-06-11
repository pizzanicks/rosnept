import React, { useState } from 'react';
import { FiCreditCard, FiInfo, FiArrowRight, FiCheckCircle, FiAlertTriangle } from 'react-icons/fi';
import dayjs from 'dayjs';
import { plans } from '../data/plans';
import { motion, AnimatePresence } from "framer-motion";
import { useFirebase } from '@/lib/firebaseContext';
import Notification from '../Notification/notification';
import { useRouter } from 'next/router';

const PlanPurchase = () => {
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

  console.log("dataaaa:", userInvestment);
  

  const slideVariants = {
    initial: { x: "100%", opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: "-100%", opacity: 0 },
    transition: { type: "spring", stiffness: 300, damping: 30 },
  };

  const handleContinue = () => {
    // Ensure minimumAmount is properly parsed as a number
    const minimumAmount = selectedPlan 
      ? parseFloat(selectedPlan.highlights.find(h => h.includes('Minimum'))?.split(': ')[1]?.replace(/[^0-9.-]+/g, "")) 
      : 0;

    console.log("minimum value", minimumAmount);
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
  
    // If valid, clear any error and move to Step 2
    setAmountError("");
    setStep(2);
};
  

  const handleInvestNow = (plan) => {
    setSelectedPlan(plan);
    setStartInvestment(true);
    setStep(1);
  };

  const activatePlan = async () => {
    console.log("selected plan", selectedPlan);
    setActivating(true);
    try {
        const response = await fetch('/api/activatePlan', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userInvestment, selectedPlan, amount }),
        });
  
        if (!response.ok) throw new Error('Failed to actuvate plan');
  
        await response.json();
        setShowModal(true);
  
      } catch (error) {
        console.error(error);
        
        setNotificationMessage('An error occured while activating plan.');
        setNotificationType('error');
        setShowNotification(true);
        setActivating(false);
        setTimeout(() => {
            setShowNotification(false);
        }, 5000);
  
      } finally {
        setActivating(false);
    }
  }

  const closeSuccessModal = () => {
    setShowModal(false);
    router.push('/dashboard');
  }

  return (
    <div className='space-y-8 p-2 lg:p-8'>
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center justify-between border-b border-gray-300 pb-8">
            <div>
            <h1 className="text-xl lg:text-3xl font-bold text-blue-900 mb-8">Investment Plans</h1>
            <h2 className="text-xs lg:text-sm text-gray-600">Choose your favourite plan and start earning now.</h2>
            </div>
        </div>

        {/* Display Plans Cards */}
        {!startInvestment && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {plans.map(plan => (
                <div key={plan.plan} className="bg-white rounded shadow-lg p-6">
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
                        <div className="text-xs text-gray-500">Weekly ROI</div>
                    </div>
                </div>

                <div className="border-t border-gray-300 mt-2 mb-4 lg:mt-6 lg:mb-6" />

                <ul className="space-y-2">
                    {plan.highlights.map((highlight, index) => {
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

        {/* Steps Section */}
        {startInvestment && (
            <div className="w-full overflow-x-hidden px-0 sm:px-6 md:px-10 lg:px-12 py-0 lg:py-6">
                <div className="w-full lg:w-[40vw] max-w-full mx-auto">
                    {/* Go Back to Plans button (NEW SECTION ADDED HERE) */}
                    <div className="mb-4">
                        <button 
                        onClick={() => {
                            setStartInvestment(false);
                            setSelectedPlan(null); // optional: clear selected plan
                            setStep(1); // optional: reset step to first step
                            setAmount('');
                        }}
                        className="text-blue-600 hover:underline text-sm"
                        >
                        ← Go Back to Plans
                        </button>
                    </div>
                    <AnimatePresence mode="wait">
                    {step === 1 && (
                        <motion.div
                        key="step1"
                        variants={slideVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        transition={slideVariants.transition}
                        className="space-y-6 bg-white rounded p-4 sm:p-6 shadow"
                        >
                        {/* Step 1 Content */}
                        <div>
                            <label className="block mb-2 font-medium text-sm lg:text-base">Select Plan</label>
                            <select
                                className="w-full p-2 border rounded text-sm text-gray-700"
                                onChange={(e) => setSelectedPlan(plans.find(p => p.plan === e.target.value))}
                                value={selectedPlan?.plan || ""}
                            >
                            <option value="" disabled>Select a plan</option>
                            {plans.map((plan) => (
                                <option key={plan.plan} value={plan.plan}>{plan.plan}</option>
                            ))}
                            </select>
                        </div>

                        <div>
                            <label className="block mb-2 font-medium text-sm lg:text-base">Enter Amount</label>
                            <div className="flex items-center border px-2 overflow-hidden rounded">
                            <span className="pr-2 border-r">|</span>
                            <input
                                type="number"
                                value={amount}
                                onChange={(e) => {
                                    const inputAmount = parseFloat(e.target.value) || "";
                                    setAmount(inputAmount);
                                }}
                                placeholder="Enter amount"
                                className="flex-1 p-2 outline-none rounded text-sm"
                            />
                            <span className="pl-2 text-sm">USDT</span>
                            </div>
                            <div className="text-xs flex justify-between text-gray-500 mt-1">
                            <span>Minimum: ${selectedPlan ? selectedPlan.highlights.find(h => h.includes('Minimum'))?.split(': ')[1] : '---'}</span>
                            <span>Maximum: ${selectedPlan ? selectedPlan.highlights.find(h => h.includes('Maximum'))?.split(': ')[1] : '---'}</span>
                            </div>
                        </div>

                        {amountError && (
                            <div className="text-xs text-red-500 mt-1">
                                {amountError}
                            </div>
                        )}

                        <div className="border rounded p-4 bg-gray-50 flex items-start gap-4">
                            <FiCreditCard size={24} />
                            <div>
                                <div className="font-medium text-sm lg:text-base">Main Balance</div>
                                <div className="text-xs lg:text-sm text-gray-500">Current Balance: {userInvestment?.walletBal?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {userInvestment?.currency}</div>
                            </div>
                        </div>

                        <button
                            onClick={handleContinue}
                            className="w-full rounded bg-blue-800 hover:bg-blue-700 text-white py-2 text-sm"
                        >
                            Continue
                        </button>

                        <p className="text-xs text-center text-gray-500 mt-2">
                            By continuing this, you agree to our investment terms and conditions.
                        </p>
                        </motion.div>
                    )}

                    {step === 2 && selectedPlan && (
                        <motion.div
                        key="step2"
                        variants={slideVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        transition={slideVariants.transition}
                        className="space-y-6 bg-white p-4 sm:p-6 shadow rounded"
                        >
                        {/* Step 2 Content */}
                        <h2 className="text-lg font-semibold">Confirm Plan Purchase</h2>
                        <ul className="text-sm text-gray-700 divide-y divide-gray-200">
                            <li className="flex justify-between py-2">
                            <span className="font-medium">Plan:</span>
                            <span>{selectedPlan.plan}</span>
                            </li>
                            <li className="flex justify-between py-2">
                            <span className="font-medium">Amount:</span>
                            <span>{amount.toLocaleString()} USDT</span>
                            </li>
                            <li className="flex justify-between py-2">
                            <span className="font-medium">Payment Method:</span>
                            <span>Account Wallet</span>
                            </li>
                            <li className="flex justify-between py-2">
                            <span className="font-medium">Date:</span>
                            <span>{dayjs().format('DD MMM, YYYY')}</span>
                            </li>
                        </ul>

                        <div className="flex flex-col sm:flex-row justify-between gap-4">
                            <button onClick={() => setStep(1)} className="w-full rounded border py-2 text-sm">
                                Go Back
                            </button>
                            <button
                                onClick={activatePlan}
                                className="w-full flex justify-center items-center bg-green-600 rounded hover:bg-green-700 text-white py-2 text-sm"
                            >
                                {activating ? (
                                    <div className="border-2 border-gray-200 border-t-2 border-t-transparent rounded-full w-6 h-6 spinner"></div>
                                ) : (
                                    <div className="text-white text-center h-6">Continue</div>
                                )}
                            </button>
                        </div>
                        </motion.div>
                    )}
                    </AnimatePresence>

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

    </div>
  );
};

export default PlanPurchase;
