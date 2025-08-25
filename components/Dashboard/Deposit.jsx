import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaBitcoin, FaDollarSign, FaCheckCircle } from "react-icons/fa";
import Image from "next/image";
import { useFirebase } from "@/lib/firebaseContext";

const DepositSlides = () => {
  const [step, setStep] = useState("input");
  const [amount, setAmount] = useState(0);
  const [crypto, setCrypto] = useState("BTC");
  const [btcRate, setBtcRate] = useState(null);
  const [timeLeft, setTimeLeft] = useState(900); // 15 minutes in seconds
  const { userId } = useFirebase();
  const [loading, setLoading] = useState(false);
  const [qrImage, setQrImage] = useState("");
  const [wltAddress, setWltAddress] = useState("");


  // Fetch BTC rate
  useEffect(() => {
    const getBtcRate = async () => {
      try {
        const res = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd");
        if (!res.ok) throw new Error("Failed to fetch BTC rate");
        const data = await res.json();
        setBtcRate(data.bitcoin.usd);
      } catch (err) {
        console.error("Error fetching BTC rate:", err);
      }
    };
  
    getBtcRate();
  }, []);  

  // Countdown timer
  useEffect(() => {
    if (step !== "countdown") return;
    if (timeLeft <= 0) {
      setStep("complete");
      return;
    }
    const interval = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearInterval(interval);
  }, [step, timeLeft]);

  useEffect(() => {
    if (crypto === "BTC") {
      setQrImage("/btc-qr.png");
      setWltAddress("bc1qksrwkpkg3x0tzcupwf7hmdks5746wtcgq7a0z6");
    } else {
      setQrImage("/usdt-qr.png");
      setWltAddress("TSDfmNFRpw6TMwJz6icpEfRY53cvRLJEht");
    }
  }, [crypto])


  const sendDepositReq = async () => {
    setLoading(true);
    console.log("data:: ", amount, crypto, userId );
  
    try {
      const response = await fetch('/api/sendDepositReq', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount, crypto, userId }),
      });
  
      if (response.ok) {
        console.log('Deposit request sent successfully!');
      } else {
        const errorData = await response.json();
        console.error('Update failed:', errorData);
      }
    } catch (error) {
      console.error('An error occurred:', error);
    } finally {
      setTimeout(() => {
        setLoading(false);
        setStep("countdown");
      }, 4000); // 4 seconds delay
    }
  };

  
  const cryptoOptions = [
    { label: "BTC", icon: <FaBitcoin />, value: "BTC" },
    { label: "USDT", icon: <FaDollarSign />, value: "USDT" },
  ];

  const formattedTime = `${Math.floor(timeLeft / 60)}:${String(timeLeft % 60).padStart(2, "0")}`;
  const convertedAmount = crypto === "BTC" && btcRate ? (amount / btcRate).toFixed(8) : amount;

  return (
    <div className="relative w-full min-h-[calc(75vh-0.2rem)] lg:min-h-[calc(80vh-1rem)] bg-gray-100 p-2 lg:p-4 flex items-start lg:items-center justify-center">
      <AnimatePresence mode="wait">
        {step === "input" && (
          <motion.div
            key="input"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
            className="bg-white w-full max-w-md rounded-lg p-6 shadow-md"
          >
            <h2 className="text-lg lg:text-xl font-medium text-blue-800 mb-2">Deposit Funds</h2>
            <p className="text-sm text-gray-600 mb-4">Enter an amount and select a crypto method below:</p>

            <input
              type="number"
              className="w-full border border-gray-300 p-2 rounded mb-4"
              placeholder="Enter amount in USD"
            //   value={amount}
              onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
            />

            <div className="grid grid-cols-2 gap-4 mb-6">
              {cryptoOptions.map((option) => (
                <div
                  key={option.value}
                  onClick={() => setCrypto(option.value)}
                  className={`relative border rounded-md p-3 flex items-center justify-between cursor-pointer transition-all duration-200 ${
                    crypto === option.value ? "border-blue-600" : "border-gray-300"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {option.icon}
                    <span className="text-sm font-medium">{option.label}</span>
                  </div>
                  {crypto === option.value && <FaCheckCircle className="text-blue-600" />}
                </div>
              ))}
            </div>

            <button
              onClick={sendDepositReq}
              className="bg-blue-700 text-white w-full py-2 rounded-md hover:bg-blue-800"
            >
              Proceed
            </button>
          </motion.div>
        )}

        {step === "countdown" && (
          <motion.div
            key="countdown"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
            className="bg-white w-full max-w-md rounded-lg p-6 shadow-md text-center"
          >
            <h2 className="text-sm lg:text-base font-semibold text-blue-800 mb-4">
              Send exactly {convertedAmount} {crypto} to the wallet below:
            </h2>

            <Image
              src={qrImage}
              alt="QR Code"
              width={400}
              height={400}
              className="w-40 h-40 mx-auto mb-4 border p-2 select-none pointer-events-none"
              draggable={false}
              onContextMenu={(e) => e.preventDefault()}
            />

            <div className="text-left text-sm divide-y border-gray-200 py-2 space-y-2">
              <div className="flex justify-between py-2">
                <span className="font-medium">Wallet:</span>
                <span className="text-gray-600">{wltAddress}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="font-medium">Amount:</span>
                <span className="text-gray-600">{convertedAmount} {crypto}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="font-medium">Time Left:</span>
                <span className="text-red-500 font-semibold">{formattedTime}</span>
              </div>
            </div>
          </motion.div>
        )}

        {step === "complete" && (
          <motion.div
            key="complete"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
            className="bg-white w-full max-w-md rounded-lg p-6 shadow-md text-center"
            >
            <div className="flex justify-center mb-4">
                <FaCheckCircle className="text-green-500 text-4xl" />
            </div>
            <h2 className="text-lg font-semibold text-blue-800 mb-3">Countdown Complete</h2>
            <p className="text-sm text-gray-700">
                If you have made the payment, please do not panic. Your transaction will be automatically confirmed and
                credited to your dashboard wallet shortly.
            </p>
            </motion.div>
        )}

        {loading && (
         <div className="absolute inset-0 bg-gray-100 flex items-center justify-center z-50">
          <div className="w-8 lg:w-12 h-8 lg:h-12 rounded-full animate-spin border-4 border-t-transparent border-l-transparent border-r-blue-500 border-b-purple-500 shadow-lg"></div>
        </div>
        )}

      </AnimatePresence>

    </div>
  );
};

export default DepositSlides;
