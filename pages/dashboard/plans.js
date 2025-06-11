import DashboardLayout from "@/components/Dashboard/DashboardLayout";
import Footer from "@/components/Dashboard/Footer";
import PlanPurchase from "@/components/Dashboard/OurPlan";
import { useState, useEffect } from "react";
import Loader from "@/components/Dashboard/DbLoader";
import protectRoute from "@/lib/protectRoute";

function Plans() {
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
        <PlanPurchase />
        <Footer />
    </DashboardLayout>
  );
}

export default protectRoute(Plans);
