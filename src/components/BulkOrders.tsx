/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Calculator, Send, Sparkles, AlertCircle, HelpCircle } from 'lucide-react';

export default function BulkOrders() {
  // Calculator variables
  const [fabricType, setFabricType] = useState('tshirt');
  const [printTech, setPrintTech] = useState('screen');
  const [locations, setLocations] = useState({
    front: true,
    back: false,
    sleeve: false,
    tag: false,
  });
  const [quantity, setQuantity] = useState(150);
  
  // Computed values
  const [baseUnitPrice, setBaseUnitPrice] = useState(250);
  const [unitCost, setUnitCost] = useState(0);
  const [totalCost, setTotalCost] = useState(0);
  const [discountPercent, setDiscountPercent] = useState(0);
  const [setupFee, setSetupFee] = useState(500);

  // Re-calculate pricing whenever inputs change
  useEffect(() => {
    // 1. Establish base fabric costs (in INR approx)
    let fabricCost = 150; // default t-shirt
    if (fabricType === 'blouse') fabricCost = 350; // luxury silk
    if (fabricType === 'sports') fabricCost = 180; // dry-fit mesh
    if (fabricType === 'polo') fabricCost = 220; // pique polo
    if (fabricType === 'school') fabricCost = 160; // anti-pilling cotton-blend

    // 2. Print method base setups & location costs
    let setup = 400;
    let basePrintCost = 30; // screen print
    
    if (printTech === 'embroidery') {
      setup = 600;
      basePrintCost = 50;
    } else if (printTech === 'sublimation') {
      setup = 800;
      basePrintCost = 80;
    } else if (printTech === 'vinyl') {
      setup = 200;
      basePrintCost = 45;
    } else if (printTech === 'dtg') {
      setup = 0; // direct to garment, no setup frames
      basePrintCost = 120;
    }

    setSetupFee(setup);

    // Calculate location multipliers
    let locationCount = 0;
    if (locations.front) locationCount += 1;
    if (locations.back) locationCount += 1.2;
    if (locations.sleeve) locationCount += 0.8;
    if (locations.tag) locationCount += 0.5;

    // Print cost scaled by location count
    const totalPrintCost = basePrintCost * Math.max(0.5, locationCount);

    // Raw unit cost before discount
    const rawUnit = fabricCost + totalPrintCost + (setup / quantity);

    // 3. Apply volume discount tiers
    let discount = 0;
    if (quantity >= 25 && quantity < 50) discount = 5;
    else if (quantity >= 50 && quantity < 100) discount = 12;
    else if (quantity >= 100 && quantity < 250) discount = 22;
    else if (quantity >= 250 && quantity < 500) discount = 32;
    else if (quantity >= 500) discount = 40;

    setDiscountPercent(discount);

    // final calculations
    const finalUnit = Math.round(rawUnit * (1 - discount / 100));
    setUnitCost(finalUnit);
    setTotalCost(finalUnit * quantity);

  }, [fabricType, printTech, locations, quantity]);

  const handleLocationToggle = (key: 'front' | 'back' | 'sleeve' | 'tag') => {
    setLocations(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const getFabricLabel = () => {
    if (fabricType === 'tshirt') return 'Premium Cotton T-Shirts';
    if (fabricType === 'blouse') return 'Designer Silk Blouse fabrics';
    if (fabricType === 'sports') return 'Sublimation Team Jerseys';
    if (fabricType === 'polo') return 'Corporate Polo shirts';
    return 'School Uniform sets';
  };

  const getPrintLabel = () => {
    if (printTech === 'screen') return 'Multi-Color Screen Printing';
    if (printTech === 'embroidery') return 'Precision Computerized Embroidery';
    if (printTech === 'sublimation') return 'All-over Sublimation';
    if (printTech === 'vinyl') return 'Heat vinyl transfers';
    return 'Digital DTG Print';
  };

  const handleWhatsAppQuote = () => {
    // Construct pre-formatted message based on computed quote variables
    const activeLocs = [];
    if (locations.front) activeLocs.push('Front Chest');
    if (locations.back) activeLocs.push('Full Back');
    if (locations.sleeve) activeLocs.push('Sleeves');
    if (locations.tag) activeLocs.push('Inside Neck Tag');

    const message = `Hello Jyothi Printing Works! I configured a custom bulk order estimate:
- **Quantity**: ${quantity} pieces
- **Product**: ${getFabricLabel()}
- **Printing Technology**: ${getPrintLabel()}
- **Print Locations**: ${activeLocs.join(', ')}
- **Est. Unit Price**: ₹${unitCost}
- **Est. Total Price**: ₹${totalCost.toLocaleString('en-IN')}

Please review these specifications and send an official digital invoice or fabric mockups.`;

    const url = `https://wa.me/919491218950?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  return (
    <section id="bulk-orders-section" className="py-20 bg-neutral-50 dark:bg-neutral-950 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-sm font-extrabold text-orange-500 tracking-wider uppercase bg-orange-50 dark:bg-orange-950/40 px-4 py-1.5 rounded-full border border-orange-200/50 dark:border-orange-800/30">
            Bulk Specialist
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-neutral-900 dark:text-white mt-4 tracking-tight">
            Interactive Bulk Apparel Pricing Estimator
          </h2>
          <p className="text-base text-neutral-500 dark:text-neutral-400 mt-4 leading-relaxed font-medium">
            Configure fabric blends, print placements, and quantities to visualize estimated rates instantly. The larger your batch, the more steep our manufacturing discount tiers.
          </p>
        </div>

        {/* Split layout: Selector controls vs Live Quote results card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column (8 cols): Input parameters */}
          <div className="lg:col-span-7 bg-white dark:bg-neutral-900 p-6 sm:p-8 rounded-3xl border border-neutral-150/60 dark:border-neutral-800 space-y-6 text-left shadow-sm">
            
            {/* Fabric Selector */}
            <div>
              <label className="block text-sm font-black text-neutral-800 dark:text-neutral-200 uppercase tracking-widest mb-3.5">
                1. Select Fabric Base Product
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {[
                  { id: 'tshirt', label: 'Cotton T-Shirt' },
                  { id: 'blouse', label: 'Silk Blouse' },
                  { id: 'sports', label: 'Sports Mesh' },
                  { id: 'polo', label: 'Corporate Polo' },
                  { id: 'school', label: 'School Uniform' }
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setFabricType(item.id)}
                    className={`p-3.5 rounded-2xl text-xs font-bold text-center border cursor-pointer transition-all ${
                      fabricType === item.id
                        ? 'bg-orange-500 border-orange-500 text-white shadow-md shadow-orange-500/10'
                        : 'bg-neutral-50 dark:bg-neutral-950 border-neutral-200/60 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 hover:border-orange-500/30'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Print Technology Selector */}
            <div>
              <label className="block text-sm font-black text-neutral-800 dark:text-neutral-200 uppercase tracking-widest mb-3.5">
                2. Select Printing Tech
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {[
                  { id: 'screen', label: 'Screen Print' },
                  { id: 'embroidery', label: 'Embroidery' },
                  { id: 'sublimation', label: 'Sublimation' },
                  { id: 'vinyl', label: 'Heat Vinyl' },
                  { id: 'dtg', label: 'DTG Digital' }
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setPrintTech(item.id)}
                    className={`p-3.5 rounded-2xl text-xs font-bold text-center border cursor-pointer transition-all ${
                      printTech === item.id
                        ? 'bg-orange-500 border-orange-500 text-white shadow-md'
                        : 'bg-neutral-50 dark:bg-neutral-950 border-neutral-200/60 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 hover:border-orange-500/30'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Placement Locations */}
            <div>
              <label className="block text-sm font-black text-neutral-800 dark:text-neutral-200 uppercase tracking-widest mb-3.5">
                3. Print Placements (Select multiple)
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { id: 'front', label: 'Front Chest' },
                  { id: 'back', label: 'Full Back' },
                  { id: 'sleeve', label: 'Sleeve print' },
                  { id: 'tag', label: 'Collar Tag' }
                ].map((item) => {
                  const isChecked = locations[item.id as keyof typeof locations];
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleLocationToggle(item.id as 'front' | 'back' | 'sleeve' | 'tag')}
                      className={`p-3 rounded-xl text-xs font-semibold border cursor-pointer transition-all ${
                        isChecked
                          ? 'bg-orange-500/10 dark:bg-orange-500/20 border-orange-500 text-orange-600 dark:text-orange-400 font-extrabold shadow-sm'
                          : 'bg-neutral-50 dark:bg-neutral-950 border-neutral-200/60 dark:border-neutral-800 text-neutral-550 dark:text-neutral-400'
                      }`}
                    >
                      {item.label} {isChecked ? '✓' : ''}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Interactive Quantity Slider */}
            <div className="pt-3">
              <div className="flex justify-between items-center mb-3">
                <label className="text-sm font-black text-neutral-800 dark:text-neutral-200 uppercase tracking-widest">
                  4. Set Quantity
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(10, Math.min(10000, Number(e.target.value))))}
                    className="w-20 px-3 py-1 text-sm font-extrabold text-center rounded-lg bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-white font-mono"
                  />
                  <span className="text-xs font-bold text-neutral-500 uppercase">Pcs</span>
                </div>
              </div>

              {/* Slider track */}
              <input
                type="range"
                min="10"
                max="1000"
                step="10"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="w-full h-2 rounded-lg bg-neutral-200 dark:bg-neutral-800 appearance-none cursor-pointer accent-orange-500"
              />
              
              {/* Discount Indicator Tiers info */}
              <div className="flex justify-between text-[10px] text-neutral-400 uppercase tracking-wider font-extrabold mt-3.5">
                <span>MOQ: 10 pcs</span>
                <span className={quantity >= 50 ? 'text-orange-500 font-black' : ''}>50 pcs: 12% Off</span>
                <span className={quantity >= 100 ? 'text-orange-500 font-black' : ''}>100 pcs: 22% Off</span>
                <span className={quantity >= 250 ? 'text-orange-500 font-black' : ''}>250 pcs: 32% Off</span>
                <span className={quantity >= 500 ? 'text-orange-500 font-black' : ''}>500+ pcs: 40% Off</span>
              </div>
            </div>

          </div>

          {/* Right Column (5 cols): Quotation calculations readout */}
          <div className="lg:col-span-5 bg-neutral-900 text-white p-6.5 sm:p-8 rounded-3xl border border-neutral-850 shadow-lg text-left flex flex-col justify-between self-stretch relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-full blur-2xl" />

            <div className="space-y-6">
              <div className="flex items-center gap-2 text-xs text-orange-400 font-black uppercase tracking-wider">
                <Calculator className="h-4.5 w-4.5 text-orange-400 animate-pulse" />
                <span>Computed Quote Readout</span>
              </div>

              {/* Selected parameters list summarized */}
              <div className="space-y-2.5 pb-5 border-b border-white/10 text-xs sm:text-sm font-semibold text-neutral-300">
                <div className="flex justify-between">
                  <span>Product Class</span>
                  <span className="text-white font-extrabold">{getFabricLabel()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Print Technology</span>
                  <span className="text-white font-extrabold">{getPrintLabel()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Batch Volume</span>
                  <span className="text-orange-400 font-mono font-black">{quantity} Units</span>
                </div>
                {discountPercent > 0 && (
                  <div className="flex justify-between text-emerald-400">
                    <span>Manufacturing Discount</span>
                    <span className="font-extrabold">-{discountPercent}% Tier Benefit</span>
                  </div>
                )}
              </div>

              {/* Big Price Numbers */}
              <div className="space-y-4 pt-1.5">
                <div className="flex items-end justify-between">
                  <span className="text-xs uppercase font-extrabold text-neutral-450 tracking-wider">Estimated Unit Rate</span>
                  <div className="text-right">
                    <span className="text-2xl sm:text-3xl font-black font-mono text-white">
                      ₹{unitCost}
                    </span>
                    <span className="text-[10px] uppercase text-neutral-400 block font-semibold">Per printed garment</span>
                  </div>
                </div>

                <div className="flex items-end justify-between pt-3.5 border-t border-dashed border-white/10">
                  <span className="text-xs uppercase font-extrabold text-orange-400 tracking-wider">Estimated Total Cost</span>
                  <div className="text-right">
                    <span className="text-3xl sm:text-4xl font-black font-mono text-orange-400 bg-gradient-to-r from-orange-400 to-amber-300 bg-clip-text text-transparent">
                      ₹{totalCost.toLocaleString('en-IN')}
                    </span>
                    <span className="text-[10px] uppercase text-neutral-400 block font-semibold">Includes standard Setup frame fees</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Conversion CTA Submit Button */}
            <div className="mt-8 space-y-4">
              <button
                onClick={handleWhatsAppQuote}
                className="w-full py-4.5 px-6 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-black text-sm tracking-wider shadow-lg shadow-orange-500/20 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Send className="h-4.5 w-4.5" />
                Submit Bulk Specification
              </button>
              
              <div className="flex items-start gap-2 text-[10px] text-neutral-450 font-semibold leading-relaxed">
                <AlertCircle className="h-4 w-4 text-orange-400 shrink-0 mt-0.5" />
                <p>
                  *Pricing computed is a high-accuracy estimation. Real pricing may vary slightly based on graphic colors, complexity, or custom packaging settings. Our team coordinates to send an official digital invoice within 2 hours.
                </p>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
