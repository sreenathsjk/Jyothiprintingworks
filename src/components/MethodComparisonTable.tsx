/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  ShieldAlert, 
  ShieldCheck, 
  DollarSign, 
  Clock, 
  ShoppingBag, 
  Layers, 
  HelpCircle, 
  Check, 
  Star, 
  Sparkles,
  Award
} from 'lucide-react';

interface MethodDetail {
  name: string;
  tagline: string;
  durability: {
    level: 'Exceptional' | 'High' | 'Indestructible';
    rating: 5 | 4 | 4.5;
    description: string;
  };
  cost: {
    level: 'Highly Economical (Bulk)' | 'Flat-Rate (Low Vol)' | 'Premium (Per Stitch)';
    rating: 5 | 3.5 | 4; // Rating out of 5 for cost-efficiency
    description: string;
  };
  leadTime: {
    duration: '5 - 7 Days' | '2 - 4 Days' | '4 - 6 Days';
    description: string;
  };
  minQty: string;
  bestFor: string[];
  finish: string;
  iconColor: string;
  bgColor: string;
  borderColor: string;
  pillColor: string;
}

const methods: MethodDetail[] = [
  {
    name: 'Screen Printing',
    tagline: 'The industry standard for high-volume durability & vibrant solids',
    durability: {
      level: 'Exceptional',
      rating: 4.5,
      description: 'Extremely resilient plastisol inks. Built to withstand 100+ heavy industrial washes without cracking or fading.'
    },
    cost: {
      level: 'Highly Economical (Bulk)',
      rating: 5,
      description: 'Upfront stencil/screen set fees apply, but cost-per-unit plummets dramatically for medium and large volume orders.'
    },
    leadTime: {
      duration: '5 - 7 Days',
      description: 'Involves custom screen tensioning, photo-emulsion exposure, and precise alignment calibration.'
    },
    minQty: '20 Pieces',
    bestFor: [
      'High-volume event shirts',
      'School & team uniforms',
      'Bold text & solid logo graphics',
      'Large commercial production'
    ],
    finish: 'Tactile, vibrant, smooth raised rubberized or soft discharge ink layers.',
    iconColor: 'text-orange-500',
    bgColor: 'bg-orange-50/40 dark:bg-orange-950/10',
    borderColor: 'border-orange-200/50 dark:border-orange-900/30',
    pillColor: 'bg-orange-500 text-white'
  },
  {
    name: 'Digital Printing (DTG / Sublimation)',
    tagline: 'Infinite color spectrum & photographic details with zero minimums',
    durability: {
      level: 'High',
      rating: 4,
      description: 'Vibrant direct-to-garment prints or permanent gas-sublimated pigments that meld fully with individual textile yarns.'
    },
    cost: {
      level: 'Flat-Rate (Low Vol)',
      rating: 4,
      description: 'Zero set fees. Perfect and affordable for single custom pieces or extremely small multi-colored orders.'
    },
    leadTime: {
      duration: '2 - 4 Days',
      description: 'Highly streamlined direct-from-computer file processing with minimal physical prep times.'
    },
    minQty: '1 Piece',
    bestFor: [
      'Photographic or highly complex art',
      'Multi-color gradients & detailed prints',
      'Personalized single gifts',
      'Rapid prototype samples'
    ],
    finish: 'Zero-feel fully breathable sublimation or soft-matte direct-to-garment ink.',
    iconColor: 'text-indigo-500',
    bgColor: 'bg-indigo-50/40 dark:bg-indigo-950/10',
    borderColor: 'border-indigo-200/50 dark:border-indigo-900/30',
    pillColor: 'bg-indigo-500 text-white'
  },
  {
    name: 'Premium Embroidery',
    tagline: 'Dimensional corporate branding & luxury custom detailing',
    durability: {
      level: 'Indestructible',
      rating: 5,
      description: 'Heavy-duty polyester stitching. Resists industrial bleaching, rough friction, and outlasts the fabric itself.'
    },
    cost: {
      level: 'Premium (Per Stitch)',
      rating: 3.5,
      description: 'Priced by stitch density. Requires custom digital stitch tape digitization, reflecting luxury branding prestige.'
    },
    leadTime: {
      duration: '4 - 6 Days',
      description: 'Requires expert computer digitization mapping and multi-head tensioned machine embroidery.'
    },
    minQty: '10 Pieces',
    bestFor: [
      'Corporate polo breast crests',
      'High-end hats, caps, and jackets',
      'Exquisite ethnic wear and sarees',
      'Long-lasting professional uniforms'
    ],
    finish: 'Lustrous, dimensional, raised 3D embroidery threads with high sheen satin stitches.',
    iconColor: 'text-amber-500',
    bgColor: 'bg-amber-50/40 dark:bg-amber-950/10',
    borderColor: 'border-amber-200/50 dark:border-amber-900/30',
    pillColor: 'bg-amber-500 text-white'
  }
];

export default function MethodComparisonTable() {
  const [hoveredMethod, setHoveredMethod] = useState<number | null>(null);

  return (
    <div className="mt-24 pt-16 border-t border-neutral-200/60 dark:border-neutral-900" id="comparison-section">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-14">
        <span className="text-xs font-black text-orange-600 dark:text-orange-400 tracking-widest uppercase bg-orange-100/60 dark:bg-orange-950/30 px-3.5 py-1.5 rounded-full border border-orange-200/40 dark:border-orange-900/20">
          Printing Method Guide
        </span>
        <h3 className="text-2xl sm:text-3xl font-black text-neutral-900 dark:text-white mt-4 tracking-tight">
          Which Process Suits Your Project Best?
        </h3>
        <p className="text-sm sm:text-base text-neutral-500 dark:text-neutral-400 mt-3 leading-relaxed font-semibold">
          Understand the structural differences between screen printing, digital printing, and embroidery to select the perfect balance of budget, speed, and longevity.
        </p>
      </div>

      {/* Desktop Layout Table (visible on md screens and larger) */}
      <div className="hidden md:block overflow-hidden rounded-3xl border border-neutral-200/60 dark:border-neutral-900 bg-white dark:bg-neutral-950 shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-neutral-200/60 dark:border-neutral-900 bg-neutral-50/50 dark:bg-neutral-950">
              <th className="p-6 text-xs font-black uppercase tracking-wider text-neutral-400 w-1/4">Printing Methods</th>
              {methods.map((method, idx) => (
                <th 
                  key={idx}
                  className={`p-6 w-1/4 transition-colors duration-300 ${
                    hoveredMethod === idx ? 'bg-neutral-50/50 dark:bg-neutral-900/20' : ''
                  }`}
                  onMouseEnter={() => setHoveredMethod(idx)}
                  onMouseLeave={() => setHoveredMethod(null)}
                >
                  <div className="flex items-center gap-1.5">
                    <span className="text-lg font-black text-neutral-900 dark:text-white tracking-tight">{method.name}</span>
                    <Star className="h-4 w-4 text-orange-500 fill-orange-500 animate-pulse shrink-0" />
                  </div>
                  <p className="text-[11px] font-medium text-neutral-400 mt-1">{method.tagline}</p>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {/* Durability Row */}
            <tr className="border-b border-neutral-100 dark:border-neutral-900/60">
              <td className="p-6 font-semibold text-sm text-neutral-900 dark:text-neutral-300">
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 rounded-lg bg-orange-50 dark:bg-orange-950/20 text-orange-600 dark:text-orange-400">
                    <ShieldCheck className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="block font-black text-xs uppercase tracking-wider text-neutral-400">Longevity</span>
                    <span>Fabric Durability</span>
                  </div>
                </div>
              </td>
              {methods.map((method, idx) => (
                <td 
                  key={idx}
                  className={`p-6 text-sm transition-colors duration-300 ${
                    hoveredMethod === idx ? 'bg-neutral-50/30 dark:bg-neutral-900/10' : ''
                  }`}
                  onMouseEnter={() => setHoveredMethod(idx)}
                  onMouseLeave={() => setHoveredMethod(null)}
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="font-extrabold text-neutral-900 dark:text-neutral-100 bg-neutral-100 dark:bg-neutral-900 px-2.5 py-0.5 rounded-md text-xs">
                      {method.durability.level}
                    </span>
                    <div className="flex">
                      {[...Array(5)].map((_, starIdx) => (
                        <span 
                          key={starIdx} 
                          className={`text-xs ${
                            starIdx < Math.floor(method.durability.rating) 
                              ? 'text-yellow-500' 
                              : starIdx < method.durability.rating 
                                ? 'text-yellow-500/50' 
                                : 'text-neutral-300 dark:text-neutral-800'
                          }`}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed font-semibold">
                    {method.durability.description}
                  </p>
                </td>
              ))}
            </tr>

            {/* Cost Rating Row */}
            <tr className="border-b border-neutral-100 dark:border-neutral-900/60">
              <td className="p-6 font-semibold text-sm text-neutral-900 dark:text-neutral-300">
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400">
                    <DollarSign className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="block font-black text-xs uppercase tracking-wider text-neutral-400">Pricing</span>
                    <span>Cost Dynamics</span>
                  </div>
                </div>
              </td>
              {methods.map((method, idx) => (
                <td 
                  key={idx}
                  className={`p-6 text-sm transition-colors duration-300 ${
                    hoveredMethod === idx ? 'bg-neutral-50/30 dark:bg-neutral-900/10' : ''
                  }`}
                  onMouseEnter={() => setHoveredMethod(idx)}
                  onMouseLeave={() => setHoveredMethod(null)}
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="font-extrabold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/20 px-2.5 py-0.5 rounded-md text-xs">
                      {method.cost.level}
                    </span>
                  </div>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed font-semibold">
                    {method.cost.description}
                  </p>
                </td>
              ))}
            </tr>

            {/* Lead Time Row */}
            <tr className="border-b border-neutral-100 dark:border-neutral-900/60">
              <td className="p-6 font-semibold text-sm text-neutral-900 dark:text-neutral-300">
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/20 text-indigo-600 dark:text-indigo-400">
                    <Clock className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="block font-black text-xs uppercase tracking-wider text-neutral-400">Turnaround</span>
                    <span>Delivery Lead Time</span>
                  </div>
                </div>
              </td>
              {methods.map((method, idx) => (
                <td 
                  key={idx}
                  className={`p-6 text-sm transition-colors duration-300 ${
                    hoveredMethod === idx ? 'bg-neutral-50/30 dark:bg-neutral-900/10' : ''
                  }`}
                  onMouseEnter={() => setHoveredMethod(idx)}
                  onMouseLeave={() => setHoveredMethod(null)}
                >
                  <span className="block font-black text-neutral-900 dark:text-white text-sm mb-1">
                    {method.leadTime.duration}
                  </span>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed font-semibold">
                    {method.leadTime.description}
                  </p>
                </td>
              ))}
            </tr>

            {/* Min Qty Row */}
            <tr className="border-b border-neutral-100 dark:border-neutral-900/60">
              <td className="p-6 font-semibold text-sm text-neutral-900 dark:text-neutral-300">
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400">
                    <ShoppingBag className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="block font-black text-xs uppercase tracking-wider text-neutral-400">Quantity</span>
                    <span>Minimum Order Limit</span>
                  </div>
                </div>
              </td>
              {methods.map((method, idx) => (
                <td 
                  key={idx}
                  className={`p-6 text-sm font-black text-neutral-900 dark:text-white transition-colors duration-300 ${
                    hoveredMethod === idx ? 'bg-neutral-50/30 dark:bg-neutral-900/10' : ''
                  }`}
                  onMouseEnter={() => setHoveredMethod(idx)}
                  onMouseLeave={() => setHoveredMethod(null)}
                >
                  <span className="px-3 py-1 bg-neutral-100 dark:bg-neutral-900 rounded-lg text-xs font-black tracking-wide">
                    {method.minQty}
                  </span>
                </td>
              ))}
            </tr>

            {/* Feel / Finish Row */}
            <tr className="border-b border-neutral-100 dark:border-neutral-900/60">
              <td className="p-6 font-semibold text-sm text-neutral-900 dark:text-neutral-300">
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 rounded-lg bg-purple-50 dark:bg-purple-950/20 text-purple-600 dark:text-purple-400">
                    <Layers className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="block font-black text-xs uppercase tracking-wider text-neutral-400">Texture</span>
                    <span>Handfeel & Texture</span>
                  </div>
                </div>
              </td>
              {methods.map((method, idx) => (
                <td 
                  key={idx}
                  className={`p-6 text-xs font-semibold text-neutral-600 dark:text-neutral-400 leading-relaxed transition-colors duration-300 ${
                    hoveredMethod === idx ? 'bg-neutral-50/30 dark:bg-neutral-900/10' : ''
                  }`}
                  onMouseEnter={() => setHoveredMethod(idx)}
                  onMouseLeave={() => setHoveredMethod(null)}
                >
                  {method.finish}
                </td>
              ))}
            </tr>

            {/* Best For Row */}
            <tr>
              <td className="p-6 font-semibold text-sm text-neutral-900 dark:text-neutral-300">
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 rounded-lg bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400">
                    <Award className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="block font-black text-xs uppercase tracking-wider text-neutral-400">Suitability</span>
                    <span>Best Recommended For</span>
                  </div>
                </div>
              </td>
              {methods.map((method, idx) => (
                <td 
                  key={idx}
                  className={`p-6 text-sm transition-colors duration-300 ${
                    hoveredMethod === idx ? 'bg-neutral-50/30 dark:bg-neutral-900/10' : ''
                  }`}
                  onMouseEnter={() => setHoveredMethod(idx)}
                  onMouseLeave={() => setHoveredMethod(null)}
                >
                  <ul className="space-y-1.5">
                    {method.bestFor.map((item, key) => (
                      <li key={key} className="flex items-center gap-1.5 text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                        <Check className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      {/* Mobile Accordion Layout (visible on small screens) */}
      <div className="block md:hidden space-y-6">
        {methods.map((method, idx) => (
          <div 
            key={idx} 
            className={`rounded-3xl border ${method.borderColor} ${method.bgColor} p-6 space-y-5`}
          >
            <div className="flex items-start justify-between">
              <div>
                <h4 className="text-xl font-black text-neutral-900 dark:text-white tracking-tight flex items-center gap-1.5">
                  <span>{method.name}</span>
                </h4>
                <p className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 mt-1 leading-normal">
                  {method.tagline}
                </p>
              </div>
              <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${method.pillColor}`}>
                {method.minQty} Min
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-3.5 border-t border-neutral-200/50 dark:border-neutral-800/40">
              <div>
                <span className="block text-[10px] font-black uppercase tracking-wider text-neutral-400">Longevity</span>
                <span className="font-extrabold text-xs text-neutral-900 dark:text-neutral-100">
                  {method.durability.level}
                </span>
                <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-1 leading-normal font-medium">
                  {method.durability.description}
                </p>
              </div>

              <div>
                <span className="block text-[10px] font-black uppercase tracking-wider text-neutral-400">Pricing dynamics</span>
                <span className="font-extrabold text-xs text-neutral-900 dark:text-neutral-100">
                  {method.cost.level}
                </span>
                <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-1 leading-normal font-medium">
                  {method.cost.description}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-neutral-200/50 dark:border-neutral-800/40">
              <div>
                <span className="block text-[10px] font-black uppercase tracking-wider text-neutral-400">Lead Time</span>
                <span className="font-black text-xs text-neutral-900 dark:text-white">
                  {method.leadTime.duration}
                </span>
                <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-1 leading-normal font-medium">
                  {method.leadTime.description}
                </p>
              </div>

              <div>
                <span className="block text-[10px] font-black uppercase tracking-wider text-neutral-400">Texture & Finish</span>
                <p className="text-[11px] text-neutral-600 dark:text-neutral-400 mt-1 leading-normal font-semibold">
                  {method.finish}
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-neutral-200/50 dark:border-neutral-800/40">
              <span className="block text-[10px] font-black uppercase tracking-wider text-neutral-400 mb-2">Best Recommended For</span>
              <div className="flex flex-wrap gap-1.5">
                {method.bestFor.map((item, key) => (
                  <span 
                    key={key} 
                    className="px-2.5 py-1 rounded-lg bg-neutral-900/5 dark:bg-neutral-900/50 text-[11px] font-bold text-neutral-700 dark:text-neutral-300 flex items-center gap-1 border border-neutral-200/50 dark:border-neutral-800"
                  >
                    <Check className="h-3 w-3 text-emerald-500" />
                    <span>{item}</span>
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
