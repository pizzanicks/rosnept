import { useState } from 'react';
import { motion } from 'framer-motion';
import Notification from '../Notification/notification';

export default function SupportPage() {
  const [formData, setFormData] = useState({
    subject: '',
    message: '',
  });
  const [showNotification, setShowNotification] = useState(false);
  const [notificationType, setNotificationType] = useState('success');
  const [notificationMessage, setNotificationMessage] = useState('N/a');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Support Form Submission:', formData);
    setLoading(true);

    try {
      const response = await fetch('/api/supportTicket', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({ subject: formData.subject, message: formData.message }),
      });

      const data = await response.json();

      if (response.ok) {
          setNotificationMessage('Your support request has been received. We’ll get back to you shortly.');
          setNotificationType('success');
          setShowNotification(true);
          setLoading(false);
          setFormData({
            subject: '',
            message: ''
          })
      } else {
          console.error("Error submitting form:", data);
          setNotificationMessage('Error submitting form');
          setNotificationType('error');
          setShowNotification(true);
          setLoading(false);
      }
    } catch (error) {
        console.error("An error occurred:", error);
        setNotificationMessage('An error occurred');
        setNotificationType('error');
        setLoading(false);
        setShowNotification(true);
    } finally {
        setTimeout(() => setShowNotification(false), 5000);
    }
  };

  return (
    <div className="space-y-4 lg:space-y-8 p-2 lg:p-8">
      {/* Contact Us Header */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center justify-between border-b border-gray-300 pb-6 lg:pb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div>
          <h1 className="text-xl lg:text-3xl font-bold text-blue-900">Contact Us</h1>
        </div>
      </motion.div>

      {/* Get In Touch Card */}
      <motion.div
        className="bg-white shadow-sm border rounded-md p-6 space-y-4"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <h2 className="text-lg lg:text-xl font-medium lg:font-bold text-blue-900">Get In Touch</h2>
        <p className="text-sm text-gray-600">
          If you have any questions or need assistance, feel free to reach out to our support team.
        </p>
        <p className="text-sm text-gray-800">
          <strong>Email:</strong>{' '}
          <a href="mailto:support@rosnep.com" className="text-blue-600 hover:underline">
            support@rosnep.com
          </a>
        </p>
      </motion.div>

      {/* Support Form */}
      <motion.div
        className="bg-white shadow-sm border rounded-md p-6 space-y-6"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        <h2 className="text-lg lg:text-xl font-medium lg:font-bold text-blue-900">Support Form</h2>
        <p className="text-sm text-gray-600">
          Send us a message and we&apos;ll get back to you as soon as possible.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
            <input
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              className="w-full p-2 border rounded-md text-sm"
              placeholder="Enter subject"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              className="w-full p-2 border rounded-md text-sm h-32"
              placeholder="Type your message here..."
              required
            />
          </div>

          <div className="flex justify-end">
            <motion.button
              type="submit"
              className="bg-blue-800 text-white px-4 py-2 text-sm rounded hover:bg-blue-700 w-full lg:w-40 flex justify-center items-center"
              whileTap={{ scale: 0.95 }}
            >
              {loading ? (
                <div className="border-2 border-gray-200 border-t-2 border-t-transparent rounded-full w-5 h-5 spinner"></div>
              ) : (
                <div className="text-white text-center h-5">Submit</div>
              )}
            </motion.button>
          </div>
        </form>
      </motion.div>

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
