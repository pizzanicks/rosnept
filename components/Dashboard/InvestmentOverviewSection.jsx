import React, { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { doc, onSnapshot } from 'firebase/firestore'; // Import necessary Firestore functions
import { useFirebase } from '@/lib/firebaseContext'; // Import useFirebase to get the userId

export default function InvestmentOverviewSection({ userData }) {
  // Use the useFirebase hook to get database instance and current user's ID
  const { db, userId } = useFirebase();
  // State to hold the real-time investment data
  const [userInvestmentState, setUserInvestmentState] = useState(null);

  // useEffect hook to set up the real-time listener
  useEffect(() => {
    // Only proceed if userId and db are available
    if (!userId || !db) {
      return;
    }

    // Get a reference to the user's specific investment document
    const investmentRef = doc(db, 'INVESTMENT', userId);

    // Set up the real-time listener using onSnapshot
    const unsubscribe = onSnapshot(investmentRef, (docSnap) => {
      if (docSnap.exists()) {
        // If the document exists, set the state with its data
        setUserInvestmentState(docSnap.data());
        console.log('🔍 Investment Data Structure:', docSnap.data());
      } else {
        // If it doesn't exist, set state to null or default
        setUserInvestmentState(null);
      }
    }, (error) => {
      console.error("Error fetching real-time investment data:", error);
      // You can add an error state here if needed
    });

    // Clean up the listener when the component unmounts
    return () => unsubscribe();
  }, [userId, db]); // Rerun the effect if userId or db changes

  // Use the real-time state data, falling back to a default object to avoid errors
  const userInvestment = userInvestmentState || {};

  // Data Extraction for Display
  // Note: userData is still passed as a prop for other information, but userInvestment is now local state.
  const walletBalance = userData?.walletBalance ?? 0;
  const currentPlanDaysCompleted = userInvestment?.activePlan?.daysCompleted ?? 0;
  const currentPlanRoiPercentage = userInvestment?.activePlan?.roiPercent ?? 0;
  const hasActiveInvestments = userInvestment?.hasActivePlan ?? false;

  // Robust date formatting for lastRoiPaymentDate
  const lastRoiPaymentDate = userInvestment?.activePlan?.lastRoiPaymentDate
    ? dayjs(
        typeof userInvestment.activePlan.lastRoiPaymentDate.toDate === 'function'
          ? userInvestment.activePlan.lastRoiPaymentDate.toDate()
          : userInvestment.activePlan.lastRoiPaymentDate
      ).format('YYYY-MM-DD')
    : "N/A";

  const earningStatus = userInvestment?.activePlan?.isActive ? 'active' : 'inactive';

  const investmentPlanName = userInvestment?.activePlan?.planName ?? "No Active Plan";
  const investmentAmount = userInvestment?.activePlan?.amount ?? 0;
  const totalDeposit = userInvestment?.lockedBal ?? 0;
  const totalWithdrawal = userInvestment?.totalWithdrawal ?? 0;

  // Calculations for display
  const progressPercent = (currentPlanDaysCompleted / 7) * 100;

  const investmentStatus = currentPlanDaysCompleted >= 7
    ? "Completed"
    : (hasActiveInvestments ? "Active" : "Inactive");


  if (!userData || !userInvestmentState) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-md text-center text-gray-600 mb-8">
        <p>Loading investment data...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 mb-8">
      <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2 mt-8 text-center font-garamond">
        Investment Overview
      </h2>
      <p className="text-sm text-gray-600 text-center mb-6">
        Your current earnings, plan status, and financial summaries.
      </p>

      <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 border border-gray-200">
        <div className="p-3 border border-gray-200 rounded-md shadow-sm bg-gray-50">
          <h3 className="text-sm text-gray-600 mb-1 font-medium">Wallet Balance</h3>
          <p className="text-lg sm:text-xl font-semibold text-gray-900">${walletBalance.toFixed(2)}</p>
        </div>
        <div className="p-3 border border-gray-200 rounded-md shadow-sm bg-gray-50">
          <h3 className="text-sm text-gray-600 mb-1 font-medium">Current Plan</h3>
          <p className="text-lg sm:text-xl font-semibold text-gray-900">{investmentPlanName}</p>
        </div>
        <div className="p-3 border border-gray-200 rounded-md shadow-sm bg-gray-50">
          <h3 className="text-sm text-gray-600 mb-1 font-medium">Invested Amount</h3>
          <p className="text-lg sm:text-xl font-semibold text-gray-900">${investmentAmount.toFixed(2)}</p>
        </div>
        <div className="p-3 border border-gray-200 rounded-md shadow-sm bg-gray-50">
          <h3 className="text-sm text-gray-600 mb-1 font-medium">Daily ROI %</h3>
          <p className="text-lg sm:text-xl font-semibold text-gray-900">
  {Number((currentPlanRoiPercentage * 100).toFixed(2))}%
</p>
        </div>
        <div className="p-3 border border-gray-200 rounded-md shadow-sm bg-gray-50">
          <h3 className="text-sm text-gray-600 mb-1 font-medium">Days Completed</h3>
          <p className="text-lg sm:text-xl font-semibold text-gray-900">{currentPlanDaysCompleted} days</p>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
            <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${progressPercent}%` }}></div>
          </div>
        </div>
        <div className="p-3 border border-gray-200 rounded-md shadow-sm bg-gray-50">
          <h3 className="text-sm text-gray-600 mb-1 font-medium">Last Payout Date</h3>
          <p className="text-lg sm:text-xl font-semibold text-gray-900">{lastRoiPaymentDate}</p>
        </div>
        <div className="p-3 border border-gray-200 rounded-md shadow-sm bg-gray-50">
          <h3 className="text-sm text-gray-600 mb-1 font-medium">Total Deposit</h3>
          <p className="text-lg sm:text-xl font-semibold text-gray-900">${totalDeposit.toFixed(2)}</p>
        </div>
        <div className="p-3 border border-gray-200 rounded-md shadow-sm bg-gray-50">
          <h3 className="text-sm text-gray-600 mb-1 font-medium">Total Withdrawal</h3>
          <p className="text-lg sm:text-xl font-semibold text-gray-900">${totalWithdrawal.toFixed(2)}</p>
        </div>
        <div className="p-3 border border-gray-200 rounded-md shadow-sm bg-gray-50">
          <h3 className="text-sm text-gray-600 mb-1 font-medium">Investment Status</h3>
          <span className={`inline-block text-sm font-medium px-3 py-1 rounded-full ${
            investmentStatus === "Active" ? 'bg-green-100 text-green-700' :
            investmentStatus === "Completed" ? 'bg-gray-200 text-gray-700' :
            'bg-red-100 text-red-700'
          }`}>
            {investmentStatus}
          </span>
        </div>
        <div className="p-3 border border-gray-200 rounded-md shadow-sm bg-gray-50">
          <h3 className="text-sm text-gray-600 mb-1 font-medium">Earning Status</h3>
          <span className={`inline-block text-sm font-medium px-3 py-1 rounded-full ${
            earningStatus === 'active' || earningStatus === 'running' ? 'bg-green-100 text-green-700' :
            earningStatus === 'paused' ? 'bg-yellow-100 text-yellow-700' :
            'bg-red-100 text-red-700'
          }`}>
            {earningStatus.charAt(0).toUpperCase() + earningStatus.slice(1)}
          </span>
        </div>
      </div>
    </div>
  );
}
