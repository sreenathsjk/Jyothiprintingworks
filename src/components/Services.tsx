/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { servicesData } from '../data';
import { ServiceItem } from '../types';
import { Shirt, HelpCircle, Sparkles, Send, X, ShieldCheck } from 'lucide-react';

interface ServicesProps {
  onInquire: (serviceName: string) => void;
}

export default function Services({ onInquire }: ServicesProps) {
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);

  // Grouped Categories for filter controls
  const filters = [
    { id: 'all', label: 'All Services' },
    { id: 'apparel', label: 'Fashion & Custom' },
    { id: 'ethnic', label: 'Ethnic & Traditional' },
    { id: 'athletic', label: 'Athletic Wear' },
    { id: 'corporate', label: 'Corporate & Bulk' },
  ];

  const filteredServices = activeFilter === 'all'
    ? servicesData
    : servicesData.filter(service => {
        if (activeFilter === 'apparel') return ['tshirt-printing', 'couple-tshirts', 'birthday-tshirts', 'custom-orders'].includes(service.id);
        if (activeFilter === 'ethnic') return ['blouse-printing', 'festival-tshirts'].includes(service.id);
        if (activeFilter === 'athletic') return ['sports-jersey'].includes(service.id);
        if (activeFilter === 'corporate') return ['corporate-uniforms', 'school-uniforms', 'college-fests', 'logo-printing', 'bulk-printing'].includes(service.id);
        return service.category === activeFilter;
      });

  const handleWhatsAppClick = (service: ServiceItem) => {
    const message = `Hello Jyothi Printing Works! I am interested in your "${service.title}" service. Please share details regarding fabric options and pricing.`;
    const url = `https://wa.me/919900000000?text=${encodeURIComponent(message)}`; // Replace with real phone placeholder
    window.open(url, '_blank');
  };

  return (
    <section id="services-section" className="py-20 bg-neutral-50 dark:bg-neutral-950 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-sm font-extrabold text-orange-500 tracking-wider uppercase bg-orange-50 dark:bg-orange-950/40 px-4 py-1.5 rounded-full border border-orange-200/50 dark:border-orange-800/30">
            Our Services
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-neutral-900 dark:text-white mt-4 tracking-tight">
            Comprehensive Fabrics & Custom Apparel Printing
          </h2>
          <p className="text-base text-neutral-500 dark:text-neutral-400 mt-4 leading-relaxed font-medium">
            From single custom gift t-shirts to massive corporate and collegiate uniform deployments, we execute your order with premium finishes.
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {filters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={`px-5 py-2.5 rounded-full text-sm font-semibold tracking-wide transition-all cursor-pointer ${
                activeFilter === filter.id
                  ? 'bg-orange-500 text-white shadow-md shadow-orange-500/20'
                  : 'bg-white dark:bg-neutral-950 text-neutral-600 dark:text-neutral-400 hover:text-orange-500 hover:bg-neutral-100 dark:hover:bg-neutral-900 border border-neutral-200/60 dark:border-neutral-800'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {/* Services Grid Layout */}
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          <AnimatePresence mode="popLayout">
            {filteredServices.map((service) => (
              <motion.div
                key={service.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4 }}
                whileHover={{ y: -6 }}
                className="group flex flex-col h-full bg-white dark:bg-neutral-900 rounded-3xl overflow-hidden border border-neutral-200/50 dark:border-neutral-800 shadow-sm hover:shadow-lg transition-all duration-300"
              >
                {/* Product/Service Image Thumbnail */}
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-neutral-100 dark:bg-neutral-800">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-108"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-80" />
                  
                  {/* Category Pill Tag */}
                  <div className="absolute bottom-4 left-4 px-3 py-1 rounded-full bg-white/95 dark:bg-neutral-950/95 backdrop-blur-md text-[10px] font-black uppercase text-orange-600 dark:text-orange-400 tracking-wider shadow-sm">
                    {service.category}
                  </div>
                </div>

                {/* Service Card Details */}
                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="font-bold text-xl text-neutral-900 dark:text-white tracking-tight group-hover:text-orange-500 transition-colors duration-200">
                    {service.title}
                  </h3>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-2.5 leading-relaxed flex-grow font-medium">
                    {service.description}
                  </p>

                  {/* Actions Bar */}
                  <div className="mt-6 pt-5 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between gap-4">
                    <button
                      onClick={() => setSelectedService(service)}
                      id={`learn-more-${service.id}`}
                      className="text-xs font-extrabold uppercase tracking-widest text-neutral-900 dark:text-neutral-200 hover:text-orange-500 dark:hover:text-orange-400 flex items-center gap-1 cursor-pointer"
                    >
                      Learn More
                      <span className="inline-block transition-transform duration-200 group-hover:translate-x-1">→</span>
                    </button>

                    <button
                      onClick={() => onInquire(service.title)}
                      id={`inquire-btn-${service.id}`}
                      className="px-4 py-2 rounded-xl bg-orange-500/10 dark:bg-orange-500/15 text-orange-600 dark:text-orange-400 hover:bg-orange-500 hover:text-white transition-all text-xs font-bold tracking-wide cursor-pointer"
                    >
                      Quick Quote
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Detailed Service Overlay Modal */}
        <AnimatePresence>
          {selectedService && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              {/* Modal Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedService(null)}
                className="absolute inset-0 bg-neutral-950/70 backdrop-blur-sm"
              />

              {/* Modal Container */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 30 }}
                transition={{ type: 'spring', damping: 25, stiffness: 220 }}
                className="relative w-full max-w-3xl bg-white dark:bg-neutral-900 rounded-3xl overflow-hidden shadow-2xl border border-neutral-200 dark:border-neutral-800 max-h-[90vh] overflow-y-auto"
              >
                {/* Close Button */}
                <button
                  onClick={() => setSelectedService(null)}
                  className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/90 dark:bg-neutral-800/95 text-neutral-800 dark:text-neutral-200 hover:bg-orange-500 hover:text-white hover:scale-105 shadow-md transition-all cursor-pointer"
                  aria-label="Close details"
                >
                  <X className="h-5 w-5" />
                </button>

                {/* Hero Banner inside Modal */}
                <div className="relative h-64 sm:h-72 md:h-80 w-full overflow-hidden">
                  <img
                    src={selectedService.image}
                    alt={selectedService.title}
                    className="h-full w-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-white via-white/10 to-transparent dark:from-neutral-900 dark:via-neutral-900/10" />
                  
                  {/* Category floating */}
                  <div className="absolute bottom-6 left-6 px-4.5 py-1.5 rounded-full bg-orange-500 text-white text-xs font-black uppercase tracking-wider shadow-md">
                    {selectedService.category}
                  </div>
                </div>

                {/* Modal Body Info */}
                <div className="p-6 sm:p-8">
                  <h3 className="text-2xl sm:text-3xl font-black text-neutral-900 dark:text-white tracking-tight">
                    {selectedService.title}
                  </h3>
                  
                  <p className="text-base text-neutral-600 dark:text-neutral-400 mt-4 leading-relaxed font-medium">
                    {selectedService.longDescription}
                  </p>

                  {/* Bulleted Fabric Specifications */}
                  <div className="mt-6">
                    <h4 className="text-sm font-extrabold uppercase tracking-widest text-neutral-500 mb-3.5 flex items-center gap-1.5">
                      <Sparkles className="h-4.5 w-4.5 text-orange-500 animate-pulse" />
                      Premium Fabric & Print Specifications:
                    </h4>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      {selectedService.features.map((feature, idx) => (
                        <div key={idx} className="flex items-start gap-2">
                          <ShieldCheck className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                          <span className="text-sm text-neutral-700 dark:text-neutral-300 font-semibold">
                            {feature}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Booking and Quotation Actions */}
                  <div className="mt-8 pt-6 border-t border-neutral-100 dark:border-neutral-800 flex flex-col sm:flex-row items-center gap-4">
                    <button
                      onClick={() => handleWhatsAppClick(selectedService)}
                      className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold flex items-center justify-center gap-2 transition-all shadow-md shadow-emerald-500/10 hover:shadow-emerald-500/25 cursor-pointer text-sm"
                    >
                      <Send className="h-4 w-4" />
                      Inquire on WhatsApp
                    </button>

                    <button
                      onClick={() => {
                        onInquire(selectedService.title);
                        setSelectedService(null);
                      }}
                      className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-neutral-900 dark:bg-orange-500 text-white font-bold text-center hover:bg-orange-500 dark:hover:bg-orange-600 transition-all shadow-md hover:shadow-orange-500/15 cursor-pointer text-sm"
                    >
                      Configure Custom Quote
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </section>
  );
}
