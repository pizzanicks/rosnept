// components/ProfileSection/ProfileSection.jsx
import { useState, useEffect } from 'react';
import { FiInfo } from 'react-icons/fi';
import Link from 'next/link';
import dayjs from 'dayjs';
import { motion, AnimatePresence } from 'framer-motion';
import { useFirebase } from '@/lib/firebaseContext'; // Your Firebase context
import Notification from '../Notification/notification'; // Assuming Notification path

export default function ProfileSection() {
    // Get all necessary data directly from your FirebaseContext
    // No need for separate onSnapshot calls in this component
    const { userData, userId, userInvestment } = useFirebase();

    const [showProfileNotification, setShowProfileNotification] = useState(false);
    const [showNotification, setShowNotification] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({});
    const [loading, setLoading] = useState(false);
    const [notificationType, setNotificationType] = useState('success');
    const [notificationMessage, setNotificationMessage] = useState('N/a');

    // Effect to initialize form data when userData becomes available or changes
    useEffect(() => {
        if (userData) {
            setFormData(userData); // Initialize form with existing user data

            // Check for profile completeness and show notification
            const { fullName, phone, userName } = userData;
            if (!fullName || !phone || !userName) { // You might want to add more fields here
                setShowProfileNotification(true);
            } else {
                setShowProfileNotification(false); // Hide if profile is complete
            }
        }
    }, [userData]); // Re-run when userData from context changes

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
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
                // Since your FirebaseContext uses onSnapshot, the userData
                // will automatically update after the Firestore write from your API.
                setNotificationMessage('Profile updated successfully!');
                setNotificationType('success');
                setShowNotification(true);
                setIsModalOpen(false);
            } else {
                const errorData = await response.json();
                setNotificationMessage(`Update failed: ${errorData.message || 'Unknown error'}`);
                setNotificationType('error');
                setShowNotification(true);
            }
        } catch (error) {
            console.error('An error occurred during profile update:', error);
            setNotificationMessage(`An error occurred: ${error.message}`);
            setNotificationType('error');
            setShowNotification(true);
        } finally {
            setLoading(false);
            setTimeout(() => setShowNotification(false), 5000);
        }
    };

    // --- Data Extraction for Display (from FirebaseContext data) ---
    // User data from USERS document via userData
    const walletBalance = userData?.walletBalance ?? 0; // Using nullish coalescing operator (??)
    const currentPlanDaysCompleted = userData?.currentPlanDaysCompleted ?? 0;
    const currentPlanRoiPercentage = userData?.currentPlanRoiPercentage ?? 0;
    const lastRoiPaymentDate = userData?.lastRoiPaymentDate ?? 'N/A';
    const hasActiveInvestments = userData?.hasActiveInvestments ?? false;
    const earningStatus = userData?.earningStatus ?? 'inactive';

    // Investment data from INVESTMENT document via userInvestment
    const investmentPlanName = userInvestment?.activePlan?.planName ?? 'N/A';
    const investmentAmount = userInvestment?.activePlan?.amount ?? 0;
    const payoutLogs = userInvestment?.payoutLogs ?? [];
    const totalDeposit = userInvestment?.totalDeposit ?? 0;
    const totalWithdrawal = userInvestment?.totalWithdrawal ?? 0;

    // Calculations for display
    const totalRoiEarned = payoutLogs.reduce((sum, log) => sum + (log.amount ?? 0), 0);
    // Ensure we don't divide by zero if currentPlanDaysCompleted is 0
    const avgRoiPerDay = currentPlanDaysCompleted > 0 ? totalRoiEarned / currentPlanDaysCompleted : 0;
    const progressPercent = (currentPlanDaysCompleted / 7) * 100; // Assuming 7 days is target
    // Determine investment status based on currentPlanDaysCompleted and hasActiveInvestments
    const investmentStatus = currentPlanDaysCompleted >= 7 ? 'Completed' : (hasActiveInvestments ? 'Active' : 'Inactive');

    // Show a loading state if `userData` or `userInvestment` hasn't loaded yet
    if (!userData || !userInvestment) {
        return (
            <div className="flex justify-center items-center h-screen">
                <p>Loading your dashboard...</p> {/* You can replace this with your Loader component */}
            </div>
        );
    }

    return (
        <div className="space-y-8 p-2 lg:p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center justify-between border-b border-gray-300 pb-8">
                <div>
                    <h1 className="text-xl lg:text-3xl font-bold text-blue-900 mb-8">Profile Dashboard</h1>
                    <h2 className="text-xs lg:text-sm text-gray-600">View your personal information and investment overview.</h2>
                </div>
            </div>

            {/* Notification for incomplete profile */}
            <AnimatePresence>
                {showProfileNotification && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        transition={{ duration: 0.3 }}
                        className="border border-yellow-400 bg-yellow-50 text-yellow-800 p-4 rounded flex flex-col lg:flex-row justify-between items-start gap-4 lg:gap-2"
                    >
                        <div className="flex gap-2 items-start">
                            <FiInfo className="mt-1 text-yellow-600 cursor-pointer" />
                            <span className="text-sm">Please update your profile information to keep your account secure.</span>
                        </div>
                        <Link href="/profile" className="text-blue-600 underline whitespace-nowrap text-sm self-end">
                            Update Profile
                        </Link>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* --- NEW SECTION: Investment Overview --- */}
            <h2 className="text-lg font-medium lg:font-semibold mb-2 mt-8">Investment Overview</h2>
            <p className="text-xs lg:text-sm text-gray-600">Your current earnings, plan status, and financial summaries.</p>

            <div className="bg-white p-4 rounded-md shadow-md grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="p-3 border rounded-md">
                    <h3 className="text-sm text-gray-600 mb-1">Wallet Balance</h3>
                    <p className="text-lg font-semibold">${walletBalance.toFixed(2)}</p>
                </div>
                <div className="p-3 border rounded-md">
                    <h3 className="text-sm text-gray-600 mb-1">Current Plan</h3>
                    <p className="text-lg font-semibold">{investmentPlanName}</p>
                </div>
                <div className="p-3 border rounded-md">
                    <h3 className="text-sm text-gray-600 mb-1">Invested Amount</h3>
                    <p className="text-lg font-semibold">${investmentAmount.toFixed(2)}</p>
                </div>
                <div className="p-3 border rounded-md">
                    <h3 className="text-sm text-gray-600 mb-1">Daily ROI %</h3>
                    <p className="text-lg font-semibold">{currentPlanRoiPercentage * 100}%</p>
                </div>
                <div className="p-3 border rounded-md">
                    <h3 className="text-sm text-gray-600 mb-1">Days Completed</h3>
                    <p className="text-lg font-semibold">{currentPlanDaysCompleted} days</p>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${progressPercent}%` }}></div>
                    </div>
                </div>
                <div className="p-3 border rounded-md">
                    <h3 className="text-sm text-gray-600 mb-1">Last Payout Date</h3>
                    <p className="text-lg font-semibold">{lastRoiPaymentDate}</p>
                </div>
                <div className="p-3 border rounded-md">
                    <h3 className="text-sm text-gray-600 mb-1">Total Deposit</h3>
                    <p className="text-lg font-semibold">${totalDeposit.toFixed(2)}</p>
                </div>
                <div className="p-3 border rounded-md">
                    <h3 className="text-sm text-gray-600 mb-1">Total Withdrawal</h3>
                    <p className="text-lg font-semibold">${totalWithdrawal.toFixed(2)}</p>
                </div>
                <div className="p-3 border rounded-md">
                    <h3 className="text-sm text-gray-600 mb-1">Investment Status</h3>
                    <span className={`inline-block text-sm font-medium px-3 py-1 rounded-full ${investmentStatus === 'Active' ? 'bg-green-100 text-green-700' : investmentStatus === 'Completed' ? 'bg-gray-200 text-gray-700' : 'bg-red-100 text-red-700'}`}>
                        {investmentStatus}
                    </span>
                </div>
                 <div className="p-3 border rounded-md">
                    <h3 className="text-sm text-gray-600 mb-1">Earning Status</h3>
                    <span className={`inline-block text-sm font-medium px-3 py-1 rounded-full ${earningStatus === 'running' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                        {earningStatus}
                    </span>
                </div>
            </div>

            {/* --- NEW SECTION: Payout History --- */}
            <h2 className="text-lg font-medium lg:font-semibold mb-2 mt-8">Payout History</h2>
            <p className="text-xs lg:text-sm text-gray-600">A detailed log of your earned ROI payouts.</p>
            <div className="bg-white p-4 rounded-md shadow-md">
                <ul className="divide-y divide-gray-200 max-h-64 overflow-y-auto">
                    {payoutLogs.length === 0 ? (
                        <li className="text-gray-500 text-sm py-2">No ROI payouts yet.</li>
                    ) : (
                        payoutLogs.map((log, i) => (
                            <li key={i} className="py-2 text-sm flex justify-between items-center">
                                <span>{log.date}</span> {/* Ensure log.date is formatted as string */}
                                <span className="text-green-600 font-medium">+${(log.amount ?? 0).toFixed(2)}</span>
                            </li>
                        ))
                    )}
                </ul>
            </div>

            {/* Original Personal Information Section */}
            <h2 className="text-lg font-medium lg:font-semibold mb-2 mt-8">Personal Information</h2>
            <p className="text-xs lg:text-sm text-gray-600">Basic info like name, phone, email and other info that you use on our platform</p>

            <div className="bg-white p-4 rounded-md shadow-md">
                {userData && ['fullName', 'userName', 'email', 'phone', 'address', 'country', 'gender', 'dob', 'telegram'].map((field) => (
                    <motion.div
                        key={field}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                        className="flex justify-between border-b border-gray-100 py-2 lg:py-3 text-sm"
                    >
                        <span className="text-sm lg:text-base font-medium capitalize">{field.replace(/([A-Z])/g, ' $1')}</span>
                        <span className="text-sm lg:text-base text-gray-700">{userData?.[field] ?? '—'}</span>
                    </motion.div>
                ))}

                <button
                    onClick={() => setIsModalOpen(true)}
                    className="w-full bg-blue-800 text-white rounded text-sm py-2 hover:bg-blue-700 mt-4"
                >
                    Edit Info
                </button>
            </div>

            {/* Modal for editing profile (unchanged from your version) */}
            <AnimatePresence>
                {isModalOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 modal-pop"
                    >
                        <div className="relative bg-white p-6 w-full max-w-lg mx-auto space-y-4 rounded-md max-h-[85vh] overflow-y-auto sm:max-h-full">
                            <h2 className="text-lg font-semibold">Edit Profile</h2>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {['fullName', 'userName', 'email', 'phone', 'address', 'country', 'gender', 'telegram'].map((field) => (
                                    <div key={field}>
                                        <label className="text-sm font-medium capitalize">{field.replace(/([A-Z])/g, ' $1')}</label>
                                        {field === 'gender' ? (
                                            <select
                                                name="gender"
                                                value={formData.gender ?? ''} // Use ?? for form inputs
                                                onChange={handleInputChange}
                                                className="w-full p-2 border border-gray-300 text-sm rounded-md"
                                            >
                                                <option value="" disabled>Select Gender</option>
                                                <option value="Male">Male</option>
                                                <option value="Female">Female</option>
                                                <option value="Prefer not to say">Prefer not to say</option>
                                            </select>
                                        ) : (
                                            <input
                                                type="text"
                                                name={field}
                                                value={formData[field] ?? ''} // Use ?? for form inputs
                                                onChange={handleInputChange}
                                                className="w-full p-2 border border-gray-300 text-sm rounded-md"
                                            />
                                        )}
                                    </div>
                                ))}
                                <div className="col-span-full">
                                    <label className="text-sm font-medium">Date of Birth</label>
                                    <input
                                        type="date"
                                        name="dob"
                                        max={dayjs().format('YYYY-MM-DD')}
                                        value={formData.dob ?? ''} // Use ?? for form inputs
                                        onChange={handleInputChange}
                                        className="w-full p-2 border border-gray-300 text-sm rounded-md"
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end gap-2 pt-4">
                                <button onClick={() => setIsModalOpen(false)} className="w-full text-sm px-4 rounded py-2 border">
                                    Cancel
                                </button>
                                <button onClick={handleUpdateProfile} className="text-sm px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 w-full flex justify-center items-center">
                                    {loading ? (
                                        <div className="border-2 border-gray-200 border-t-2 border-t-transparent rounded-full w-6 h-6 spinner"></div>
                                        ) : (
                                        <div className="text-white text-center h-6">Save Changes</div>
                                    )}
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