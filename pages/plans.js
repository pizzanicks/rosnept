import Navbar from '@/components/Navbar'
import React, { useState, useEffect } from 'react'
import HeroBanner from '@/components/HeroBanner'
import Footer from '@/components/Footer'
import Loader from '@/components/Loader'
import PlansSection from '@/components/Plans'
import Head from 'next/head'

function Plans() {

  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setPageLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (pageLoading) {
    return <Loader />;
  }

  return (
    <>
        <Head>
          <title>Investment Plans | Rosnept</title>
          <meta
            name="description"
            content="Explore Rosnept’s curated investment plans designed for stability, growth, and impact—across cryptocurrency, clean energy, agriculture, and gold."
          />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
        </Head>
        <Navbar />
        <HeroBanner
            image="/pl-1.jpg"
            title="Our Investment Plans"
            description="Explore Rosnept’s curated investment plans designed for stability, growth, and impact—across cryptocurrency, clean energy, agriculture, and gold. Choose the plan that aligns with your goals."
        />
        <PlansSection />
        <Footer />
    </>
  )
}

export default Plans