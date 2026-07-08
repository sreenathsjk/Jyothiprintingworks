/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import WhyChooseUs from './components/WhyChooseUs';
import Services from './components/Services';
import Gallery from './components/Gallery';
import OrderProcess from './components/OrderProcess';
import Stats from './components/Stats';
import Testimonials from './components/Testimonials';
import FAQs from './components/FAQs';
import AboutUs from './components/AboutUs';
import BulkOrders from './components/BulkOrders';
import Contact from './components/Contact';
import Footer from './components/Footer';
import { ArrowLeft } from 'lucide-react';
import Shop from './components/Shop';
import CustomStudio from './components/CustomStudio';
import CartDrawer from './components/CartDrawer';
import ExitIntentPopup from './components/ExitIntentPopup';
import CheckoutModal from './components/CheckoutModal';
import { CartItem, User } from './types';
import TrackOrder from './components/TrackOrder';
import MyOrders from './components/MyOrders';
import AuthModal from './components/AuthModal';
import { auth, db } from './lib/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc, collection, getDocs, setDoc, deleteDoc } from 'firebase/firestore';
import { shopProducts } from './data/shopProducts';
import { ShopProduct } from './types';

export default function App() {
  const [currentPage, setCurrentPage] = useState<string>('home');
  const [navigationHistory, setNavigationHistory] = useState<string[]>([]);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [prefilledService, setPrefilledService] = useState<string>('');
  const [prefilledOrderId, setPrefilledOrderId] = useState<string>('');

  // Authentication & session state
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem('jyothi_logged_in_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [isAuthOpen, setIsAuthOpen] = useState<boolean>(false);

  // Products Catalog States with Firestore Synchronizer
  const [products, setProducts] = useState<ShopProduct[]>([]);
  const [loadingProducts, setLoadingProducts] = useState<boolean>(true);

  // Load and seed products in Firestore
  useEffect(() => {
    const fetchAndSeedProducts = async () => {
      try {
        setLoadingProducts(true);
        const querySnapshot = await getDocs(collection(db, 'products'));
        if (querySnapshot.empty) {
          console.log('Seeding default products to Firestore...');
          const seedList: ShopProduct[] = [];
          for (const prod of shopProducts) {
            await setDoc(doc(db, 'products', prod.id), prod);
            seedList.push(prod);
          }
          setProducts(seedList);
        } else {
          const list: ShopProduct[] = [];
          querySnapshot.forEach((docSnap) => {
            list.push(docSnap.data() as ShopProduct);
          });
          // Sort to maintain order
          list.sort((a, b) => a.id.localeCompare(b.id));
          setProducts(list);
        }
      } catch (err) {
        console.warn('Error loading products from Firestore, using static list:', err);
        setProducts(shopProducts);
      } finally {
        setLoadingProducts(false);
      }
    };

    fetchAndSeedProducts();
  }, []);

  const handleAddProduct = async (newProduct: ShopProduct) => {
    try {
      await setDoc(doc(db, 'products', newProduct.id), newProduct);
      setProducts(prev => {
        const index = prev.findIndex(p => p.id === newProduct.id);
        if (index > -1) {
          const updated = [...prev];
          updated[index] = newProduct;
          return updated;
        }
        return [...prev, newProduct];
      });
    } catch (err) {
      console.error('Error adding product to Firestore:', err);
      // Fallback: update local state if Firestore write is blocked
      setProducts(prev => {
        const index = prev.findIndex(p => p.id === newProduct.id);
        if (index > -1) {
          const updated = [...prev];
          updated[index] = newProduct;
          return updated;
        }
        return [...prev, newProduct];
      });
      throw err;
    }
  };

  const handleDeleteProduct = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'products', id));
      setProducts(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      console.error('Error deleting product from Firestore:', err);
      // Fallback: update local state
      setProducts(prev => prev.filter(p => p.id !== id));
      throw err;
    }
  };
  const [pendingCheckout, setPendingCheckout] = useState<{ discount: number; total: number; coupon: string } | null>(null);

  // Premium E-commerce Cart & Checkout States
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('jyothi_print_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [exitIntentCoupon, setExitIntentCoupon] = useState<string>('');
  const [isCheckoutOpen, setIsCheckoutOpen] = useState<boolean>(false);
  const [checkoutDetails, setCheckoutDetails] = useState({
    discount: 0,
    total: 0,
    coupon: ''
  });

  // Lifted Wishlist States with high durability localStorage persistence
  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('jyothi_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [showWishlistOnly, setShowWishlistOnly] = useState<boolean>(false);

  // Sync wishlist to local storage
  useEffect(() => {
    try {
      localStorage.setItem('jyothi_wishlist', JSON.stringify(wishlist));
    } catch (err) {
      console.error('Failed to sync wishlist: ', err);
    }
  }, [wishlist]);

  // Sync cart to local storage
  useEffect(() => {
    try {
      localStorage.setItem('jyothi_print_cart', JSON.stringify(cart));
    } catch (err) {
      console.error('Failed to sync shopping bag: ', err);
    }
  }, [cart]);

  // Cart operations
  const handleAddToCart = (newItem: Omit<CartItem, 'id'>) => {
    setCart(prevCart => {
      // Create a unique composite ID based on size, color, design specifications
      const hash = newItem.isCustom && newItem.customDesign 
        ? `-${newItem.customDesign.printMethod}-${newItem.customDesign.customText.slice(0, 5)}`
        : '';
      const compositeId = `${newItem.productId}-${newItem.color.name}-${newItem.size}${hash}`;

      const existingIndex = prevCart.findIndex(item => item.id === compositeId);
      if (existingIndex > -1) {
        const updated = [...prevCart];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + newItem.quantity
        };
        return updated;
      }

      return [...prevCart, { ...newItem, id: compositeId }];
    });
    
    // Automatically slide out the Cart Drawer to provide instant shopping bag feedback
    setIsCartOpen(true);
  };

  const handleUpdateCartQuantity = (id: string, newQty: number) => {
    if (newQty <= 0) {
      setCart(prev => prev.filter(item => item.id !== id));
    } else {
      setCart(prev => prev.map(item => item.id === id ? { ...item, quantity: newQty } : item));
    }
  };

  const handleRemoveCartItem = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const handleLaunchCheckout = (discount: number, total: number, coupon: string) => {
    if (!currentUser) {
      setPendingCheckout({ discount, total, coupon });
      setIsCartOpen(false);
      setIsAuthOpen(true);
      return;
    }
    setCheckoutDetails({ discount, total, coupon });
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const handleLoginSuccess = (user: User) => {
    setCurrentUser(user);
    if (pendingCheckout) {
      setCheckoutDetails(pendingCheckout);
      setPendingCheckout(null);
      setIsCheckoutOpen(true);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem('jyothi_logged_in_user');
      setCurrentUser(null);
      setPendingCheckout(null);
      if (currentPage === 'my-orders') {
        setCurrentPage('home');
      }
    } catch (err) {
      console.error('Failed to logout:', err);
    }
  };

  // Synchronize Firebase Auth State across boots & reloads
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        try {
          const userDocRef = doc(db, 'users', fbUser.uid);
          const userDoc = await getDoc(userDocRef);
          if (userDoc.exists()) {
            const data = userDoc.data();
            const loggedInUser: User = {
              id: fbUser.uid,
              name: data.name || fbUser.displayName || 'Google Customer',
              email: fbUser.email || fbUser.email || '',
              phone: data.phone || fbUser.phoneNumber || ''
            };
            setCurrentUser(loggedInUser);
            localStorage.setItem('jyothi_logged_in_user', JSON.stringify(loggedInUser));
          } else {
            const loggedInUser: User = {
              id: fbUser.uid,
              name: fbUser.displayName || 'Google Customer',
              email: fbUser.email || '',
              phone: fbUser.phoneNumber || ''
            };
            setCurrentUser(loggedInUser);
            localStorage.setItem('jyothi_logged_in_user', JSON.stringify(loggedInUser));
          }
        } catch (err) {
          console.warn('Could not sync user profile from Firestore, falling back:', err);
        }
      } else {
        // If logged out on Firebase, ensure we don't clear offline-only users (IDs starting with 'usr-')
        const saved = localStorage.getItem('jyothi_logged_in_user');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed.id && !parsed.id.startsWith('usr-')) {
            setCurrentUser(null);
            localStorage.removeItem('jyothi_logged_in_user');
          }
        }
      }
    });
    return () => unsubscribe();
  }, []);

  const handleOrderConfirmed = () => {
    setCart([]); // Clear cart
    setIsCheckoutOpen(false);
  };

  // Handle Hash Location on Boot and support browser back/forward buttons
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      const validPages = ['home', 'about', 'services', 'gallery', 'bulk-orders', 'faqs', 'contact', 'shop', 'custom-studio', 'track-order', 'my-orders'];
      if (hash && validPages.includes(hash)) {
        setCurrentPage(hash);
      } else {
        setCurrentPage('home');
      }
    };

    // Run on boot
    handleHashChange();

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Synchronize navigation history stack when page changes
  useEffect(() => {
    if (!currentPage) return;
    setNavigationHistory(prev => {
      // If stack is empty, initialize with current page
      if (prev.length === 0) {
        return [currentPage];
      }
      // If we are already at the top of the stack, no change needed
      if (prev[prev.length - 1] === currentPage) {
        return prev;
      }
      // If the target is the second-to-top element, we are popping the stack (back navigation)
      if (prev.length > 1 && prev[prev.length - 2] === currentPage) {
        return prev.slice(0, -1);
      }
      // Otherwise, push new page onto stack
      return [...prev, currentPage];
    });
  }, [currentPage]);

  // Smooth scroll to top on page change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  // Sync visual Dark Mode body class
  useEffect(() => {
    const root = window.document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [isDarkMode]);

  // SEO: Dynamic Page Titles and Header Meta Descriptions
  useEffect(() => {
    let title = 'Jyothi Printing Works | Premium Custom Printing Studio';
    let desc = 'Premium custom printing studio specializing in high-quality custom T-shirts, blouse printing, sports jerseys, corporate uniforms, and bulk orders.';

    switch (currentPage) {
      case 'about':
        title = 'About Us | Jyothi Printing Works';
        desc = 'Discover the legacy of India’s top custom printing studio. We supply combed cotton fabrics combined with screen, digital, and embroidery crafts.';
        break;
      case 'services':
        title = 'Our Services | Custom Fabric & Apparel Printing';
        desc = 'Explore 12+ custom printing services including t-shirt screen printing, saree blouse embroidery, and full sublimation athletic jerseys.';
        break;
      case 'gallery':
        title = 'Print Workshop Gallery | Fabric details';
        desc = 'Browse our immersive closeups of raw linen, silk patterns, embroidery screens, and daily automatic carousel printing floor operations.';
        break;
      case 'bulk-orders':
        title = 'Bulk Orders & Pricing Estimator | Custom apparel';
        desc = 'Calculate your bulk custom t-shirt or jersey pricing on-the-fly with our interactive slider. Get wholesale discounts up to 25% off!';
        break;
      case 'faqs':
        title = 'Frequently Asked Questions | Help Center';
        desc = 'Find quick support answers regarding Minimum Order Quantities (MOQ), 48-hour express delivery, and payment terms.';
        break;
      case 'contact':
        title = 'Get a Free Quote | Contact Jyothi Printing Works';
        desc = 'Inquire about fabric templates or file preparation guidelines. Submit your requirement to get an official quote in under 2 hours.';
        break;
      case 'shop':
        title = 'Premium Custom Print Shop | Jyothi Apparel';
        desc = 'Browse our immersive streetwear, customized oversized graphic tees, heavyweight fleeced hoodies, and handloom designer blouses.';
        break;
      case 'custom-studio':
        title = 'Interactive 3D Apparel Customizer | Custom Print';
        desc = 'Create and preview your own streetwear designs in our live visual workshop. Choose garments, fabric colors, custom slogans, and add to cart!';
        break;
      case 'my-orders':
        title = 'My Orders History | Jyothi Printing Works';
        desc = 'View your recent print designs, order timelines, and live workshop status. Track custom screen setups and automatic print runs in real-time.';
        break;
      case 'track-order':
        title = 'Track Print Job Status | Jyothi Printing Works';
        desc = 'Look up your custom print job or design production progress in real-time. Enter your Order ID to see live steps of your custom garment run.';
        break;
      default:
        break;
    }

    document.title = title;

    // Dynamically insert/update metadata descriptors
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute('content', desc);

    // Dynamically inject OpenGraph SEO Tags
    const ogTitle = document.querySelector('meta[property="og:title"]') || document.createElement('meta');
    ogTitle.setAttribute('property', 'og:title');
    ogTitle.setAttribute('content', title);
    document.head.appendChild(ogTitle);

    const ogDesc = document.querySelector('meta[property="og:description"]') || document.createElement('meta');
    ogDesc.setAttribute('property', 'og:description');
    ogDesc.setAttribute('content', desc);
    document.head.appendChild(ogDesc);
  }, [currentPage]);

  // SEO: Dynamically inject Google LocalBusiness JSON-LD Schema Markup
  useEffect(() => {
    const existingScript = document.getElementById('jyothi-schema-markup');
    if (existingScript) {
      existingScript.remove();
    }

    const schema = {
      '@context': 'https://schema.org',
      '@type': 'LocalBusiness',
      'name': 'Jyothi Printing Works',
      'image': 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=800',
      'telephone': '+919182703766',
      'email': 'info@jyothiprintingworks.com',
      'address': {
        '@type': 'PostalAddress',
        'streetAddress': 'Industrial Estate',
        'addressLocality': 'Bengaluru',
        'addressRegion': 'Karnataka',
        'postalCode': '560001',
        'addressCountry': 'IN'
      },
      'geo': {
        '@type': 'GeoCoordinates',
        'latitude': '12.971599',
        'longitude': '77.591244'
      },
      'url': 'https://jyothiprintingworks.com',
      'openingHoursSpecification': {
        '@type': 'OpeningHoursSpecification',
        'dayOfWeek': [
          'Monday',
          'Tuesday',
          'Wednesday',
          'Thursday',
          'Friday',
          'Saturday'
        ],
        'opens': '09:00',
        'closes': '20:00'
      }
    };

    const script = document.createElement('script');
    script.id = 'jyothi-schema-markup';
    script.type = 'application/ld+json';
    script.innerHTML = JSON.stringify(schema);
    document.head.appendChild(script);
  }, []);

  // Coordinate custom quick quotes from Service modals
  const handleServiceInquiry = (serviceName: string) => {
    setPrefilledService(serviceName);
    setCurrentPage('contact');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePageNavigation = (pageId: string) => {
    setCurrentPage(pageId);
    setPrefilledService(''); // Reset prefill when navigating manually
    
    // Set hash to support browser history (enables back button navigation)
    if (window.location.hash.replace('#', '') !== pageId) {
      window.location.hash = pageId;
    }
  };

  const handleGoBack = () => {
    if (navigationHistory.length > 1) {
      const previousPage = navigationHistory[navigationHistory.length - 2];
      handlePageNavigation(previousPage);
    } else {
      handlePageNavigation('home');
    }
  };

  const getPreviousPageLabel = () => {
    if (navigationHistory.length > 1) {
      const prev = navigationHistory[navigationHistory.length - 2];
      if (prev === 'home') return 'Home';
      return prev.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    }
    return 'Home';
  };

  // Render current tab view
  const renderPageContent = () => {
    switch (currentPage) {
      case 'about':
        return (
          <motion.div
            key="about-page"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.35 }}
          >
            <AboutUs />
            <WhyChooseUs />
            <Stats />
          </motion.div>
        );
      case 'services':
        return (
          <motion.div
            key="services-page"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.35 }}
          >
            <Services onInquire={handleServiceInquiry} />
          </motion.div>
        );
      case 'shop':
        return (
          <motion.div
            key="shop-page"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.35 }}
          >
            <Shop 
              onAddToCart={handleAddToCart} 
              onNavigateToCustomStudio={() => handlePageNavigation('custom-studio')} 
              onNavigateToAccount={() => handlePageNavigation('my-orders')}
              onOpenCart={() => setIsCartOpen(true)}
              cartCount={cart.reduce((sum, item) => sum + item.quantity, 0)}
              wishlist={wishlist}
              setWishlist={setWishlist}
              showWishlistOnly={showWishlistOnly}
              setShowWishlistOnly={setShowWishlistOnly}
              products={products}
              loadingProducts={loadingProducts}
              isAdmin={currentUser?.email === 'content2u.sj@gmail.com'}
              onAddProduct={handleAddProduct}
              onDeleteProduct={handleDeleteProduct}
            />
          </motion.div>
        );
      case 'custom-studio':
        return (
          <motion.div
            key="custom-studio-page"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.35 }}
          >
            <CustomStudio 
              onAddToCart={handleAddToCart} 
              onNavigateToCart={() => setIsCartOpen(true)} 
            />
          </motion.div>
        );
      case 'track-order':
        return (
          <motion.div
            key="track-order-page"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.35 }}
          >
            <TrackOrder prefilledOrderId={prefilledOrderId} onSearchOrder={(id) => setPrefilledOrderId(id)} />
          </motion.div>
        );
      case 'my-orders':
        return (
          <motion.div
            key="my-orders-page"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.35 }}
          >
            <MyOrders 
              onTrackOrder={(orderId) => {
                setPrefilledOrderId(orderId);
                handlePageNavigation('track-order');
              }}
              onNavigateToShop={() => handlePageNavigation('shop')}
              onNavigateToCustomStudio={() => handlePageNavigation('custom-studio')}
              currentUser={currentUser}
              onOpenAuth={() => setIsAuthOpen(true)}
            />
          </motion.div>
        );
      case 'gallery':
        return (
          <motion.div
            key="gallery-page"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.35 }}
          >
            <Gallery />
          </motion.div>
        );
      case 'bulk-orders':
        return (
          <motion.div
            key="bulk-page"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.35 }}
          >
            <BulkOrders />
          </motion.div>
        );
      case 'faqs':
        return (
          <motion.div
            key="faqs-page"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.35 }}
          >
            <FAQs />
          </motion.div>
        );
      case 'contact':
        return (
          <motion.div
            key="contact-page"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.35 }}
          >
            <Contact prefilledRequirement={prefilledService} />
          </motion.div>
        );
      case 'home':
      default:
        return (
          <motion.div
            key="home-page"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Shop 
              onAddToCart={handleAddToCart} 
              onNavigateToCustomStudio={() => handlePageNavigation('custom-studio')} 
              onNavigateToAccount={() => handlePageNavigation('my-orders')}
              onOpenCart={() => setIsCartOpen(true)}
              cartCount={cart.reduce((sum, item) => sum + item.quantity, 0)}
              wishlist={wishlist}
              setWishlist={setWishlist}
              showWishlistOnly={showWishlistOnly}
              setShowWishlistOnly={setShowWishlistOnly}
              products={products}
              loadingProducts={loadingProducts}
              isAdmin={currentUser?.email === 'content2u.sj@gmail.com'}
              onAddProduct={handleAddProduct}
              onDeleteProduct={handleDeleteProduct}
            />
          </motion.div>
        );
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-neutral-50 dark:bg-neutral-950 font-sans antialiased text-neutral-900 dark:text-neutral-100 selection:bg-orange-500 selection:text-white">
      {/* Sticky Top Header */}
      <Navbar
        currentPage={currentPage}
        setCurrentPage={handlePageNavigation}
        isDarkMode={isDarkMode}
        setIsDarkMode={setIsDarkMode}
        cartCount={cart.reduce((sum, item) => sum + item.quantity, 0)}
        onOpenCart={() => setIsCartOpen(true)}
        showWishlistOnly={showWishlistOnly}
        setShowWishlistOnly={setShowWishlistOnly}
        wishlistCount={wishlist.length}
        currentUser={currentUser}
        onOpenAuth={() => setIsAuthOpen(true)}
        onLogout={handleLogout}
      />

      {/* Back Option Navigation Bar for sub-pages */}
      {currentPage !== 'home' && (
        <div className="bg-white dark:bg-neutral-900 pt-24 pb-4 border-b border-neutral-100 dark:border-neutral-800 transition-colors duration-300">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
            <button
              onClick={handleGoBack}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-neutral-100 dark:bg-neutral-800 hover:bg-orange-500 hover:text-white dark:hover:bg-orange-500 dark:hover:text-white transition-all group cursor-pointer text-sm font-bold text-neutral-700 dark:text-neutral-300 shadow-sm"
              aria-label={`Go back to ${getPreviousPageLabel()}`}
            >
              <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
              <span>Back to {getPreviousPageLabel()}</span>
            </button>
            <div className="text-xs font-semibold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest hidden sm:block">
              Currently Viewing: <span className="text-neutral-700 dark:text-neutral-300 font-extrabold">{currentPage.replace('-', ' ')}</span>
            </div>
          </div>
        </div>
      )}

      {/* Dynamic Content Frame with page transitions */}
      <main className="flex-grow">
        <AnimatePresence mode="wait">
          {renderPageContent()}
        </AnimatePresence>
      </main>

      {/* Universal Footer */}
      <Footer onNavigate={handlePageNavigation} currentPage={currentPage} />

      {/* Cart Slider Drawer */}
      <AnimatePresence>
        {isCartOpen && (
          <CartDrawer
            isOpen={isCartOpen}
            onClose={() => setIsCartOpen(false)}
            cart={cart}
            onUpdateQuantity={handleUpdateCartQuantity}
            onRemoveItem={handleRemoveCartItem}
            onCheckout={handleLaunchCheckout}
            initialCouponCode={exitIntentCoupon}
            onClearInitialCoupon={() => setExitIntentCoupon('')}
          />
        )}
      </AnimatePresence>

      {/* Checkout Modal Portal */}
      <AnimatePresence>
        {isCheckoutOpen && (
          <CheckoutModal
            isOpen={isCheckoutOpen}
            onClose={() => setIsCheckoutOpen(false)}
            cart={cart}
            discountAmount={checkoutDetails.discount}
            finalTotal={checkoutDetails.total}
            couponCode={checkoutDetails.coupon}
            onOrderSuccess={handleOrderConfirmed}
          />
        )}
      </AnimatePresence>

      {/* Authentication Modal Portal */}
      <AnimatePresence>
        {isAuthOpen && (
          <AuthModal
            isOpen={isAuthOpen}
            onClose={() => setIsAuthOpen(false)}
            onLoginSuccess={handleLoginSuccess}
          />
        )}
      </AnimatePresence>

      {/* Exit Intent Coupon Popup */}
      <ExitIntentPopup 
        onApplyCoupon={(code) => setExitIntentCoupon(code)}
        onOpenCart={() => setIsCartOpen(true)}
      />

    </div>
  );
}
