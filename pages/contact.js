import Navbar from '@/components/Navbar'
import HeroBanner from '@/components/HeroBanner'
import React, { useState, useEffect } from 'react'
import ContactSection from '@/components/ContactForm'
import Footer from '@/components/Footer'
import Loader from '@/components/Loader'
import Head from 'next/head'

function Contact() {

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
            <title>Contact Us | Rosnept</title>
            <meta
            name="description"
            content="Have questions or ready to invest? Contact Rosnept to explore innovative and sustainable investment opportunities today."
            />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
        </Head>
        <Navbar />
        <HeroBanner
            image="/rev-1.png"
            title="Contact Us"
            description="Have questions or ready to invest? Rosnept’s team is here to help you navigate sustainable investment opportunities. Reach out today and let’s grow your future together."
        />
        <ContactSection />
        <Footer />
    </>
  )
}

export default Contact