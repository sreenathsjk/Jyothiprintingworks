/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { jsPDF } from 'jspdf';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { collection, query, where, getDocs, doc, setDoc } from 'firebase/firestore';
import { 
  ShoppingBag, 
  Calendar, 
  Clock, 
  MapPin, 
  Phone, 
  CheckCircle, 
  AlertCircle, 
  Sparkles, 
  ChevronRight, 
  ArrowRight, 
  ExternalLink, 
  RefreshCw,
  PlusCircle,
  FileText,
  Scissors,
  Printer,
  Shirt,
  Truck,
  Bookmark,
  Lock,
  FileDown,
  Mail,
  Copy,
  Check,
  ShieldCheck
} from 'lucide-react';
import { User } from '../types';

interface OrderItem {
  productId: string;
  title: string;
  price: number;
  quantity: number;
  size: string;
  color: { name: string; hex: string };
  image: string;
  isCustom?: boolean;
  customDesign?: any;
}

interface OrderDetails {
  orderId: string;
  customerName: string;
  userEmail?: string;
  orderDate: string;
  productTitle: string;
  fabricType: string;
  printMethod: string;
  quantity: number;
  totalAmount: number;
  estimatedDelivery: string;
  currentStatus: 'design_approval' | 'setup_prep' | 'printing' | 'finishing' | 'shipped';
  items?: OrderItem[];
  steps?: {
    title: string;
    description: string;
    status: 'completed' | 'current' | 'upcoming';
    timestamp?: string;
    icon: string;
  }[];
}

interface MyOrdersProps {
  onTrackOrder: (orderId: string) => void;
  onNavigateToShop: () => void;
  onNavigateToCustomStudio: () => void;
  currentUser: User | null;
  onOpenAuth: () => void;
}

export default function MyOrders({ 
  onTrackOrder, 
  onNavigateToShop, 
  onNavigateToCustomStudio,
  currentUser,
  onOpenAuth
}: MyOrdersProps) {
  const [orders, setOrders] = useState<OrderDetails[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [copiedUID, setCopiedUID] = useState<boolean>(false);

  const handleDownloadPDF = (order: OrderDetails) => {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    // Color constants (brand colors)
    // Deep charcoal/black: rgb(17, 17, 17)
    // Accent orange: rgb(249, 115, 22)
    // Secondary gray: rgb(107, 114, 128)
    // Light gray: rgb(243, 244, 246)

    // Title block
    doc.setFillColor(17, 17, 17);
    doc.rect(0, 0, 210, 40, 'F');

    // Brand Name Header
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(20);
    doc.text('JYOTHI PRINT STUDIO', 15, 18);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(200, 200, 200);
    doc.text('Premium Custom Apparel & Handcrafted Screen Printing', 15, 24);
    doc.text('Bengaluru, Karnataka, India | support@jyothiprint.studio', 15, 29);

    // Invoice Label right aligned
    doc.setTextColor(249, 115, 22); // Accent color
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.text('ORDER SUMMARY', 195, 18, { align: 'right' });

    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.text(`Docket: ${order.orderId}`, 195, 24, { align: 'right' });
    doc.text(`Date: ${order.orderDate}`, 195, 29, { align: 'right' });

    // Main body structure
    let y = 50;

    // Customer & Delivery Information Cards
    doc.setFillColor(248, 250, 252); // Soft gray
    doc.roundedRect(15, y, 85, 35, 3, 3, 'F');
    doc.roundedRect(110, y, 85, 35, 3, 3, 'F');

    // Customer Info
    doc.setTextColor(17, 17, 17);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.text('CUSTOMER DETAILS', 20, y + 8);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(75, 85, 99);
    doc.text(`Name: ${order.customerName}`, 20, y + 15);
    doc.text(`Email: ${order.userEmail || currentUser?.email || 'N/A'}`, 20, y + 21);
    doc.text(`Payment Status: Verified Pre-paid`, 20, y + 27);

    // Order Info
    doc.setTextColor(17, 17, 17);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.text('FULFILLMENT LOGS', 115, y + 8);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(75, 85, 99);
    doc.text(`Current Tracker State: ${order.currentStatus.toUpperCase().replace('_', ' ')}`, 115, y + 15);
    doc.text(`Estimated Delivery SLA: ${order.estimatedDelivery}`, 115, y + 21);
    doc.text('Origin Facility: Jyothi Bengaluru Hub', 115, y + 27);

    y += 45;

    // Stencil & Fabric Specs banner
    doc.setFillColor(254, 243, 199); // light amber
    doc.setDrawColor(245, 158, 11); // amber border
    doc.roundedRect(15, y, 180, 15, 2, 2, 'FD');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(146, 64, 14); // deep amber
    doc.text('FABRIC & PRINTING METHOD SPECS:', 20, y + 9);
    doc.setFont('helvetica', 'normal');
    doc.text(`${order.fabricType}  |  ${order.printMethod}`, 82, y + 9);

    y += 24;

    // Items table header
    doc.setFillColor(17, 17, 17);
    doc.rect(15, y, 180, 8, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(255, 255, 255);
    doc.text('PARTICULARS / ITEMS', 20, y + 5.5);
    doc.text('SIZE', 110, y + 5.5, { align: 'center' });
    doc.text('COLOR', 135, y + 5.5, { align: 'center' });
    doc.text('QTY', 160, y + 5.5, { align: 'center' });
    doc.text('AMOUNT', 190, y + 5.5, { align: 'right' });

    y += 8;

    // Print items
    let subtotal = 0;
    if (order.items && order.items.length > 0) {
      order.items.forEach((item, index) => {
        // Background shading for alternating rows
        if (index % 2 === 0) {
          doc.setFillColor(249, 250, 251);
          doc.rect(15, y, 180, 10, 'F');
        }

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8.5);
        doc.setTextColor(17, 17, 17);
        // Clean display of item title, truncating if too long
        const displayTitle = item.title.length > 42 ? item.title.substring(0, 40) + '...' : item.title;
        doc.text(displayTitle, 20, y + 6.5);

        doc.setFont('helvetica', 'normal');
        doc.setTextColor(75, 85, 99);
        doc.text(item.size, 110, y + 6.5, { align: 'center' });
        doc.text(item.color.name, 135, y + 6.5, { align: 'center' });
        doc.text(String(item.quantity), 160, y + 6.5, { align: 'center' });
        
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(17, 17, 17);
        doc.text(`INR ${item.price * item.quantity}`, 190, y + 6.5, { align: 'right' });

        subtotal += item.price * item.quantity;
        y += 10;
      });
    } else {
      // Fallback row if no items array
      doc.setFillColor(249, 250, 251);
      doc.rect(15, y, 180, 12, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor(17, 17, 17);
      doc.text(order.productTitle, 20, y + 7.5);
      doc.setFont('helvetica', 'normal');
      doc.text('Custom Specs', 110, y + 7.5, { align: 'center' });
      doc.text('As Specified', 135, y + 7.5, { align: 'center' });
      doc.text(String(order.quantity), 160, y + 7.5, { align: 'center' });
      doc.text(`INR ${order.totalAmount}`, 190, y + 7.5, { align: 'right' });
      
      subtotal = order.totalAmount;
      y += 12;
    }

    // Draw table bottom border line
    doc.setDrawColor(229, 231, 235);
    doc.line(15, y, 195, y);

    y += 6;

    // Summary and total section
    const summaryX = 130;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(107, 114, 128);
    doc.text('Subtotal:', summaryX, y);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(17, 17, 17);
    doc.text(`INR ${subtotal}`, 190, y, { align: 'right' });

    y += 5;
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(107, 114, 128);
    doc.text('Shipping (Expedited):', summaryX, y);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(17, 17, 17);
    doc.text('FREE', 190, y, { align: 'right' });

    y += 6;
    // Double line before total
    doc.setLineWidth(0.3);
    doc.setDrawColor(17, 17, 17);
    doc.line(summaryX - 5, y - 2, 195, y - 2);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(249, 115, 22); // brand orange accent
    doc.text('Grand Paid Total:', summaryX, y + 3);
    doc.setTextColor(17, 17, 17);
    doc.setFontSize(11);
    doc.text(`INR ${order.totalAmount}`, 190, y + 3, { align: 'right' });

    y += 20;

    // Help & contact banner
    doc.setFillColor(243, 244, 246);
    doc.roundedRect(15, y, 180, 20, 2, 2, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(17, 17, 17);
    doc.text('HAVE QUESTIONS ABOUT YOUR PRINT ORDER?', 20, y + 7);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(75, 85, 99);
    doc.text('Please quote your Docket Reference when contacting our support desk. All custom stencils are held for 14 days.', 20, y + 13);

    // Footer seal / branding mark
    doc.setFont('helvetica', 'bolditalic');
    doc.setFontSize(8.5);
    doc.setTextColor(156, 163, 175);
    doc.text('Thank you for choosing Jyothi Print Studio.', 105, 275, { align: 'center' });
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.text('This is a verified digital transaction receipt. Handcrafted with passion.', 105, 280, { align: 'center' });

    // Save the document
    doc.save(`Jyothi_Order_Summary_${order.orderId}.pdf`);
  };

  // Load orders from Firestore (primary) and localStorage (secondary fallback)
  const loadOrders = async () => {
    if (!currentUser) {
      setOrders([]);
      return;
    }
    
    setIsLoading(true);
    const userEmail = currentUser.email.toLowerCase().trim();
    
    try {
      // 1. Fetch from Firestore
      const ordersRef = collection(db, 'orders');
      const q = query(ordersRef, where('userEmail', '==', userEmail));
      const querySnapshot = await getDocs(q);
      
      const firestoreOrders: OrderDetails[] = [];
      querySnapshot.forEach((docSnap) => {
        firestoreOrders.push(docSnap.data() as OrderDetails);
      });
      
      // Sort orders by orderId/date descending
      firestoreOrders.sort((a, b) => b.orderId.localeCompare(a.orderId));
      
      // 2. Local fallback list persistence overlay to merge any local-only draft/offline orders
      const saved = localStorage.getItem('jyothi_orders');
      let mergedOrders = [...firestoreOrders];
      
      if (saved) {
        const localOrders = JSON.parse(saved);
        const filteredLocal = localOrders.filter((order: any) => 
          order.userEmail && order.userEmail.toLowerCase().trim() === userEmail &&
          !firestoreOrders.some(fo => fo.orderId === order.orderId)
        );
        mergedOrders = [...mergedOrders, ...filteredLocal];
        mergedOrders.sort((a, b) => b.orderId.localeCompare(a.orderId));
      }
      
      setOrders(mergedOrders);
    } catch (err) {
      console.warn('Failed to load orders from Firestore, using local fallback:', err);
      // Fallback to local storage entirely
      try {
        const saved = localStorage.getItem('jyothi_orders');
        if (saved) {
          const allOrders = JSON.parse(saved);
          const filtered = allOrders.filter((order: any) => 
            order.userEmail && order.userEmail.toLowerCase().trim() === userEmail
          );
          setOrders(filtered);
        } else {
          setOrders([]);
        }
      } catch (localErr) {
        console.error('Failed to parse local fallback orders:', localErr);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
    // Watch for custom event or storage change
    const triggerLocalLoad = () => { loadOrders(); };
    window.addEventListener('storage', triggerLocalLoad);
    return () => window.removeEventListener('storage', triggerLocalLoad);
  }, [currentUser]);

  // Generate a premium sample/demo order for testing
  const handleGenerateSampleOrder = async () => {
    const num = Math.floor(100000 + Math.random() * 900000);
    const orderId = `JPW-2026-${num}`;
    const orderDateStr = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    
    const sampleItems: OrderItem[] = [
      {
        productId: 'prod-street-1',
        title: 'Heavyweight Custom Streetwear Graphic Tee',
        price: 599,
        quantity: 2,
        size: 'L',
        color: { name: 'Cosmic Charcoal', hex: '#262626' },
        image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&q=80&w=300',
        isCustom: false
      },
      {
        productId: 'prod-hoodie-2',
        title: 'Premium Fleece Over-dyed Pullover Hoodie',
        price: 1199,
        quantity: 1,
        size: 'XL',
        color: { name: 'Acid Green Accent', hex: '#84cc16' },
        image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80&w=300',
        isCustom: false
      }
    ];

    const sampleOrder: OrderDetails = {
      orderId: orderId,
      customerName: currentUser?.name || 'Valued Client (Demo)',
      userEmail: currentUser?.email?.toLowerCase().trim(),
      orderDate: orderDateStr,
      productTitle: 'Heavyweight Custom Streetwear Graphic Tee & 1 other item',
      fabricType: '240 GSM Combed Cotton',
      printMethod: 'Premium Multi-Color Screen Printing',
      quantity: 3,
      totalAmount: 2397,
      estimatedDelivery: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      currentStatus: 'setup_prep',
      items: sampleItems,
      steps: [
        {
          title: 'Design Approval',
          description: 'Artwork files verified for high-resolution DPI. Vector color match complete.',
          status: 'completed',
          timestamp: `${orderDateStr}, 11:30 AM`,
          icon: 'FileText'
        },
        {
          title: 'Setup & Screen Prep',
          description: 'Physical screen mesh aligned for a clean multi-pass print. Ink mixing complete.',
          status: 'current',
          timestamp: `${orderDateStr}, 02:15 PM`,
          icon: 'Scissors'
        },
        {
          title: 'Active Printing Run',
          description: 'Apparel printed on our 12-station automatic carousel. Heat curing applied at 160°C.',
          status: 'upcoming',
          icon: 'Printer'
        },
        {
          title: 'Finishing & Inspection',
          description: 'Post-production inspection complete. Garments folded, tagged, and packed.',
          status: 'upcoming',
          icon: 'Shirt'
        },
        {
          title: 'Shipped & En Route',
          description: 'Package handed over to partner courier. Dispatched from Bengaluru industrial facility.',
          status: 'upcoming',
          icon: 'Truck'
        }
      ]
    };

    // 1. Sync to Firestore
    try {
      const orderRef = doc(db, 'orders', orderId);
      await setDoc(orderRef, sampleOrder);
      console.log('Sample order synced to Firestore:', orderId);
    } catch (fsErr) {
      console.warn('Could not sync sample order to Firestore:', fsErr);
      try {
        handleFirestoreError(fsErr, OperationType.CREATE, `orders/${orderId}`);
      } catch {}
    }

    // 2. Update local storage and UI
    try {
      const existing = JSON.parse(localStorage.getItem('jyothi_orders') || '[]');
      const updated = [sampleOrder, ...existing];
      localStorage.setItem('jyothi_orders', JSON.stringify(updated));
      setOrders(prev => [sampleOrder, ...prev]);
    } catch (err) {
      console.error('Failed to create sample order locally:', err);
    }
  };

  const handleClearHistory = () => {
    if (confirm('Are you sure you want to clear your local purchase history? This will only remove history from this browser cache.')) {
      try {
        localStorage.removeItem('jyothi_orders');
        setOrders([]);
      } catch (err) {
        console.error('Failed to clear order history:', err);
      }
    }
  };

  const getStatusBadge = (status: OrderDetails['currentStatus']) => {
    const mappings = {
      design_approval: { 
        label: 'Processing', 
        bg: 'bg-indigo-50/80 dark:bg-indigo-950/30', 
        text: 'text-indigo-700 dark:text-indigo-400', 
        border: 'border-indigo-100 dark:border-indigo-900/40',
        icon: <Clock className="h-3.5 w-3.5 text-indigo-500 dark:text-indigo-400 shrink-0" />
      },
      setup_prep: { 
        label: 'In Production', 
        bg: 'bg-amber-50/80 dark:bg-amber-950/30', 
        text: 'text-amber-700 dark:text-amber-400', 
        border: 'border-amber-100 dark:border-amber-900/40',
        icon: <Scissors className="h-3.5 w-3.5 text-amber-500 dark:text-amber-400 shrink-0" />
      },
      printing: { 
        label: 'In Production', 
        bg: 'bg-orange-50/80 dark:bg-orange-950/30 animate-pulse', 
        text: 'text-orange-700 dark:text-orange-400', 
        border: 'border-orange-100 dark:border-orange-900/40',
        icon: <Printer className="h-3.5 w-3.5 text-orange-500 dark:text-orange-400 shrink-0 animate-bounce" style={{ animationDuration: '3s' }} />
      },
      finishing: { 
        label: 'Quality Check', 
        bg: 'bg-sky-50/80 dark:bg-sky-950/30', 
        text: 'text-sky-700 dark:text-sky-400', 
        border: 'border-sky-100 dark:border-sky-900/40',
        icon: <CheckCircle className="h-3.5 w-3.5 text-sky-500 dark:text-sky-400 shrink-0" />
      },
      shipped: { 
        label: 'Shipped', 
        bg: 'bg-emerald-50/80 dark:bg-emerald-950/30', 
        text: 'text-emerald-700 dark:text-emerald-400', 
        border: 'border-emerald-100 dark:border-emerald-900/40',
        icon: <Truck className="h-3.5 w-3.5 text-emerald-500 dark:text-emerald-400 shrink-0" />
      }
    };

    const choice = mappings[status] || { 
      label: 'Processing', 
      bg: 'bg-neutral-50/80 dark:bg-neutral-900/50', 
      text: 'text-neutral-700 dark:text-neutral-400', 
      border: 'border-neutral-200 dark:border-neutral-800',
      icon: <Clock className="h-3.5 w-3.5 text-neutral-500 dark:text-neutral-400 shrink-0" /> 
    };

    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider border shadow-sm ${choice.bg} ${choice.text} ${choice.border}`}>
        {choice.icon}
        <span>{choice.label}</span>
      </span>
    );
  };

  const getStepProgressWidth = (status: OrderDetails['currentStatus']) => {
    switch (status) {
      case 'design_approval': return 'w-1/5';
      case 'setup_prep': return 'w-2/5';
      case 'printing': return 'w-3/5';
      case 'finishing': return 'w-4/5';
      case 'shipped': return 'w-full';
      default: return 'w-0';
    }
  };

  if (!currentUser) {
    return (
      <div id="my-orders-page" className="w-full bg-neutral-50 dark:bg-neutral-950 min-h-screen text-neutral-900 dark:text-neutral-100 pt-32 pb-16">
        <div className="max-w-md mx-auto px-4 text-center">
          <div className="bg-white dark:bg-neutral-900 rounded-3xl p-8 sm:p-12 border border-neutral-200/60 dark:border-neutral-800 shadow-xl space-y-6">
            <div className="h-20 w-20 rounded-full bg-orange-500/10 flex items-center justify-center mx-auto border border-orange-500/20">
              <Lock className="h-9 w-9 text-orange-500 animate-pulse" />
            </div>

            <div className="space-y-2">
              <h3 className="font-black text-xl text-neutral-900 dark:text-white uppercase tracking-wide">
                Secure Lounge Access
              </h3>
              <p className="text-xs text-neutral-400 dark:text-neutral-500 font-bold leading-relaxed">
                Only signed-in customers can view custom garment print history, screen stencil states, and delivery status logs.
              </p>
            </div>

            <div className="pt-4">
              <button
                type="button"
                onClick={onOpenAuth}
                className="w-full py-4 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white font-black uppercase text-xs tracking-widest transition-all cursor-pointer shadow-lg shadow-orange-500/20 active:scale-95"
              >
                Sign In / Sign Up
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div id="my-orders-page" className="w-full bg-neutral-50 dark:bg-neutral-950 min-h-screen text-neutral-900 dark:text-neutral-100 pt-28 pb-16">
      
      {/* Banner Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-10">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-100 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400 text-[10px] font-black tracking-widest uppercase mb-3">
          <Lock className="h-3.5 w-3.5" />
          Secure Customer Account
        </span>
        <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-none uppercase text-neutral-900 dark:text-white mb-4">
          My <span className="text-orange-500">Account</span> Dashboard
        </h1>
        <p className="text-sm text-neutral-500 dark:text-neutral-400 max-w-xl mx-auto font-medium leading-relaxed">
          Manage your verified customer profile, view digital purchase history, and track custom screenprint stencils in real-time.
        </p>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Beautifully polished profile panel in a luxurious, clean slate frame */}
        <div className="bg-slate-50 dark:bg-slate-900/90 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl p-8 sm:p-10 mb-10 text-left relative overflow-hidden animate-fade-in ring-1 ring-slate-100/50 dark:ring-slate-800/40">
          {/* Decorative elegant background grid line or circle */}
          <div className="absolute right-0 top-0 -mt-8 -mr-8 w-48 h-48 bg-slate-400/10 dark:bg-slate-500/5 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute left-0 bottom-0 w-36 h-36 bg-orange-500/5 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 pb-8 border-b border-slate-200/60 dark:border-slate-800/60">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              {/* Profile Avatar / Emblem */}
              <div className="relative shrink-0 group">
                <div className="h-20 w-20 rounded-2xl bg-gradient-to-tr from-slate-800 to-slate-950 dark:from-slate-700 dark:to-slate-900 flex items-center justify-center text-white font-black text-3xl uppercase tracking-wider shadow-lg shadow-slate-950/20 ring-4 ring-white dark:ring-slate-800 transition-transform duration-300 group-hover:scale-105">
                  {currentUser.name ? currentUser.name.split(' ').map(n => n[0]).join('').slice(0, 2) : 'C'}
                </div>
                <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-white p-1.5 rounded-xl shadow-md border-2 border-white dark:border-slate-900" title="Verified Secure Profile">
                  <ShieldCheck className="h-4 w-4" />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-3 flex-wrap">
                  <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight uppercase flex items-center gap-2">
                    {currentUser.name}
                  </h2>
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300/40 dark:border-slate-700/60">
                    <ShieldCheck className="h-3 w-3 text-emerald-500" />
                    Verified Customer
                  </span>
                </div>
                
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                  Welcome to your secure print & apparel gateway. Your authenticated account is actively connected.
                </p>
              </div>
            </div>

            {currentUser.email === 'content2u.sj@gmail.com' && (
              <span className="self-start lg:self-center px-4 py-2 rounded-2xl bg-orange-100 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400 text-xs font-black uppercase tracking-widest border border-orange-200 dark:border-orange-850 animate-pulse shrink-0">
                System Administrator
              </span>
            )}
          </div>

          {/* Grid of Profile Metadata Fields */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8">
            
            {/* Secure Email Field */}
            <div className="bg-white/60 dark:bg-slate-950/40 rounded-2xl border border-slate-200/50 dark:border-slate-800/80 p-5 flex items-start gap-4 hover:bg-white dark:hover:bg-slate-950/60 transition-all duration-200">
              <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-900 text-slate-500 dark:text-slate-400 shrink-0">
                <Mail className="h-5 w-5" />
              </div>
              <div className="space-y-1 min-w-0">
                <span className="block text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">Secure Email</span>
                <span className="text-sm font-bold text-slate-800 dark:text-slate-200 truncate block select-all" title={currentUser.email}>
                  {currentUser.email}
                </span>
              </div>
            </div>

            {/* Contact Telephone Field */}
            <div className="bg-white/60 dark:bg-slate-950/40 rounded-2xl border border-slate-200/50 dark:border-slate-800/80 p-5 flex items-start gap-4 hover:bg-white dark:hover:bg-slate-950/60 transition-all duration-200">
              <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-900 text-slate-500 dark:text-slate-400 shrink-0">
                <Phone className="h-5 w-5" />
              </div>
              <div className="space-y-1 min-w-0">
                <span className="block text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">Contact Number</span>
                <span className="text-sm font-bold text-slate-800 dark:text-slate-200 block truncate">
                  {currentUser.phone || 'Not Provided'}
                </span>
              </div>
            </div>

            {/* Unique Firestore Account UID Field */}
            <div className="bg-white/60 dark:bg-slate-950/40 rounded-2xl border border-slate-200/50 dark:border-slate-800/80 p-5 flex items-start gap-4 hover:bg-white dark:hover:bg-slate-950/60 transition-all duration-200 relative group/uid">
              <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-900 text-slate-500 dark:text-slate-400 shrink-0">
                <Lock className="h-5 w-5" />
              </div>
              <div className="space-y-1 min-w-0 w-full pr-8">
                <span className="block text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">Firestore Account UID</span>
                <span className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400 block truncate" title={currentUser.id}>
                  {currentUser.id}
                </span>
              </div>
              
              {/* Copy Button */}
              <button
                onClick={() => {
                  navigator.clipboard.writeText(currentUser.id || '');
                  setCopiedUID(true);
                  setTimeout(() => setCopiedUID(false), 2000);
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer"
                title="Copy Firestore UID to Clipboard"
              >
                {copiedUID ? (
                  <Check className="h-4 w-4 text-emerald-500" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </button>
            </div>

          </div>
        </div>

        {orders.length > 0 ? (
          <div className="space-y-8">
            
            {/* Header controls */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-neutral-400">
                Found {orders.length} custom purchase{orders.length > 1 ? 's' : ''}
              </span>
              <button 
                onClick={handleClearHistory}
                className="text-xs font-black uppercase tracking-wider text-red-500 hover:text-red-600 dark:hover:text-red-400 transition-colors flex items-center gap-1 cursor-pointer"
              >
                Clear History
              </button>
            </div>

            {/* Orders List */}
            {orders.map((order) => {
              const itemsCount = order.items?.reduce((sum, i) => sum + i.quantity, 0) || order.quantity;
              
              return (
                <div 
                  key={order.orderId}
                  className="bg-white dark:bg-neutral-900 rounded-3xl border border-neutral-200/60 dark:border-neutral-800 shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden text-left"
                >
                  {/* Top Bar of the Order Card */}
                  <div className="p-6 sm:p-8 border-b border-neutral-100 dark:border-neutral-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-neutral-50/50 dark:bg-neutral-900/50">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2.5">
                        <span className="text-xs font-black uppercase text-neutral-400 tracking-wider">Docket Reference</span>
                        <span className="px-2 py-0.5 rounded bg-orange-100 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400 text-[10px] font-black uppercase tracking-widest">
                          Simulated
                        </span>
                      </div>
                      <h3 className="text-lg font-black text-neutral-900 dark:text-white flex items-center gap-1.5">
                        {order.orderId}
                      </h3>
                    </div>

                    <div className="flex flex-wrap items-center gap-2.5">
                      {getStatusBadge(order.currentStatus)}
                    </div>
                  </div>

                  {/* Body details */}
                  <div className="p-6 sm:p-8 space-y-6">
                    {/* Items Purchased List */}
                    {order.items && order.items.length > 0 ? (
                      <div className="space-y-4">
                        <h4 className="text-[10px] font-black uppercase tracking-wider text-neutral-400">Apparel Specs & Dye Lots</h4>
                        
                        <div className="grid grid-cols-1 gap-4">
                          {order.items.map((item, idx) => (
                            <div key={idx} className="flex gap-4 items-center">
                              <div className="h-16 w-16 rounded-xl overflow-hidden border border-neutral-200/60 dark:border-neutral-800 shrink-0">
                                <img 
                                  src={item.image} 
                                  alt={item.title} 
                                  className="h-full w-full object-cover" 
                                  referrerPolicy="no-referrer"
                                />
                              </div>
                              <div className="flex-grow space-y-1 min-w-0">
                                <h5 className="font-bold text-sm text-neutral-900 dark:text-white truncate">
                                  {item.title}
                                </h5>
                                <div className="flex flex-wrap items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400 font-semibold">
                                  <span className="flex items-center gap-1">
                                    Size: <strong className="text-neutral-800 dark:text-neutral-200">{item.size}</strong>
                                  </span>
                                  <span>•</span>
                                  <span className="flex items-center gap-1">
                                    Color: 
                                    <span 
                                      className="inline-block h-2.5 w-2.5 rounded-full border border-neutral-300"
                                      style={{ backgroundColor: item.color.hex }} 
                                    />
                                    <strong className="text-neutral-800 dark:text-neutral-200">{item.color.name}</strong>
                                  </span>
                                  <span>•</span>
                                  <span>Qty: <strong>{item.quantity}</strong></span>
                                </div>
                                {item.isCustom && item.customDesign?.printReadyFileUrl && (
                                  <div className="pt-1 flex items-center gap-1.5">
                                    <FileText className="h-3.5 w-3.5 text-orange-500 shrink-0" />
                                    <span className="text-[10px] font-bold text-neutral-400">Artwork:</span>
                                    <a
                                      href={item.customDesign.printReadyFileUrl}
                                      target="_blank"
                                      rel="noreferrer"
                                      className="text-[10px] font-extrabold text-orange-500 hover:text-orange-600 hover:underline flex items-center gap-0.5 truncate max-w-[180px] cursor-pointer"
                                      title="Download Print-Ready Artwork"
                                    >
                                      <span className="truncate">{item.customDesign.printReadyFileName || 'Uploaded Design'}</span>
                                      <ExternalLink className="h-2.5 w-2.5 shrink-0" />
                                    </a>
                                  </div>
                                )}
                              </div>
                              <div className="text-right shrink-0">
                                <span className="text-sm font-black text-neutral-900 dark:text-white">
                                  ₹{item.price * item.quantity}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      // Fallback visual row if custom items array isn't populated
                      <div className="flex items-start gap-3 p-4 bg-neutral-50 dark:bg-neutral-800/30 rounded-2xl border border-neutral-100 dark:border-neutral-800">
                        <Shirt className="h-5 w-5 text-orange-500 mt-0.5 shrink-0" />
                        <div>
                          <h4 className="font-extrabold text-sm text-neutral-800 dark:text-neutral-200">
                            {order.productTitle}
                          </h4>
                          <p className="text-xs text-neutral-400 font-semibold mt-0.5">
                            Fabric: {order.fabricType} — Print: {order.printMethod}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Simple stepper indicator row inside card */}
                    <div className="space-y-2 pt-4 border-t border-neutral-150/60 dark:border-neutral-800">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-extrabold text-neutral-400 uppercase tracking-wider">Workflow Tracker</span>
                        <span className="font-bold text-neutral-500 dark:text-neutral-400">
                          Estimated Delivery: <strong className="text-orange-500 dark:text-orange-400">{order.estimatedDelivery}</strong>
                        </span>
                      </div>

                      {/* Bar stepper */}
                      <div className="relative h-2 w-full bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
                        <div className={`absolute left-0 top-0 bottom-0 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full ${getStepProgressWidth(order.currentStatus)} transition-all duration-500`} />
                      </div>

                      {/* Small steps labels */}
                      <div className="grid grid-cols-5 text-[9px] font-black uppercase text-center text-neutral-400 tracking-wider">
                        <span className={order.currentStatus === 'design_approval' ? 'text-indigo-500 dark:text-indigo-400 font-extrabold' : ''}>Processing</span>
                        <span className={order.currentStatus === 'setup_prep' ? 'text-amber-500 dark:text-amber-400 font-extrabold' : ''}>Prep</span>
                        <span className={order.currentStatus === 'printing' ? 'text-orange-500 dark:text-orange-400 font-extrabold' : ''}>Printing</span>
                        <span className={order.currentStatus === 'finishing' ? 'text-sky-500 dark:text-sky-400 font-extrabold' : ''}>Quality Check</span>
                        <span className={order.currentStatus === 'shipped' ? 'text-emerald-500 dark:text-emerald-400 font-extrabold' : ''}>Shipped</span>
                      </div>
                    </div>

                    {/* Bottom Details & Navigation Buttons */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-neutral-100 dark:border-neutral-800 text-xs">
                      <div className="flex flex-wrap items-center gap-4 text-neutral-500 dark:text-neutral-400 font-semibold">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4 text-neutral-400" />
                          Ordered: <strong className="text-neutral-800 dark:text-neutral-200">{order.orderDate}</strong>
                        </span>
                        <span className="flex items-center gap-1">
                          Items Count: <strong className="text-neutral-800 dark:text-neutral-200">{itemsCount} Units</strong>
                        </span>
                        <span className="text-sm font-black text-neutral-900 dark:text-white flex items-center gap-1 bg-orange-500/5 px-2.5 py-1 rounded-lg border border-orange-500/10">
                          Paid Total: <strong className="text-orange-500">₹{order.totalAmount}</strong>
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleDownloadPDF(order)}
                          className="px-4 py-2.5 rounded-xl bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-200 font-black uppercase text-[10px] tracking-wider flex items-center gap-1.5 transition-all border border-neutral-200/50 dark:border-neutral-700 cursor-pointer active:scale-95"
                          title="Download PDF Order Summary"
                        >
                          <span>PDF Summary</span>
                          <FileDown className="h-3.5 w-3.5 text-neutral-500" />
                        </button>

                        <button
                          onClick={() => onTrackOrder(order.orderId)}
                          className="px-4 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-black uppercase text-[10px] tracking-wider flex items-center gap-1 transition-all shadow-md shadow-orange-500/10 cursor-pointer active:scale-95"
                        >
                          <span>Track Live Status</span>
                          <ExternalLink className="h-3.5 w-3.5" />
                        </button>
                        
                        <a
                          href={`https://wa.me/919182703766?text=Hello%20Jyothi%2520Printing%2520Works!%2520I'm%2520inquiring%2520about%252520my%25252520simulated%25252520order%25252520${order.orderId}%25252520placed%25252520on%25252520${order.orderDate}.`}
                          target="_blank"
                          rel="noreferrer"
                          className="p-2.5 rounded-xl bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 font-bold transition-all cursor-pointer"
                          title="WhatsApp Helpline Support"
                        >
                          <Phone className="h-4 w-4 text-emerald-500" />
                        </a>
                      </div>
                    </div>

                  </div>
                </div>
              );
            })}

            {/* Footer Prompt */}
            <div className="p-6 bg-gradient-to-r from-orange-500/5 via-amber-500/5 to-orange-500/5 rounded-3xl border border-orange-500/10 text-center space-y-2">
              <Sparkles className="h-6 w-6 text-orange-500 mx-auto animate-pulse" />
              <h4 className="font-extrabold text-sm text-neutral-800 dark:text-neutral-200 uppercase tracking-wider">
                Simulate Production Advances
              </h4>
              <p className="text-xs text-neutral-400 font-medium max-w-md mx-auto leading-relaxed">
                Want to see the live step tracking progress update? Because this is a simulated sandbox, your order status automatically moves forward from <strong>Reviewing Art</strong> to <strong>Stencil Prep</strong>, <strong>Active Printing Run</strong>, and <strong>Shipped</strong> as time goes on!
              </p>
            </div>

          </div>
        ) : (
          /* Empty State */
          <div className="bg-white dark:bg-neutral-900 rounded-3xl p-8 sm:p-12 border border-neutral-200/60 dark:border-neutral-800 shadow-md text-center space-y-6">
            <div className="h-20 w-20 rounded-full bg-neutral-50 dark:bg-neutral-950 flex items-center justify-center mx-auto border border-neutral-150/60 dark:border-neutral-900">
              <ShoppingBag className="h-9 w-9 text-neutral-400" />
            </div>

            <div className="space-y-2 max-w-sm mx-auto">
              <h3 className="font-black text-xl text-neutral-900 dark:text-white uppercase tracking-wide">
                No orders discovered yet
              </h3>
              <p className="text-xs text-neutral-400 font-semibold leading-relaxed">
                You haven't placed any custom garment printing orders or designed any hoodies/streetwear graphics in this session yet.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row justify-center items-center gap-3.5 pt-4">
              <button
                onClick={onNavigateToCustomStudio}
                className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white font-black uppercase text-xs tracking-wider transition-all cursor-pointer shadow-md shadow-orange-500/10"
              >
                <span>Design Custom Shirt 🎨</span>
              </button>
              
              <button
                onClick={onNavigateToShop}
                className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-neutral-800 dark:hover:bg-neutral-700 font-black uppercase text-xs tracking-wider transition-all cursor-pointer"
              >
                <span>Shop Streetwear 👕</span>
              </button>
            </div>

            <div className="pt-6 border-t border-neutral-100 dark:border-neutral-800 max-w-xs mx-auto">
              <span className="block text-[10px] font-black uppercase text-neutral-400 tracking-wider mb-2">
                Or generate a demo order instantly to test:
              </span>
              <button
                onClick={handleGenerateSampleOrder}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-orange-500/10 hover:bg-orange-500/20 text-orange-600 dark:text-orange-400 font-extrabold text-xs uppercase tracking-wider transition-all cursor-pointer"
              >
                <PlusCircle className="h-4 w-4" />
                <span>Create Simulated Order</span>
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
