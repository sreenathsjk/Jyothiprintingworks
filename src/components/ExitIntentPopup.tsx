import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Copy, Check, Clock, Gift, Sparkles, ArrowRight } from 'lucide-react';

interface ExitIntentPopupProps {
  onApplyCoupon?: (couponCode: string) => void;
  onOpenCart?: () => void;
}

export default function ExitIntentPopup({ onApplyCoupon, onOpenCart }: ExitIntentPopupProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [timeLeft, setTimeLeft] = useState(900); // 15 minutes in seconds
  const couponCode = 'JYOTHI35';

  // 1. Detect Exit Intent
  useEffect(() => {
    // Check if already shown in this session
    const hasBeenShown = sessionStorage.getItem('jyothi_exit_intent_shown');
    if (hasBeenShown === 'true') return;

    const handleMouseLeave = (e: MouseEvent) => {
      // Trigger when mouse moves out of the top of the viewport (clientY close to 0 or negative)
      if (e.clientY < 15 && e.movementY < 0) {
        setIsOpen(true);
        sessionStorage.setItem('jyothi_exit_intent_shown', 'true');
      }
    };

    // Also trigger as fallback if user switches focus away from the page
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        const shown = sessionStorage.getItem('jyothi_exit_intent_shown');
        if (shown !== 'true') {
          setIsOpen(true);
          sessionStorage.setItem('jyothi_exit_intent_shown', 'true');
        }
      }
    };

    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  // 2. Countdown Timer
  useEffect(() => {
    if (!isOpen || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen, timeLeft]);

  // Format time (MM:SS)
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // 3. Copy to Clipboard
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(couponCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  // 4. Handle Action Button Click
  const handleClaim = () => {
    if (onApplyCoupon) {
      onApplyCoupon(couponCode);
    }
    setIsOpen(false);
    if (onOpenCart) {
      // Small delay to let closing animation finish
      setTimeout(() => {
        onOpenCart();
      }, 300);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" id="exit-intent-overlay">
          {/* Backdrop with a beautiful blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="absolute inset-0 bg-neutral-950/70 backdrop-blur-md cursor-pointer"
            id="exit-intent-backdrop"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 30 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className="relative w-full max-w-md bg-white dark:bg-neutral-900 rounded-3xl border border-neutral-200 dark:border-neutral-800 shadow-2xl p-6 sm:p-8 overflow-hidden text-center z-10"
            id="exit-intent-modal"
          >
            {/* Background design accents */}
            <div className="absolute -top-12 -left-12 w-28 h-28 rounded-full bg-orange-500/10 blur-xl pointer-events-none" />
            <div className="absolute -bottom-12 -right-12 w-28 h-28 rounded-full bg-yellow-500/10 blur-xl pointer-events-none" />

            {/* Close Button */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors cursor-pointer"
              id="exit-intent-close-btn"
              aria-label="Close dialog"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Header Icon */}
            <div className="mx-auto w-16 h-16 rounded-2xl bg-orange-50 dark:bg-orange-950/30 flex items-center justify-center mb-5 border border-orange-100 dark:border-orange-900/30">
              <Gift className="h-8 w-8 text-orange-500 animate-bounce" />
            </div>

            {/* Titles */}
            <div className="space-y-2 mb-6">
              <div className="flex items-center justify-center gap-1.5 text-orange-500 text-[10px] font-black uppercase tracking-widest">
                <Sparkles className="h-3.5 w-3.5" />
                <span>Special Surprise Offer</span>
                <Sparkles className="h-3.5 w-3.5" />
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-neutral-900 dark:text-white tracking-tight leading-tight">
                Wait! Don't Leave Empty Handed!
              </h2>
              <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 font-medium max-w-sm mx-auto leading-relaxed">
                Complete your premium custom print order right now and lock in a massive extra discount!
              </p>
            </div>

            {/* Coupon Code Card */}
            <div className="bg-neutral-50 dark:bg-neutral-950 border border-neutral-150 dark:border-neutral-850 rounded-2xl p-4 mb-6 relative">
              <div className="text-[10px] font-black uppercase text-neutral-400 dark:text-neutral-500 tracking-wider mb-2">
                Your Exclusive Closeout Code
              </div>

              <div className="flex items-center justify-between bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-2 px-3 gap-2">
                <span className="font-mono text-lg font-black text-orange-500 tracking-wider pl-1 select-all">
                  {couponCode}
                </span>

                <button
                  onClick={handleCopy}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer ${
                    copied
                      ? 'bg-emerald-500 text-white'
                      : 'bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-100 text-white'
                  }`}
                  id="exit-intent-copy-btn"
                >
                  {copied ? (
                    <>
                      <Check className="h-3.5 w-3.5" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>

              {/* Offer Timer Banner */}
              <div className="flex items-center justify-center gap-1.5 text-red-500 dark:text-red-400 text-[10px] font-extrabold uppercase tracking-wider mt-3">
                <Clock className="h-3.5 w-3.5 animate-pulse" />
                <span>Offer expires in:</span>
                <span className="font-mono text-xs font-black">{formatTime(timeLeft)}</span>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="space-y-3">
              <button
                onClick={handleClaim}
                className="w-full py-3.5 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white font-black text-xs uppercase tracking-wider shadow-md shadow-orange-500/20 hover:shadow-orange-500/30 transition-all flex items-center justify-center gap-1.5 cursor-pointer hover:scale-[1.01] active:scale-[0.99]"
                id="exit-intent-claim-btn"
              >
                <span>Apply 35% Discount & View Cart</span>
                <ArrowRight className="h-4 w-4" />
              </button>

              <button
                onClick={() => setIsOpen(false)}
                className="text-xs font-extrabold uppercase tracking-wider text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors cursor-pointer"
                id="exit-intent-skip-btn"
              >
                No thanks, I'll pay full price
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
