// components/Dashboard/InvestmentOverviewSection.jsx
import React from 'react';
// Removed useTranslation as it's no longer needed for these static strings
// import { useTranslation } from 'next-i18next';
import dayjs from 'dayjs'; // For date formatting

export default function InvestmentOverviewSection({ userData, userInvestment }) {
  // const { t } = useTranslation('common'); // No longer needed for these specific strings

  // Data Extraction for Display
  const walletBalance = userData?.walletBalance ?? 0;
  const currentPlanDaysCompleted = userData?.currentPlanDaysCompleted ?? 0;
  const currentPlanRoiPercentage = userData?.currentPlanRoiPercentage ?? 0;
  const hasActiveInvestments = userData?.hasActiveInvestments ?? false; // Explicitly pull this flag

  // Robust date formatting for lastRoiPaymentDate
  const lastRoiPaymentDate = userData?.lastRoiPaymentDate
    ? dayjs(
        // Check if it's a Firebase Timestamp (has toDate function)
        typeof userData.lastRoiPaymentDate.toDate === 'function'
          ? userData.lastRoiPaymentDate.toDate() // Convert Timestamp to JS Date
          : userData.lastRoiPaymentDate // Otherwise, assume it's already a JS Date or string
      ).format('YYYY-MM-DD')
    : "N/A"; // Replaced t('dashboard_not_available') with plain string

  const earningStatus = userData?.earningStatus ?? 'inactive'; // Used for the earning status card

  const investmentPlanName = userInvestment?.activePlan?.planName ?? "No Active Plan"; // Replaced t('dashboard_no_active_plan')
  const investmentAmount = userInvestment?.activePlan?.amount ?? 0;
  const totalDeposit = userInvestment?.totalDeposit ?? 0;
  const totalWithdrawal = userInvestment?.totalWithdrawal ?? 0;

  // Calculations for display
  const progressPercent = (currentPlanDaysCompleted / 7) * 100; // Assuming 7 days is target

  // Determine investment status using hasActiveInvestments, mirroring ProfileSection
  // Replaced t('dashboard_status_...') with plain strings
  const investmentStatus = currentPlanDaysCompleted >= 7
    ? "Completed"
    : (hasActiveInvestments ? "Active" : "Inactive");


  // Show a loading state or message if data is not yet available
  if (!userData || !userInvestment) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-md text-center text-gray-600 mb-8">
        <p>Loading investment data...</p> {/* Replaced t('dashboard_loading_investment_data') */}
      </div>
    );
  }

  return (
    <div className="space-y-4 mb-8">
      <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2 mt-8 text-center font-garamond">
        Investment Overview {/* Replaced t('dashboard_investment_overview_title') */}
      </h2>
      <p className="text-sm text-gray-600 text-center mb-6">
        Your current earnings, plan status, and financial summaries. {/* Replaced t('dashboard_investment_overview_description') */}
      </p>

      {/* Adjusted grid for 3 columns on larger screens, 2 on medium, 1 on small */}
      <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 border border-gray-200">
        <div className="p-3 border border-gray-200 rounded-md shadow-sm bg-gray-50">
          <h3 className="text-sm text-gray-600 mb-1 font-medium">Wallet Balance</h3> {/* Replaced t('dashboard_wallet_balance') */}
          <p className="text-lg sm:text-xl font-semibold text-gray-900">${walletBalance.toFixed(2)}</p>
        </div>
        <div className="p-3 border border-gray-200 rounded-md shadow-sm bg-gray-50">
          <h3 className="text-sm text-gray-600 mb-1 font-medium">Current Plan</h3> {/* Replaced t('dashboard_current_plan') */}
          <p className="text-lg sm:text-xl font-semibold text-gray-900">{investmentPlanName}</p>
        </div>
        <div className="p-3 border border-gray-200 rounded-md shadow-sm bg-gray-50">
          <h3 className="text-sm text-gray-600 mb-1 font-medium">Invested Amount</h3> {/* Replaced t('dashboard_invested_amount') */}
          <p className="text-lg sm:text-xl font-semibold text-gray-900">${investmentAmount.toFixed(2)}</p>
        </div>
        <div className="p-3 border border-gray-200 rounded-md shadow-sm bg-gray-50">
          <h3 className="text-sm text-gray-600 mb-1 font-medium">Daily ROI %</h3> {/* Replaced t('dashboard_daily_roi_percent') */}
          <p className="text-lg sm:text-xl font-semibold text-gray-900">{currentPlanRoiPercentage * 100}%</p>
        </div>
        <div className="p-3 border border-gray-200 rounded-md shadow-sm bg-gray-50">
          <h3 className="text-sm text-gray-600 mb-1 font-medium">Days Completed</h3> {/* Replaced t('dashboard_days_completed') */}
          <p className="text-lg sm:text-xl font-semibold text-gray-900">{currentPlanDaysCompleted} days</p> {/* Replaced t('dashboard_days') */}
          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
            <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${progressPercent}%` }}></div>
          </div>
        </div>
        <div className="p-3 border border-gray-200 rounded-md shadow-sm bg-gray-50">
          <h3 className="text-sm text-gray-600 mb-1 font-medium">Last Payout Date</h3> {/* Replaced t('dashboard_last_payout_date') */}
          <p className="text-lg sm:text-xl font-semibold text-gray-900">{lastRoiPaymentDate}</p>
        </div>
        {/* Total Deposit Card */}
        <div className="p-3 border border-gray-200 rounded-md shadow-sm bg-gray-50">
          <h3 className="text-sm text-gray-600 mb-1 font-medium">Total Deposit</h3> {/* Replaced t('dashboard_total_deposit') */}
          <p className="text-lg sm:text-xl font-semibold text-gray-900">${totalDeposit.toFixed(2)}</p>
        </div>
        {/* Total Withdrawal Card */}
        <div className="p-3 border border-gray-200 rounded-md shadow-sm bg-gray-50">
          <h3 className="text-sm text-gray-600 mb-1 font-medium">Total Withdrawal</h3> {/* Replaced t('dashboard_total_withdrawal') */}
          <p className="text-lg sm:text-xl font-semibold text-gray-900">${totalWithdrawal.toFixed(2)}</p>
        </div>
        {/* Investment Status Card (Now using hasActiveInvestments) */}
        <div className="p-3 border border-gray-200 rounded-md shadow-sm bg-gray-50">
          <h3 className="text-sm text-gray-600 mb-1 font-medium">Investment Status</h3> {/* Replaced t('dashboard_investment_status') */}
          <span className={`inline-block text-sm font-medium px-3 py-1 rounded-full ${
            investmentStatus === "Active" ? 'bg-green-100 text-green-700' : // Replaced t('dashboard_status_active')
            investmentStatus === "Completed" ? 'bg-gray-200 text-gray-700' : // Replaced t('dashboard_status_completed')
            'bg-red-100 text-red-700'
          }`}>
            {investmentStatus}
          </span>
        </div>
        {/* Earning Status Card */}
        <div className="p-3 border border-gray-200 rounded-md shadow-sm bg-gray-50">
          <h3 className="text-sm text-gray-600 mb-1 font-medium">Earning Status</h3> {/* Replaced t('dashboard_earning_status') */}
          <span className={`inline-block text-sm font-medium px-3 py-1 rounded-full ${
            earningStatus === 'active' || earningStatus === 'running' ? 'bg-green-100 text-green-700' :
            earningStatus === 'paused' ? 'bg-yellow-100 text-yellow-700' :
            'bg-red-100 text-red-700'
          }`}>
            {earningStatus.charAt(0).toUpperCase() + earningStatus.slice(1)} {/* Capitalize earningStatus */}
          </span>
        </div>
      </div>
    </div>
  );
}
