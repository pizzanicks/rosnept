import DashboardLayout from "@/components/Dashboard/DashboardLayout";
import Footer from "@/components/Dashboard/Footer";
import TransactionHistory from "@/components/Dashboard/History";
import InvestmentSection from "@/components/Dashboard/InvestmentPlan";
import { useState, useEffect } from "react";
import Loader from "@/components/Dashboard/DbLoader";
import protectRoute from "@/lib/protectRoute";

function Investment() {

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
        <InvestmentSection />
        <TransactionHistory limit={4} />
        <Footer />
    </DashboardLayout>
  );
}

export default protectRoute(Investment);
