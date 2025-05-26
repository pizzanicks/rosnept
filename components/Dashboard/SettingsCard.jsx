import { useEffect, useState } from 'react';
import { FaInfoCircle } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useFirebase } from '@/lib/firebaseContext';
import { updatePassword, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import Notification from '../Notification/notification';


export default function SettingsPreview() {
    const [passwords, setPasswords] = useState({
        current: '',
        new: '',
        confirm: '',
    });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedAccount, setSelectedAccount] = useState(null);
    const { userInvestment, userId, userWallets } = useFirebase();
    const [isPaymentOptionModalOpen, setIsPaymentOptionModalOpen] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('crypto');
    const [cryptoCurrency, setCryptoCurrency] = useState("");
    const [walletAddress, setWalletAddress] = useState('');
    const [showNotification, setShowNotification] = useState(false);
    const [notificationType, setNotificationType] = useState('success');
    const [notificationMessage, setNotificationMessage] = useState('N/a');
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [editing, setEditing] = useState(false);
    const [newWalletAddress, setNewWalletAddress] = useState('');
    const [newBankName, setNewBankName] = useState('');
    const [newAccountNumber, setNewAccountNumber] = useState('');
    const [bankDetails, setBankDetails] = useState({
        accountNumber: "",
        bankName: "",
    });

    useEffect(() => {
        if (selectedAccount) {
            setNewWalletAddress(selectedAccount.walletAddress || '');
            setNewBankName(selectedAccount.bankName || '');
            setNewAccountNumber(selectedAccount.accountNumber || '');
        }
    }, [selectedAccount]);
    

    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswords((prev) => ({ ...prev, [name]: value }));
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();

        // console.log("password:", passwords);
    
        if (passwords.new !== passwords.confirm) {
            setNotificationMessage('New password and confirmation do not match.');
            setNotificationType('warning');
            setShowNotification(true);
            setTimeout(() => {
                setShowNotification(false);
            }, 5000);
            return;
        }

        setLoading(true);
    
        try {
            // Get current user
            const user = auth.currentUser;
    
            if (!user) {
                // console.error("User not authenticated.");
                setLoading(false);
                setNotificationMessage('User not authenticated.');
                setNotificationType('error');
                setShowNotification(true);
                setTimeout(() => {
                    setShowNotification(false);
                }, 5000);
                return;
            }
    
            // Reauthenticate the user with current password
            const credential = EmailAuthProvider.credential(user.email, passwords.current);
            await reauthenticateWithCredential(user, credential);
    
            // Update password
            await updatePassword(user, passwords.new);
            setLoading(false);
            setNotificationMessage('Password changed successfully.');
            setNotificationType('success');
            setShowNotification(true);
            setTimeout(() => {
                setShowNotification(false);
            }, 5000);
            
            // Optionally, reset the form
            setPasswords({
                current: '',
                new: '',
                confirm: '',
            });
    
        } catch (error) {
            console.error("Error changing password:", error.message);
            setLoading(false);
            setNotificationMessage('Error changing password. Please try again.');
            setNotificationType('error');
            setShowNotification(true);
            setTimeout(() => {
                setShowNotification(false);
            }, 5000);
        }
    };

    const handleAddAccount = async () => {
        setSaving(true);
        const accountData = paymentMethod === 'crypto'
            ? {
                method: "crypto",
                currency: cryptoCurrency,
                walletAddress: walletAddress,
            }
            : paymentMethod === 'bank'
            ? {
                method: "bank",
                bankName: bankDetails.bankName,
                accountNumber: bankDetails.accountNumber,
            }
            : null;
    
        if (!accountData) {
            console.log("No payment method selected");
            setNotificationMessage('No payment method selected');
            setNotificationType('warning');
            setShowNotification(true);
            setSaving(false);
            setTimeout(() => {
                setShowNotification(false);
            }, 5000);
            return;
        }
    
        try {
            const response = await fetch('/api/savePaymentAccount', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({accountData, userId}),
            });
    
            const data = await response.json();
            if (response.ok) {
                console.log('Account saved successfully:', data);
                setNotificationMessage('Payment option added successfully');
                setNotificationType('success');
                setShowNotification(true);
                setSaving(false);
                setIsPaymentOptionModalOpen(false);
                setTimeout(() => {
                    setShowNotification(false);
                }, 5000);
            } else {
                console.error('Error saving account:', data);
                setNotificationMessage('Error adding payment option');
                setNotificationType('error');
                setShowNotification(true);
                setSaving(false);
                setTimeout(() => {
                    setShowNotification(false);
                }, 5000);
            }
        } catch (error) {
            console.error("An error occurred:", error);
            setNotificationMessage('An error occurred');
            setNotificationType('error');
            setShowNotification(true);
            setSaving(false);
            setTimeout(() => {
                setShowNotification(false);
            }, 5000);
        }
    };

    const handleEditAccount = async () => {
        setEditing(true);
    
        if (!selectedAccount) {
            console.error("No account selected for editing");
            setNotificationMessage('No account selected');
            setNotificationType('warning');
            setShowNotification(true);
            setEditing(false);
            setTimeout(() => setShowNotification(false), 5000);
            return;
        }
    
        // Clone and update the selectedAccount with new values
        let updatedAccount = { ...selectedAccount };
    
        if (selectedAccount.method === "crypto") {
            updatedAccount.walletAddress = newWalletAddress;
        } else {
            updatedAccount.bankName = newBankName;
            updatedAccount.accountNumber = newAccountNumber;
        }
    
        try {
            const response = await fetch('/api/updatePaymentAccount', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ account: updatedAccount, userId }),
            });
    
            const data = await response.json();
    
            if (response.ok) {
                console.log("Updated Account:", data);
                setNotificationMessage('Payment option updated successfully');
                setNotificationType('success');
                setShowNotification(true);
                setIsModalOpen(false);
            } else {
                console.error("Error updating account:", data);
                setNotificationMessage('Error updating payment option');
                setNotificationType('error');
                setShowNotification(true);
            }
        } catch (error) {
            console.error("An error occurred:", error);
            setNotificationMessage('An error occurred');
            setNotificationType('error');
            setShowNotification(true);
        } finally {
            setEditing(false);
            setTimeout(() => setShowNotification(false), 5000);
        }
    };    
    

  return (
    <div className="space-y-8 p-2 lg:p-8">

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center justify-between border-b border-gray-300 pb-8">
            <div>
                <motion.h1 
                    className="text-xl lg:text-3xl font-bold text-blue-900 mb-8"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    Manage Settings
                </motion.h1>
                <motion.h2 
                    className="text-xs lg:text-sm text-gray-600"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                >
                    You have full control to manage your account settings and security preferences.
                </motion.h2>
            </div>
        </div>
        {/* Account Settings */}
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
        >
            <h2 className="text-base lg:text-xl font-medium lg:font-bold text-blue-900 mb-2 flex justify-between items-center">
                Account Settings
                {userWallets?.length < 2 &&
                    <button
                        onClick={() => setIsPaymentOptionModalOpen(true)}
                        className="bg-blue-800 text-white font-medium py-2 px-4 text-sm rounded hover:bg-blue-700"
                    >
                        Add Payment Option
                    </button>
                }
            </h2>
            <p className="text-xs lg:text-sm text-gray-600 mb-6">
                Below are your preferred accounts for receiving withdrawn funds. You can manage them anytime.
            </p>

            <div className="space-y-4">
                {userWallets?.length === 0 ? (
                    <div className="bg-white border rounded-md p-4 h-28 lg:h-40 flex justify-center items-center text-center text-gray-500">
                        <p className='text-sm lg:text-base'>No account found</p>
                    </div>
                ) : (
                    userWallets?.map((account, index) => (
                    <motion.div
                        key={index}
                        className="bg-white shadow-sm border rounded-md p-4 flex flex-col sm:flex-row sm:justify-between sm:items-start"
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.7 + index * 0.2 }}
                    >
                        <div className="space-y-4 lg:space-y-8">
                        {/* Render based on account type */}
                        {account.method === "crypto" ? (
                            <>
                            <div>
                                <p className="text-xs text-gray-500 uppercase">Currency</p>
                                <p className="font-semibold text-sm uppercase">{account.currency}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 uppercase">Crypto Wallet</p>
                                <p className="text-sm text-gray-700">{account.walletAddress}</p>
                            </div>
                            </>
                        ) : (
                            <>
                            <div>
                                <p className="text-xs text-gray-500 uppercase">Bank Name</p>
                                <p className="font-semibold text-sm">{account.bankName}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 uppercase">Account Number</p>
                                <p className="text-sm text-gray-700">{account.accountNumber}</p>
                            </div>
                            </>
                        )}
                        </div>

                        <button
                        onClick={() => {
                            setSelectedAccount(account);
                            setIsModalOpen(true);
                        }}
                        className="mt-4 sm:mt-0 sm:ml-4 px-4 py-2 text-sm bg-blue-800 text-white rounded hover:bg-blue-700"
                        >
                        Edit Info
                        </button>
                    </motion.div>
                    ))
                )}
            </div>

        </motion.div>

        {/* Password Settings */}
        <div>
            <h2 className="text-base lg:text-xl font-medium lg:font-bold text-blue-900 mb-2">Password Settings</h2>
            <p className="text-xs lg:text-sm text-gray-600 mb-6">
                To maintain your account security, we recommend updating your password regularly.
            </p>

            <motion.form
                onSubmit={handleSubmit}
                className="bg-white shadow-sm border rounded-md p-4 space-y-4 max-w-xl"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6 }}
            >
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                >
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        <span className="inline-flex items-center">
                            Current Password
                            <span className="text-red-600 text-lg ml-1">*</span>
                        </span>
                    </label>
                    <input
                        type="password"
                        name="current"
                        value={passwords.current}
                        onChange={handlePasswordChange}
                        className="w-full border p-2 rounded-md text-sm"
                        placeholder="********"
                    />
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                >
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        <span className="inline-flex items-center">
                            New Password
                            <span className="text-red-600 text-lg ml-1">*</span>
                        </span>
                    </label>
                    <input
                        type="password"
                        name="new"
                        value={passwords.new}
                        onChange={handlePasswordChange}
                        className="w-full border p-2 rounded-md text-sm"
                        placeholder="********"
                    />
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6, duration: 0.5 }}
                >
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        <span className="inline-flex items-center">
                            Confirm New Password
                            <span className="text-red-600 text-lg ml-1">*</span>
                        </span>
                    </label>
                    <input
                        type="password"
                        name="confirm"
                        value={passwords.confirm}
                        onChange={handlePasswordChange}
                        className="w-full border p-2 rounded-md text-sm"
                        placeholder="********"
                    />
                </motion.div>

                <motion.div
                    className="flex justify-end"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8, duration: 0.5 }}
                >
                    <button
                        type="submit"
                        className="bg-blue-800 text-white text-sm px-4 py-2 rounded hover:bg-blue-700 w-full lg:w-auto"
                    >
                        {loading ? (
                            <div className="border-2 border-gray-200 border-t-2 border-t-transparent rounded-full w-5 h-5 spinner"></div>
                        ) : (
                            <div className="text-white text-center h-5">Change Password</div>
                        )}
                    </button>
                </motion.div>
            </motion.form>
        </div>

        {isModalOpen && (
            <motion.div
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 modal-pop"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
            >
                <motion.div
                    className="bg-white p-6 rounded-md w-full max-w-md relative space-y-4"
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.1, duration: 0.4 }}
                >
                    <h3 className="text-lg font-medium text-blue-800">Edit Account Info</h3>

                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">Currency</label>
                        <input
                            type="text"
                            value={selectedAccount?.currency}
                            readOnly
                            className="w-full p-2 border border-gray-300 rounded-md text-sm bg-gray-100 cursor-not-allowed"
                        />
                    </div>

                    {selectedAccount?.method === "crypto" ? (
                        <div>
                            <label className="block text-sm font-medium text-gray-600 mb-1">Wallet Address</label>
                            <input
                                type="text"
                                value={newWalletAddress}
                                onChange={(e) => setNewWalletAddress(e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded-md text-sm"
                            />
                        </div>
                    ) : (
                        <>
                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-1">Bank Name</label>
                                <input
                                    type="text"
                                    value={newBankName}
                                    onChange={(e) => setNewBankName(e.target.value)}
                                    className="w-full p-2 border border-gray-300 rounded-md text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-1">Account Number</label>
                                <input
                                    type="text"
                                    value={newAccountNumber}
                                    onChange={(e) => setNewAccountNumber(e.target.value)}
                                    className="w-full p-2 border border-gray-300 rounded-md text-sm"
                                />
                            </div>
                        </>
                    )}

                    <div className="flex justify-end gap-2 pt-4">
                        <button
                            onClick={() => setIsModalOpen(false)}
                            className="w-full text-sm px-4 py-2 border rounded-md"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleEditAccount}
                            className="w-full text-sm px-4 py-2 bg-blue-800 text-white rounded-md hover:bg-blue-700 flex justify-center items-center"
                        >
                            {editing ? (
                            <div className="border-2 border-gray-200 border-t-2 border-t-transparent rounded-full w-6 h-6 spinner"></div>
                            ) : (
                            <div className="text-white text-center h-6">Save</div>
                            )}
                        </button>
                    </div>
                    <div className="border-t pt-4 flex items-start text-red-600 text-xs space-x-2">
                        <span className="mt-0.5">
                            <FaInfoCircle className="text-red-500 text-sm" />
                        </span>
                        <p>
                            Please ensure this wallet address is correct and belongs to you. Providing a wrong or inaccessible address may result in permanent loss of funds.
                        </p>
                    </div>
                </motion.div>
            </motion.div>
        )}

        {isPaymentOptionModalOpen && (
            <motion.div
                className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 modal-pop"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
            >
                <div className="bg-white p-6 rounded-lg w-[90%] sm:w-[400px] shadow-lg">
                    <h3 className="text-lg font-medium text-blue-800 mb-4">Add Payment Account</h3>
                    <div>
                        <label htmlFor="paymentMethod" className="block text-sm text-gray-600 mb-2">
                            Payment Method
                        </label>
                        <select
                            id="paymentMethod"
                            value={paymentMethod}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                            className="block w-full p-2 mb-4 border text-sm lg:text-base rounded-md focus:outline-none focus:ring-1 focus:ring-blue-300"
                        >
                            <option value="crypto">Cryptocurrency</option>
                            <option value="bank">Bank Account</option>
                        </select>

                        {paymentMethod === 'crypto' ? (
                            <>
                                <div className="mb-0">
                                    <label className="block text-sm text-gray-600 mb-2">Currency</label>
                                    <select
                                        value={cryptoCurrency}
                                        onChange={(e) => setCryptoCurrency(e.target.value)}
                                        className="w-full p-2 mb-4 border text-sm lg:text-base rounded-md focus:outline-none focus:ring-1 focus:ring-blue-300"
                                    >
                                        <option value="" disabled>Select Currency</option>
                                        <option value="usdt">USDT</option>
                                        <option value="btc">BTC</option>
                                    </select>
                                </div>

                                <div className="mb-4">
                                    <label className="block text-sm text-gray-600 mb-2">Wallet Address</label>
                                    <input
                                        type="text"
                                        value={walletAddress}
                                        onChange={(e) => setWalletAddress(e.target.value)}
                                        className="w-full p-2 border text-sm lg:text-base rounded-md focus:outline-none focus:ring-1 focus:ring-blue-300"
                                        placeholder="Enter Wallet Address"
                                    />
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="mb-0">
                                    <label className="block text-sm text-gray-600 mb-2">Bank Name</label>
                                    <input
                                        type="text"
                                        value={bankDetails.bankName}
                                        onChange={(e) => setBankDetails({ ...bankDetails, bankName: e.target.value })}
                                        className="w-full p-2 mb-4 border text-sm lg:text-base rounded-md focus:outline-none focus:ring-1 focus:ring-blue-300"
                                        placeholder="Enter Bank Name"
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-sm text-gray-600 mb-2">Account Number</label>
                                    <input
                                        type="text"
                                        value={bankDetails.accountNumber}
                                        onChange={(e) => setBankDetails({ ...bankDetails, accountNumber: e.target.value })}
                                        className="w-full p-2 mb-4 border text-sm lg:text-base rounded-md focus:outline-none focus:ring-1 focus:ring-blue-300"
                                        placeholder="Enter Account Number"
                                    />
                                </div>
                            </>
                        )}
                        
                        <div className='w-full flex flex-row-reverse justify-between gap-2'>
                            <button
                                onClick={handleAddAccount}
                                className="w-full bg-blue-800 text-white py-2 px-4 rounded text-sm font-medium hover:bg-blue-700 flex justify-center items-center"
                            >
                                {saving ? (
                                <div className="border-2 border-gray-200 border-t-2 border-t-transparent rounded-full w-5 h-5 spinner"></div>
                                ) : (
                                <div className="text-white text-center h-5">Save Account</div>
                                )}
                            </button>
                            <button
                                onClick={() => {
                                    setIsPaymentOptionModalOpen(false);
                                }}
                                className="w-full bg-transparent text-gray-800 border border-gray-800 py-2 px-4 rounded text-sm font-medium flex justify-center items-center"
                            >
                                Cancel
                            </button>
                        </div>

                        {paymentMethod === 'bank' && (
                            <p className="text-xs text-gray-500 mt-6 italic">
                                Please ensure that the bank account you provide matches the name on your Rosnept profile to avoid any issues.
                            </p>
                        )}

                        {paymentMethod === 'crypto' && (
                            <p className="text-xs text-gray-500 mt-6 italic">
                                Please ensure the wallet address you provide is correct, as any mistakes may result in the loss of funds.
                            </p>
                        )}

                    </div>
                </div>
            </motion.div>
        )}

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
