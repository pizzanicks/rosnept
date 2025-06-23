// pages/signup.js
'use client'; // This component includes client-side hooks

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Head from 'next/head';
import Link from 'next/link';
import Loader from '@/components/Loader';
// import Notification from '@/components/Notification'; // Corrected path (assuming components/Notification.js/jsx)
import Notification from '@/components/Notification/notification';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase'; // Assuming '@/lib/firebase' is correct for client project
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next'; // For translations

export default function SignupPage() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [pageLoading, setPageLoading] = useState(true);

  const [showNotification, setShowNotification] = useState(false);
  const [notificationType, setNotificationType] = useState('success');
  const [notificationMessage, setNotificationMessage] = useState('N/a');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const { referralCode } = router.query;
  const { t } = useTranslation('common'); // Initialize the translation hook


  useEffect(() => {
    const timer = setTimeout(() => {
      setPageLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setNotificationMessage(t('signup_password_mismatch_error')); // Translated
      setNotificationType('error');
      setShowNotification(true);
      setTimeout(() => {
        setShowNotification(false);
      }, 5000);
      return;
    }

    console.log('Full Name:', fullName);
    console.log('Email:', email);
    console.log("password:", password, confirmPassword);

    setLoading(true);

    let userId = null;
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      userId = user.uid;

      const userData = {
        userId: userId,
        email: email,
        fullName: fullName,
        referralCode: referralCode || null,
        // Add initial ROI/investment related fields for new users
        initialInvestmentAmount: 0,
        currentROI: 0,
        currentROIValue: 0,
        roiIncreaseDayCount: 0,
        earningStatus: 'inactive', // Default status for new users
        roiStartDate: null,
        lastROIUpdateDate: null,
        investmentPlanId: null, // User needs to select a plan later
      };

      // Save user data via API (assuming this API route exists and interacts with Firestore)
      const response = await fetch("/api/createUser", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({userData}),
      });

      if (!response.ok) throw new Error("Failed to save user data to Firestore via API");

      setNotificationMessage(t('signup_success_message')); // Translated
      setNotificationType('success');
      setShowNotification(true);
      setTimeout(() => {
        setShowNotification(false);
      }, 5000);

      router.push('/dashboard'); // Redirect to dashboard after successful signup
    } catch (error) {
      console.error("Registration Error:", error);
      setLoading(false);
      setNotificationMessage(t('signup_failed_message')); // Translated
      setNotificationType("error");
      setShowNotification(true);
      setTimeout(() => {
        setShowNotification(false);
      }, 5000);

      // Rollback: Delete user if saving data failed
      if (userId) {
        try {
          // This API route should delete the Firebase Auth user AND their Firestore document if one was created
          const deleteResponse = await fetch("/api/deleteUser", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId }),
          });
          if (!deleteResponse.ok) console.error("Failed to call deleteUser API during rollback.");
          console.log("Rolled back user creation.");
        } catch (cleanupError) {
          console.error("Failed to clean up user:", cleanupError);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  if (pageLoading) {
    return <Loader />;
  }

  return (
    <>
      <Head>
        <title>{t('signup_page_title')}</title>
      </Head>

      <div className="relative w-full min-h-screen bg-cover bg-center" style={{ backgroundImage: `url('/cta.jpg')` }}>
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm lg:backdrop-blur-0"></div>

        <div className="relative z-10 flex items-center justify-center min-h-screen px-4">
          <div className="w-full max-w-5xl rounded-md grid grid-cols-1 lg:grid-cols-5 bg-white lg:bg-transparent bg-opacity-90 backdrop-blur-md overflow-hidden shadow-2xl">

            {/* Left Side */}
            <div className="hidden lg:block lg:col-span-3 bg-blue-950 text-white p-10">
              <h2 className="text-3xl font-bold mb-4 font-garamond">{t('signup_join_heading')}</h2>
              <p className="text-sm mb-6 text-gray-300 font-barlow">
                {t('signup_join_description')}
              </p>

              <div className="mt-auto pt-10 text-sm font-barlow">
                <p className="text-gray-400">{t('signup_need_help')}</p>
                <Link href="mailto:support@Rosnepl.com" className="text-blue-300 hover:text-white">
                  {t('signup_support_email')}
                </Link>
              </div>
            </div>

            {/* Right Side */}
            <div className="col-span-2 p-8 sm:p-10 relative font-barlow bg-white/70 backdrop-blur-md lg:bg-white lg:backdrop-blur-0">
              <div className="relative z-10">
                <div className="mb-6 text-center">
                  <Link href={'/'} legacyBehavior>
                    <Image src={'/logo-2.png'} height={500} width={500} alt='logo image' className="w-32 lg:w-44 h-8 lg:h-10 mb-4 mx-auto" />
                  </Link>{/* <--- FIXED: CLOSING LINK TAG WAS MISSING HERE */}
                  <h3 className="text-lg md:text-xl font-semibold text-gray-800">{t('signup_create_account_heading')}</h3>
                </div>

                <form className="space-y-4" onSubmit={handleSubmit}>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{t('signup_full_name_label')}</label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                      placeholder={t('signup_full_name_placeholder')}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{t('signup_email_label')}</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                      placeholder={t('signup_email_placeholder')}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{t('signup_password_label')}</label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                      placeholder={t('signup_password_placeholder')}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{t('signup_confirm_password_label')}</label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                      placeholder={t('signup_confirm_password_placeholder')}
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="text-sm lg:text-base w-full flex justify-center items-center bg-blue-600 text-white font-medium py-2 hover:bg-blue-700 transition"
                  >
                    {loading ? (
                      <div className="border-2 border-gray-200 border-t-2 border-t-transparent rounded-full w-6 h-6 spinner"></div>
                    ) : (
                      <div className="text-white text-center h-6">{t('signup_button_text')}</div>
                    )}
                  </button>
                </form>

                <p className="text-sm text-center text-gray-600 mt-4">
                  {t('signup_already_have_account')}{' '}
                  <Link href="/auth/login" className="text-blue-600 font-medium hover:underline">
                    {t('signup_login_link')}
                  </Link>
                </p>

                <p className="text-xs text-center text-gray-500 mt-6">
                  &copy; {new Date().getFullYear()} {t('signup_copyright_text')}
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>

      {showNotification && (
        <Notification
          type={notificationType}
          message={notificationMessage}
          onClose={() => setShowNotification(false)}
          show={true}
        />
      )}
    </>
  );
}
