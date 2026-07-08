/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { servicesData } from '../data';
import { ServiceItem } from '../types';
import { Shirt, HelpCircle, Sparkles, Send, X, ShieldCheck, ZoomIn, Eye, Layers } from 'lucide-react';
import MethodComparisonTable from './MethodComparisonTable';

interface ServicesProps {
  onInquire: (serviceName: string) => void;
}

export default function Services({ onInquire }: ServicesProps) {
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);
  const [modalTab, setModalTab] = useState<'product' | 'texture'>('product');
  const [lightboxImg, setLightboxImg] = useState<{ url: string; title: string; category?: string } | null>(null);

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
    const url = `https://wa.me/919182703766?text=${encodeURIComponent(message)}`; // Replace with real phone placeholder
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
                <div 
                  onClick={() => setLightboxImg({ url: service.image, title: service.title, category: service.category })}
                  className="relative aspect-[4/3] w-full overflow-hidden bg-neutral-100 dark:bg-neutral-800 cursor-zoom-in group/img"
                >
                  <img
                    src={service.image}
                    alt={service.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-108"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-80" />
                  <div className="absolute inset-0 bg-black/10 group-hover/img:bg-black/35 transition-colors duration-300" />
                  
                  {/* Zoom indicator on hover */}
                  <div className="absolute top-4 right-4 p-2 rounded-full bg-white/95 dark:bg-neutral-900/95 text-neutral-800 dark:text-neutral-200 opacity-0 group-hover/img:opacity-100 transition-opacity duration-300 shadow-md">
                    <ZoomIn className="h-4 w-4" />
                  </div>

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
                      onClick={() => {
                        setSelectedService(service);
                        setModalTab('product');
                      }}
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

                {/* Hero Banner inside Modal with dynamic product vs texture closeup toggle */}
                <div 
                  onClick={() => {
                    const url = modalTab === 'product' ? selectedService.image : (selectedService.closeupImage || selectedService.image);
                    const title = modalTab === 'product' ? `${selectedService.title} - Mockup View` : `${selectedService.title} - 10x Texture Closeup`;
                    setLightboxImg({ url, title, category: selectedService.category });
                  }}
                  className="relative h-72 sm:h-80 md:h-96 w-full overflow-hidden bg-neutral-100 dark:bg-neutral-950 cursor-zoom-in group/modal-img"
                >
                  <AnimatePresence mode="wait">
                    <motion.img
                      key={modalTab}
                      initial={{ opacity: 0, filter: 'blur(8px)' }}
                      animate={{ opacity: 1, filter: 'blur(0px)' }}
                      exit={{ opacity: 0, filter: 'blur(8px)' }}
                      transition={{ duration: 0.3 }}
                      src={modalTab === 'product' ? selectedService.image : (selectedService.closeupImage || selectedService.image)}
                      alt={`${selectedService.title} - ${modalTab}`}
                      className="h-full w-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </AnimatePresence>
                  
                  {/* Subtle vignette/gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-white via-white/10 to-transparent dark:from-neutral-900 dark:via-neutral-900/15" />
                  <div className="absolute inset-0 bg-black/5 group-hover/modal-img:bg-black/20 transition-colors duration-300" />
                  
                  {/* Zoom indicator on hover inside modal banner */}
                  <div className="absolute top-4 right-16 z-10 p-2.5 rounded-full bg-white/95 dark:bg-neutral-900/95 text-neutral-800 dark:text-neutral-200 opacity-0 group-hover/modal-img:opacity-100 transition-opacity duration-300 shadow-md">
                    <ZoomIn className="h-4 w-4" />
                  </div>
                  
                  {/* Micro-Inspection Overlay tag if texture closeup is active */}
                  {modalTab === 'texture' && (
                    <div className="absolute top-4 left-4 z-10 px-3 py-1 rounded-full bg-orange-600 text-white text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 shadow-md border border-orange-500/40 animate-pulse">
                      <ZoomIn className="h-3 w-3" />
                      <span>10x Fabric Texture Inspection Zoom</span>
                    </div>
                  )}

                  {/* Dynamic interactive tabs overlayed at the bottom center of the image */}
                  <div className="absolute bottom-6 right-6 z-10 flex gap-1.5 p-1 rounded-full bg-neutral-950/75 backdrop-blur-md border border-neutral-800/60 shadow-lg">
                    <button
                      onClick={() => setModalTab('product')}
                      className={`px-3 py-1.5 rounded-full text-xs font-black uppercase tracking-wider transition-all duration-200 cursor-pointer flex items-center gap-1 ${
                        modalTab === 'product'
                          ? 'bg-white text-neutral-950 shadow-sm'
                          : 'text-neutral-300 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      <Eye className="h-3.5 w-3.5" />
                      <span>Mockup View</span>
                    </button>
                    <button
                      onClick={() => setModalTab('texture')}
                      className={`px-3 py-1.5 rounded-full text-xs font-black uppercase tracking-wider transition-all duration-200 cursor-pointer flex items-center gap-1 ${
                        modalTab === 'texture'
                          ? 'bg-orange-500 text-white shadow-sm'
                          : 'text-neutral-300 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      <Layers className="h-3.5 w-3.5" />
                      <span>10x Texture closeup</span>
                    </button>
                  </div>
                  
                  {/* Category floating bottom left */}
                  <div className="absolute bottom-6 left-6 px-4.5 py-1.5 rounded-full bg-neutral-900/90 dark:bg-neutral-950/90 backdrop-blur-md text-white text-xs font-black uppercase tracking-wider shadow-md border border-neutral-800/40">
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

                  {/* If texture zoom is active, display the detailed thread specifications breakdown! */}
                  <AnimatePresence mode="wait">
                    {modalTab === 'texture' && selectedService.closeupDetails && (
                      <motion.div
                        initial={{ opacity: 0, height: 0, y: -10 }}
                        animate={{ opacity: 1, height: 'auto', y: 0 }}
                        exit={{ opacity: 0, height: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                        className="mt-5 p-5 rounded-2xl bg-orange-500/5 dark:bg-orange-500/10 border border-orange-200/50 dark:border-orange-950/40 flex items-start gap-3.5 overflow-hidden"
                      >
                        <div className="p-2.5 rounded-xl bg-orange-500/10 text-orange-600 dark:text-orange-400 shrink-0 mt-0.5 animate-pulse">
                          <ZoomIn className="h-5 w-5" />
                        </div>
                        <div>
                          <h4 className="text-xs font-black uppercase tracking-widest text-orange-600 dark:text-orange-400">
                            Microscopic Print & Fabric Thread Specs
                          </h4>
                          <p className="text-sm text-neutral-700 dark:text-neutral-300 mt-1.5 leading-relaxed font-medium">
                            {selectedService.closeupDetails}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

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

        {/* Printing Process Comparison Guide */}
        <MethodComparisonTable />

        {/* Full Screen Image Lightbox Modal */}
        <AnimatePresence>
          {lightboxImg && (
            <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/95 backdrop-blur-md">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setLightboxImg(null)}
                className="absolute inset-0 cursor-zoom-out"
              />

              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="relative max-w-4xl max-h-[85vh] flex flex-col bg-white dark:bg-neutral-900 rounded-3xl overflow-hidden border border-neutral-200 dark:border-neutral-800 shadow-2xl"
              >
                {/* Close Button */}
                <button
                  onClick={() => setLightboxImg(null)}
                  className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-black/55 text-white hover:bg-orange-500 hover:scale-105 transition-all cursor-pointer border border-white/10"
                  aria-label="Close Lightbox"
                >
                  <X className="h-5 w-5" />
                </button>

                {/* Immersive Image Display */}
                <div className="overflow-hidden bg-neutral-950 flex-grow flex items-center justify-center max-h-[70vh]">
                  <img
                    src={lightboxImg.url}
                    alt={lightboxImg.title}
                    className="max-h-[70vh] w-auto max-w-full object-contain"
                    referrerPolicy="no-referrer"
                  />
                </div>

                {/* Bottom details with conversion prompt */}
                <div className="p-5.5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white dark:bg-neutral-900 border-t border-neutral-100 dark:border-neutral-800">
                  <div className="text-left">
                    {lightboxImg.category && (
                      <span className="text-[10px] font-black text-orange-500 uppercase tracking-widest">
                        {lightboxImg.category} showcase
                      </span>
                    )}
                    <h3 className="font-bold text-base text-neutral-900 dark:text-white mt-1 leading-tight">
                      {lightboxImg.title}
                    </h3>
                  </div>

                  <button
                    onClick={() => {
                      const msg = `Hello Jyothi Printing Works! I am interested in custom printing services after looking at the "${lightboxImg.title}" sample high-resolution showcase. Please advise on custom options.`;
                      const url = `https://wa.me/919182703766?text=${encodeURIComponent(msg)}`;
                      window.open(url, '_blank');
                    }}
                    className="w-full sm:w-auto px-5 py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-sm flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-md shadow-emerald-500/10"
                  >
                    <Send className="h-4 w-4" />
                    Inquire on WhatsApp
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </section>
  );
}
