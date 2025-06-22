// pages/index.js
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
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import nextI18NextConfig from '../next-i18next.config.mjs';


function Index() {
  // --- START FIX: Move all hooks to the top level, before any conditional returns ---
  const [pageLoading, setPageLoading] = useState(true);
  const { t } = useTranslation('common'); // <--- MOVED THIS HOOK HERE

  useEffect(() => {
    const timer = setTimeout(() => {
      setPageLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []); // <--- This useEffect is also a hook and must be called unconditionally

  // --- END FIX ---

  if (pageLoading) {
    return <Loader />;
  }

  return (
    <>
      <Head>
        <title>{t('homepage_title')}</title>
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

      {/* Example Section for direct page translation */}
      <section className="py-12 bg-white text-center px-4">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-4">
          {t('greeting')}
        </h1>
        <p className="text-lg text-gray-700 max-w-2xl mx-auto">
          {t('homepage_title')}
        </p>
        <button className="mt-8 bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors">
          {t('login_button')}
        </button>
      </section>

      <CtaSection />
      <Footer />
    </>
  )
}

export default Index

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'], nextI18NextConfig)),
    },
  };
}
