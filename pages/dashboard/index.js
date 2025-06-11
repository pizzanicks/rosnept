import BalanceCard from "@/components/Dashboard/BalanceCard";
import DashboardLayout from "@/components/Dashboard/DashboardLayout";
import Footer from "@/components/Dashboard/Footer";
import TransactionHistory from "@/components/Dashboard/History";
import ReferSection from "@/components/Dashboard/Refer";
import { useState, useEffect } from "react";
import Loader from "@/components/Dashboard/DbLoader";
import protectRoute from "@/lib/protectRoute";

function Home() {

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
      <BalanceCard />
      <TransactionHistory limit={4} />
      <ReferSection />
      <Footer />
    </DashboardLayout>
  );
}

export default protectRoute(Home);
