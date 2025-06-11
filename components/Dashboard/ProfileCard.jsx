import { useState, useEffect } from 'react';
import { FiInfo } from 'react-icons/fi';
import Link from 'next/link';
import dayjs from 'dayjs';
import { motion, AnimatePresence } from 'framer-motion';
import { useFirebase } from '@/lib/firebaseContext';
import Notification from '../Notification/notification';

export default function ProfileSection() {

    const { userData, userId } = useFirebase();
    const [showProfileNotification, setShowProfileNotification] = useState(false);
    const [showNotification, setShowNotification] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({});
    const [loading, setLoading] = useState(false);
    const [notificationType, setNotificationType] = useState('success');
    const [notificationMessage, setNotificationMessage] = useState('N/a');
    
    useEffect(() => {
        if (userData) {
          setFormData(userData);
      
          const { fullName, phone, userName } = userData;
          if (!fullName || !phone || !userName) {
            setShowProfileNotification(true);
          }
        }
    }, [userData]);
      

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleUpdateProfile = async () => {

        setLoading(true);
        // console.log("formdata:", formData);
        // console.log("user id:", userId);
        
        try {
          const response = await fetch('/api/updateProfile', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({formData, userId}),
          });
      
          if (response.ok) {
            setLoading(false);
            setNotificationMessage('Profile updated successfully!');
            setNotificationType('success');
            setShowNotification(true);
            setIsModalOpen(false);
            setTimeout(() => {
                setShowNotification(false);
            }, 5000);
          } else {
            const errorData = await response.json();
            // console.error('Update failed:', errorData);
            setLoading(false);
            setNotificationMessage('Update failed:', errorData);
            setNotificationType('error');
            setShowNotification(true);
            setTimeout(() => {
                setShowNotification(false);
            }, 5000);
            return errorData;
          }
        } catch (error) {
            console.error('An error occurred:', error);
            setLoading(false);
            setNotificationMessage('An error occurred:', error);
            setNotificationType('error');
            setShowNotification(true);
            setTimeout(() => {
                setShowNotification(false);
            }, 5000);
            return error;
        }
    };
      

    return (
        <div className="space-y-8 p-2 lg:p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center justify-between border-b border-gray-300 pb-8">
                <div>
                    <h1 className="text-xl lg:text-3xl font-bold text-blue-900 mb-8">Profile Info</h1>
                    <h2 className="text-xs lg:text-sm text-gray-600">You have complete access to manage your profile information.</h2>
                </div>
            </div>

            {/* Notification with animation */}
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

            <div>
                <h2 className="text-lg font-medium lg:font-semibold mb-2">Personal Information</h2>
                <p className="text-xs lg:text-sm text-gray-600">Basic info like name, phone, email and other info that you use on our platform</p>
            </div>

            <div className="bg-white p-4 rounded-md">
                {userData && ['fullName', 'userName', 'email', 'phone', 'address', 'country', 'gender', 'dob', 'telegram'].map((field) => (
                    <motion.div
                        key={field}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                        className="flex justify-between border-b border-gray-100 py-2 lg:py-3 text-sm"
                    >
                        <span className="text-sm lg:text-base font-medium capitalize">{field.replace(/([A-Z])/g, ' $1')}</span>
                        <span className="text-sm lg:text-base text-gray-700">{userData?.[field] || '—'}</span>
                    </motion.div>
                ))}

                <button
                    onClick={() => setIsModalOpen(true)}
                    className="w-full bg-blue-800 text-white rounded text-sm py-2 hover:bg-blue-700 mt-4"
                >
                    Edit Info
                </button>
            </div>

            {/* Modal for editing profile with animation */}
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
                                {userData && ['fullName', 'userName', 'email', 'phone', 'address', 'country', 'gender', 'telegram'].map((field) => (
                                    <div key={field}>
                                        <label className="text-sm font-medium capitalize">{field.replace(/([A-Z])/g, ' $1')}</label>
                                        {field === 'gender' ? (
                                            <select
                                                name="gender"
                                                value={formData.gender || ''}
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
                                                value={formData[field] || ''}
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
                                        value={formData.dob || ''}
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
