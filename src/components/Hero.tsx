/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, ArrowRight, ShieldCheck, Zap, Award } from 'lucide-react';

interface HeroProps {
  onNavigate: (page: string) => void;
}

export default function Hero({ onNavigate }: HeroProps) {
  // Curated premium mockups for Hero visual block
  const mockups = [
    {
      title: 'Printed T-Shirts',
      desc: '100% Combed Cotton',
      image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&q=80&w=800',
      badge: 'Best Seller'
    },
    {
      title: 'Designer Blouse',
      desc: 'Bespoke Peacock Print',
      image: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&q=80&w=800',
      badge: 'Bespoke'
    },
    {
      title: 'Sports Jerseys',
      desc: 'Active Sublimation',
      image: 'https://images.unsplash.com/photo-1587280501635-68a0e82cd5ff?auto=format&fit=crop&q=80&w=800',
      badge: 'Dry-Fit'
    },
    {
      title: 'Company Uniforms',
      desc: 'Elite Embroidery',
      image: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&q=80&w=800',
      badge: 'Premium'
    }
  ];

  return (
    <section
      id="hero-section"
      className="relative pt-24 pb-16 lg:pt-36 lg:pb-24 overflow-hidden bg-gradient-to-b from-orange-50/50 via-white to-neutral-50 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-950"
    >
      {/* Decorative Blur Spheres for Glassmorphic backdrop */}
      <div className="absolute top-1/4 left-1/10 w-96 h-96 bg-orange-400/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/10 right-1/10 w-[450px] h-[450px] bg-amber-400/10 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Hero Text Content (Left 7 Columns on Large Screens) */}
          <div className="lg:col-span-7 flex flex-col space-y-6 text-center lg:text-left">
            {/* Tagline Badge */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4.5 py-2 rounded-full bg-orange-500/10 dark:bg-orange-500/20 text-orange-600 dark:text-orange-400 font-semibold text-xs tracking-wider uppercase self-center lg:self-start border border-orange-500/20 shadow-sm"
            >
              <Sparkles className="h-4 w-4 animate-spin-slow text-orange-500" />
              The Art of Printing, Perfected
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-neutral-900 dark:text-white leading-[1.1]"
            >
              Premium Custom Printing <br />
              <span className="bg-gradient-to-r from-orange-500 via-pink-500 to-amber-500 bg-clip-text text-transparent">
                Brings Your Ideas to Life
              </span>
            </motion.h1>

            {/* Subheading */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-base sm:text-lg md:text-xl text-neutral-600 dark:text-neutral-400 font-medium max-w-2xl mx-auto lg:mx-0 leading-relaxed"
            >
              Custom T-Shirts, Designer Blouses, Corporate Uniforms, Sports Jerseys, and High-Volume Bulk Printing. Experience industrial precision with boutique-level fabric detail.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 items-center justify-center lg:justify-start pt-2"
            >
              <button
                onClick={() => onNavigate('contact')}
                id="hero-cta-quote"
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold tracking-wide shadow-lg shadow-orange-500/20 hover:shadow-orange-500/30 transition-all hover:-translate-y-0.5 active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
              >
                Get Free Quote
                <ArrowRight className="h-5 w-5" />
              </button>
              
              <button
                onClick={() => onNavigate('services')}
                id="hero-cta-work"
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white dark:bg-neutral-800 text-neutral-800 dark:text-white font-bold border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-750 hover:border-orange-500/30 transition-all shadow-sm hover:-translate-y-0.5 active:scale-95 cursor-pointer text-center"
              >
                View Our Work
              </button>
            </motion.div>

            {/* Trust Badges */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="grid grid-cols-3 gap-4 pt-6 border-t border-neutral-200/60 dark:border-neutral-800/60 max-w-lg mx-auto lg:mx-0"
            >
              <div className="flex flex-col items-center lg:items-start">
                <span className="flex items-center gap-1.5 font-bold text-neutral-900 dark:text-white text-sm sm:text-base">
                  <ShieldCheck className="h-4 w-4 text-orange-500" />
                  Premium
                </span>
                <span className="text-[10px] sm:text-xs text-neutral-500 uppercase tracking-wider mt-0.5">Fabric Quality</span>
              </div>
              <div className="flex flex-col items-center lg:items-start">
                <span className="flex items-center gap-1.5 font-bold text-neutral-900 dark:text-white text-sm sm:text-base">
                  <Zap className="h-4 w-4 text-orange-500" />
                  48 Hours
                </span>
                <span className="text-[10px] sm:text-xs text-neutral-500 uppercase tracking-wider mt-0.5">Express Dispatch</span>
              </div>
              <div className="flex flex-col items-center lg:items-start">
                <span className="flex items-center gap-1.5 font-bold text-neutral-900 dark:text-white text-sm sm:text-base">
                  <Award className="h-4 w-4 text-orange-500" />
                  100%
                </span>
                <span className="text-[10px] sm:text-xs text-neutral-500 uppercase tracking-wider mt-0.5">Satisfaction</span>
              </div>
            </motion.div>
          </div>

          {/* Hero Visual Mockups Showcase (Right 5 Columns on Large Screens) */}
          <div className="lg:col-span-5 relative mt-8 lg:mt-0">
            <div className="grid grid-cols-2 gap-4">
              {mockups.map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0.9, y: 30 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: idx * 0.12 }}
                  whileHover={{ y: -8, scale: 1.02 }}
                  className="group relative overflow-hidden rounded-3xl bg-white dark:bg-neutral-800 p-3 shadow-md hover:shadow-xl dark:shadow-neutral-950/20 border border-neutral-100 dark:border-neutral-800 transition-all duration-300"
                >
                  {/* Image wrapper */}
                  <div className="aspect-square w-full overflow-hidden rounded-2xl bg-neutral-100 dark:bg-neutral-900 relative">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-2 left-2 px-2.5 py-1 rounded-full bg-white/90 dark:bg-neutral-900/90 backdrop-blur-md text-[10px] font-extrabold text-orange-600 dark:text-orange-400 tracking-wider uppercase shadow-sm">
                      {item.badge}
                    </div>
                  </div>

                  {/* Card Info */}
                  <div className="pt-3 px-1">
                    <h3 className="font-bold text-sm text-neutral-900 dark:text-white leading-tight">
                      {item.title}
                    </h3>
                    <p className="text-[11px] text-neutral-500 dark:text-neutral-400 font-semibold mt-0.5">
                      {item.desc}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Overlay float elements for a premium 3D design feel */}
            <div className="absolute -top-6 -right-6 h-12 w-12 bg-amber-500 rounded-full mix-blend-multiply filter blur-sm opacity-30 animate-pulse" />
            <div className="absolute -bottom-6 -left-6 h-16 w-16 bg-pink-500 rounded-full mix-blend-multiply filter blur-sm opacity-20 animate-pulse" />
          </div>

        </div>
      </div>
    </section>
  );
}
