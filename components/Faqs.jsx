import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaChevronDown } from "react-icons/fa";

const faqs = [
  {
    question: "What is Rosnept?",
    answer:
      "Rosnept is a forward-thinking investment platform combining cryptocurrency, clean energy, agriculture, and precious metals. Our strategies are built for sustainable growth and minimized risk.",
  },
  {
    question: "How do I start investing?",
    answer:
      "Simply choose a plan that fits your financial goals and click 'Get Started'. You’ll be guided through our secure onboarding process and can begin your investment journey with confidence.",
  },
  {
    question: "What makes your investment plans unique?",
    answer:
      "Our plans are designed to balance traditional asset-backed stability with modern financial technologies, offering diversified exposure and strategic ROI tailored for the long term.",
  },
  {
    question: "Is my investment secure?",
    answer:
      "Security is a top priority at Rosnept. We leverage encrypted systems, risk-managed portfolios, and trusted third-party integrations to ensure your capital remains protected.",
  },
];

const FaqSection = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="bg-white py-16 px-6 lg:px-12">
      <div className="max-w-7xl mx-auto">
        <div className="text-start md:text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-6 font-garamond">Frequently Asked Questions</h2>
          <p className="text-sm md:text-base text-gray-700 leading-relaxed font-barlow">Everything you need to know before investing with Rosnept.</p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white border"
            >
              <button
                onClick={() => toggle(index)}
                className="flex items-center justify-between w-full px-6 py-4 text-left"
              >
                <span className="text-sm md:text-base text-gray-800 font-medium">{faq.question}</span>
                <FaChevronDown
                  className={`transition-transform duration-300 ${openIndex === index ? "rotate-180" : ""}`}
                />
              </button>
              <AnimatePresence initial={false}>
                {openIndex === index && (
                    <motion.div
                    key="content"
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="px-6 pb-4 text-gray-600 text-sm"
                    >
                    <motion.p
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        transition={{ duration: 0.3 }}
                    >
                        {faq.answer}
                    </motion.p>
                    </motion.div>
                )}
                </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FaqSection;
