/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  Star, 
  ShoppingBag, 
  Sparkles, 
  X, 
  Check, 
  Ruler, 
  TrendingUp, 
  Award,
  ChevronRight,
  ChevronLeft,
  Percent,
  Flame,
  Truck,
  RotateCcw,
  ShieldCheck,
  Tag,
  Filter,
  SlidersHorizontal,
  ChevronDown,
  Heart,
  Camera,
  Bell,
  MapPin,
  User,
  Plus,
  Trash2,
  Lock,
  ShieldAlert
} from 'lucide-react';
import { ShopProduct, CartItem } from '../types';
import { shopProducts, getPriceForSize } from '../data/shopProducts';

interface ShopProps {
  onAddToCart: (item: Omit<CartItem, 'id'>) => void;
  onNavigateToCustomStudio: () => void;
  onNavigateToAccount?: () => void;
  onOpenCart?: () => void;
  cartCount?: number;
  wishlist: string[];
  setWishlist: React.Dispatch<React.SetStateAction<string[]>>;
  showWishlistOnly: boolean;
  setShowWishlistOnly: (show: boolean) => void;
  products?: ShopProduct[];
  loadingProducts?: boolean;
  isAdmin?: boolean;
  onAddProduct?: (product: ShopProduct) => Promise<void>;
  onDeleteProduct?: (id: string) => Promise<void>;
}

// Banners list representing Jyothi Mega Deals
const JYOTHI_BANNERS = [
  {
    id: 'b1',
    title: 'BIG BOLD SALE',
    subtitle: 'THE ULTIMATE STREETWEAR EXTRAVAGANZA',
    offer: '50% - 90% OFF',
    tagline: 'Premium Oversized Tees, Heavy Fleece & Traditional Blouses',
    badge: 'MEGA DEAL OF THE SEASON',
    bgColor: 'from-orange-600 via-red-600 to-amber-600',
    btnText: 'Shop the Sale',
    image: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'b2',
    title: 'TRENDS EXCLUSIVE',
    subtitle: 'FESTIVAL SPECIAL SILK SELECTIONS',
    offer: 'MINIMUM 60% OFF',
    tagline: 'Stunning Peacock Motif Embroidery & Raw Zari Silk Blouses',
    badge: 'LIMITED COUTURE',
    bgColor: 'from-purple-900 via-rose-900 to-pink-800',
    btnText: 'Explore boutique',
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'b3',
    title: 'HYPEBEAST CORNER',
    subtitle: 'INTERNATIONAL COLD FLEECE SENSATION',
    offer: 'FLAT 40% OFF',
    tagline: 'Heavy 400 GSM Loopback organic hoodies and vintage sweats',
    badge: 'HOT PRICE DROP',
    bgColor: 'from-blue-900 via-slate-900 to-indigo-950',
    btnText: 'View Streetwear',
    image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80&w=800'
  }
];

// Round Circle Categories representing Jyothi Category Rail
const QUICK_CATEGORIES = [
  { id: 'all', label: 'All Designs', icon: '🛍️', bg: 'bg-neutral-100 dark:bg-neutral-900' },
  { id: 'streetwear', label: 'T-Shirts', icon: '👕', bg: 'bg-orange-100 dark:bg-orange-950/40' },
  { id: 'hoodies', label: 'Hoodies', icon: '🧥', bg: 'bg-blue-100 dark:bg-blue-950/40' },
  { id: 'boutique', label: 'Sarees & Blouses', icon: '🥻', bg: 'bg-rose-100 dark:bg-rose-950/40' },
  { id: 'sports', label: 'Sports Jerseys', icon: '🎽', bg: 'bg-emerald-100 dark:bg-emerald-950/40' }
];

export default function Shop({ 
  onAddToCart, 
  onNavigateToCustomStudio,
  onNavigateToAccount,
  onOpenCart,
  cartCount = 0,
  wishlist,
  setWishlist,
  showWishlistOnly,
  setShowWishlistOnly,
  products = [],
  loadingProducts = false,
  isAdmin = false,
  onAddProduct,
  onDeleteProduct
}: ShopProps) {
  // If products prop is empty, default to static list
  const actualProducts = (products && products.length > 0) ? products : shopProducts;

  // Strictly enforce admin authentication
  const isCurrentlyAdmin = isAdmin;

  // Add Product Modal Form States
  const [isAddProductOpen, setIsAddProductOpen] = useState<boolean>(false);
  const [adminError, setAdminError] = useState<string | null>(null);
  const [adminSuccess, setAdminSuccess] = useState<string | null>(null);
  const [newProductForm, setNewProductForm] = useState({
    title: '',
    tagline: '',
    price: 399,
    originalPrice: 899,
    category: 'streetwear',
    image: '',
    description: '',
    colors: [{ name: 'Deep Black', hex: '#000000' }],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    specifications: ['100% Super Combed Cotton Fabric', 'Heavyweight 240 GSM Material', 'Drop Shoulder Relaxed Fit', 'Durable High-Definition Print']
  });

  const [activeBanner, setActiveBanner] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('popular');
  const [selectedProduct, setSelectedProduct] = useState<ShopProduct | null>(null);
  
  // Custom filter states to match the screenshot layout
  const [genderFilter, setGenderFilter] = useState<string>('all');
  const [priceRangeFilter, setPriceRangeFilter] = useState<string>('all');
  const [activeDropdown, setActiveDropdown] = useState<string>('none');
  const [navbarHeight, setNavbarHeight] = useState<number>(64);
  
  // Custom location states
  const [locationName, setLocationName] = useState<string>('sreenath');
  const [locationAddress, setLocationAddress] = useState<string>('Sreenath, Rjf2+p...');
  const [locationPincode, setLocationPincode] = useState<string>('515731');
  const [showLocationModal, setShowLocationModal] = useState<boolean>(false);
  const [showAccountModal, setShowAccountModal] = useState<boolean>(false);

  // Filter panel details
  const [priceRange, setPriceRange] = useState<number>(500);
  const [selectedSizeFilter, setSelectedSizeFilter] = useState<string>('all');

  // Modal styling states
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState<{ name: string; hex: string } | null>(null);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [showFitAdvisor, setShowFitAdvisor] = useState(false);
  const [fitHeight, setFitHeight] = useState('5.9');
  const [fitWeight, setFitWeight] = useState('70');
  const [calculatedSize, setCalculatedSize] = useState<string | null>(null);
  const [quickAddedId, setQuickAddedId] = useState<string | null>(null);

  // Recently Viewed states with high durability localStorage persistence
  const [recentlyViewed, setRecentlyViewed] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('jyothi_recently_viewed');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Auto-rotating Jyothi-style hero banner
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveBanner(prev => (prev + 1) % JYOTHI_BANNERS.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  // Monitor and measure the main navbar height in real-time
  useEffect(() => {
    const updateHeight = () => {
      const navbar = document.getElementById('main-navbar');
      if (navbar) {
        setNavbarHeight(navbar.getBoundingClientRect().height);
      }
    };
    updateHeight();

    // Observe changes inside navbar (e.g. promotional banner dismissals)
    const navbar = document.getElementById('main-navbar');
    let observer: MutationObserver | null = null;
    if (navbar) {
      observer = new MutationObserver(updateHeight);
      observer.observe(navbar, { attributes: true, childList: true, subtree: true });
    }

    window.addEventListener('resize', updateHeight);
    window.addEventListener('scroll', updateHeight);

    return () => {
      if (observer) observer.disconnect();
      window.removeEventListener('resize', updateHeight);
      window.removeEventListener('scroll', updateHeight);
    };
  }, []);

  // Save states securely to localStorage
  useEffect(() => {
    localStorage.setItem('jyothi_recently_viewed', JSON.stringify(recentlyViewed));
  }, [recentlyViewed]);

  // Wishlist toggler function
  const toggleWishlist = (productId: string, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation(); // Prevent modal overlay trigger on catalog card
    }
    setWishlist(prev => {
      if (prev.includes(productId)) {
        return prev.filter(id => id !== productId);
      } else {
        return [...prev, productId];
      }
    });
  };

  // Convert recently viewed string IDs to actual ShopProduct objects safely
  const recentlyViewedProducts = recentlyViewed
    .map(id => actualProducts.find(p => p.id === id))
    .filter((p): p is ShopProduct => !!p);

  // Filter & sorting algorithm incorporating search, categories, price range, sizing, and wishlist filters
  const filteredProducts = actualProducts
    .filter(p => {
      const discountPercent = Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100);
      
      const matchSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.category.toLowerCase().includes(searchQuery.toLowerCase());
      
      // Category Circle Rail filtering (matches the visual categories)
      let matchCat = true;
      if (selectedCategory === 'men') {
        matchCat = p.category === 'streetwear' || p.category === 'hoodies' || p.category === 'sports' || p.title.toLowerCase().includes('men');
      } else if (selectedCategory === 'women') {
        matchCat = p.category === 'boutique' || p.title.toLowerCase().includes('silk') || p.title.toLowerCase().includes('saree') || p.title.toLowerCase().includes('blouse');
      } else if (selectedCategory === 'kids') {
        matchCat = parseInt(p.id) % 6 === 0 || p.title.toLowerCase().includes('junior') || p.title.toLowerCase().includes('kids') || p.title.toLowerCase().includes('youth');
      } else if (selectedCategory === 'sale') {
        matchCat = discountPercent >= 50;
      } else if (selectedCategory !== 'all') {
        matchCat = p.category === selectedCategory;
      }

      // Dropdown Gender filtering
      let matchGender = true;
      if (genderFilter === 'men') {
        matchGender = p.category === 'streetwear' || p.category === 'hoodies' || p.category === 'sports' || p.title.toLowerCase().includes('men');
      } else if (genderFilter === 'women') {
        matchGender = p.category === 'boutique' || p.title.toLowerCase().includes('silk') || p.title.toLowerCase().includes('saree') || p.title.toLowerCase().includes('blouse');
      } else if (genderFilter === 'kids') {
        matchGender = parseInt(p.id) % 6 === 0 || p.title.toLowerCase().includes('junior') || p.title.toLowerCase().includes('kids') || p.title.toLowerCase().includes('youth');
      }

      // Dropdown Price filtering
      let matchPrice = true;
      if (priceRangeFilter === '150') matchPrice = p.price <= 150;
      else if (priceRangeFilter === '250') matchPrice = p.price <= 250;
      else if (priceRangeFilter === '350') matchPrice = p.price <= 350;
      else if (priceRangeFilter === '500') matchPrice = p.price <= 500;
      else matchPrice = p.price <= priceRange; // fallback to price slider

      const matchSize = selectedSizeFilter === 'all' || p.sizes.includes(selectedSizeFilter);
      const matchWishlist = !showWishlistOnly || wishlist.includes(p.id);

      return matchSearch && matchCat && matchGender && matchPrice && matchSize && matchWishlist;
    })
    .sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'discount') {
        const discA = ((a.originalPrice - a.price) / a.originalPrice);
        const discB = ((b.originalPrice - b.price) / b.originalPrice);
        return discB - discA;
      }
      return b.reviewCount - a.reviewCount; // Popularity default
    });

  const handleOpenProductModal = (product: ShopProduct) => {
    setSelectedProduct(product);
    setActiveImageIndex(0);
    setSelectedColor(product.colors[0]);
    setSelectedSize(product.sizes[2] || product.sizes[0]); // default to L or first size
    setShowFitAdvisor(false);
    setCalculatedSize(null);

    // Track recently viewed product ID without duplicates
    setRecentlyViewed(prev => {
      const filtered = prev.filter(id => id !== product.id);
      return [product.id, ...filtered].slice(0, 10); // maintain last 10 viewed
    });
  };

  const calculateFitRecommendation = (e: React.FormEvent) => {
    e.preventDefault();
    const h = parseFloat(fitHeight);
    const w = parseInt(fitWeight);

    if (isNaN(h) || isNaN(w)) return;

    let recommended = 'L';
    if (h < 5.6) {
      recommended = w < 60 ? 'S' : 'M';
    } else if (h < 6.0) {
      recommended = w < 72 ? 'M' : 'L';
    } else {
      recommended = w < 85 ? 'XL' : 'XXL';
    }

    setCalculatedSize(recommended);
    setSelectedSize(recommended);
  };

  const handleAddToCart = (product: ShopProduct, isQuick: boolean = false) => {
    const colorToUse = isQuick ? product.colors[0] : (selectedColor || product.colors[0]);
    const sizeToUse = isQuick ? (product.sizes[2] || product.sizes[0]) : selectedSize;
    
    const { price: sizePrice } = getPriceForSize(sizeToUse);

    onAddToCart({
      productId: product.id,
      title: product.title,
      price: sizePrice,
      image: product.images[0],
      color: colorToUse,
      size: sizeToUse,
      quantity: 1
    });

    setQuickAddedId(product.id);
    setTimeout(() => {
      setQuickAddedId(null);
    }, 2000);

    if (!isQuick) {
      setSelectedProduct(null); // Close modal
    }
  };

  const handleDeleteProductClick = async (productId: string) => {
    try {
      if (onDeleteProduct) {
        await onDeleteProduct(productId);
      }
    } catch (err) {
      console.error(err);
      alert('Firestore delete blocked by Security Rules. The product has been deleted locally for preview!');
    }
  };

  const handleAddProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdminError(null);
    setAdminSuccess(null);

    if (!newProductForm.title.trim()) {
      setAdminError('Product title is required.');
      return;
    }

    // Generate a unique ID
    const customId = `prod-custom-${Date.now()}`;
    const imagesArray = newProductForm.image.trim() 
      ? [newProductForm.image.trim()] 
      : ['https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&q=80&w=800'];

    const productToCreate: ShopProduct = {
      id: customId,
      title: newProductForm.title,
      tagline: newProductForm.tagline || 'Premium Custom Print Design',
      price: Number(newProductForm.price),
      originalPrice: Number(newProductForm.originalPrice),
      category: newProductForm.category as any,
      rating: 4.8,
      reviewCount: 1,
      images: imagesArray,
      colors: newProductForm.colors,
      sizes: newProductForm.sizes,
      description: newProductForm.description || 'Premium custom garment tailored with rich Indian cotton fabric and precision printed graphics for comfort and durability.',
      specifications: newProductForm.specifications,
      reviews: [
        {
          id: 'rev-1',
          author: 'Store Admin',
          rating: 5,
          date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
          comment: 'Outstanding quality and comfort. Recommended print.',
          fit: 'True to Size',
          verified: true
        }
      ],
      isNewArrival: true
    };

    try {
      if (onAddProduct) {
        await onAddProduct(productToCreate);
      }
      setAdminSuccess('Product added successfully!');
      // Reset form
      setNewProductForm({
        title: '',
        tagline: '',
        price: 399,
        originalPrice: 899,
        category: 'streetwear',
        image: '',
        description: '',
        colors: [{ name: 'Deep Black', hex: '#000000' }],
        sizes: ['S', 'M', 'L', 'XL', 'XXL'],
        specifications: ['100% Super Combed Cotton Fabric', 'Heavyweight 240 GSM Material', 'Drop Shoulder Relaxed Fit', 'Durable High-Definition Print']
      });
      setIsAddProductOpen(false);
    } catch (err) {
      console.warn('Firestore write blocked by rules. Applying local-only state fallback for simulation:', err);
      setAdminError('Firestore write permission denied! (Secure rules blocked this write because you are not authenticated as content2u.sj@gmail.com). We applied the update locally for this session.');
    }
  };

  return (
    <div className="w-full bg-white dark:bg-neutral-950 min-h-screen text-neutral-900 dark:text-neutral-100 pb-28 pt-20 sm:pt-24 lg:pt-28">
      
      {/* Admin Control Center & Mode Banners - Strictly visible ONLY to Authenticated Admin */}
      {isAdmin && (
        <div className="max-w-7xl mx-auto px-4 pt-4">
          <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 mb-4 shadow-sm animate-fade-in">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-orange-500 text-white">
                <Lock className="h-4 w-4" />
              </div>
              <div className="text-left">
                <h4 className="text-xs font-black uppercase tracking-wider text-neutral-900 dark:text-white flex items-center gap-1.5 flex-wrap">
                  <span>Apparel Catalog Permissions</span>
                  <span className="px-2 py-0.5 rounded-full bg-orange-100 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400 text-[8px] font-black uppercase tracking-widest animate-pulse">
                    Admin Active
                  </span>
                </h4>
                <p className="text-[10px] text-neutral-500 dark:text-neutral-400 font-medium mt-0.5 leading-relaxed">
                  Authenticated as content2u.sj@gmail.com (Full write/delete permissions enabled).
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
              <button
                onClick={() => {
                  setAdminError(null);
                  setAdminSuccess(null);
                  setIsAddProductOpen(true);
                }}
                className="px-3.5 py-1.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-black text-[10px] uppercase tracking-wider shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="h-3 w-3" />
                <span>Add Product</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {loadingProducts && (
        <div className="max-w-7xl mx-auto px-4 py-8 flex items-center justify-center">
          <div className="flex flex-col items-center gap-2">
            <div className="h-8 w-8 rounded-full border-4 border-orange-500 border-t-transparent animate-spin" />
            <span className="text-xs text-neutral-500 font-extrabold uppercase tracking-widest">Loading catalog...</span>
          </div>
        </div>
      )}

      {/* SECTION 5: Two-Column Product Grid & Zero State */}
      <div className="max-w-7xl mx-auto px-4 py-4 min-h-[50vh]">
        {filteredProducts.length === 0 ? (
          <div className="py-20 text-center space-y-4">
            <div className="h-14 w-14 rounded-full bg-neutral-100 dark:bg-neutral-900 flex items-center justify-center text-neutral-400 mx-auto">
              <Search className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-bold text-base text-neutral-800 dark:text-white">No items found matching criteria</h3>
              <p className="text-xs text-neutral-400 mt-1 max-w-xs mx-auto font-medium">
                Try resetting filters or adjusting search parameters to explore the Jyothi collection.
              </p>
            </div>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setGenderFilter('all');
                setPriceRangeFilter('all');
                setShowWishlistOnly(false);
                setSearchQuery('');
              }}
              className="px-5 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:text-neutral-950 font-black text-xs uppercase tracking-wider cursor-pointer shadow-md transition-colors"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 items-stretch">
            {filteredProducts.map((product, idx) => {
              const discountAmount = product.originalPrice - product.price;
              const discountPercent = Math.round((discountAmount / product.originalPrice) * 100);
              
              // Custom brand list
              const brands: Record<string, string[]> = {
                streetwear: ["NEONOMAD", "TOKYO OVERCAST", "STREETWEAR CO.", "URBAN GLITCH"],
                hoodies: ["ROOKIES", "LOOPBACK CORE", "FLEECE THERM", "VINTAGE PASTEL"],
                boutique: ["KAVYA COUTURE", "MEERA ACCENTS", "PEACOCK DESIGN", "HERITAGE SILK"],
                sports: ["PRO ACTIVE", "DRI-FIT GEAR", "ATHLETIC SPORT", "VAPOR COOL"],
                accessories: ["VAPORWAVE ACCS", "CHRONOS METRIC", "HYBRID BASE", "ACCENT SPREE"]
              };
              const list = brands[product.category] || ["JYOTHI EXCLUSIVE"];
              const brandName = list[idx % list.length];
              
              // Extra Offer Price calculated dynamically (30% further off the already-discounted price)
              const offerPrice = Math.round((product.price * 0.7) / 10) * 10 - 1;

              // Alternating ad/bestseller overlay
              const showAdBadge = idx % 5 === 0;

              return (
                <motion.div
                  layout
                  key={product.id}
                  className="group flex flex-col h-full bg-white dark:bg-neutral-900 rounded-2xl overflow-hidden border border-neutral-100 dark:border-neutral-800 shadow-sm hover:shadow-md transition-all duration-300 relative"
                >
                  {/* Image container */}
                  <div 
                    onClick={() => handleOpenProductModal(product)}
                    className="relative aspect-[3/4] w-full overflow-hidden bg-neutral-50 dark:bg-neutral-950 cursor-zoom-in"
                  >
                    <img
                      src={product.images[0]}
                      alt={product.title}
                      className="h-full w-full object-cover object-center group-hover:scale-103 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />

                    {/* Left overlay badge: BESTSELLER or AD */}
                    <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10">
                      {showAdBadge ? (
                        <span className="px-1.5 py-0.5 rounded bg-white/90 backdrop-blur-sm text-neutral-800 dark:text-neutral-900 text-[8px] font-black uppercase tracking-wider border border-neutral-200">
                          AD
                        </span>
                      ) : (
                        <span className="px-1.5 py-0.5 rounded bg-black text-white text-[8px] font-black uppercase tracking-wider">
                          BESTSELLER
                        </span>
                      )}
                      {product.stockRemaining !== undefined && product.stockRemaining < 10 && (
                        <span className="px-1.5 py-0.5 rounded bg-red-600 text-white text-[8px] font-black uppercase tracking-wider flex items-center gap-1 shadow-sm animate-pulse">
                          <Flame className="h-2 w-2 animate-bounce fill-current text-white" />
                          Low Stock ({product.stockRemaining})
                        </span>
                      )}
                    </div>

                    {/* Bottom-left overlap sheets icon */}
                    <div className="absolute bottom-2.5 left-2.5 p-1 rounded bg-white/80 dark:bg-neutral-800/80 text-neutral-800 dark:text-neutral-200 z-10 shadow-sm">
                      <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <rect x="9" y="9" width="13" height="13" rx="1.5" ry="1.5"></rect>
                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                      </svg>
                    </div>

                    {/* Bottom-right interactive Wishlist heart counter pill */}
                    <button
                      onClick={(e) => toggleWishlist(product.id, e)}
                      className="absolute bottom-2.5 right-2.5 z-15 px-2 py-1 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white text-neutral-800 shadow-sm flex items-center gap-1 hover:scale-105 active:scale-95 transition-all cursor-pointer border border-neutral-200/50"
                    >
                      <Heart className={`h-3 w-3 ${
                        wishlist.includes(product.id) ? 'fill-rose-500 text-rose-500' : 'text-neutral-500'
                      }`} />
                      <span className="text-[9px] font-extrabold text-neutral-700">
                        {wishlist.includes(product.id) ? 'Saved' : `${(1.5 + (idx % 4)).toFixed(1)}K`}
                      </span>
                    </button>

                    {/* Admin Delete Action Overlay */}
                    {isCurrentlyAdmin && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (confirm(`Are you sure you want to permanently delete "${product.title}"?`)) {
                            handleDeleteProductClick(product.id);
                          }
                        }}
                        className="absolute top-2.5 right-2.5 z-30 p-2 rounded-full bg-red-600 hover:bg-red-700 text-white shadow-lg cursor-pointer hover:scale-105 active:scale-95 transition-all border border-red-500/20"
                        title="Delete Product"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>

                  {/* Content container */}
                  <div className="p-3 text-left flex-grow flex flex-col justify-between space-y-1">
                    <div>
                      {/* Brand name */}
                      <span className="block text-[10px] font-black uppercase text-neutral-900 dark:text-neutral-100 tracking-wider">
                        {brandName}
                      </span>
                      
                      {/* Product Title */}
                      <h3 
                        onClick={() => handleOpenProductModal(product)}
                        className="text-xs text-neutral-500 dark:text-neutral-400 font-medium leading-tight cursor-pointer hover:text-orange-500 transition-colors line-clamp-1 mt-0.5"
                      >
                        {product.title}
                      </h3>

                      {/* Stars rating row */}
                      <div className="flex items-center gap-0.5 mt-0.5">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star 
                            key={star} 
                            className={`h-2.5 w-2.5 ${
                              star <= Math.round(product.rating) 
                                ? 'fill-neutral-400 text-neutral-400' 
                                : 'text-neutral-200 dark:text-neutral-800'
                            }`} 
                          />
                        ))}
                        <span className="text-[9px] text-neutral-400 dark:text-neutral-500 font-extrabold ml-1">
                          ({product.reviewCount})
                        </span>
                      </div>

                      {product.stockRemaining !== undefined && product.stockRemaining < 10 && (
                        <div className="flex items-center gap-1 mt-1 text-[10px] text-red-600 dark:text-red-400 font-extrabold animate-pulse">
                          <Flame className="h-3 w-3 fill-current text-red-500" />
                          <span>Only {product.stockRemaining} left!</span>
                        </div>
                      )}
                    </div>

                    {/* Price and offers stack */}
                    <div className="pt-1.5 space-y-0.5">
                      <div className="flex items-baseline gap-1.5 flex-wrap">
                        <span className="text-xs font-black text-neutral-900 dark:text-white">
                          From ₹100
                        </span>
                        <span className="text-[10px] text-neutral-400 line-through font-medium">
                          ₹199
                        </span>
                        <span className="text-[10px] text-orange-600 dark:text-orange-400 font-extrabold">
                          (50% off)
                        </span>
                      </div>
                      
                      {/* Green Offer Price line from screenshot */}
                      <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">
                        Sizes up to ₹500
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* SECTION 7: Custom Interactive Account Profile Modaler */}
      <AnimatePresence>
        {showAccountModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/80 backdrop-blur-md">
            <div className="absolute inset-0 cursor-pointer" onClick={() => setShowAccountModal(false)} />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-md bg-white dark:bg-neutral-900 p-6 rounded-3xl shadow-xl z-10 text-left space-y-4 border border-neutral-200 dark:border-neutral-800"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-black uppercase tracking-wider text-neutral-900 dark:text-white flex items-center gap-1.5">
                  <User className="h-4 w-4 text-orange-500" /> Account Profile
                </h3>
                <button onClick={() => setShowAccountModal(false)} className="p-1 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer">
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="flex items-center gap-3 py-3 border-b border-neutral-100 dark:border-neutral-800">
                <div className="h-12 w-12 rounded-full bg-neutral-100 dark:bg-neutral-850 flex items-center justify-center text-lg font-black text-neutral-700 dark:text-neutral-300">
                  {locationName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h4 className="text-xs font-black uppercase text-neutral-900 dark:text-white">{locationName}</h4>
                  <p className="text-[10px] text-neutral-400 font-medium">Verified Jyothi Member • ID: {Math.floor(Math.random() * 89999 + 10000)}</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-3 bg-neutral-50 dark:bg-neutral-850 rounded-2xl">
                    <h5 className="text-[9px] font-black text-neutral-400 uppercase">Active Wishlist</h5>
                    <p className="text-lg font-black text-rose-500 mt-1">{wishlist.length} Items</p>
                  </div>
                  <div className="p-3 bg-neutral-50 dark:bg-neutral-850 rounded-2xl">
                    <h5 className="text-[9px] font-black text-neutral-400 uppercase">Coupons Applied</h5>
                    <p className="text-lg font-black text-emerald-500 mt-1">₹350 Saved</p>
                  </div>
                </div>

                <div className="space-y-1">
                  <h5 className="text-[10px] font-black text-neutral-400 uppercase px-1">Active Offers</h5>
                  <div className="p-2 bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 rounded-xl text-[10px] font-black uppercase tracking-wider text-center">
                    💥 Use Coupon "JYOTHI50" for flat 50% Off!
                  </div>
                </div>
              </div>

              <button
                onClick={() => setShowAccountModal(false)}
                className="w-full py-2.5 bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:text-neutral-950 font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-md cursor-pointer"
              >
                Done
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* SECTION 8: Fixed Bottom Navigation Bar matching screenshot */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-neutral-900/95 backdrop-blur-md border-t border-neutral-200/50 dark:border-neutral-800 py-3 px-4 shadow-xl">
        <div className="max-w-7xl mx-auto w-full flex items-center justify-around">
          
          {/* Home Tab */}
          <button 
            onClick={() => {
              setSelectedCategory('all');
              setGenderFilter('all');
              setPriceRangeFilter('all');
              setShowWishlistOnly(false);
              setSearchQuery('');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={`flex flex-col items-center gap-1 cursor-pointer transition-colors ${
              selectedCategory === 'all' && !showWishlistOnly && genderFilter === 'all' && priceRangeFilter === 'all'
                ? 'text-neutral-900 dark:text-white font-black'
                : 'text-neutral-400 dark:text-neutral-500 hover:text-neutral-600'
            }`}
          >
            <div className={`h-6 w-6 rounded-full flex items-center justify-center font-black text-[10px] shadow-sm transition-all ${
              selectedCategory === 'all' && !showWishlistOnly && genderFilter === 'all' && priceRangeFilter === 'all'
                ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 scale-105'
                : 'bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400'
            }`}>
              J
            </div>
            <span className="text-[10px] font-bold tracking-wider uppercase">Home</span>
          </button>
          
          {/* Right Now Tab */}
          <button 
            onClick={() => {
              setGenderFilter('all');
              setPriceRangeFilter('all');
              setShowWishlistOnly(false);
              setSelectedCategory('sale');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={`flex flex-col items-center gap-1 cursor-pointer transition-all ${
              selectedCategory === 'sale'
                ? 'text-orange-500 scale-105'
                : 'text-neutral-400 dark:text-neutral-500 hover:text-orange-500'
            }`}
          >
            <Flame className="h-5 w-5" />
            <span className="text-[10px] font-bold tracking-wider uppercase">Right Now</span>
          </button>
          
          {/* Design Studio Tab */}
          <button 
            onClick={onNavigateToCustomStudio}
            className="flex flex-col items-center gap-1 cursor-pointer text-neutral-400 dark:text-neutral-500 hover:text-orange-500 transition-all hover:scale-105"
          >
            <Sparkles className="h-5 w-5 text-orange-500 animate-pulse" />
            <span className="text-[10px] font-bold tracking-wider uppercase">Studio</span>
          </button>
          
          {/* Wishlist Tab */}
          <button 
            onClick={() => {
              setShowWishlistOnly(!showWishlistOnly);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={`flex flex-col items-center gap-1 cursor-pointer transition-all ${
              showWishlistOnly
                ? 'text-rose-500 scale-105'
                : 'text-neutral-400 dark:text-neutral-500 hover:text-rose-500'
            }`}
          >
            <Heart className={`h-5 w-5 ${showWishlistOnly ? 'fill-rose-500 text-rose-500' : ''}`} />
            <span className="text-[10px] font-bold tracking-wider uppercase">Wishlist</span>
          </button>
          
          {/* Account Tab */}
          <button 
            onClick={() => {
              if (onNavigateToAccount) {
                onNavigateToAccount();
              } else {
                setShowAccountModal(true);
              }
            }}
            className={`flex flex-col items-center gap-1 cursor-pointer transition-all ${
              showAccountModal
                ? 'text-sky-500 scale-105'
                : 'text-neutral-400 dark:text-neutral-500 hover:text-neutral-700'
            }`}
          >
            <User className="h-5 w-5" />
            <span className="text-[10px] font-bold tracking-wider uppercase">Account</span>
          </button>

        </div>
      </div>

      {/* SECTION 6: Detailed Jyothi Product Modal Backdrop */}
      <AnimatePresence>
        {selectedProduct && (
          <div className="fixed inset-0 z-50 flex items-start md:items-center justify-center p-4 bg-neutral-950/80 backdrop-blur-md overflow-y-auto">
            <div className="absolute inset-0 cursor-pointer" onClick={() => setSelectedProduct(null)} />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-4xl bg-white dark:bg-neutral-900 rounded-3xl shadow-2xl overflow-hidden border border-neutral-200 dark:border-neutral-800 z-10 my-8 flex flex-col md:flex-row"
            >
              <button
                onClick={() => setSelectedProduct(null)}
                className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/60 text-white hover:bg-orange-500 hover:scale-105 transition-all cursor-pointer border border-white/10"
              >
                <X className="h-5 w-5" />
              </button>

              {/* LEFT: Slideshow Media Deck */}
              <div className="w-full md:w-1/2 bg-neutral-50 dark:bg-neutral-950 p-6 flex flex-col items-center justify-center min-h-[350px] relative border-b md:border-b-0 md:border-r border-neutral-200 dark:border-neutral-800">
                <div className="relative aspect-[3/4] w-full max-w-[280px] rounded-2xl overflow-hidden border border-neutral-200 dark:border-neutral-800 bg-white">
                  <img
                    src={selectedProduct.images[activeImageIndex]}
                    alt={selectedProduct.title}
                    className="h-full w-full object-cover object-center"
                    referrerPolicy="no-referrer"
                  />
                  
                  {/* Jyothi Guarantee Overlays */}
                  <span className="absolute top-3 right-3 px-2 py-1 rounded bg-black/60 backdrop-blur-sm text-[8px] font-black text-white tracking-widest uppercase">
                    100% SECURE
                  </span>
                </div>

                <div className="flex gap-2.5 mt-4">
                  {selectedProduct.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIndex(idx)}
                      className={`h-1.5 w-6 rounded-full transition-all cursor-pointer ${
                        activeImageIndex === idx ? 'bg-orange-500' : 'bg-neutral-300 dark:bg-neutral-800'
                      }`}
                    />
                  ))}
                </div>

                <div className="mt-6 flex flex-col gap-1 text-center">
                  <div className="flex items-center justify-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-neutral-400">
                    <Award className="h-4 w-4 text-orange-500" />
                    <span>JYOTHI TRUST CERTIFICATE</span>
                  </div>
                  <span className="text-[9px] text-neutral-400 font-semibold">Easy 10-day return policy. No questions asked.</span>
                </div>
              </div>

              {/* RIGHT: Product specifications, selectors, and Checkout CTAs */}
              <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col justify-between text-left space-y-4 overflow-y-auto max-h-[85vh]">
                
                <div className="space-y-1.5">
                  <span className="px-2 py-0.5 rounded bg-orange-500/10 text-orange-600 dark:text-orange-400 text-[9px] font-black uppercase tracking-widest">
                    {selectedProduct.category} COLLECTION
                  </span>
                  <div className="flex justify-between items-start gap-4">
                    <h2 className="text-xl md:text-2xl font-black text-neutral-900 dark:text-white leading-tight">
                      {selectedProduct.title}
                    </h2>
                    <button
                      onClick={() => toggleWishlist(selectedProduct.id)}
                      className="p-2.5 rounded-full bg-neutral-100 hover:bg-rose-500/10 dark:bg-neutral-800 dark:hover:bg-rose-500/20 text-neutral-600 dark:text-neutral-300 hover:scale-105 active:scale-95 transition-all cursor-pointer shrink-0"
                      title={wishlist.includes(selectedProduct.id) ? "Remove from Wishlist" : "Add to Wishlist"}
                    >
                      <Heart className={`h-5 w-5 transition-colors ${
                        wishlist.includes(selectedProduct.id) ? 'fill-rose-500 text-rose-500' : 'text-neutral-500 dark:text-neutral-400'
                      }`} />
                    </button>
                  </div>
                  <p className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
                    {selectedProduct.tagline}
                  </p>
                </div>

                <div className="flex items-center justify-between border-y border-neutral-150/60 dark:border-neutral-800 py-3">
                  <div className="space-y-0.5">
                    <span className="block text-[8px] font-black uppercase tracking-widest text-neutral-400">Jyothi Special Deal Price</span>
                    <div className="flex items-baseline gap-2">
                      <span className="text-xl sm:text-2xl font-black text-neutral-900 dark:text-white">
                        ₹{getPriceForSize(selectedSize).price}
                      </span>
                      <span className="text-xs text-neutral-400 line-through font-semibold">
                        ₹{getPriceForSize(selectedSize).originalPrice}
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="inline-block px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[9px] font-black uppercase tracking-wider animate-pulse">
                      🏷️ SAVE EXTRA ₹{getPriceForSize(selectedSize).originalPrice - getPriceForSize(selectedSize).price} NOW
                    </span>
                    {selectedProduct.stockRemaining !== undefined && selectedProduct.stockRemaining < 10 ? (
                      <span className="block text-[10px] text-red-600 dark:text-red-400 font-extrabold mt-1 uppercase tracking-wider animate-pulse">
                        ⚠️ HURRY, ONLY {selectedProduct.stockRemaining} UNITS LEFT!
                      </span>
                    ) : (
                      <span className="block text-[8px] text-neutral-400 font-bold mt-1 uppercase tracking-widest">
                        IN STOCK • SHIPS IMMEDIATELY
                      </span>
                    )}
                  </div>
                </div>

                <p className="text-xs text-neutral-500 dark:text-neutral-400 font-semibold leading-relaxed">
                  {selectedProduct.description}
                </p>

                {/* Colors */}
                <div className="space-y-2">
                  <label className="block text-[10px] font-black uppercase text-neutral-400 tracking-wider">
                    Fabric Dye Color: <span className="text-neutral-800 dark:text-white font-extrabold">{selectedColor?.name}</span>
                  </label>
                  <div className="flex gap-2">
                    {selectedProduct.colors.map(col => (
                      <button
                        key={col.name}
                        onClick={() => setSelectedColor(col)}
                        className={`h-7 w-7 rounded-full border-2 cursor-pointer transition-all ${
                          selectedColor?.name === col.name ? 'border-orange-500 scale-110' : 'border-transparent'
                        }`}
                        style={{ backgroundColor: col.hex }}
                        title={col.name}
                      />
                    ))}
                  </div>
                </div>

                {/* Sizes */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <label className="block text-[10px] font-black uppercase text-neutral-400 tracking-wider">
                      Select Sizing: <span className="text-neutral-800 dark:text-white font-extrabold">{selectedSize}</span>
                    </label>
                    <button
                      onClick={() => setShowFitAdvisor(!showFitAdvisor)}
                      className="text-[9px] font-black uppercase text-orange-500 tracking-widest flex items-center gap-1 hover:underline cursor-pointer"
                    >
                      <Ruler className="h-3.5 w-3.5" />
                      Fit Advisor
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {selectedProduct.sizes.map(sz => (
                      <button
                        key={sz}
                        onClick={() => setSelectedSize(sz)}
                        className={`h-9 w-11 rounded-xl text-xs font-black transition-all cursor-pointer ${
                          selectedSize === sz
                            ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 shadow-md'
                            : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-300'
                        }`}
                      >
                        {sz}
                      </button>
                    ))}
                  </div>

                  {/* Sizing Calc */}
                  <AnimatePresence>
                    {showFitAdvisor && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden bg-neutral-50 dark:bg-neutral-950 rounded-2xl p-4 border border-neutral-150/60 dark:border-neutral-800 space-y-3"
                      >
                        <span className="text-[9px] font-black uppercase text-orange-500 tracking-wider block">
                          Measure Perfect Sizing Fit
                        </span>
                        <form onSubmit={calculateFitRecommendation} className="grid grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <label className="block text-[8px] font-bold text-neutral-400 uppercase">Height (e.g. 5.9)</label>
                            <input
                              type="text"
                              value={fitHeight}
                              onChange={(e) => setFitHeight(e.target.value)}
                              className="w-full px-3 py-2 text-xs font-bold bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg focus:outline-none focus:border-orange-500"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="block text-[8px] font-bold text-neutral-400 uppercase">Weight (in kg)</label>
                            <input
                              type="text"
                              value={fitWeight}
                              onChange={(e) => setFitWeight(e.target.value)}
                              className="w-full px-3 py-2 text-xs font-bold bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg focus:outline-none focus:border-orange-500"
                            />
                          </div>
                          <button
                            type="submit"
                            className="col-span-2 py-2.5 rounded-xl bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 font-black text-[10px] uppercase tracking-wider cursor-pointer"
                          >
                            Calculate Recommended Sizing
                          </button>
                        </form>

                        {calculatedSize && (
                          <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-center text-xs font-bold text-emerald-600 dark:text-emerald-400">
                            🎯 Perfect fit is size &ldquo;{calculatedSize}&rdquo; for an optimized Jyothi drape!
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Spec List */}
                <div className="space-y-2">
                  <label className="block text-[10px] font-black uppercase text-neutral-400 tracking-wider">
                    Premium Highlights Specifications
                  </label>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 text-[11px] font-semibold text-neutral-600 dark:text-neutral-400 leading-normal list-disc pl-4">
                    {selectedProduct.specifications.map((spec, index) => (
                      <li key={index}>{spec}</li>
                    ))}
                  </ul>
                </div>

                <button
                  onClick={() => handleAddToCart(selectedProduct)}
                  className="w-full py-4 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white font-extrabold text-xs uppercase tracking-widest flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-lg shadow-orange-500/10 active:scale-[0.98]"
                >
                  <ShoppingBag className="h-4.5 w-4.5" />
                  <span>Add To Shopping Bag</span>
                </button>

                {/* Customer Review Snapshot */}
                <div className="border-t border-neutral-150/60 dark:border-neutral-800 pt-3.5 space-y-2 text-xs">
                  <span className="text-[9px] font-black uppercase text-neutral-400 tracking-wider block">
                    Top Customer Review Verified
                  </span>
                  {selectedProduct.reviews[0] && (
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-neutral-800 dark:text-neutral-200">
                          {selectedProduct.reviews[0].author}
                        </span>
                        <span className="text-[9px] text-neutral-400">
                          {selectedProduct.reviews[0].date}
                        </span>
                      </div>
                      <p className="italic text-neutral-400 leading-relaxed font-semibold">
                        &ldquo;{selectedProduct.reviews[0].comment}&rdquo;
                      </p>
                    </div>
                  )}
                </div>

              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* SECTION: Recently Viewed Products */}
      {recentlyViewedProducts.length > 0 && (
        <div className="border-t border-neutral-200/60 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/30 py-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-left">
            <div className="flex justify-between items-center mb-6">
              <div>
                <span className="block text-[10px] font-black text-orange-500 uppercase tracking-widest mb-1">
                  Based on your browsing history
                </span>
                <h3 className="text-xl font-black text-neutral-900 dark:text-white uppercase tracking-tight">
                  Recently Viewed Products
                </h3>
              </div>
              <button 
                onClick={() => setRecentlyViewed([])}
                className="text-xs font-black text-neutral-400 hover:text-orange-500 uppercase tracking-wider transition-colors cursor-pointer"
              >
                Clear History
              </button>
            </div>

            <div className="flex gap-4 sm:gap-6 overflow-x-auto pb-4 scrollbar-none">
              {recentlyViewedProducts.map((product) => (
                <div 
                  key={`recent-${product.id}`}
                  onClick={() => handleOpenProductModal(product)}
                  className="w-40 sm:w-48 shrink-0 bg-white dark:bg-neutral-900 rounded-xl overflow-hidden border border-neutral-150/60 dark:border-neutral-800 shadow-sm hover:shadow-md transition-all cursor-zoom-in group"
                >
                  <div className="aspect-[3/4] relative overflow-hidden bg-neutral-100 dark:bg-neutral-950">
                    <img
                      src={product.images[0]}
                      alt={product.title}
                      className="h-full w-full object-cover object-center group-hover:scale-103 transition-transform duration-300"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute bottom-1.5 left-1.5 px-1 py-0.5 rounded bg-black/70 text-white text-[8px] font-black flex items-center gap-0.5 z-10">
                      <Star className="h-2 w-2 text-yellow-400 fill-yellow-400" />
                      <span>{product.rating}</span>
                    </div>
                  </div>
                  <div className="p-2 text-left space-y-1">
                    <h4 className="font-bold text-[11px] text-neutral-800 dark:text-white truncate group-hover:text-orange-500 transition-colors">
                      {product.title}
                    </h4>
                    <div className="flex items-baseline gap-1.5">
                      <span className="font-black text-xs text-neutral-900 dark:text-white">
                        ₹{product.price}
                      </span>
                      <span className="text-[9px] text-neutral-400 line-through font-semibold">
                        ₹{product.originalPrice}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Trust guarantees badge grid */}
      <div className="bg-neutral-50 dark:bg-neutral-900 border-t border-neutral-200/60 dark:border-neutral-800 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { icon: <Truck className="h-7 w-7 text-orange-500" />, title: "Free Next-Day Shipping", desc: "For all prepaid order values above ₹999 across major cities" },
            { icon: <RotateCcw className="h-7 w-7 text-orange-500" />, title: "Easy 10-Day Returns", desc: "No questions asked easy pick-up right from your doorstep" },
            { icon: <ShieldCheck className="h-7 w-7 text-orange-500" />, title: "100% Quality Guaranteed", desc: "Premium fabrics tested for indanthrene dye fastness" },
            { icon: <Tag className="h-7 w-7 text-orange-500" />, title: "Best Price Match", desc: "Real manufacturing prices directly passed to our retail family" }
          ].map((item, idx) => (
            <div key={idx} className="flex gap-4 text-left items-start">
              <div className="shrink-0 p-2.5 rounded-2xl bg-white dark:bg-neutral-800 shadow-sm border border-neutral-200/50 dark:border-neutral-700">
                {item.icon}
              </div>
              <div className="space-y-1">
                <h4 className="font-black text-xs uppercase text-neutral-800 dark:text-white tracking-wider">{item.title}</h4>
                <p className="text-[11px] text-neutral-400 font-semibold leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Floating WhatsApp symbol button - positioned upwards, away from footer/bottom navigation */}
      <motion.a
        href={`https://wa.me/919182703766?text=${encodeURIComponent("Hello Jyothi Print Studio! I'm viewing your products and would like to inquire about custom requirements.")}`}
        target="_blank"
        rel="noopener noreferrer"
        whileHover={{ scale: 1.1, y: -2 }}
        whileTap={{ scale: 0.9 }}
        className="fixed bottom-32 right-6 z-45 p-4 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white shadow-xl hover:shadow-emerald-500/30 transition-all cursor-pointer border border-emerald-400/20 flex items-center justify-center group"
        title="Chat on WhatsApp"
      >
        <span className="absolute -inset-1 rounded-full bg-emerald-500/20 blur-sm opacity-0 group-hover:opacity-100 transition-opacity animate-pulse pointer-events-none" />
        <svg 
          className="h-6 w-6 fill-current" 
          viewBox="0 0 24 24" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.713-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.625 1.451 5.437.002 9.861-4.366 9.864-9.736.001-2.596-1.002-5.037-2.83-6.87C16.471 2.163 14.043 1.157 11.451 1.15c-5.438 0-9.867 4.367-9.87 9.742-.001 1.954.512 3.86 1.482 5.585L2.01 22.013l5.837-1.523c.31.18.513.29.8.464zM16.634 13.91c-.27-.135-1.597-.788-1.845-.878-.248-.09-.43-.136-.61.135-.18.272-.697.879-.854 1.059-.157.18-.315.203-.585.068-.27-.136-1.14-.42-2.172-1.341-.803-.717-1.345-1.603-1.502-1.874-.157-.271-.017-.417.118-.552.122-.121.27-.315.405-.473.135-.158.18-.271.27-.451.09-.18.045-.339-.022-.474-.068-.135-.61-1.472-.836-2.013-.22-.53-.442-.458-.61-.466-.157-.008-.338-.01-.52-.01-.18 0-.473.067-.72.339-.247.271-.944.924-.944 2.253 0 1.329.967 2.61 1.102 2.79.135.18 1.9 2.901 4.6 4.068.643.278 1.144.444 1.536.568.646.206 1.233.176 1.697.108.517-.076 1.598-.653 1.823-1.282.225-.63.225-1.17.157-1.282-.067-.113-.247-.18-.517-.315z" />
        </svg>
      </motion.a>

      {/* SECTION 9: Add Product Modal Form */}
      <AnimatePresence>
        {isAddProductOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAddProductOpen(false)}
              className="absolute inset-0 bg-neutral-900/60 backdrop-blur-sm"
            />

            {/* Modal Body */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-lg bg-white dark:bg-neutral-900 rounded-3xl border border-neutral-200 dark:border-neutral-800 shadow-2xl p-6 overflow-y-auto max-h-[90vh] z-10 text-left"
            >
              <button
                onClick={() => setIsAddProductOpen(false)}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-400 hover:text-neutral-600 transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="flex items-center gap-2 mb-4">
                <div className="h-2.5 w-2.5 rounded-full bg-orange-500" />
                <h3 className="font-black text-sm uppercase tracking-wider text-neutral-900 dark:text-white">Add New Catalog Product</h3>
              </div>

              {adminError && (
                <div className="p-3 mb-4 rounded-xl bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/30 text-red-600 dark:text-red-400 text-xs font-semibold flex items-start gap-2">
                  <ShieldAlert className="h-4 w-4 shrink-0 mt-0.5" />
                  <span>{adminError}</span>
                </div>
              )}

              {adminSuccess && (
                <div className="p-3 mb-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30 text-emerald-600 dark:text-emerald-400 text-xs font-semibold flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 shrink-0" />
                  <span>{adminSuccess}</span>
                </div>
              )}

              <form onSubmit={handleAddProductSubmit} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-black uppercase text-neutral-400 tracking-wider mb-1">Product Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Heavyweight Club Oversized Tee"
                    value={newProductForm.title}
                    onChange={(e) => setNewProductForm(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-white text-xs font-semibold focus:outline-none focus:border-orange-500 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase text-neutral-400 tracking-wider mb-1">Tagline *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 240 GSM Luxury Streetwear Cotton"
                    value={newProductForm.tagline}
                    onChange={(e) => setNewProductForm(prev => ({ ...prev, tagline: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-white text-xs font-semibold focus:outline-none focus:border-orange-500 transition-all"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-black uppercase text-neutral-400 tracking-wider mb-1">Category *</label>
                    <select
                      value={newProductForm.category}
                      onChange={(e) => setNewProductForm(prev => ({ ...prev, category: e.target.value }))}
                      className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-white text-xs font-semibold focus:outline-none focus:border-orange-500 transition-all"
                    >
                      <option value="streetwear">Streetwear (T-Shirts)</option>
                      <option value="hoodies">Hoodies & Jackets</option>
                      <option value="boutique">Sarees & Blouses</option>
                      <option value="sports">Sports Jerseys</option>
                      <option value="accessories">Accessories</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-black uppercase text-neutral-400 tracking-wider mb-1">Price (INR) *</label>
                    <input
                      type="number"
                      required
                      min="1"
                      placeholder="e.g. 399"
                      value={newProductForm.price}
                      onChange={(e) => setNewProductForm(prev => ({ ...prev, price: Number(e.target.value) }))}
                      className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-white text-xs font-semibold focus:outline-none focus:border-orange-500 transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-black uppercase text-neutral-400 tracking-wider mb-1">Original Price (INR) *</label>
                    <input
                      type="number"
                      required
                      min="1"
                      placeholder="e.g. 899"
                      value={newProductForm.originalPrice}
                      onChange={(e) => setNewProductForm(prev => ({ ...prev, originalPrice: Number(e.target.value) }))}
                      className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-white text-xs font-semibold focus:outline-none focus:border-orange-500 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-black uppercase text-neutral-400 tracking-wider mb-1">Product Image URL (Optional)</label>
                    <input
                      type="text"
                      placeholder="Leave blank for premium Unsplash T-shirt"
                      value={newProductForm.image}
                      onChange={(e) => setNewProductForm(prev => ({ ...prev, image: e.target.value }))}
                      className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-white text-xs font-semibold focus:outline-none focus:border-orange-500 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase text-neutral-400 tracking-wider mb-1">Product Description *</label>
                  <textarea
                    required
                    rows={2}
                    placeholder="Describe materials, details, fit guidelines..."
                    value={newProductForm.description}
                    onChange={(e) => setNewProductForm(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-white text-xs font-semibold focus:outline-none focus:border-orange-500 transition-all"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white font-black text-xs uppercase tracking-wider shadow-md shadow-orange-500/20 transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <ShieldCheck className="h-4 w-4" />
                  <span>Publish to Catalog</span>
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
