'use client'

import { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { FiMenu, FiUser, FiChevronDown, FiLogOut, FiSettings, FiX } from 'react-icons/fi';
import { FaTachometerAlt, FaMoneyCheckAlt, FaHandHoldingUsd, FaUserFriends, FaHeadset, FaGlobe, FaCog, FaWallet, FaChevronDown, FaChevronUp, FaUser, FaSignOutAlt, FaIdCard } from 'react-icons/fa';
import { MdOutlineAttachMoney } from 'react-icons/md';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { getAuth, signOut } from "firebase/auth";
import { useRouter } from 'next/router';
import { useFirebase } from '@/lib/firebaseContext';

const menuItems = [
  { icon: <FaTachometerAlt />, label: 'Overview', path: '/dashboard' },
  { icon: <FaMoneyCheckAlt />, label: 'Payment History', path: '/dashboard/transactions' },
  { icon: <FaHandHoldingUsd />, label: 'Investment', path: '/dashboard/investment' },
  { icon: <MdOutlineAttachMoney />, label: 'Available Plans', path: '/dashboard/plans' },
  { icon: <FiUser />, label: 'Account Info', path: '/dashboard/profile' },
  { icon: <FaUserFriends />, label: 'Affiliate Program', path: '/dashboard/referrals' },
  { icon: <FaCog />, label: 'Preferences', path: '/dashboard/settings' },
  { icon: <FaHeadset />, label: 'Help Center', path: '/dashboard/support' },
  { icon: <FaGlobe />, label: 'Visit Website', path: '/' },
];

  

const DashboardLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const pathname = usePathname();
  const [btcPrice, setBtcPrice] = useState(null);
  const router = useRouter();
  const { userData, userInvestment, isVerified } = useFirebase();

  useEffect(() => {
    const checkScreenSize = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };
    checkScreenSize(); // initial check
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
  
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchBtcPrice = async () => {
      try {
        const res = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd');
        if (!res.ok) throw new Error('Network response was not ok');
        const data = await res.json();
        setBtcPrice(data.bitcoin.usd);
      } catch (error) {
        // Silently ignore or log the error
        console.error("Failed to fetch BTC price:", error.message);
        setBtcPrice(null); // or leave it unchanged
      }
    };
  
    fetchBtcPrice();
  }, []);

  const userInitials = userData?.fullName.split(' ').map(n => n[0]).join('').toUpperCase();


  const handleLogout = async () => {
    const auth = getAuth();

    try {
      await signOut(auth);
      console.log("User logged out successfully");
      router.push('/auth/login');
    } catch (error) {
      console.error("Error logging out:", error.message);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <AnimatePresence>
        {(sidebarOpen || isDesktop) && (
           <motion.aside
           initial={{ x: -250 }}
           animate={{ x: 0 }}
           exit={{ x: -250 }}
           className="fixed lg:static z-50 w-[80%] lg:w-[20%] h-screen bg-blue-950 text-gray-300 flex flex-col px-4 pb-4 lg:pb-6 pt-6 lg:pt-8"
         >

            {/* Close button for mobile */}
            <div className="z-40 absolute top-4 right-4 lg:hidden">
              <button onClick={() => setSidebarOpen(false)}>
                <span className="text-white text-3xl"><FiX className='w-6 h-6'/></span>
              </button>
            </div>

            {/* Logo */}
            <div className="sticky top-0 bg-blue-950 z-10 pb-4 mb-2 lg:mb-6">
              <Image src={'/logo-1.png'} height={400} width={400} className="h-14 w-48 lg:w-48" alt="Logo"/>
            </div>

           <div className="overflow-y-auto space-y-6 scrollbar-hide">

            {!isDesktop && (
              <div className="flex items-center justify-between mt-4 cursor-pointer border-t border-b border-[#22357b] menu-info py-4" onClick={() => setDropdownOpen(!dropdownOpen)}>
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 bg-blue-900 rounded-full flex items-center justify-center text-white font-medium">{userInitials}</div>
                  <div className="flex flex-col">
                    <span className="text-base font-medium">{userData?.fullName}</span>
                    <span className="text-xs text-blue-300">{userData?.email}</span>
                  </div>
                </div>
                {dropdownOpen ? <FaChevronUp /> : <FaChevronDown />}
              </div>
            )}

            <AnimatePresence initial={false}>
              {(dropdownOpen || isDesktop) && (
                <motion.div
                  key="account-section"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4 bg-[#1f306d] lg:bg-transparent p-4 lg:p-0 rounded-md"
                >
                  {/* Account Balance */}
                  <div className={`lg:p-4 ${isDesktop ? 'bg-blue-900 rounded-md' : 'bg-transparent'} space-y-2`}>
                    <div className="text-sm">Main Account Balance</div>
                    <div className="text-xl font-semibold text-green-500">
                      {userInvestment?.walletBal?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} <span className="text-sm">{userInvestment?.currency}</span>
                    </div>
                    {btcPrice && (
                      <div className="text-xs text-blue-300">
                        {(userInvestment?.walletBal / btcPrice).toFixed(4)} BTC
                      </div>
                    )}
                  </div>

                  {/* Deposit & Withdraw Buttons */}
                  <div className={`flex ${isDesktop ? 'space-x-2 flex-row' : 'flex-col space-y-2'} mt-2`}>
                    <Link href={'/dashboard/deposit'} className="w-full flex flex-row-reverse lg:flex-row items-center justify-end lg:justify-center bg-transparent lg:bg-green-600 px-0 lg:px-3 py-1 lg:py-2 rounded text-white text-sm">
                      <FaWallet className="block lg:hidden ml-2 lg:ml-0 lg:mr-2 text-gray-300" /> <span className='lg:hidden ml-1'>Funds </span> Deposit
                    </Link>
                    <Link href={'/dashboard/withdraw'} className="w-full flex flex-row-reverse lg:flex-row items-center justify-end lg:justify-center bg-transparent lg:bg-red-500 px-0 lg:px-3 py-1 lg:py-2 rounded text-white text-sm">
                      <FaWallet className="block lg:hidden ml-2 lg:ml-0 lg:mr-2 text-gray-300" /> <span className='lg:hidden ml-1'>Funds </span> Withdraw
                    </Link>
                  </div>

                  {/* Divider */}
                  {!isDesktop && <hr className="border-[#404F82] my-4" />}

                  {/* Profile Links (Mobile only) */}
                  {!isDesktop && (
                    <div className="flex flex-col space-y-3 text-sm">
                      <Link href={'/dashboard/profile'} className="flex items-center space-x-3 cursor-pointer">
                        <FaUser /> <span>View Profile</span>
                      </Link>
                      <Link href={'/dashboard/settings'} className="flex items-center space-x-3 cursor-pointer">
                        <FaCog /> <span>Account Settings</span>
                      </Link>
                      <Link href={'/dashboard/kycverification'} className="flex items-center space-x-3 cursor-pointer">
                        <FaIdCard /> <span>KYC Verification</span>
                      </Link>
                      <div onClick={handleLogout} className="flex items-center space-x-3 cursor-pointer">
                        <FaSignOutAlt /> <span>Logout</span>
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

           <nav className="mt-8 space-y-2 flex-1">
                {menuItems.map((item, i) => {
                    const isActive = pathname === item.path;

                    return (
                    <Link
                        key={i}
                        href={item.path}
                        className={`flex items-center space-x-3 p-2 rounded cursor-pointer text-sm 
                        ${isActive ? 'bg-[#1f306d] text-gray-100 font-medium' : 'hover:bg-blue-900'}`}
                    >
                        {item.icon}
                        <span>{item.label}</span>
                    </Link>
                    );
                })}
            </nav>
                      
          </div>

          {/* Bottom Support Email */}
          <div className="border-t border-blue-900 pt-2 lg:pt-4 mt-auto text-sm text-center text-blue-300">
              support@deltaneutral.org
            </div>
         </motion.aside>
         
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="w-auto lg:w-[80%] flex-1 flex flex-col">
        {/* Top Bar */}
        <div className="flex items-center justify-between bg-white px-4 lg:px-12 py-3 lg:py-4 shadow fixed w-[100%] lg:w-[80%] z-30">
          <button className="lg:hidden" onClick={() => setSidebarOpen(!sidebarOpen)}>
            <FiMenu className="text-2xl" />
          </button>

          <div className="ml-auto flex justify-end">
            <div className="flex items-center space-x-2 lg:space-x-3">
                <div className="w-8 lg:w-10 h-8 lg:h-10 bg-blue-800 text-white rounded-full flex items-center justify-center">
                    <FiUser className="w-4 h-4 lg:w-5 lg:h-5" />
                </div>
                <div className="text-sm hidden lg:block">
                    <div className={`text-sm font-semibold ${isVerified ? 'text-green-600' : 'text-red-600'}`}>
                      {isVerified ? "Verified" : "Unverified"}
                    </div>
                    <div className="font-semibold flex items-center space-x-2">
                        <span>{userData?.fullName}</span>
                        <FiChevronDown
                            className="text-xs cursor-pointer"
                            onClick={() => setDropdownOpen(!dropdownOpen)}
                        />
                    </div>
                </div>
                <FiChevronDown
                    className="lg:hidden text-xs cursor-pointer"
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                />
            </div>
          </div>

        </div>

        {/* Dropdown Menu */}
        <AnimatePresence>
            {dropdownOpen && (
                <motion.div
                ref={dropdownRef}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="absolute top-14 lg:top-14 right-4 w-64 bg-white rounded-b-lg shadow-lg p-4 z-40"
                >

                <div className="flex items-center space-x-3 border-b pb-4 mb-4">
                <div className="w-10 h-10 bg-blue-800 text-white rounded-full flex items-center justify-center font-bold">
                    {userInitials}
                </div>
                <div>
                    <div className="font-semibold">{userData?.fullName}</div>
                    <div className="text-sm text-gray-500">{userData?.email}</div>
                </div>
                </div>
                <ul className="space-y-2 text-sm">
                  <li>
                    <Link href="/dashboard/profile" className="flex items-center space-x-2 hover:bg-gray-100 p-2 rounded cursor-pointer">
                      <FiUser />
                      <span>View Profile</span>
                    </Link>
                  </li>
                  <li>
                    <Link href="/dashboard/settings" className="flex items-center space-x-2 hover:bg-gray-100 p-2 rounded cursor-pointer">
                      <FiSettings />
                      <span>Settings</span>
                    </Link>
                  </li>
                  <li>
                    <Link href="/dashboard/kycverification" className="flex items-center space-x-2 hover:bg-gray-100 p-2 rounded cursor-pointer">
                      <FaIdCard />
                      <span>KYC Verification</span>
                    </Link>
                  </li>
                  <li onClick={handleLogout} className="flex items-center space-x-2 text-red-600 hover:bg-red-50 p-2 rounded cursor-pointer">
                    <FiLogOut />
                    <span>Logout</span>
                  </li>
                </ul>
                </motion.div>
            )}
        </AnimatePresence>

        {/* Content Area */}
        <div className="mt-16 p-4 overflow-auto">
          {children}
        </div>
      </div>

      {/* User Dropdown Menu Overlay (example only) */}
      {/* Replace this with a real dropdown component if needed */}
      {/* Mobile responsive slide in sidebar already implemented */}
    </div>
  );
};

export default DashboardLayout;
