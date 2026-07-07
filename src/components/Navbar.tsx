/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Menu, X, Sun, Moon, PhoneCall } from 'lucide-react';
import Logo from './Logo';

interface NavbarProps {
  currentPage: string;
  setCurrentPage: (page: string) => void;
  isDarkMode: boolean;
  setIsDarkMode: (dark: boolean) => void;
}

export default function Navbar({ currentPage, setCurrentPage, isDarkMode, setIsDarkMode }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About Us' },
    { id: 'services', label: 'Services' },
    { id: 'gallery', label: 'Gallery' },
    { id: 'bulk-orders', label: 'Bulk Orders' },
    { id: 'faqs', label: 'FAQs' },
    { id: 'contact', label: 'Contact' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (id: string) => {
    setCurrentPage(id);
    setIsOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    // Update hash for basic SEO/bookmarking support
    window.location.hash = id;
  };

  const leftLinks = navLinks.slice(0, 4);
  const rightLinks = navLinks.slice(4);

  return (
    <header
      id="main-navbar"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isOpen || isScrolled
          ? 'bg-white shadow-md border-b border-neutral-200 py-3'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between lg:grid lg:grid-cols-12 lg:gap-4">
          
          {/* LEFT: Desktop Menu */}
          <nav className="hidden lg:flex lg:col-span-5 items-center justify-start space-x-1" aria-label="Left Navigation">
            {leftLinks.map((link) => {
              const isActive = currentPage === link.id;
              return (
                <button
                  key={link.id}
                  id={`nav-link-${link.id}`}
                  onClick={() => handleNavClick(link.id)}
                  className={`px-3.5 py-2 rounded-full text-sm font-semibold tracking-wide transition-all cursor-pointer ${
                    isActive
                      ? 'bg-orange-500 text-white shadow-sm shadow-orange-500/20'
                      : 'text-neutral-700 hover:text-orange-500 hover:bg-neutral-100'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
          </nav>

          {/* LEFT: Mobile Menu hamburger */}
          <div className="flex lg:hidden items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              id="mobile-menu-hamburger"
              className="p-2 rounded-full bg-neutral-100 text-neutral-700 hover:bg-neutral-200 cursor-pointer"
              aria-label="Open navigation menu"
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>

          {/* CENTER: Logo */}
          <div className="lg:col-span-2 flex justify-center items-center">
            <button
              onClick={() => handleNavClick('home')}
              className="flex items-center hover:opacity-90 transition-opacity cursor-pointer p-1"
              aria-label="Jyothi Printing Works Home"
            >
              <Logo className="h-10 sm:h-11 md:h-12 w-auto" />
            </button>
          </div>

          {/* RIGHT: Desktop Menu & CTA */}
          <div className="hidden lg:flex lg:col-span-5 items-center justify-end gap-4">
            <nav className="flex items-center space-x-1" aria-label="Right Navigation">
              {rightLinks.map((link) => {
                const isActive = currentPage === link.id;
                return (
                  <button
                    key={link.id}
                    id={`nav-link-${link.id}`}
                    onClick={() => handleNavClick(link.id)}
                    className={`px-3.5 py-2 rounded-full text-sm font-semibold tracking-wide transition-all cursor-pointer ${
                      isActive
                        ? 'bg-orange-500 text-white shadow-sm shadow-orange-500/20'
                        : 'text-neutral-700 hover:text-orange-500 hover:bg-neutral-100'
                    }`}
                  >
                    {link.label}
                  </button>
                );
              })}
            </nav>

            {/* Quick Quote CTA */}
            <button
              onClick={() => handleNavClick('contact')}
              id="nav-quote-cta"
              className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-neutral-900 text-white font-bold text-sm hover:bg-orange-500 transition-all shadow-md hover:shadow-orange-500/20 active:scale-95 cursor-pointer shrink-0"
            >
              <PhoneCall className="h-4 w-4 animate-pulse" />
              <span>Get Quote</span>
            </button>
          </div>

          {/* RIGHT: Mobile Quick Quote CTA */}
          <div className="flex lg:hidden items-center justify-end">
            <button
              onClick={() => handleNavClick('contact')}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs sm:text-sm shadow-md transition-all active:scale-95 cursor-pointer"
              aria-label="Get a custom quote"
            >
              <PhoneCall className="h-3.5 w-3.5 animate-pulse" />
              <span>Get Quote</span>
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Navigation overlay */}
      {isOpen && (
        <div className="lg:hidden fixed inset-x-0 top-[64px] bottom-0 z-40 bg-white border-t border-neutral-200 shadow-xl overflow-y-auto animate-in fade-in slide-in-from-top duration-250">
          <nav className="flex flex-col p-6 space-y-4 pb-12">
            {navLinks.map((link) => {
              const isActive = currentPage === link.id;
              return (
                <button
                  key={link.id}
                  id={`nav-mobile-${link.id}`}
                  onClick={() => handleNavClick(link.id)}
                  className={`text-left w-full px-5 py-3.5 rounded-2xl text-base font-bold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-500/25'
                      : 'text-neutral-800 hover:bg-neutral-100'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}

            <div className="pt-4 border-t border-neutral-200 flex flex-col gap-3">
              <button
                onClick={() => handleNavClick('contact')}
                className="flex items-center justify-center gap-2 w-full py-4 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-center cursor-pointer shadow-md"
              >
                <PhoneCall className="h-5 w-5" />
                Get Custom Quote
              </button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
