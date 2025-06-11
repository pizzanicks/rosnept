import DashboardLayout from "@/components/Dashboard/DashboardLayout";
import Footer from "@/components/Dashboard/Footer";
import Referral from "@/components/Dashboard/ReferralSection";
import { useState, useEffect } from "react";
import Loader from "@/components/Dashboard/DbLoader";
import ReferSection from "@/components/Dashboard/Refer";
import protectRoute from "@/lib/protectRoute";

function Referrals() {

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
        <Referral />
        <ReferSection />
        <Footer />
    </DashboardLayout>
  );
}

export default protectRoute(Referrals);
