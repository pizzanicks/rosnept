import { useState, useEffect } from "react";
import { FaCheckCircle, FaUserShield, FaPassport, FaIdCard, FaCar } from "react-icons/fa";
import Link from "next/link";
import { motion } from "framer-motion";
import { useFirebase } from "@/lib/firebaseContext";
import Notification from "../Notification/notification";
import { storage, ID } from "@/lib/appwriteConfig";

const KYCVerification = () => {
  const [verified, setVerified] = useState(false);
  const [showVerificationUI, setShowVerificationUI] = useState(false);
  const [activeStep, setActiveStep] = useState("");
  const [selectedDocType, setSelectedDocType] = useState("");
  const [frontFile, setFrontFile] = useState(null);
  const [backFile, setBackFile] = useState(null);
  const { userData, userId, basicKycPassed, docKycPassed } = useFirebase();
  const [verificationProgress, setVerificationProgress] = useState({
    basicKYC: false,
    documentKYC: false,
  });

  useEffect(() => {
    setVerificationProgress({
      basicKYC: basicKycPassed || false,
      documentKYC: docKycPassed || false,
    });
  }, [basicKycPassed, docKycPassed]);

  const [showNotification, setShowNotification] = useState(false);
  const [notificationType, setNotificationType] = useState('success');
  const [notificationMessage, setNotificationMessage] = useState('N/a');
  const [submittingBkyc, setSubmittingBkyc] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState('United States');
  const [uploadingDoc, setUploadingDoc] = useState(false);

  const documentTypes = [
    { type: "Passport", icon: <FaPassport /> },
    { type: "National ID", icon: <FaIdCard /> },
    { type: "Driving License", icon: <FaCar /> },
  ]
  const allCountries = [
    "United States", "United Kingdom", "Canada", "Germany", "France", "Italy", "Spain", "Netherlands", "Sweden",
    "Norway", "Denmark", "Finland", "Switzerland", "Austria", "Belgium", "Ireland", "Portugal", "Greece",
    "Poland", "Czech Republic", "Hungary", "Slovakia", "Slovenia", "Australia", "New Zealand", "Japan",
    "South Korea", "Singapore", "Malaysia", "Brazil", "Mexico", "Russia"
  ]

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    userName: "",
    dob: "",
    address: "",
    country: "",
    telegram: "",
  });
  

  useEffect(() => {
    if (userData) {
      setFormData((prev) => ({
        ...prev,
        fullName: userData.fullName || "",
        email: userData.email || "",
        phone: userData.phone || "",
        userName: userData.userName || "",
        dob: userData.dob || "",
        address: userData.address || "",
        country: userData.country || "",
        telegram: userData.telegram || "",
      }));
    }
  }, [userData]);  
  


  useEffect(() => {
    // Fetch or check verification status here
    // For now, using a hardcoded value
  }, []);

  const handleStepChange = (step) => {
    if (step === "basic" && !verificationProgress.basicKYC) {
      setActiveStep("basic");
    } else if (step === "document" && !verificationProgress.documentKYC) {
      setActiveStep("document");
    }
  };

//   const handleProgressUpdate = (step) => {
//     if (step === "basic") {
//       setVerificationProgress((prev) => ({
//         ...prev,
//         basicKYC: true,
//       }));
//     } else if (step === "document") {
//       setVerificationProgress((prev) => ({
//         ...prev,
//         documentKYC: true,
//       }));
//     }
//   };

const handleInputChange = async (e) => {
  const { name, value } = e.target;
  setFormData((prev) => ({
    ...prev,
    [name]: value,
  }));

  // console.log("form data:", formData);

};

const handleFileUpload = async (file) => {
  try {
    if (!file) {
      console.warn("No file provided for upload.");
      return null;
    }

    const response = await storage.createFile(
      process.env.NEXT_PUBLIC_STORAGE_ID,
      ID.unique(),
      file
    );

    const fileUrl = storage.getFileView(
      process.env.NEXT_PUBLIC_STORAGE_ID,
      response.$id
    );

    return fileUrl;
  } catch (error) {
    console.error("Upload failed:", error.message || error);
    return null;
  }
};


const handleSubmitBasicInfo = async (e) => {
    e.preventDefault();
    console.log("user form data:", formData);
    setSubmittingBkyc(true);

    try {
      const response = await fetch('/api/submitBasicInfo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ formData, userId }),
      });

      if (response.ok) {
        console.log('Basic KYC submitted successfully!');

        setSubmittingBkyc(false);
        setNotificationMessage('Basic KYC submitted successfully!');
        setNotificationType('success');
        setShowNotification(true);

        setVerificationProgress(prevState => ({
          ...prevState,
          basicKYC: true,
        }));
        setActiveStep("");

        setTimeout(() => {
            setShowNotification(false);
        }, 5000);

      } else {
        const errorData = await response.json();
        console.error('Update failed:', errorData);

        setSubmittingBkyc(false);
        setNotificationMessage('Basic KYC submission failed!');
        setNotificationType('error');
        setShowNotification(true);

        setTimeout(() => {
            setShowNotification(false);
        }, 5000);

        return errorData;
      }
    } catch (error) {
        console.error('An error occurred:', error)
        setSubmittingBkyc(false);
        setNotificationMessage('An error occurred!');
        setNotificationType('error');
        setShowNotification(true);

        setTimeout(() => {
            setShowNotification(false);
        }, 5000);;
        return error;
    }
};

const handleUploadKycDocs = async (e) => {
  e.preventDefault();
  setUploadingDoc(true);

  try {
    console.log("Uploading front file...");
    const frontFileUrl = await handleFileUpload(frontFile);
    if (!frontFileUrl) throw new Error("Front file upload failed.");

    console.log("Uploading back file...");
    const backFileUrl = await handleFileUpload(backFile);
    if (!backFileUrl) throw new Error("Back file upload failed.");

    console.log("Front File URL:", frontFileUrl);
    console.log("Back File URL:", backFileUrl);

    // Continue to save these URLs in Firestore or your DB

    const response = await fetch('/api/submitKycDoc', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ selectedCountry, selectedDocType, frontFileUrl, backFileUrl, userId, fullName: userData.fullName, email: userData.email }),
    });

    if (response.ok) {
      console.log('KYC Document uploaded successfully!');

      setUploadingDoc(false);
      setNotificationMessage('KYC Document uploaded successfully!');
      setNotificationType('success');
      setShowNotification(true);

      setVerificationProgress(prevState => ({
        ...prevState,
        documentKYC: true,
      }));
      setActiveStep("");

      setTimeout(() => {
          setShowNotification(false);
      }, 5000);

    } else {
      const errorData = await response.json();
      console.error('Update failed:', errorData);

      setUploadingDoc(false);
      setNotificationMessage('KYC Document upload failed!');
      setNotificationType('error');
      setShowNotification(true);

      setTimeout(() => {
          setShowNotification(false);
      }, 5000);

      return errorData;
    }


  } catch (error) {
    console.error("KYC document upload failed:", error.message);
    setUploadingDoc(false);
    setNotificationMessage('KYC document upload failed:');
    setNotificationType('error');
    setShowNotification(true);

    setTimeout(() => {
        setShowNotification(false);
    }, 5000);
  }
};


  return (
    <div className="relative min-h-[calc(100vh-10.5rem)] lg:min-h-[calc(100vh-10.5rem)] flex items-center justify-center rounded-md p-2 lg:p-8 overflow-hidden">
      {!showVerificationUI && !activeStep ? (
        <motion.div
          key="main"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-md bg-white p-4 lg:p-8 rounded-md shadow-md z-10"
        >
          {verified ? (
            <>
              <div className="bg-green-100 p-6 rounded-full inline-block mb-4">
                <FaCheckCircle className="text-green-600 text-4xl" />
              </div>
              <h2 className="text-xl font-semibold text-gray-800">Identity Verified</h2>
              <p className="text-sm text-gray-600 mt-2 mb-6">
                Your identity has been successfully verified. You can now enjoy full access.
              </p>
              <div className="flex gap-2 lg:gap-3 justify-center">
                <Link
                  href="/dashboard"
                  className="w-full lg:w-auto bg-blue-800 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm"
                >
                  Go to Dashboard
                </Link>
                <Link
                  href="/dashboard/plans"
                  className="w-full lg:w-auto bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300 text-sm"
                >
                  Explore Plans
                </Link>
              </div>
            </>
          ) : (
            <>
              <div className="bg-yellow-100 p-6 rounded-full inline-block mb-4">
                <FaUserShield className="text-yellow-600 text-4xl" />
              </div>
              <h2 className="text-xl font-semibold text-gray-800">Identity Verification</h2>
              <p className="text-sm text-gray-600 mt-2 mb-6">
                To withdraw or transfer funds, identity verification is required. Please complete your verification process below.
              </p>
              <button
                onClick={() => setShowVerificationUI(true)}
                className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 text-sm"
              >
                Start Verification
              </button>
              <p className="text-xs text-gray-500 mt-4">
                Need help?{" "}
                <Link href="/support" className="text-blue-600 underline">
                  Contact support
                </Link>{" "}
                and we&apos;ll assist you.
              </p>
            </>
          )}
        </motion.div>
      ) : (
        <motion.div
          key="verification-slide"
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "spring", stiffness: 100, damping: 20 }}
          className="absolute top-0 left-0 w-full h-full bg-transparent z-20 flex justify-center items-start lg:items-center p-2 lg:p-6"
        >
          <div className="w-full lg:w-[50vw] flex flex-col bg-white p-6 rounded-md">
            <h2 className="text-xl font-medium lg:font-semibold text-blue-800 mb-2">Identity Verification</h2>

            {!(verificationProgress.basicKYC || verificationProgress.documentKYC) && (
              <>
                <p className="text-xs lg:text-sm text-gray-600 mb-8">
                  To comply with financial regulations, we require you to complete identity verification.
                </p>
                <h4 className="text-sm font-medium lg:font-semibold text-gray-900 mb-4">
                  Complete the verification steps below
                </h4>
              </>
            )}

            {verificationProgress.basicKYC && verificationProgress.documentKYC && (
              <p className="mt-6 text-xs md:text-sm text-green-600 mb-4">
                Your personal information and KYC documents have been submitted and are currently under review. You will be notified once the verification process is complete.
              </p>
            )}

            <div className="space-y-2">
              {/* Basic Info */}
              <div
                className={`flex justify-between items-center p-4 border rounded cursor-pointer ${
                  verificationProgress.basicKYC ? "bg-green-50 cursor-not-allowed" : "hover:bg-gray-100"
                }`}
                onClick={() => !verificationProgress.basicKYC && handleStepChange("basic")}
              >
                <div className="flex-1">
                  <h5 className="text-sm lg:text-base font-medium text-gray-800">Basic Information</h5>
                  <p className="text-xs text-gray-600">Your personal information for identity</p>
                </div>
                <div className="w-6 text-right">
                  {verificationProgress.basicKYC ? (
                    <FaCheckCircle className="text-green-500 text-xl" />
                  ) : (
                    <span className="text-gray-500 text-xl">&#8250;</span>
                  )}
                </div>
              </div>

              {/* Identity Document */}
              <div
                className={`flex justify-between items-center p-4 border rounded cursor-pointer ${
                  verificationProgress.documentKYC ? "bg-green-50 cursor-not-allowed" : "hover:bg-gray-100"
                }`}
                onClick={() => !verificationProgress.documentKYC && handleStepChange("document")}
              >
                <div className="flex-1">
                  <h5 className="text-sm lg:text-base font-medium text-gray-800">Identity Document</h5>
                  <p className="text-xs text-gray-600">Upload a government-issued ID or passport for verification</p>
                </div>
                <div className="w-6 text-right">
                  {verificationProgress.documentKYC ? (
                    <FaCheckCircle className="text-green-500 text-xl" />
                  ) : (
                    <span className="text-gray-500 text-xl">&#8250;</span>
                  )}
                </div>
              </div>
            </div>

            {!(verificationProgress.basicKYC || verificationProgress.documentKYC) && (
              <button
                onClick={() => setShowVerificationUI(false)}
                className="mt-6 text-xs lg:text-sm underline text-red-500"
              >
                Cancel Verification
              </button>
            )}

          </div>
        </motion.div>
      )}

      {activeStep === "basic" && (
        <motion.div
            key="basic-info-slide"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
            className="absolute top-0 left-0 w-full h-full bg-white z-30 flex flex-col justify-center items-start lg:items-center p-6"
        >
            <h3 className="text-lg text-blue-800 font-medium lg:font-medium mb-4">Basic Information</h3>
            <p className="text-sm text-gray-600 mb-6">Please provide your basic information for verification.</p>
            <form onSubmit={handleSubmitBasicInfo} className="w-full max-w-md space-y-4 overflow-y-auto h-[80vh] lg:h-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      placeholder="Full Name"
                      className="w-full p-2 lg:p-3 border border-gray-300 rounded text-sm lg:text-base font-normal text-gray-700"
                      required
                    />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Email Address"
                      className="w-full p-2 lg:p-3 border border-gray-300 rounded text-sm lg:text-base font-normal text-gray-700"
                      required
                    />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="Phone Number"
                      className="w-full p-2 lg:p-3 border border-gray-300 rounded text-sm lg:text-base font-normal text-gray-700"
                      required
                    />
                    <input
                      type="text"
                      name="userName"
                      value={formData.userName}
                      onChange={handleInputChange}
                      placeholder="Preferred Username"
                      className="w-full p-2 lg:p-3 border border-gray-300 rounded text-sm lg:text-base font-normal text-gray-700"
                      required
                    />
                    <input
                      type="date"
                      name="dob"
                      value={formData.dob}
                      onChange={handleInputChange}
                      className="w-full p-2 lg:p-3 border border-gray-300 rounded text-sm lg:text-base font-normal text-gray-700"
                      required
                    />
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder="Address"
                      className="w-full p-2 lg:p-3 border border-gray-300 rounded text-sm lg:text-base font-normal text-gray-700"
                      required
                    />
                    <input
                      type="text"
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      placeholder="Country"
                      className="w-full p-2 lg:p-3 border border-gray-300 rounded text-sm lg:text-base font-normal text-gray-700"
                      required
                    />
                    <input
                      type="text"
                      name="telegram"
                      value={formData.telegram}
                      onChange={handleInputChange}
                      placeholder="Telegram ID"
                      className="w-full p-2 lg:p-3 border border-gray-300 rounded text-sm lg:text-base font-normal text-gray-700"
                      required
                    />
                </div>
                <div className="w-full flex justify-center gap-2">
                    <button
                      onClick={() => setActiveStep("")}
                      className="w-full bg-gray-300 px-4 py-2 rounded hover:bg-gray-400 hover:text-white text-sm lg:text-base"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      className="w-full flex justify-center items-center bg-blue-800 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm lg:text-base"
                    >
                      {submittingBkyc ? (
                          <div className="border-2 border-gray-200 border-t-2 border-t-transparent rounded-full w-6 h-6 spinner"></div>
                          ) : (
                          <div className="text-white text-center h-6">Submit</div>
                      )}
                    </button>
                </div>
            </form>

        </motion.div>
      )}

      {activeStep === "document" && (
        <motion.div
          key="document-slide"
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "spring", stiffness: 100, damping: 20 }}
          className="absolute top-0 left-0 w-full flex justify-center item-start lg:items-center bg-gray-100 h-full z-30 overflow-y-auto"
        >
          <div className="flex flex-col items-start justify-start bg-white p-4 lg:p-8 rounded-md">
            <h3 className="text-lg font-medium mb-2 text-blue-800">Identity Document</h3>
            <p className="text-xs text-gray-600 mb-6 lg:mb-8">Verify your identity using any of the document types listed below.</p>

            <label className="text-sm font-semibold text-gray-700 mb-2">Select Document Type</label>
            <div className="flex flex-col justify-center gap-4 mb-4 lg:mb-6 w-full max-w-3xl">
              {documentTypes.map((doc, index) => (
                <div
                  key={index}
                  onClick={() => setSelectedDocType(doc.type)}
                  className={`border rounded-md px-4 py-2 lg:py-4 flex items-center justify-between gap-3 cursor-pointer transition-all duration-200 ${
                    selectedDocType === doc.type
                      ? "border-blue-600 bg-blue-50"
                      : "border-gray-300"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl text-gray-400">{doc.icon}</span>
                    <span className="text-sm font-medium text-gray-700">{doc.type}</span>
                  </div>
                  {selectedDocType === doc.type && (
                    <FaCheckCircle className="text-green-500 text-lg" />
                  )}
                </div>
              ))}
            </div>

            <label className="text-sm font-medium text-gray-700 mb-2">Issued by Country</label>
            <select
              className="w-full p-3 border border-gray-300 rounded mb-6 text-sm"
              required
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
            >
              {allCountries.map((country, idx) => (
                <option key={idx} value={country}>
                  {country}
                </option>
              ))}
            </select>

            <div className="flex items-start text-xs text-gray-600 bg-gray-100 p-3 rounded-md border border-gray-200 max-w-2xl mb-4 lg:mb-6">
              <span className="mr-2 text-blue-500">ℹ️</span>
              <p>
                For faster account verification, ensure that the details provided match those on your official documents.
              </p>
            </div>

            <div className="w-full flex gap-2 lg:gap-3 justify-between items-center">
              <button
                onClick={() => setActiveStep("")}
                className="bg-gray-300 px-4 py-2 rounded text-sm hover:bg-gray-400 hover:text-white w-full"
              >
                Back
              </button>
              <button
                disabled={!selectedDocType}
                onClick={() => setActiveStep("upload-doc")}
                className={`px-4 py-2 rounded text-sm w-full ${
                  selectedDocType
                    ? "bg-blue-700 text-white hover:bg-blue-800"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                Continue
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {activeStep === "upload-doc" && (
        <motion.div
          key="upload-doc-slide"
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "spring", stiffness: 100, damping: 20 }}
          className="absolute top-0 left-0 w-full flex justify-center items-start lg:items-center bg-gray-100 h-full z-30 overflow-y-auto"
        >
          <div className="flex flex-col items-start justify-start bg-white p-4 lg:p-8 rounded-md">
          <h3 className="text-lg font-medium text-blue-800 mb-3">Upload Document</h3>
          <p className="text-sm text-gray-700 mb-4 lg:mb-6">
            To verify, please upload a copy of your <span className="font-medium">{selectedDocType}</span>.
          </p>

          <div className="bg-gray-50 border border-gray-200 p-4 rounded-md text-sm text-gray-700 mb-4 lg:mb-8 w-full max-w-2xl">
            <p className="font-medium mb-3">To avoid delays when verifying your account, please ensure:</p>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <FaCheckCircle className="text-green-500 mt-[2px]" />
                <span>Document is in good condition and clearly visible.</span>
              </li>
              <li className="flex items-start gap-2">
                <FaCheckCircle className="text-green-500 mt-[2px]" />
                <span>All four corners of the document are visible.</span>
              </li>
            </ul>
          </div>

          {/* Front side */}
          <div className="w-full max-w-md mb-4">
            <p className="text-sm font-medium text-gray-800 mb-2">Front Side:</p>
            <label className="block border-2 border-dashed border-gray-300 rounded-md p-4 text-center cursor-pointer bg-gray-50 hover:bg-gray-100 transition">
              <input
                type="file"
                accept="image/*,application/pdf"
                onChange={(e) => setFrontFile(e.target.files[0])}
                className="hidden"
              />
              {frontFile ? (
                <span className="text-sm text-gray-700">{frontFile.name}</span>
              ) : (
                <span className="text-sm text-gray-500">Click to upload front side</span>
              )}
            </label>
          </div>

          {/* Back side */}
          <div className="w-full max-w-md mb-4 lg:mb-8">
            <p className="text-sm font-medium text-gray-800 mb-2">Back Side:</p>
            <label className="block border-2 border-dashed border-gray-300 rounded-md p-4 text-center cursor-pointer bg-gray-50 hover:bg-gray-100 transition">
              <input
                type="file"
                accept="image/*,application/pdf"
                onChange={(e) => setBackFile(e.target.files[0])}
                className="hidden"
              />
              {backFile ? (
                <span className="text-sm text-gray-700">{backFile.name}</span>
              ) : (
                <span className="text-sm text-gray-500">Click to upload back side</span>
              )}
            </label>
          </div>

          {/* Action buttons */}
          <div className="w-full flex gap-2 lg:gap-3 justify-between items-center">
            <button
              onClick={() => setActiveStep("document")}
              className="bg-gray-300 px-4 py-2 rounded text-sm hover:bg-gray-400 w-full"
            >
              Back
            </button>
            <button
              onClick={handleUploadKycDocs}
              className="bg-blue-700 text-white px-4 py-2 rounded text-sm hover:bg-blue-800 w-full flex justify-center items-center"
            >
              {uploadingDoc ? (
                  <div className="border-2 border-gray-200 border-t-2 border-t-transparent rounded-full w-6 h-6 spinner"></div>
                  ) : (
                  <div className="text-white text-center h-6">Upload File</div>
              )}
            </button>
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
};

export default KYCVerification;
