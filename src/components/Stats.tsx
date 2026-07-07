/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { statsData } from '../data';
import { Sparkles, HelpCircle, Trophy, ThumbsUp } from 'lucide-react';

export default function Stats() {
  const getIcon = (id: string) => {
    if (id === 's1') return ThumbsUp;
    if (id === 's2') return Trophy;
    if (id === 's3') return Sparkles;
    return HelpCircle; // s4 has custom visual elements
  };

  return (
    <section id="stats-section" className="py-16 bg-neutral-900 text-white relative overflow-hidden">
      {/* Visual background lights */}
      <div className="absolute top-1/2 left-1/4 w-80 h-80 bg-orange-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/2 right-1/4 w-80 h-80 bg-pink-500/10 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 items-center">
          {statsData.map((stat, idx) => {
            const Icon = getIcon(stat.id);
            return (
              <motion.div
                key={stat.id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="flex flex-col items-center text-center p-6 bg-white/5 dark:bg-neutral-800/20 backdrop-blur-md rounded-3xl border border-white/10"
              >
                {/* Custom glowing stat badge */}
                <div className="inline-flex p-3 rounded-2xl bg-orange-500/10 text-orange-400 mb-4 border border-orange-500/10">
                  {stat.id === 's4' ? (
                    <span className="text-sm font-black text-orange-400">5★</span>
                  ) : (
                    <Icon className="h-5 w-5" />
                  )}
                </div>

                {/* Big number counter */}
                <h3 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white font-mono leading-none">
                  <span className="bg-gradient-to-r from-orange-400 to-amber-300 bg-clip-text text-transparent">
                    {stat.value}
                  </span>
                  <span className="text-orange-400 font-extrabold">{stat.suffix}</span>
                </h3>

                {/* Stat label */}
                <span className="text-sm font-extrabold mt-3 tracking-wide text-neutral-100">
                  {stat.label}
                </span>

                {/* Mini descriptions */}
                <span className="text-xs text-neutral-400 font-medium mt-1 leading-snug">
                  {stat.description}
                </span>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
