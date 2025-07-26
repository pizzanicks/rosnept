// components/Dashboard/PayoutHistorySection.jsx
import React from 'react';
import { useTranslation } from 'next-i18next';
import dayjs from 'dayjs'; // For date formatting

export default function PayoutHistorySection({ userInvestment }) {
  const { t } = useTranslation('common');

  const payoutLogs = userInvestment?.payoutLogs ?? [];
  const totalRoiEarned = payoutLogs.reduce((sum, log) => sum + (log.amount ?? 0), 0);

  if (!userInvestment) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-md text-center text-gray-600 mb-8">
        <p>{t('dashboard_loading_payout_data')}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 mb-8">
      <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2 mt-8 text-center font-garamond">
        {t('dashboard_payout_history_title')}
      </h2>
      <p className="text-sm text-gray-600 text-center mb-6">
        {t('dashboard_payout_history_description')}
      </p>

      <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg border border-gray-200">
        <div className="mb-4 text-right">
          <span className="text-md font-semibold text-gray-800">
            {t('dashboard_total_roi_earned')}: <span className="text-green-600">${totalRoiEarned.toFixed(2)}</span>
          </span>
        </div>
        <div className="overflow-x-auto max-h-80 lg:max-h-96 overflow-y-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('dashboard_date')}
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('dashboard_amount')}
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('dashboard_type')}
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {payoutLogs.length === 0 ? (
                <tr>
                  <td colSpan="3" className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                    {t('dashboard_no_payouts_yet')}
                  </td>
                </tr>
              ) : (
                payoutLogs.map((log, i) => (
                  <tr key={i} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                      {log.date
                        ? dayjs(
                            // Check if it's a Firebase Timestamp (has toDate function)
                            typeof log.date.toDate === 'function'
                              ? log.date.toDate() // Convert Timestamp to JS Date
                              : log.date // Otherwise, assume it's already a JS Date or string
                          ).format('YYYY-MM-DD HH:mm')
                        : t('dashboard_not_available')}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-green-600 font-medium">
                      +${(log.amount ?? 0).toFixed(2)}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                      {log.type || t('dashboard_roi_payout')}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
