import Navbar from '@/components/Navbar'
import React, { useState, useEffect } from 'react'
import HeroBanner from '@/components/HeroBanner'
import RosneplIntro from '@/components/DnIntro'
import TopCryptos from '@/components/CryptoPrice'
import QuoteSection from '@/components/QuoteSection'
import StatsSection from '@/components/Statistics'
import Footer from '@/components/Footer'
import Loader from '@/components/Loader'
import FaqSection from '@/components/Faqs'
import Head from 'next/head'

function About() {

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
        <title>About Us | Rosnept</title>
        <meta name="description" content="Learn about Rosnept – a firm blending cryptocurrency, renewable energy, agriculture, and gold to create balanced, future-focused investments." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
        <Navbar />
        <HeroBanner
            image="/img-5.jpg"
            title="Who We Are"
            description="Rosnept combines innovation and sustainability to deliver smarter investment strategies in cryptocurrency, energy, agriculture, and gold."
        />
        <RosneplIntro />
        <TopCryptos />
        <QuoteSection />
        <StatsSection />
        <FaqSection />
        <Footer />
    </>
  )
}

export default About