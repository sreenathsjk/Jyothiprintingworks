/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { faqsData } from '../data';
import { ChevronDown, Plus, Minus, MessageSquare, HelpCircle, Sparkles } from 'lucide-react';
import FabricCareGuide from './FabricCare';

export default function FAQs() {
  const [openId, setOpenId] = useState<string | null>('faq1');
  const [activeTab, setActiveTab] = useState<'faqs' | 'care'>('faqs');

  const handleToggle = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section id="faqs-section" className="py-20 bg-white dark:bg-neutral-900 relative overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <span className="text-sm font-extrabold text-orange-500 tracking-wider uppercase bg-orange-50 dark:bg-orange-950/40 px-4 py-1.5 rounded-full border border-orange-200/50 dark:border-orange-800/30">
            Resource Center
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-neutral-900 dark:text-white mt-4 tracking-tight">
            FAQs & Apparel Care Guide
          </h2>
          <p className="text-base text-neutral-500 dark:text-neutral-400 mt-4 leading-relaxed font-medium">
            Everything you need to know about placing bulk orders, design setup, and maintaining your prints for maximum longevity.
          </p>
        </div>

        {/* Dynamic Navigation Tabs */}
        <div className="flex justify-center mb-12">
          <div className="flex p-1 bg-neutral-100 dark:bg-neutral-950 rounded-full border border-neutral-200/60 dark:border-neutral-900 shadow-sm">
            <button
              onClick={() => setActiveTab('faqs')}
              className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-black uppercase tracking-wider transition-all duration-350 flex items-center gap-2 cursor-pointer ${
                activeTab === 'faqs'
                  ? 'bg-orange-500 text-white shadow-md'
                  : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-white'
              }`}
            >
              <HelpCircle className="h-4 w-4" />
              <span>General FAQs</span>
            </button>
            <button
              onClick={() => setActiveTab('care')}
              className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-black uppercase tracking-wider transition-all duration-350 flex items-center gap-2 cursor-pointer ${
                activeTab === 'care'
                  ? 'bg-orange-500 text-white shadow-md'
                  : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-white'
              }`}
            >
              <Sparkles className="h-4 w-4 animate-pulse" />
              <span>Fabric Care & Washing Guide</span>
            </button>
          </div>
        </div>

        {/* Tab Content Display */}
        <AnimatePresence mode="wait">
          {activeTab === 'faqs' ? (
            <motion.div
              key="faqs-tab"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              {faqsData.map((faq, idx) => {
                const isOpen = openId === faq.id;
                return (
                  <div
                    key={faq.id}
                    className={`rounded-3xl border transition-all duration-300 overflow-hidden ${
                      isOpen
                        ? 'bg-neutral-50 dark:bg-neutral-800/40 border-orange-500/30 shadow-sm'
                        : 'bg-white dark:bg-neutral-900 border-neutral-150/80 dark:border-neutral-800 hover:border-neutral-250 dark:hover:border-neutral-700'
                    }`}
                  >
                    {/* Accordion Title Trigger */}
                    <button
                      onClick={() => handleToggle(faq.id)}
                      id={`faq-trigger-${faq.id}`}
                      className="w-full px-6 py-5.5 flex items-center justify-between text-left cursor-pointer"
                      aria-expanded={isOpen}
                    >
                      <span className="font-bold text-base sm:text-lg text-neutral-900 dark:text-white pr-4">
                        {faq.question}
                      </span>
                      
                      {/* Plus/Minus Indicator */}
                      <span className={`p-1.5 rounded-full transition-transform duration-200 ${
                        isOpen ? 'bg-orange-500 text-white rotate-180' : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-500'
                      }`}>
                        {isOpen ? <Minus className="h-4.5 w-4.5" /> : <Plus className="h-4.5 w-4.5" />}
                      </span>
                    </button>

                    {/* Smooth Expandable Body */}
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25, ease: 'easeInOut' }}
                        >
                          <div className="px-6 pb-6 pt-1 border-t border-neutral-100 dark:border-neutral-800/60 text-sm sm:text-base text-neutral-500 dark:text-neutral-400 font-medium leading-relaxed">
                            {faq.answer}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </motion.div>
          ) : (
            <motion.div
              key="care-tab"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
            >
              <FabricCareGuide />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Direct WhatsApp Prompt Footer */}
        <div className="mt-12 p-6.5 rounded-3xl bg-orange-500/10 border border-orange-500/20 dark:border-orange-500/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-orange-500 text-white rounded-2xl hidden sm:block">
              <MessageSquare className="h-5 w-5" />
            </div>
            <div>
              <h4 className="font-bold text-sm sm:text-base text-neutral-900 dark:text-white leading-tight">
                Have a unique fabric or print inquiry?
              </h4>
              <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-1 font-semibold">
                Speak directly with an expert printer to design custom specifications.
              </p>
            </div>
          </div>

          <a
            href="https://wa.me/919182703766?text=Hello%20Jyothi%20Printing%20Works!%20I%20have%20a%20custom%20fabric%20printing%20requirement."
            target="_blank"
            rel="noreferrer"
            className="px-5 py-3 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white font-extrabold text-xs sm:text-sm tracking-wide shadow-md transition-all shrink-0 cursor-pointer text-center"
          >
            Chat with Printing Specialist
          </a>
        </div>

      </div>
    </section>
  );
}
