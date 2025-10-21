import Link from 'next/link';
import { useState, useEffect, useMemo } from 'react';
import { FiInfo, FiArrowRight, FiAlertTriangle } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { useFirebase } from '@/lib/firebaseContext';

export default function BalanceCard() {
  const [showNotification, setShowNotification] = useState(false);
  const [showWltNotification, setShowWltNotification] = useState(false);
  const { userData, userInvestment, userWallets, userHistory } = useFirebase();

  console.log("dataaaaa:", userHistory);

  // ✅ Safely handle roiBalance (in case it’s missing)
const roiBalance = userInvestment?.roiBalance ? Number(userInvestment.roiBalance) : 0;
const walletBalance = userInvestment?.walletBal ? Number(userInvestment.walletBal) : 0;


  // Check for missing userData fields
  useEffect(() => {
    if (userData) {
      const { fullName, phone, userName } = userData;
      if (!fullName || !phone || !userName) {
        setShowNotification(true);
      }
    }
  }, [userData]);

  // Check for empty wallet
  useEffect(() => {
    if (userWallets) {
      if (userWallets?.length === 0) {
        setShowWltNotification(true);
      }
    }
  }, [userWallets]);

  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();
  
  const depositSummary = useMemo(() => {
    const summary = { total: 0, thisMonth: 0 };
    (userHistory || []).forEach(entry => {
      if (entry.type === "deposit" && entry.status === "completed") {
        summary.total += entry.amount;
        const date = new Date(entry.createdAt);
        if (date.getFullYear() === currentYear && date.getMonth() === currentMonth) {
          summary.thisMonth += entry.amount;
        }
      }
    });
    return summary;
  }, [userHistory, currentYear, currentMonth]);

  const withdrawalSummary = useMemo(() => {
    const summary = { total: 0, thisMonth: 0 };
    (userHistory || []).forEach(entry => {
      if (entry.type === "withdrawal" && entry.status === "completed") {
        summary.total += entry.amount;
        const date = new Date(entry.createdAt);
        if (date.getFullYear() === currentYear && date.getMonth() === currentMonth) {
          summary.thisMonth += entry.amount;
        }
      }
    });
    return summary;
  }, [userHistory, currentYear, currentMonth]);  

  return (
    <div className="space-y-8 p-2 lg:p-8">
      {/* Top Section */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center justify-between"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div>
          <h2 className="text-sm lg:text-base text-gray-600">Welcome!</h2>
          <h1 className="text-2xl lg:text-3xl font-medium text-blue-900">{userData?.fullName}</h1>
        </div>
        <div className="flex justify-start md:justify-end gap-4">
          <motion.div
            className="w-[50%] md:w-auto rounded text-sm lg:text-base bg-green-600 hover:bg-green-700 text-white px-4 py-2 flex justify-center items-center gap-2"
            whileTap={{ scale: 0.95 }}
          >
            <Link href={'/dashboard/plans'} className='flex justify-center items-center gap-2'>Invest & Earn <FiArrowRight /></Link>
          </motion.div>
          <motion.div
            className="w-[50%] md:w-auto rounded text-sm lg:text-base bg-blue-800 hover:bg-blue-700 text-white px-4 py-2 flex justify-center items-center gap-2"
            whileTap={{ scale: 0.95 }}
          >
            <Link href={'/dashboard/deposit'} className='flex justify-center items-center gap-2'>Deposit <FiArrowRight /></Link>
          </motion.div>
        </div>
      </motion.div>

      {/* Summary Section */}
      <motion.div
        className="space-y-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <p className="text-sm text-gray-700">Here is a summary of your account</p>

        {showWltNotification && (
          <motion.div
            className="border border-red-400 bg-red-50 text-red-800 p-4 rounded flex flex-col lg:flex-row justify-between items-start gap-4 lg:gap-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="flex gap-2 items-start">
              <FiAlertTriangle className="text-red-600 w-6 h-6" />
              <span className="text-sm font-medium">Please add an account to receive payments or withdraw funds.</span>
            </div>
            <Link
              href="/dashboard/settings"
              className="border border-red-600 text-red-600 hover:bg-red-600 hover:text-white py-1 lg:py-2 px-2 lg:px-4 rounded text-sm font-medium self-end transition duration-200"
            >
              Add Account
            </Link>
          </motion.div>
        )}
        
        {showNotification && (
          <motion.div
            className="border border-yellow-400 bg-yellow-50 text-yellow-800 p-4 rounded flex flex-col lg:flex-row justify-between items-start gap-4 lg:gap-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="flex gap-2 items-start">
              <FiInfo className="text-yellow-600 cursor-pointer w-6 h-6" />
              <span className='text-sm'>Please update your profile information to keep your account secure.</span>
            </div>
            <Link
              href="/dashboard/profile"
              className="border border-yellow-600 text-yellow-600 hover:bg-yellow-600 hover:text-white py-1 lg:py-2 px-2 lg:px-4 rounded text-sm font-medium self-end transition duration-200"
            >
              Update Profile
            </Link>
          </motion.div>
        )}
      </motion.div>

      {/* Account Summary */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        {/* ✅ Available Balance (includes ROI Balance) */}
        <motion.div
          className="p-4 bg-white shadow rounded relative flex flex-col justify-between h-36 lg:h-40"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div>
            <div className="flex justify-between items-start">
              <h4 className="text-gray-600 text-sm">Available Balance</h4>
              <div className="relative group z-40">
                <FiInfo className="mt-1 text-yellow-600 cursor-pointer" />
                <div className="absolute hidden group-hover:flex top-full mt-2 right-0 sm:left-1/2 sm:-translate-x-1/2 w-64 text-sm bg-yellow-50 text-yellow-800 p-3 rounded shadow-lg border border-yellow-400 z-10">
                  Funds available for withdrawal and investment.
                </div>
              </div>
            </div>

            {/* ✅ Display wallet balance */}
            <div className="text-xl lg:text-2xl font-bold mt-2 text-gray-700">
              {walletBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {userInvestment?.currency}
            </div>

            {/* ✅ Display ROI balance underneath */}
            <div className="text-sm text-gray-500 mt-2">
              ROI Balance: <span className="font-semibold text-green-600">{roiBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {userInvestment?.currency}</span>
            </div>
          </div>

          <div className="text-sm text-gray-500 mt-4">
            Investment Amount: <span className='font-semibold'>{userInvestment?.lockedBal?.toLocaleString()} USDT</span>
          </div>
        </motion.div>

        {/* Total Deposit */}
        <motion.div
          className="p-4 bg-white shadow rounded relative flex flex-col justify-between h-36 lg:h-40"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div>
            <div className="flex justify-between items-start">
              <h4 className="text-gray-600 text-sm">Total Deposit</h4>
              <div className="relative group z-40">
                <FiInfo className="mt-1 text-yellow-600 cursor-pointer" />
                <div className="absolute hidden group-hover:flex top-full mt-2 right-0 sm:left-1/2 sm:-translate-x-1/2 w-64 text-sm bg-yellow-50 text-yellow-800 p-3 rounded shadow-lg border border-yellow-400 z-10">
                  All funds deposited to wallet.
                </div>
              </div>
            </div>
            <div className="text-xl lg:text-2xl font-bold text-gray-700 mt-2">{depositSummary.total.toLocaleString()} {userInvestment?.currency}</div>
          </div>
          <div className="text-sm text-gray-500 mt-4">
            This Month: <span className='font-semibold'>{depositSummary.thisMonth > 0 ? depositSummary.thisMonth.toLocaleString() + " USDT" : "N/A"}</span>
          </div>
        </motion.div>

        {/* Total Withdrawal */}
        <motion.div
          className="p-4 bg-white shadow rounded relative flex flex-col justify-between h-36 lg:h-40"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div>
            <h4 className="text-gray-600 text-sm">Total Withdrawal</h4>
            <div className="text-xl lg:text-2xl font-bold text-gray-700 mt-2">{withdrawalSummary.total.toLocaleString()} {userInvestment?.currency}</div>
          </div>
          <div className="text-sm text-gray-500 mt-4">
            This Month: <span className='font-semibold'>{withdrawalSummary.thisMonth.toLocaleString()} USDT</span>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
