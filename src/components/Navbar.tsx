/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Menu, X, Sun, Moon, PhoneCall, Sparkles, ShoppingBag, User as UserIcon, LogOut } from 'lucide-react';
import Logo from './Logo';
import { User } from '../types';

interface NavbarProps {
  currentPage: string;
  setCurrentPage: (page: string) => void;
  isDarkMode: boolean;
  setIsDarkMode: (dark: boolean) => void;
  cartCount?: number;
  onOpenCart?: () => void;
  showWishlistOnly?: boolean;
  setShowWishlistOnly?: (show: boolean) => void;
  wishlistCount?: number;
  currentUser: User | null;
  onOpenAuth: () => void;
  onLogout: () => void;
}

export default function Navbar({ 
  currentPage, 
  setCurrentPage, 
  isDarkMode, 
  setIsDarkMode,
  cartCount = 0,
  onOpenCart,
  showWishlistOnly = false,
  setShowWishlistOnly,
  wishlistCount = 0,
  currentUser,
  onOpenAuth,
  onLogout
}: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showBanner, setShowBanner] = useState(() => {
    try {
      const saved = localStorage.getItem('jyothi_promo_banner_dismissed');
      return saved !== 'true';
    } catch {
      return true;
    }
  });

  const navLinks = [
    { id: 'home', label: 'Jyothi Store' },
    { id: 'custom-studio', label: 'Design Studio 🎨' },
    { id: 'track-order', label: 'Track Order 📦' },
    { id: 'my-orders', label: 'My Account 👤' },
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

  const leftLinks = navLinks;
  const rightLinks: typeof navLinks = [];

  // Dynamic logo height to give a luxurious, prominent feel on first load, and premium smooth shrink on scroll
  const logoHeightClass = isOpen || isScrolled
    ? 'h-10 sm:h-11 md:h-12 lg:h-14'
    : 'h-14 sm:h-16 md:h-18 lg:h-22';

  return (
    <header
      id="main-navbar"
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-white dark:bg-neutral-950 border-b border-neutral-200 dark:border-neutral-800 shadow-sm"
    >
      {/* Slim, high-visibility promotional banner */}
      {showBanner && (
        <div className="bg-gradient-to-r from-orange-600 via-amber-500 to-orange-500 text-white text-[11px] sm:text-xs py-2 px-8 font-bold text-center flex items-center justify-center gap-1.5 relative z-50 shadow-inner">
          <div className="flex items-center gap-1 animate-pulse">
            <Sparkles className="h-3.5 w-3.5 text-amber-200 shrink-0" />
            <span className="bg-white/20 text-[9px] px-1.5 py-0.5 rounded uppercase tracking-wider font-extrabold">Offer</span>
          </div>
          <span className="tracking-wide">Bulk order discounts up to 25% — Limited time offer!</span>
          <button
            onClick={() => handleNavClick('bulk-orders')}
            className="ml-2 bg-white text-orange-600 hover:bg-orange-50 hover:text-orange-700 px-2.5 py-0.5 rounded-full text-[10px] tracking-wider uppercase font-extrabold transition-all active:scale-95 cursor-pointer shadow-sm shrink-0"
          >
            Claim Offer
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowBanner(false);
              try {
                localStorage.setItem('jyothi_promo_banner_dismissed', 'true');
              } catch (err) {
                console.error(err);
              }
            }}
            className="absolute right-2 sm:right-4 p-1 hover:bg-white/10 rounded-full transition-colors cursor-pointer text-white/80 hover:text-white"
            aria-label="Dismiss banner"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* Main Navbar Contents - relative to support absolute center logo on mobile */}
      <div className={`transition-all duration-300 relative ${
        isOpen || isScrolled ? 'py-1 lg:py-2' : 'py-3 lg:py-4'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between lg:grid lg:grid-cols-12 lg:gap-4 min-h-[48px] lg:min-h-0">
          
          {/* LEFT: Desktop Menu */}
          <nav className="hidden lg:flex lg:col-span-4 items-center justify-start space-x-1" aria-label="Left Navigation">
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
          <div className="flex lg:hidden items-center relative z-10">
            <button
              onClick={() => setIsOpen(!isOpen)}
              id="mobile-menu-hamburger"
              className="p-2 rounded-full bg-neutral-100 text-neutral-700 hover:bg-neutral-200 cursor-pointer"
              aria-label="Open navigation menu"
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>

          {/* CENTER: Logo (Centered absolutely on mobile for perfect centering, and grid-centered on desktop) */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 lg:relative lg:left-auto lg:top-auto lg:translate-x-0 lg:translate-y-0 lg:col-span-4 flex justify-center items-center">
            <button
              onClick={() => handleNavClick('home')}
              className="flex items-center hover:opacity-90 transition-opacity cursor-pointer p-1"
              aria-label="Jyothi Printing Works Home"
            >
              {/* Full Beautiful Jyothi Print Studio Logo */}
              <Logo className={`${logoHeightClass} w-auto transition-all duration-300`} />
            </button>
          </div>

          {/* RIGHT: Desktop Menu - Get Quote CTA removed */}
          <div className="hidden lg:flex lg:col-span-4 items-center justify-end">
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

            {/* Desktop Shopping Cart Trigger */}
            <div className="pl-4 ml-3 border-l border-neutral-200 flex items-center justify-center gap-3">
              <button
                onClick={onOpenCart}
                className="relative p-2.5 rounded-full hover:bg-neutral-100 text-neutral-700 hover:text-orange-500 transition-all cursor-pointer flex items-center justify-center"
                aria-label="Open Shopping Bag"
              >
                <ShoppingBag className="h-5 w-5" />
                {!!cartCount && (
                  <span className="absolute -top-1 -right-1 h-4.5 w-4.5 rounded-full bg-orange-500 text-white font-black text-[9px] flex items-center justify-center border border-white">
                    {cartCount}
                  </span>
                )}
              </button>

              {currentUser ? (
                <div className="flex items-center gap-2">
                  <div className="flex flex-col items-end hidden sm:flex">
                    <span className="text-[10px] font-black text-neutral-900 dark:text-white uppercase tracking-wider max-w-[100px] truncate">{currentUser.name}</span>
                    <span className="text-[8px] font-extrabold text-orange-500 uppercase tracking-widest">Verified Customer</span>
                  </div>
                  <button
                    onClick={onLogout}
                    className="p-2.5 rounded-full hover:bg-red-50 dark:hover:bg-red-950/25 text-neutral-500 hover:text-red-500 transition-all cursor-pointer flex items-center justify-center"
                    title="Sign Out"
                  >
                    <LogOut className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={onOpenAuth}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-neutral-900 hover:bg-orange-500 text-white dark:bg-neutral-800 dark:hover:bg-orange-500 transition-all text-xs font-black uppercase tracking-wider shadow-sm cursor-pointer"
                >
                  <UserIcon className="h-3.5 w-3.5" />
                  <span>Sign In</span>
                </button>
              )}
            </div>
          </div>

          {/* RIGHT: Mobile Shopping Bag / Cart Quick Trigger */}
          <div className="flex lg:hidden items-center justify-end gap-1.5 relative z-10">
            <button
              onClick={onOpenCart}
              className="relative p-2.5 rounded-full bg-neutral-100 text-neutral-700 hover:bg-neutral-200 cursor-pointer"
              aria-label="Open Cart Bag"
            >
              <ShoppingBag className="h-5 w-5" />
              {!!cartCount && (
                <span className="absolute -top-1 -right-1 h-4.5 w-4.5 rounded-full bg-orange-500 text-white font-black text-[9px] flex items-center justify-center border border-white animate-scale-in">
                  {cartCount}
                </span>
              )}
            </button>
          </div>

        </div>
      </div>
      </div>

      {/* Mobile Drawer Navigation overlay */}
      {isOpen && (
        <div className={`lg:hidden fixed inset-x-0 ${showBanner ? 'top-[96px]' : 'top-[64px]'} bottom-0 z-40 bg-white border-t border-neutral-200 shadow-xl overflow-y-auto animate-in fade-in slide-in-from-top duration-250`}>
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
              {currentUser ? (
                <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 text-left">
                  <p className="text-[10px] font-black uppercase text-neutral-400 dark:text-neutral-500 tracking-wider">Signed In Customer</p>
                  <h5 className="font-extrabold text-sm text-neutral-900 dark:text-white mt-1">{currentUser.name}</h5>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 font-medium">{currentUser.email}</p>
                  <button
                    onClick={() => {
                      onLogout();
                      setIsOpen(false);
                    }}
                    className="mt-3 inline-flex items-center justify-center gap-1.5 w-full py-2.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 dark:bg-red-950/20 dark:hover:bg-red-950/40 dark:text-red-400 text-xs font-black uppercase tracking-wider transition-all cursor-pointer"
                  >
                    <LogOut className="h-3.5 w-3.5" />
                    <span>Sign Out Account</span>
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    onOpenAuth();
                    setIsOpen(false);
                  }}
                  className="flex items-center justify-center gap-2 w-full py-4 rounded-2xl bg-neutral-900 hover:bg-orange-500 text-white dark:bg-neutral-800 dark:hover:bg-orange-500 font-extrabold text-center cursor-pointer shadow-md transition-all uppercase tracking-wider text-sm"
                >
                  <UserIcon className="h-4 w-4" />
                  <span>Customer Sign In</span>
                </button>
              )}

              <a
                href={`https://wa.me/919182703766?text=${encodeURIComponent("Hello Jyothi Print Studio! I'm viewing your products and would like to inquire about custom requirements.")}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-center gap-2.5 w-full py-4 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-center cursor-pointer shadow-md shadow-emerald-500/10 transition-all uppercase tracking-wider text-sm"
              >
                <svg 
                  className="h-5 w-5 fill-current shrink-0" 
                  viewBox="0 0 24 24" 
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.713-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.625 1.451 5.437.002 9.861-4.366 9.864-9.736.001-2.596-1.002-5.037-2.83-6.87C16.471 2.163 14.043 1.157 11.451 1.15c-5.438 0-9.867 4.367-9.87 9.742-.001 1.954.512 3.86 1.482 5.585L2.01 22.013l5.837-1.523c.31.18.513.29.8.464zM16.634 13.91c-.27-.135-1.597-.788-1.845-.878-.248-.09-.43-.136-.61.135-.18.272-.697.879-.854 1.059-.157.18-.315.203-.585.068-.27-.136-1.14-.42-2.172-1.341-.803-.717-1.345-1.603-1.502-1.874-.157-.271-.017-.417.118-.552.122-.121.27-.315.405-.473.135-.158.18-.271.27-.451.09-.18.045-.339-.022-.474-.068-.135-.61-1.472-.836-2.013-.22-.53-.442-.458-.61-.466-.157-.008-.338-.01-.52-.01-.18 0-.473.067-.72.339-.247.271-.944.924-.944 2.253 0 1.329.967 2.61 1.102 2.79.135.18 1.9 2.901 4.6 4.068.643.278 1.144.444 1.536.568.646.206 1.233.176 1.697.108.517-.076 1.598-.653 1.823-1.282.225-.63.225-1.17.157-1.282-.067-.113-.247-.18-.517-.315z" />
                </svg>
                <span>Chat with Designer</span>
              </a>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
