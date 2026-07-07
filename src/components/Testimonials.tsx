/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { testimonialsData } from '../data';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';

export default function Testimonials() {
  const [currentIdx, setCurrentIdx] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIdx((prev) => (prev + 1) % testimonialsData.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const handleNext = () => {
    setCurrentIdx((prev) => (prev + 1) % testimonialsData.length);
  };

  const handlePrev = () => {
    setCurrentIdx((prev) => (prev - 1 + testimonialsData.length) % testimonialsData.length);
  };

  const activeTestimonial = testimonialsData[currentIdx];

  return (
    <section id="testimonials-section" className="py-20 bg-neutral-50 dark:bg-neutral-950 relative overflow-hidden">
      <div className="absolute top-1/10 left-1/10 text-neutral-200/20 dark:text-neutral-800/10 pointer-events-none">
        <Quote className="h-64 w-64 rotate-180" />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10">
        
        {/* Section Heading */}
        <div className="text-center mb-12">
          <span className="text-sm font-extrabold text-orange-500 tracking-wider uppercase bg-orange-50 dark:bg-orange-950/40 px-4 py-1.5 rounded-full border border-orange-200/50 dark:border-orange-800/30">
            Social Proof
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-neutral-900 dark:text-white mt-4 tracking-tight">
            Loved By Boutique Owners & Event Organizers
          </h2>
        </div>

        {/* Testimonial Active Display Card with Animations */}
        <div className="relative min-h-[320px] flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTestimonial.id}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.4 }}
              className="w-full bg-white dark:bg-neutral-900 rounded-3xl p-6 sm:p-10.5 border border-neutral-150/60 dark:border-neutral-800 shadow-md flex flex-col md:flex-row gap-6 items-center"
            >
              {/* Profile Photo */}
              <div className="relative shrink-0">
                <div className="h-20 w-20 sm:h-24 sm:w-24 rounded-full overflow-hidden border-3 border-orange-500/25 shadow-md">
                  <img
                    src={activeTestimonial.avatar}
                    alt={activeTestimonial.name}
                    className="h-full w-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="absolute -bottom-1 -right-1 p-1.5 rounded-full bg-orange-500 text-white shadow-sm">
                  <Quote className="h-3 w-3" />
                </div>
              </div>

              {/* Review content */}
              <div className="flex-grow text-center md:text-left space-y-4">
                {/* 5-Star Rating badge */}
                <div className="flex justify-center md:justify-start gap-1">
                  {[...Array(activeTestimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>

                {/* Review Text */}
                <p className="text-base sm:text-lg text-neutral-700 dark:text-neutral-300 font-medium leading-relaxed italic">
                  "{activeTestimonial.review}"
                </p>

                {/* Profile Meta Info */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pt-3 border-t border-neutral-100 dark:border-neutral-800">
                  <div className="text-left">
                    <h4 className="font-black text-neutral-900 dark:text-white text-base leading-none">
                      {activeTestimonial.name}
                    </h4>
                    <span className="text-xs text-neutral-450 mt-1.5 block font-semibold">
                      {activeTestimonial.role}
                    </span>
                  </div>
                  
                  {/* Tag representing ordered item */}
                  <span className="inline-flex self-center sm:self-auto px-3.5 py-1.5 rounded-full bg-orange-500/10 text-orange-600 dark:text-orange-400 font-extrabold text-[10px] uppercase tracking-wider">
                    Item: {activeTestimonial.product}
                  </span>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Carousel Slide controls */}
        <div className="flex justify-between items-center mt-8 px-2">
          <div className="flex gap-1">
            {testimonialsData.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIdx(idx)}
                className={`h-2 rounded-full transition-all cursor-pointer ${
                  currentIdx === idx ? 'w-6.5 bg-orange-500' : 'w-2 bg-neutral-300 dark:bg-neutral-700'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>

          <div className="flex gap-2">
            <button
              onClick={handlePrev}
              className="p-3 rounded-full bg-white dark:bg-neutral-900 border border-neutral-200/50 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-orange-500 hover:text-white hover:border-orange-500 transition-all cursor-pointer shadow-sm"
              aria-label="Previous Testimonial"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={handleNext}
              className="p-3 rounded-full bg-white dark:bg-neutral-900 border border-neutral-200/50 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-orange-500 hover:text-white hover:border-orange-500 transition-all cursor-pointer shadow-sm"
              aria-label="Next Testimonial"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>

      </div>
    </section>
  );
}
