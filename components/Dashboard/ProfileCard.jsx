// components/ProfileCard.jsx
import React, { useState, useEffect } from 'react';
import { FaUserCircle } from 'react-icons/fa';
import { FiInfo } from 'react-icons/fi';
import Link from 'next/link';
import dayjs from 'dayjs';
import { motion, AnimatePresence } from 'framer-motion';
import { useFirebase } from '@/lib/firebaseContext';
import Notification from '../Notification/notification'; // keep if you have this component

export default function ProfileCard() {
  const { userData, userInvestment, userId } = useFirebase();

  const [showProfileNotification, setShowProfileNotification] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationType, setNotificationType] = useState('success');
  const [notificationMessage, setNotificationMessage] = useState('N/a');

  // Initialize formData from userData
  useEffect(() => {
    if (userData) {
      setFormData(userData);
      const { fullName, phone, userName } = userData;
      if (!fullName || !phone || !userName) {
        setShowProfileNotification(true);
      } else {
        setShowProfileNotification(false);
      }
    }
  }, [userData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  const handleUpdateProfile = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/updateProfile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ formData, userId }),
      });

      if (response.ok) {
        setNotificationMessage('Profile updated successfully!');
        setNotificationType('success');
        setShowNotification(true);
        setIsModalOpen(false);
      } else {
        const err = await response.json();
        setNotificationMessage(`Update failed: ${err.message || 'Unknown error'}`);
        setNotificationType('error');
        setShowNotification(true);
      }
    } catch (err) {
      console.error('Profile update error:', err);
      setNotificationMessage(`An error occurred: ${err.message}`);
      setNotificationType('error');
      setShowNotification(true);
    } finally {
      setLoading(false);
      setTimeout(() => setShowNotification(false), 5000);
    }
  };

  // --- Data we will show (only wallet/ROI + basic fields) ---
  const walletBalance = userData?.walletBalance ?? 0; // from USERS
  const roiBalance = userInvestment?.roiBalance ?? 0; // from INVESTMENT (live)
  const lockedBal = userInvestment?.lockedBal ?? userData?.lockedBal ?? 0; // prefer INVESTMENT lockedBal
  const totalDeposit = userData?.totalDeposit ?? userInvestment?.totalDeposit ?? 0;
  const totalWithdrawal = userData?.totalWithdrawal ?? userInvestment?.totalWithdrawal ?? 0;
  const kycStatus = userData?.kycStatus ?? userData?.kyc ?? 'Pending';

  if (!userData) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-md text-center text-gray-600 mb-8">
        <p>Loading profile data...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 lg:p-8">
      {/* Header */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center justify-between border-b border-gray-200 pb-6">
        <div>
          <h1 className="text-xl lg:text-3xl font-bold text-blue-900">Profile Overview</h1>
          <p className="text-xs lg:text-sm text-gray-600">Personal info and wallet summary</p>
        </div>
        <div className="flex gap-2 justify-start md:justify-end">
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-800 text-white px-4 py-2 rounded text-sm hover:bg-blue-700"
          >
            Edit Profile
          </button>
          <Link href="/dashboard/settings" className="text-sm py-2 px-3 border rounded self-center">
            Settings
          </Link>
        </div>
      </div>

      {/* Profile completeness notice */}
      <AnimatePresence>
        {showProfileNotification && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
            className="border border-yellow-400 bg-yellow-50 text-yellow-800 p-3 rounded flex justify-between items-center"
          >
            <div className="flex items-start gap-2">
              <FiInfo className="text-yellow-600 mt-1" />
              <div className="text-sm">
                Please complete your profile (name, phone, username) to secure your account.
              </div>
            </div>
            <Link href="/dashboard/profile" className="text-sm text-yellow-700 underline">
              Update Profile
            </Link>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top user block */}
      <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg border border-gray-200 flex items-center gap-4">
        <FaUserCircle className="text-6xl text-gray-400" />
        <div>
          <h2 className="text-lg font-semibold text-gray-800">{userData.fullName ?? userData.userName ?? '—'}</h2>
          <p className="text-sm text-gray-500">{userData.email ?? '—'}</p>
          {userData.phone && <p className="text-sm text-gray-500">Phone: {userData.phone}</p>}
          {userData.country && <p className="text-sm text-gray-500">Country: {userData.country}</p>}
        </div>
      </div>

      {/* Wallet / ROI / Summary Grid */}
      <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 border border-gray-200">
        {/* Wallet Balance */}
        <div className="p-3 border border-gray-200 rounded-md shadow-sm bg-gray-50">
          <h3 className="text-sm text-gray-600 mb-1 font-medium">Wallet Balance</h3>
          <p className="text-lg sm:text-xl font-semibold text-gray-900">${Number(walletBalance).toFixed(2)}</p>
        </div>

        {/* ROI Balance (from INVESTMENT) */}
        <div className="p-3 border border-gray-200 rounded-md shadow-sm bg-gray-50">
          <h3 className="text-sm text-gray-600 mb-1 font-medium">ROI Balance</h3>
          <p className="text-lg sm:text-xl font-semibold text-gray-900">${Number(roiBalance).toFixed(2)}</p>
        </div>

        {/* Locked Balance */}
        <div className="p-3 border border-gray-200 rounded-md shadow-sm bg-gray-50">
          <h3 className="text-sm text-gray-600 mb-1 font-medium">Locked Balance</h3>
          <p className="text-lg sm:text-xl font-semibold text-gray-900">${Number(lockedBal).toFixed(2)}</p>
        </div>

        {/* Total Deposit */}
        <div className="p-3 border border-gray-200 rounded-md shadow-sm bg-gray-50">
          <h3 className="text-sm text-gray-600 mb-1 font-medium">Total Deposit</h3>
          <p className="text-lg sm:text-xl font-semibold text-gray-900">${Number(totalDeposit).toFixed(2)}</p>
        </div>

        {/* Total Withdrawal */}
        <div className="p-3 border border-gray-200 rounded-md shadow-sm bg-gray-50">
          <h3 className="text-sm text-gray-600 mb-1 font-medium">Total Withdrawal</h3>
          <p className="text-lg sm:text-xl font-semibold text-gray-900">${Number(totalWithdrawal).toFixed(2)}</p>
        </div>

        {/* KYC Status */}
        <div className="p-3 border border-gray-200 rounded-md shadow-sm bg-gray-50 col-span-1 sm:col-span-2 lg:col-span-3 text-center">
          <h3 className="text-sm text-gray-600 mb-1 font-medium">KYC Status</h3>
          <span
            className={`inline-block text-sm font-medium px-3 py-1 rounded-full ${
              String(kycStatus).toLowerCase() === 'approved'
                ? 'bg-green-100 text-green-700'
                : String(kycStatus).toLowerCase() === 'pending'
                ? 'bg-yellow-100 text-yellow-700'
                : 'bg-red-100 text-red-700'
            }`}
          >
            {String(kycStatus).charAt(0).toUpperCase() + String(kycStatus).slice(1)}
          </span>
        </div>
      </div>

      {/* Personal Info list (keeps original fields) */}
      <div className="bg-white p-4 rounded-md shadow-md">
        <h3 className="text-sm text-gray-600 mb-3 font-medium">Personal Information</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-700">
          <div><strong>Name:</strong> <span className="text-gray-600">{userData.fullName ?? '—'}</span></div>
          <div><strong>Username:</strong> <span className="text-gray-600">{userData.userName ?? '—'}</span></div>
          <div><strong>Email:</strong> <span className="text-gray-600">{userData.email ?? '—'}</span></div>
          <div><strong>Phone:</strong> <span className="text-gray-600">{userData.phone ?? '—'}</span></div>
          <div><strong>Address:</strong> <span className="text-gray-600">{userData.address ?? '—'}</span></div>
          <div><strong>Country:</strong> <span className="text-gray-600">{userData.country ?? '—'}</span></div>
        </div>
      </div>

      {/* Edit Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
          >
            <div className="relative bg-white p-6 w-full max-w-lg mx-auto space-y-4 rounded-md max-h-[85vh] overflow-y-auto">
              <h2 className="text-lg font-semibold">Edit Profile</h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {['fullName', 'userName', 'email', 'phone', 'address', 'country', 'telegram'].map((field) => (
                  <div key={field}>
                    <label className="text-sm font-medium capitalize">{field.replace(/([A-Z])/g, ' $1')}</label>
                    <input
                      type="text"
                      name={field}
                      value={formData?.[field] ?? ''}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 text-sm rounded-md"
                    />
                  </div>
                ))}
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <button onClick={() => setIsModalOpen(false)} className="w-full text-sm px-4 rounded py-2 border">
                  Cancel
                </button>
                <button
                  onClick={handleUpdateProfile}
                  className="text-sm px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 w-full"
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {showNotification && (
        <Notification
          type={notificationType}
          message={notificationMessage}
          onClose={() => setShowNotification(false)}
          show={true}
        />
      )}
    </div>
  );
}
