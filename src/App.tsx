/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import WhyChooseUs from './components/WhyChooseUs';
import Services from './components/Services';
import Gallery from './components/Gallery';
import OrderProcess from './components/OrderProcess';
import Stats from './components/Stats';
import Testimonials from './components/Testimonials';
import FAQs from './components/FAQs';
import AboutUs from './components/AboutUs';
import BulkOrders from './components/BulkOrders';
import Contact from './components/Contact';
import Footer from './components/Footer';
import WhatsAppButton from './components/WhatsAppButton';
import BackToTop from './components/BackToTop';
import { ArrowLeft } from 'lucide-react';

export default function App() {
  const [currentPage, setCurrentPage] = useState<string>('home');
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [prefilledService, setPrefilledService] = useState<string>('');

  // Handle Hash Location on Boot and support browser back/forward buttons
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      const validPages = ['home', 'about', 'services', 'gallery', 'bulk-orders', 'faqs', 'contact'];
      if (hash && validPages.includes(hash)) {
        setCurrentPage(hash);
      } else {
        setCurrentPage('home');
      }
    };

    // Run on boot
    handleHashChange();

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Smooth scroll to top on page change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  // Sync visual Dark Mode body class
  useEffect(() => {
    const root = window.document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [isDarkMode]);

  // SEO: Dynamic Page Titles and Header Meta Descriptions
  useEffect(() => {
    let title = 'Jyothi Printing Works | Premium Custom Printing Studio';
    let desc = 'Premium custom printing studio specializing in high-quality custom T-shirts, blouse printing, sports jerseys, corporate uniforms, and bulk orders.';

    switch (currentPage) {
      case 'about':
        title = 'About Us | Jyothi Printing Works';
        desc = 'Discover the legacy of India’s top custom printing studio. We supply combed cotton fabrics combined with screen, digital, and embroidery crafts.';
        break;
      case 'services':
        title = 'Our Services | Custom Fabric & Apparel Printing';
        desc = 'Explore 12+ custom printing services including t-shirt screen printing, saree blouse embroidery, and full sublimation athletic jerseys.';
        break;
      case 'gallery':
        title = 'Print Workshop Gallery | Fabric details';
        desc = 'Browse our immersive closeups of raw linen, silk patterns, embroidery screens, and daily automatic carousel printing floor operations.';
        break;
      case 'bulk-orders':
        title = 'Bulk Orders & Pricing Estimator | Custom apparel';
        desc = 'Calculate your bulk custom t-shirt or jersey pricing on-the-fly with our interactive slider. Get wholesale discounts up to 40% off!';
        break;
      case 'faqs':
        title = 'Frequently Asked Questions | Help Center';
        desc = 'Find quick support answers regarding Minimum Order Quantities (MOQ), 48-hour express delivery, and payment terms.';
        break;
      case 'contact':
        title = 'Get a Free Quote | Contact Jyothi Printing Works';
        desc = 'Inquire about fabric templates or file preparation guidelines. Submit your requirement to get an official quote in under 2 hours.';
        break;
      default:
        break;
    }

    document.title = title;

    // Dynamically insert/update metadata descriptors
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute('content', desc);

    // Dynamically inject OpenGraph SEO Tags
    const ogTitle = document.querySelector('meta[property="og:title"]') || document.createElement('meta');
    ogTitle.setAttribute('property', 'og:title');
    ogTitle.setAttribute('content', title);
    document.head.appendChild(ogTitle);

    const ogDesc = document.querySelector('meta[property="og:description"]') || document.createElement('meta');
    ogDesc.setAttribute('property', 'og:description');
    ogDesc.setAttribute('content', desc);
    document.head.appendChild(ogDesc);
  }, [currentPage]);

  // SEO: Dynamically inject Google LocalBusiness JSON-LD Schema Markup
  useEffect(() => {
    const existingScript = document.getElementById('jyothi-schema-markup');
    if (existingScript) {
      existingScript.remove();
    }

    const schema = {
      '@context': 'https://schema.org',
      '@type': 'LocalBusiness',
      'name': 'Jyothi Printing Works',
      'image': 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=800',
      'telephone': '+919182703766',
      'email': 'info@jyothiprintingworks.com',
      'address': {
        '@type': 'PostalAddress',
        'streetAddress': 'Industrial Estate',
        'addressLocality': 'Bengaluru',
        'addressRegion': 'Karnataka',
        'postalCode': '560001',
        'addressCountry': 'IN'
      },
      'geo': {
        '@type': 'GeoCoordinates',
        'latitude': '12.971599',
        'longitude': '77.591244'
      },
      'url': 'https://jyothiprintingworks.com',
      'openingHoursSpecification': {
        '@type': 'OpeningHoursSpecification',
        'dayOfWeek': [
          'Monday',
          'Tuesday',
          'Wednesday',
          'Thursday',
          'Friday',
          'Saturday'
        ],
        'opens': '09:00',
        'closes': '20:00'
      }
    };

    const script = document.createElement('script');
    script.id = 'jyothi-schema-markup';
    script.type = 'application/ld+json';
    script.innerHTML = JSON.stringify(schema);
    document.head.appendChild(script);
  }, []);

  // Coordinate custom quick quotes from Service modals
  const handleServiceInquiry = (serviceName: string) => {
    setPrefilledService(serviceName);
    setCurrentPage('contact');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePageNavigation = (pageId: string) => {
    setCurrentPage(pageId);
    setPrefilledService(''); // Reset prefill when navigating manually
    
    // Set hash to support browser history (enables back button navigation)
    if (window.location.hash.replace('#', '') !== pageId) {
      window.location.hash = pageId;
    }
  };

  // Render current tab view
  const renderPageContent = () => {
    switch (currentPage) {
      case 'about':
        return (
          <motion.div
            key="about-page"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.35 }}
          >
            <AboutUs />
            <WhyChooseUs />
            <Stats />
          </motion.div>
        );
      case 'services':
        return (
          <motion.div
            key="services-page"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.35 }}
          >
            <Services onInquire={handleServiceInquiry} />
          </motion.div>
        );
      case 'gallery':
        return (
          <motion.div
            key="gallery-page"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.35 }}
          >
            <Gallery />
          </motion.div>
        );
      case 'bulk-orders':
        return (
          <motion.div
            key="bulk-page"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.35 }}
          >
            <BulkOrders />
          </motion.div>
        );
      case 'faqs':
        return (
          <motion.div
            key="faqs-page"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.35 }}
          >
            <FAQs />
          </motion.div>
        );
      case 'contact':
        return (
          <motion.div
            key="contact-page"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.35 }}
          >
            <Contact prefilledRequirement={prefilledService} />
          </motion.div>
        );
      case 'home':
      default:
        return (
          <motion.div
            key="home-page"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Hero onNavigate={handlePageNavigation} />
            <WhyChooseUs />
            <Services onInquire={handleServiceInquiry} />
            <OrderProcess />
            <Stats />
            <Testimonials />
            <FAQs />
            <Contact prefilledRequirement={prefilledService} />
          </motion.div>
        );
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-neutral-50 dark:bg-neutral-950 font-sans antialiased text-neutral-900 dark:text-neutral-100 selection:bg-orange-500 selection:text-white">
      {/* Sticky Top Header */}
      <Navbar
        currentPage={currentPage}
        setCurrentPage={handlePageNavigation}
        isDarkMode={isDarkMode}
        setIsDarkMode={setIsDarkMode}
      />

      {/* Back Option Navigation Bar for sub-pages */}
      {currentPage !== 'home' && (
        <div className="bg-white dark:bg-neutral-900 pt-24 pb-4 border-b border-neutral-100 dark:border-neutral-800 transition-colors duration-300">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
            <button
              onClick={() => handlePageNavigation('home')}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-neutral-100 dark:bg-neutral-800 hover:bg-orange-500 hover:text-white dark:hover:bg-orange-500 dark:hover:text-white transition-all group cursor-pointer text-sm font-bold text-neutral-700 dark:text-neutral-300 shadow-sm"
              aria-label="Back to Home Page"
            >
              <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
              <span>Back to Home</span>
            </button>
            <div className="text-xs font-semibold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest hidden sm:block">
              Currently Viewing: <span className="text-neutral-700 dark:text-neutral-300 font-extrabold">{currentPage.replace('-', ' ')}</span>
            </div>
          </div>
        </div>
      )}

      {/* Dynamic Content Frame with page transitions */}
      <main className="flex-grow">
        <AnimatePresence mode="wait">
          {renderPageContent()}
        </AnimatePresence>
      </main>

      {/* Universal Footer */}
      <Footer onNavigate={handlePageNavigation} currentPage={currentPage} />

      {/* Accessibility Sticky Widgets */}
      <WhatsAppButton />
      <BackToTop />
    </div>
  );
}
