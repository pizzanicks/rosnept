import Link from 'next/link';
import { useState } from 'react';
import { FiChevronRight, FiArrowDownLeft, FiArrowUpRight, FiCreditCard, FiArrowRight, FiX, FiSettings } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { useFirebase } from '@/lib/firebaseContext';

export default function TransactionsCard() {

    const [search, setSearch] = useState('');
    const [selected, setSelected] = useState(null);
    const [activeTab, setActiveTab] = useState('history');
    const { userHistory } = useFirebase();

    const openModal = (txn) => setSelected(txn);
    const closeModal = () => setSelected(null);

    const formatFirestoreDate = (dateValue) => {
      let dateObj;
    
      if (!dateValue) return "Invalid date";
    
      if (typeof dateValue === "string") {
        dateObj = new Date(dateValue);
      } else if (dateValue.toDate) {
        dateObj = dateValue.toDate();
      } else {
        return "Invalid date";
      }
    
      return dateObj.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    };    

    // Filter transactions based on the selected tab and search
    const filteredTransactions = (userHistory || []).filter((txn) => {
      const method = txn.method || txn.selectedWallet?.method || '';
      const matchesSearch = method.toLowerCase().includes(search.toLowerCase());
    
      let matchesTab = false;
      if (activeTab === 'history') {
        matchesTab = true;
      } else {
        matchesTab = txn.type === activeTab;
      }
    
      return matchesSearch && matchesTab;
    });


  return (
    <div className="space-y-8 p-2 lg:p-8">
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center justify-between">
            <div>
                {/* Animated Texts */}
                <motion.h2
                className="text-sm lg:text-base text-gray-600 mb-2"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                >
                History
                </motion.h2>
                <motion.h1
                className="text-xl lg:text-3xl font-bold text-blue-900 mb-8"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                >
                Transactions
                </motion.h1>
                <motion.h2
                className="text-xs lg:text-sm text-gray-600"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                >
                List of transactions in your account
                </motion.h2>
            </div>
            <div className="flex justify-start md:justify-end gap-4">
                {/* Animated Buttons */}
                <motion.div
                className="w-[50%] md:w-auto rounded text-sm lg:text-base bg-green-600 hover:bg-green-700 text-white px-4 py-2 flex justify-center items-center gap-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.5 }}
                >
                  <Link href={'/dashboard/plans'} className='flex justify-center items-center gap-2'>Invest & Earn <FiArrowRight /></Link>
                </motion.div>

                <motion.div
                className="w-[50%] md:w-auto rounded text-sm lg:text-base bg-blue-800 hover:bg-blue-700 text-white px-4 py-2 flex justify-center items-center gap-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.5 }}
                >
                  <Link href={'/dashboard/deposit'} className='flex justify-center items-center gap-2'>Deposit <FiArrowRight /></Link>
                </motion.div>
            </div>
        </div>

        <motion.h2
            className="text-base lg:text-lg font-semibold text-blue-900"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
        >
            <div className="w-full flex space-x-4 lg:space-x-6">
              <div
                  onClick={() => setActiveTab('history')}
                  className={`w-full lg:w-auto cursor-pointer font-medium lg:font-semibold text-sm text-center relative ${activeTab === 'history' ? 'text-blue-900' : 'text-gray-500'}`}
              >
                  History
                  {activeTab === 'history' && (
                      <motion.div
                          className="w-full h-[2px] bg-blue-900 mt-2" // Added mt-2 for margin-top
                          initial={{ x: -100 }}
                          animate={{ x: 0 }}
                          transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                  )}
              </div>

              <div
                  onClick={() => setActiveTab('deposit')}
                  className="w-full lg:w-auto cursor-pointer text-center relative"
              >
                  <div className={`font-medium lg:font-semibold text-sm ${activeTab === 'deposit' ? 'text-blue-900' : 'text-gray-500'}`}>
                      Deposit
                  </div>
                  {activeTab === 'deposit' && (
                      <motion.div
                          className="w-full h-[2px] bg-blue-900 mt-2" // Added mt-2 for margin-top
                          initial={{ x: -100 }}
                          animate={{ x: 0 }}
                          transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                  )}
              </div>

              <div
                  onClick={() => setActiveTab('withdrawal')}
                  className="w-full lg:w-auto cursor-pointer text-center relative"
              >
                  <div className={`font-medium lg:font-semibold text-sm ${activeTab === 'withdrawal' ? 'text-blue-900' : 'text-gray-500'}`}>
                      Withdraw
                  </div>
                  {activeTab === 'withdrawal' && (
                      <motion.div
                          className="w-full h-[2px] bg-blue-900 mt-2" // Added mt-2 for margin-top
                          initial={{ x: -100 }}
                          animate={{ x: 0 }}
                          transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                  )}
              </div>

            </div>
        </motion.h2>

        {/* Bottom Section */}
        <motion.div
            className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-t border-gray-300 pt-8 modal-pop"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >

            {/* Animated Header */}
            <motion.h2
                className="text-base lg:text-lg font-medium lg:font-semibold text-blue-900"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
            >
                All Transactions
            </motion.h2>

            {/* Animated Search and Filter */}
            <div className="flex items-center gap-2">
                <motion.input
                  type="text"
                  placeholder="Search by method..."
                  className="border border-gray-300 px-3 py-2 text-sm w-full md:w-64 rounded"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                />
                <motion.div
                  className="p-2 border border-gray-300 text-gray-500 rounded hover:text-blue-600"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                >
                  <Link href="/dashboard/settings"><FiSettings /></Link>
                </motion.div>
            </div>
        </motion.div>

        {/* Transactions List */}
        <div className="space-y-2 mt-6">
          {filteredTransactions.length === 0 ? (
            <div className="p-4 text-sm lg:text-base text-center text-gray-500 bg-gray-50 rounded h-32 lg:h-40 flex justify-center items-center">
              No Transactions found
            </div>
          ) : (
            filteredTransactions
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .map((txn) => (
              <motion.div
                key={txn.id}
                className="flex items-start lg:items-center justify-between rounded bg-gray-50 hover:bg-white p-3 cursor-pointer"
                onClick={() => openModal(txn)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
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
                  <div className="text-xs text-gray-500">
                    {formatFirestoreDate(txn.createdAt)} · <span className='capitalize'>{txn.status}</span>
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
                  <div className="text-xs text-gray-400">
                    {Number(txn.amount).toLocaleString()} USDT
                  </div>
                </div>

                <FiChevronRight className="ml-3 text-gray-400" />
              </motion.div>
            ))
          )}
        </div>


        {/* Modal */}
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
                  <div className="text-lg font-bold text-blue-900">{selected.amount.toLocaleString()} USDT</div>
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

    </div>
  );
}