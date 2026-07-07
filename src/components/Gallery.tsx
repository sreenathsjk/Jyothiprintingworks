/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Eye, X, Send, SlidersHorizontal } from 'lucide-react';

interface GalleryImage {
  id: string;
  url: string;
  title: string;
  category: string;
  aspect: 'portrait' | 'landscape' | 'square';
}

export default function Gallery() {
  const [filter, setFilter] = useState<string>('all');
  const [selectedImg, setSelectedImg] = useState<GalleryImage | null>(null);

  // Curated highly immersive visual print photos representing a professional, busy studio floor
  const galleryImages: GalleryImage[] = [
    {
      id: 'g1',
      url: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&q=80&w=800',
      title: 'Vibrant CMYK Ink Blending',
      category: 'studio',
      aspect: 'landscape'
    },
    {
      id: 'g2',
      url: 'https://images.unsplash.com/photo-1562157873-818bc0726f68?auto=format&fit=crop&q=80&w=800',
      title: 'Premium Ringspun Cotton Fold',
      category: 'fabrics',
      aspect: 'portrait'
    },
    {
      id: 'g3',
      url: 'https://images.unsplash.com/photo-1610030469668-93535c17b6b3?auto=format&fit=crop&q=80&w=800',
      title: 'Silk Embroidery Threadwork detail',
      category: 'ethnic',
      aspect: 'square'
    },
    {
      id: 'g4',
      url: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&q=80&w=800',
      title: 'Sublimated Athletic Polyester',
      category: 'athletic',
      aspect: 'landscape'
    },
    {
      id: 'g5',
      url: 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&q=80&w=800',
      title: 'Custom block-print detailing',
      category: 'ethnic',
      aspect: 'portrait'
    },
    {
      id: 'g6',
      url: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&q=80&w=800',
      title: 'Corporate Polo Sleeve Embroidery',
      category: 'corporate',
      aspect: 'square'
    },
    {
      id: 'g7',
      url: 'https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?auto=format&fit=crop&q=80&w=800',
      title: 'Heavy Duty Screen Printing Mesh',
      category: 'studio',
      aspect: 'portrait'
    },
    {
      id: 'g8',
      url: 'https://images.unsplash.com/photo-1554568218-0f1715e72254?auto=format&fit=crop&q=80&w=800',
      title: 'High-density multi-color screen alignment',
      category: 'studio',
      aspect: 'landscape'
    },
    {
      id: 'g9',
      url: 'https://images.unsplash.com/photo-1513346033051-5b850d4be04c?auto=format&fit=crop&q=80&w=800',
      title: 'Premium Linen Roll Inspection',
      category: 'fabrics',
      aspect: 'square'
    }
  ];

  const categories = [
    { id: 'all', label: 'All Photos' },
    { id: 'studio', label: 'Studio Floor' },
    { id: 'fabrics', label: 'Apparel Fabrics' },
    { id: 'ethnic', label: 'Designer Blouses' },
    { id: 'athletic', label: 'Athletic apparel' },
    { id: 'corporate', label: 'Corporate & School' },
  ];

  const filteredImages = filter === 'all'
    ? galleryImages
    : galleryImages.filter(img => img.category === filter);

  const handleWhatsAppInquiry = (img: GalleryImage) => {
    const message = `Hello Jyothi Printing Works! I saw the photo "${img.title}" in your print studio gallery and would like to ask some questions regarding fabric printing.`;
    const url = `https://wa.me/919900000000?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  return (
    <section id="gallery-section" className="py-20 bg-neutral-50 dark:bg-neutral-950 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-sm font-extrabold text-orange-500 tracking-wider uppercase bg-orange-50 dark:bg-orange-950/40 px-4 py-1.5 rounded-full border border-orange-200/50 dark:border-orange-800/30">
            Immersive Gallery
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-neutral-900 dark:text-white mt-4 tracking-tight">
            Our Studio & Fabric Closeups
          </h2>
          <p className="text-base text-neutral-500 dark:text-neutral-400 mt-4 leading-relaxed font-medium">
            Take a visual tour inside our printing workshop, showing off raw fabrics, detailed print meshes, custom inks, and finished garments under high resolution.
          </p>
        </div>

        {/* Horizontal Category Filters */}
        <div className="flex flex-wrap justify-center items-center gap-3 mb-12 border-b border-neutral-200/40 dark:border-neutral-800/60 pb-6">
          <SlidersHorizontal className="h-4.5 w-4.5 text-neutral-400 shrink-0 hidden sm:block" />
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setFilter(cat.id)}
              className={`px-4.5 py-2 rounded-2xl text-xs sm:text-sm font-bold tracking-wide transition-all cursor-pointer ${
                filter === cat.id
                  ? 'bg-orange-500 text-white shadow-md'
                  : 'bg-white dark:bg-neutral-900 text-neutral-600 dark:text-neutral-450 hover:text-orange-500 hover:bg-neutral-100 border border-neutral-250/50 dark:border-neutral-800'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Pinterest Masonry Columns Grid */}
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
          {filteredImages.map((img) => (
            <motion.div
              key={img.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4 }}
              className="break-inside-avoid relative overflow-hidden rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200/50 dark:border-neutral-800 p-3 group shadow-sm hover:shadow-md transition-all duration-300"
            >
              <div className="overflow-hidden rounded-2xl bg-neutral-100 dark:bg-neutral-950 relative">
                <img
                  src={img.url}
                  alt={img.title}
                  className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                
                {/* Hover Visual Overlay */}
                <div className="absolute inset-0 bg-neutral-950/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-5">
                  <button
                    onClick={() => setSelectedImg(img)}
                    className="self-end p-2 rounded-full bg-white/90 dark:bg-neutral-900/90 text-neutral-800 dark:text-neutral-200 shadow-md hover:bg-orange-500 hover:text-white hover:scale-110 transition-all cursor-pointer"
                    aria-label="Zoom Image"
                  >
                    <Eye className="h-4.5 w-4.5" />
                  </button>

                  <div className="space-y-1.5 text-left">
                    <span className="text-[9px] font-black uppercase tracking-widest text-orange-400">
                      {img.category}
                    </span>
                    <h3 className="text-white font-bold text-sm leading-tight">
                      {img.title}
                    </h3>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Full Screen Image Lightbox Modal */}
        <AnimatePresence>
          {selectedImg && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedImg(null)}
                className="absolute inset-0"
              />

              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="relative max-w-4xl max-h-[85vh] flex flex-col bg-white dark:bg-neutral-900 rounded-3xl overflow-hidden border border-neutral-200 dark:border-neutral-800 shadow-2xl"
              >
                {/* Close Button */}
                <button
                  onClick={() => setSelectedImg(null)}
                  className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-black/55 text-white hover:bg-orange-500 transition-all cursor-pointer"
                  aria-label="Close Lightbox"
                >
                  <X className="h-5 w-5" />
                </button>

                {/* Immersive Image Display */}
                <div className="overflow-hidden bg-neutral-950 flex-grow flex items-center justify-center max-h-[70vh]">
                  <img
                    src={selectedImg.url}
                    alt={selectedImg.title}
                    className="max-h-[70vh] w-auto max-w-full object-contain"
                    referrerPolicy="no-referrer"
                  />
                </div>

                {/* Bottom details with conversion prompt */}
                <div className="p-5.5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white dark:bg-neutral-900 border-t border-neutral-100 dark:border-neutral-800">
                  <div className="text-left">
                    <span className="text-[10px] font-black text-orange-500 uppercase tracking-widest">
                      {selectedImg.category} Gallery
                    </span>
                    <h3 className="font-bold text-base text-neutral-900 dark:text-white mt-1 leading-tight">
                      {selectedImg.title}
                    </h3>
                  </div>

                  <button
                    onClick={() => handleWhatsAppInquiry(selectedImg)}
                    className="w-full sm:w-auto px-5 py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-sm flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-md shadow-emerald-500/10"
                  >
                    <Send className="h-4 w-4" />
                    Inquire on WhatsApp
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </section>
  );
}
