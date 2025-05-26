import AssetPortfolio from '@/components/AssetPortfolio'
import SustainableGrowthSection from '@/components/Growth'
import Hero from '@/components/Hero'
import IntroSection from '@/components/Intro'
import Navbar from '@/components/Navbar'
import RiskManagement from '@/components/Riskmanagement'
import TestimonialSection from '@/components/Testimonials'
import WhyInvestSection from '@/components/WhyInvest'
import React, { useState, useEffect } from 'react'
import BlogSection from '@/components/Blog'
import Footer from '@/components/Footer'
import CtaSection from '@/components/CtaSection'
import Loader from '@/components/Loader'
import Head from 'next/head'

function Index() {

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
        <title>Rosnept | Sustainable Crypto & Energy Investments</title>
        <meta name="description" content="Rosnept combines crypto strategies with sustainable energy investments. Generate consistent returns while supporting a greener future." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <Navbar />
      <Hero />
      <IntroSection />
      <AssetPortfolio />
      <RiskManagement />
      <WhyInvestSection />
      <TestimonialSection />
      <SustainableGrowthSection />
      <BlogSection sliceCount={3} />
      <CtaSection />
      <Footer />
    </>
  )
}

export default Index