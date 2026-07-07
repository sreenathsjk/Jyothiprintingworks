/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { ShoppingBag, Upload, ClipboardCheck, Printer, Truck } from 'lucide-react';

export default function OrderProcess() {
  const steps = [
    {
      stepNum: '01',
      title: 'Choose Product',
      desc: 'Browse our massive inventory of premium cotton t-shirts, silk blouse fabrics, athletic team meshes, or corporate polos.',
      icon: ShoppingBag,
      color: 'bg-orange-500 text-white'
    },
    {
      stepNum: '02',
      title: 'Send Your Design',
      desc: 'Upload your vector file or low-res graphic logo. Our in-house designers trace and optimize your designs absolutely free.',
      icon: Upload,
      color: 'bg-pink-500 text-white'
    },
    {
      stepNum: '03',
      title: 'Approve Sample',
      desc: 'We generate an ultra-realistic 3D digital mockup or construct a physical sample for your fabric and color approval.',
      icon: ClipboardCheck,
      color: 'bg-amber-500 text-white'
    },
    {
      stepNum: '04',
      title: 'Precision Printing',
      desc: 'Our high-speed automatic carousel and embroidery rigs apply precision colors and multi-layer texture layers.',
      icon: Printer,
      color: 'bg-blue-500 text-white'
    },
    {
      stepNum: '05',
      title: 'Express Delivery',
      desc: 'Every garment undergoes 100% strict QC checking, is folded and steam-pressed, and gets dispatched to your doorstep.',
      icon: Truck,
      color: 'bg-emerald-500 text-white'
    }
  ];

  return (
    <section id="process-section" className="py-20 bg-white dark:bg-neutral-900 relative overflow-hidden">
      {/* Wave element decorative background */}
      <div className="absolute top-1/2 left-0 right-0 h-[2px] bg-neutral-200/50 dark:bg-neutral-800/50 -translate-y-1/2 hidden lg:block z-0" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-sm font-extrabold text-orange-500 tracking-wider uppercase bg-orange-50 dark:bg-orange-950/40 px-4 py-1.5 rounded-full border border-orange-200/50 dark:border-orange-800/30">
            How It Works
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-neutral-900 dark:text-white mt-4 tracking-tight">
            Our Flawless 5-Step Order Journey
          </h2>
          <p className="text-base text-neutral-500 dark:text-neutral-400 mt-4 leading-relaxed font-medium">
            We’ve engineered our printing workflow to be incredibly straightforward, transparent, and responsive from blueprint to doorstep.
          </p>
        </div>

        {/* Timeline Grid layout */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 relative">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="flex flex-col items-center text-center group bg-neutral-50 dark:bg-neutral-800/40 p-6.5 rounded-3xl border border-neutral-150/40 dark:border-neutral-800 relative z-10 hover:shadow-md transition-all duration-300"
              >
                {/* Step Circle Badge */}
                <span className="absolute -top-3.5 left-6 px-3.5 py-1 rounded-full bg-neutral-900 dark:bg-orange-500 text-white font-mono text-xs font-black tracking-widest shadow-md">
                  STEP {step.stepNum}
                </span>

                {/* Main Icon wrapper */}
                <div className={`p-5 rounded-2xl ${step.color} shadow-lg shadow-black/5 hover:scale-105 transition-transform duration-300 mb-5 mt-2`}>
                  <Icon className="h-6.5 w-6.5" />
                </div>

                {/* Step Description */}
                <h3 className="font-bold text-lg text-neutral-900 dark:text-white tracking-tight group-hover:text-orange-500 transition-colors">
                  {step.title}
                </h3>
                <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-2.5 leading-relaxed font-semibold">
                  {step.desc}
                </p>

                {/* Connecting arrow indicator for mobile/tablet */}
                {idx < 4 && (
                  <div className="lg:hidden w-1 h-8 bg-gradient-to-b from-orange-500 to-amber-500 my-4 opacity-50" />
                )}
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
