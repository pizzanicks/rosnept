// pages/dashboard/index.js
'use client'; // This component includes client-side hooks

import BalanceCard from "@/components/Dashboard/BalanceCard";
import DashboardLayout from "@/components/Dashboard/DashboardLayout";
import Footer from "@/components/Dashboard/Footer";
import TransactionHistory from "@/components/Dashboard/History";
import ReferSection from "@/components/Dashboard/Refer";
import { useState, useEffect } from "react";
import Loader from "@/components/Dashboard/DbLoader";
import protectRoute from "@/lib/protectRoute"; // Your route protection HOC

// --- NEW IMPORTS FOR ROI DISPLAY & TRANSLATION ---
import Head from 'next/head';
import { doc, onSnapshot } from 'firebase/firestore';
import { useFirebase } from '@/lib/firebaseContext'; // Assuming this hook provides `user` and `db`
import { useTranslation } from 'next-i18next';
// --- END NEW IMPORTS ---

function Home() {
  // --- EXISTING STATE ---
  const [pageLoading, setPageLoading] = useState(true);

  // --- NEW STATE FOR ROI DATA ---
  const { user, db } = useFirebase(); // Get authenticated user and Firestore instance
  const { t } = useTranslation('common'); // Initialize translation hook

  const [userData, setUserData] = useState(null);
  const [loadingUserData, setLoadingUserData] = useState(true);
  const [error, setError] = useState(null);
  // --- END NEW STATE ---

  // --- EXISTING INITIAL PAGE LOAD EFFECT ---
  useEffect(() => {
    const timer = setTimeout(() => {
      setPageLoading(false);
    }, 1000); // Simulate initial page load delay

    return () => clearTimeout(timer);
  }, []);
  // --- END EXISTING EFFECT ---

  // --- NEW EFFECT FOR FETCHING USER ROI DATA ---
  useEffect(() => {
    if (!db || !user?.uid) { // Ensure Firestore and user ID are available
      setLoadingUserData(false);
      return;
    }

    const userDocRef = doc(db, 'users', user.uid); // Reference to the specific user's document

    // Set up a real-time listener for the user's document
    const unsubscribe = onSnapshot(userDocRef, (docSnapshot) => {
      if (docSnapshot.exists()) {
        setUserData(docSnapshot.data());
        console.log("User Data Updated:", docSnapshot.data()); // For debugging
      } else {
        console.log("No user data found for ID:", user.uid);
        setUserData(null); // Document might not exist yet (e.g., new user)
      }
      setLoadingUserData(false);
      setError(null); // Clear any previous errors
    }, (err) => {
      console.error("Error fetching user data:", err);
      setError(t('dashboard_data_fetch_error')); // Translate error message
      setLoadingUserData(false);
    });

    // Clean up the listener when the component unmounts
    return () => unsubscribe();
  }, [db, user?.uid, t]); // Re-run when db or user.uid changes
  // --- END NEW EFFECT ---

  // --- LOADER RENDERING ---
  if (pageLoading || loadingUserData) { // Show loader while initial page loading or fetching user data
    return (
      <DashboardLayout>
        <Loader />
      </DashboardLayout>
    );
  }

  // --- ERROR RENDERING ---
  if (error) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-full">
          <p className="text-red-600 text-lg">{error}</p>
        </div>
      </DashboardLayout>
    );
  }

  // --- DATA EXTRACTION (default to 0 or 'inactive' if not found) ---
  const initialInvestmentAmount = userData?.initialInvestmentAmount || 0;
  const currentROIValue = userData?.currentROIValue || 0;
  const currentROI = userData?.currentROI || 0;
  const roiIncreaseDayCount = userData?.roiIncreaseDayCount || 0;
  const earningStatus = userData?.earningStatus || 'inactive'; // Default status if not set

  // --- ACTION HANDLERS (for Stop/Pause/Restart buttons) ---
  const handleStopInvestment = async () => {
    if (db && user?.uid) {
      try {
        await doc(db, 'users', user.uid).update({ earningStatus: 'stopped' });
        console.log("Investment stopped successfully!");
      } catch (error) {
        console.error("Error stopping investment:", error);
        setError(t('dashboard_stop_error'));
      }
    }
  };

  const handlePauseInvestment = async () => {
    if (db && user?.uid) {
      try {
        await doc(db, 'users', user.uid).update({ earningStatus: 'paused' });
        console.log("Investment paused successfully!");
      } catch (error) {
        console.error("Error pausing investment:", error);
        setError(t('dashboard_pause_error'));
      }
    }
  };

  const handleRestartInvestment = async () => {
    if (db && user?.uid) {
      try {
        await doc(db, 'users', user.uid).update({
          earningStatus: 'active',
          currentROI: 0,
          currentROIValue: 0,
          roiIncreaseDayCount: 0,
          roiStartDate: new Date(), // Reset start date to now
          lastROIUpdateDate: new Date() // Reset last update date to now
        });
        console.log("Investment restarted successfully!");
      } catch (error) {
        console.error("Error restarting investment:", error);
        setError(t('dashboard_restart_error'));
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
        {/* Welcome Heading */}
        <h1 className="text-3xl font-extrabold text-gray-900 mb-6 text-center font-garamond">
          {t('dashboard_welcome', { username: user?.displayName || user?.email || t('dashboard_user') })}
        </h1>

        {/* ROI Display Cards (New Section) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-blue-50 p-6 rounded-md shadow-sm">
            <p className="text-sm text-blue-700 uppercase font-bold mb-2">{t('dashboard_initial_investment_label')}</p>
            <p className="text-2xl font-semibold text-gray-800">${initialInvestmentAmount.toFixed(2)}</p>
          </div>
          <div className="bg-green-50 p-6 rounded-md shadow-sm">
            <p className="text-sm text-green-700 uppercase font-bold mb-2">{t('dashboard_current_roi_value_label')}</p>
            <p className="text-2xl font-semibold text-gray-800">${currentROIValue.toFixed(2)}</p>
          </div>
          <div className="bg-purple-50 p-6 rounded-md shadow-sm">
            <p className="text-sm text-purple-700 uppercase font-bold mb-2">{t('dashboard_cumulative_roi_percent_label')}</p>
            <p className="text-2xl font-semibold text-gray-800">{currentROI.toFixed(2)}%</p>
          </div>
          <div className="bg-yellow-50 p-6 rounded-md shadow-sm">
            <p className="text-sm text-yellow-700 uppercase font-bold mb-2">{t('dashboard_roi_day_count_label')}</p>
            <p className="text-2xl font-semibold text-gray-800">{roiIncreaseDayCount} / 7 {t('dashboard_days')}</p>
          </div>
        </div>

        {/* Earning Status Display */}
        <div className="text-center mb-6">
          <p className="text-lg text-gray-700">
            {t('dashboard_earning_status_label')}:{' '}
            <span className={`font-semibold ${
                earningStatus === 'active' ? 'text-green-600' :
                earningStatus === 'completed' ? 'text-blue-600' :
                earningStatus === 'paused' ? 'text-yellow-600' :
                'text-red-600'
            }`}>
                {t(`earning_status_${earningStatus}`)}
            </span>
          </p>
        </div>

        {/* Action Buttons (Stop/Pause/Restart) */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          {earningStatus === 'active' && (
            <>
              <button
                onClick={handleStopInvestment}
                className="bg-red-500 text-white px-6 py-3 rounded-md hover:bg-red-600 transition-colors"
              >
                {t('dashboard_stop_button')}
              </button>
              <button
                onClick={handlePauseInvestment}
                className="bg-yellow-500 text-white px-6 py-3 rounded-md hover:bg-yellow-600 transition-colors"
              >
                {t('dashboard_pause_button')}
              </button>
            </>
          )}
          {(earningStatus === 'completed' || earningStatus === 'stopped' || earningStatus === 'paused') && (
            <button
              onClick={handleRestartInvestment}
              className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors"
            >
              {t('dashboard_restart_button')}
            </button>
          )}
        </div>

        {/* Existing Dashboard Components */}
        <BalanceCard />
        <TransactionHistory limit={4} />
        <ReferSection />
        <Footer />
      </DashboardLayout>
    </>
  );
}

export default protectRoute(Home);
