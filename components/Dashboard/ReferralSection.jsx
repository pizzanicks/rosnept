import React from 'react';
import { motion } from 'framer-motion';

const referredUsers = [
  { username: 'john_doe', joined: '2024-12-01', earned: '$15.00' },
  { username: 'jane_smith', joined: '2025-01-15', earned: '$10.00' },
];

export default function Referral() {
  return (
    <motion.div
      className="space-y-8 p-2 lg:p-8"
      initial={{ opacity: 0 }}      // Initial state (hidden)
      animate={{ opacity: 1 }}      // Final state (fully visible)
      transition={{ duration: 0.5 }} // Animation duration
    >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center justify-between border-b border-gray-300 pb-8">
            <div>
                <motion.h1
                  className="text-xl lg:text-3xl font-bold text-blue-900 mb-8"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  Referral Activity
                </motion.h1>
                <motion.h2
                  className="text-xs lg:text-sm text-gray-600"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  See who you've referred and the statistics of your referrals.
                </motion.h2>
            </div>
        </div>
        
        {/* Referral List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <h2 className="text-base lg:text-xl font-medium lg:font-bold text-blue-900 mb-4">Referral List</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full border rounded-md overflow-hidden text-sm">
              <thead className="bg-gray-100 text-left">
                <tr>
                  <th className="p-3 font-medium text-gray-700">Username</th>
                  <th className="p-3 font-medium text-gray-700">Joined Date</th>
                  <th className="p-3 font-medium text-gray-700">Earned</th>
                </tr>
              </thead>
              <motion.tbody
                className="bg-white"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.9 }}
              >
                {referredUsers.map((user, idx) => (
                  <motion.tr
                    key={idx}
                    className="border-t"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 1 + idx * 0.2 }}
                  >
                    <td className="p-3 text-gray-800">{user.username}</td>
                    <td className="p-3 text-gray-600">{user.joined}</td>
                    <td className="p-3 text-green-600 font-semibold">{user.earned}</td>
                  </motion.tr>
                ))}
              </motion.tbody>
            </table>
          </div>
        </motion.div>

        {/* Referral Commission */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.3 }}
        >
          <h2 className="text-base lg:text-xl font-medium lg:font-bold text-blue-900 mb-4">Referral Commission</h2>
          <div className="overflow-x-auto border rounded-md p-4 bg-white text-sm text-gray-600">
            <div className="text-center py-10">
              <p>No referral commission found.</p>
            </div>
          </div>
        </motion.div>
    </motion.div>
  );
}
