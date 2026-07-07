/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { Award, Palette, BadgePercent, Truck, Layers, PenTool, Smile, Shirt } from 'lucide-react';

export default function WhyChooseUs() {
  const cards = [
    {
      title: 'High Quality Printing',
      desc: 'Flawless 1200 DPI prints with rich texture resolution, zero bleeding, and absolute registration alignment.',
      icon: Award,
      gradient: 'from-orange-500/10 to-pink-500/10 dark:from-orange-500/20 dark:to-pink-500/20',
      iconColor: 'text-orange-500 dark:text-orange-400'
    },
    {
      title: 'Long Lasting Colors',
      desc: 'We utilize premium specialized plastisol, water-based, and sublimation inks that stay vibrant for 100+ washes.',
      icon: Palette,
      gradient: 'from-pink-500/10 to-blue-500/10 dark:from-pink-500/20 dark:to-blue-500/20',
      iconColor: 'text-pink-500 dark:text-pink-400'
    },
    {
      title: 'Affordable Prices',
      desc: 'Wholesale tiered pricing directly from our manufacturing floor, passing maximum cost benefits onto you.',
      icon: BadgePercent,
      gradient: 'from-amber-500/10 to-orange-500/10 dark:from-amber-500/20 dark:to-orange-500/20',
      iconColor: 'text-amber-500 dark:text-amber-400'
    },
    {
      title: 'Fast Delivery',
      desc: 'Prompt scheduling with reliable courier partners. Select Express dispatch for urgent 48-hour event deadlines.',
      icon: Truck,
      gradient: 'from-emerald-500/10 to-teal-500/10 dark:from-emerald-500/20 dark:to-teal-500/20',
      iconColor: 'text-emerald-500 dark:text-emerald-400'
    },
    {
      title: 'Bulk Order Specialists',
      desc: 'Heavy-duty automatic carousels engineered to output up to 5000+ pieces daily with exact color uniformity.',
      icon: Layers,
      gradient: 'from-blue-500/10 to-indigo-500/10 dark:from-blue-500/20 dark:to-indigo-500/20',
      iconColor: 'text-blue-500 dark:text-blue-400'
    },
    {
      title: 'Creative Designs',
      desc: 'Free file vector tracing, custom sizing adjustments, and active color recommendations by our studio experts.',
      icon: PenTool,
      gradient: 'from-violet-500/10 to-pink-500/10 dark:from-violet-500/20 dark:to-pink-500/20',
      iconColor: 'text-violet-500 dark:text-violet-400'
    },
    {
      title: 'Customer Satisfaction',
      desc: 'Backed by a dedicated support desk and a transparent policy to guarantee your expectations are met.',
      icon: Smile,
      gradient: 'from-rose-500/10 to-orange-500/10 dark:from-rose-500/20 dark:to-orange-500/20',
      iconColor: 'text-rose-500 dark:text-rose-400'
    },
    {
      title: 'Premium Fabric Printing',
      desc: 'We source pure bio-washed ringspun cotton, mulberry silks, and sweat-wicking meshes that feel outstanding on the skin.',
      icon: Shirt,
      gradient: 'from-cyan-500/10 to-blue-500/10 dark:from-cyan-500/20 dark:to-blue-500/20',
      iconColor: 'text-cyan-500 dark:text-cyan-400'
    }
  ];

  return (
    <section id="why-choose-us" className="py-20 bg-white dark:bg-neutral-900 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-sm font-extrabold text-orange-500 tracking-wider uppercase bg-orange-50 dark:bg-orange-950/40 px-4 py-1.5 rounded-full border border-orange-200/50 dark:border-orange-800/30">
            Why Choose Us
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-neutral-900 dark:text-white mt-4 tracking-tight leading-none">
            The Gold Standard in Apparel & Fabric Printing
          </h2>
          <p className="text-base text-neutral-500 dark:text-neutral-400 mt-4 leading-relaxed font-medium">
            Discover why national colleges, corporate giants, and premium boutique designers partner with Jyothi Printing Works for their custom apparel requirements.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {cards.map((card, idx) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
                whileHover={{ y: -6, boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)' }}
                className="group relative p-6.5 rounded-3xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-150/60 dark:border-neutral-800 transition-all duration-300"
              >
                {/* Icon Wrapper with Custom Gradient */}
                <div className={`inline-flex p-4.5 rounded-2xl bg-gradient-to-br ${card.gradient} transition-transform duration-300 group-hover:scale-110`}>
                  <Icon className={`h-6 w-6 ${card.iconColor}`} />
                </div>

                {/* Text Content */}
                <h3 className="font-bold text-lg text-neutral-900 dark:text-white mt-5 tracking-tight group-hover:text-orange-500 transition-colors duration-200">
                  {card.title}
                </h3>
                <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-2.5 leading-relaxed font-medium">
                  {card.desc}
                </p>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
