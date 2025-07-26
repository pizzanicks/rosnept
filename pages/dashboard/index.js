// pages/dashboard/index.js
'use client'; // This component includes client-side hooks

import BalanceCard from "@/components/Dashboard/BalanceCard";
import DashboardLayout from "@/components/Dashboard/DashboardLayout";
import Footer from "@/components/Dashboard/Footer";
import TransactionHistory from "@/components/Dashboard/History";
import ReferSection from "@/components/Dashboard/Refer";
import { useState, useEffect } from "react";
import Loader from "@/components/Dashboard/DbLoader";
import protectRoute from "@/lib/protectRoute";

import Head from 'next/head';
import { doc, updateDoc } from 'firebase/firestore';
import { useFirebase } from '@/lib/firebaseContext';
import { useTranslation } from 'next-i18next';

// --- IMPORT NEWLY CREATED SECTIONS ---
import InvestmentOverviewSection from '@/components/Dashboard/InvestmentOverviewSection';
import PayoutHistorySection from '@/components/Dashboard/PayoutHistorySection';
// --- END NEW IMPORTS ---

function Home() {
  const [pageLoading, setPageLoading] = useState(true);

  // Destructure all necessary data from useFirebase
  const { user, db, userData, userInvestment, userWallets, userHistory, loading, error: firebaseError } = useFirebase();
  const { t } = useTranslation('common');

  const [localError, setLocalError] = useState(null); // For local component errors, distinct from Firebase errors

  useEffect(() => {
    const timer = setTimeout(() => {
      setPageLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Use the loading state from useFirebase context
  if (pageLoading || loading) {
    return (
      <DashboardLayout>
        <Loader />
      </DashboardLayout>
    );
  }

  // Display error if there is one from FirebaseContext or local
  if (firebaseError || localError) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-full min-h-[50vh]">
          <p className="text-red-600 text-lg p-4 bg-red-50 rounded-lg shadow-sm">{firebaseError || localError}</p>
        </div>
      </DashboardLayout>
    );
  }

  // --- DATA EXTRACTION (default to 0 or 'inactive' if not found) ---
  // These are now directly from userData provided by useFirebaseContext
  // Note: These variables are still here because they are used by the Action Buttons section.
  // If the Action Buttons were also removed, these could be removed too.
  const initialInvestmentAmount = userData?.initialInvestmentAmount || 0; // Still used for action buttons logic
  const currentROIValue = userData?.currentROIValue || 0; // Still used for action buttons logic
  const currentROI = userData?.currentROI || 0; // Still used for action buttons logic
  const roiIncreaseDayCount = userData?.roiIncreaseDayCount || 0; // Still used for action buttons logic
  const earningStatus = userData?.earningStatus || 'inactive'; // Still used for action buttons logic

  // --- ACTION HANDLERS (for Stop/Pause/Restart buttons) ---
  const handleStopInvestment = async () => {
    if (db && user?.uid) {
      try {
        await updateDoc(doc(db, 'users', user.uid), { earningStatus: 'stopped' });
        console.log("Investment stopped successfully!");
      } catch (error) {
        console.error("Error stopping investment:", error);
        setLocalError(t('dashboard_stop_error'));
      }
    }
  };

  const handlePauseInvestment = async () => {
    if (db && user?.uid) {
      try {
        await updateDoc(doc(db, 'users', user.uid), { earningStatus: 'paused' });
        console.log("Investment paused successfully!");
      } catch (error) {
        console.error("Error pausing investment:", error);
        setLocalError(t('dashboard_pause_error'));
      }
    }
  };

  const handleRestartInvestment = async () => {
    if (db && user?.uid) {
      try {
        await updateDoc(doc(db, 'users', user.uid), {
          earningStatus: 'active',
          currentROI: 0,
          currentROIValue: 0,
          roiIncreaseDayCount: 0,
          roiStartDate: new Date(),
          lastROIUpdateDate: new Date()
        });
        console.log("Investment restarted successfully!");
      } catch (error) {
        console.error("Error restarting investment:", error);
        setLocalError(t('dashboard_restart_error'));
      }
    }
  };
  // --- END ACTION HANDLERS ---

  return (
    <>
      <Head>
        <title>{t('dashboard_page_title')}</title>
        <meta name="description" content={t('dashboard_page_meta_description')} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <DashboardLayout>
        {/* Removed: Welcome Heading */}
        {/* Removed: Earning Status Display */}

        {/* Action Buttons (Stop/Pause/Restart) - Kept as requested */}
        <div className="flex flex-wrap justify-center gap-3 sm:gap-4 mb-8">
          {earningStatus === 'active' && (
            <>
              <button
                onClick={handleStopInvestment}
                className="bg-red-500 text-white px-5 py-2 sm:px-6 sm:py-3 rounded-md hover:bg-red-600 transition-all duration-200 ease-in-out shadow-md text-sm sm:text-base transform hover:-translate-y-0.5"
              >
                {t('dashboard_stop_button')}
              </button>
              <button
                onClick={handlePauseInvestment}
                className="bg-yellow-500 text-white px-5 py-2 sm:px-6 sm:py-3 rounded-md hover:bg-yellow-600 transition-all duration-200 ease-in-out shadow-md text-sm sm:text-base transform hover:-translate-y-0.5"
              >
                {t('dashboard_pause_button')}
              </button>
            </>
          )}
          {(earningStatus === 'completed' || earningStatus === 'stopped' || earningStatus === 'paused') && (
            <button
              onClick={handleRestartInvestment}
              className="bg-blue-600 text-white px-5 py-2 sm:px-6 sm:py-3 rounded-md hover:bg-blue-700 transition-all duration-200 ease-in-out shadow-md text-sm sm:text-base transform hover:-translate-y-0.5"
            >
              {t('dashboard_restart_button')}
            </button>
          )}
        </div>

        {/* Investment Overview Section (now the primary investment display) */}
        <InvestmentOverviewSection userData={userData} userInvestment={userInvestment} />
        <PayoutHistorySection userInvestment={userInvestment} />

        {/* Existing Dashboard Components */}
        <BalanceCard />
        <TransactionHistory limit={4} userHistory={userHistory} />
        <ReferSection />
        <Footer />
      </DashboardLayout>
    </>
  );
}

export default protectRoute(Home);
