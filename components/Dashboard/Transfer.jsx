import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiArrowRight, FiCheckCircle, FiArrowLeft } from "react-icons/fi";
import { Dialog } from "@headlessui/react";
import { useFirebase } from "@/lib/firebaseContext";
import Link from "next/link";
import { AiOutlineInfoCircle } from "react-icons/ai";
import Notification from "../Notification/notification";
import { useRouter } from "next/router";

export default function FundTransfer() {
  const { userInvestment, userId } = useFirebase();

  const [step, setStep] = useState(1);
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [code, setCode] = useState("");
  const [codeModalOpen, setCodeModalOpen] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationType, setNotificationType] = useState('success');
  const [notificationMessage, setNotificationMessage] = useState('N/a');
  const [codeSent, setCodeSent] = useState(101010);
  const [loading, setLoading] = useState(false);
  const [generatingCode, setGeneratingCode] = useState(false);
  const router = useRouter();

  const next = () => setStep((s) => s + 1);
  const back = () => setStep((s) => s - 1);

  const sendEmailCode = () => {
    if (userInvestment?.walletBal < amount) {
      setNotificationMessage('Insufficient Balance.');
      setNotificationType('warning');
      setShowNotification(true);

      setTimeout(() => {
        setShowNotification(false);
      }, 5000);
      return;
    }

    setGeneratingCode(true);
    setTimeout(() => {
      setGeneratingCode(false);
      setCodeModalOpen(true)
    }, 4000);
  }

  const handleCodeConfirm = async (e) => {
    e.preventDefault();

    if (code.length !== 6) {

      setNotificationMessage('Verification code must be 6-digits.');
      setNotificationType('warning');
      setShowNotification(true);

      setTimeout(() => {
        setShowNotification(false);
      }, 5000);

      return;
    };

    if (parseInt(code) !== codeSent) {
      setNotificationMessage('Invalid transfer code.');
      setNotificationType('warning');
      setShowNotification(true);

      setTimeout(() => {
        setShowNotification(false);
      }, 5000);

      return;
    }
  
    try {
      setLoading(true);
      const response = await fetch('/api/transferFund', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ recipient, amount, userId }),
      });
  
      const result = await response.json();
  
      if (response.ok) {
        console.log('Transfer successful:', result);
        setCodeModalOpen(false);
        setNotificationMessage('Fund transferred succesfully.');
        setNotificationType('success');
        setShowNotification(true);
        setStep(1);
        setAmount('');
        setRecipient('');
        setCode('');
        setLoading(false);
        
        setTimeout(() => {
          setShowNotification(false);
          // router.push('/dashboard');
        }, 5000);
  
      } else {
        let message = 'Something went wrong.';
        
        switch (response.status) {
          case 400:
            message = result.message || 'Insufficient funds.';
            break;
          case 404:
            message = result.message || 'Sender or recipient account not found.';
            break;
          case 422:
            message = result.message || 'Invalid recipient username.';
            break;
          case 500:
            message = 'Server error. Please try again later.';
            break;
          default:
            message = result.message || 'Unexpected error occurred.';
        }
  
        console.error('Fund transfer error:', result);
  
        setNotificationMessage(message);
        setNotificationType('error');
        setShowNotification(true);
        setLoading(false);
  
        setTimeout(() => {
          setShowNotification(false);
        }, 5000);
      }
    } catch (error) {
      console.error('An error occurred:', error);
      setNotificationMessage('Network error. Please check your connection.');
      setNotificationType('error');
      setShowNotification(true);
      setLoading(false);
  
      setTimeout(() => {
        setShowNotification(false);
      }, 5000);
    }
  };
  

  return (
    <div className="space-y-8 p-2 lg:p-8 min-h-[calc(75vh-0.2rem)] lg:min-h-[calc(82vh-0rem)] flex items-start lg:items-center justify-center">

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ x: 300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="w-full max-w-xl mx-auto bg-white rounded-lg shadow-md p-6 space-y-6"
          >
            <h2 className="text-lg font-medium lg:font-semibold text-blue-900">Fund Transfer</h2>

            <div>
              <label className="block text-sm text-gray-600 mb-1">Available Balance</label>
              <input
                disabled
                value={`${Number(userInvestment?.walletBal).toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                })} ${userInvestment?.currency}`}
                className="w-full px-4 py-2 border rounded bg-gray-100 text-gray-500 text-sm lg:text-base"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-1">Recipient Username</label>
              <input
                type="text"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                className="w-full px-4 py-2 border rounded text-sm lg:text-base focus:border-blue-500 focus:ring-blue-500 focus:outline-none"
                placeholder="e.g., john_doe"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-1">Amount</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full px-4 py-2 border rounded text-sm lg:text-base focus:border-blue-500 focus:ring-blue-500 focus:outline-none"
                placeholder="e.g., 50"
              />
            </div>

            <button
              onClick={next}
              disabled={!recipient || !amount}
              className="w-full bg-blue-800 hover:bg-blue-700 text-white text-sm lg:text-base py-2 px-4 rounded flex justify-center items-center gap-2 disabled:opacity-50"
            >
              Proceed <FiArrowRight />
            </button>

            <div className="flex items-start gap-2 mb-4">
                <div className="flex-shrink-0 mt-1">
                    <AiOutlineInfoCircle className="text-lg h-4 w-4" />
                </div>
                <div className="flex-grow">
                    <p className="text-xs md:text-sm text-gray-500">
                      Ensure the recipient&apos;s username (case-sensitive) and transfer details are correct. You&apos;ll be notified upon completion.
                    </p>
                </div>
            </div>


          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ x: 300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="w-full max-w-xl mx-auto bg-white rounded-lg shadow-md p-6 space-y-6"
          >
            <h2 className="text-lg font-medium lg:font-semibold text-blue-900">Confirm Transfer</h2>
            <h3 className="text-sm text-gray-600">Please verify the information below</h3>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between border-b py-1">
                <span className="text-gray-600">Recipient</span>
                <span className="font-medium">{recipient}</span>
              </div>
              <div className="flex justify-between border-b py-1">
                <span className="text-gray-600">Amount</span>
                <span className="font-medium">
                  {Number(amount || 0).toLocaleString()} {userInvestment?.currency}
                </span>
              </div>
              <div className="flex justify-between border-b py-1">
                <span className="text-gray-600">Wallet Balance</span>
                <span className="font-medium">
                  {Number(userInvestment?.walletBal || 0).toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}{" "}
                  {userInvestment?.currency}
                </span>
              </div>
            </div>

            <div className="flex justify-between gap-2">
              <button
                onClick={back}
                className="w-full text-sm lg:text-base bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded flex justify-center items-center gap-2"
              >
                <FiArrowLeft /> Back
              </button>

              <button
                onClick={sendEmailCode}
                className="w-full text-sm lg:text-base bg-blue-800 hover:bg-blue-700 text-white py-2 px-4 rounded flex justify-center items-center"
              >
                {generatingCode ? (
                  <div className="border-2 border-gray-200 border-t-2 border-t-transparent rounded-full w-6 h-6 spinner"></div>
                ) : (
                  <div className="text-white text-center h-6 flex justify-center items-center gap-2">Continue <FiArrowRight /></div>
                )}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Transfer Code Modal */}
      <Dialog open={codeModalOpen} onClose={() => setCodeModalOpen(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/40" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="bg-white w-full max-w-md rounded p-6 space-y-4">
            <Dialog.Title className="text-lg font-medium lg:font-semibold text-blue-800">Enter Transfer Code</Dialog.Title>
            <p className="text-xs lg:text-sm text-gray-600">
                Enter the 6-digit code sent to your email.
            </p>

            <input
                type="text"
                value={code}
                onChange={(e) => {
                    const input = e.target.value;
                    if (/^\d{0,6}$/.test(input)) {
                    setCode(input);
                    }
                }}
                className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
                placeholder="6-digit code"
            />
            <button
              onClick={handleCodeConfirm}
              disabled={code.length !== 6}
              className="w-full flex justify-center items-center text-sm lg:text-base bg-blue-800 hover:bg-blue-700 text-white py-2 px-4 rounded"
            >
              {loading ? (
                <div className="border-2 border-gray-200 border-t-2 border-t-transparent rounded-full w-6 h-6 spinner"></div>
              ) : (
                <div className="text-white text-center h-6">Confirm Transfer</div>
              )}
            </button>
          </Dialog.Panel>
        </div>
      </Dialog>

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
}
