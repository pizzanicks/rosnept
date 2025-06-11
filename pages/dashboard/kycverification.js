import DashboardLayout from "@/components/Dashboard/DashboardLayout";
import Footer from "@/components/Dashboard/Footer";
import { useState, useEffect } from "react";
import Loader from "@/components/Dashboard/DbLoader";
import KYCVerification from "@/components/Dashboard/KYCVerification";
import protectRoute from "@/lib/protectRoute";

function Verification() {

  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setPageLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (pageLoading) {
    return(
      <DashboardLayout>
        <Loader />
      </DashboardLayout>
    )
  }
  return (
    <DashboardLayout>
        <KYCVerification />
        <Footer />
    </DashboardLayout>
  );
}

export default protectRoute(Verification);
