import DashboardLayout from "@/components/Dashboard/DashboardLayout";
import Footer from "@/components/Dashboard/Footer";
import { useState, useEffect } from "react";
import Loader from "@/components/Dashboard/DbLoader";
import DepositSlides from "@/components/Dashboard/Deposit";
import protectRoute from "@/lib/protectRoute";

function Deposit() {

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
        <DepositSlides />
        <Footer />
    </DashboardLayout>
  );
}

export default protectRoute(Deposit);
