// pages/plans.js
'use client'; // This component runs on the client side

import Navbar from '@/components/Navbar';
import HeroBanner from '@/components/HeroBanner';
import React, { useState, useEffect } from 'react';
import Footer from '@/components/Footer';
import Loader from '@/components/Loader';
import Head from 'next/head';
import { collection, onSnapshot } from 'firebase/firestore';
import db from '@/lib/firebase';
import { useRouter } from 'next/router';
// --- NEW IMPORT FOR TRANSLATION ---
import { useTranslation } from 'next-i18next';
// --- END NEW IMPORT ---

function PlansPage() {
    const [pageLoading, setPageLoading] = useState(true);
    const [plans, setPlans] = useState([]);
    const router = useRouter();
    // --- Initialize the translation hook ---
    const { t } = useTranslation('common');
    // --- End translation hook initialization ---

    useEffect(() => {
        const timer = setTimeout(() => {
            setPageLoading(false);
        }, 1000);

        // Fetch plans from 'MANAGE_PLAN' collection
        const unsubscribe = onSnapshot(collection(db, 'MANAGE_PLAN'), (snapshot) => {
            const fetchedPlans = snapshot.docs
                .map(doc => ({ id: doc.id, ...doc.data() }))
                .filter(plan => plan.enabled); // Only show plans that are marked as 'enabled'
            setPlans(fetchedPlans);
        });

        return () => {
            clearTimeout(timer);
            unsubscribe();
        };
    }, []);

    if (pageLoading) {
        return <Loader />;
    }

    return (
        <>
            <Head>
                {/* Translate Head title */}
                <title>{t('plans_page_title')}</title>
                {/* Translate Head meta description */}
                <meta
                    name="description"
                    content={t('plans_page_meta_description')}
                />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
            </Head>
            <Navbar />
            <HeroBanner
                image="/rev-1.png"
                // Translate HeroBanner title
                title={t('plans_hero_title')}
                // Translate HeroBanner description
                description={t('plans_hero_description')}
            />
            <section className="min-h-screen bg-gray-50 px-4 py-12 sm:px-8 lg:px-16">
                {plans.length === 0 ? (
                    // Translate "No active plans" message
                    <p className="text-center text-gray-600 text-lg">{t('no_active_plans_message')}</p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {plans.map(plan => (
                            <div key={plan.id} className="bg-white rounded-lg shadow-lg p-6 flex flex-col justify-between">
                                <div>
                                    <h2 className="text-xl font-bold text-blue-800 mb-2">{plan.plan}</h2>
                                    <p className="text-sm text-gray-600 mb-1">{plan.subTitle}</p>
                                    <p className="text-sm text-gray-500 mb-2">{plan.description}</p>
                                    <p className="text-lg font-bold text-gray-800 mb-1">{plan.price}</p>
                                    <p className="text-green-600 font-semibold mb-3">{plan.roi}</p>
                                    <ul className="list-disc list-inside text-sm text-gray-700 mb-4">
                                        {plan.highlights?.map((item, i) => (
                                            <li key={i}>{item}</li>
                                        ))}
                                    </ul>
                                </div>
                                <button
                                    className={`${plan.buttonStyle || 'bg-blue-600'} text-white py-2 mt-auto rounded hover:opacity-90 transition`}
                                    onClick={() => router.push('/signup')}
                                >
                                    {plan.cta || t('get_started_cta')} {/* Translate fallback CTA */}
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </section>
            <Footer />
        </>
    )
}

export default PlansPage;
