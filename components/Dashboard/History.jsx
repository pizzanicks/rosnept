// components/Dashboard/History.jsx
import { useState } from 'react';
import { FiArrowDownLeft, FiArrowUpRight, FiChevronRight, FiX, FiCreditCard } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion'; // Added AnimatePresence for modal exit animation
import { useFirebase } from '@/lib/firebaseContext';
import Link from 'next/link';
// Removed dayjs as your formatFirestoreDate handles it, but consider using dayjs for consistency
// import dayjs from 'dayjs'; // You can re-add this if you prefer dayjs for all date formatting

const TransactionHistory = ({ limit = 3 }) => { // Changed default limit to 3 to match slice(0, 3)
  const [selected, setSelected] = useState(null);

  const openModal = (txn) => setSelected(txn);
  const closeModal = () => setSelected(null);

  const { userHistory } = useFirebase();
  console.log("TransactionHistory component received data:", userHistory); // Keep this for debugging

  // Defensive check for userHistory
  const transactionsToDisplay = Array.isArray(userHistory) ? userHistory : [];

  // Sort and slice transactions
  const limitedTransactions = transactionsToDisplay
    .sort((a, b) => {
      // Robust date comparison: handle Firebase Timestamps or other date formats
      const dateA = typeof a.createdAt?.toDate === 'function' ? a.createdAt.toDate() : new Date(a.createdAt);
      const dateB = typeof b.createdAt?.toDate === 'function' ? b.createdAt.toDate() : new Date(b.createdAt);
      return dateB.getTime() - dateA.getTime(); // Sort descending by date
    })
    .slice(0, limit); // Apply limit

  const formatFirestoreDate = (dateValue) => {
    let dateObj;

    if (!dateValue) return "Invalid date";

    // Check if it's a Firebase Timestamp (has toDate function)
    if (typeof dateValue.toDate === "function") {
      dateObj = dateValue.toDate();
    } else if (typeof dateValue === "string" || typeof dateValue === "number") {
      // Try to parse string or number (timestamp) into a Date object
      dateObj = new Date(dateValue);
    } else if (dateValue instanceof Date) {
      // Already a JavaScript Date object
      dateObj = dateValue;
    } else {
      return "Invalid date format"; // Fallback for unexpected types
    }

    // Check if the parsed date is valid
    if (isNaN(dateObj.getTime())) {
        return "Invalid date";
    }

    return dateObj.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className='px-2 lg:px-8 mt-2 lg:mt-0'>
      <div className="bg-white shadow rounded px-2 lg:px-4 py-4">
        <div className="flex justify-between items-center mb-4 px-2">
          <h2 className="text-base lg:text-lg font-medium lg:font-bold">Recent Transactions</h2>
          {/* Only show "View All" if there are transactions */}
          {limitedTransactions.length > 0 && (
            <Link href={'/dashboard/transactions'} className="text-sm text-blue-600 hover:underline">View All →</Link>
          )}
        </div>

        <div className="space-y-4">
          {limitedTransactions.length === 0 ? (
            <p className="text-sm text-gray-500 text-center flex justify-center items-center h-24 lg:h-38">No transactions found.</p>
          ) : (
            limitedTransactions.map((txn) => (
              <motion.div
                key={txn.id}
                className="flex items-start lg:items-center justify-between rounded hover:bg-gray-50 p-3 cursor-pointer"
                onClick={() => openModal(txn)}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                {/* Icon */}
                <div className="relative">
                  <div
                    className={`w-10 h-10 flex items-center justify-center rounded-full
                    ${txn.type === 'deposit' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}
                  >
                    {txn.type === 'deposit' ? <FiArrowDownLeft /> : <FiArrowUpRight />}
                  </div>
                  <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-[2px]">
                    <FiCreditCard className="text-gray-400 text-xs" />
                  </div>
                </div>

                {/* Description */}
                <div className="flex-1 ml-4">
                  <div className="font-medium text-sm">
                    {txn.type === 'deposit' ? 'Deposit' : 'Withdrawal'} with {txn.selectedWallet?.method || 'account wallet'}
                  </div>
                  <div className="text-xs text-gray-500 capitalize">
                    {formatFirestoreDate(txn.createdAt)} · {txn.status}
                  </div>
                </div>

                {/* Amount */}
                <div className="text-right">
                  <div
                    className={`font-bold text-sm ${
                      txn.type === 'deposit' ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    {txn.type === 'deposit' ? '+' : '-'}
                    {Number(txn.amount).toLocaleString()} USDT
                  </div>
                  {/* Optional: secondary amount display, ensure it's not redundant if same as above */}
                  {/* <div className="text-xs text-gray-400">
                    {Number(txn.amount).toLocaleString()} USDT
                  </div> */}
                </div>

                <FiChevronRight className="ml-3 text-gray-400" />
              </motion.div>
            ))
          )}
        </div>


        {/* Modal */}
        <AnimatePresence> {/* Wrap modal with AnimatePresence for exit animations */}
          {selected && (
            <motion.div
              className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 px-4 modal-pop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div
                className="bg-white w-full max-w-lg p-6 lg:p-10 shadow-xl relative rounded-xl"
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.95 }}
                transition={{ duration: 0.3 }}
              >
                {/* Close Button */}
                <button
                  className="absolute top-3 right-3 text-gray-500 hover:text-black"
                  onClick={closeModal}
                >
                  <FiX size={20} />
                </button>

                {/* Title */}
                <h2 className="text-sm text-gray-600 mb-4">Order ID: <span className='text-gray-800 font-medium'>#{selected.id}</span></h2>

                {/* Summary Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 flex items-center justify-center rounded-full
                      ${selected.type === 'deposit' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}
                    >
                      {selected.type === 'deposit' ? <FiArrowDownLeft size={18} /> : <FiArrowUpRight size={18} />}
                    </div>
                    <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 text-gray-600">
                      <FiCreditCard size={18} />
                    </div>
                    <div>
                      <div className="text-lg font-semibold text-blue-900">{(Number(selected.amount) || 0).toLocaleString()} USDT</div>
                      <div className="text-xs text-gray-500">{formatFirestoreDate(selected.createdAt)}</div>
                    </div>
                  </div>
                  <div>
                    <span
                      className={`text-xs font-medium px-3 py-1 rounded-full capitalize ${
                        selected.status === 'completed'
                          ? 'bg-green-100 text-green-700'
                          : selected.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {selected.status}
                    </span>
                  </div>
                </div>

                {/* Divider */}
                <hr className="my-4" />

                {/* Deposit Details Section */}
                <h3 className="text-sm text-gray-500 mb-3">Deposit Details</h3>
                <div className="flex flex-col sm:flex-row justify-between gap-4">
                  {/* Left Column */}
                  <div>
                    <p className="text-xs text-gray-500 mb-1">
                      {selected.type === 'deposit' ? 'Deposit Amount' : 'Withdraw Amount'}
                    </p>
                    <div className="text-lg font-bold text-blue-900">{Number(selected.amount).toLocaleString()} USDT</div>
                  </div>

                  {/* Right Column */}
                  <div>
                    <p className="text-xs text-gray-500 mb-1">{selected.type === "withdrawal" ? "Withdraw Via" : "Deposit Via"}</p>
                    <div className="text-sm text-gray-700 capitalize">
                      {selected.selectedWallet?.method && selected.selectedWallet?.currency
                        ? `${selected.selectedWallet.method} · ${selected.selectedWallet.currency}`
                        : 'Account wallet · USDT'}
                    </div>
                  </div>
                </div>

                {/* Second Row Details */}
                <div className="mt-4 space-y-4">
                  {selected?.type === "withdrawal" && (
                    <div>
                      <p className="text-xs text-gray-500">Payment To</p>
                      <div className="text-sm text-gray-700 break-all">
                        {selected.selectedWallet?.wallet || selected.recipient || "User account"}
                      </div>
                    </div>
                  )}

                  {selected?.type === "deposit" && (
                    <div>
                      <p className="text-xs text-gray-500">Payment From</p>
                      <div className="text-sm text-gray-700 break-all">
                        {selected.selectedWallet?.method === "crypto"
                          ? "Crypto wallet"
                          : selected.selectedWallet?.method
                          ? "Bank account"
                          : "Account wallet"}
                      </div>
                    </div>
                  )}

                  <div>
                    <p className="text-xs text-gray-500">Reference</p>
                    <div className="text-sm text-gray-700">Not available</div>
                  </div>
                </div>

                {/* Divider */}
                <hr className="my-4" />

                {/* Notification */}
                <p className="text-xs text-gray-500">
                  This transaction has been carried out on the <span className="font-medium text-gray-700">{formatFirestoreDate(selected.createdAt)}</span>
                </p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default TransactionHistory;
