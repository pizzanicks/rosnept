import { FiLink, FiCopy, FiCheck } from 'react-icons/fi';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useFirebase } from '@/lib/firebaseContext';

const ReferSection = () => {
  const [copied, setCopied] = useState(false);
  const { userData } = useFirebase();
  const userReferralLink = userData?.referralLink;

  const handleCopy = () => {
    navigator.clipboard.writeText(userReferralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      className="px-2 lg:px-8"
      initial={{ opacity: 0, y: 20 }}  // Initial state (hidden and slightly below)
      animate={{ opacity: 1, y: 0 }}   // Final state (fully visible and in place)
      transition={{ duration: 0.5 }}   // Duration of the animation
    >
        <div className="bg-white shadow rounded p-6 mt-4 lg:mt-8">
            <h2 className="text-base lg:text-lg font-medium lg:font-bold mb-1">Refer Us & Earn</h2>
            <p className="text-xs lg:text-sm text-gray-600 mb-4">
                Use the link below to invite your friends.
            </p>

            <div className="flex items-center border border-gray-300 rounded px-4 py-3 bg-gray-50 overflow-auto">
                <FiLink className="text-gray-500 mr-2 shrink-0" />
                
                <span className="text-sm text-gray-700 flex-1 whitespace-nowrap overflow-hidden overflow-ellipsis">
                    <span className="block md:hidden">
                        {userReferralLink?.slice(0, 22)}...
                    </span>
                    <span className="hidden md:block">
                        {userReferralLink}
                    </span>
                </span>

                
                <button
                onClick={handleCopy}
                className="ml-4 flex items-center text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                {copied ? (
                    <>
                    <FiCheck className="mr-1" />
                    Copied
                    </>
                ) : (
                    <>
                    <FiCopy className="mr-1" />
                    Copy
                    </>
                )}
                </button>
            </div>
        </div>
    </motion.div>
  );
};

export default ReferSection;
