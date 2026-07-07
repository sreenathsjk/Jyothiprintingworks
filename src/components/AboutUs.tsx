/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, Compass, ShieldCheck, Heart, UserCheck } from 'lucide-react';

export default function AboutUs() {
  const values = [
    {
      title: 'Precision Craftsmanship',
      desc: 'We inspect every line, dot, and color tone to ensure print alignment is accurate down to a single millimeter.',
      icon: Compass,
      color: 'text-orange-500'
    },
    {
      title: 'Skin-Safe CMYK Inks',
      desc: 'We utilize premium, eco-friendly, non-toxic pigment inks safe for children, schools, and everyday use.',
      icon: ShieldCheck,
      color: 'text-pink-500'
    },
    {
      title: 'Ethically Sourced Fabrics',
      desc: 'All ringspun combed cotton, silk fabrics, and sports meshes are sourced ethically from verified Indian mills.',
      icon: Heart,
      color: 'text-amber-500'
    },
    {
      title: 'Dedicated Customer Care',
      desc: 'Our design and print coordination managers remain at your service, keeping you updated from setup to delivery.',
      icon: UserCheck,
      color: 'text-blue-500'
    }
  ];

  return (
    <section id="about-section" className="py-20 bg-white dark:bg-neutral-900 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Brand Narrative Intro Row */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Block: Narrative Imagery / Graphic placeholders using curated Unsplash */}
          <div className="lg:col-span-6 relative">
            <div className="relative rounded-3xl overflow-hidden aspect-[4/3] shadow-lg border border-neutral-100 dark:border-neutral-800">
              <img
                src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=800"
                alt="Jyothi Printing Floor"
                className="h-full w-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/60 to-transparent" />
              
              <div className="absolute bottom-6 left-6 text-white text-left">
                <span className="text-[10px] font-black uppercase tracking-widest text-orange-400">
                  ESTABLISHED CRAFT
                </span>
                <h3 className="text-xl sm:text-2xl font-black mt-1 leading-none tracking-tight">
                  Sourcing & Printing Excellence
                </h3>
              </div>
            </div>

            {/* Float visual card */}
            <div className="absolute -bottom-6 -right-6 md:right-6 bg-orange-500 text-white rounded-2xl p-5.5 shadow-xl max-w-xs text-left animate-bounce-slow border-2 border-white dark:border-neutral-800 hidden sm:block">
              <span className="font-extrabold text-xs uppercase tracking-widest block text-orange-200">
                QUALITY PROOF
              </span>
              <p className="font-bold text-sm leading-snug mt-1.5">
                Every shipment undergoes a 12-point Quality Control inspection before leaving our floor.
              </p>
            </div>
          </div>

          {/* Right Block: Core Brand Copy */}
          <div className="lg:col-span-6 space-y-6 text-left">
            <span className="text-sm font-extrabold text-orange-500 tracking-wider uppercase bg-orange-50 dark:bg-orange-950/40 px-4 py-1.5 rounded-full border border-orange-200/50 dark:border-orange-800/30">
              Our Legacy
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-neutral-900 dark:text-white mt-4 tracking-tight leading-none">
              A Premium Printing Studio Dedicated to Perfection
            </h2>
            
            <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-400 leading-relaxed font-semibold">
              Founded on the belief that custom apparel should look and feel as outstanding as retail fashion garments, Jyothi Printing Works integrates state-of-the-art automatic machinery with meticulous artisan handcraft. 
            </p>
            
            <p className="text-sm text-neutral-500 dark:text-neutral-405 leading-relaxed font-medium">
              Whether you are an ethnic boutique designer planning custom printed saree blouses, a collegiate team custom-tailoring sublimated football jerseys, or a multinational corporate administrator deploying standardized employee uniforms, we handle your fabric, ink, and screen settings with unparalleled care. 
            </p>

            <p className="text-sm text-neutral-500 dark:text-neutral-405 leading-relaxed font-medium">
              We pass maximum cost savings directly onto you by manufacturing on-site and working closely with local weavers. That is our absolute quality and affordability promise.
            </p>
          </div>
        </div>

        {/* Core Values grid */}
        <div className="mt-20 pt-12 border-t border-neutral-100 dark:border-neutral-800">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h3 className="text-2xl font-black text-neutral-900 dark:text-white tracking-tight">
              Our Core Foundations & Commitment
            </h3>
            <p className="text-sm text-neutral-450 dark:text-neutral-500 mt-2 font-medium">
              Every garment printed at Jyothi Printing Works is backed by our strict quality pillars.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6.5">
            {values.map((val, idx) => {
              const Icon = val.icon;
              return (
                <div
                  key={idx}
                  className="p-6 rounded-3xl bg-neutral-50 dark:bg-neutral-850/50 border border-neutral-150/40 dark:border-neutral-800 flex flex-col text-left hover:shadow-sm transition-shadow"
                >
                  <div className={`p-3 rounded-2xl bg-white dark:bg-neutral-800 shadow-sm self-start ${val.color}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  
                  <h4 className="font-extrabold text-base text-neutral-900 dark:text-white mt-4 tracking-tight">
                    {val.title}
                  </h4>
                  <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-2 leading-relaxed font-semibold">
                    {val.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}
