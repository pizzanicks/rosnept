import React, { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { doc, collection, onSnapshot, updateDoc } from 'firebase/firestore';
import { useFirebase } from '@/lib/firebaseContext';

export default function InvestmentOverviewSection({ userData }) {
  const { db, userId } = useFirebase();
  const [userInvestmentState, setUserInvestmentState] = useState(null);
  const [payoutLogs, setPayoutLogs] = useState([]);
  const [isTransferring, setIsTransferring] = useState(false); // ✅ Added state

  // Listen to main investment document
  useEffect(() => {
    if (!userId || !db) return;

    const investmentRef = doc(db, 'INVESTMENT', userId);
    const unsubscribe = onSnapshot(
      investmentRef,
      (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data.roiBalance === undefined) data.roiBalance = 0;
          setUserInvestmentState(data);

          if (Array.isArray(data.payoutLogs)) {
            setPayoutLogs(data.payoutLogs.sort((a, b) => b.timestamp - a.timestamp));
          }
        } else {
          setUserInvestmentState(null);
        }
      },
      (error) => console.error('Error fetching investment data:', error)
    );

    return () => unsubscribe();
  }, [userId, db]);

  // ✅ Listen to payoutLogs subcollection (if exists)
  useEffect(() => {
    if (!userId || !db) return;
    const payoutRef = collection(db, 'INVESTMENT', userId, 'payoutLogs');
    const unsubscribe = onSnapshot(
      payoutRef,
      (snapshot) => {
        if (!snapshot.empty) {
          const logs = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          logs.sort((a, b) => b.timestamp - a.timestamp);
          setPayoutLogs(logs);
        }
      },
      (error) => console.error('Error fetching payout logs:', error)
    );

    return () => unsubscribe();
  }, [userId, db]);

  // ✅ Transfer ROI to Wallet
  const handleTransferRoi = async () => {
    if (!userId || !db || !userInvestmentState) return;
    const roiBalance = userInvestmentState.roiBalance || 0;

    if (roiBalance <= 0) {
      alert('No ROI available to transfer.');
      return;
    }

    try {
      setIsTransferring(true);
      const investmentRef = doc(db, 'INVESTMENT', userId);
      await updateDoc(investmentRef, {
        walletBal: (userInvestmentState.walletBal || 0) + roiBalance,
        roiBalance: 0,
      });
      alert('ROI successfully transferred to wallet!');
    } catch (error) {
      console.error('Error transferring ROI:', error);
      alert('Failed to transfer ROI. Please try again.');
    } finally {
      setIsTransferring(false);
    }
  };

  // Extract data safely
  const userInvestment = userInvestmentState || {};
  const walletBalance = userData?.walletBalance ?? 0;
  const roiBalance = userInvestment?.roiBalance ?? 0;

  const currentPlanDaysCompleted = userInvestment?.activePlan?.daysCompleted ?? 0;
  const currentPlanRoiPercentage = userInvestment?.activePlan?.roiPercent ?? 0;
  const hasActiveInvestments = userInvestment?.hasActivePlan ?? false;

  const lastRoiPaymentDate = userInvestment?.activePlan?.lastRoiPaymentDate
    ? dayjs(
        typeof userInvestment.activePlan.lastRoiPaymentDate.toDate === 'function'
          ? userInvestment.activePlan.lastRoiPaymentDate.toDate()
          : userInvestment.activePlan.lastRoiPaymentDate
      ).format('YYYY-MM-DD')
    : 'N/A';

  const earningStatus = userInvestment?.activePlan?.isActive ? 'active' : 'inactive';
  const investmentPlanName = userInvestment?.activePlan?.planName ?? 'No Active Plan';
  const investmentAmount = userInvestment?.activePlan?.amount ?? 0;
  const totalDeposit = userInvestment?.lockedBal ?? 0;
  const totalWithdrawal = userInvestment?.totalWithdrawal ?? 0;
  const progressPercent = (currentPlanDaysCompleted / 7) * 100;

  const investmentStatus =
    currentPlanDaysCompleted >= 7
      ? 'Completed'
      : hasActiveInvestments
      ? 'Active'
      : 'Inactive';

  if (!userData || !userInvestmentState) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-md text-center text-gray-600 mb-8">
        <p>Loading investment data...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 mb-8">
      <h2 className="text-xl sm:text-2xl font-bold text-gray-800 text-center mt-8">
        Investment Overview
      </h2>
      <p className="text-sm text-gray-600 text-center mb-6">
        Your current earnings, plan status, and ROI payout history.
      </p>

      {/* ====== OVERVIEW GRID ====== */}
      <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 border border-gray-200">
        <OverviewCard
          title="ROI Balance"
         value={roiBalance.toLocaleString(undefined, { style: 'currency', currency: 'USD' })}

        >
          <button
            onClick={handleTransferRoi}
            disabled={isTransferring || roiBalance <= 0}
            className={`mt-2 w-full py-1.5 text-sm rounded-lg font-medium text-white ${
              roiBalance <= 0
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {isTransferring ? 'Transferring...' : 'Transfer to Wallet'}
          </button>
        </OverviewCard>

        <OverviewCard title="Wallet Balance" value={`$${walletBalance.toFixed(2)}`} />
        <OverviewCard title="Current Plan" value={investmentPlanName} />
        <OverviewCard title="Invested Amount" value={`$${investmentAmount.toFixed(2)}`} />
        <OverviewCard
          title="Daily ROI %"
          value={`${Number((currentPlanRoiPercentage * 100).toFixed(2))}%`}
        />
        <OverviewCard title="Days Completed" value={`${currentPlanDaysCompleted} days`}>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
            <div
              className="bg-blue-500 h-2 rounded-full"
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
        </OverviewCard>
        <OverviewCard title="Last Payout Date" value={lastRoiPaymentDate} />
        <OverviewCard title="Total Deposit" value={`$${totalDeposit.toFixed(2)}`} />
        <OverviewCard title="Total Withdrawal" value={`$${totalWithdrawal.toFixed(2)}`} />
        <OverviewCard
          title="Investment Status"
          value={
            <span
              className={`inline-block text-sm font-medium px-3 py-1 rounded-full ${
                investmentStatus === 'Active'
                  ? 'bg-green-100 text-green-700'
                  : investmentStatus === 'Completed'
                  ? 'bg-gray-200 text-gray-700'
                  : 'bg-red-100 text-red-700'
              }`}
            >
              {investmentStatus}
            </span>
          }
        />
        <OverviewCard
          title="Earning Status"
          value={
            <span
              className={`inline-block text-sm font-medium px-3 py-1 rounded-full ${
                earningStatus === 'active' || earningStatus === 'running'
                  ? 'bg-green-100 text-green-700'
                  : earningStatus === 'paused'
                  ? 'bg-yellow-100 text-yellow-700'
                  : 'bg-red-100 text-red-700'
              }`}
            >
              {earningStatus.charAt(0).toUpperCase() + earningStatus.slice(1)}
            </span>
          }
        />
      </div>

      {/* ====== ROI PAYOUT HISTORY ====== */}
      <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Payout History</h3>
        {payoutLogs.length === 0 ? (
          <p className="text-gray-500 text-sm">No ROI payouts yet.</p>
        ) : (
          <ul className="divide-y divide-gray-100 max-h-64 overflow-y-auto">
            {payoutLogs.map((log, i) => (
              <li
                key={log.id || i}
                className="flex justify-between py-2 text-sm text-gray-700"
              >
                <span>{dayjs(log.timestamp?.toDate?.() || log.date).format('YYYY-MM-DD')}</span>
                <span className="text-green-600 font-medium">
                  +${(log.amount ?? 0).toFixed(2)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

/* ====== Small Reusable Overview Card Component ====== */
function OverviewCard({ title, value, children }) {
  return (
    <div className="p-3 border border-gray-200 rounded-md shadow-sm bg-gray-50">
      <h3 className="text-sm text-gray-600 mb-1 font-medium">{title}</h3>
      <p className="text-lg sm:text-xl font-semibold text-gray-900">
        {typeof value === 'string' || typeof value === 'number' ? value : value}
      </p>
      {children}
    </div>
  );
}
