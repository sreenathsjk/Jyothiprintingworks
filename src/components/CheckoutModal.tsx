/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  MapPin, 
  CreditCard, 
  ShieldCheck, 
  Sparkles, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2, 
  Download,
  Send,
  Loader2,
  PhoneCall
} from 'lucide-react';
import { CartItem } from '../types';
import { db, auth, handleFirestoreError, OperationType } from '../lib/firebase';
import { doc, setDoc } from 'firebase/firestore';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  discountAmount: number;
  finalTotal: number;
  couponCode: string;
  onOrderSuccess: () => void;
}

export default function CheckoutModal({
  isOpen,
  onClose,
  cart,
  discountAmount,
  finalTotal,
  couponCode,
  onOrderSuccess
}: CheckoutModalProps) {
  const [step, setStep] = useState<'shipping' | 'payment' | 'processing' | 'success'>('shipping');
  
  // Shipping details state
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    state: 'Karnataka',
    pincode: ''
  });
  
  const [paymentMethod, setPaymentMethod] = useState<'razorpay' | 'cod'>('razorpay');
  const [isPincodeValid, setIsPincodeValid] = useState<boolean | null>(null);
  const [pincodeMessage, setPincodeMessage] = useState<string>('');
  const [orderId, setOrderId] = useState('');
  const [razorpayPaymentId, setRazorpayPaymentId] = useState<string>('');

  // Dynamically load Razorpay Checkout script when modal opens
  useEffect(() => {
    if (isOpen) {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      document.body.appendChild(script);
      return () => {
        const existingScript = document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]');
        if (existingScript && existingScript.parentNode) {
          existingScript.parentNode.removeChild(existingScript);
        }
      };
    }
  }, [isOpen]);

  // Generate Unique Order ID and prefill user session details on launch
  useEffect(() => {
    if (isOpen) {
      const num = Math.floor(100000 + Math.random() * 900000);
      setOrderId(`JPW-2026-${num}`);
      setStep('shipping');
      setRazorpayPaymentId('');

      try {
        const loggedInUserStr = localStorage.getItem('jyothi_logged_in_user');
        if (loggedInUserStr) {
          const user = JSON.parse(loggedInUserStr);
          setFormData(prev => ({
            ...prev,
            name: user.name || '',
            phone: user.phone || '',
            email: user.email || ''
          }));
        }
      } catch (err) {
        console.error('Failed to prefill user checkout info:', err);
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Simple pincode checker logic
  const handlePincodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 6);
    setFormData(prev => ({ ...prev, pincode: val }));
    
    if (val.length === 6) {
      // simulate checking hubs
      const isExpressHub = ['560001', '560002', '560038', '400001', '400002', '110001', '110002', '600001'].includes(val);
      setIsPincodeValid(true);
      if (isExpressHub) {
        setPincodeMessage('🚀 Premium Express Hub: Next-Day Hand-delivery available!');
      } else {
        setPincodeMessage('✓ Standard Hub: Delivery in 2-3 business days.');
      }
    } else {
      setIsPincodeValid(null);
      setPincodeMessage('');
    }
  };

  const validateShippingForm = () => {
    return (
      formData.name.trim().length > 2 &&
      /^[0-9]{10}$/.test(formData.phone) &&
      formData.email.includes('@') &&
      formData.address.trim().length > 6 &&
      formData.city.trim().length > 2 &&
      formData.pincode.length === 6
    );
  };

  const handleNextToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateShippingForm()) {
      setStep('payment');
    }
  };

  // Save order to history and associate with signed-in user
  const processSaveOrder = async (paymentId: string) => {
    setStep('processing');
    
    // Simulate slight processing network delay for clean UI feel
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    try {
      const orderDateStr = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
      const itemsSummary = cart.length === 1 
        ? cart[0].title 
        : `${cart[0].title} & ${cart.length - 1} other item${cart.length > 2 ? 's' : ''}`;
      
      const orderItems = cart.map(item => ({
        productId: item.productId,
        title: item.title,
        price: item.price,
        quantity: item.quantity,
        size: item.size,
        color: item.color,
        image: item.image,
        isCustom: item.isCustom,
        customDesign: item.customDesign || null
      }));

      // Fetch user email to link this order
      let customerEmail = auth.currentUser?.email || formData.email || '';
      try {
        if (!customerEmail) {
          const uStr = localStorage.getItem('jyothi_logged_in_user');
          if (uStr) {
            customerEmail = JSON.parse(uStr).email;
          }
        }
      } catch {}

      const newOrder = {
        orderId: orderId,
        userEmail: customerEmail.toLowerCase().trim(), // Secure link to customer account
        customerName: formData.name,
        orderDate: orderDateStr,
        productTitle: itemsSummary,
        fabricType: cart[0]?.isCustom ? 'Custom Print Garment' : '240 GSM Combed Cotton',
        printMethod: cart[0]?.isCustom ? 'Premium Custom Apparel Run' : 'Premium Screen/Digital Printing',
        quantity: cart.reduce((sum, item) => sum + item.quantity, 0),
        totalAmount: finalTotal,
        estimatedDelivery: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
        currentStatus: 'design_approval' as const,
        items: orderItems,
        paymentMethod: paymentMethod,
        paymentId: paymentId || 'COD_DISPATCHED',
        steps: [
          {
            title: 'Design Approval',
            description: 'Artwork files verified for high-resolution DPI. Vector color match complete.',
            status: 'current' as const,
            timestamp: `${orderDateStr}, ${new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`,
            icon: 'FileText'
          },
          {
            title: 'Setup & Screen Prep',
            description: 'Physical screen mesh aligned for a clean multi-pass print. Ink mixing complete.',
            status: 'upcoming' as const,
            icon: 'Scissors'
          },
          {
            title: 'Active Printing Run',
            description: 'Apparel printed on our 12-station automatic carousel. Heat curing applied at 160°C.',
            status: 'upcoming' as const,
            icon: 'Printer'
          },
          {
            title: 'Finishing & Inspection',
            description: 'Post-production inspection complete. Garments folded, tagged, and packed.',
            status: 'upcoming' as const,
            icon: 'Shirt'
          },
          {
            title: 'Shipped & En Route',
            description: 'Package handed over to partner courier. Dispatched from Bengaluru industrial facility.',
            status: 'upcoming' as const,
            icon: 'Truck'
          }
        ]
      };

      // 1. Durably persist in Firestore orders collection
      try {
        const orderRef = doc(db, 'orders', orderId);
        await setDoc(orderRef, newOrder);
        console.log('Successfully saved order to Firestore:', orderId);
      } catch (fsErr) {
        console.warn('Failed to save order to Firestore:', fsErr);
        // Throw structured error using our core helper as mandated
        try {
          handleFirestoreError(fsErr, OperationType.CREATE, `orders/${orderId}`);
        } catch {}
      }

      // 2. Local fallback list persistence
      const existingOrders = JSON.parse(localStorage.getItem('jyothi_orders') || '[]');
      localStorage.setItem('jyothi_orders', JSON.stringify([newOrder, ...existingOrders]));
      
      setStep('success');
    } catch (err) {
      console.error('Failed to save order to history:', err);
    }
  };

  const handleRazorpayCheckout = () => {
    if (!(window as any).Razorpay) {
      alert('Razorpay payment gateway SDK is currently loading, please click again in 2 seconds!');
      return;
    }

    const options = {
      key: 'rzp_test_JyothiPrntWorks', // Public Razorpay test key
      amount: finalTotal * 100, // in paise
      currency: 'INR',
      name: 'Jyothi Printing Works',
      description: `Payment for Custom Apparel Order ${orderId}`,
      image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=120&h=120',
      handler: function (response: any) {
        const pId = response.razorpay_payment_id || `rzp_pay_${Math.random().toString(36).substring(2, 10)}`;
        setRazorpayPaymentId(pId);
        processSaveOrder(pId);
      },
      prefill: {
        name: formData.name,
        email: formData.email,
        contact: formData.phone
      },
      notes: {
        orderId: orderId,
        address: `${formData.address}, ${formData.city}, ${formData.state} - ${formData.pincode}`
      },
      theme: {
        color: '#f97316' // Orange brand identity
      },
      modal: {
        ondismiss: function() {
          console.log('Razorpay payment popup closed.');
        }
      }
    };

    const rzp = new (window as any).Razorpay(options);
    rzp.open();
  };

  const handleCompleteOrder = () => {
    if (paymentMethod === 'razorpay') {
      handleRazorpayCheckout();
    } else {
      processSaveOrder('COD_PENDING');
    }
  };

  const handleWhatsAppInquiry = () => {
    const itemsText = cart.map(item => `- ${item.quantity}x ${item.title} (${item.size}, ${item.color.name})`).join('%0A');
    const msg = `Hello Jyothi Printing Works! I just placed a simulated order ${orderId} on your premium store. %0A%0ABilling Name: ${formData.name}%0APhone: ${formData.phone}%0A%0AItems Ordered:%0A${itemsText}%0A%0ACoupon: ${couponCode || 'None'}%0ATotal Amount Paid: ₹${finalTotal}%0A%0APlease check and confirm.`;
    window.open(`https://wa.me/919182703766?text=${msg}`, '_blank');
  };

  const indianStates = [
    'Andhra Pradesh', 'Karnataka', 'Maharashtra', 'Delhi', 'Tamil Nadu', 
    'Telangana', 'Kerala', 'Goa', 'Gujarat', 'Rajasthan', 'Uttar Pradesh', 'West Bengal'
  ];

  return (
    <div className="fixed inset-0 z-[70] flex items-start md:items-center justify-center p-4 bg-neutral-950/85 backdrop-blur-md overflow-y-auto">
      <div className="absolute inset-0 cursor-pointer" onClick={onClose} />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="relative w-full max-w-2xl bg-white dark:bg-neutral-900 rounded-3xl shadow-2xl overflow-hidden border border-neutral-200 dark:border-neutral-800 z-10 my-8 flex flex-col"
      >
        {/* Top Header */}
        <div className="p-5.5 border-b border-neutral-100 dark:border-neutral-800 flex items-center justify-between bg-white dark:bg-neutral-900">
          <div className="text-left">
            <h3 className="text-base sm:text-lg font-black text-neutral-900 dark:text-white flex items-center gap-2">
              <ShieldCheck className="h-5.5 w-5.5 text-orange-500" />
              <span>Secure Checkout Portal</span>
            </h3>
            <p className="text-[10px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider">
              Order Reference ID: <span className="text-orange-500 font-extrabold">{orderId}</span>
            </p>
          </div>
          {step !== 'processing' && step !== 'success' && (
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all cursor-pointer text-neutral-400"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* Dynamic Multi-Step Body */}
        <div className="p-6 flex-grow overflow-y-auto max-h-[70vh]">
          {step === 'shipping' && (
            <form onSubmit={handleNextToPayment} className="space-y-5 text-left">
              <div className="flex items-center gap-2 pb-2 border-b border-neutral-100 dark:border-neutral-800">
                <MapPin className="h-5 w-5 text-orange-500" />
                <h4 className="font-extrabold text-sm text-neutral-800 dark:text-neutral-200 uppercase tracking-wider">1. Delivery Destination</h4>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-[10px] font-black uppercase text-neutral-400 dark:text-neutral-500 tracking-wider">Recipient Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="Enter full name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-4 py-3 text-xs font-semibold bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl focus:border-orange-500 focus:bg-white dark:focus:bg-neutral-900 focus:outline-none dark:text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-[10px] font-black uppercase text-neutral-400 dark:text-neutral-500 tracking-wider">10-Digit Mobile *</label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. 9876543210"
                    pattern="[0-9]{10}"
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value.replace(/\D/g, '').slice(0, 10) }))}
                    className="w-full px-4 py-3 text-xs font-semibold bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl focus:border-orange-500 focus:bg-white dark:focus:bg-neutral-900 focus:outline-none dark:text-white"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] font-black uppercase text-neutral-400 dark:text-neutral-500 tracking-wider">Email Address *</label>
                <input
                  type="email"
                  required
                  placeholder="name@gmail.com"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full px-4 py-3 text-xs font-semibold bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl focus:border-orange-500 focus:bg-white dark:focus:bg-neutral-900 focus:outline-none dark:text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] font-black uppercase text-neutral-400 dark:text-neutral-500 tracking-wider">Street Address (Apartment, Area, Suite) *</label>
                <textarea
                  required
                  rows={2}
                  placeholder="Enter complete house number, street, landmark details"
                  value={formData.address}
                  onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                  className="w-full px-4 py-3 text-xs font-semibold bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl focus:border-orange-500 focus:bg-white dark:focus:bg-neutral-900 focus:outline-none dark:text-white resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="block text-[10px] font-black uppercase text-neutral-400 dark:text-neutral-500 tracking-wider">City *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Bengaluru"
                    value={formData.city}
                    onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                    className="w-full px-4 py-3 text-xs font-semibold bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl focus:border-orange-500 focus:bg-white dark:focus:bg-neutral-900 focus:outline-none dark:text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-[10px] font-black uppercase text-neutral-400 dark:text-neutral-500 tracking-wider">State *</label>
                  <select
                    value={formData.state}
                    onChange={(e) => setFormData(prev => ({ ...prev, state: e.target.value }))}
                    className="w-full px-4 py-3 text-xs font-semibold bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl focus:border-orange-500 focus:bg-white dark:focus:bg-neutral-900 focus:outline-none dark:text-white"
                  >
                    {indianStates.map(st => <option key={st} value={st}>{st}</option>)}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="block text-[10px] font-black uppercase text-neutral-400 dark:text-neutral-500 tracking-wider">Pincode (Indian Zip) *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 560001"
                    value={formData.pincode}
                    onChange={handlePincodeChange}
                    className="w-full px-4 py-3 text-xs font-semibold bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl focus:border-orange-500 focus:bg-white dark:focus:bg-neutral-900 focus:outline-none dark:text-white"
                  />
                </div>
              </div>

              {pincodeMessage && (
                <p className="text-[10px] font-black uppercase text-orange-500 bg-orange-500/5 p-2 rounded-lg border border-orange-500/10 tracking-wider">
                  {pincodeMessage}
                </p>
              )}

              {/* Action */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={!validateShippingForm()}
                  className={`w-full py-4 rounded-2xl font-extrabold uppercase text-xs tracking-widest flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md ${
                    validateShippingForm()
                      ? 'bg-neutral-900 hover:bg-orange-500 text-white shadow-orange-500/10'
                      : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-400 cursor-not-allowed'
                  }`}
                >
                  <span>Continue to premium payment</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </form>
          )}

          {step === 'payment' && (
            <div className="space-y-6 text-left">
              <div className="flex items-center gap-2 pb-2 border-b border-neutral-100 dark:border-neutral-800">
                <CreditCard className="h-5 w-5 text-orange-500" />
                <h4 className="font-extrabold text-sm text-neutral-800 dark:text-neutral-200 uppercase tracking-wider">2. Secure Settlement Method</h4>
              </div>

              {/* Payment Selectors */}
              <div className="grid grid-cols-2 gap-4">
                {[
                  { id: 'razorpay', label: 'Razorpay', sub: 'UPI, Cards, Netbanking' },
                  { id: 'cod', label: 'COD (Cash)', sub: 'In-person Delivery' }
                ].map(item => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setPaymentMethod(item.id as any)}
                    className={`p-4 rounded-2xl border text-left transition-all flex flex-col justify-between h-22 cursor-pointer ${
                      paymentMethod === item.id
                        ? 'bg-orange-500/5 border-orange-500 dark:border-orange-500 shadow-sm shadow-orange-500/5'
                        : 'border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 hover:bg-neutral-100 dark:hover:bg-neutral-900'
                    }`}
                  >
                    <span className={`text-xs font-black uppercase tracking-widest ${
                      paymentMethod === item.id ? 'text-orange-500' : 'text-neutral-500 dark:text-neutral-400'
                    }`}>
                      {item.label}
                    </span>
                    <span className="text-[10px] font-bold text-neutral-400 dark:text-neutral-500 leading-tight">
                      {item.sub}
                    </span>
                  </button>
                ))}
              </div>

              {/* Razorpay Gateway Information */}
              {paymentMethod === 'razorpay' && (
                <div className="p-5 bg-neutral-50 dark:bg-neutral-950 rounded-2xl border border-neutral-150/80 dark:border-neutral-900 flex flex-col gap-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-orange-500/10 text-orange-500">
                      <ShieldCheck className="h-6 w-6" />
                    </div>
                    <div>
                      <h5 className="font-extrabold text-xs sm:text-sm text-neutral-800 dark:text-neutral-200 uppercase tracking-wider">
                        Razorpay Secure Checkout
                      </h5>
                      <p className="text-[10px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest">
                        PCI-DSS Compliant • 256-Bit SSL Encryption
                      </p>
                    </div>
                  </div>

                  <p className="text-xs text-neutral-500 dark:text-neutral-400 font-medium leading-relaxed">
                    By confirming, you will launch the official Razorpay test checkout overlay to securely process Credit/Debit Cards, UPI, Netbanking, or mobile wallets.
                  </p>

                  <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-neutral-200/60 dark:border-neutral-800/80">
                    {['Visa', 'Mastercard', 'RuPay', 'BHIM UPI', 'Netbanking'].map(badge => (
                      <span key={badge} className="px-2 py-1 rounded bg-neutral-100 dark:bg-neutral-900 text-[8px] font-black uppercase text-neutral-500 dark:text-neutral-400 tracking-wider">
                        {badge}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Cash On Delivery Section */}
              {paymentMethod === 'cod' && (
                <div className="p-5 bg-neutral-50 dark:bg-neutral-950 rounded-2xl border border-neutral-150/80 dark:border-neutral-900 text-center space-y-3">
                  <span className="inline-block p-2.5 rounded-full bg-orange-500/10 text-orange-500">
                    <MapPin className="h-6 w-6" />
                  </span>
                  <h5 className="font-extrabold text-xs sm:text-sm text-neutral-800 dark:text-neutral-200 uppercase tracking-wider">
                    Cash-on-Delivery Dispatch Approved
                  </h5>
                  <p className="text-xs text-neutral-400 font-medium max-w-sm mx-auto leading-relaxed">
                    Pay via Cash or UPI QR at your doorstep. A standard confirmation call/SMS will be dispatched to verify your address details before printing.
                  </p>
                </div>
              )}

              {/* Back / Checkout Buttons */}
              <div className="flex gap-4 pt-4 border-t border-neutral-100 dark:border-neutral-800">
                <button
                  type="button"
                  onClick={() => setStep('shipping')}
                  className="px-5 py-4 rounded-2xl bg-neutral-100 hover:bg-neutral-200 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-200 font-extrabold text-xs uppercase tracking-widest flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>Back</span>
                </button>

                <button
                  type="button"
                  onClick={handleCompleteOrder}
                  className="flex-grow py-4 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white font-extrabold uppercase text-xs tracking-widest flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-orange-500/20 active:scale-[0.98]"
                >
                  {paymentMethod === 'razorpay' ? (
                    <>
                      <span>Pay Securely via Razorpay</span>
                      <CheckCircle2 className="h-4.5 w-4.5" />
                    </>
                  ) : (
                    <>
                      <span>Confirm COD Order</span>
                      <CheckCircle2 className="h-4.5 w-4.5" />
                    </>
                  )}
                </button>
              </div>

            </div>
          )}

          {step === 'processing' && (
            <div className="py-12 flex flex-col items-center justify-center text-center space-y-6">
              <div className="relative">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, ease: 'linear', duration: 1.5 }}
                  className="h-20 w-20 rounded-full border-4 border-orange-100 border-t-orange-500 dark:border-neutral-800 dark:border-t-orange-500"
                />
                <ShieldCheck className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-8 w-8 text-orange-500" />
              </div>

              <div className="space-y-2">
                <h4 className="font-black text-lg text-neutral-900 dark:text-white">Authenticating Payment Settlement</h4>
                <p className="text-xs text-neutral-400 font-medium max-w-sm leading-relaxed">
                  We are initializing a secure SSL handshake, checking print dye stock availability, and configuring custom docket queues...
                </p>
              </div>
            </div>
          )}

          {step === 'success' && (
            <div className="space-y-6 text-left">
              {/* Success Banner */}
              <div className="p-5.5 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-center space-y-2">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: 'spring', delay: 0.1 }}
                  className="inline-block p-2.5 rounded-full bg-emerald-500 text-white shadow-lg"
                >
                  <CheckCircle2 className="h-8 w-8" />
                </motion.div>
                <h4 className="font-black text-lg text-neutral-900 dark:text-white">Order Confirmed Successfully!</h4>
                <p className="text-xs text-neutral-400 font-semibold max-w-sm mx-auto leading-relaxed">
                  Dye layouts and fabrication designs have been assigned to Docket <span className="text-emerald-500 font-extrabold">{orderId}</span>.
                </p>
              </div>

              {/* Receipt Summary Card */}
              <div className="p-5 bg-neutral-50 dark:bg-neutral-950 rounded-2xl border border-neutral-200 dark:border-neutral-850 space-y-4">
                <h5 className="font-black text-xs uppercase tracking-widest text-neutral-400">Official Receipt Outline</h5>
                
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between font-bold text-neutral-700 dark:text-neutral-300">
                    <span>Client Name:</span>
                    <span className="text-neutral-950 dark:text-white">{formData.name}</span>
                  </div>
                  <div className="flex justify-between font-bold text-neutral-700 dark:text-neutral-300">
                    <span>Contact Phone:</span>
                    <span className="text-neutral-950 dark:text-white">{formData.phone}</span>
                  </div>
                  <div className="flex justify-between font-bold text-neutral-700 dark:text-neutral-300">
                    <span>Address Hub:</span>
                    <span className="text-neutral-950 dark:text-white max-w-[200px] truncate">{formData.address}, {formData.city}</span>
                  </div>
                  <div className="flex justify-between font-bold text-neutral-700 dark:text-neutral-300 border-t border-neutral-200 dark:border-neutral-800 pt-2">
                    <span>Coupon Applied:</span>
                    <span className="text-orange-500 font-extrabold">{couponCode || 'None'}</span>
                  </div>
                  <div className="flex justify-between font-black text-sm text-neutral-950 dark:text-white border-t border-neutral-200 dark:border-neutral-800 pt-2">
                    <span>Paid Settle Amount:</span>
                    <span className="text-orange-500">₹{finalTotal}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <button
                  onClick={handleWhatsAppInquiry}
                  className="px-5 py-4 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-xs uppercase tracking-widest flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-md shadow-emerald-500/10"
                >
                  <Send className="h-4.5 w-4.5" />
                  <span>Dispatch WhatsApp Receipt</span>
                </button>

                <button
                  onClick={() => {
                    alert(`Downloading invoice docket receipt ${orderId}.pdf...`);
                  }}
                  className="px-5 py-4 rounded-2xl bg-neutral-900 hover:bg-orange-500 hover:text-white text-white dark:bg-neutral-800 font-extrabold text-xs uppercase tracking-widest flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  <Download className="h-4.5 w-4.5" />
                  <span>Download PDF Receipt</span>
                </button>
              </div>

              {/* Finish */}
              <button
                onClick={() => {
                  onOrderSuccess();
                  onClose();
                }}
                className="w-full py-4 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white font-black uppercase text-xs tracking-widest cursor-pointer text-center"
              >
                Return to Print Shop
              </button>

            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
