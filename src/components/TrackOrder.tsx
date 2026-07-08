/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  Calendar, 
  Clock, 
  MapPin, 
  Printer, 
  Shirt, 
  Truck, 
  CheckCircle, 
  Sparkles, 
  FileText, 
  Phone, 
  Check, 
  AlertCircle, 
  TrendingUp, 
  HelpCircle,
  Scissors,
  Bookmark,
  ChevronRight,
  ExternalLink
} from 'lucide-react';

interface TrackingStep {
  title: string;
  description: string;
  status: 'completed' | 'current' | 'upcoming';
  timestamp?: string;
  icon: React.ComponentType<{ className?: string }> | string;
}

interface OrderDetails {
  orderId: string;
  customerName: string;
  orderDate: string;
  productTitle: string;
  fabricType: string;
  printMethod: string;
  quantity: number;
  totalAmount: number;
  estimatedDelivery: string;
  currentStatus: 'design_approval' | 'setup_prep' | 'printing' | 'finishing' | 'shipped';
  steps: TrackingStep[];
  trackingNumber?: string;
  shippingPartner?: string;
}

const SAMPLE_ORDERS: Record<string, OrderDetails> = {
  'JY-4921': {
    orderId: 'JY-4921',
    customerName: 'Rohit Sharma',
    orderDate: 'July 4, 2026',
    productTitle: 'Heavyweight Custom Streetwear Graphic Tee',
    fabricType: '240 GSM Combed Cotton',
    printMethod: 'Premium Multi-Color Screen Printing',
    quantity: 12,
    totalAmount: 7188,
    estimatedDelivery: 'July 8, 2026',
    currentStatus: 'shipped',
    trackingNumber: 'DEL921820344',
    shippingPartner: 'Delhivery Express',
    steps: [
      {
        title: 'Design Approval',
        description: 'Artwork files verified for high-resolution DPI. Vector color match complete.',
        status: 'completed',
        timestamp: 'July 4, 2026, 11:30 AM',
        icon: FileText
      },
      {
        title: 'Setup & Screen Prep',
        description: 'Physical screen mesh aligned for a clean multi-pass print. Ink mixing complete.',
        status: 'completed',
        timestamp: 'July 5, 2026, 09:15 AM',
        icon: Scissors
      },
      {
        title: 'Active Printing Run',
        description: 'Apparel printed on our 12-station automatic carousel. Heat curing applied at 160°C.',
        status: 'completed',
        timestamp: 'July 5, 2026, 04:30 PM',
        icon: Printer
      },
      {
        title: 'Finishing & Inspection',
        description: 'Post-production inspection complete. Garments folded, tagged, and packed.',
        status: 'completed',
        timestamp: 'July 6, 2026, 10:00 AM',
        icon: Shirt
      },
      {
        title: 'Shipped & En Route',
        description: 'Package handed over to partner courier. Dispatched from Bengaluru industrial facility.',
        status: 'completed',
        timestamp: 'July 6, 2026, 02:45 PM',
        icon: Truck
      }
    ]
  },
  'JY-7840': {
    orderId: 'JY-7840',
    customerName: 'Meenakshi Iyer',
    orderDate: 'July 5, 2026',
    productTitle: 'Boutique Designer Silk Saree Blouses',
    fabricType: 'Pure Banarasi Kora Silk',
    printMethod: 'Computerized Embroidery & Zari Stitching',
    quantity: 3,
    totalAmount: 11400,
    estimatedDelivery: 'July 10, 2026',
    currentStatus: 'printing',
    steps: [
      {
        title: 'Design Approval',
        description: 'Embroidery stitch pattern mapped to computerized system. Color matching complete.',
        status: 'completed',
        timestamp: 'July 5, 2026, 02:10 PM',
        icon: FileText
      },
      {
        title: 'Setup & Screen Prep',
        description: 'Silk base stabilized on mechanical embroidery frames with backing sheet sheets.',
        status: 'completed',
        timestamp: 'July 6, 2026, 10:30 AM',
        icon: Scissors
      },
      {
        title: 'Active Printing Run',
        description: 'Zari and gold thread stitching active under structural surveillance. Stitches: 45,000/pc.',
        status: 'current',
        timestamp: 'July 6, 2026, 05:00 PM (In Progress)',
        icon: Printer
      },
      {
        title: 'Finishing & Inspection',
        description: 'Manual thread-trimming, steam-ironing, and custom packaging.',
        status: 'upcoming',
        icon: Shirt
      },
      {
        title: 'Shipped & En Route',
        description: 'Apparel packaging and dispatch from Bengaluru warehouse.',
        status: 'upcoming',
        icon: Truck
      }
    ]
  },
  'JY-3112': {
    orderId: 'JY-3112',
    customerName: 'Karthik Rao',
    orderDate: 'July 6, 2026',
    productTitle: 'RCB Custom Sublimation Fan Jerseys',
    fabricType: '160 GSM Premium Dry-fit Polyester',
    printMethod: 'Full All-Over Sublimation Printing',
    quantity: 25,
    totalAmount: 18750,
    estimatedDelivery: 'July 12, 2026',
    currentStatus: 'setup_prep',
    steps: [
      {
        title: 'Design Approval',
        description: 'Custom name & number typography checked. High-resolution gradient proof approved.',
        status: 'completed',
        timestamp: 'July 6, 2026, 10:00 AM',
        icon: FileText
      },
      {
        title: 'Setup & Screen Prep',
        description: 'Color-separation on transfer sheets. Temperature & pressure parameters calibrated.',
        status: 'current',
        timestamp: 'July 6, 2026, 04:15 PM',
        icon: Scissors
      },
      {
        title: 'Active Printing Run',
        description: 'Direct high-heat dye-sublimation process into the fabric fibres.',
        status: 'upcoming',
        icon: Printer
      },
      {
        title: 'Finishing & Inspection',
        description: 'Quality checks for seam alignment and vibrant stretch resolution.',
        status: 'upcoming',
        icon: Shirt
      },
      {
        title: 'Shipped & En Route',
        description: 'Express dispatch with local shipping partners.',
        status: 'upcoming',
        icon: Truck
      }
    ]
  },
  'JY-1085': {
    orderId: 'JY-1085',
    customerName: 'TechCorp Solutions (Ananya G.)',
    orderDate: 'July 6, 2026',
    productTitle: 'Corporate Combed Cotton Polo Uniforms',
    fabricType: '220 GSM Pique Cotton-Poly Blend',
    printMethod: 'High-Density Front Pocket Embroidery & Back Digital Print',
    quantity: 100,
    totalAmount: 49500,
    estimatedDelivery: 'July 15, 2026',
    currentStatus: 'design_approval',
    steps: [
      {
        title: 'Design Approval',
        description: 'Corporate logo artwork sizing verified. Color matching (Pantone matching) in progress.',
        status: 'current',
        timestamp: 'July 6, 2026, 06:30 PM',
        icon: FileText
      },
      {
        title: 'Setup & Screen Prep',
        description: 'Creation of embroidery needles maps and digital ink nozzles cleaning.',
        status: 'upcoming',
        icon: Scissors
      },
      {
        title: 'Active Printing Run',
        description: 'High-speed multi-head computerized corporate logo stitching run.',
        status: 'upcoming',
        icon: Printer
      },
      {
        title: 'Finishing & Inspection',
        description: 'Press-ironing, corporate poly-packing, and final box palletizing.',
        status: 'upcoming',
        icon: Shirt
      },
      {
        title: 'Shipped & En Route',
        description: 'Doorstep freight logistics shipment with real-time tracking.',
        status: 'upcoming',
        icon: Truck
      }
    ]
  }
};

const IconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  FileText: FileText,
  Scissors: Scissors,
  Printer: Printer,
  Shirt: Shirt,
  Truck: Truck
};

export default function TrackOrder({ 
  prefilledOrderId, 
  onSearchOrder 
}: { 
  prefilledOrderId?: string; 
  onSearchOrder?: (id: string) => void;
}) {
  const [orderIdInput, setOrderIdInput] = useState('');
  const [searchedOrder, setSearchedOrder] = useState<OrderDetails | null>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  // Auto search when prefilled order changes
  useEffect(() => {
    if (prefilledOrderId) {
      setOrderIdInput(prefilledOrderId);
      setErrorMsg('');
      setSearchedOrder(null);
      setIsSearching(true);
      
      setTimeout(() => {
        setIsSearching(false);
        const formattedId = prefilledOrderId.trim().toUpperCase();
        
        // Check localStorage first
        try {
          const savedOrders = JSON.parse(localStorage.getItem('jyothi_orders') || '[]');
          const localOrder = savedOrders.find((o: any) => o.orderId === formattedId);
          if (localOrder) {
            setSearchedOrder(localOrder);
            return;
          }
        } catch (e) {
          console.error('Failed to read from local storage:', e);
        }

        if (SAMPLE_ORDERS[formattedId]) {
          setSearchedOrder(SAMPLE_ORDERS[formattedId]);
        } else if ((formattedId.startsWith('JY-') || formattedId.startsWith('JPW-')) && formattedId.length >= 6) {
          const idNum = parseInt(formattedId.replace(/\D/g, '') || '5000', 10);
          const states: OrderDetails['currentStatus'][] = ['design_approval', 'setup_prep', 'printing', 'finishing', 'shipped'];
          const chosenStatus = states[idNum % states.length];
          
          const createdOrder: OrderDetails = {
            orderId: formattedId,
            customerName: 'Valued Client',
            orderDate: 'July 5, 2026',
            productTitle: 'Custom Apparel Prints & Merch',
            fabricType: 'Premium Premium Cotton-Linen Blend',
            printMethod: 'Digital Textile Print / Embroidery',
            quantity: 10 + (idNum % 40),
            totalAmount: 499 * (10 + (idNum % 40)),
            estimatedDelivery: 'July 11, 2026',
            currentStatus: chosenStatus,
            steps: [
              {
                title: 'Design Approval',
                description: 'Artwork resolution verification and client visual preview confirmation.',
                status: chosenStatus === 'design_approval' ? 'current' : 'completed',
                timestamp: 'July 5, 2026, 11:00 AM',
                icon: FileText
              },
              {
                title: 'Setup & Screen Prep',
                description: 'Calibrating stencils, screens, or direct-to-garment machinery nozzles.',
                status: chosenStatus === 'setup_prep' ? 'current' : (['design_approval'].includes(chosenStatus) ? 'upcoming' : 'completed'),
                timestamp: !['design_approval'].includes(chosenStatus) ? 'July 6, 2026, 09:30 AM' : undefined,
                icon: Scissors
              },
              {
                title: 'Active Printing Run',
                description: 'High-speed garment printing and high-temperature curing tunnel setup.',
                status: chosenStatus === 'printing' ? 'current' : (['design_approval', 'setup_prep'].includes(chosenStatus) ? 'upcoming' : 'completed'),
                timestamp: !['design_approval', 'setup_prep'].includes(chosenStatus) ? 'July 6, 2026, 02:00 PM' : undefined,
                icon: Printer
              },
              {
                title: 'Finishing & Inspection',
                description: 'Meticulous thread trimming, fabric steaming, and custom tag attachment.',
                status: chosenStatus === 'finishing' ? 'current' : (['shipped'].includes(chosenStatus) ? 'completed' : 'upcoming'),
                timestamp: ['shipped'].includes(chosenStatus) ? 'July 6, 2026, 04:30 PM' : undefined,
                icon: Shirt
              },
              {
                title: 'Shipped & En Route',
                description: 'Handed over to premium delivery partner or packed for priority collection.',
                status: chosenStatus === 'shipped' ? 'completed' : 'upcoming',
                timestamp: chosenStatus === 'shipped' ? 'July 6, 2026, 05:45 PM' : undefined,
                icon: Truck
              }
            ]
          };
          setSearchedOrder(createdOrder);
        } else {
          setErrorMsg('Order ID not recognized. Try one of our samples: JY-4921, JY-7840, JY-3112, or JY-1085.');
        }
      }, 400);
    }
  }, [prefilledOrderId]);

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMsg('');
    setSearchedOrder(null);

    const formattedId = orderIdInput.trim().toUpperCase();
    if (!formattedId) {
      setErrorMsg('Please enter a valid Order ID to proceed.');
      return;
    }

    setIsSearching(true);

    // Simulate database lookup latency (400ms)
    setTimeout(() => {
      setIsSearching(false);

      if (onSearchOrder) {
        onSearchOrder(formattedId);
      }
      
      // Check localStorage first
      try {
        const savedOrders = JSON.parse(localStorage.getItem('jyothi_orders') || '[]');
        const localOrder = savedOrders.find((o: any) => o.orderId === formattedId);
        if (localOrder) {
          setSearchedOrder(localOrder);
          return;
        }
      } catch (err) {
        console.error('Failed to read local orders:', err);
      }

      if (SAMPLE_ORDERS[formattedId]) {
        setSearchedOrder(SAMPLE_ORDERS[formattedId]);
      } else if ((formattedId.startsWith('JY-') || formattedId.startsWith('JPW-')) && formattedId.length >= 6) {
        // Generate a deterministic, realistic tracking workflow for any valid order format
        // So that if users try their own generated IDs, they get an awesome dynamic workflow
        const idNum = parseInt(formattedId.replace(/\D/g, '') || '5000', 10);
        const states: OrderDetails['currentStatus'][] = ['design_approval', 'setup_prep', 'printing', 'finishing', 'shipped'];
        const chosenStatus = states[idNum % states.length];
        
        const createdOrder: OrderDetails = {
          orderId: formattedId,
          customerName: 'Valued Client',
          orderDate: 'July 5, 2026',
          productTitle: 'Custom Apparel Prints & Merch',
          fabricType: 'Premium Premium Cotton-Linen Blend',
          printMethod: 'Digital Textile Print / Embroidery',
          quantity: 10 + (idNum % 40),
          totalAmount: 499 * (10 + (idNum % 40)),
          estimatedDelivery: 'July 11, 2026',
          currentStatus: chosenStatus,
          steps: [
            {
              title: 'Design Approval',
              description: 'Artwork resolution verification and client visual preview confirmation.',
              status: chosenStatus === 'design_approval' ? 'current' : 'completed',
              timestamp: 'July 5, 2026, 11:00 AM',
              icon: FileText
            },
            {
              title: 'Setup & Screen Prep',
              description: 'Calibrating stencils, screens, or direct-to-garment machinery nozzles.',
              status: chosenStatus === 'setup_prep' ? 'current' : (['design_approval'].includes(chosenStatus) ? 'upcoming' : 'completed'),
              timestamp: !['design_approval'].includes(chosenStatus) ? 'July 6, 2026, 09:30 AM' : undefined,
              icon: Scissors
            },
            {
              title: 'Active Printing Run',
              description: 'High-speed garment printing and high-temperature curing tunnel setup.',
              status: chosenStatus === 'printing' ? 'current' : (['design_approval', 'setup_prep'].includes(chosenStatus) ? 'upcoming' : 'completed'),
              timestamp: !['design_approval', 'setup_prep'].includes(chosenStatus) ? 'July 6, 2026, 02:00 PM' : undefined,
              icon: Printer
            },
            {
              title: 'Finishing & Inspection',
              description: 'Meticulous thread trimming, fabric steaming, and custom tag attachment.',
              status: chosenStatus === 'finishing' ? 'current' : (['shipped'].includes(chosenStatus) ? 'completed' : 'upcoming'),
              timestamp: ['shipped'].includes(chosenStatus) ? 'July 6, 2026, 04:30 PM' : undefined,
              icon: Shirt
            },
            {
              title: 'Shipped & En Route',
              description: 'Handed over to premium delivery partner or packed for priority collection.',
              status: chosenStatus === 'shipped' ? 'completed' : 'upcoming',
              timestamp: chosenStatus === 'shipped' ? 'July 6, 2026, 05:45 PM' : undefined,
              icon: Truck
            }
          ]
        };
        setSearchedOrder(createdOrder);
      } else {
        setErrorMsg('Order ID not recognized. Try one of our samples: JY-4921, JY-7840, JY-3112, or JY-1085.');
      }
    }, 400);
  };

  const handleSelectSample = (id: string) => {
    setOrderIdInput(id);
    // Auto trigger search
    setErrorMsg('');
    setSearchedOrder(null);
    setIsSearching(true);
    setTimeout(() => {
      setIsSearching(false);
      setSearchedOrder(SAMPLE_ORDERS[id]);
    }, 300);
  };

  return (
    <div id="track-order-page" className="w-full bg-neutral-50 dark:bg-neutral-950 min-h-screen text-neutral-900 dark:text-neutral-100 pt-28 pb-16">
      
      {/* Banner / Title Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-10">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-100 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400 text-[10px] font-black tracking-widest uppercase mb-3">
          <Sparkles className="h-3.5 w-3.5" />
          Real-Time Tracking
        </span>
        <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-none uppercase text-neutral-900 dark:text-white mb-4">
          Order Progress <span className="text-orange-500">Lookup</span>
        </h1>
        <p className="text-sm text-neutral-500 dark:text-neutral-400 max-w-xl mx-auto font-medium leading-relaxed">
          Monitor your custom print job status in real-time. Follow your garment raw material through design verification, active printing, and final inspection.
        </p>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Search Panel Card */}
        <div className="bg-white dark:bg-neutral-900 rounded-3xl p-6 sm:p-8 border border-neutral-200/60 dark:border-neutral-800 shadow-md mb-8">
          <form onSubmit={handleSearch} className="space-y-4">
            <label htmlFor="order-id-input" className="block text-xs font-black uppercase text-neutral-400 tracking-wider">
              Enter your Jyothi Order ID
            </label>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400" />
                <input
                  id="order-id-input"
                  type="text"
                  placeholder="e.g. JY-4921"
                  value={orderIdInput}
                  onChange={(e) => setOrderIdInput(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-2xl text-sm font-bold text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all"
                />
              </div>
              
              <button
                type="submit"
                disabled={isSearching}
                className="px-8 py-3.5 rounded-2xl bg-orange-500 hover:bg-orange-600 disabled:bg-neutral-300 dark:disabled:bg-neutral-800 text-white font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 transition-all active:scale-98 cursor-pointer shadow-md shadow-orange-500/10"
              >
                {isSearching ? (
                  <>
                    <Clock className="h-4 w-4 animate-spin" />
                    <span>Searching...</span>
                  </>
                ) : (
                  <>
                    <Search className="h-4 w-4" />
                    <span>Track Order</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Quick Click Samples */}
          <div className="mt-5 pt-5 border-t border-neutral-100 dark:border-neutral-800/80">
            <span className="block text-[10px] font-black uppercase text-neutral-400 tracking-wider mb-2.5">
              Click a sample Order ID to test visual progression:
            </span>
            <div className="flex flex-wrap gap-2.5">
              {Object.keys(SAMPLE_ORDERS).map((key) => {
                const order = SAMPLE_ORDERS[key];
                const statusLabels: Record<string, string> = {
                  design_approval: 'Reviewing',
                  setup_prep: 'Prep',
                  printing: 'Active Printing',
                  finishing: 'Packing',
                  shipped: 'Shipped'
                };
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => handleSelectSample(key)}
                    className={`px-3.5 py-1.5 rounded-full border text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                      orderIdInput.trim().toUpperCase() === key
                        ? 'bg-orange-50 border-orange-200 text-orange-600 dark:bg-orange-950/20 dark:border-orange-900 dark:text-orange-400'
                        : 'bg-neutral-50 border-neutral-200 dark:bg-neutral-800/50 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                    }`}
                  >
                    <Bookmark className="h-3 w-3 shrink-0" />
                    <span>{key}</span>
                    <span className="text-[9px] opacity-60 font-medium">({statusLabels[order.currentStatus]})</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Error Alert Box */}
        <AnimatePresence mode="wait">
          {errorMsg && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="p-4 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/60 rounded-2xl flex items-start gap-3 text-red-700 dark:text-red-400 mb-8 text-left"
            >
              <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-xs uppercase tracking-wide">Lookup Failure</h4>
                <p className="text-xs mt-0.5 font-medium">{errorMsg}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Search Results Display */}
        <AnimatePresence mode="wait">
          {searchedOrder && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 15 }}
              transition={{ duration: 0.4 }}
              className="space-y-6"
            >
              
              {/* Order Overview Header Card */}
              <div className="bg-gradient-to-br from-neutral-900 to-neutral-950 dark:from-neutral-900 dark:to-black text-white rounded-3xl p-6 sm:p-8 border border-neutral-800/60 shadow-xl relative overflow-hidden text-left">
                <div className="absolute right-0 bottom-0 top-0 w-1/3 bg-radial-gradient from-orange-500/10 to-transparent pointer-events-none" />
                
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5 mb-5">
                  <div>
                    <span className="text-[10px] font-black uppercase text-orange-400 tracking-wider">
                      Active Print Job
                    </span>
                    <h2 className="text-xl sm:text-2xl font-black mt-1">
                      Order {searchedOrder.orderId}
                    </h2>
                  </div>
                  
                  <div className="flex flex-col sm:items-end">
                    <span className="text-[10px] font-black uppercase text-neutral-400 tracking-wider">
                      Estimated Completion
                    </span>
                    <span className="text-sm font-black text-amber-300 mt-1 flex items-center gap-1">
                      <Calendar className="h-4 w-4 shrink-0" />
                      {searchedOrder.estimatedDelivery}
                    </span>
                  </div>
                </div>

                {/* Grid details */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4.5 text-xs">
                  <div>
                    <span className="block text-neutral-400 font-extrabold uppercase text-[9px] tracking-wider mb-1">
                      Customer
                    </span>
                    <span className="font-bold text-neutral-100">{searchedOrder.customerName}</span>
                  </div>
                  <div>
                    <span className="block text-neutral-400 font-extrabold uppercase text-[9px] tracking-wider mb-1">
                      Order Date
                    </span>
                    <span className="font-bold text-neutral-100">{searchedOrder.orderDate}</span>
                  </div>
                  <div>
                    <span className="block text-neutral-400 font-extrabold uppercase text-[9px] tracking-wider mb-1">
                      Apparel Fabric
                    </span>
                    <span className="font-bold text-neutral-100 truncate block" title={searchedOrder.fabricType}>
                      {searchedOrder.fabricType}
                    </span>
                  </div>
                  <div>
                    <span className="block text-neutral-400 font-extrabold uppercase text-[9px] tracking-wider mb-1">
                      Total Apparel Items
                    </span>
                    <span className="font-bold text-neutral-100">
                      {searchedOrder.quantity} Units <span className="text-neutral-400">({searchedOrder.printMethod.includes('Embroidery') ? 'Embroidery' : 'Print'})</span>
                    </span>
                  </div>
                </div>

                {/* Sub-item specific title banner */}
                <div className="mt-5 p-4 bg-white/5 rounded-2xl border border-white/10 flex items-start gap-3">
                  <Shirt className="h-5 w-5 text-orange-400 mt-0.5 shrink-0" />
                  <div>
                    <h4 className="font-black text-xs uppercase text-neutral-200 tracking-wide">
                      Job Specification:
                    </h4>
                    <p className="text-xs text-neutral-300 font-medium mt-0.5">
                      {searchedOrder.productTitle} — <span className="text-orange-300 font-bold">{searchedOrder.printMethod}</span>
                    </p>
                  </div>
                </div>

                {/* Pricing / Logistics row */}
                <div className="mt-5 flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-white/5 text-xs text-neutral-400">
                  <div className="flex items-center gap-1.5">
                    <span>Grand Total:</span>
                    <span className="font-black text-neutral-100">₹{searchedOrder.totalAmount.toLocaleString()}</span>
                  </div>
                  {searchedOrder.trackingNumber && (
                    <div className="flex items-center gap-1.5 bg-neutral-800/80 px-3 py-1 rounded-full border border-neutral-700/50">
                      <Truck className="h-3.5 w-3.5 text-orange-400" />
                      <span>{searchedOrder.shippingPartner}:</span>
                      <span className="font-black text-neutral-200 select-all">{searchedOrder.trackingNumber}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Progress Timeline Tracker */}
              <div className="bg-white dark:bg-neutral-900 rounded-3xl p-6 sm:p-8 border border-neutral-200/60 dark:border-neutral-800 shadow-md text-left">
                <h3 className="font-black text-sm uppercase tracking-wider text-neutral-500 mb-6 flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-orange-500" />
                  Production Workflow Status
                </h3>

                <div className="relative pl-6 sm:pl-8 border-l-2 border-neutral-200 dark:border-neutral-800 space-y-8">
                  {searchedOrder.steps.map((step, idx) => {
                    const isCompleted = step.status === 'completed';
                    const isCurrent = step.status === 'current';
                    const StepIcon = typeof step.icon === 'string' ? (IconMap[step.icon] || FileText) : step.icon;

                    return (
                      <div key={idx} className="relative group">
                        
                        {/* Bullet circle icon */}
                        <div className={`absolute -left-12 sm:-left-14 top-1.5 h-11 w-11 rounded-full border-4 flex items-center justify-center transition-all shadow-sm ${
                          isCompleted
                            ? 'bg-orange-500 border-orange-100 dark:border-orange-950/60 text-white'
                            : isCurrent
                              ? 'bg-amber-400 border-amber-100 dark:border-amber-950 text-neutral-950 animate-pulse'
                              : 'bg-neutral-100 border-neutral-50 dark:bg-neutral-800 dark:border-neutral-900 text-neutral-400'
                        }`}>
                          {isCompleted ? (
                            <Check className="h-5 w-5 stroke-[3px]" />
                          ) : (
                            <StepIcon className="h-4.5 w-4.5" />
                          )}
                        </div>

                        {/* Text section */}
                        <div className="space-y-1">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                            <h4 className={`font-black text-sm uppercase tracking-wide ${
                              isCompleted 
                                ? 'text-neutral-900 dark:text-neutral-100' 
                                : isCurrent 
                                  ? 'text-amber-500 dark:text-amber-400 font-extrabold' 
                                  : 'text-neutral-400'
                            }`}>
                              {step.title}
                            </h4>
                            
                            {step.timestamp && (
                              <span className="text-[10px] font-bold text-neutral-400 bg-neutral-100 dark:bg-neutral-800/60 px-2.5 py-0.5 rounded-full self-start sm:self-center">
                                {step.timestamp}
                              </span>
                            )}
                          </div>
                          <p className={`text-xs font-semibold leading-relaxed ${
                            isCompleted || isCurrent 
                              ? 'text-neutral-500 dark:text-neutral-400' 
                              : 'text-neutral-400 dark:text-neutral-500'
                          }`}>
                            {step.description}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Assistance & Helpline Card */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Contact Help */}
                <div className="bg-white dark:bg-neutral-900 rounded-3xl p-6 border border-neutral-200/60 dark:border-neutral-800 shadow-md text-left flex flex-col justify-between">
                  <div className="space-y-3">
                    <h3 className="font-black text-xs uppercase tracking-widest text-neutral-400">
                      Need Assistance?
                    </h3>
                    <h4 className="font-extrabold text-base text-neutral-900 dark:text-white leading-snug">
                      Connect directly with our workshop floor manager
                    </h4>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 font-medium leading-relaxed">
                      If you have specific design revisions, rush requirements, or shipping changes, our Bengaluru printing facility is always ready to support.
                    </p>
                  </div>

                  <div className="pt-6 flex flex-wrap gap-3">
                    <a
                      href={`https://wa.me/919182703766?text=Hello%20Jyothi%20Printing%2520Works!%2520I'm%2520inquiring%2520about%2520order%2520${searchedOrder.orderId}.%2520Please%2520provide%2520a%2520status%2520update.`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 px-4.5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-black text-xs uppercase tracking-wider transition-all cursor-pointer shadow-sm"
                    >
                      <Phone className="h-3.5 w-3.5" />
                      WhatsApp Helpline
                    </a>
                    <button
                      onClick={() => {
                        alert(`Direct hotline call connected to Bengaluru production floor! Phone: +91 9182703766`);
                      }}
                      className="inline-flex items-center gap-1.5 px-4.5 py-2.5 rounded-xl bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 font-black text-xs uppercase tracking-wider transition-all cursor-pointer"
                    >
                      Call Workshop
                    </button>
                  </div>
                </div>

                {/* Print Quality Assurance Specifications */}
                <div className="bg-white dark:bg-neutral-900 rounded-3xl p-6 border border-neutral-200/60 dark:border-neutral-800 shadow-md text-left flex flex-col justify-between">
                  <div className="space-y-3">
                    <h3 className="font-black text-xs uppercase tracking-widest text-orange-500">
                      Jyothi Quality Promise
                    </h3>
                    <h4 className="font-extrabold text-base text-neutral-900 dark:text-white leading-snug">
                      Double Inspection Guard
                    </h4>
                    <ul className="text-xs text-neutral-500 dark:text-neutral-400 space-y-1.5 font-medium">
                      <li className="flex items-center gap-1.5">
                        <Check className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                        <span>Pre-shrink treatment on 100% combed cotton.</span>
                      </li>
                      <li className="flex items-center gap-1.5">
                        <Check className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                        <span>Plastisol & Water-based inks wash-proof (up to 50 cycles).</span>
                      </li>
                      <li className="flex items-center gap-1.5">
                        <Check className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                        <span>Reinforced double stitching on collar and shoulder seams.</span>
                      </li>
                    </ul>
                  </div>

                  <div className="pt-4 text-[10px] text-neutral-400 dark:text-neutral-500 font-bold flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5" />
                    <span>Dispatched from Bengaluru Industrial Estate, Karnataka</span>
                  </div>
                </div>

              </div>

            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
