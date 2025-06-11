import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaInfoCircle, FaCheckCircle } from "react-icons/fa";
import { useFirebase } from "@/lib/firebaseContext";
import Notification from "../Notification/notification";
import { useRouter } from "next/router";
import Link from "next/link";

const WithdrawRequestPage = () => {
  const [step, setStep] = useState("form");
  const [amount, setAmount] = useState(0);
  const [selectedWallet, setSelectedWallet] = useState(null);
  const { userInvestment, userId, userData, userWallets } = useFirebase();
  const [showNotification, setShowNotification] = useState(false);
  const [notificationType, setNotificationType] = useState('success');
  const [notificationMessage, setNotificationMessage] = useState('N/a');
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleProceed = () => {

    if (parseFloat(amount) > userInvestment?.walletBal) {
        setNotificationMessage('Insufficient balance');
        setNotificationType('warning');
        setShowNotification(true);
        setTimeout(() => {
          setShowNotification(false);
        }, 5000);
        return;
    }

    if (parseFloat(amount) === 0) {
        setNotificationMessage('Please input withdrawal amount');
        setNotificationType('warning');
        setShowNotification(true);
        setTimeout(() => {
          setShowNotification(false);
        }, 5000);
        return;
    }

    if (selectedWallet === null || selectedWallet === undefined) {
        setNotificationMessage('Please select a withdrawal option');
        setNotificationType('warning');
        setShowNotification(true);
        setTimeout(() => {
          setShowNotification(false);
        }, 5000);
        return;
    }

    setStep("preview");
  };

  const handleFinalSubmit = async () => {
    setLoading(true);

    // console.log("data:", amount, selectedWallet, userId);
    
    try {
      const response = await fetch('/api/sendWithdrawReq', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({amount, selectedWallet, userId, name: userData?.fullName}),
      });
  
      if (response.ok) {
        console.log('Profile updated successfully!');

        setNotificationMessage('Withdrawal request sent successfully');
        setNotificationType('success');
        setShowNotification(true);
        setLoading(false);
        setTimeout(() => {
          setShowNotification(false);
          router.push('/dashboard');
        }, 5000);

      } else {
        const errorData = await response.json();
        console.error('withdrawal request failed:', errorData);
        setNotificationMessage('Withdrawal request failed');
        setNotificationType('error');
        setShowNotification(true);
        setLoading(false);
        setTimeout(() => {
            setShowNotification(false);
        }, 5000);
        return errorData;
      }
    } catch (error) {
      console.error('An error occurred:', error);
      setNotificationMessage('An error occurred');
      setNotificationType('error');
      setShowNotification(true);
      setLoading(false);
      setTimeout(() => {
        setShowNotification(false);
      }, 5000);
      return error;
    }
  };

  return (
    <div className="min-h-[calc(75vh-0.2rem)] lg:min-h-[calc(80vh-1rem)] flex items-start lg:items-center justify-center bg-gray-100 p-2 lg:p-4">
      <div className="w-full max-w-md">
        <AnimatePresence mode="wait">
          {step === "form" && (
            <motion.div
              key="form"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 100, damping: 20 }}
              className="bg-white p-6 rounded-lg shadow-lg"
            >
              <h2 className="text-lg lg:text-xl font-medium text-blue-800 mb-2">Withdraw Funds</h2>
              <p className="text-sm text-gray-600 mb-4">Fill in the details to request a withdrawal</p>

              <div className="mb-4">
                <label className="block text-sm text-gray-700 mb-1">Available Balance</label>
                <input
                  type="text"
                  readOnly
                  value={`${userInvestment?.walletBal?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${userInvestment?.currency}`}
                  className="w-full px-3 py-2 border rounded-md bg-gray-100 text-gray-700"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm text-gray-700 mb-1">Amount</label>
                <input
                  type="number"
                //   value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="Enter amount (USD)"
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm text-gray-700 mb-2">Select Withdrawal Method</label>

                {userWallets.length === 0 ? (
                  <div className="p-4 border border-yellow-300 bg-yellow-50 rounded-md text-sm text-gray-700">
                    <p className="mb-3">You don't have any withdrawal methods set up yet.</p>
                    <Link
                      href={'/dashboard/settings'}
                      className="inline-block bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-md text-sm font-medium"
                    >
                      Add Payment Option
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {userWallets.map((wallet, index) => {
                      const isSelected = selectedWallet?.id === wallet.id;

                      return (
                        <div
                          key={index}
                          onClick={() => setSelectedWallet(wallet)}
                          className={`border p-4 rounded-md cursor-pointer relative ${
                            isSelected ? "border-blue-600 bg-blue-50" : "border-gray-300"
                          }`}
                        >
                          <div className="flex justify-between items-center">
                            <div>
                              {wallet.method === "crypto" ? (
                                <>
                                  <p className="text-sm text-gray-700 font-medium uppercase">{wallet.currency}</p>
                                  <p className="text-xs text-gray-600 break-words">{wallet.walletAddress}</p>
                                </>
                              ) : (
                                <>
                                  <p className="text-sm text-gray-700 font-medium uppercase">{wallet.bankName}</p>
                                  <p className="text-xs text-gray-600">Acc No: {wallet.accountNumber}</p>
                                </>
                              )}
                            </div>
                            {isSelected && (
                              <FaCheckCircle className="text-blue-600 text-lg" />
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              <button
                onClick={handleProceed}
                disabled={userWallets.length === 0}
                className={`w-full text-white py-2 px-4 rounded-md transition ${
                  userWallets.length === 0
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-800 hover:bg-blue-700"
                }`}
              >
                {userWallets.length === 0 ? "Add a payment method first" : "Proceed"}
              </button>

            </motion.div>
          )}

          {step === "preview" && (
            <motion.div
              key="preview"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 100, damping: 20 }}
              className="bg-white p-6 rounded-lg shadow-lg"
            >
              <h2 className="text-lg lg:text-xl font-medium text-blue-800 mb-4">Review Withdrawal</h2>

              <div className="space-y-3 mb-4 divide-y text-sm">
                <div className="flex justify-between py-2">
                  <span className="text-gray-600">Amount:</span>
                  <span className="font-semibold text-gray-800">
                    ${Number(amount).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-gray-600">Currency:</span>
                  <span className="font-semibold text-gray-800 uppercase">
                    {selectedWallet?.method === "bank" ? "USD" : selectedWallet?.currency?.toUpperCase()}
                  </span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-gray-600">Destination:</span>
                  <span className="text-gray-800 text-right w-40 break-words font-mono">
                    {selectedWallet?.method === "crypto" ? (
                      selectedWallet?.walletAddress
                    ) : (
                      `${selectedWallet?.bankName} (${selectedWallet?.accountNumber})`
                    )}
                  </span>
                </div>
              </div>


              <button
                onClick={handleFinalSubmit}
                className="w-full bg-blue-800 text-white py-2 px-4 rounded-md hover:bg-blue-700 flex justify-center items-center"
              >
                {loading ? (
                  <div className="border-2 border-gray-200 border-t-2 border-t-transparent rounded-full w-6 h-6 spinner"></div>
                ) : (
                  <div className="text-white text-center h-6">Confirm Withdrawal</div>
                )}
              </button>

              <div className="flex items-start text-xs text-gray-400 mt-8">
                <div className="w-3 lg:w-4 h-3 lg:h-4 flex-shrink-0 mr-2 mt-0.5">
                    <FaInfoCircle className="w-full h-full" />
                </div>
                <p>
                    Please make sure your wallet or bank account details are accurate in your account settings.
                    Double-check to avoid loss of funds.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

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

export default WithdrawRequestPage;
