/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  X, 
  Trash2, 
  ShoppingBag, 
  Plus, 
  Minus, 
  Tag, 
  Truck, 
  Sparkles, 
  ArrowRight,
  ShieldCheck,
  FileText
} from 'lucide-react';
import { CartItem } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onUpdateQuantity: (id: string, newQty: number) => void;
  onRemoveItem: (id: string) => void;
  onCheckout: (discountAmount: number, finalTotal: number, couponCode: string) => void;
  initialCouponCode?: string;
  onClearInitialCoupon?: () => void;
}

export default function CartDrawer({
  isOpen,
  onClose,
  cart,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
  initialCouponCode,
  onClearInitialCoupon
}: CartDrawerProps) {
  const [coupon, setCoupon] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [discountPercent, setDiscountPercent] = useState(0);
  const [couponError, setCouponError] = useState<string | null>(null);

  // Auto-apply initialCouponCode when drawer opens
  useEffect(() => {
    if (isOpen && initialCouponCode) {
      const code = initialCouponCode.trim().toUpperCase();
      if (code === 'JYOTHI35') {
        setAppliedCoupon(code);
        setDiscountPercent(35);
        setCoupon(code);
        setCouponError(null);
      } else if (code === 'JYOTHI30') {
        setAppliedCoupon(code);
        setDiscountPercent(30);
        setCoupon(code);
        setCouponError(null);
      } else if (code === 'SAVE25') {
        setAppliedCoupon(code);
        setDiscountPercent(25);
        setCoupon(code);
        setCouponError(null);
      } else if (code === 'TRENDY10') {
        setAppliedCoupon(code);
        setDiscountPercent(10);
        setCoupon(code);
        setCouponError(null);
      } else if (code === 'FREESHIP') {
        setAppliedCoupon(code);
        setDiscountPercent(0);
        setCoupon(code);
        setCouponError(null);
      }
    }
  }, [isOpen, initialCouponCode]);

  if (!isOpen) return null;

  const itemTotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  
  // Free Shipping Threshold (₹999)
  const freeShippingThreshold = 999;
  const deliveryFee = itemTotal >= freeShippingThreshold || itemTotal === 0 ? 0 : 99;
  const progressPercent = Math.min((itemTotal / freeShippingThreshold) * 100, 100);
  const amountToFreeShipping = freeShippingThreshold - itemTotal;

  // Coupon Logic
  const handleApplyCoupon = () => {
    const code = coupon.trim().toUpperCase();
    if (code === 'JYOTHI35') {
      setAppliedCoupon(code);
      setDiscountPercent(35);
      setCouponError(null);
    } else if (code === 'JYOTHI30') {
      setAppliedCoupon(code);
      setDiscountPercent(30);
      setCouponError(null);
    } else if (code === 'SAVE25') {
      setAppliedCoupon(code);
      setDiscountPercent(25);
      setCouponError(null);
    } else if (code === 'TRENDY10') {
      setAppliedCoupon(code);
      setDiscountPercent(10);
      setCouponError(null);
    } else if (code === 'FREESHIP') {
      setAppliedCoupon(code);
      setDiscountPercent(0); // special logic, handled as 0% but triggers free shipping
      setCouponError(null);
    } else {
      setCouponError('Invalid coupon code. Try "JYOTHI35", "JYOTHI30" or "TRENDY10"!');
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setDiscountPercent(0);
    setCoupon('');
    if (onClearInitialCoupon) {
      onClearInitialCoupon();
    }
  };

  // Calculations
  const calculatedDiscount = Math.round(itemTotal * (discountPercent / 100));
  const finalDeliveryFee = appliedCoupon === 'FREESHIP' ? 0 : deliveryFee;
  const finalTotal = itemTotal - calculatedDiscount + finalDeliveryFee;

  return (
    <div className="fixed inset-0 z-50 flex justify-end overflow-hidden">
      {/* Background Dim Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-neutral-950/60 backdrop-blur-sm cursor-pointer"
      />

      {/* Slide Out Panel */}
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 220 }}
        className="relative w-full max-w-md h-full bg-white dark:bg-neutral-950 shadow-2xl border-l border-neutral-200 dark:border-neutral-900 flex flex-col z-10"
      >
        {/* Header */}
        <div className="p-5 border-b border-neutral-100 dark:border-neutral-900 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-orange-500 text-white shadow-md">
              <ShoppingBag className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-neutral-900 dark:text-white tracking-tight">Your Shopping Bag</h2>
              <p className="text-[10px] font-black uppercase text-orange-500 tracking-wider">
                {cart.length} unique {cart.length === 1 ? 'item' : 'items'} loaded
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors cursor-pointer text-neutral-500 dark:text-neutral-400"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Free Shipping Gamification Meter */}
        {itemTotal > 0 && (
          <div className="p-4 bg-orange-500/5 dark:bg-orange-500/10 border-b border-orange-500/20 px-6 space-y-2">
            <div className="flex items-center gap-2">
              <Truck className="h-4.5 w-4.5 text-orange-500 animate-bounce" />
              <p className="text-xs font-bold text-neutral-700 dark:text-neutral-300">
                {amountToFreeShipping > 0 ? (
                  <span>Add <strong className="text-orange-500">₹{amountToFreeShipping}</strong> more for free home delivery!</span>
                ) : (
                  <span className="text-emerald-600 dark:text-emerald-400 font-extrabold flex items-center gap-1">
                    <Sparkles className="h-3.5 w-3.5" /> Congrats! You got Free Home Delivery.
                  </span>
                )}
              </p>
            </div>
            <div className="h-1.5 w-full bg-neutral-200 dark:bg-neutral-850 rounded-full overflow-hidden">
              <div 
                className="h-full bg-orange-500 rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        )}

        {/* Cart Item List */}
        <div className="flex-grow overflow-y-auto p-5 space-y-4">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
              <div className="p-6 rounded-full bg-neutral-50 dark:bg-neutral-900 border border-neutral-150/80 dark:border-neutral-800 text-neutral-300">
                <ShoppingBag className="h-12 w-12" />
              </div>
              <div>
                <h3 className="font-bold text-base text-neutral-800 dark:text-white">Your bag is empty</h3>
                <p className="text-xs text-neutral-400 mt-1 max-w-xs font-medium">
                  Browse our high-quality streetwear catalogue or create a customized t-shirt mockup in the design studio.
                </p>
              </div>
              <button
                onClick={onClose}
                className="px-6 py-3 rounded-xl bg-orange-500 text-white font-extrabold text-xs uppercase tracking-widest cursor-pointer shadow-md hover:bg-orange-600 transition-all"
              >
                Go Shop Products
              </button>
            </div>
          ) : (
            cart.map((item) => (
              <div 
                key={item.id} 
                className="flex items-center gap-3.5 p-3 rounded-2xl bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-100 dark:border-neutral-800 shadow-sm"
              >
                {/* Thumbnail */}
                <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-xl overflow-hidden bg-neutral-100 dark:bg-neutral-950 shrink-0 border border-neutral-200/50 dark:border-neutral-800">
                  <img src={item.image} alt={item.title} className="h-full w-full object-cover" referrerPolicy="no-referrer" />
                </div>

                {/* Details */}
                <div className="flex-grow space-y-1 text-left min-w-0">
                  <span className="inline-block px-1.5 py-0.5 rounded-md bg-neutral-200 dark:bg-neutral-800 text-[9px] font-black text-neutral-600 dark:text-neutral-400 uppercase tracking-widest">
                    {item.size} • {item.color.name}
                  </span>
                  <h4 className="font-bold text-xs sm:text-sm text-neutral-900 dark:text-white truncate">
                    {item.title}
                  </h4>
                  {item.isCustom && item.customDesign && (
                    <p className="text-[10px] text-orange-500 dark:text-orange-400 font-extrabold flex items-center gap-1">
                      <Sparkles className="h-3 w-3 shrink-0" />
                      <span>Custom Design • {item.customDesign.printMethod.toUpperCase()}</span>
                    </p>
                  )}
                  {item.isCustom && item.customDesign?.printReadyFileName && (
                    <div className="text-[10px] text-neutral-400 dark:text-neutral-500 font-bold flex items-center gap-1 mt-0.5 truncate max-w-[200px]">
                      <FileText className="h-3 w-3 text-orange-500 shrink-0" />
                      <span className="truncate" title={item.customDesign.printReadyFileName}>
                        Artwork: {item.customDesign.printReadyFileName}
                      </span>
                    </div>
                  )}
                  <span className="block font-black text-sm text-neutral-900 dark:text-neutral-100">
                    ₹{item.price}
                  </span>
                </div>

                {/* Controls (Qty & Delete) */}
                <div className="flex flex-col items-end justify-between self-stretch shrink-0">
                  <button
                    onClick={() => onRemoveItem(item.id)}
                    className="p-1.5 text-neutral-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-500/5 rounded-lg transition-colors cursor-pointer"
                    aria-label="Remove item"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>

                  <div className="flex items-center bg-white dark:bg-neutral-950 rounded-lg border border-neutral-200/50 dark:border-neutral-800 p-0.5 shadow-sm">
                    <button
                      onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                      className="p-1 text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-900 rounded-md cursor-pointer"
                    >
                      <Minus className="h-3 w-3" />
                    </button>
                    <span className="w-6 text-center text-xs font-bold text-neutral-800 dark:text-neutral-200">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                      className="p-1 text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-900 rounded-md cursor-pointer"
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer calculation, Promo, and checkout button */}
        {cart.length > 0 && (
          <div className="p-5 border-t border-neutral-100 dark:border-neutral-900 bg-neutral-50/50 dark:bg-neutral-950/50 space-y-4">
            
            {/* Promo coupon input */}
            <div className="space-y-1.5">
              <label className="block text-[10px] font-black uppercase text-neutral-400 tracking-wider">
                Apply Promo Code (Try: JYOTHI30 / TRENDY10)
              </label>
              <div className="flex gap-2">
                <div className="relative flex-grow">
                  <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                  <input
                    type="text"
                    value={coupon}
                    onChange={(e) => setCoupon(e.target.value)}
                    placeholder="Enter Coupon"
                    className="w-full pl-9 pr-3 py-2 text-xs font-bold bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl focus:border-orange-500 dark:focus:border-orange-500 focus:outline-none dark:text-white"
                  />
                </div>
                <button
                  onClick={handleApplyCoupon}
                  className="px-4.5 py-2 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-950 text-xs font-black uppercase tracking-wider hover:bg-orange-500 hover:text-white dark:hover:bg-orange-500 dark:hover:text-white transition-all cursor-pointer"
                >
                  Apply
                </button>
              </div>

              {couponError && (
                <p className="text-[10px] font-bold text-red-500">{couponError}</p>
              )}

              {appliedCoupon && (
                <div className="flex items-center justify-between p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                  <span className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest flex items-center gap-1">
                    <Sparkles className="h-3.5 w-3.5" />
                    Coupon &ldquo;{appliedCoupon}&rdquo; Applied ({discountPercent}% Off)
                  </span>
                  <button onClick={handleRemoveCoupon} className="text-emerald-600 dark:text-emerald-400 p-0.5 hover:bg-emerald-500/10 rounded-full cursor-pointer">
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              )}
            </div>

            {/* Price Calculations */}
            <div className="space-y-2 border-t border-neutral-150/60 dark:border-neutral-900 pt-3">
              <div className="flex items-center justify-between text-xs font-semibold text-neutral-500 dark:text-neutral-400">
                <span>Items Subtotal</span>
                <span>₹{itemTotal}</span>
              </div>
              {appliedCoupon && (
                <div className="flex items-center justify-between text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                  <span>Coupon Discount</span>
                  <span>-₹{calculatedDiscount}</span>
                </div>
              )}
              <div className="flex items-center justify-between text-xs font-semibold text-neutral-500 dark:text-neutral-400">
                <span>Shipping & Handfeel Processing</span>
                <span>{finalDeliveryFee === 0 ? <strong className="text-emerald-500">FREE</strong> : `₹${finalDeliveryFee}`}</span>
              </div>
              <div className="flex items-center justify-between border-t border-neutral-150/60 dark:border-neutral-900 pt-2 text-base font-black text-neutral-900 dark:text-white">
                <span>Total Amount</span>
                <span>₹{finalTotal}</span>
              </div>
            </div>

            {/* Check Out CTA */}
            <button
              onClick={() => onCheckout(calculatedDiscount, finalTotal, appliedCoupon || '')}
              className="w-full py-4 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white font-extrabold uppercase text-xs tracking-widest flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-orange-500/10 active:scale-[0.98]"
            >
              <span>Proceed to secure checkout</span>
              <ArrowRight className="h-4 w-4" />
            </button>

            {/* Trust Badging */}
            <div className="flex items-center justify-center gap-1.5 text-[9px] font-black uppercase text-neutral-400 tracking-wider">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
              <span>UPI, Card Payments Secured via SSL Gateway</span>
            </div>

          </div>
        )}
      </motion.div>
    </div>
  );
}
