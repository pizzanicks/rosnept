import React from 'react';
import { FiCheckCircle, FiXCircle } from 'react-icons/fi';
import { plans } from './data/plans';

const PlansSection = () => {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-12 text-center">
          <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-6 font-garamond">Our Plans</h2>
          <p className="text-base text-gray-700 leading-relaxed font-barlow max-w-2xl mx-auto">
            Choose a plan that aligns with your goals — from entry-level investments to premium legacy options.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 font-barlow">
          {plans.map((plan, index) => (
            <div key={index} className="relative">
              <div className={`z-50 absolute top-0 left-0 w-full h-2 ${plan.barColor} rounded-t-md`}></div>
              <div
                className={`relative flex flex-col h-full rounded-md shadow-lg p-6 border ${
                  plan.enabled ? 'bg-white' : 'bg-gray-200 opacity-50'
                }`}
              >
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-semibold">{plan.plan}</h3>
                  <span className="text-sm font-medium text-indigo-600">ROI - {plan.roi}</span>
                </div>
                <p className="text-sm text-gray-600 mb-6">{plan.subTitle}</p>
                <p className="text-gray-800 text-sm mb-4 flex-grow">{plan.description}</p>

                <ul className="text-sm text-gray-700 divide-y divide-gray-200 mb-6">
                  {plan.highlights.map((item, idx) => {
                      const [label, value] = item.split(':');

                      // Check if the value is a monetary value (Deposit, Investment Capital)
                      const isMoney = label.includes('Deposit') || label.includes('Investment Capital');
                      const displayValue = isMoney ? `$${value.trim()}` : value.trim();  // Adding $ and trimming extra spaces

                      return (
                          <li key={idx} className="py-2 flex justify-between">
                              <span>{label}</span>
                              <span className="font-medium">{displayValue}</span>
                          </li>
                      );
                  })}
                </ul>

                <ul className="mt-4 space-y-2 flex-grow">
                  {plan.points.map((point, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-gray-700">
                      {point.enabled ? (
                        <FiCheckCircle className="text-green-500 w-5 h-5" />
                      ) : (
                        <FiXCircle className="text-gray-400 w-5 h-5 line-through" />
                      )}
                      <span className={point.enabled ? '' : 'line-through text-gray-400'}>{point.text}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-auto">
                  <button
                    className={`mt-8 w-full py-2 rounded-md ${plan.buttonStyle}`}
                    disabled={!plan.enabled}
                  >
                    {plan.cta}
                  </button>
                </div>

                {!plan.enabled && (
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-1/2 w-3/5 bg-[#262626] rounded-2xl bg-opacity-50 flex items-center justify-center font-semibold text-white">
                    Coming Soon...
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PlansSection;
