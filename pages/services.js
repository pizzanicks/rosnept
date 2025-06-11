import Navbar from '@/components/Navbar'
import React, { useState, useEffect } from 'react'
import HeroBanner from '@/components/HeroBanner'
import ServicesOverview from '@/components/ServicesOverview'
import Testimonials from '@/components/Testimonials'
import WhyInvestSection from '@/components/WhyInvest'
import Footer from '@/components/Footer'
import CtaSection from '@/components/CtaSection'
import Loader from '@/components/Loader'
import Head from 'next/head'

function services() {

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
          <title>Our Services | Rosnept</title>
          <meta
            name="description"
            content="Rosnept offers diversified investment strategies focusing on sustainable returns across cryptocurrency, renewable energy, and other future-forward sectors. We create tailored solutions to meet your financial goals."
          />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
        </Head>
        <Navbar />
        <HeroBanner
            image="/img-2.jpg"
            title="Our Services"
            description="Rosnept offers diversified investment strategies focusing on sustainable returns across cryptocurrency, renewable energy, and other future-forward sectors. We create tailored solutions to meet your financial goals."
        />
        <ServicesOverview />
        <Testimonials />
        <WhyInvestSection />
        <CtaSection />
        <Footer />
    </>
  )
}

export default services