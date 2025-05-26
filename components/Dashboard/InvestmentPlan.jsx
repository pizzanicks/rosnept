import { FiInfo, FiArrowRight } from "react-icons/fi";
import { useState } from "react";
import { motion } from "framer-motion";
import { useFirebase } from "@/lib/firebaseContext";
import Link from "next/link";

export default function InvestmentSection() {

  const { userInvestment } = useFirebase();

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
          <h2 className="text-sm lg:text-base text-gray-600 mb-2">Investment</h2>
          <h1 className="text-xl lg:text-3xl font-bold text-blue-900 mb-8">Invested Plans</h1>
          <h2 className="text-xs lg:text-sm text-gray-600">Summary of your investment</h2>
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
        {/* Investment Account Card */}
        <motion.div
          className="bg-white shadow-md rounded p-6 relative border-r-[1px] border-gray-200 h-[fit-content]"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Title with Tooltip */}
          <div className="flex items-center gap-2 mb-4">
            <h3 className="text-base font-semibold text-gray-800">Investment Account</h3>
            <div className="group relative">
              <FiInfo className="text-yellow-600 cursor-pointer" />
              <div className="absolute hidden group-hover:flex top-full left-1/2 -translate-x-1/2 mt-2 w-64 text-sm bg-yellow-50 text-yellow-800 p-3 shadow-lg border border-yellow-400 z-10">
                This section shows your available and locked investment funds.
              </div>
            </div>
          </div>

          {/* Amounts */}
          <div className="mb-6">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
              <div>
                <div className="text-xl lg:text-2xl font-bold text-blue-900">
                  {userInvestment?.walletBal?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {userInvestment?.currency}
                </div>
                <div className="text-xs text-gray-500">Available Fund</div>
              </div>
              <div>
                <div className="text-xl lg:text-2xl font-bold text-blue-900">
                  {userInvestment?.lockedBal?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {userInvestment?.currency}
                </div>
                <div className="text-xs text-gray-500">Locked Fund</div>
              </div>
            </div>
          </div>
          <hr className="my-4" />

          {/* Transfer Button */}
          <motion.div
            className="w-[100%] md:w-[fit-content] rounded text-sm lg:text-base bg-blue-800 hover:bg-blue-700 text-white px-4 py-2 flex justify-center items-center gap-2"
            whileTap={{ scale: 0.95 }}
          >
            <Link href={'/dashboard/transfer'} className='w-full flex justify-center items-center gap-2'>Transfer <FiArrowRight /></Link>
          </motion.div>
        </motion.div>

        {/* Active Plan Card */}
        <motion.div
          className="bg-white shadow-md rounded p-6 flex flex-col justify-between mb-4"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Title */}
          <h3 className="text-base font-semibold text-gray-800 mb-4">Active Plan:</h3>

          {/* Plan Info */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <div className="text-xl font-bold text-green-700 mb-1">{ userInvestment?.activePlan ?? "N/A" }</div>
              <div className="text-sm text-gray-500">
                Activated on:{" "}
                {userInvestment?.activatedOn?.seconds
                  ? new Date(userInvestment.activatedOn.seconds * 1000).toLocaleDateString()
                  : "N/A"}
              </div>
            </div>

            {/* Neutral Placeholder Graph */}
            <div className="w-full sm:w-1/2 h-24 bg-gray-100 rounded flex items-end px-2 gap-2">
              <div className="bg-blue-400 h-6 w-2 rounded"></div>
              <div className="bg-green-400 h-10 w-2 rounded"></div>
              <div className="bg-blue-400 h-5 w-2 rounded"></div>
              <div className="bg-green-400 h-8 w-2 rounded"></div>
              <div className="bg-blue-400 h-4 w-2 rounded"></div>
            </div>
          </div>

          {/* Separator & Button */}
          <hr className="my-4" />
          <motion.div
            className="text-sm bg-gray-200 rounded hover:bg-gray-300 text-gray-800 px-4 py-2 w-full sm:w-auto"
            whileTap={{ scale: 0.95 }}
          >
            <Link href={'/dashboard/transactions'} className="text-center block">Transactions</Link>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
