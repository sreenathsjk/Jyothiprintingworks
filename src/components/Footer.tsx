/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import Logo from './Logo';
import { Smartphone, Mail, MapPin, Instagram, Facebook, MessageSquare, ArrowUpRight, Clock } from 'lucide-react';

interface FooterProps {
  onNavigate: (page: string) => void;
  currentPage: string;
}

export default function Footer({ onNavigate, currentPage }: FooterProps) {
  const currentYear = new Date().getFullYear();

  const handleLinkClick = (pageId: string) => {
    onNavigate(pageId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const quickLinks = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About Us' },
    { id: 'services', label: 'Services' },
    { id: 'gallery', label: 'Gallery' },
    { id: 'bulk-orders', label: 'Bulk Orders' },
    { id: 'faqs', label: 'FAQs' },
    { id: 'contact', label: 'Contact' },
  ];

  const printServices = [
    { id: 'tshirt-printing', label: 'T-Shirt Printing' },
    { id: 'blouse-printing', label: 'Blouse Printing' },
    { id: 'sports-jersey', label: 'Sports Jersey' },
    { id: 'corporate-uniforms', label: 'Corporate Polos' },
    { id: 'school-uniforms', label: 'School Uniforms' },
  ];

  return (
    <footer id="footer-section" className="bg-neutral-900 text-neutral-300 pt-16 pb-8 border-t border-neutral-800 relative overflow-hidden text-left select-none">
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-orange-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Top section: Logo & Directories */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-neutral-800">
          
          {/* Logo column */}
          <div className="md:col-span-6 space-y-5">
            <button
              onClick={() => handleLinkClick('home')}
              className="flex items-center hover:opacity-90 transition-opacity cursor-pointer text-left"
              aria-label="Jyothi Printing Works Home"
            >
              <Logo className="h-11 sm:h-12 w-auto" variant="dark" />
            </button>
            <p className="text-xs sm:text-sm text-neutral-400 font-medium leading-relaxed max-w-md">
              Jyothi Printing Works is India’s premium custom printing studio specializing in high-grade fabric, T-shirts, saree blouses, dry-fit jerseys, and institutional bulk apparel manufacturing.
            </p>
          </div>

          {/* Quick links columns */}
          <div className="md:col-span-3 space-y-4">
            <h4 className="text-xs font-black uppercase tracking-widest text-orange-400">
              Quick Directory
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm font-semibold">
              {quickLinks.map((link) => (
                <li key={link.id}>
                  <button
                    onClick={() => handleLinkClick(link.id)}
                    className={`hover:text-orange-400 transition-colors cursor-pointer text-left ${
                      currentPage === link.id ? 'text-orange-500' : 'text-neutral-400'
                    }`}
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-3 space-y-4">
            <h4 className="text-xs font-black uppercase tracking-widest text-orange-400">
              Core Services
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm font-semibold">
              {printServices.map((srv) => (
                <li key={srv.id}>
                  <button
                    onClick={() => {
                      handleLinkClick('services');
                    }}
                    className="hover:text-orange-400 text-neutral-400 transition-colors cursor-pointer text-left"
                  >
                    {srv.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* Direct Contact & Studio Location Section */}
        <div className="pt-12 pb-12 border-b border-neutral-800 grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Column 1: Elegant Contact Card (from the image) */}
          <div className="lg:col-span-6 bg-neutral-950/40 p-6 sm:p-8 rounded-3xl border border-neutral-800 text-left flex flex-col justify-between">
            <div className="space-y-6">
              <h3 className="font-extrabold text-xl text-white tracking-tight">
                Jyothi Printing Works
              </h3>
              
              <div className="space-y-5">
                {/* Phone & WhatsApp */}
                <div className="flex items-start gap-3.5">
                  <div className="p-2.5 rounded-xl bg-orange-500/10 text-orange-500 mt-0.5 shrink-0">
                    <Smartphone className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-neutral-500">Phone & WhatsApp</h4>
                    <p className="text-sm sm:text-base text-neutral-200 font-bold mt-1">
                      +91 91827 03766 / +91 94912 18950
                    </p>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start gap-3.5">
                  <div className="p-2.5 rounded-xl bg-orange-500/10 text-orange-500 mt-0.5 shrink-0">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-neutral-500">Official Email</h4>
                    <p className="text-sm sm:text-base text-neutral-200 font-bold mt-1 truncate">
                      info@jyothiprintingworks.com
                    </p>
                  </div>
                </div>

                {/* Hours */}
                <div className="flex items-start gap-3.5">
                  <div className="p-2.5 rounded-xl bg-orange-500/10 text-orange-500 mt-0.5 shrink-0">
                    <Clock className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-neutral-500">Studio working hours</h4>
                    <p className="text-sm sm:text-base text-neutral-200 font-bold mt-1">
                      Mon – Sat: 9:00 AM – 8:00 PM <br />
                      <span className="text-xs text-orange-400 font-semibold mt-1 inline-block">Sunday: Closed (Event appointments only)</span>
                    </p>
                  </div>
                </div>

                {/* Location */}
                <a
                  href="https://maps.app.goo.gl/xTj1X4i7oFfPSRzH9?g_st=ac"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-start gap-3.5 group/loc hover:text-orange-400 transition-colors cursor-pointer text-left"
                >
                  <div className="p-2.5 rounded-xl bg-orange-500/10 text-orange-500 mt-0.5 shrink-0 group-hover/loc:bg-orange-500 group-hover/loc:text-white transition-all">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-neutral-500 group-hover/loc:text-orange-400 transition-colors">Main Printing Facility</h4>
                    <p className="text-xs sm:text-sm text-neutral-300 font-semibold mt-1 leading-relaxed group-hover/loc:text-white transition-colors">
                      Jyothi Printing Works, Industrial Estate, Bengaluru, Karnataka 560001, India
                    </p>
                  </div>
                </a>
              </div>
            </div>

            {/* Social Action Buttons */}
            <div className="pt-6 mt-6 border-t border-neutral-800/80 flex flex-wrap items-center gap-3">
              <a
                href="https://wa.me/919491218950?text=Hello%20Jyothi%20Printing%20Works!%20I'd%20like%20to%20discuss%20a%20printing%20requirement."
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
              >
                <MessageSquare className="h-4 w-4" />
                WhatsApp
              </a>

              <a
                href="https://www.instagram.com/jyothi_printing_works"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-pink-600 hover:bg-pink-700 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
              >
                <Instagram className="h-4 w-4" />
                Instagram
              </a>
            </div>
          </div>

          {/* Column 2: Live Google Map Frame */}
          <div className="lg:col-span-6 rounded-3xl overflow-hidden shadow-sm border border-neutral-800 relative bg-neutral-950 h-72 lg:h-auto min-h-[350px] group">
            <iframe
              src="https://maps.google.com/maps?q=14.686583,77.603604&t=&z=16&ie=UTF8&iwloc=&output=embed"
              className="w-full h-full border-0 opacity-75 hover:opacity-100 transition-all duration-300"
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Jyothi Printing Works Location Map"
            />
            <div className="absolute inset-0 bg-neutral-950/10 group-hover:bg-transparent transition-all pointer-events-none" />
            
            {/* Interactive Overlay Button */}
            <a
              href="https://maps.app.goo.gl/xTj1X4i7oFfPSRzH9?g_st=ac"
              target="_blank"
              rel="noreferrer"
              className="absolute bottom-4 right-4 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-neutral-900/95 hover:bg-orange-500 backdrop-blur-sm text-white font-bold text-xs shadow-lg border border-neutral-800 hover:border-orange-400 transition-all cursor-pointer z-20 group/btn"
            >
              <MapPin className="h-4 w-4 text-orange-500 group-hover/btn:text-white transition-colors" />
              <span>Open in Google Maps</span>
              <ArrowUpRight className="h-3 w-3 text-neutral-400 group-hover/btn:text-white" />
            </a>
          </div>

        </div>

        {/* Bottom footer: copyright & social icons */}
        <div className="pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs font-bold text-neutral-500 uppercase tracking-widest">
          <p>© {currentYear} Jyothi Printing Works. All Rights Reserved.</p>
          
          <div className="flex items-center gap-4.5">
            <a
              href="https://wa.me/919491218950?text=Hello"
              target="_blank"
              rel="noreferrer"
              className="p-2.5 rounded-full bg-neutral-800 text-neutral-400 hover:text-white hover:bg-orange-500 transition-all cursor-pointer shadow-sm"
              aria-label="WhatsApp Channel"
            >
              <MessageSquare className="h-4 w-4" />
            </a>
            <a
              href="https://www.instagram.com/jyothi_printing_works"
              target="_blank"
              rel="noreferrer"
              className="p-2.5 rounded-full bg-neutral-800 text-neutral-400 hover:text-white hover:bg-orange-500 transition-all cursor-pointer shadow-sm"
              aria-label="Instagram Channel"
            >
              <Instagram className="h-4 w-4" />
            </a>
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noreferrer"
              className="p-2.5 rounded-full bg-neutral-800 text-neutral-400 hover:text-white hover:bg-orange-500 transition-all cursor-pointer shadow-sm"
              aria-label="Facebook Page"
            >
              <Facebook className="h-4 w-4" />
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
}
