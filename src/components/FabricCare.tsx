/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Droplets, 
  Flame, 
  Wind, 
  Shirt, 
  Info, 
  ShieldAlert, 
  CheckCircle2, 
  XCircle, 
  Sparkles,
  Scissors,
  RotateCcw
} from 'lucide-react';

interface CareInstructions {
  id: string;
  materialType: string;
  description: string;
  icon: React.ComponentType<any>;
  dos: string[];
  donts: string[];
  wash: {
    title: string;
    instructions: string;
  };
  dry: {
    title: string;
    instructions: string;
  };
  iron: {
    title: string;
    instructions: string;
  };
  bannerColor: string;
  textColor: string;
  borderColor: string;
  bgColor: string;
}

const careGuides: CareInstructions[] = [
  {
    id: 'care-screen',
    materialType: 'Screen Printed Apparel',
    description: 'Covers traditional plastisol, high-density, puff, and water-based ink prints on cotton.',
    icon: Shirt,
    dos: [
      'Turn the garment fully inside-out before loading into the wash.',
      'Use a gentle, low-RPM wash cycle with cold water (below 30°C).',
      'Wash with similar colors and fabrics to reduce friction.'
    ],
    donts: [
      'Never wash printed garments in boiling or highly hot water.',
      'Do not use liquid fabric softeners or chlorine bleaches.',
      'Never dry-clean screen printed cotton garments.'
    ],
    wash: {
      title: 'Wash Cycle',
      instructions: 'Cold wash, gentle cycle with mild detergent. Turning the print inside-out protects the outer ink layers from surface abrasion.'
    },
    dry: {
      title: 'Drying Instructions',
      instructions: 'Line dry in shade to prevent UV light color bleaching. If using a tumble dryer, select the lowest heat or air-fluff setting.'
    },
    iron: {
      title: 'Ironing Protection',
      instructions: 'Never run a hot iron directly over plastisol or puff ink. Iron only on the reverse side (inside-out) or use a clean cotton barrier cloth.'
    },
    bannerColor: 'bg-orange-500 text-white',
    textColor: 'text-orange-600 dark:text-orange-400',
    borderColor: 'border-orange-200/60 dark:border-orange-900/30',
    bgColor: 'bg-orange-50/40 dark:bg-orange-950/10'
  },
  {
    id: 'care-foil',
    materialType: 'Gold Foil & Ethnic Silk',
    description: 'Covers delicate designer blouses, saree borders, metallic gold prints, and raw mulberries.',
    icon: Sparkles,
    dos: [
      'Dry clean is highly recommended for silk and custom boutique blouse finishes.',
      'If handwashing, use a dilute neutral organic liquid shampoo.',
      'Squeeze the excess water out gently without squeezing or twisting.'
    ],
    donts: [
      'Never scrub the gold-leaf or traditional peacock motifs directly.',
      'Do not put delicate silk blouse fabrics inside a spinning washing machine.',
      'Never use powerful synthetic powder detergents containing oxygen bleaches.'
    ],
    wash: {
      title: 'Wash Cycle',
      instructions: 'Dry clean or gentle 5-minute cold hand wash. Do not soak silk and metallic prints for extended periods.'
    },
    dry: {
      title: 'Drying Instructions',
      instructions: 'Lay the garment perfectly flat on a clean dry towel in the shade. Never hang heavy wet silk as it stretches the weave.'
    },
    iron: {
      title: 'Ironing Protection',
      instructions: 'Iron on the reverse side at the absolute lowest "Silk" heat setting. Absolutely no direct steam should contact the gold foil overlays.'
    },
    bannerColor: 'bg-amber-500 text-white',
    textColor: 'text-amber-600 dark:text-amber-400',
    borderColor: 'border-amber-200/60 dark:border-amber-900/30',
    bgColor: 'bg-amber-50/40 dark:bg-amber-950/10'
  },
  {
    id: 'care-sublimation',
    materialType: 'Sports & Active Sublimation',
    description: 'Covers full-sublimated soccer kits, college team uniforms, and dry-fit polyester jerseys.',
    icon: Wind,
    dos: [
      'Machine wash with normal cycles. Sublimation pigments are chemical-fused and highly resilient.',
      'Ensure all velcro straps or zipper items are closed in the same load.'
    ],
    donts: [
      'Do not use laundry bleaches—this weakens the polyester knit fibers over time.',
      'Avoid high hot dryer temperatures which can shrink synthetic performance yarns.'
    ],
    wash: {
      title: 'Wash Cycle',
      instructions: 'Cold or warm machine wash. Simple sports-wash detergents work best to wick away body sweat without leaving residue.'
    },
    dry: {
      title: 'Drying Instructions',
      instructions: 'Hanger dry or flat dry. Sublimated polyester fabrics dry exceptionally fast on their own (under 30 minutes).'
    },
    iron: {
      title: 'Ironing Protection',
      instructions: 'Rarely needs ironing as performance polyester is inherently wrinkle-resistant. If necessary, use low dry iron settings only.'
    },
    bannerColor: 'bg-indigo-500 text-white',
    textColor: 'text-indigo-600 dark:text-indigo-400',
    borderColor: 'border-indigo-200/60 dark:border-indigo-900/30',
    bgColor: 'bg-indigo-50/40 dark:bg-indigo-950/10'
  },
  {
    id: 'care-embroidery',
    materialType: 'Embroidered Uniforms & Polos',
    description: 'Covers high-density multi-color polyester thread embroidery on corporate and school wear.',
    icon: Scissors,
    dos: [
      'Wash the embroidered polos inside out to protect thread stitching from other items.',
      'If thread loops snag or pull out slightly, snip cleanly with sharp scissors. Never pull!'
    ],
    donts: [
      'Do not wash embroidered uniforms alongside rough metal zippers, buckles, or Velcro.',
      'Do not leave wet embroidered garments folded together in a heap.'
    ],
    wash: {
      title: 'Wash Cycle',
      instructions: 'Machine wash cold on gentle settings. Neutral detergents keep embroidery thread sheen gleaming for years.'
    },
    dry: {
      title: 'Drying Instructions',
      instructions: 'Tumble dry low or line dry. Laying flat is preferred to avoid any thread contraction differences with the primary fabric.'
    },
    iron: {
      title: 'Ironing Protection',
      instructions: 'Always iron embroidered badges from the reverse side. If ironing the front, place a soft terry-cloth towel under and a press-cloth on top.'
    },
    bannerColor: 'bg-rose-500 text-white',
    textColor: 'text-rose-600 dark:text-rose-400',
    borderColor: 'border-rose-200/60 dark:border-rose-900/30',
    bgColor: 'bg-rose-50/40 dark:bg-rose-950/10'
  }
];

export default function FabricCareGuide() {
  const [selectedGuideId, setSelectedGuideId] = useState<string>('care-screen');
  const activeGuide = careGuides.find(g => g.id === selectedGuideId) || careGuides[0];

  return (
    <div className="space-y-8" id="fabric-care-container">
      {/* Header Info */}
      <div className="flex items-start gap-4 p-5 rounded-3xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200/50 dark:border-neutral-900">
        <div className="p-3.5 rounded-2xl bg-orange-500 text-white shrink-0 shadow-md">
          <Info className="h-5 w-5" />
        </div>
        <div>
          <h4 className="text-sm font-black uppercase tracking-widest text-neutral-900 dark:text-white">
            Maintain Your Prints Like a Professional
          </h4>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1 font-medium leading-relaxed">
            The longevity of your customized apparel depends directly on your daily maintenance routine. Proper care ensures ink elasticity, vibrant fabric dye saturation, and keeps embroidery threads perfectly locked in place without snagging.
          </p>
        </div>
      </div>

      {/* Horizontal Category Switcher */}
      <div className="flex flex-wrap gap-2 pb-2">
        {careGuides.map((guide) => {
          const IconComp = guide.icon;
          const isSelected = selectedGuideId === guide.id;
          return (
            <button
              key={guide.id}
              onClick={() => setSelectedGuideId(guide.id)}
              className={`px-4.5 py-3.5 rounded-2xl text-xs font-black uppercase tracking-wider flex items-center gap-2.5 transition-all duration-300 cursor-pointer shadow-sm ${
                isSelected
                  ? `${guide.bannerColor} shadow-md`
                  : 'bg-white dark:bg-neutral-950 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white border border-neutral-150/80 dark:border-neutral-900'
              }`}
            >
              <IconComp className="h-4.5 w-4.5" />
              <span>{guide.materialType}</span>
            </button>
          );
        })}
      </div>

      {/* Interactive Detail Box */}
      <div className={`rounded-3xl border ${activeGuide.borderColor} ${activeGuide.bgColor} p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 transition-all duration-500`}>
        
        {/* LEFT COLUMN: CORE PHASES (Wash, Dry, Iron) */}
        <div className="lg:col-span-6 space-y-6">
          <div className="flex items-center gap-2 mb-2">
            <RotateCcw className={`h-5 w-5 ${activeGuide.textColor} animate-spin`} style={{ animationDuration: '8s' }} />
            <h3 className="text-lg sm:text-xl font-black text-neutral-900 dark:text-white tracking-tight">
              {activeGuide.materialType} Care Core
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed font-semibold">
            {activeGuide.description}
          </p>

          <div className="space-y-4 pt-2">
            {/* WASH */}
            <div className="flex gap-4 p-4 rounded-2xl bg-white/70 dark:bg-neutral-900/60 border border-neutral-200/30 dark:border-neutral-800/40 shadow-sm">
              <div className={`p-2.5 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 shrink-0 h-10 w-10 flex items-center justify-center`}>
                <Droplets className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-xs font-black uppercase tracking-wider text-neutral-900 dark:text-neutral-200">
                  {activeGuide.wash.title}
                </h4>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 leading-normal font-medium">
                  {activeGuide.wash.instructions}
                </p>
              </div>
            </div>

            {/* DRY */}
            <div className="flex gap-4 p-4 rounded-2xl bg-white/70 dark:bg-neutral-900/60 border border-neutral-200/30 dark:border-neutral-800/40 shadow-sm">
              <div className={`p-2.5 rounded-xl bg-orange-500/10 text-orange-600 dark:text-orange-400 shrink-0 h-10 w-10 flex items-center justify-center`}>
                <Wind className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-xs font-black uppercase tracking-wider text-neutral-900 dark:text-neutral-200">
                  {activeGuide.dry.title}
                </h4>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 leading-normal font-medium">
                  {activeGuide.dry.instructions}
                </p>
              </div>
            </div>

            {/* IRON */}
            <div className="flex gap-4 p-4 rounded-2xl bg-white/70 dark:bg-neutral-900/60 border border-neutral-200/30 dark:border-neutral-800/40 shadow-sm">
              <div className={`p-2.5 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 shrink-0 h-10 w-10 flex items-center justify-center`}>
                <Flame className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-xs font-black uppercase tracking-wider text-neutral-900 dark:text-neutral-200">
                  {activeGuide.iron.title}
                </h4>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 leading-normal font-medium">
                  {activeGuide.iron.instructions}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: DO'S AND DONT'S */}
        <div className="lg:col-span-6 space-y-6">
          {/* DOS LIST */}
          <div className="p-5.5 rounded-2xl bg-emerald-500/5 dark:bg-emerald-500/10 border border-emerald-500/20 dark:border-emerald-500/10 space-y-3 shadow-sm">
            <h4 className="text-xs font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
              <CheckCircle2 className="h-4.5 w-4.5 shrink-0" />
              <span>Recommended Do&apos;s</span>
            </h4>
            <ul className="space-y-2">
              {activeGuide.dos.map((doItem, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-xs text-neutral-700 dark:text-neutral-300 font-medium leading-relaxed">
                  <span className="text-emerald-500 mt-0.5 font-bold">•</span>
                  <span>{doItem}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* DONT'S LIST */}
          <div className="p-5.5 rounded-2xl bg-rose-500/5 dark:bg-rose-500/10 border border-rose-500/20 dark:border-rose-500/10 space-y-3 shadow-sm">
            <h4 className="text-xs font-black uppercase tracking-widest text-rose-600 dark:text-rose-400 flex items-center gap-2">
              <XCircle className="h-4.5 w-4.5 shrink-0" />
              <span>Critical Dont&apos;s</span>
            </h4>
            <ul className="space-y-2">
              {activeGuide.donts.map((dontItem, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-xs text-neutral-700 dark:text-neutral-300 font-medium leading-relaxed">
                  <span className="text-rose-500 mt-0.5 font-bold">•</span>
                  <span>{dontItem}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Fabric Durability warning */}
          <div className="p-4 rounded-2xl bg-neutral-900 text-white flex items-center gap-3.5 border border-neutral-800 shadow-lg">
            <ShieldAlert className="h-5 w-5 text-amber-500 shrink-0 animate-bounce" />
            <p className="text-[11px] font-bold tracking-wide leading-normal text-neutral-300">
              WARNING: High washing friction and machine drying temperatures degrade ink stretch compounds. Wash inside-out at all times!
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
