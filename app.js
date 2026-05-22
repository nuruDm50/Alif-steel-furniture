import React, { useState, useEffect, useMemo } from 'react';
import { 
  Search, ShoppingBag, Heart, User, LayoutDashboard, Shield, 
  Menu, X, Trash2, ArrowRight, Package, Filter, ChevronRight, 
  CheckCircle, Truck, RefreshCw, HelpCircle, Star, Moon, Sun, 
  Eye, Edit, Plus, AlertCircle, FileText, BarChart3, Users, Percent
} from 'lucide-react';

export default function AlifECommerceApplication() {
  // --- APPLICATION STATE MATRIX ---
  const [currentNavigationRoute, setCurrentNavigationRoute] = useState('home'); 
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [globalCatalogArray, setGlobalCatalogArray] = useState([]);
  const [cartCollectionArray, setCartCollectionArray] = useState([]);
  const [wishlistCollectionArray, setWishlistCollectionArray] = useState([]);
  const [systemUIVariantCurrency, setSystemUIVariantCurrency] = useState('BDT'); 
  const [isSystemDarkModeEnabled, setIsSystemDarkModeEnabled] = useState(false);
  const [activeUserAuthentication, setActiveUserAuthentication] = useState(null); 
  const [systemToastNotificationMessage, setSystemToastNotificationMessage] = useState(null);
  
  // Filtering & Catalog Parameters State
  const [searchQueryString, setSearchQueryString] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('All');
  const [selectedSortOrdering, setSelectedSortOrdering] = useState('default');
  const [maximumPriceFilterLimit, setMaximumPriceFilterLimit] = useState(50000);
  
  // Cart & Transaction State Engines
  const [appliedPromoCouponCode, setAppliedPromoCouponCode] = useState('');
  const [activeCouponDiscountAmount, setActiveCouponDiscountAmount] = useState(0);
  const [selectedDeliveryAreaLocation, setSelectedDeliveryAreaLocation] = useState('Inside Dhaka');
  const [orderTrackingInputId, setOrderTrackingInputId] = useState('');
  const [trackedOrderResultObject, setTrackedOrderResultObject] = useState(null);
  
  // Checkout Multi-Field Forms
  const [checkoutShippingForm, setCheckoutShippingForm] = useState({
    fullName: '', phone: '', city: 'Dhaka', addressLine: '', paymentMethod: 'COD'
  });
  const [finalInvoiceGeneratedObject, setFinalInvoiceGeneratedObject] = useState(null);

  // Administrative Operations State Core
  const [administrativeAnalytics, setAdministrativeAnalytics] = useState({ totalOrders: 12, productsCount: 5, grossRevenue: 284000, lowStockAlerts: 1 });
  const [adminSelectedProductForMutation, setAdminSelectedProductForMutation] = useState(null);
  const [isNewProductFormActive, setIsNewProductFormActive] = useState(false);

  // Simulated Database Array Mock Cache
  useEffect(() => {
    const defaultData = [
      {
        _id: "p1",
        name: "Alif Executive Three-Door Metallic Wardrobe",
        sku: "ASF-WR-001",
        description: "Premium heavy-duty gauge laser-cut structural steel sheets configured with internal modular shelving systems, specialized mirror installations, and industrial internal security lockers.",
        basePriceBDT: 24500,
        discountBadge: "Best Seller",
        discountPct: 10,
        category: "Wardrobe",
        brand: "Alif Steel",
        images: [
          "https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=600&q=80",
          "https://images.unsplash.com/photo-1558882224-cca166733360?auto=format&fit=crop&w=600&q=80"
        ],
        variants: { sizes: ["Standard Dual-Zone", "Master Triple-Zone"], colors: ["Hammered Gray", "Imperial Velvet Maroon"] },
        stock: 14,
        rating: 4.9,
        reviews: [{ user: "Kamal Hossain", rating: 5, comment: "Incredible finishing and highly secure build.", approved: true }],
        tags: ["Premium", "Wardrobe"]
      },
      {
        _id: "p2",
        name: "Alif Royal Anti-Theft Double-Layer Almirah",
        sku: "ASF-AL-002",
        description: "High-security anti-drill locking vault parameters welded with reinforced double-tier alloy steel sheets. Rust-resistant epoxy-powder electrostatic surface finish layout.",
        basePriceBDT: 31000,
        discountBadge: "Flash Sale",
        discountPct: 15,
        category: "Almirah",
        brand: "Alif Steel",
        images: [
          "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80"
        ],
        variants: { sizes: ["Standard Vault Size"], colors: ["Industrial Gray", "Satin Off-White"] },
        stock: 3,
        rating: 5.0,
        reviews: [],
        tags: ["Vault", "Almirah"]
      },
      {
        _id: "p3",
        name: "Slim-Line Dual-Core Steel Wardrobe Unit",
        sku: "ASF-WR-009",
        description: "Designed explicitly for space-constrained modern metropolitan micro-apartments without compromising underlying heavy-duty structural rigidity.",
        basePriceBDT: 18500,
        discountBadge: "New Arrival",
        discountPct: 0,
        category: "Wardrobe",
        brand: "Alif Steel",
        images: [
          "https://images.unsplash.com/photo-1592078615290-033ee584e267?auto=format&fit=crop&w=600&q=80"
        ],
        variants: { sizes: ["Compact Layout"], colors: ["Matte Black", "Off-White"] },
        stock: 22,
        rating: 4.7,
        reviews: [],
        tags: ["Compact", "Wardrobe"]
      }
    ];
    setGlobalCatalogArray(defaultData);
  }, []);

  // --- COMPONENT AUXILIARY UTILITIES ---
  const triggerUINotificationToast = (msg) => {
    setSystemToastNotificationMessage(msg);
    setTimeout(() => setSystemToastNotificationMessage(null), 4000);
  };

  const currencyExchangeRateModifier = useMemo(() => {
    return systemUIVariantCurrency === 'INR' ? 0.72 : 1.0;
  }, [systemUIVariantCurrency]);

  const renderFormattedCurrencyValue = (valBDT) => {
    const dynamicValue = (valBDT * currencyExchangeRateModifier).toFixed(0);
    return systemUIVariantCurrency === 'INR' ? `₹${dynamicValue}` : `৳${dynamicValue}`;
  };

  // Dynamic Catalog Search & Sorting Filters Computation Engine
  const computedFilteredProductsList = useMemo(() => {
    return globalCatalogArray.filter(product => {
      const passesSearch = product.name.toLowerCase().includes(searchQueryString.toLowerCase()) || 
                           product.description.toLowerCase().includes(searchQueryString.toLowerCase());
      const passesCategory = selectedCategoryFilter === 'All' || product.category === selectedCategoryFilter;
      const passesPrice = product.basePriceBDT <= maximumPriceFilterLimit;
      return passesSearch && passesCategory && passesPrice;
    }).sort((a, b) => {
      if (selectedSortOrdering === 'priceAsc') return a.basePriceBDT - b.basePriceBDT;
      if (selectedSortOrdering === 'priceDesc') return b.basePriceBDT - a.basePriceBDT;
      if (selectedSortOrdering === 'rating') return b.rating - a.rating;
      return 0;
    });
  }, [globalCatalogArray, searchQueryString, selectedCategoryFilter, selectedSortOrdering, maximumPriceFilterLimit]);

  // --- TRANSITIONAL TRANSACTION ACTIONS ---
  const handleAddProductToCartArray = (product, size, color) => {
    const existingIndex = cartCollectionArray.findIndex(item => 
      item.product._id === product._id && item.selectedSize === size && item.selectedColor === color
    );
    if (existingIndex > -1) {
      const duplicated = [...cartCollectionArray];
      duplicated[existingIndex].quantity += 1;
      setCartCollectionArray(duplicated);
    } else {
      setCartCollectionArray([...cartCollectionArray, {
        product, quantity: 1, selectedSize: size || product.variants.sizes[0], selectedColor: color || product.variants.colors[0]
      }]);
    }
    triggerUINotificationToast(`Added ${product.name} to operational cart array pipeline.`);
  };

  const handleToggleProductWishlistStatus = (product) => {
    const exists = wishlistCollectionArray.find(item => item._id === product._id);
    if (exists) {
      setWishlistCollectionArray(wishlistCollectionArray.filter(item => item._id !== product._id));
      triggerUINotificationToast("Removed item from localized wishlist arrays.");
    } else {
      setWishlistCollectionArray([...wishlistCollectionArray, product]);
      triggerUINotificationToast("Item successfully preserved inside structural wishlist.");
    }
  };

  const calculateCartSubtotalVal = () => {
    return cartCollectionArray.reduce((acc, current) => {
      const base = current.product.basePriceBDT;
      const runningDisc = current.product.discountPct ? (base * (1 - current.product.discountPct / 100)) : base;
      return acc + (runningDisc * current.quantity);
    }, 0);
  };

  const trackingShippingCostEvaluation = () => {
    return selectedDeliveryAreaLocation === 'Inside Dhaka' ? 120 : 250;
  };

  const triggerCouponValidationProtocol = () => {
    if (appliedPromoCouponCode.toUpperCase() === "ALIFSTEEL2026") {
      setActiveCouponDiscountAmount(1500);
      triggerUINotificationToast("Promo Code validated successfully: ৳1500 Discount Loaded.");
    } else {
      triggerUINotificationToast("Invalid or expired promotional signature sequence.");
    }
  };

  const dispatchFinalSystemOrder = () => {
    if (!checkoutShippingForm.fullName || !checkoutShippingForm.phone || !checkoutShippingForm.addressLine) {
      triggerUINotificationToast("CRITICAL: Complete mandatory structural parameters prior to transaction dispatch.");
      return;
    }
    const trackingUid = "ALIF-" + Math.floor(100000 + Math.random() * 900000);
    const mockInvoice = {
      orderId: trackingUid,
      timestamp: new Date().toLocaleDateString(),
      customer: checkoutShippingForm,
      items: [...cartCollectionArray],
      subtotal: calculateCartSubtotalVal(),
      shipping: trackingShippingCostEvaluation(),
      discount: activeCouponDiscountAmount,
      total: Math.max(0, calculateCartSubtotalVal() + trackingShippingCostEvaluation() - activeCouponDiscountAmount)
    };
    setFinalInvoiceGeneratedObject(mockInvoice);
    setCartCollectionArray([]);
    setCurrentNavigationRoute('checkoutSuccess');
    triggerUINotificationToast("Transaction pipelines cleared. Order dispatched safely.");
  };

  // --- REUSABLE CARD WRAPPERS ---
  const SharedProductCardComponent = ({ product }) => {
    const priceComputedDisc = product.discountPct ? (product.basePriceBDT * (1 - product.discountPct / 100)) : product.basePriceBDT;
    return (
      <div className="bg-white dark:bg-brand-dark border border-brand-border dark:border-zinc-800 rounded-xl overflow-hidden group transition-all duration-300 hover:shadow-premium relative flex flex-col justify-between">
        {product.discountBadge && (
          <span className="absolute top-2 left-2 bg-brand-red text-white text-xs font-bold px-2.5 py-1 rounded-full z-10 tracking-wider uppercase">
            {product.discountBadge}
          </span>
        )}
        <button 
          onClick={() => handleToggleProductWishlistStatus(product)}
          className="absolute top-2 right-2 p-2 bg-white/80 dark:bg-black/80 backdrop-blur-md rounded-full text-zinc-600 dark:text-zinc-300 hover:text-brand-red z-10 transition-colors"
        >
          <Heart className={`w-4 h-4 ${wishlistCollectionArray.some(i => i._id === product._id) ? "fill-brand-red text-brand-red" : ""}`} />
        </button>

        <div className="w-full aspect-square overflow-hidden bg-brand-offwhite relative cursor-pointer" onClick={() => { setSelectedProductId(product._id); setCurrentNavigationRoute('productDetails'); }}>
          <img 
            src={product.images[0]} 
            alt={product.name} 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        </div>

        <div className="p-3 flex-1 flex flex-col justify-between">
          <div>
            <span className="text-xs text-brand-muted uppercase font-semibold tracking-widest">{product.category}</span>
            <h3 onClick={() => { setSelectedProductId(product._id); setCurrentNavigationRoute('productDetails'); }} className="text-sm font-bold text-brand-dark dark:text-white mt-1 cursor-pointer hover:text-brand-red transition-colors line-clamp-2">
              {product.name}
            </h3>
            <div className="flex items-center gap-1 mt-1 text-amber-500">
              <Star className="w-3 h-3 fill-amber-500" />
              <span className="text-xs font-bold">{product.rating.toFixed(1)}</span>
            </div>
          </div>

          <div className="mt-3">
            <div className="flex items-baseline gap-2">
              <span className="text-base font-black text-brand-red">{renderFormattedCurrencyValue(priceComputedDisc)}</span>
              {product.discountPct > 0 && (
                <span className="text-xs text-brand-muted line-through">{renderFormattedCurrencyValue(product.basePriceBDT)}</span>
              )}
            </div>
            <button 
              onClick={() => handleAddProductToCartArray(product, product.variants.sizes[0], product.variants.colors[0])}
              className="w-full mt-3 bg-brand-dark dark:bg-zinc-800 text-white dark:text-zinc-200 text-xs font-bold py-2.5 rounded-lg uppercase tracking-wider transition-all hover:bg-brand-red hover:text-white flex items-center justify-center gap-2"
            >
              <ShoppingBag className="w-3 h-3" /> Add To Cart
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={`min-h-screen font-sans antialiased text-zinc-900 transition-colors duration-300 ${isSystemDarkModeEnabled ? "dark bg-zinc-950 text-zinc-50" : "bg-brand-offwhite"}`}>
      
      {/* Toast Operational Alerts */}
      {systemToastNotificationMessage && (
        <div className="fixed bottom-6 right-6 bg-brand-dark text-white text-sm px-5 py-3 rounded-xl shadow-2xl z-50 flex items-center gap-3 border-l-4 border-brand-red animate-bounce">
          <AlertCircle className="w-4 h-4 text-brand-red" />
          <span>{systemToastNotificationMessage}</span>
        </div>
      )}

      {/* --- STICKY NAVIGATION FRAMEWORK INTERFACE --- */}
      <header className="sticky top-0 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md border-b border-brand-border dark:border-zinc-800 z-40 transition-all">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button className="lg:hidden text-brand-dark dark:text-white" onClick={() => setCurrentNavigationRoute('shop')}>
              <Menu className="w-6 h-6" />
            </button>
            <h1 onClick={() => setCurrentNavigationRoute('home')} className="text-xl font-black text-brand-dark dark:text-white uppercase tracking-tighter cursor-pointer flex items-center gap-1">
              ALIF <span className="text-brand-red">STEEL</span>
            </h1>
          </div>

          {/* Large Universal Live Search Filter Console */}
          <div className="hidden md:flex flex-1 max-w-md relative">
            <input 
              type="text" 
              placeholder="Search premium steel almirah, wardrobes..." 
              value={searchQueryString}
              onChange={(e) => { setSearchQueryString(e.target.value); if(currentNavigationRoute !== 'shop') setCurrentNavigationRoute('shop'); }}
              className="w-full px-4 py-2 pl-10 rounded-full border border-brand-border dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-brand-red text-sm transition-all"
            />
            <Search className="w-4 h-4 text-brand-muted absolute left-3.5 top-3" />
          </div>

          {/* Modular Utilities Core Control Bar */}
          <div className="flex items-center gap-2 sm:gap-4">
            <button onClick={() => setIsSystemDarkModeEnabled(!isSystemDarkModeEnabled)} className="p-2 rounded-full text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
              {isSystemDarkModeEnabled ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5" />}
            </button>
            
            <button onClick={() => setSystemUIVariantCurrency(systemUIVariantCurrency === 'BDT' ? 'INR' : 'BDT')} className="text-xs font-black tracking-widest px-2.5 py-1 border border-zinc-300 dark:border-zinc-700 rounded bg-white dark:bg-zinc-800 shadow-sm transition-all hover:border-brand-red">
              {systemUIVariantCurrency}
            </button>

            <button onClick={() => setCurrentNavigationRoute('wishlist')} className="p-2 rounded-full text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 relative transition-colors">
              <Heart className="w-5 h-5" />
              {wishlistCollectionArray.length > 0 && <span className="absolute -top-1 -right-1 bg-brand-red text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">{wishlistCollectionArray.length}</span>}
            </button>

            <button onClick={() => setCurrentNavigationRoute('cart')} className="p-2 rounded-full text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 relative transition-colors">
              <ShoppingBag className="w-5 h-5" />
              {cartCollectionArray.length > 0 && <span className="absolute -top-1 -right-1 bg-brand-red text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">{cartCollectionArray.length}</span>}
            </button>

            <button onClick={() => setCurrentNavigationRoute(activeUserAuthentication?.role === 'admin' ? 'adminDashboard' : 'login')} className="flex items-center gap-1.5 p-2 rounded-full text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all">
              <User className="w-5 h-5" />
              {activeUserAuthentication && <span className="text-xs hidden sm:inline font-bold text-brand-dark dark:text-white">{activeUserAuthentication.name.split(' ')[0]}</span>}
            </button>
          </div>
        </div>
      </header>

      {/* Primary Mobile Action Search Container Bar */}
      <div className="md:hidden px-4 py-2.5 bg-white dark:bg-zinc-900 border-b border-brand-border dark:border-zinc-800">
        <div className="relative">
          <input 
            type="text" 
            placeholder="Search catalog models..." 
            value={searchQueryString}
            onChange={(e) => { setSearchQueryString(e.target.value); if(currentNavigationRoute !== 'shop') setCurrentNavigationRoute('shop'); }}
            className="w-full px-4 py-2 pl-10 rounded-xl border border-brand-border dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 focus:outline-none text-xs"
          />
          <Search className="w-3.5 h-3.5 text-brand-muted absolute left-3.5 top-3" />
        </div>
      </div>

      {/* --- CENTRALIZED ROUTING CONTAINER ENGINE --- */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        
        {/* ================= HOME VIEW ================= */}
        {currentNavigationRoute === 'home' && (
          <div className="space-y-12">
            {/* Structural High-End Promotional Sliding Canvas Banner */}
            <div className="relative rounded-3xl overflow-hidden bg-brand-dark text-white min-h-[340px] sm:min-h-[460px] flex items-center p-6 sm:p-12 shadow-premium">
              <div className="absolute inset-0 z-0 opacity-40 bg-cover bg-center" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80')` }}></div>
              <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent z-10"></div>
              
              <div className="relative z-20 max-w-xl space-y-4 sm:space-y-6">
                <span className="bg-brand-red text-white text-xs font-black uppercase tracking-widest px-3 py-1.5 rounded-md">ESTABLISHED 2026</span>
                <h2 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight uppercase">Industrial Strength.<br/>Premium Aesthetics.</h2>
                <p className="text-zinc-300 text-xs sm:text-base max-w-md font-medium">
                  Upgrade your home layout with heavy-duty structural steel wardrobes and multi-tier secure lock architectures engineered to protect for generations.
                </p>
                <div className="pt-2">
                  <button onClick={() => setCurrentNavigationRoute('shop')} className="bg-white text-brand-dark hover:bg-brand-red hover:text-white text-xs sm:text-sm font-bold uppercase tracking-widest px-6 py-3.5 rounded-xl transition-all duration-300 flex items-center gap-2 shadow-lg">
                    Explore Inventory <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Micro Category Grid Selection Hub */}
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg sm:text-xl font-black uppercase tracking-tight">Browse Design Lines</h3>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {[
                  { name: 'Wardrobe', count: '14 Models Available', img: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=400&q=80' },
                  { name: 'Almirah', count: '8 Vault Models', img: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=400&q=80' }
                ].map((cat, i) => (
                  <div key={i} onClick={() => { setSelectedCategoryFilter(cat.name); setCurrentNavigationRoute('shop'); }} className="group relative rounded-2xl overflow-hidden min-h-[160px] sm:min-h-[220px] bg-zinc-100 dark:bg-zinc-800 cursor-pointer shadow-sm transition-all hover:shadow-md">
                    <img src={cat.img} alt={cat.name} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 dark:opacity-75" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-4 flex flex-col justify-end">
                      <h4 className="text-white font-bold text-lg">{cat.name}</h4>
                      <p className="text-zinc-300 text-xs">{cat.count}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Flash Sales Counter Container Zone */}
            <section className="bg-gradient-to-r from-red-900 to-brand-red text-white p-6 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6 shadow-premium">
              <div className="space-y-2 text-center md:text-left">
                <span className="bg-black/30 px-3 py-1 rounded text-xs font-black tracking-widest uppercase">Limited Structural Run</span>
                <h3 className="text-xl sm:text-3xl font-black tracking-tight uppercase">High-Security Vault Flash Event</h3>
                <p className="text-red-100 text-xs sm:text-sm">Enjoy up to 15% instant reduction on secure heavy alloy steel storage frames.</p>
              </div>
              <button onClick={() => { setSelectedCategoryFilter('Almirah'); setCurrentNavigationRoute('shop'); }} className="bg-white text-brand-red font-bold text-xs uppercase tracking-widest px-6 py-3.5 rounded-xl transition-all hover:bg-brand-dark hover:text-white whitespace-nowrap">
                Acquire Deal Frame
              </button>
            </section>

            {/* Main Featured Showcase Section Frame */}
            <section className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg sm:text-2xl font-black uppercase tracking-tight">Featured Industrial Hardware</h3>
                  <p className="text-xs sm:text-sm text-brand-muted">Top validated premium security builds</p>
                </div>
                <button onClick={() => setCurrentNavigationRoute('shop')} className="text-xs font-bold uppercase tracking-wider text-brand-red flex items-center gap-1 hover:underline">
                  View Full Catalog <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {/* Responsive Layout Grid: Mobile=2 columns, Tablet=3, Desktop=4 */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
                {globalCatalogArray.slice(0, 4).map((product) => (
                  <SharedProductCardComponent key={product._id} product={product} />
                ))}
              </div>
            </section>

            {/* Editorial Brand Endorsement Showcase Grid */}
            <section className="bg-white dark:bg-zinc-900 rounded-3xl p-6 sm:p-12 border border-brand-border dark:border-zinc-800 space-y-8">
              <div className="text-center max-w-xl mx-auto space-y-2">
                <h3 className="text-xl sm:text-3xl font-black uppercase tracking-tight">Engineered for absolute resilience</h3>
                <p className="text-xs sm:text-sm text-brand-muted">Why retail chains and households cross-verify and depend on Alif Steel components.</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
                <div className="space-y-2 flex flex-col items-center">
                  <div className="p-4 bg-red-50 dark:bg-red-950/50 rounded-full text-brand-red"><Shield className="w-6 h-6" /></div>
                  <h4 className="font-bold text-sm sm:text-base">Anti-Drill Vault Reinforcements</h4>
                  <p className="text-xs text-brand-muted">Heavy structural plate reinforcement layouts shielding multi-tier alignment deadbolts.</p>
                </div>
                <div className="space-y-2 flex flex-col items-center">
                  <div className="p-4 bg-red-50 dark:bg-red-950/50 rounded-full text-brand-red"><RefreshCw className="w-6 h-6" /></div>
                  <h4 className="font-bold text-sm sm:text-base">Electrostatic Powder Coating</h4>
                  <p className="text-xs text-brand-muted">Premium multi-stage automation protection guarding surface sheet panels from rust anomalies.</p>
                </div>
                <div className="space-y-2 flex flex-col items-center">
                  <div className="p-4 bg-red-50 dark:bg-red-950/50 rounded-full text-brand-red"><Truck className="w-6 h-6" /></div>
                  <h4 className="font-bold text-sm sm:text-base">Nationwide Secure Delivery</h4>
                  <p className="text-xs text-brand-muted">Fully managed and trace-validated logistics fleets handling structural items safely across Bangladesh.</p>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* ================= SHOP SYSTEM CATALOG VIEW ================= */}
        {currentNavigationRoute === 'shop' && (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-zinc-900 p-4 rounded-xl border border-brand-border dark:border-zinc-800">
              <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
                {['All', 'Wardrobe', 'Almirah'].map((cat) => (
                  <button 
                    key={cat} 
                    onClick={() => setSelectedCategoryFilter(cat)}
                    className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap ${selectedCategoryFilter === cat ? "bg-brand-red text-white" : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400"}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
              
              <div className="flex items-center gap-3">
                <select 
                  value={selectedSortOrdering} 
                  onChange={(e) => setSelectedSortOrdering(e.target.value)}
                  className="bg-zinc-50 dark:bg-zinc-800 border border-brand-border dark:border-zinc-700 rounded-lg p-2 text-xs font-bold"
                >
                  <option value="default">Default Assortment</option>
                  <option value="priceAsc">Price: Lower to High</option>
                  <option value="priceDesc">Price: High to Lower</option>
                  <option value="rating">Top Rated Metrics</option>
                </select>

                <div className="flex items-center gap-2 text-xs font-medium">
                  <span>Max Price:</span>
                  <input 
                    type="range" min="10000" max="60000" step="2000" 
                    value={maximumPriceFilterLimit} 
                    onChange={(e) => setMaximumPriceFilterLimit(Number(e.target.value))}
                    className="accent-brand-red"
                  />
                  <span className="font-bold text-brand-red">{renderFormattedCurrencyValue(maximumPriceFilterLimit)}</span>
                </div>
              </div>
            </div>

            {/* Mobile-First 2-Column Grid Layout Ecosystem */}
            {computedFilteredProductsList.length === 0 ? (
              <div className="text-center py-16 space-y-4">
                <AlertCircle className="w-12 h-12 mx-auto text-brand-muted" />
                <h4 className="text-lg font-bold">No structural models match your active filter arrays.</h4>
                <button onClick={() => { setSearchQueryString(''); setSelectedCategoryFilter('All'); setMaximumPriceFilterLimit(50000); }} className="text-xs font-bold uppercase tracking-wider text-brand-red underline">Clear Filter Constrains</button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
                {computedFilteredProductsList.map((product) => (
                  <SharedProductCardComponent key={product._id} product={product} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* ================= PRODUCT SPECIFIC DETAILS VIEW ================= */}
        {currentNavigationRoute === 'productDetails' && (() => {
          const matchedProduct = globalCatalogArray.find(p => p._id === selectedProductId);
          if (!matchedProduct) return <p>Asset reference unlinked.</p>;
          const calculatedActivePrice = matchedProduct.discountPct ? (matchedProduct.basePriceBDT * (1 - matchedProduct.discountPct / 100)) : matchedProduct.basePriceBDT;
          return (
            <div className="bg-white dark:bg-zinc-900 rounded-3xl p-4 sm:p-8 border border-brand-border dark:border-zinc-800 space-y-12">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Advanced Multi-Image Zoom Gallery Display */}
                <div className="space-y-4">
                  <div className="w-full aspect-square rounded-2xl overflow-hidden bg-brand-offwhite border border-brand-border dark:border-zinc-800">
                    <img src={matchedProduct.images[0]} alt={matchedProduct.name} className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-500" />
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {matchedProduct.images.map((img, idx) => (
                      <div key={idx} className="aspect-square rounded-xl overflow-hidden bg-zinc-100 border border-brand-border dark:border-zinc-700 cursor-pointer">
                        <img src={img} alt="Detail node" className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Technical Product Metrics Formulation */}
                <div className="space-y-6">
                  <div>
                    <span className="text-xs bg-zinc-100 dark:bg-zinc-800 px-3 py-1 rounded font-bold text-brand-muted tracking-wider uppercase">{matchedProduct.category}</span>
                    <h2 className="text-xl sm:text-3xl font-black tracking-tight mt-2">{matchedProduct.name}</h2>
                    <p className="text-xs text-brand-muted mt-1">SKU Reference: <span className="font-mono text-zinc-700 dark:text-zinc-300 font-bold">{matchedProduct.sku}</span></p>
                  </div>

                  <div className="flex items-center gap-4 py-2 border-y border-brand-border dark:border-zinc-800">
                    <div className="flex items-center gap-1 text-amber-500">
                      {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-amber-500 text-amber-500" />)}
                    </div>
                    <span className="text-xs font-bold text-brand-muted">({matchedProduct.reviews.length} Validated Customer Reviews)</span>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded ${matchedProduct.stock > 3 ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"}`}>
                      {matchedProduct.stock > 3 ? `${matchedProduct.stock} Anchored in Warehouse` : "Critical Low Inventory Warning"}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-baseline gap-3">
                      <span className="text-3xl font-black text-brand-red">{renderFormattedCurrencyValue(calculatedActivePrice)}</span>
                      {matchedProduct.discountPct > 0 && (
                        <span className="text-base text-brand-muted line-through font-medium">{renderFormattedCurrencyValue(matchedProduct.basePriceBDT)}</span>
                      )}
                    </div>
                    <p className="text-xs text-emerald-600 font-bold">Tax Inclusive Price Validation Index</p>
                  </div>

                  <div className="text-sm text-zinc-600 dark:text-zinc-300 space-y-2">
                    <h4 className="font-bold text-brand-dark dark:text-white uppercase tracking-wider text-xs">Architectural Description Matrix</h4>
                    <p className="leading-relaxed text-xs sm:text-sm">{matchedProduct.description}</p>
                  </div>

                  {/* Structural Variant Parameter Allocations */}
                  <div className="space-y-4 pt-2">
                    <div className="space-y-1.5">
                      <label className="text-xs font-black uppercase tracking-wider text-brand-muted">Dimensions Frame Array</label>
                      <div className="flex items-center gap-2">
                        {matchedProduct.variants.sizes.map((s, idx) => (
                          <button key={idx} className="px-3 py-1.5 border-2 border-brand-dark dark:border-zinc-400 rounded-lg text-xs font-bold bg-white dark:bg-zinc-800">
                            {s}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-black uppercase tracking-wider text-brand-muted">Electrostatic Coating Hue</label>
                      <div className="flex items-center gap-2">
                        {matchedProduct.variants.colors.map((c, idx) => (
                          <button key={idx} className="px-3 py-1.5 border border-brand-border dark:border-zinc-700 rounded-lg text-xs font-medium bg-zinc-50 dark:bg-zinc-800">
                            {c}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Primary Action Button Gateways */}
                  <div className="grid grid-cols-2 gap-4 pt-4">
                    <button 
                      onClick={() => handleAddProductToCartArray(matchedProduct, matchedProduct.variants.sizes[0], matchedProduct.variants.colors[0])}
                      className="bg-brand-dark dark:bg-zinc-800 hover:bg-brand-red text-white py-3.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all"
                    >
                      Append to Cart
                    </button>
                    <button 
                      onClick={() => { handleAddProductToCartArray(matchedProduct, matchedProduct.variants.sizes[0], matchedProduct.variants.colors[0]); setCurrentNavigationRoute('cart'); }}
                      className="bg-brand-red text-white hover:bg-red-700 py-3.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all"
                    >
                      Instant Purchase
                    </button>
                  </div>
                </div>
              </div>

              {/* Dynamic Simulated Customer Reviews Architecture */}
              <div className="border-t border-brand-border dark:border-zinc-800 pt-8 space-y-6">
                <h3 className="text-lg font-black uppercase tracking-tight">Verified Buyer Review Index</h3>
                {matchedProduct.reviews.length === 0 ? (
                  <p className="text-xs text-brand-muted">No historical purchase review data allocated yet. Be the initial structural tester.</p>
                ) : (
                  <div className="space-y-4">
                    {matchedProduct.reviews.map((rev, i) => (
                      <div key={i} className="bg-brand-offwhite dark:bg-zinc-800/50 p-4 rounded-xl border border-brand-border dark:border-zinc-800 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold">{rev.user}</span>
                          <span className="text-[10px] text-brand-muted font-mono">{rev.date || "2026-04-12"}</span>
                        </div>
                        <p className="text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 italic">"{rev.comment}"</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })()}

        {/* ================= SHOPPING CART SYSTEM VIEW ================= */}
        {currentNavigationRoute === 'cart' && (
          <div className="space-y-6">
            <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight">Allocated Operations Cart Pipeline</h2>
            {cartCollectionArray.length === 0 ? (
              <div className="bg-white dark:bg-zinc-900 rounded-2xl p-12 text-center border border-brand-border dark:border-zinc-800 space-y-4">
                <ShoppingBag className="w-12 h-12 mx-auto text-brand-muted" />
                <h3 className="text-base font-bold">Your procedural operational cart is hollow.</h3>
                <button onClick={() => setCurrentNavigationRoute('shop')} className="bg-brand-dark text-white text-xs font-bold uppercase tracking-wider px-6 py-3 rounded-lg">Return to Catalog Procurement</button>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-4">
                  {cartCollectionArray.map((item, idx) => {
                    const baseItemPrice = item.product.basePriceBDT;
                    const finalUnitCost = item.product.discountPct ? (baseItemPrice * (1 - item.product.discountPct / 100)) : baseItemPrice;
                    return (
                      <div key={idx} className="bg-white dark:bg-zinc-900 rounded-xl p-4 border border-brand-border dark:border-zinc-800 flex items-center justify-between gap-4">
                        <div className="w-16 h-16 rounded-lg overflow-hidden bg-brand-offwhite shrink-0">
                          <img src={item.product.images[0]} alt="" className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-xs sm:text-sm font-bold text-brand-dark dark:text-white truncate">{item.product.name}</h4>
                          <p className="text-[10px] text-brand-muted uppercase tracking-wide">{item.selectedSize} / {item.selectedColor}</p>
                          <span className="text-xs font-black text-brand-red">{renderFormattedCurrencyValue(finalUnitCost)}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-mono bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded">Qty: **{item.quantity}**</span>
                          <button 
                            onClick={() => setCartCollectionArray(cartCollectionArray.filter((_, i) => i !== idx))}
                            className="text-zinc-400 hover:text-brand-red transition-colors p-1"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Financial Summary Calculation Panel */}
                <div className="bg-white dark:bg-zinc-900 rounded-xl p-4 sm:p-6 border border-brand-border dark:border-zinc-800 h-fit space-y-6">
                  <h3 className="text-sm font-black uppercase tracking-wider text-brand-dark dark:text-white">Financial Calculation Matrix</h3>
                  
                  <div className="space-y-2 text-xs border-b border-brand-border dark:border-zinc-800 pb-4">
                    <div className="flex justify-between">
                      <span className="text-brand-muted">Cart Valuation Subtotal</span>
                      <span className="font-bold">{renderFormattedCurrencyValue(calculateCartSubtotalVal())}</span>
                    </div>
                    <div className="flex justify-between items-center pt-1">
                      <span className="text-brand-muted">Logistics Distribution Vector</span>
                      <select 
                        value={selectedDeliveryAreaLocation} 
                        onChange={(e) => setSelectedDeliveryAreaLocation(e.target.value)}
                        className="bg-zinc-50 dark:bg-zinc-800 p-1 text-[11px] font-bold border rounded"
                      >
                        <option value="Inside Dhaka">Inside Dhaka Zone (+৳120)</option>
                        <option value="Outside Dhaka">Sub-Divisions Nationwide (+৳250)</option>
                      </select>
                    </div>
                    {activeCouponDiscountAmount > 0 && (
                      <div className="flex justify-between text-emerald-600 font-bold">
                        <span>Promotional Deductions Applied</span>
                        <span>-{renderFormattedCurrencyValue(activeCouponDiscountAmount)}</span>
                      </div>
                    )}
                  </div>

                  {/* Voucher Insertion Form */}
                  <div className="space-y-2">
                    <label className="text-[11px] font-black tracking-wider text-brand-muted uppercase">Apply Coupon Voucher (Try: **ALIFSTEEL2026**)</label>
                    <div className="flex gap-2">
                      <input 
                        type="text" placeholder="ENTER CODE" 
                        value={appliedPromoCouponCode} onChange={(e) => setAppliedPromoCouponCode(e.target.value)}
                        className="bg-zinc-50 dark:bg-zinc-800 text-xs px-3 py-2 rounded-lg border focus:outline-none flex-1 font-mono font-bold"
                      />
                      <button onClick={triggerCouponValidationProtocol} className="bg-brand-dark text-white text-xs px-4 rounded-lg font-bold uppercase tracking-wider">Validate</button>
                    </div>
                  </div>

                  <div className="pt-2">
                    <div className="flex justify-between items-baseline mb-4">
                      <span className="text-sm font-bold">Calculated Gross Total</span>
                      <span className="text-xl font-black text-brand-red">
                        {renderFormattedCurrencyValue(Math.max(0, calculateCartSubtotalVal() + trackingShippingCostEvaluation() - activeCouponDiscountAmount))}
                      </span>
                    </div>
                    <button 
                      onClick={() => setCurrentNavigationRoute('checkout')}
                      className="w-full bg-brand-red text-white py-3.5 rounded-xl text-xs font-black uppercase tracking-widest text-center shadow-floating transition-transform hover:scale-[1.01]"
                    >
                      Route to Secure Checkout
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ================= SECURE CHECKOUT PAGE ================= */}
        {currentNavigationRoute === 'checkout' && (
          <div className="space-y-6">
            <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight">Secure Financial Checkout Gateway</h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Delivery Logistics Validation Sheet */}
              <div className="lg:col-span-2 bg-white dark:bg-zinc-900 p-4 sm:p-6 rounded-xl border border-brand-border dark:border-zinc-800 space-y-4">
                <h3 className="text-xs font-black text-brand-muted uppercase tracking-wider">Logistics & Consignee Specification Data</h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-zinc-600 dark:text-zinc-400">Full Structural Name</label>
                    <input 
                      type="text" placeholder="John Doe"
                      value={checkoutShippingForm.fullName}
                      onChange={(e) => setCheckoutShippingForm({...checkoutShippingForm, fullName: e.target.value})}
                      className="w-full p-2.5 rounded-lg border bg-zinc-50 dark:bg-zinc-800 text-xs focus:outline-none focus:ring-1 focus:ring-brand-red"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-zinc-600 dark:text-zinc-400">Mobile Contact Vector (Bangladesh)</label>
                    <input 
                      type="tel" placeholder="+88017XXXXXXXX"
                      value={checkoutShippingForm.phone}
                      onChange={(e) => setCheckoutShippingForm({...checkoutShippingForm, phone: e.target.value})}
                      className="w-full p-2.5 rounded-lg border bg-zinc-50 dark:bg-zinc-800 text-xs focus:outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-zinc-600 dark:text-zinc-400">Granular Core Address Details</label>
                  <textarea 
                    rows="3" placeholder="House No, Road Name, Area Hub..."
                    value={checkoutShippingForm.addressLine}
                    onChange={(e) => setCheckoutShippingForm({...checkoutShippingForm, addressLine: e.target.value})}
                    className="w-full p-2.5 rounded-lg border bg-zinc-50 dark:bg-zinc-800 text-xs focus:outline-none"
                  ></textarea>
                </div>

                {/* Transactional Architecture Selectors */}
                <div className="space-y-2 pt-2">
                  <label className="text-xs font-black text-brand-muted uppercase tracking-wider">Transactional Settlement Pipeline</label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { id: 'COD', name: 'Cash on Delivery' },
                      { id: 'bKash', name: 'bKash Wallet' },
                      { id: 'Nagad', name: 'Nagad Wallet' }
                    ].map((method) => (
                      <div 
                        key={method.id}
                        onClick={() => setCheckoutShippingForm({...checkoutShippingForm, paymentMethod: method.id})}
                        className={`p-3 border rounded-xl text-center cursor-pointer transition-all ${checkoutShippingForm.paymentMethod === method.id ? "border-brand-red bg-red-50/50 dark:bg-red-950/20 text-brand-red font-bold" : "border-brand-border dark:border-zinc-800"}`}
                      >
                        <span className="text-xs block">{method.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Review Node Summary Panel */}
              <div className="bg-white dark:bg-zinc-900 p-4 rounded-xl border border-brand-border dark:border-zinc-800 h-fit space-y-4">
                <h3 className="text-xs font-black text-brand-muted uppercase tracking-wider">Consolidated Overview</h3>
                <div className="space-y-2 border-b border-zinc-100 dark:border-zinc-800 pb-3 text-xs">
                  <div className="flex justify-between"><span className="text-brand-muted">Items Weight</span><span className="font-bold">{renderFormattedCurrencyValue(calculateCartSubtotalVal())}</span></div>
                  <div className="flex justify-between"><span className="text-brand-muted">Logistics</span><span className="font-bold">+{renderFormattedCurrencyValue(trackingShippingCostEvaluation())}</span></div>
                  {activeCouponDiscountAmount > 0 && <div className="flex justify-between text-emerald-600"><span className="font-bold">Coupon</span><span>-{renderFormattedCurrencyValue(activeCouponDiscountAmount)}</span></div>}
                </div>
                <div className="flex justify-between items-baseline">
                  <span className="text-xs font-bold">Aggregate Investment</span>
                  <span className="text-lg font-black text-brand-red">{renderFormattedCurrencyValue(Math.max(0, calculateCartSubtotalVal() + trackingShippingCostEvaluation() - activeCouponDiscountAmount))}</span>
                </div>
                <button 
                  onClick={dispatchFinalSystemOrder}
                  className="w-full bg-brand-dark dark:bg-zinc-800 text-white py-3 rounded-xl text-xs font-black uppercase tracking-widest mt-2"
                >
                  Confirm Structural Placement
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ================= INVOICE DISPLAY SUCCESS PAGE ================= */}
        {currentNavigationRoute === 'checkoutSuccess' && finalInvoiceGeneratedObject && (
          <div className="max-w-xl mx-auto bg-white dark:bg-zinc-900 rounded-3xl p-6 sm:p-8 border border-brand-border dark:border-zinc-800 shadow-premium text-center space-y-6">
            <div className="w-12 h-12 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h2 className="text-xl font-black uppercase tracking-tight">Order Logged Successfully</h2>
              <p className="text-xs text-brand-muted">Your processing pipeline token identifier is: <span className="font-mono text-brand-dark dark:text-white font-bold">{finalInvoiceGeneratedObject.orderId}</span></p>
            </div>

            {/* Structured Industrial Layout Invoice Replica */}
            <div className="text-left border border-brand-border dark:border-zinc-800 rounded-2xl p-4 bg-brand-offwhite dark:bg-zinc-800/40 text-xs space-y-4">
              <div className="flex justify-between border-b pb-2 font-bold uppercase tracking-wider text-brand-muted">
                <span>System Invoice Spec</span>
                <span>Date: {finalInvoiceGeneratedObject.timestamp}</span>
              </div>
              <div className="space-y-0.5">
                <p><strong>Consignee Name:</strong> {finalInvoiceGeneratedObject.customer.fullName}</p>
                <p><strong>Contact Vector:</strong> {finalInvoiceGeneratedObject.customer.phone}</p>
                <p><strong>Logistics Target:</strong> {finalInvoiceGeneratedObject.customer.addressLine}, {finalInvoiceGeneratedObject.customer.city}</p>
                <p><strong>Settlement Driver:</strong> {finalInvoiceGeneratedObject.customer.paymentMethod}</p>
              </div>
              <div className="border-t pt-2 space-y-1">
                {finalInvoiceGeneratedObject.items.map((item, i) => (
                  <div key={i} className="flex justify-between text-brand-muted">
                    <span>{item.product.name} (x{item.quantity})</span>
                    <span className="font-mono font-bold text-brand-dark dark:text-zinc-200">{renderFormattedCurrencyValue(item.product.basePriceBDT * item.quantity)}</span>
                  </div>
                ))}
              </div>
              <div className="border-t pt-2 flex justify-between font-black text-sm text-brand-red">
                <span>Gross Settlement Aggregate:</span>
                <span>{renderFormattedCurrencyValue(finalInvoiceGeneratedObject.total)}</span>
              </div>
            </div>

            <button onClick={() => setCurrentNavigationRoute('home')} className="bg-brand-dark text-white text-xs font-black uppercase tracking-widest px-6 py-3 rounded-xl">
              Return to Primary Interface
            </button>
          </div>
        )}

        {/* ================= ORDER TRACKING CONSOLE ================= */}
        {currentNavigationRoute === 'orderTracking' && (
          <div className="max-w-md mx-auto bg-white dark:bg-zinc-900 rounded-3xl p-6 border border-brand-border dark:border-zinc-800 space-y-6 shadow-premium">
            <div className="space-y-1 text-center">
              <h2 className="text-lg font-black uppercase tracking-tight">Logistics Verification Framework</h2>
              <p className="text-xs text-brand-muted">Query real-time automated tracking coordinates.</p>
            </div>
            
            <div className="space-y-2">
              <input 
                type="text" placeholder="e.g., ALIF-628401" 
                value={orderTrackingInputId} onChange={(e) => setOrderTrackingInputId(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border text-xs font-mono font-bold uppercase tracking-wider bg-zinc-50 dark:bg-zinc-800 focus:outline-none focus:border-brand-red"
              />
              <button 
                onClick={() => {
                  if (orderTrackingInputId.trim()) {
                    setTrackedOrderResultObject({
                      id: orderTrackingInputId.toUpperCase(),
                      status: 'Processing Configuration',
                      eta: '48 to 72 Operational Hours',
                      stage: 2
                    });
                  }
                }}
                className="w-full bg-brand-dark dark:bg-zinc-800 text-white py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider"
              >
                Query Database Array
              </button>
            </div>

            {trackedOrderResultObject && (
              <div className="border-t pt-4 space-y-4 text-xs">
                <div className="p-3 bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/40 rounded-xl space-y-1">
                  <p className="text-brand-muted">Pipeline Registry: <span className="font-mono text-brand-dark dark:text-zinc-100 font-bold">{trackedOrderResultObject.id}</span></p>
                  <p><strong>Current Node:</strong> <span className="text-brand-red font-bold">{trackedOrderResultObject.status}</span></p>
                  <p><strong>Expected Arrival Index:</strong> {trackedOrderResultObject.eta}</p>
                </div>

                {/* Progress Timeline Vector Graphic */}
                <div className="space-y-2">
                  {[
                    { step: 1, label: 'Order Registered Structure' },
                    { step: 2, label: 'Warehouse Load Compilation' },
                    { step: 3, label: 'Logistics Courier Transit' },
                    { step: 4, label: 'Target Site Handover Complete' }
                  ].map((s) => (
                    <div key={s.step} className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-mono font-bold ${trackedOrderResultObject.stage >= s.step ? "bg-brand-red text-white" : "bg-zinc-200 text-zinc-400"}`}>
                        {s.step}
                      </div>
                      <span className={trackedOrderResultObject.stage >= s.step ? "font-bold text-brand-dark dark:text-zinc-100" : "text-brand-muted"}>{s.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ================= WISHLIST STORAGE MODULE ================= */}
        {currentNavigationRoute === 'wishlist' && (
          <div className="space-y-6">
            <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight">Preserved Model Wireframes (Wishlist)</h2>
            {wishlistCollectionArray.length === 0 ? (
              <p className="text-xs text-brand-muted">No design files currently structuralized inside active favorites memory tracking.</p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {wishlistCollectionArray.map(p => <SharedProductCardComponent key={p._id} product={p} />)}
              </div>
            )}
          </div>
        )}

        {/* ================= USER AUTHENTICATION SIGN-IN SYSTEM ================= */}
        {currentNavigationRoute === 'login' && (
          <div className="max-w-sm mx-auto bg-white dark:bg-zinc-900 rounded-3xl p-6 border border-brand-border dark:border-zinc-800 space-y-6 shadow-premium">
            <div className="space-y-1 text-center">
              <h2 className="text-lg font-black uppercase tracking-tight">System Access Entry Node</h2>
              <p className="text-xs text-brand-muted">Input valid access parameters to authorize user configurations.</p>
            </div>
            
            <form onSubmit={(e) => {
              e.preventDefault();
              const mail = e.target.email.value;
              const pass = e.target.password.value;
              if (mail === "PRAHULADMIN" && pass === "123456") {
                setActiveUserAuthentication({ name: "System Admin Core", email: "admin@alifsteel.com", role: "admin" });
                setCurrentNavigationRoute('adminDashboard');
                triggerUINotificationToast("Administrative access granted. Loading analytics pipelines.");
              } else if (mail && pass) {
                setActiveUserAuthentication({ name: "Validated Buyer Account", email: mail, role: "user" });
                setCurrentNavigationRoute('home');
                triggerUINotificationToast("User authorization loop validated successfully.");
              }
            }} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-zinc-600 dark:text-zinc-400">Security Access ID / Mail Signature</label>
                <input name="email" type="text" placeholder="e.g., PRAHULADMIN" required className="w-full p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border text-xs" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-zinc-600 dark:text-zinc-400">Cryptographic Access Password</label>
                <input name="password" type="password" placeholder="e.g., 123456" required className="w-full p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border text-xs" />
              </div>
              
              <div className="p-3 bg-zinc-50 dark:bg-zinc-800 rounded-xl text-[11px] text-brand-muted leading-relaxed">
                <strong>System Backdoor Testing Tokens:</strong><br/>
                Admin ID: <span className="font-mono font-bold text-brand-dark dark:text-white">PRAHULADMIN</span><br/>
                Password: <span className="font-mono font-bold text-brand-dark dark:text-white">123456</span>
              </div>

              <button type="submit" className="w-full bg-brand-red text-white py-3 rounded-xl text-xs font-black uppercase tracking-widest">
                Execute Verification Loop
              </button>
            </form>
          </div>
        )}

        {/* ================= ADMINISTRATIVE CENTRAL DASHBOARD CONSOLE ================= */}
        {currentNavigationRoute === 'adminDashboard' && activeUserAuthentication?.role === 'admin' && (
          <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4 border-brand-border dark:border-zinc-800">
              <div>
                <h2 className="text-2xl font-black uppercase tracking-tight flex items-center gap-2">
                  <Shield className="w-6 h-6 text-brand-red" /> Global System Control Room
                </h2>
                <p className="text-xs text-brand-muted font-medium">Real-time analytical telemetry tracking and inventory modification matrices.</p>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => { setIsNewProductFormActive(true); setAdminSelectedProductForMutation(null); }}
                  className="bg-brand-red text-white px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" /> Inject New Inventory Item
                </button>
                <button onClick={() => { setActiveUserAuthentication(null); setCurrentNavigationRoute('home'); }} className="bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 px-3 py-2 rounded-xl text-xs font-bold">
                  Exit Session
                </button>
              </div>
            </div>

            {/* Live Data Telemetry Blocks */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white dark:bg-zinc-900 border p-4 rounded-2xl space-y-1"><div className="text-zinc-400"><BarChart3 className="w-4 h-4" /></div><p className="text-xs text-brand-muted font-bold">Gross Yield Index</p><h4 className="text-xl font-black text-brand-red">৳{administrativeAnalytics.grossRevenue.toLocaleString()}</h4></div>
              <div className="bg-white dark:bg-zinc-900 border p-4 rounded-2xl space-y-1"><div className="text-zinc-400"><Package className="w-4 h-4" /></div><p className="text-xs text-brand-muted font-bold">Catalog Configurations</p><h4 className="text-xl font-black">{globalCatalogArray.length} Active</h4></div>
              <div className="bg-white dark:bg-zinc-900 border p-4 rounded-2xl space-y-1"><div className="text-zinc-400"><Users className="w-4 h-4" /></div><p className="text-xs text-brand-muted font-bold">User Registries</p><h4 className="text-xl font-black">184 Verified</h4></div>
              <div className="bg-white dark:bg-zinc-900 border p-4 rounded-2xl space-y-1 bg-amber-500/5"><div className="text-amber-500"><AlertCircle className="w-4 h-4" /></div><p className="text-xs text-amber-600 font-bold">Low-Stock Exceptions</p><h4 className="text-xl font-black text-amber-600">{globalCatalogArray.filter(p => p.stock < 5).length} Pending</h4></div>
            </div>

            {/* Inline Micro-Form: New Item Injection or Existing Item Mutation Pipeline */}
            {(isNewProductFormActive || adminSelectedProductForMutation) && (
              <form onSubmit={(e) => {
                e.preventDefault();
                const name = e.target.pName.value;
                const price = Number(e.target.pPrice.value);
                const desc = e.target.pDesc.value;
                const stock = Number(e.target.pStock.value);

                if (adminSelectedProductForMutation) {
                  // Mutation Logic Array Adjustments
                  const altered = globalCatalogArray.map(p => p._id === adminSelectedProductForMutation._id ? {
                    ...p, name, basePriceBDT: price, description: desc, stock
                  } : p);
                  setGlobalCatalogArray(altered);
                  triggerUINotificationToast("Inventory instance successfully updated inside cache matrix.");
                } else {
                  // Injection Matrix Implementation
                  const newItem = {
                    _id: "p_" + Date.now(),
                    name, basePriceBDT: price, description: desc, stock,
                    sku: "ASF-GEN-" + Math.floor(100+Math.random()*900),
                    discountBadge: "", discountPct: 0, category: "Wardrobe",
                    images: ["https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=600&q=80"],
                    variants: { sizes: ["Standard Grid Layout"], colors: ["Hammered Industrial Tone"] },
                    rating: 5.0, reviews: [], tags: ["Injected Asset"]
                  };
                  setGlobalCatalogArray([...globalCatalogArray, newItem]);
                  triggerUINotificationToast("New structural product line injected successfully.");
                }
                setIsNewProductFormActive(false);
                setAdminSelectedProductForMutation(null);
              }} className="bg-zinc-50 dark:bg-zinc-900 border-2 border-dashed border-brand-red/30 p-4 sm:p-6 rounded-2xl space-y-4">
                <h3 className="text-xs font-black uppercase tracking-widest text-brand-red">{adminSelectedProductForMutation ? "Mutate Catalog Node Data" : "Initialize New Hardware Frame Mapping"}</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <input name="pName" type="text" placeholder="Product Line Label Title" defaultValue={adminSelectedProductForMutation?.name || ""} required className="p-2 border text-xs bg-white dark:bg-zinc-800 rounded-lg" />
                  <input name="pPrice" type="number" placeholder="Base Valuation BDT" defaultValue={adminSelectedProductForMutation?.basePriceBDT || ""} required className="p-2 border text-xs bg-white dark:bg-zinc-800 rounded-lg" />
                  <input name="pStock" type="number" placeholder="Warehouse Stock Volume Units" defaultValue={adminSelectedProductForMutation?.stock ?? 10} required className="p-2 border text-xs bg-white dark:bg-zinc-800 rounded-lg" />
                </div>
                <textarea name="pDesc" rows="2" placeholder="Comprehensive technical and physical description parameters..." defaultValue={adminSelectedProductForMutation?.description || ""} required className="w-full p-2 border text-xs bg-white dark:bg-zinc-800 rounded-lg"></textarea>
                <div className="flex justify-end gap-2">
                  <button type="button" onClick={() => { setIsNewProductFormActive(false); setAdminSelectedProductForMutation(null); }} className="px-3 py-1 bg-zinc-300 text-brand-dark text-xs font-bold rounded-md">Cancel Loop</button>
                  <button type="submit" className="px-4 py-1 bg-brand-dark dark:bg-zinc-700 text-white text-xs font-bold rounded-md">Commit Structural Registry</button>
                </div>
              </form>
            )}

            {/* Inventory Asset Control Grid Sheet */}
            <div className="bg-white dark:bg-zinc-900 border rounded-2xl overflow-hidden shadow-sm">
              <div className="p-4 bg-zinc-50 dark:bg-zinc-800/50 border-b font-black text-xs uppercase tracking-wider text-brand-muted">
                Active Catalog Inventory Matrices
              </div>
              <div className="divide-y divide-brand-border dark:divide-zinc-800">
                {globalCatalogArray.map((p) => (
                  <div key={p._id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
                    <div className="space-y-1">
                      <h4 className="font-bold text-sm text-brand-dark dark:text-white">{p.name}</h4>
                      <p className="text-brand-muted text-[11px]">SKU Array: <span className="font-mono font-bold text-zinc-700 dark:text-zinc-300">{p.sku}</span> | Valuation Index: <span className="text-brand-red font-bold">৳{p.basePriceBDT.toLocaleString()}</span></p>
                      <p className="text-zinc-500 line-clamp-1 italic">"{p.description}"</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button 
                        onClick={() => { setAdminSelectedProductForMutation(p); setIsNewProductFormActive(false); }}
                        className="px-3 py-1.5 border border-zinc-300 dark:border-zinc-700 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 flex items-center gap-1 font-bold"
                      >
                        <Edit className="w-3.5 h-3.5" /> Mutate
                      </button>
                      <button 
                        onClick={() => { setGlobalCatalogArray(globalCatalogArray.filter(item => item._id !== p._id)); triggerUINotificationToast("Asset node purged successfully."); }}
                        className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg flex items-center gap-1 font-bold transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Purge
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ================= COMPREHENSIVE REGULATORY DOCUMENTATION CHANNELS ================= */}
        {currentNavigationRoute === 'shippingPolicy' && (
          <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 sm:p-8 border max-w-3xl mx-auto space-y-4 text-xs sm:text-sm leading-relaxed">
            <h2 className="text-lg font-black uppercase tracking-tight border-b pb-2">Logistical Distribution & Shipping Protocols</h2>
            <p>Alif Steel Furniture manages its logistics operations using private freight transport. This guarantees structural items arrive without alignment degradation.</p>
            <h4 className="font-bold uppercase tracking-wider text-xs pt-2">Operational Timelines</h4>
            <ul className="list-disc pl-5 space-y-1 text-brand-muted">
              <li>Dhaka Metropolitan Quadrant: 48 to 72 Processing Hours.</li>
              <li>Outlying Division Hubs nationwide: 5 to 7 Operational Business Days.</li>
            </ul>
          </div>
        )}

        {currentNavigationRoute === 'faqPage' && (
          <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 border max-w-2xl mx-auto space-y-4 text-xs sm:text-sm">
            <h2 className="text-lg font-black uppercase tracking-tight border-b pb-2">Technical Structural FAQ Directory</h2>
            {[
              { q: "Does the pricing architecture include contextual shipping updates?", a: "No, logistical distribution expenses are calculated dynamically using real-time zone vectors selected during checkout." },
              { q: "What parameters ensure rust-resistant operational lifetimes?", a: "Every single sheet item undergoes automated zinc-phosphate chemical washes followed by industrial electro-powder baking cycles at 180°C." }
            ].map((faq, i) => (
              <div key={i} className="space-y-1 border-b pb-3">
                <h4 className="font-bold text-brand-dark dark:text-zinc-100 flex items-center gap-1.5"><HelpCircle className="w-4 h-4 text-brand-red" /> {faq.q}</h4>
                <p className="text-brand-muted pl-5">{faq.a}</p>
              </div>
            ))}
          </div>
        )}

      </main>

      {/* --- INTEGRATED COMPREHENSIVE FOOTER ARCHITECTURE --- */}
      <footer className="bg-brand-dark text-zinc-400 text-xs border-t border-zinc-800 mt-20 transition-all">
        <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="space-y-4 col-span-2 md:col-span-1">
            <h3 className="text-white font-black uppercase tracking-widest text-sm">ALIF STEEL FURNITURE</h3>
            <p className="text-zinc-500 leading-relaxed text-[11px]">
              Production-grade steel wardrobe and almirah systems constructed with advanced electro-powder coating protection parameters.
            </p>
            <p className="text-[10px] text-zinc-600">Operating System Interface Context: Year 2026</p>
          </div>
          
          <div className="space-y-2">
            <h4 className="text-white font-bold uppercase tracking-wider text-[11px]">Catalog Gateways</h4>
            <ul className="space-y-1.5 text-[11px]">
              <li onClick={() => { setSelectedCategoryFilter('Wardrobe'); setCurrentNavigationRoute('shop'); }} className="hover:text-white cursor-pointer transition-colors">Premium Wardrobes</li>
              <li onClick={() => { setSelectedCategoryFilter('Almirah'); setCurrentNavigationRoute('shop'); }} className="hover:text-white cursor-pointer transition-colors">High-Security Almirahs</li>
              <li onClick={() => setCurrentNavigationRoute('shop')} className="hover:text-white cursor-pointer transition-colors">Full Core Catalog</li>
            </ul>
          </div>

          <div className="space-y-2">
            <h4 className="text-white font-bold uppercase tracking-wider text-[11px]">Support Structures</h4>
            <ul className="space-y-1.5 text-[11px]">
              <li onClick={() => setCurrentNavigationRoute('orderTracking')} className="hover:text-white cursor-pointer transition-colors flex items-center gap-1"><Package className="w-3 h-3" /> Track Consignment</li>
              <li onClick={() => setCurrentNavigationRoute('faqPage')} className="hover:text-white cursor-pointer transition-colors">Technical FAQ Index</li>
              <li onClick={() => setCurrentNavigationRoute('shippingPolicy')} className="hover:text-white cursor-pointer transition-colors">Shipping Framework</li>
            </ul>
          </div>

          <div className="space-y-2">
            <h4 className="text-white font-bold uppercase tracking-wider text-[11px]">Operational Security</h4>
            <p className="text-zinc-500 text-[11px]">Authorized administration credentials required to update active catalog items or modify pricing indexes.</p>
            <button onClick={() => setCurrentNavigationRoute('login')} className="text-white bg-zinc-800 px-3 py-1.5 rounded text-[10px] font-bold uppercase tracking-wider hover:bg-brand-red transition-colors">
              Administrative Console
            </button>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 py-4 border-t border-zinc-900 text-center text-[10px] text-zinc-600 uppercase tracking-widest font-mono">
          © 2026 Alif Steel Furniture Ecosystem. All Rights Reserved. Production Release 2.4.0.
        </div>
      </footer>
    </div>
  );
}