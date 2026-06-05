import { useState, useEffect, useMemo } from 'react';

// Premium Food Menu Data with beautiful curated Unsplash Food Images (Prices in INR)
const MENU_ITEMS = [
  {
    id: 'f1',
    name: 'Honey-Glazed Crinkle Fries',
    category: 'Fries',
    price: 129,
    rating: 4.8,
    reviews: 124,
    description: 'Crispy golden crinkle-cut fries tossed in a light sweet-savory honey dust.',
    image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=600&q=80',
    tags: ['Best Seller', 'Sweet & Salty']
  },
  {
    id: 'f2',
    name: 'Spicy Honey-Mustard Fries',
    category: 'Fries',
    price: 149,
    rating: 4.6,
    reviews: 89,
    description: 'Classic fries served with our signature house-made hot honey-mustard dip.',
    image: 'https://images.unsplash.com/photo-1585109649139-366815a0d713?auto=format&fit=crop&w=600&q=80',
    tags: ['Spicy']
  },
  {
    id: 'f3',
    name: 'Cheesy Signature Loaded Fries',
    category: 'Fries',
    price: 189,
    rating: 4.9,
    reviews: 210,
    description: 'Fries layered with melted cheddar, honey barbecue drizzle, and crispy bacon bits.',
    image: 'https://images.unsplash.com/photo-1541532713592-79a0317b6b77?auto=format&fit=crop&w=600&q=80',
    tags: ['Must Try']
  },
  {
    id: 'p1',
    name: 'Sweet & Spicy Signature Pizza',
    category: 'Pizza',
    price: 349,
    rating: 4.9,
    reviews: 315,
    description: 'Premium pepperoni, jalapenos, fresh mozzarella, finished with a generous hot honey drizzle.',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&q=80',
    tags: ['Signature', 'Spicy']
  },
  {
    id: 'p2',
    name: 'Premium Margherita Pizza',
    category: 'Pizza',
    price: 299,
    rating: 4.7,
    reviews: 145,
    description: 'Classic rich tomato sauce, fresh buffalo mozzarella, cherry tomatoes, and basil oil.',
    image: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?auto=format&fit=crop&w=600&q=80',
    tags: ['Vegetarian']
  },
  {
    id: 'p3',
    name: 'BBQ Grilled Chicken Pizza',
    category: 'Pizza',
    price: 399,
    rating: 4.8,
    reviews: 198,
    description: 'Grilled chicken strips, red onions, cilantro, and sweet honey BBQ sauce swirl.',
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=600&q=80',
    tags: ['Popular']
  },
  {
    id: 'b1',
    name: 'Goret Classic Double Burger',
    category: 'Burgers',
    price: 249,
    rating: 4.9,
    reviews: 412,
    description: 'Two smashed angus beef patties, double cheddar cheese, and caramelized honey onions on brioche.',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80',
    tags: ['Heavyweight']
  },
  {
    id: 'b2',
    name: 'Goret Crispy Chicken Burger',
    category: 'Burgers',
    price: 219,
    rating: 4.7,
    reviews: 234,
    description: 'Crispy fried buttermilk chicken breast, spicy pickles, honey slaw, and secret sauce.',
    image: 'https://images.unsplash.com/photo-1625813506062-0aeb1d7a094b?auto=format&fit=crop&w=600&q=80',
    tags: ['Crispy']
  },
  {
    id: 'd1',
    name: 'Honey Drizzled Butter Waffles',
    category: 'Desserts',
    price: 179,
    rating: 4.9,
    reviews: 512,
    description: 'Fluffy warm buttermilk waffles topped with pure wildflower honey and vanilla ice cream.',
    image: 'https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?auto=format&fit=crop&w=600&q=80',
    tags: ['Sweet Tooth', 'Best Seller']
  },
  {
    id: 'd2',
    name: 'Goret Caramel Cupcakes',
    category: 'Desserts',
    price: 99,
    rating: 4.5,
    reviews: 78,
    description: 'Set of two honey-infused sponge cupcakes topped with caramelized frosting swirls.',
    image: 'https://images.unsplash.com/photo-1576618148400-f54bed99fcfd?auto=format&fit=crop&w=600&q=80',
    tags: ['Kids Love It']
  },
  {
    id: 'dr1',
    name: 'Organic Honey Lemon Iced Tea',
    category: 'Drinks',
    price: 89,
    rating: 4.8,
    reviews: 340,
    description: 'Brewed black tea infused with squeezed lemons and premium wild honey.',
    image: 'https://images.unsplash.com/photo-1497534446932-c925b458314e?auto=format&fit=crop&w=600&q=80',
    tags: ['Refreshing']
  },
  {
    id: 'dr2',
    name: 'Goret Caramel Macchiato',
    category: 'Drinks',
    price: 149,
    rating: 4.7,
    reviews: 190,
    description: 'Layered espresso with vanilla syrup, steamed honey-infused milk, and caramel drizzle.',
    image: 'https://images.unsplash.com/photo-1485808191679-5f86510681a2?auto=format&fit=crop&w=600&q=80',
    tags: ['Caffeine Boost']
  }
];

// Sound Effects via Web Audio API for interactive gamified feel
const playBuzzSound = (type = 'success') => {
  try {
    const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    
    osc.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    
    if (type === 'add') {
      // Ascending confirmation pop
      osc.type = 'sine';
      osc.frequency.setValueAtTime(250, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(600, audioCtx.currentTime + 0.15);
      gainNode.gain.setValueAtTime(0.15, audioCtx.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.01, audioCtx.currentTime + 0.15);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.16);
    } else if (type === 'remove') {
      // Descending action pop
      osc.type = 'sine';
      osc.frequency.setValueAtTime(450, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(200, audioCtx.currentTime + 0.15);
      gainNode.gain.setValueAtTime(0.15, audioCtx.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.01, audioCtx.currentTime + 0.15);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.16);
    } else if (type === 'checkout') {
      // Success melody
      const notes = [300, 400, 500, 600];
      notes.forEach((freq, index) => {
        const itemOsc = audioCtx.createOscillator();
        const itemGain = audioCtx.createGain();
        itemOsc.connect(itemGain);
        itemGain.connect(audioCtx.destination);
        itemOsc.type = 'triangle';
        itemOsc.frequency.setValueAtTime(freq, audioCtx.currentTime + index * 0.08);
        itemGain.gain.setValueAtTime(0.1, audioCtx.currentTime + index * 0.08);
        itemGain.gain.linearRampToValueAtTime(0.01, audioCtx.currentTime + index * 0.08 + 0.07);
        itemOsc.start(audioCtx.currentTime + index * 0.08);
        itemOsc.stop(audioCtx.currentTime + index * 0.08 + 0.08);
      });
    }
  } catch (e) {
    // Audio context failed or blocked by browser
  }
};

// Helper to interpolate coordinates along the GPS flight path
const getBeeCoordinates = (p: number) => {
  if (p <= 25) {
    const ratio = p / 25;
    return { x: 40 + (120 - 40) * ratio, y: 40 };
  } else if (p <= 50) {
    const ratio = (p - 25) / 25;
    return { x: 120, y: 40 + (120 - 40) * ratio };
  } else if (p <= 75) {
    const ratio = (p - 50) / 25;
    return { x: 120 + (280 - 120) * ratio, y: 120 };
  } else {
    const ratio = (p - 75) / 25;
    return { x: 280 + (360 - 280) * ratio, y: 120 + (160 - 120) * ratio };
  }
};

const TABLE_COORDINATES: { [key: string]: { x: number; y: number } } = {
  '1': { x: 50, y: 80 },
  '2': { x: 150, y: 80 },
  '3': { x: 250, y: 80 },
  '4': { x: 350, y: 80 },
  '5': { x: 50, y: 130 },
  '6': { x: 150, y: 130 },
  '7': { x: 250, y: 130 },
  '8': { x: 350, y: 130 },
  '9': { x: 50, y: 180 },
  '10': { x: 150, y: 180 },
  '11': { x: 250, y: 180 },
  '12': { x: 350, y: 180 },
};

export default function App() {
  const [cart, setCart] = useState<{ [key: string]: number }>({});
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [orderStatus, setOrderStatus] = useState('idle'); // idle -> placed -> preparing -> delivering -> delivered
  const [customerName, setCustomerName] = useState('Valued Customer');
  const [customerAddress, setCustomerAddress] = useState('Sector 15, HSR Layout, Bengaluru');
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<{ code: string; discount: number } | null>(null); // { code: 'GORET15', discount: 0.15 }
  const [promoError, setPromoError] = useState('');

  const [currentView, setCurrentView] = useState<'menu' | 'tracking' | 'login'>('menu');
  const [activeOrder, setActiveOrder] = useState<{
    id: string;
    items: { id: string; qty: number }[];
    subtotal: number;
    discount: number;
    deliveryFee: number;
    tax: number;
    total: number;
    promoCode: string | null;
    customerName: string;
    customerAddress: string;
    timestamp: string;
    paymentMethod: string;
    diningMode: 'dine-in' | 'delivery';
    tableNumber: string | null;
  } | null>(null);
  const [driverMessages, setDriverMessages] = useState<Array<{ sender: 'user' | 'driver' | 'system'; text: string; time: string }>>([]);
  const [chatInput, setChatInput] = useState('');
  const [checkoutStep, setCheckoutStep] = useState<'cart' | 'payment'>('cart');
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'wallet' | 'cod'>('upi');
  const [cardDetails, setCardDetails] = useState({ number: '', expiry: '', cvv: '' });
  const [mapProgress, setMapProgress] = useState(0);

  // Authentication State
  const [user, setUser] = useState<{ name: string; email: string; address: string } | null>(null);
  const [accounts, setAccounts] = useState<Array<{ name: string; email: string; password: string; address: string }>>([
    { name: 'Goret Customer', email: 'customer@goretscafe.com', password: 'securepass123', address: 'Apartment 42, HSR Layout, Sector 15, Bengaluru' }
  ]);
  const [authTab, setAuthTab] = useState<'login' | 'register'>('login');
  const [authForm, setAuthForm] = useState({ name: '', email: '', password: '', address: '' });
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [authError, setAuthError] = useState('');

  // Dining Mode State
  const [showDiningModal, setShowDiningModal] = useState(false);
  const [diningMode, setDiningMode] = useState<'dine-in' | 'delivery' | null>(null);
  const [tableNumber, setTableNumber] = useState('');
  const [diningStep, setDiningStep] = useState<'ask' | 'table'>('ask');
  const [darkMode, setDarkMode] = useState(true);

  // Active categories helper
  const categories = useMemo(() => ['All', 'Fries', 'Pizza', 'Burgers', 'Desserts', 'Drinks'], []);

  // Filter menu items by category & search term
  const filteredMenuItems = useMemo(() => {
    return MENU_ITEMS.filter((item) => {
      const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
      const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            item.category.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchTerm]);

  // Cart helper quantities
  const totalCartItemsCount = useMemo(() => {
    return Object.values(cart).reduce((acc, qty) => acc + qty, 0);
  }, [cart]);

  const subtotal = useMemo(() => {
    return Object.entries(cart).reduce((acc, [id, qty]) => {
      const item = MENU_ITEMS.find(m => m.id === id);
      return acc + (item ? item.price * qty : 0);
    }, 0);
  }, [cart]);

  const deliveryFee = subtotal > 0 && diningMode !== 'dine-in' ? 39 : 0;
  const discountAmount = appliedPromo ? subtotal * appliedPromo.discount : 0;
  const taxAmount = (subtotal - discountAmount) * 0.05; // 5% GST for Food Delivery in India
  const grandTotal = subtotal > 0 ? (subtotal - discountAmount + deliveryFee + taxAmount) : 0;

  // Cart operations
  const addToCart = (itemId: string) => {
    setCart(prev => ({
      ...prev,
      [itemId]: (prev[itemId] || 0) + 1
    }));
    playBuzzSound('add');
  };

  const removeFromCart = (itemId: string) => {
    setCart(prev => {
      const updated = { ...prev };
      if (updated[itemId] <= 1) {
        delete updated[itemId];
      } else {
        updated[itemId] -= 1;
      }
      return updated;
    });
    playBuzzSound('remove');
  };

  // Promocode system
  const handleApplyPromo = () => {
    const code = promoCode.trim().toUpperCase();
    if (code === 'GORET15') {
      setAppliedPromo({ code, discount: 0.15 });
      setPromoError('');
    } else {
      setPromoError('Invalid promo code. Please try again.');
    }
  };

  // Checkout Simulators
  const handleCheckout = () => {
    if (totalCartItemsCount === 0) return;
    
    let payText = 'Cash on Delivery';
    if (paymentMethod === 'upi') payText = 'UPI Transfer';
    else if (paymentMethod === 'card') {
      const lastFour = cardDetails.number.replace(/\s+/g, '').slice(-4) || '4242';
      payText = `Credit/Debit Card (*${lastFour})`;
    }
    else if (paymentMethod === 'wallet') payText = 'Goret Wallet Balance';

    setActiveOrder({
      id: `ORD-${Math.floor(10000 + Math.random() * 90000)}-GP`,
      items: Object.entries(cart).map(([id, qty]) => ({ id, qty })),
      subtotal,
      discount: discountAmount,
      deliveryFee,
      tax: taxAmount,
      total: grandTotal,
      promoCode: appliedPromo?.code || null,
      customerName: customerName || 'Valued Customer',
      customerAddress: diningMode === 'dine-in' ? `Table ${tableNumber} (Dine-In)` : (customerAddress || 'Sector 15, HSR Layout, Bengaluru'),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      paymentMethod: payText,
      diningMode: diningMode || 'delivery',
      tableNumber: diningMode === 'dine-in' ? tableNumber : null
    });
    setOrderStatus('placed');
    setIsCartOpen(false);
    setCheckoutStep('cart');
    setCurrentView('tracking');
    playBuzzSound('checkout');
    
    // Clear cart so user can browse/start a new cart
    setCart({});
    setAppliedPromo(null);
    setPromoCode('');
  };

  // Status transitions & map progress animations
  useEffect(() => {
    let interval: any;
    if (orderStatus === 'placed') {
      setMapProgress(5);
      const timer = setTimeout(() => setOrderStatus('preparing'), 4000);
      return () => clearTimeout(timer);
    } else if (orderStatus === 'preparing') {
      setMapProgress(25);
      const timer = setTimeout(() => setOrderStatus('delivering'), 5000);
      return () => clearTimeout(timer);
    } else if (orderStatus === 'delivering') {
      setMapProgress(50);
      let current = 50;
      interval = setInterval(() => {
        current += 3;
        if (current > 92) current = 92;
        setMapProgress(current);
      }, 500);

      const timer = setTimeout(() => setOrderStatus('delivered'), 7000);
      return () => {
        clearInterval(interval);
        clearTimeout(timer);
      };
    } else if (orderStatus === 'delivered') {
      setMapProgress(100);
    } else if (orderStatus === 'idle') {
      setMapProgress(0);
    }
  }, [orderStatus]);

  // Trigger driver messages dynamically on order status change
  useEffect(() => {
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const isDineIn = activeOrder?.diningMode === 'dine-in';
    const tableNum = activeOrder?.tableNumber || '';
    
    if (orderStatus === 'placed') {
      setDriverMessages([
        { sender: 'system', text: isDineIn ? 'Order received by the kitchen. Preparing to serve.' : 'Order received. Preparing for dispatch.', time: timestamp },
        { sender: 'driver', text: isDineIn 
            ? `Hi! I'm Buster, your server today. I'm heading to Goret's kitchen to collect your order for Table ${tableNum}! 🍽️`
            : "Hi! I'm Buster, your delivery partner. I'm heading to Goret's Cafe to pick up your order! 🛵", 
          time: timestamp }
      ]);
    } else if (orderStatus === 'preparing') {
      setDriverMessages(prev => [
        ...prev,
        { sender: 'system', text: "Goret's kitchen is preparing your food.", time: timestamp },
        { sender: 'driver', text: 'Chef Goret is freshly preparing and packaging your items now.', time: timestamp }
      ]);
    } else if (orderStatus === 'delivering') {
      setDriverMessages(prev => [
        ...prev,
        { sender: 'system', text: isDineIn ? `Your order is on the way. Buster is carrying it to Table ${tableNum}.` : 'Order is out for delivery. Buster is in transit.', time: timestamp },
        { sender: 'driver', text: isDineIn 
            ? `Bringing your hot meal to Table ${tableNum} now.`
            : "I am currently in transit to your address.", 
          time: timestamp }
      ]);
    } else if (orderStatus === 'delivered') {
      setDriverMessages(prev => [
        ...prev,
        { sender: 'system', text: isDineIn ? `Order served to Table ${tableNum}!` : 'Order successfully delivered!', time: timestamp },
        { sender: 'driver', text: isDineIn 
            ? `Enjoy your meal at Table ${tableNum}! Please let us know if you need anything else. 🍽️💛`
            : 'Your package has been delivered. Enjoy your meal! Please let us know if everything is to your satisfaction. 💛', 
          time: timestamp }
      ]);
    }
  }, [orderStatus, activeOrder]);

  // Update customer checkout details when user signs in
  useEffect(() => {
    if (user) {
      setCustomerName(user.name);
      setCustomerAddress(user.address);
    }
  }, [user]);

  const handleResetOrder = () => {
    setOrderStatus('idle');
    setActiveOrder(null);
    setCurrentView('menu');
    setCheckoutStep('cart');
  };


  return (
    <div className={`min-h-screen font-sans antialiased transition-colors duration-300 selection:bg-amber-400 selection:text-black ${
      darkMode ? 'bg-[#0F0E0C] text-[#F3F1EC]' : 'bg-[#FCFBF7] text-neutral-800'
    }`}>
      {/* HEADER SECTION */}
      <header className={`sticky top-0 z-40 backdrop-blur-md px-4 py-3 sm:px-8 flex justify-between items-center border-b transition-all duration-300 ${
        darkMode ? 'bg-[#0F0E0C]/85 border-neutral-800/60 shadow-[0_4px_20px_rgba(0,0,0,0.4)]' : 'bg-white/85 border-neutral-200/60 shadow-[0_4px_20px_rgba(0,0,0,0.02)]'
      }`}>
        {/* Honeybee Logo and Name */}
        <div className="flex items-center space-x-3 cursor-pointer group" onClick={() => setActiveCategory('All')}>
          <div className="bg-gradient-to-br from-amber-500 to-amber-600 p-2 rounded-xl transform group-hover:scale-105 group-hover:rotate-3 transition-all duration-300 shadow-[0_4px_12px_rgba(245,158,11,0.2)]">
            {/* Cute Bee SVG */}
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 fill-white" viewBox="0 0 24 24">
              <path d="M12 2a4 4 0 0 0-4 4c0 1.25.5 2.39 1.41 3.19C7.14 10.32 6 12 6 14v1c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2v-1c0-2-1.14-3.68-3.41-4.81C15.5 8.39 16 7.25 16 6a4 4 0 0 0-4-4zm0 2c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm-4 10c0-1.66 1.34-3 3-3s3 1.34 3 3v1H8v-1z"/>
              <path d="M4 14a3 3 0 0 1-3-3V9.5a1.5 1.5 0 0 1 3 0V11a3 3 0 0 1 0 3zm16 0a3 3 0 0 0 3-3V9.5a1.5 1.5 0 0 0-3 0V11a3 3 0 0 0 0 3z" />
              <path d="M12 21a2 2 0 1 1-4 0h4z" />
            </svg>
          </div>
          <div>
            <h1 className={`text-xl sm:text-2xl font-extrabold tracking-tight uppercase leading-none transition-colors ${
              darkMode ? 'text-white' : 'text-neutral-900'
            }`}>
              Goret's Cafe
            </h1>
            <p className={`text-[9px] font-black tracking-widest uppercase mt-0.5 hidden sm:block ${
              darkMode ? 'text-neutral-400' : 'text-neutral-500'
            }`}>
              🍽️ Premium Artisanal Cafe ✨
            </p>
          </div>
        </div>

        {/* Search Input on Desktop Header */}
        <div className="hidden md:flex flex-1 max-w-md mx-8 relative">
          <input
            type="text"
            placeholder="Search menu items..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full border rounded-xl py-2 px-4 pl-10 text-xs font-semibold focus:outline-none focus:ring-4 transition-all duration-200 ${
              darkMode 
                ? 'bg-[#181613] border-neutral-800/80 text-white focus:border-amber-500/80 focus:ring-amber-500/20' 
                : 'bg-neutral-50 border-neutral-200/80 text-neutral-800 focus:bg-white focus:border-amber-500/80 focus:ring-amber-500/10'
            }`}
          />
          <div className={`absolute left-3 top-2.5 ${darkMode ? 'text-neutral-500' : 'text-neutral-400'}`}>
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          {searchTerm && (
            <button 
              onClick={() => setSearchTerm('')} 
              className={`absolute right-3 top-2 text-[10px] font-bold px-2 py-0.5 rounded transition ${
                darkMode ? 'bg-neutral-800 hover:bg-neutral-700 text-neutral-300' : 'bg-neutral-200 hover:bg-neutral-300 text-neutral-700'
              }`}
            >
              Clear
            </button>
          )}
        </div>

        {/* Header Action Buttons (Track Order, Theme Toggle, Profile, Basket) */}
        <div className="flex items-center space-x-2.5">
          {orderStatus !== 'idle' && currentView === 'menu' && (
            <button
              onClick={() => setCurrentView('tracking')}
              className={`border px-4 py-2.5 rounded-xl flex items-center space-x-2 transition-all hover:scale-105 active:scale-95 ${
                darkMode 
                  ? 'bg-[#181613] border-neutral-800 text-amber-400 hover:bg-neutral-800' 
                  : 'bg-white border-neutral-200 text-neutral-800 hover:bg-neutral-50 shadow-sm'
              }`}
              title="Track your active honeybee order!"
            >
              <span className="animate-pulse">🛵</span>
              <span className="font-bold text-xs uppercase tracking-wider hidden xs:inline">Track Order</span>
            </button>
          )}

          {/* Theme Toggle Button */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`p-2.5 rounded-xl transition-all border hover:scale-105 active:scale-95 ${
              darkMode ? 'bg-[#181613] border-neutral-800 hover:bg-neutral-800 text-amber-400' : 'bg-white border-neutral-200 hover:bg-neutral-50 text-neutral-600 shadow-sm'
            }`}
            title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {darkMode ? '☀️' : '🌙'}
          </button>

          {/* User Sign In / Profile */}
          {user === null ? (
            <button
              onClick={() => {
                setAuthTab('login');
                setAuthError('');
                setAuthForm({ name: '', email: '', password: '', address: '' });
                setCurrentView('login');
                playBuzzSound('add');
              }}
              className={`border px-4 py-2.5 rounded-xl flex items-center space-x-1.5 transition-all hover:scale-105 active:scale-95 ${
                darkMode
                  ? 'bg-amber-500 hover:bg-amber-600 text-black border-amber-600 shadow-[0_4px_12px_rgba(245,158,11,0.25)]'
                  : 'bg-neutral-900 hover:bg-neutral-850 text-white border-neutral-950 shadow-[0_4px_12px_rgba(0,0,0,0.15)]'
              }`}
              title="Sign in to Goret's Account"
            >
              <span className="text-sm">👤</span>
              <span className="font-bold text-xs uppercase tracking-wider hidden xs:inline">Sign In</span>
            </button>
          ) : (
            <div className={`flex items-center space-x-2 border px-3 py-2 rounded-xl transition ${
              darkMode ? 'bg-[#181613] border-neutral-800 text-white' : 'bg-neutral-50 border-neutral-200 text-neutral-800 shadow-sm'
            }`}>
              <span className="text-xs">👤</span>
              <span className="font-bold text-xs uppercase tracking-tight hidden sm:inline select-none">
                {user.name.split(' ')[0]}
              </span>
              <button
                onClick={() => {
                  setUser(null);
                  setCurrentView('menu');
                  playBuzzSound('remove');
                }}
                className={`text-[9px] font-bold uppercase border px-2 py-0.5 rounded-lg transition ${
                  darkMode ? 'bg-neutral-800 hover:bg-red-900/40 text-red-400 border-neutral-700 hover:border-red-900/60' : 'bg-white hover:bg-red-50 text-red-500 border-neutral-200 hover:border-red-200 shadow-sm'
                }`}
                title="Log out"
              >
                Out
              </button>
            </div>
          )}

          {/* Cart Button */}
          <button
            onClick={() => setIsCartOpen(true)}
            className={`relative border p-2.5 rounded-xl flex items-center space-x-1.5 transition-all hover:scale-105 active:scale-95 ${
              darkMode
                ? 'bg-amber-500 hover:bg-amber-600 text-black border-amber-600 shadow-[0_4px_12px_rgba(245,158,11,0.25)]'
                : 'bg-neutral-900 hover:bg-neutral-850 text-white border-neutral-950 shadow-[0_4px_12px_rgba(0,0,0,0.15)]'
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            <span className="font-bold text-xs uppercase tracking-wider hidden sm:inline">Basket</span>
            {totalCartItemsCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[9px] font-extrabold rounded-full h-5 w-5 flex items-center justify-center border border-white">
                {totalCartItemsCount}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* MOBILE SEARCH BAR */}
      <div className={`p-4 md:hidden border-b transition-colors ${
        darkMode ? 'bg-[#12110E] border-neutral-800/60' : 'bg-neutral-50 border-neutral-200/60 shadow-sm'
      }`}>
        <div className="relative">
          <input
            type="text"
            placeholder="Search crispy chicken, shakes, fries..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full border rounded-xl py-2 px-4 pl-10 text-xs font-semibold focus:outline-none focus:ring-4 transition-all duration-200 ${
              darkMode 
                ? 'bg-[#181613] border-neutral-800/80 text-white focus:border-amber-500/80 focus:ring-amber-500/20' 
                : 'bg-white border-neutral-200 text-neutral-800 focus:border-amber-500/80 focus:ring-amber-500/10'
            }`}
          />
          <div className={`absolute left-3 top-2.5 ${darkMode ? 'text-neutral-500' : 'text-neutral-400'}`}>
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          {searchTerm && (
            <button 
              onClick={() => setSearchTerm('')} 
              className={`absolute right-3 top-2 text-[10px] font-bold px-2 py-0.5 rounded transition ${
                darkMode ? 'bg-neutral-800 hover:bg-neutral-700 text-neutral-300' : 'bg-neutral-200 hover:bg-neutral-300 text-neutral-700'
              }`}
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {currentView === 'login' ? (
        <div className="max-w-md mx-auto my-12 px-4 animate-fade-in">
          {/* Back button */}
          <button
            onClick={() => {
              setCurrentView('menu');
              setAuthError('');
            }}
            className={`flex items-center space-x-1.5 text-xs font-bold uppercase mb-6 transition-colors focus:outline-none ${
              darkMode ? 'text-neutral-400 hover:text-white' : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            <span>←</span> <span>Back to Menu</span>
          </button>

          <div className={`border p-6 sm:p-8 rounded-3xl space-y-6 relative overflow-hidden transition-all ${
            darkMode 
              ? 'bg-[#1A1916] border-neutral-800/80 shadow-[0_20px_50px_rgba(0,0,0,0.3)]' 
              : 'bg-white border-neutral-200/80 shadow-[0_20px_50px_rgba(0,0,0,0.03)]'
          }`}>
            {/* Top gold line decor */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 to-amber-600" />
            
            {/* Logo/Bee */}
            <div className="text-center space-y-2">
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mx-auto shadow-md animate-bounce duration-[2500ms] ${
                darkMode ? 'bg-gradient-to-br from-amber-500 to-amber-600' : 'bg-gradient-to-br from-amber-400 to-amber-500'
              }`}>
                🍽️
              </div>
              <h3 className={`text-xl font-bold uppercase transition-colors ${darkMode ? 'text-white' : 'text-neutral-850'}`}>Goret's Account</h3>
              <p className={`text-xs font-semibold transition-colors ${darkMode ? 'text-neutral-400' : 'text-neutral-500'}`}>Sign in to save address, track orders, and collect reward points!</p>
            </div>

            {/* Error message */}
            {authError && (
              <div className="bg-red-500/10 border border-red-550/20 text-red-500 rounded-xl p-3 text-xs font-semibold text-center">
                ⚠️ {authError}
              </div>
            )}

            {/* Tabs */}
            <div className={`p-1 rounded-xl flex border transition-colors ${
              darkMode ? 'bg-[#12110E] border-neutral-800' : 'bg-neutral-100 border-neutral-200/80'
            }`}>
              <button
                type="button"
                onClick={() => {
                  setAuthTab('login');
                  setAuthError('');
                }}
                className={`flex-1 py-2 text-xs font-bold uppercase transition-all duration-250 ${
                  authTab === 'login' 
                    ? darkMode
                      ? 'bg-[#1A1916] text-amber-400 border border-neutral-800/80 shadow-sm rounded-lg'
                      : 'bg-white text-neutral-850 shadow-sm rounded-lg'
                    : 'text-neutral-500 hover:text-neutral-800'
                }`}
              >
                🔑 Sign In
              </button>
              <button
                type="button"
                onClick={() => {
                  setAuthTab('register');
                  setAuthError('');
                }}
                className={`flex-1 py-2 text-xs font-bold uppercase transition-all duration-250 ${
                  authTab === 'register' 
                    ? darkMode
                      ? 'bg-[#1A1916] text-amber-400 border border-neutral-800/80 shadow-sm rounded-lg'
                      : 'bg-white text-neutral-850 shadow-sm rounded-lg'
                    : 'text-neutral-500 hover:text-neutral-800'
                }`}
              >
                📝 Create Account
              </button>
            </div>

            {/* Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setAuthError('');

                const email = authForm.email.trim();
                const password = authForm.password;
                
                if (authTab === 'login') {
                  const matched = accounts.find(acc => acc.email.toLowerCase() === email.toLowerCase() && acc.password === password);
                  if (matched) {
                    setUser({ name: matched.name, email: matched.email, address: matched.address });
                    setAuthForm({ name: '', email: '', password: '', address: '' });
                    setCurrentView('menu');
                    playBuzzSound('checkout');
                  } else {
                    setAuthError('Invalid email or password. Please use the demo credentials.');
                    playBuzzSound('remove');
                  }
                } else {
                  // Registration logic
                  const name = authForm.name.trim();
                  const address = authForm.address.trim();

                  if (!name || !email || !password || !address) {
                    setAuthError('Please fill out all fields.');
                    playBuzzSound('remove');
                    return;
                  }

                  if (accounts.some(acc => acc.email.toLowerCase() === email.toLowerCase())) {
                    setAuthError('This email is already registered.');
                    playBuzzSound('remove');
                    return;
                  }

                  // Add account
                  const newAcc = { name, email, password, address };
                  setAccounts(prev => [...prev, newAcc]);
                  setUser({ name, email, address });
                  setAuthForm({ name: '', email: '', password: '', address: '' });
                  setCurrentView('menu');
                  playBuzzSound('checkout');
                }
              }}
              className="space-y-4"
            >
              {authTab === 'register' && (
                <div>
                  <label className={`block text-[10px] font-bold uppercase tracking-wider mb-1 ${
                    darkMode ? 'text-neutral-400' : 'text-neutral-500'
                  }`}>Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="John Doe"
                    value={authForm.name}
                    onChange={(e) => setAuthForm(prev => ({ ...prev, name: e.target.value }))}
                    className={`w-full text-xs font-semibold rounded-xl p-3 focus:outline-none transition-all ${
                      darkMode 
                        ? 'bg-[#12110E] border border-neutral-800 text-white placeholder-neutral-600 focus:border-amber-500 focus:ring-4 focus:ring-amber-500/20' 
                        : 'bg-neutral-50 border border-neutral-250 text-neutral-800 placeholder-neutral-400 focus:bg-white focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10'
                    }`}
                  />
                </div>
              )}

              <div>
                <label className={`block text-[10px] font-bold uppercase tracking-wider mb-1 ${
                  darkMode ? 'text-neutral-400' : 'text-neutral-500'
                }`}>Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="customer@goretscafe.com"
                  value={authForm.email}
                  onChange={(e) => setAuthForm(prev => ({ ...prev, email: e.target.value }))}
                  className={`w-full text-xs font-semibold rounded-xl p-3 focus:outline-none transition-all ${
                    darkMode 
                      ? 'bg-[#12110E] border border-neutral-800 text-white placeholder-neutral-600 focus:border-amber-500 focus:ring-4 focus:ring-amber-500/20' 
                      : 'bg-neutral-50 border border-neutral-250 text-neutral-800 placeholder-neutral-400 focus:bg-white focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10'
                  }`}
                />
              </div>

              <div>
                <label className={`block text-[10px] font-bold uppercase tracking-wider mb-1 ${
                  darkMode ? 'text-neutral-400' : 'text-neutral-500'
                }`}>Password</label>
                <div className="relative">
                  <input
                    type={passwordVisible ? 'text' : 'password'}
                    required
                    placeholder="••••••••"
                    value={authForm.password}
                    onChange={(e) => setAuthForm(prev => ({ ...prev, password: e.target.value }))}
                    className={`w-full text-xs font-semibold rounded-xl p-3 pr-10 focus:outline-none transition-all ${
                      darkMode 
                        ? 'bg-[#12110E] border border-neutral-800 text-white placeholder-neutral-600 focus:border-amber-500 focus:ring-4 focus:ring-amber-500/20' 
                        : 'bg-neutral-50 border border-neutral-250 text-neutral-800 placeholder-neutral-400 focus:bg-white focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setPasswordVisible(!passwordVisible)}
                    className="absolute right-3 top-3 text-neutral-400 hover:text-neutral-600 focus:outline-none text-sm"
                  >
                    {passwordVisible ? '👁️' : '🙈'}
                  </button>
                </div>
              </div>

              {authTab === 'register' && (
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className={`block text-[10px] font-bold uppercase tracking-wider ${
                      darkMode ? 'text-neutral-400' : 'text-neutral-500'
                    }`}>Delivery Address</label>
                    <button
                      type="button"
                      onClick={() => {
                        const addresses = [
                          'Apartment 42, HSR Layout, Sector 3, Bengaluru',
                          'Goret Duplex, Sector 15, HSR Layout, Bengaluru',
                          'Flower Garden Enclave, Level 4, Bengaluru',
                          'Royal Enclave, Chamber 7, Bengaluru'
                        ];
                        const randomAddress = addresses[Math.floor(Math.random() * addresses.length)];
                        setAuthForm(prev => ({ ...prev, address: randomAddress }));
                        playBuzzSound('add');
                        alert("GPS location detected successfully! 🛰️");
                      }}
                      className={`text-[9px] font-bold uppercase transition-colors focus:outline-none ${
                        darkMode ? 'text-amber-400 hover:text-white' : 'text-amber-800 hover:text-neutral-800'
                      }`}
                    >
                      📍 Detect Location (GPS)
                    </button>
                  </div>
                  <input
                    type="text"
                    required
                    placeholder="Enter your delivery address..."
                    value={authForm.address}
                    onChange={(e) => setAuthForm(prev => ({ ...prev, address: e.target.value }))}
                    className={`w-full text-xs font-semibold rounded-xl p-3 focus:outline-none transition-all ${
                      darkMode 
                        ? 'bg-[#12110E] border border-neutral-800 text-white placeholder-neutral-600 focus:border-amber-500 focus:ring-4 focus:ring-amber-500/20' 
                        : 'bg-neutral-50 border border-neutral-250 text-neutral-850 placeholder-neutral-400 focus:bg-white focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10'
                    }`}
                  />
                </div>
              )}

              <button
                type="submit"
                className={`w-full font-semibold text-xs py-3.5 rounded-xl text-center transition-all hover:scale-[1.01] mt-4 shadow-md ${
                  darkMode 
                    ? 'bg-amber-500 hover:bg-amber-600 text-black shadow-[0_4px_12px_rgba(245,158,11,0.25)]' 
                    : 'bg-neutral-900 hover:bg-neutral-850 text-white shadow-sm'
                }`}
              >
                {authTab === 'login' ? '🚀 Log In' : '📝 Register'}
              </button>
            </form>

            {/* Quick Test Credentials Box */}
            {authTab === 'login' && (
              <div 
                onClick={() => {
                  setAuthForm({ name: '', email: 'customer@goretscafe.com', password: 'securepass123', address: '' });
                  setAuthError('');
                  playBuzzSound('add');
                }}
                className={`border border-dashed rounded-2xl p-3.5 cursor-pointer transition-colors ${
                  darkMode 
                    ? 'bg-[#24201A] border-amber-500/20 hover:bg-[#2D2821]' 
                    : 'bg-amber-50/50 border-amber-300 hover:bg-amber-100/40'
                }`}
              >
                <div className={`flex items-center space-x-2 text-[10px] font-bold uppercase ${
                  darkMode ? 'text-amber-400' : 'text-amber-800'
                }`}>
                  <span>💡</span>
                  <span>Demo Credentials (Click to fill)</span>
                </div>
                <div className={`text-[11px] font-mono mt-1 ${darkMode ? 'text-neutral-400' : 'text-neutral-600'}`}>
                  <p>Email: <span className={`font-bold ${darkMode ? 'text-white' : 'text-black'}`}>customer@goretscafe.com</span></p>
                  <p>Pass: <span className={`font-bold ${darkMode ? 'text-white' : 'text-black'}`}>securepass123</span></p>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : currentView === 'tracking' && activeOrder ? (
        <div className="max-w-5xl mx-auto px-4 py-8 sm:px-8 space-y-8 animate-fade-in">
          {/* Tracking Page Header */}
          <div className={`flex flex-col sm:flex-row justify-between items-start sm:items-center p-6 rounded-2xl border transition-all duration-300 gap-4 ${
            darkMode 
              ? 'bg-[#1A1916] border-neutral-800/80 shadow-[0_4px_20px_rgba(0,0,0,0.3)]' 
              : 'bg-white border-neutral-200/80 shadow-[0_8px_30px_rgb(0,0,0,0.03)]'
          }`}>
            <div>
              <div className="flex items-center space-x-2 text-xs font-bold text-amber-500 uppercase tracking-wider">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                </span>
                <span>{activeOrder.diningMode === 'dine-in' ? 'Active Table Radar' : 'Active Delivery Radar'}</span>
              </div>
              <h2 className={`text-2xl font-bold uppercase mt-1 tracking-tight ${
                darkMode ? 'text-white' : 'text-neutral-900'
              }`}>
                Track Order: <span className="text-amber-500 font-mono">{activeOrder.id}</span>
              </h2>
              <p className="text-[11px] font-semibold text-neutral-500">Placed on today at {activeOrder.timestamp}</p>
            </div>
            
            <button
              onClick={() => setCurrentView('menu')}
              className={`font-semibold uppercase text-xs px-5 py-3 rounded-xl transition-all duration-300 flex items-center space-x-2 hover:-translate-y-0.5 active:translate-y-0 ${
                darkMode 
                  ? 'bg-amber-500 hover:bg-amber-600 text-black shadow-[0_4px_12px_rgba(245,158,11,0.25)]' 
                  : 'bg-neutral-900 hover:bg-neutral-850 text-white shadow-sm'
              }`}
            >
              <span>←</span>
              <span>Back to Menu</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            
            {/* LEFT / CENTER: STATUS, STEPPER, MAP, CHAT */}
            <div className="lg:col-span-2 space-y-8">
              
              {/* STATUS CARD */}
              <div className={`p-6 rounded-2xl relative overflow-hidden transition-all duration-300 border ${
                darkMode 
                  ? 'bg-gradient-to-br from-amber-500/20 to-orange-500/10 border-amber-500/30 shadow-[0_8px_30px_rgba(245,158,11,0.08)]' 
                  : 'bg-gradient-to-br from-amber-50 to-orange-50/50 border-amber-200/60 shadow-[0_8px_30px_rgba(0,0,0,0.02)]'
              }`}>
                <div className="absolute -top-6 -right-6 text-7xl opacity-5 select-none pointer-events-none">🍯</div>
                
                <h3 className={`text-[10px] font-bold uppercase tracking-wider ${
                  darkMode ? 'text-amber-400' : 'text-amber-700'
                }`}>
                  {activeOrder.diningMode === 'dine-in' ? 'Current Table Service Phase' : 'Current Delivery Phase'}
                </h3>
                <h2 className={`text-xl sm:text-2xl font-extrabold uppercase mt-1.5 ${
                  darkMode ? 'text-white' : 'text-neutral-900'
                }`}>
                  {orderStatus === 'placed' && (activeOrder.diningMode === 'dine-in' ? '🍽️ Table order received!' : '📦 Order received!')}
                  {orderStatus === 'preparing' && '🍳 Kitchen is preparing your order...'}
                  {orderStatus === 'delivering' && (activeOrder.diningMode === 'dine-in' ? '🏃‍♂️ Buster is serving table!' : '🛵 Courier in transit...')}
                  {orderStatus === 'delivered' && (activeOrder.diningMode === 'dine-in' ? '🎉 Served at Table!' : '🎉 Order delivered!')}
                </h2>
                
                <div className="mt-4 flex flex-wrap items-center gap-3">
                  <div className={`text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-lg border ${
                    darkMode 
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/30' 
                      : 'bg-amber-100 text-amber-800 border-amber-200'
                  }`}>
                    {orderStatus === 'placed' && (activeOrder.diningMode === 'dine-in' ? 'ETA: 15 mins' : 'ETA: 25 mins')}
                    {orderStatus === 'preparing' && (activeOrder.diningMode === 'dine-in' ? 'ETA: 8 mins' : 'ETA: 18 mins')}
                    {orderStatus === 'delivering' && (activeOrder.diningMode === 'dine-in' ? 'ETA: 2 mins' : 'ETA: 8 mins')}
                    {orderStatus === 'delivered' && 'Served!'}
                  </div>
                  <span className={`text-xs font-semibold ${darkMode ? 'text-neutral-400' : 'text-neutral-600'}`}>
                    {orderStatus === 'placed' && 'Waiting for kitchen to fire up the stoves.'}
                    {orderStatus === 'preparing' && (activeOrder.diningMode === 'dine-in' ? 'Our chefs are preparing your dine-in meal.' : 'Our chefs are preparing and packaging your order.')}
                    {orderStatus === 'delivering' && (activeOrder.diningMode === 'dine-in' ? `Buster is bringing your food to Table ${activeOrder.tableNumber}.` : 'Buster is on the delivery route to your location.')}
                    {orderStatus === 'delivered' && (activeOrder.diningMode === 'dine-in' ? `Delicious hot food served at Table ${activeOrder.tableNumber}.` : 'Delicious hot food dropped at your delivery address.')}
                  </span>
                </div>

                {/* Progress bar */}
                <div className={`mt-6 w-full h-3 rounded-full overflow-hidden relative ${
                  darkMode ? 'bg-neutral-800' : 'bg-neutral-200/70'
                }`}>
                  <div 
                    className="h-full bg-gradient-to-r from-amber-500 to-orange-500 transition-all duration-1000 rounded-full"
                    style={{
                      width: 
                        orderStatus === 'placed' ? '15%' :
                        orderStatus === 'preparing' ? '45%' :
                        orderStatus === 'delivering' ? '80%' : '100%'
                    }}
                  />
                  <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(255,255,255,0.15)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.15)_50%,rgba(255,255,255,0.15)_75%,transparent_75%,transparent)] bg-[length:24px_24px] animate-[loading-bar_1.5s_linear_infinite]" />
                </div>
              </div>

              {/* LIVE STEPPER */}
              <div className={`p-6 rounded-2xl border transition-all duration-300 ${
                darkMode 
                  ? 'bg-[#1A1916] border-neutral-800/80 shadow-lg' 
                  : 'bg-white border-neutral-200/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)]'
              }`}>
                <h4 className={`font-bold text-xs uppercase tracking-wider mb-6 flex items-center space-x-2 ${
                  darkMode ? 'text-white' : 'text-neutral-850'
                }`}>
                  <span>📝</span> <span>Tracking Steps</span>
                </h4>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 relative">
                  {/* Step 1 */}
                  <div className={`flex flex-col items-center text-center p-4 rounded-xl border transition-all duration-300 ${
                    darkMode 
                      ? 'bg-[#24201A] border-amber-500/10 text-neutral-200' 
                      : 'bg-amber-50/30 border-amber-200 text-neutral-800 shadow-sm'
                  }`}>
                    <span className="text-2xl">📝</span>
                    <span className="font-bold text-xs uppercase mt-2">Order Confirmed</span>
                    <span className="text-[10px] text-emerald-500 font-bold mt-1">✓ Completed</span>
                  </div>

                  {/* Step 2 */}
                  <div className={`flex flex-col items-center text-center p-4 rounded-xl border transition-all duration-300 ${
                    orderStatus !== 'placed'
                      ? darkMode 
                        ? 'bg-[#24201A] border-amber-500/10 text-neutral-200' 
                        : 'bg-amber-50/30 border-amber-200 text-neutral-800 shadow-sm'
                      : darkMode
                        ? 'bg-[#12110E] border-neutral-850 text-neutral-600 opacity-55'
                        : 'bg-neutral-55 border-neutral-200 text-neutral-400 opacity-60'
                  }`}>
                    <span className={`text-2xl ${orderStatus === 'preparing' ? 'animate-bounce' : ''}`}>🍳</span>
                    <span className="font-bold text-xs uppercase mt-2">Glazing Kitchen</span>
                    <span className={`text-[10px] font-bold mt-1 ${
                      orderStatus === 'placed' ? 'text-neutral-500' :
                      orderStatus === 'preparing' ? 'text-amber-500 animate-pulse font-bold' : 'text-emerald-500'
                    }`}>
                      {orderStatus === 'placed' && 'Pending'}
                      {orderStatus === 'preparing' && 'In Progress...'}
                      {orderStatus !== 'placed' && orderStatus !== 'preparing' && '✓ Baked'}
                    </span>
                  </div>

                  {/* Step 3 */}
                  <div className={`flex flex-col items-center text-center p-4 rounded-xl border transition-all duration-300 ${
                    orderStatus === 'delivering' || orderStatus === 'delivered'
                      ? darkMode 
                        ? 'bg-[#24201A] border-amber-500/10 text-neutral-200' 
                        : 'bg-amber-50/30 border-amber-200 text-neutral-800 shadow-sm'
                      : darkMode
                        ? 'bg-[#12110E] border-neutral-850 text-neutral-600 opacity-55'
                        : 'bg-neutral-55 border-neutral-200 text-neutral-400 opacity-60'
                  }`}>
                    <span className={`text-2xl ${orderStatus === 'delivering' ? 'animate-pulse' : ''}`}>{activeOrder.diningMode === 'dine-in' ? '🍽️' : '🛵'}</span>
                    <span className="font-bold text-xs uppercase mt-2">
                      {activeOrder.diningMode === 'dine-in' ? 'Table Service' : 'Express Delivery'}
                    </span>
                    <span className={`text-[10px] font-bold mt-1 ${
                      orderStatus === 'placed' || orderStatus === 'preparing' ? 'text-neutral-500' :
                      orderStatus === 'delivering' ? 'text-amber-500 animate-pulse font-bold' : 'text-emerald-500'
                    }`}>
                      {orderStatus === 'placed' || orderStatus === 'preparing' ? 'Waiting' :
                       orderStatus === 'delivering' ? (activeOrder.diningMode === 'dine-in' ? 'On the Way!' : 'In Transit!') : '✓ Arrived'}
                    </span>
                  </div>

                  {/* Step 4 */}
                  <div className={`flex flex-col items-center text-center p-4 rounded-xl border transition-all duration-300 ${
                    orderStatus === 'delivered'
                      ? darkMode 
                        ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-300 shadow-sm' 
                        : 'bg-emerald-50 border-emerald-250 text-emerald-800 shadow-sm'
                      : darkMode
                        ? 'bg-[#12110E] border-neutral-850 text-neutral-600 opacity-55'
                        : 'bg-neutral-55 border-neutral-200 text-neutral-400 opacity-60'
                  }`}>
                    <span className="text-2xl">{activeOrder.diningMode === 'dine-in' ? '🎉' : '🍔'}</span>
                    <span className="font-bold text-xs uppercase mt-2">
                      {activeOrder.diningMode === 'dine-in' ? 'Served at Table' : 'Order Delivered'}
                    </span>
                    <span className={`text-[10px] font-bold mt-1 ${orderStatus === 'delivered' ? 'text-emerald-500 font-bold' : 'text-neutral-500'}`}>
                      {orderStatus === 'delivered' ? (activeOrder.diningMode === 'dine-in' ? 'Served' : 'Delivered') : 'Pending'}
                    </span>
                  </div>
                </div>
              </div>

              {/* MAP CARD */}
              <div className={`p-6 rounded-2xl border transition-all duration-300 ${
                darkMode 
                  ? 'bg-[#1A1916] border-neutral-800/80 shadow-lg' 
                  : 'bg-white border-neutral-200/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)]'
              }`}>
                <h4 className={`font-bold text-xs uppercase tracking-wider mb-4 flex items-center space-x-2 ${
                  darkMode ? 'text-white' : 'text-neutral-850'
                }`}>
                  <span>📍</span> <span>{activeOrder.diningMode === 'dine-in' ? 'Cafe Floor Plan Map' : 'Real-time GPS Delivery Route'}</span>
                </h4>
                
                <div className="relative">
                  {activeOrder.diningMode === 'dine-in' ? (
                    <svg viewBox="0 0 400 200" className={`w-full h-56 rounded-xl border relative overflow-hidden transition-colors ${
                      darkMode ? 'bg-[#12110E] border-neutral-800' : 'bg-amber-50/20 border-neutral-200'
                    }`}>
                      <defs>
                        <pattern id="cafeGrid" width="20" height="20" patternUnits="userSpaceOnUse">
                          <path d="M 20 0 L 0 0 0 20" fill="none" stroke={darkMode ? '#F59E0B' : '#D97706'} strokeOpacity="0.08" strokeWidth="0.75" />
                        </pattern>
                      </defs>
                      <rect width="100%" height="100%" fill="url(#cafeGrid)" />
                      
                      {/* Kitchen / Counter area */}
                      <g transform="translate(10, 10)">
                        <rect width="380" height="32" rx="10" fill={darkMode ? '#24201A' : '#FEF3C7'} stroke={darkMode ? '#F59E0B20' : '#F59E0B30'} strokeWidth="1" />
                        <text x="190" y="20" textAnchor="middle" fontSize="10" fontWeight="800" fill={darkMode ? '#F59E0B' : '#B45309'} className="uppercase font-sans tracking-wider">
                          🍳 GORET'S KITCHEN & COUNTER 🍯
                        </text>
                      </g>

                      {/* Path to table */}
                      {(() => {
                        const tableNum = activeOrder.tableNumber || '1';
                        const targetCoords = TABLE_COORDINATES[tableNum] || TABLE_COORDINATES['1'];
                        return (
                          <>
                            <path d={`M 200,45 L ${targetCoords.x},${targetCoords.y}`} fill="none" stroke={darkMode ? '#F59E0B20' : '#F59E0B10'} strokeWidth="4" strokeLinecap="round" />
                            <path d={`M 200,45 L ${targetCoords.x},${targetCoords.y}`} fill="none" stroke="#F59E0B" strokeWidth="2" strokeDasharray="5 3" strokeLinecap="round" />
                          </>
                        );
                      })()}

                      {/* Render All Tables */}
                      {Object.entries(TABLE_COORDINATES).map(([num, coords]) => {
                        const isSelected = activeOrder.tableNumber === num;
                        return (
                          <g key={num} transform={`translate(${coords.x}, ${coords.y})`}>
                            {/* Chairs around table */}
                            <circle cx="-16" cy="0" r="3" fill={darkMode ? '#404040' : '#D4D4D4'} />
                            <circle cx="16" cy="0" r="3" fill={darkMode ? '#404040' : '#D4D4D4'} />
                            <circle cx="0" cy="-16" r="3" fill={darkMode ? '#404040' : '#D4D4D4'} />
                            <circle cx="0" cy="16" r="3" fill={darkMode ? '#404040' : '#D4D4D4'} />
                            
                            {/* Table itself */}
                            <circle r="12" fill={isSelected ? '#10B981' : (darkMode ? '#1E1E1C' : '#FFFFFF')} stroke={isSelected ? '#10B981' : (darkMode ? '#404040' : '#D4D4D4')} strokeWidth="1.5" />
                            <text x="0" y="3" textAnchor="middle" fontSize="8" fontWeight="bold" fill={isSelected ? '#FFFFFF' : (darkMode ? '#D4D4D4' : '#525252')}>
                              {num}
                            </text>
                          </g>
                        );
                      })}

                      {/* Labels */}
                      <text x="200" y="70" textAnchor="middle" fontSize="8" fontWeight="bold" fill={darkMode ? '#F3F1EC' : '#1F2937'} className="uppercase font-sans opacity-25">Seating Area</text>
                      
                      {/* Moving Bee Server */}
                      {(() => {
                        const tableNum = activeOrder.tableNumber || '1';
                        const targetCoords = TABLE_COORDINATES[tableNum] || TABLE_COORDINATES['1'];
                        const startX = 200;
                        const startY = 45;
                        const endX = targetCoords.x;
                        const endY = targetCoords.y;
                        const currentX = startX + (endX - startX) * (mapProgress / 100);
                        const currentY = startY + (endY - startY) * (mapProgress / 100);
                        return (
                          <g transform={`translate(${currentX},${currentY})`} className="transition-transform duration-500 ease-out">
                            <circle r="16" fill="#F59E0B" opacity="0.3" className="animate-ping" />
                            <circle r="10" fill="#facc15" stroke={darkMode ? '#B45309' : '#FFFFFF'} strokeWidth="1.5" />
                            <text x="-7" y="3.5" fontSize="10">🏃‍♂️</text>
                          </g>
                        );
                      })()}
                    </svg>
                  ) : (
                    <svg viewBox="0 0 400 200" className={`w-full h-56 rounded-xl border relative overflow-hidden transition-colors ${
                      darkMode ? 'bg-[#12110E] border-neutral-800' : 'bg-amber-50/20 border-neutral-200'
                    }`}>
                      <defs>
                        <pattern id="mapGrid" width="20" height="20" patternUnits="userSpaceOnUse">
                          <path d="M 20 0 L 0 0 0 20" fill="none" stroke={darkMode ? '#F59E0B' : '#D97706'} strokeOpacity="0.08" strokeWidth="0.75" />
                        </pattern>
                      </defs>
                      <rect width="100%" height="100%" fill="url(#mapGrid)" />
                      
                      {/* Roads/Flight Paths */}
                      <path d="M 0,40 L 400,40 M 0,120 L 400,120 M 0,160 L 400,160 M 120,0 L 120,200 M 280,0 L 280,200" stroke={darkMode ? '#24201A' : '#F3F4F6'} strokeWidth="3" />
                      
                      {/* Route Line */}
                      <path d="M 40,40 L 120,40 L 120,120 L 280,120 L 280,160 L 360,160" fill="none" stroke={darkMode ? '#F59E0B20' : '#F59E0B10'} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M 40,40 L 120,40 L 120,120 L 280,120 L 280,160 L 360,160" fill="none" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="6 3" />
                      
                      {/* Cafe Node */}
                      <g transform="translate(40,40)">
                        <circle r="14" fill={darkMode ? '#1E1E1C' : '#FFFFFF'} stroke="#F59E0B" strokeWidth="2" />
                        <text x="-7" y="4" fontSize="10">🏢</text>
                      </g>
                      
                      {/* Home Node */}
                      <g transform="translate(360,160)">
                        <circle r="14" fill={darkMode ? '#1E1E1C' : '#FFFFFF'} stroke="#10B981" strokeWidth="2" />
                        <text x="-7" y="4" fontSize="10">🏠</text>
                      </g>
                      
                      {/* Labels */}
                      <text x="64" y="32" fontSize="9" fontWeight="bold" fill={darkMode ? '#A3A3A3' : '#6B7280'} className="uppercase font-sans">Goret's Cafe</text>
                      <text x="312" y="190" fontSize="9" fontWeight="bold" fill={darkMode ? '#A3A3A3' : '#6B7280'} className="uppercase font-sans">Your Location</text>
                      
                      {/* Moving Courier */}
                      {(() => {
                        const coords = getBeeCoordinates(mapProgress);
                        return (
                          <g transform={`translate(${coords.x},${coords.y})`} className="transition-transform duration-500 ease-out">
                            <circle r="16" fill="#F59E0B" opacity="0.3" className="animate-ping" />
                            <circle r="10" fill="#facc15" stroke={darkMode ? '#B45309' : '#FFFFFF'} strokeWidth="1.5" />
                            <text x="-7" y="3.5" fontSize="10">🛵</text>
                          </g>
                        );
                      })()}
                    </svg>
                  )}
                  
                  {/* Status Overlay */}
                  <div className={`absolute bottom-3 left-3 text-[9px] font-mono font-bold px-2.5 py-1 rounded-lg border ${
                    darkMode 
                      ? 'bg-[#1A1916] border-neutral-850 text-amber-400' 
                      : 'bg-white border-neutral-200 text-amber-850 shadow-sm'
                  }`}>
                    ⚡ STATUS: {orderStatus === 'delivering' ? (activeOrder.diningMode === 'dine-in' ? 'IN TRANSIT' : 'IN TRANSIT') : orderStatus === 'delivered' ? (activeOrder.diningMode === 'dine-in' ? 'SERVED' : 'DELIVERED') : 'PREPARING'}
                  </div>
                </div>
              </div>

              {/* RIDER PROFILE & CHAT CARD */}
              <div className={`p-6 rounded-2xl border transition-all duration-300 ${
                darkMode 
                  ? 'bg-[#1A1916] border-neutral-800/80 shadow-lg' 
                  : 'bg-white border-neutral-200/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)]'
              }`}>
                <div className={`flex flex-col md:flex-row items-start md:items-center justify-between pb-6 border-b border-dashed gap-4 ${
                  darkMode ? 'border-neutral-800' : 'border-neutral-200'
                }`}>
                  <div className="flex items-center space-x-4">
                    <div className={`w-14 h-14 rounded-full flex items-center justify-center text-2xl border transition-colors ${
                      darkMode ? 'bg-[#24201A] border-amber-500/20' : 'bg-amber-100 border-amber-200'
                    }`}>
                      {activeOrder.diningMode === 'dine-in' ? '🏃‍♂️' : '🛵'}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h4 className={`font-bold text-lg uppercase leading-none ${
                          darkMode ? 'text-white' : 'text-neutral-900'
                        }`}>
                          {activeOrder.diningMode === 'dine-in' ? 'Buster (Server)' : 'Buster (Courier)'}
                        </h4>
                        <span className={`text-[9px] font-bold px-2 py-0.5 rounded-lg border ${
                          darkMode 
                            ? 'bg-amber-500/10 border-amber-500/20 text-amber-400' 
                            : 'bg-amber-100 border-amber-200 text-amber-850'
                        }`}>
                          ⭐ 4.9 Rating
                        </span>
                      </div>
                      <p className="text-xs text-neutral-500 font-medium mt-1">
                        {activeOrder.diningMode === 'dine-in' ? 'Serving you with professional care' : 'Delivering your order via the fastest route'}
                      </p>
                      <p className="text-[10px] text-amber-500 font-semibold uppercase mt-1">
                        {activeOrder.diningMode === 'dine-in' ? '⚡ Server ID: #SERVER-8293' : '⚡ Courier Partner ID: #PARTNER-8293'}
                      </p>
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => {
                      playBuzzSound('add');
                      if (activeOrder.diningMode === 'dine-in') {
                        alert("Notification sent to Buster's pager.");
                      } else {
                        alert("Notification sent to Buster's device.");
                      }
                    }}
                    className={`w-full md:w-auto font-semibold uppercase text-xs px-5 py-3 rounded-xl transition-all duration-300 flex items-center justify-center space-x-2 hover:-translate-y-0.5 active:translate-y-0 ${
                      darkMode 
                        ? 'bg-amber-500 hover:bg-amber-600 text-black shadow-[0_4px_12px_rgba(245,158,11,0.25)]' 
                        : 'bg-neutral-900 hover:bg-neutral-850 text-white shadow-sm'
                    }`}
                  >
                    <span>⚡</span> <span>Notify {activeOrder.diningMode === 'dine-in' ? 'Server' : 'Courier'}</span>
                  </button>
                </div>

                {/* DRIVER CHAT */}
                <div className="mt-6 space-y-4">
                  <h5 className="font-bold text-xs uppercase text-neutral-500 tracking-wider">
                    {activeOrder.diningMode === 'dine-in' ? '💬 Support Chat with Server' : '💬 Support Chat with Courier'}
                  </h5>
                  
                  <div className={`border rounded-xl p-4 h-48 overflow-y-auto space-y-3 flex flex-col scrollbar-none transition-colors ${
                    darkMode ? 'bg-[#12110E] border-neutral-800' : 'bg-neutral-50/50 border-neutral-200'
                  }`}>
                    {driverMessages.length === 0 ? (
                      <p className="text-center text-xs text-neutral-400 italic my-auto font-semibold">No messages yet. Send Buster a message!</p>
                    ) : (
                      driverMessages.map((msg, idx) => {
                        if (msg.sender === 'system') {
                          return (
                            <div key={idx} className={`self-center text-[9px] font-bold uppercase px-3 py-1 rounded-full border my-1 ${
                              darkMode 
                                ? 'bg-amber-500/10 border-amber-500/20 text-amber-400' 
                                : 'bg-amber-50 border-amber-200 text-amber-850'
                            }`}>
                              {msg.text}
                            </div>
                          );
                        }
                        const isUser = msg.sender === 'user';
                        return (
                          <div key={idx} className={`max-w-[80%] rounded-2xl p-3 text-xs font-semibold border ${
                            isUser 
                              ? darkMode 
                                ? 'self-end bg-amber-500 border-amber-500 text-black rounded-tr-none' 
                                : 'self-end bg-neutral-900 border-neutral-900 text-white rounded-tr-none'
                              : darkMode 
                                ? 'self-start bg-[#24201A] border-neutral-800 text-neutral-200 rounded-tl-none' 
                                : 'self-start bg-white border-neutral-200 text-neutral-800 rounded-tl-none shadow-sm'
                          }`}>
                            <div className="flex justify-between items-center text-[8px] opacity-75 mb-1 gap-2">
                              <span>{isUser ? 'YOU' : (activeOrder.diningMode === 'dine-in' ? 'BUSTER (SERVER)' : 'BUSTER (COURIER)')}</span>
                              <span>{msg.time}</span>
                            </div>
                            <p>{msg.text}</p>
                          </div>
                        );
                      })
                    )}
                  </div>

                  <div className="flex space-x-2">
                    <input 
                      type="text"
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          if (!chatInput.trim()) return;
                          const msg = chatInput.trim();
                          const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                          
                          setDriverMessages(prev => [...prev, { sender: 'user', text: msg, time: timestamp }]);
                          setChatInput('');
                          
                          setTimeout(() => {
                            let reply = activeOrder.diningMode === 'dine-in'
                              ? `Understood! I'm coming to Table ${activeOrder.tableNumber} right away! 🍽️`
                              : "Understood! I am on my way to your address. 🛵";
                            const lower = msg.toLowerCase();
                            if (lower.includes('fast') || lower.includes('hurry') || lower.includes('quick') || lower.includes('speed')) {
                              reply = activeOrder.diningMode === 'dine-in'
                                ? `I am checking with the kitchen to speed up preparation for Table ${activeOrder.tableNumber}.`
                                : "I will navigate the fastest route to get there as soon as possible!";
                            } else if (lower.includes('napkin') || lower.includes('sauce') || lower.includes('extra')) {
                              reply = activeOrder.diningMode === 'dine-in'
                                ? `Got it, I'll bring extra napkins/sauces to Table ${activeOrder.tableNumber}!`
                                : "Got it, I'll make sure the kitchen packs extra napkins/sauces for your order!";
                            } else if (lower.includes('thank') || lower.includes('thanks')) {
                              reply = "You are very welcome! Delivering quality service is my pleasure! 😊";
                            }
                            
                            setDriverMessages(prev => [...prev, { sender: 'driver', text: reply, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
                            playBuzzSound('add');
                          }, 1000);
                        }
                      }}
                      placeholder={activeOrder.diningMode === 'dine-in' ? "Type message to Buster & press Enter..." : "Type message to Buster & press Enter..."}
                      className={`flex-1 text-xs font-semibold rounded-xl p-3 focus:outline-none transition-all ${
                        darkMode 
                          ? 'bg-[#12110E] border border-neutral-850 text-white placeholder-neutral-600 focus:border-amber-500/60 focus:ring-4 focus:ring-amber-500/15' 
                          : 'bg-white border border-neutral-250 text-neutral-850 placeholder-neutral-400 focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 shadow-sm'
                      }`}
                    />
                    <button 
                      type="button"
                      onClick={() => {
                        if (!chatInput.trim()) return;
                        const msg = chatInput.trim();
                        const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                        
                        setDriverMessages(prev => [...prev, { sender: 'user', text: msg, time: timestamp }]);
                        setChatInput('');
                        
                        setTimeout(() => {
                          let reply = activeOrder.diningMode === 'dine-in'
                            ? `Understood! I'm coming to Table ${activeOrder.tableNumber} right away! 🍽️`
                            : "Understood! I am on my way to your address. 🛵";
                          const lower = msg.toLowerCase();
                          if (lower.includes('fast') || lower.includes('hurry') || lower.includes('quick') || lower.includes('speed')) {
                            reply = activeOrder.diningMode === 'dine-in'
                              ? `I am checking with the kitchen to speed up preparation for Table ${activeOrder.tableNumber}.`
                              : "I will navigate the fastest route to get there as soon as possible!";
                          } else if (lower.includes('napkin') || lower.includes('sauce') || lower.includes('extra')) {
                            reply = activeOrder.diningMode === 'dine-in'
                              ? `Got it, I'll bring extra napkins/sauces to Table ${activeOrder.tableNumber}!`
                              : "Got it, I'll make sure the kitchen packs extra napkins/sauces for your order!";
                          } else if (lower.includes('thank') || lower.includes('thanks')) {
                            reply = "You are very welcome! Delivering quality service is my pleasure! 😊";
                          }
                          
                          setDriverMessages(prev => [...prev, { sender: 'driver', text: reply, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
                          playBuzzSound('add');
                        }, 1000);
                      }}
                      className={`font-semibold uppercase text-xs px-5 py-3 rounded-xl transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 ${
                        darkMode 
                          ? 'bg-amber-500 hover:bg-amber-600 text-black shadow-[0_4px_12px_rgba(245,158,11,0.25)]' 
                          : 'bg-neutral-900 hover:bg-neutral-850 text-white shadow-sm'
                      }`}
                    >
                      Send
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: RECEIPT INVOICE & ACTIONS */}
            <div className="space-y-8">
              
              {/* RECEIPT CARD */}
              <div className={`p-6 rounded-2xl border transition-all duration-300 relative ${
                darkMode 
                  ? 'bg-[#1A1916] border-neutral-800/80 shadow-lg' 
                  : 'bg-white border-neutral-200/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)]'
              }`}>
                <div className="absolute top-0 left-0 right-0 h-1 rounded-t-2xl bg-gradient-to-r from-amber-500 to-orange-500" />
                
                <div className={`text-center pb-4 border-b border-dashed pt-2 ${
                  darkMode ? 'border-neutral-800' : 'border-neutral-200'
                }`}>
                  <span className="text-3xl">🍯</span>
                  <h4 className={`font-bold text-lg uppercase mt-2 ${
                    darkMode ? 'text-white' : 'text-neutral-900'
                  }`}>Goret's Invoice</h4>
                  <p className="text-[10px] font-mono tracking-widest text-neutral-500">OFFICIAL INVOICE RECEIPT</p>
                </div>

                <div className={`py-4 space-y-3 text-xs font-medium ${
                  darkMode ? 'text-neutral-350' : 'text-neutral-600'
                }`}>
                  <div className="flex justify-between">
                    <span>Order Reference</span>
                    <span className={`font-mono font-bold ${darkMode ? 'text-white' : 'text-neutral-850'}`}>{activeOrder.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Payment Method</span>
                    <span className={`font-bold uppercase ${darkMode ? 'text-white' : 'text-neutral-850'}`}>{activeOrder.paymentMethod}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Deliver To</span>
                    <span className={`font-bold ${darkMode ? 'text-white' : 'text-neutral-850'}`}>{activeOrder.customerName}</span>
                  </div>
                  <div className="flex flex-col space-y-1 pt-1">
                    <span className="text-[10px] text-neutral-500 font-bold uppercase">Delivery Address</span>
                    <span className={`leading-snug ${darkMode ? 'text-neutral-205' : 'text-neutral-800'}`}>{activeOrder.customerAddress}</span>
                  </div>
                </div>

                <div className={`border-t border-dashed py-4 ${
                  darkMode ? 'border-neutral-800' : 'border-neutral-200'
                }`}>
                  <h5 className="font-bold text-xs uppercase text-neutral-500 tracking-wider mb-2">Items Ordered</h5>
                  
                  <div className="space-y-2">
                    {activeOrder.items.map((itemObj) => {
                      const item = MENU_ITEMS.find(m => m.id === itemObj.id);
                      if (!item) return null;
                      return (
                        <div key={itemObj.id} className="flex justify-between items-center text-xs">
                          <div>
                            <span className={`font-semibold ${darkMode ? 'text-neutral-200' : 'text-neutral-800'}`}>{item.name}</span>
                            <span className="text-neutral-500 font-medium ml-1.5">x{itemObj.qty}</span>
                          </div>
                          <span className={`font-bold ${darkMode ? 'text-white' : 'text-neutral-850'}`}>₹{(item.price * itemObj.qty).toFixed(2)}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className={`border-t border-dashed pt-4 space-y-2 text-xs font-medium ${
                  darkMode ? 'border-neutral-800 text-neutral-350' : 'border-neutral-200 text-neutral-600'
                }`}>
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className={`font-bold ${darkMode ? 'text-white' : 'text-neutral-850'}`}>₹{activeOrder.subtotal.toFixed(2)}</span>
                  </div>
                  {activeOrder.discount > 0 && (
                    <div className="flex justify-between text-emerald-500 font-semibold">
                      <span>Discount ({activeOrder.promoCode})</span>
                      <span>-₹{activeOrder.discount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Express Delivery</span>
                    <span className={`font-bold ${darkMode ? 'text-white' : 'text-neutral-850'}`}>₹{activeOrder.deliveryFee.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>GST (5%)</span>
                    <span className={`font-bold ${darkMode ? 'text-white' : 'text-neutral-850'}`}>₹{activeOrder.tax.toFixed(2)}</span>
                  </div>
                  <div className={`border-t pt-3 flex justify-between items-center text-sm font-bold uppercase ${
                    darkMode ? 'border-neutral-800 text-white' : 'border-neutral-200 text-neutral-850'
                  }`}>
                    <span>Total Paid</span>
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-lg border ${
                      darkMode 
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/30' 
                        : 'bg-amber-100 text-amber-800 border-amber-200'
                    }`}>
                      ₹{activeOrder.total.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Receipt Barcode mockup */}
                <div className="mt-6 flex flex-col items-center justify-center opacity-40">
                  <div className={`h-8 w-44 border-x ${
                    darkMode 
                      ? 'bg-[repeating-linear-gradient(90deg,#E5E5E5,#E5E5E5_2px,transparent_2px,transparent_6px,#E5E5E5_6px,#E5E5E5_10px,transparent_10px,transparent_12px)] border-neutral-700' 
                      : 'bg-[repeating-linear-gradient(90deg,black,black_2px,transparent_2px,transparent_6px,black_6px,black_10px,transparent_10px,transparent_12px)] border-black'
                  }`} />
                  <span className={`text-[8px] font-mono tracking-widest mt-1 ${darkMode ? 'text-neutral-400' : 'text-neutral-500'}`}>*{activeOrder.id}*</span>
                </div>
              </div>

              {/* ORDER ACTIONS */}
              <div className="space-y-3">
                {/* Cancel Order (Only if not delivered/delivering) */}
                {(orderStatus === 'placed' || orderStatus === 'preparing') && (
                  <button
                    onClick={() => {
                      if (confirm("Are you sure you want to cancel your order?")) {
                        handleResetOrder();
                      }
                    }}
                    className="w-full bg-red-550 hover:bg-red-600 text-white font-semibold uppercase text-xs py-3.5 rounded-xl text-center transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 shadow-md shadow-red-550/10"
                  >
                    🚫 Cancel & Void Order
                  </button>
                )}

                {/* Reset order (Only if delivered) */}
                {orderStatus === 'delivered' && (
                  <button
                    onClick={handleResetOrder}
                    className={`w-full font-semibold uppercase text-xs py-3.5 rounded-xl text-center transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 shadow-md ${
                      darkMode 
                        ? 'bg-amber-500 hover:bg-amber-600 text-black shadow-[0_4px_12px_rgba(245,158,11,0.25)]' 
                        : 'bg-neutral-900 hover:bg-neutral-850 text-white shadow-sm'
                    }`}
                  >
                    Order Something Else 🍽️
                  </button>
                )}
                
                {/* Active Support Card */}
                <div className={`border p-4 rounded-xl text-center space-y-1 transition-colors ${
                  darkMode ? 'bg-[#1A1916] border-neutral-800/80 shadow-lg' : 'bg-neutral-50 border-neutral-200/80 shadow-sm'
                }`}>
                  <h5 className={`font-bold text-xs uppercase ${darkMode ? 'text-white' : 'text-neutral-850'}`}>Support Hotline</h5>
                  <p className="text-[10px] font-semibold text-neutral-500">Need help? Dial 1800-GORETS-HELP</p>
                </div>
              </div>

            </div>
          </div>
        </div>
      ) : (
        <>
          {/* HERO SECTION */}
          <div className={`relative overflow-hidden py-16 px-4 sm:px-8 border-b transition-colors duration-300 ${
            darkMode 
              ? 'bg-gradient-to-br from-[#161410] to-[#1F1C18] border-neutral-800/60' 
              : 'bg-gradient-to-br from-amber-50/60 to-orange-50/30 border-neutral-200/80'
          }`}>
            {/* Honeycomb Pattern Graphic Background Overlay */}
            <div className={`absolute inset-0 opacity-[0.04] pointer-events-none ${darkMode ? 'text-amber-400' : 'text-amber-800'}`}>
              <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id="honeycomb" width="40" height="70" patternUnits="userSpaceOnUse" patternTransform="scale(1)">
                    <path d="M 40,0 L 20,10 L 0,0 L 0,20 L 20,30 L 40,20 Z M 0,35 L 20,45 L 40,35 L 40,55 L 20,65 L 0,55 Z" fill="none" stroke="currentColor" strokeWidth="1.5"/>
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#honeycomb)" />
              </svg>
            </div>

            <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between relative z-10 space-y-8 md:space-y-0 gap-8">
              <div className="text-center md:text-left md:max-w-xl space-y-4">
                <div className={`inline-flex items-center space-x-2 text-[10px] font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-full border transition-colors ${
                  darkMode 
                    ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' 
                    : 'bg-amber-100/70 text-amber-850 border-amber-200/60'
                }`}>
                  <span className="relative flex h-1.5 w-1.5 mr-1">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-amber-500"></span>
                  </span>
                  <span>⚡ Express Courier Delivery 🛵</span>
                </div>
                <h2 className={`text-4xl sm:text-5xl font-extrabold tracking-tight uppercase leading-[1.15] transition-colors ${
                  darkMode ? 'text-white' : 'text-neutral-900'
                }`}>
                  Freshly Baked, <br/>
                  <span className="text-amber-500">Premium Taste.</span>
                </h2>
                <p className={`text-sm sm:text-base font-medium leading-relaxed transition-colors ${
                  darkMode ? 'text-neutral-400' : 'text-neutral-600'
                } max-w-lg`}>
                  Indulge in Goret's signature crispy fries, fresh artisanal pizzas, premium loaded double burgers, and craft iced teas. Order right now for an exceptional dining experience!
                </p>
                <div className="flex flex-wrap gap-2.5 justify-center md:justify-start pt-2">
                  <span className={`px-3.5 py-2 rounded-xl font-bold text-xs border shadow-sm transition-colors ${
                    darkMode 
                      ? 'bg-[#1A1916] border-neutral-800/80 text-neutral-300' 
                      : 'bg-white border-neutral-200/80 text-neutral-700'
                  }`}>
                    🚀 Delivery under 20 mins
                  </span>
                  <span className="bg-amber-500 text-black px-3.5 py-2 rounded-xl font-bold text-xs shadow-sm hover:bg-amber-600 transition-colors">
                    🎟 Code: GORET15 (15% OFF)
                  </span>
                </div>
              </div>

              {/* Large Hero Bee Graphic / Delivery Illustration */}
              <div className="relative group">
                <div className="absolute -inset-2 bg-amber-500 rounded-[2rem] blur opacity-15 group-hover:opacity-20 transition duration-1000"></div>
                <div className={`relative border p-6 rounded-3xl max-w-sm flex flex-col items-center text-center transition-all duration-300 ${
                  darkMode 
                    ? 'bg-[#1A1916] border-neutral-800/80 shadow-[0_20px_50px_rgba(0,0,0,0.3)]' 
                    : 'bg-white border-neutral-200/80 shadow-[0_20px_50px_rgba(0,0,0,0.04)]'
                }`}>
                  {/* Bee Animation */}
                  <div className="relative w-28 h-28 mb-4 animate-bounce duration-[2000ms]">
                    <svg viewBox="0 0 100 100" className="w-full h-full">
                      {/* Wings */}
                      <ellipse cx="35" cy="30" rx="14" ry="24" fill="#bae6fd" opacity="0.85" stroke="#0284c7" strokeWidth="2" transform="rotate(-30 35 30)" className="animate-pulse" />
                      <ellipse cx="65" cy="30" rx="14" ry="24" fill="#bae6fd" opacity="0.85" stroke="#0284c7" strokeWidth="2" transform="rotate(30 65 30)" className="animate-pulse" />
                      {/* Antennae */}
                      <line x1="45" y1="20" x2="38" y2="8" stroke="black" strokeWidth="2.5" />
                      <circle cx="38" cy="8" r="3" fill="black" />
                      <line x1="55" y1="20" x2="62" y2="8" stroke="black" strokeWidth="2.5" />
                      <circle cx="62" cy="8" r="3" fill="black" />
                      {/* Body (Banded bee yellow/black) */}
                      <ellipse cx="50" cy="55" rx="24" ry="30" fill="#fbbf24" stroke="black" strokeWidth="3" />
                      {/* Stripes */}
                      <path d="M 32 46 Q 50 49 68 46" stroke="black" strokeWidth="4.5" fill="none" />
                      <path d="M 28 55 Q 50 58 72 55" stroke="black" strokeWidth="4.5" fill="none" />
                      <path d="M 30 64 Q 50 67 70 64" stroke="black" strokeWidth="4.5" fill="none" />
                      {/* Eyes */}
                      <circle cx="43" cy="44" r="3.5" fill="black" />
                      <circle cx="57" cy="44" r="3.5" fill="black" />
                      {/* Smile */}
                      <path d="M 46 51 Q 50 54 54 51" stroke="black" strokeWidth="2.5" fill="none" />
                    </svg>
                    {/* Honey Pot overlay */}
                    <div className="absolute bottom-0 right-1 bg-amber-500 text-black text-[9px] font-extrabold px-2 py-0.5 rounded-lg shadow-sm">
                      FRESH🍔
                    </div>
                  </div>
                  <h4 className={`font-extrabold text-base tracking-wider uppercase ${darkMode ? 'text-white' : 'text-neutral-800'}`}>GORET'S SIGNATURE BOX</h4>
                  <p className={`text-xs font-semibold mt-1.5 transition-colors ${darkMode ? 'text-neutral-400' : 'text-neutral-500'} leading-relaxed`}>
                    Get custom rewards, a complimentary side dish, and free delivery on your first 5 orders!
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* LIVE ORDER STATUS TRACKING BAR (If order is active) */}
          {orderStatus !== 'idle' && (
            <div className={`py-6 px-4 border-b transition-colors duration-300 ${
              darkMode 
                ? 'bg-[#12110E] border-neutral-800/60' 
                : 'bg-neutral-50 border-neutral-200/60'
            }`}>
              <div className="max-w-4xl mx-auto space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-center space-y-3 sm:space-y-0">
                  <div>
                    <span className="text-[10px] font-bold uppercase text-amber-500 tracking-wider">🎯 Real-time Order Tracker</span>
                    <h3 className={`text-lg sm:text-xl font-bold transition-colors ${darkMode ? 'text-white' : 'text-neutral-800'}`}>
                      Your Order is {orderStatus === 'placed' && 'Placed! 📝'}
                      {orderStatus === 'preparing' && 'being Prepared in the Kitchen! 🍳'}
                      {orderStatus === 'delivering' && 'out for delivery! 🛵'}
                      {orderStatus === 'delivered' && 'Arrived! Enjoy your meal! 🎉'}
                    </h3>
                  </div>
                  <button 
                    onClick={handleResetOrder} 
                    className={`font-semibold text-xs py-2 px-4 rounded-xl border transition-all hover:scale-105 active:scale-95 ${
                      darkMode 
                        ? 'bg-neutral-800 hover:bg-neutral-700 text-amber-400 border-neutral-750' 
                        : 'bg-white hover:bg-neutral-100 text-neutral-800 border-neutral-200 shadow-sm'
                    }`}
                  >
                    {orderStatus === 'delivered' ? 'Order Something Else' : 'Cancel & Reset Order'}
                  </button>
                </div>

                {/* Tracker Stepper Map Grid */}
                <div className="grid grid-cols-4 gap-2 relative">
                  {/* Progress Line */}
                  <div className={`absolute top-5 left-[12%] right-[12%] h-1 z-0 rounded-full ${darkMode ? 'bg-neutral-800' : 'bg-neutral-200'}`}>
                    <div 
                      className="h-full bg-amber-500 transition-all duration-1000 rounded-full"
                      style={{
                        width: 
                          orderStatus === 'placed' ? '0%' :
                          orderStatus === 'preparing' ? '33%' :
                          orderStatus === 'delivering' ? '66%' : '100%'
                      }}
                    />
                  </div>

                  {/* Step 1: Placed */}
                  <div className="flex flex-col items-center text-center z-10">
                    <div className={`w-10 h-10 rounded-full border flex items-center justify-center font-bold text-sm transition-all duration-300 ${
                      orderStatus === 'placed' || orderStatus === 'preparing' || orderStatus === 'delivering' || orderStatus === 'delivered'
                        ? 'bg-amber-500 text-black border-amber-600 scale-105 shadow-[0_4px_12px_rgba(245,158,11,0.25)]' 
                        : darkMode ? 'bg-[#1E1D19] border-neutral-800 text-neutral-500' : 'bg-white border-neutral-200 text-neutral-400 shadow-sm'
                    }`}>
                      📝
                    </div>
                    <span className={`text-[10px] font-bold mt-2 ${darkMode ? 'text-neutral-400' : 'text-neutral-600'}`}>Order Placed</span>
                  </div>

                  {/* Step 2: Kitchen */}
                  <div className="flex flex-col items-center text-center z-10">
                    <div className={`w-10 h-10 rounded-full border flex items-center justify-center font-bold text-sm transition-all duration-300 ${
                      orderStatus === 'preparing' || orderStatus === 'delivering' || orderStatus === 'delivered'
                        ? 'bg-amber-500 text-black border-amber-600 scale-105 shadow-[0_4px_12px_rgba(245,158,11,0.25)]' 
                        : darkMode ? 'bg-[#1E1D19] border-neutral-800 text-neutral-500' : 'bg-white border-neutral-200 text-neutral-400 shadow-sm'
                    }`}>
                      🍳
                    </div>
                    <span className={`text-[10px] font-bold mt-2 ${darkMode ? 'text-neutral-400' : 'text-neutral-600'}`}>Preparing</span>
                  </div>

                  {/* Step 3: Courier Partner */}
                  <div className="flex flex-col items-center text-center z-10 relative">
                    <div className={`w-10 h-10 rounded-full border flex items-center justify-center font-bold text-sm transition-all duration-300 ${
                      orderStatus === 'delivering' || orderStatus === 'delivered'
                        ? 'bg-amber-500 text-black border-amber-600 scale-105 shadow-[0_4px_12px_rgba(245,158,11,0.25)]' 
                        : darkMode ? 'bg-[#1E1D19] border-neutral-800 text-neutral-500' : 'bg-white border-neutral-200 text-neutral-400 shadow-sm'
                    }`}>
                      🛵
                    </div>
                    {/* Little Animation on "delivering" status */}
                    {orderStatus === 'delivering' && (
                      <span className="absolute -top-3.5 text-xs animate-bounce text-amber-500">⚡</span>
                    )}
                    <span className={`text-[10px] font-bold mt-2 ${darkMode ? 'text-neutral-400' : 'text-neutral-600'}`}>In Transit</span>
                  </div>

                  {/* Step 4: Arrived */}
                  <div className="flex flex-col items-center text-center z-10">
                    <div className={`w-10 h-10 rounded-full border flex items-center justify-center font-bold text-sm transition-all duration-300 ${
                      orderStatus === 'delivered'
                        ? 'bg-emerald-500 text-white border-emerald-600 scale-105 shadow-[0_4px_12px_rgba(16,185,129,0.25)]' 
                        : darkMode ? 'bg-[#1E1D19] border-neutral-800 text-neutral-500' : 'bg-white border-neutral-200 text-neutral-400 shadow-sm'
                    }`}>
                      🍔
                    </div>
                    <span className={`text-[10px] font-bold mt-2 ${darkMode ? 'text-neutral-400' : 'text-neutral-600'}`}>At Your Door</span>
                  </div>
                </div>

                {/* Simulated interactive delivery map card */}
                {orderStatus === 'delivering' && (
                  <div className={`mt-6 border p-4 rounded-2xl flex flex-col md:flex-row items-center justify-between transition-colors ${
                    darkMode 
                      ? 'bg-[#1A1916] border-neutral-800 text-white shadow-md' 
                      : 'bg-white border-neutral-200 text-neutral-800 shadow-sm'
                  }`}>
                    <div className="flex items-center space-x-3 mb-3 md:mb-0">
                      <div className="w-10 h-10 rounded-full bg-amber-500 flex items-center justify-center text-xl shadow-sm">
                        🛵
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-amber-500">Delivery Partner: Buster</h4>
                        <p className={`text-xs ${darkMode ? 'text-neutral-400' : 'text-neutral-500'}`}>In transit to your location (1.2 km away)</p>
                      </div>
                    </div>
                    <div className={`w-full md:w-64 border h-10 rounded-xl relative overflow-hidden flex items-center px-4 transition-colors ${
                      darkMode ? 'bg-[#12110E] border-neutral-800' : 'bg-neutral-50 border-neutral-200 shadow-inner'
                    }`}>
                      <div className="text-[9px] text-amber-500 font-mono tracking-wider uppercase animate-pulse">
                        🛰️ GPS SIGNAL ACTIVE
                      </div>
                      {/* Moving indicator representing GPS */}
                      <div className="absolute right-4 animate-ping bg-emerald-500 rounded-full h-2 w-2"></div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* CATEGORY SELECTOR SLIDER */}
          <div className={`px-4 py-4 sm:px-8 overflow-x-auto whitespace-nowrap flex items-center space-x-2 scrollbar-none sticky top-[69px] sm:top-[77px] z-30 transition-colors border-b duration-300 ${
            darkMode 
              ? 'bg-[#0F0E0C]/85 border-neutral-800/60 backdrop-blur-md shadow-[0_4px_20px_rgba(0,0,0,0.2)]' 
              : 'bg-[#FCFBF7]/85 border-neutral-200/80 backdrop-blur-md shadow-[0_4px_20px_rgba(0,0,0,0.01)]'
          }`}>
            <span className={`font-bold text-xs uppercase tracking-widest mr-2 hidden md:inline-block ${
              darkMode ? 'text-neutral-400' : 'text-neutral-500'
            }`}>
              Categories:
            </span>
            {categories.map((cat) => {
              const isActive = activeCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => {
                    setActiveCategory(cat);
                    playBuzzSound('add');
                  }}
                  className={`px-5 py-2 rounded-xl font-bold text-xs uppercase transition-all duration-200 border ${
                    isActive
                      ? darkMode
                        ? 'bg-amber-500 text-black border-amber-600 shadow-[0_4px_12px_rgba(245,158,11,0.25)]'
                        : 'bg-amber-500 text-white border-amber-600 shadow-[0_4px_12px_rgba(245,158,11,0.15)]'
                      : darkMode
                        ? 'bg-[#1A1916] text-neutral-400 border-neutral-800 hover:bg-[#24231E] hover:text-white'
                        : 'bg-white text-neutral-600 border-neutral-200 shadow-sm hover:bg-neutral-50 hover:text-neutral-850'
                  }`}
                >
                  {cat === 'All' && '📋 Full Menu'}
                  {cat === 'Fries' && '🍟 Crispy Fries'}
                  {cat === 'Pizza' && '🍕 Premium Pizza'}
                  {cat === 'Burgers' && '🍔 Big Burgers'}
                  {cat === 'Desserts' && '🧇 Sweet Desserts'}
                  {cat === 'Drinks' && '🥤 Beverages'}
                </button>
              );
            })}
          </div>

          {/* MAIN CONTAINER */}
          <main className="max-w-7xl mx-auto px-4 py-8 sm:px-8">
            {/* Active Category Header Title with items count */}
            <div className="flex justify-between items-center mb-8">
              <div>
                <h3 className={`text-xl sm:text-2xl font-extrabold uppercase tracking-tight flex items-center space-x-2 transition-colors ${
                  darkMode ? 'text-white' : 'text-neutral-900'
                }`}>
                  <span className={`p-1.5 rounded-lg text-sm ${darkMode ? 'bg-amber-500/10 border border-amber-500/20 text-amber-400' : 'bg-amber-100 border border-amber-200 text-amber-700'}`}>🍽️</span>
                  <span>{activeCategory} Menu Selection</span>
                </h3>
                <p className={`text-xs font-semibold mt-1 transition-colors ${
                  darkMode ? 'text-neutral-400' : 'text-neutral-500'
                }`}>
                  Showing {filteredMenuItems.length} freshly curated premium dishes
                </p>
              </div>

              {searchTerm && (
                <div className={`border rounded-lg px-3 py-1 text-[10px] font-bold ${
                  darkMode ? 'bg-[#1E1C19] border-neutral-800 text-amber-450' : 'bg-amber-50 border-amber-200 text-amber-800'
                }`}>
                  Filtered by: "{searchTerm}"
                </div>
              )}
            </div>

            {/* Empty Search / Category Results state */}
            {filteredMenuItems.length === 0 && (
              <div className={`border p-12 text-center rounded-3xl max-w-lg mx-auto my-12 transition-all ${
                darkMode ? 'bg-[#1A1916] border-neutral-800/80 shadow-md' : 'bg-white border-neutral-200/80 shadow-sm'
              }`}>
                <span className="text-4xl">🍽️</span>
                <h4 className={`text-lg font-bold uppercase mt-4 ${darkMode ? 'text-white' : 'text-neutral-800'}`}>No Dishes Found</h4>
                <p className={`text-xs font-semibold mt-2 leading-relaxed ${darkMode ? 'text-neutral-400' : 'text-neutral-500'}`}>
                  We couldn't find anything matching your search. Try looking for fries, pizza, burgers, or refreshing drinks.
                </p>
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setActiveCategory('All');
                    playBuzzSound('add');
                  }}
                  className="mt-6 bg-amber-500 hover:bg-amber-600 text-white font-semibold text-xs py-2.5 px-5 rounded-xl transition-all shadow-md"
                >
                  Show All Dishes
                </button>
              </div>
            )}

            {/* MENU CATEGORIES & ITEMS RENDERING */}
            {categories.slice(1).map((catHeader) => {
              if (activeCategory !== 'All' && activeCategory !== catHeader) return null;

              const categoryItems = filteredMenuItems.filter(item => item.category === catHeader);
              if (categoryItems.length === 0) return null;

              return (
                <div key={catHeader} className="mb-12">
                  {/* CATEGORY ROW HEADING */}
                  <div className={`flex items-center space-x-3 mb-6 pb-2 border-b transition-colors ${
                    darkMode ? 'border-neutral-800/60' : 'border-neutral-200/80'
                  }`}>
                    <h4 className={`text-lg sm:text-xl font-bold uppercase tracking-tight flex items-center space-x-2 transition-colors ${
                      darkMode ? 'text-white' : 'text-neutral-900'
                    }`}>
                      <span>{catHeader === 'Fries' ? '🍟' : catHeader === 'Pizza' ? '🍕' : catHeader === 'Burgers' ? '🍔' : catHeader === 'Desserts' ? '🧇' : '🥤'}</span>
                      <span>{catHeader}</span>
                    </h4>
                    <div className={`h-[1px] flex-1 ${darkMode ? 'bg-neutral-800/60' : 'bg-neutral-200/80'}`}></div>
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${
                      darkMode ? 'bg-neutral-800/50 border-neutral-750 text-neutral-300' : 'bg-neutral-100 border-neutral-200 text-neutral-600 shadow-sm'
                    }`}>
                      {categoryItems.length} items
                    </span>
                  </div>

                  {/* FOOD ITEMS GRID */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                    {categoryItems.map((item) => {
                      const quantityInCart = cart[item.id] || 0;
                      return (
                        <div 
                          key={item.id} 
                          className={`group border rounded-2xl overflow-hidden hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between ${
                            darkMode 
                              ? 'bg-[#1A1916] border-neutral-800/80 hover:shadow-[0_12px_30px_rgba(0,0,0,0.35)] shadow-sm' 
                              : 'bg-white border-neutral-200/80 hover:shadow-[0_12px_30px_rgba(0,0,0,0.05)] shadow-sm'
                          }`}
                        >
                          {/* Food Image Container */}
                          <div className={`relative h-48 sm:h-52 w-full overflow-hidden border-b transition-colors ${
                            darkMode ? 'border-neutral-850' : 'border-neutral-200/80'
                          }`}>
                            {/* Rating Star Badge */}
                            <div className={`absolute top-3 left-3 border text-xs px-2.5 py-1 rounded-xl flex items-center space-x-1 z-10 shadow-sm transition-all ${
                              darkMode 
                                ? 'bg-[#1A1916]/90 border-neutral-800 backdrop-blur-md text-white' 
                                : 'bg-white/95 border-neutral-200/80 backdrop-blur-md text-neutral-800'
                            }`}>
                              <span className="text-amber-500">⭐</span>
                              <span className="font-bold">{item.rating}</span>
                              <span className={`font-semibold ${darkMode ? 'text-neutral-450' : 'text-neutral-500'}`}>({item.reviews})</span>
                            </div>

                            {/* Top-Right Tags */}
                            <div className="absolute top-3 right-3 flex flex-col gap-1 items-end z-10">
                              {item.tags.map((tag, idx) => (
                                <span 
                                  key={idx} 
                                  className={`text-[9px] font-bold uppercase px-2.5 py-1 rounded-lg shadow-sm ${
                                    darkMode 
                                      ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' 
                                      : 'bg-amber-500 text-white'
                                  }`}
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>

                            {/* Image */}
                            <img 
                              src={item.image} 
                              alt={item.name} 
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[600ms]"
                              loading="lazy"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.onerror = null;
                                target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80';
                              }}
                            />
                          </div>

                          {/* Content Card Body */}
                          <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                            <div>
                              <div className="flex justify-between items-start gap-2">
                                <h5 className={`font-bold text-base sm:text-lg tracking-tight transition-colors ${
                                  darkMode ? 'text-white group-hover:text-amber-450' : 'text-neutral-800 group-hover:text-amber-600'
                                }`}>
                                  {item.name}
                                </h5>
                                <span className={`text-sm font-bold whitespace-nowrap px-2.5 py-0.5 border rounded-lg shadow-sm transition-colors ${
                                  darkMode 
                                    ? 'bg-amber-500/10 border-amber-500/20 text-amber-400' 
                                    : 'bg-amber-50 border-amber-200/60 text-amber-600'
                                }`}>
                                  ₹{item.price}
                                </span>
                              </div>
                              <p className={`text-xs font-semibold mt-2 line-clamp-2 transition-colors ${
                                darkMode ? 'text-neutral-400' : 'text-neutral-650'
                              }`}>
                                {item.description}
                              </p>
                            </div>

                            {/* ADD TO CART SECTION */}
                            <div className="pt-2 flex items-center justify-between">
                              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-500">
                                🍽️ Goret's Signature
                              </span>

                              {quantityInCart === 0 ? (
                                <button
                                  onClick={() => addToCart(item.id)}
                                  className={`font-semibold text-xs py-2 px-4 rounded-xl border-0 transition-all hover:scale-105 active:scale-95 flex items-center space-x-1.5 shadow-sm ${
                                    darkMode 
                                      ? 'bg-amber-500 hover:bg-amber-600 text-black shadow-[0_4px_12px_rgba(245,158,11,0.25)]' 
                                      : 'bg-amber-500 hover:bg-amber-600 text-white shadow-[0_4px_12px_rgba(245,158,11,0.15)]'
                                  }`}
                                >
                                  <span>Add to Basket</span>
                                  <span>➕</span>
                                </button>
                              ) : (
                                <div className={`flex items-center space-x-1 border p-1 rounded-xl shadow-sm transition-colors ${
                                  darkMode ? 'bg-[#12110E] border-neutral-800' : 'bg-neutral-100 border-neutral-200'
                                }`}>
                                  <button
                                    onClick={() => removeFromCart(item.id)}
                                    className={`w-7 h-7 rounded-lg font-bold flex items-center justify-center transform active:scale-95 transition-all text-xs ${
                                      darkMode ? 'bg-[#1A1916] hover:bg-neutral-800 text-white' : 'bg-white hover:bg-neutral-50 text-black border border-neutral-200'
                                    }`}
                                    title="Decrease item"
                                  >
                                    ➖
                                  </button>
                                  <span className={`px-2.5 font-bold text-xs text-center min-w-[20px] ${darkMode ? 'text-white' : 'text-neutral-800'}`}>
                                    {quantityInCart}
                                  </span>
                                  <button
                                    onClick={() => addToCart(item.id)}
                                    className={`w-7 h-7 rounded-lg font-bold flex items-center justify-center transform active:scale-95 transition-all text-xs ${
                                      darkMode ? 'bg-[#1A1916] hover:bg-neutral-800 text-white' : 'bg-white hover:bg-neutral-50 text-black border border-neutral-200'
                                    }`}
                                    title="Increase item"
                                  >
                                    ➕
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </main>

          {/* DETAILED FEATURES / PROMOTION CARDS ROW */}
          <section className={`border-y py-16 px-4 sm:px-8 mt-12 transition-colors duration-300 ${
            darkMode 
              ? 'bg-[#161410] border-neutral-800/60 shadow-[inset_0_4px_20px_rgba(0,0,0,0.25)]' 
              : 'bg-amber-50/40 border-neutral-200/80 shadow-[inset_0_4px_20px_rgba(0,0,0,0.01)]'
          }`}>
            <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className={`border p-6 rounded-2xl text-center shadow-sm transition-all ${
                darkMode ? 'bg-[#1A1916] border-neutral-800/85' : 'bg-white border-neutral-200/80'
              }`}>
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl mx-auto mb-4 border ${
                  darkMode ? 'bg-amber-500/10 border-amber-500/20 text-amber-400' : 'bg-amber-100 border-amber-200 text-amber-700'
                }`}>
                  🍽️
                </div>
                <h5 className={`font-bold text-base uppercase ${darkMode ? 'text-white' : 'text-neutral-800'}`}>100% Premium Ingredients</h5>
                <p className={`text-xs font-semibold mt-2 leading-relaxed ${darkMode ? 'text-neutral-400' : 'text-neutral-500'}`}>
                  Every dessert, pizza sauce, and fry seasoning is sourced from select high-quality partners for an authentic premium flavor.
                </p>
              </div>

              <div className={`border p-6 rounded-2xl text-center shadow-sm transition-all ${
                darkMode ? 'bg-[#1A1916] border-neutral-800/85' : 'bg-white border-neutral-200/80'
              }`}>
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl mx-auto mb-4 border ${
                  darkMode ? 'bg-amber-500/10 border-amber-500/20 text-amber-400' : 'bg-amber-100 border-amber-200 text-amber-700'
                }`}>
                  ⚡
                </div>
                <h5 className={`font-bold text-base uppercase ${darkMode ? 'text-white' : 'text-neutral-800'}`}>Express Courier Delivery</h5>
                <p className={`text-xs font-semibold mt-2 leading-relaxed ${darkMode ? 'text-neutral-400' : 'text-neutral-500'}`}>
                  Packed in specialized insulated thermal bags that preserve optimal temperature and crispness during courier delivery cycles.
                </p>
              </div>

              <div className={`border p-6 rounded-2xl text-center shadow-sm transition-all ${
                darkMode ? 'bg-[#1A1916] border-neutral-800/85' : 'bg-white border-neutral-200/80'
              }`}>
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl mx-auto mb-4 border ${
                  darkMode ? 'bg-amber-500/10 border-amber-500/20 text-amber-400' : 'bg-amber-100 border-amber-200 text-amber-700'
                }`}>
                  🛡️
                </div>
                <h5 className={`font-bold text-base uppercase ${darkMode ? 'text-white' : 'text-neutral-800'}`}>Quality Guarantee</h5>
                <p className={`text-xs font-semibold mt-2 leading-relaxed ${darkMode ? 'text-neutral-400' : 'text-neutral-500'}`}>
                  Not fully satisfied? Submit a support ticket to our care desk and we will refund or replace your food immediately, no questions asked.
                </p>
              </div>
            </div>
          </section>
        </>
      )}

      {/* CART DRAWER / SIDEBAR */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <div 
            onClick={() => setIsCartOpen(false)}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
          />

          <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
            <div className={`w-screen max-w-md flex flex-col justify-between transition-all duration-300 border-l ${
              darkMode 
                ? 'bg-[#1A1916] border-neutral-800/80 shadow-[-10px_0_40px_rgba(0,0,0,0.4)]' 
                : 'bg-white border-neutral-200/85 shadow-[-10px_0_40px_rgba(0,0,0,0.04)]'
            }`}>
              
              {/* Drawer Header */}
              <div className={`p-6 flex justify-between items-center border-b transition-colors ${
                darkMode ? 'bg-[#1A1916] border-neutral-800/80 shadow-md' : 'bg-white border-neutral-200/80 shadow-sm'
              }`}>
                <div className="flex items-center space-x-2">
                  <span className="text-2xl">🛍️</span>
                  <h3 className={`text-lg font-bold uppercase ${darkMode ? 'text-white' : 'text-neutral-850'}`}>Your Order Basket</h3>
                  <span className={`font-bold text-[10px] px-2.5 py-1 rounded-full border transition-all ${
                    darkMode 
                      ? 'bg-amber-500/10 border-amber-500/20 text-amber-400' 
                      : 'bg-amber-100 border-amber-200 text-amber-800'
                  }`}>
                    {totalCartItemsCount} Items
                  </span>
                </div>
                <button 
                  onClick={() => setIsCartOpen(false)}
                  className={`font-semibold text-xs px-3.5 py-2 rounded-xl border transition-colors ${
                    darkMode 
                      ? 'bg-neutral-850 hover:bg-neutral-800 text-neutral-250 border-neutral-750' 
                      : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-700 border-neutral-200 shadow-sm'
                  }`}
                >
                  ✖ Close
                </button>
              </div>

              {/* Drawer Scroll Body */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                
                {/* Empty Cart State */}
                {totalCartItemsCount === 0 ? (
                  <div className="text-center py-16 space-y-4">
                    <span className="text-6xl animate-bounce inline-block">🛍️</span>
                    <h4 className={`font-bold text-base uppercase ${darkMode ? 'text-white' : 'text-neutral-800'}`}>Your basket is empty!</h4>
                    <p className={`text-xs font-semibold max-w-xs mx-auto leading-relaxed ${darkMode ? 'text-neutral-400' : 'text-neutral-500'}`}>
                      Fill up your cart with our premium signature pizzas, golden crinkle-cut fries, and warm waffles!
                    </p>
                    <button
                      onClick={() => setIsCartOpen(false)}
                      className={`font-semibold text-xs py-2.5 px-6 rounded-xl border transition-all ${
                        darkMode 
                          ? 'bg-amber-500 hover:bg-amber-600 text-black border-amber-600 shadow-md' 
                          : 'bg-amber-500 hover:bg-amber-600 text-white border-amber-600 shadow-md'
                      }`}
                    >
                      Start Ordering Now
                    </button>
                  </div>
                ) : checkoutStep === 'payment' ? (
                  <div className="space-y-4">
                    {/* Back Button */}
                    <button 
                      onClick={() => setCheckoutStep('cart')}
                      className={`flex items-center space-x-1.5 text-xs font-bold uppercase focus:outline-none transition-colors ${
                        darkMode ? 'text-amber-400 hover:text-amber-300' : 'text-amber-800 hover:text-neutral-800'
                      }`}
                    >
                      <span>←</span> <span>Back to Basket</span>
                    </button>

                    <div className={`border p-4 rounded-2xl text-center space-y-1 shadow-sm transition-colors ${
                      darkMode ? 'bg-amber-500/5 border-amber-500/10' : 'bg-amber-50/50 border-amber-200/80'
                    }`}>
                      <span className={`text-[10px] font-bold uppercase ${darkMode ? 'text-neutral-400' : 'text-neutral-600'}`}>Amount to Pay</span>
                      <h4 className={`text-2xl font-extrabold ${darkMode ? 'text-amber-400' : 'text-amber-605'}`}>₹{grandTotal.toFixed(2)}</h4>
                    </div>

                    <div className="space-y-3">
                      <h4 className={`font-bold text-xs uppercase tracking-wider ${darkMode ? 'text-neutral-400' : 'text-neutral-500'}`}>Choose Payment Method</h4>
                      
                      {/* UPI Option */}
                      <div 
                        onClick={() => setPaymentMethod('upi')}
                        className={`p-4 rounded-2xl border transition-all ${
                          paymentMethod === 'upi' 
                            ? darkMode
                              ? 'bg-amber-500/5 border-amber-500/40 shadow-md -translate-y-0.5' 
                              : 'bg-amber-50/20 border-amber-550 shadow-sm -translate-y-0.5'
                            : darkMode
                              ? 'bg-[#1E1D19] border-neutral-800 hover:bg-[#252420]'
                              : 'bg-white border-neutral-200/80 hover:bg-neutral-50 shadow-sm'
                        }`}
                      >
                        <div className="flex items-center justify-between cursor-pointer">
                          <div className="flex items-center space-x-3">
                            <span className="text-xl">⚡</span>
                            <div>
                              <h5 className={`font-bold text-sm uppercase leading-tight ${darkMode ? 'text-white' : 'text-neutral-850'}`}>UPI Transfer</h5>
                              <p className={`text-[10px] font-semibold ${darkMode ? 'text-neutral-450' : 'text-neutral-500'}`}>Google Pay, PhonePe, Paytm</p>
                            </div>
                          </div>
                          <input type="radio" checked={paymentMethod === 'upi'} readOnly className="accent-amber-500 h-4 w-4" />
                        </div>
                        {paymentMethod === 'upi' && (
                          <div className={`mt-3 pt-3 border-t border-dashed space-y-2.5 ${darkMode ? 'border-neutral-800' : 'border-neutral-200'}`} onClick={(e) => e.stopPropagation()}>
                            <div className="flex gap-2">
                              {['GPay', 'PhonePe', 'Paytm'].map((app) => (
                                <button key={app} type="button" className={`flex-1 border rounded-lg py-1.5 text-xs font-bold transition ${
                                  darkMode 
                                    ? 'bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border-neutral-700' 
                                    : 'bg-white hover:bg-amber-50 text-neutral-800 border-neutral-200 shadow-sm'
                                }`}>
                                  {app}
                                </button>
                              ))}
                            </div>
                            <input 
                              type="text" 
                              placeholder="Enter UPI ID (e.g. goret@okaxis)" 
                              className={`w-full text-xs font-semibold rounded-lg p-2 focus:outline-none transition-all ${
                                darkMode 
                                  ? 'bg-[#12110E] border border-neutral-800 text-white placeholder-neutral-600 focus:border-amber-550' 
                                  : 'bg-neutral-50 border border-neutral-250 text-neutral-800 placeholder-neutral-400 focus:bg-white focus:border-amber-500 focus:ring-4 focus:ring-amber-550/10'
                              }`}
                            />
                          </div>
                        )}
                      </div>

                      {/* Card Option */}
                      <div 
                        onClick={() => setPaymentMethod('card')}
                        className={`p-4 rounded-2xl border transition-all ${
                          paymentMethod === 'card' 
                            ? darkMode
                              ? 'bg-amber-500/5 border-amber-500/40 shadow-md -translate-y-0.5' 
                              : 'bg-amber-50/20 border-amber-550 shadow-sm -translate-y-0.5'
                            : darkMode
                              ? 'bg-[#1E1D19] border-neutral-800 hover:bg-[#252420]'
                              : 'bg-white border-neutral-200/80 hover:bg-neutral-50 shadow-sm'
                        }`}
                      >
                        <div className="flex items-center justify-between cursor-pointer">
                          <div className="flex items-center space-x-3">
                            <span className="text-xl">💳</span>
                            <div>
                              <h5 className={`font-bold text-sm uppercase leading-tight ${darkMode ? 'text-white' : 'text-neutral-855'}`}>Sweet Card</h5>
                              <p className={`text-[10px] font-semibold ${darkMode ? 'text-neutral-450' : 'text-neutral-500'}`}>Credit or Debit Card</p>
                            </div>
                          </div>
                          <input type="radio" checked={paymentMethod === 'card'} readOnly className="accent-amber-500 h-4 w-4" />
                        </div>
                        {paymentMethod === 'card' && (
                          <div className={`mt-3 pt-3 border-t border-dashed space-y-3.5 ${darkMode ? 'border-neutral-800' : 'border-neutral-200'}`} onClick={(e) => e.stopPropagation()}>
                            
                            {/* Card Mockup */}
                            <div className="bg-gradient-to-r from-amber-500 to-amber-650 rounded-xl p-4 text-white shadow-md relative overflow-hidden">
                              <div className="absolute right-3 top-3 text-lg opacity-25 font-extrabold font-mono">PREMIUM CARD</div>
                              <div className="text-[9px] font-extrabold tracking-wider uppercase opacity-85">GORET GOLD CARD</div>
                              <div className="text-base font-mono tracking-widest my-3">
                                {cardDetails.number || '•••• •••• •••• ••••'}
                              </div>
                              <div className="flex justify-between items-center text-[10px] font-mono">
                                <div>
                                  <span className="text-[7px] block opacity-75">CARDHOLDER</span>
                                  <span className="font-bold">VALUED CUSTOMER</span>
                                </div>
                                <div className="text-right">
                                  <span className="text-[7px] block opacity-75">EXPIRES</span>
                                  <span className="font-bold">{cardDetails.expiry || 'MM/YY'}</span>
                                </div>
                              </div>
                            </div>

                            <div className="space-y-2.5">
                              <div>
                                <label className={`block text-[9px] font-bold uppercase tracking-wider mb-1 ${darkMode ? 'text-neutral-400' : 'text-neutral-500'}`}>Card Number</label>
                                <input 
                                  type="text" 
                                  placeholder="4111 2222 3333 4444" 
                                  value={cardDetails.number}
                                  onChange={(e) => {
                                    let v = e.target.value.replace(/\D/g, '');
                                    if (v.length > 16) v = v.slice(0, 16);
                                    const parts: string[] = [];
                                    for (let i = 0; i < v.length; i += 4) {
                                      parts.push(v.slice(i, i + 4));
                                    }
                                    setCardDetails(prev => ({ ...prev, number: parts.join(' ') }));
                                  }}
                                  className={`w-full text-xs font-semibold rounded-lg p-2 focus:outline-none transition-all ${
                                    darkMode 
                                      ? 'bg-[#12110E] border border-neutral-800 text-white placeholder-neutral-600 focus:border-amber-550' 
                                      : 'bg-neutral-50 border border-neutral-250 text-neutral-800 placeholder-neutral-400 focus:bg-white focus:border-amber-505 focus:ring-4 focus:ring-amber-550/10'
                                  }`}
                                />
                              </div>
                              <div className="flex gap-2">
                                <div className="flex-1">
                                  <label className={`block text-[9px] font-bold uppercase tracking-wider mb-1 ${darkMode ? 'text-neutral-400' : 'text-neutral-500'}`}>Expiry</label>
                                  <input 
                                    type="text" 
                                    placeholder="MM/YY" 
                                    value={cardDetails.expiry}
                                    onChange={(e) => {
                                      let v = e.target.value.replace(/\D/g, '');
                                      if (v.length > 4) v = v.slice(0, 4);
                                      if (v.length > 2) {
                                        setCardDetails(prev => ({ ...prev, expiry: `${v.slice(0, 2)}/${v.slice(2)}` }));
                                      } else {
                                        setCardDetails(prev => ({ ...prev, expiry: v }));
                                      }
                                    }}
                                    className={`w-full text-xs font-semibold rounded-lg p-2 focus:outline-none transition-all ${
                                      darkMode 
                                        ? 'bg-[#12110E] border border-neutral-800 text-white placeholder-neutral-600 focus:border-amber-550' 
                                        : 'bg-neutral-50 border border-neutral-250 text-neutral-800 placeholder-neutral-400 focus:bg-white focus:border-amber-505 focus:ring-4 focus:ring-amber-550/10'
                                    }`}
                                  />
                                </div>
                                <div className="flex-1">
                                  <label className={`block text-[9px] font-bold uppercase tracking-wider mb-1 ${darkMode ? 'text-neutral-400' : 'text-neutral-500'}`}>CVV</label>
                                  <input 
                                    type="password" 
                                    placeholder="•••" 
                                    value={cardDetails.cvv}
                                    onChange={(e) => {
                                      let v = e.target.value.replace(/\D/g, '');
                                      if (v.length > 3) v = v.slice(0, 3);
                                      setCardDetails(prev => ({ ...prev, cvv: v }));
                                    }}
                                    className={`w-full text-xs font-semibold rounded-lg p-2 focus:outline-none transition-all ${
                                      darkMode 
                                        ? 'bg-[#12110E] border border-neutral-800 text-white placeholder-neutral-600 focus:border-amber-550' 
                                        : 'bg-neutral-50 border border-neutral-250 text-neutral-800 placeholder-neutral-400 focus:bg-white focus:border-amber-505 focus:ring-4 focus:ring-amber-550/10'
                                    }`}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Goret Wallet Option */}
                      <div 
                        onClick={() => setPaymentMethod('wallet')}
                        className={`p-4 rounded-2xl border transition-all ${
                          paymentMethod === 'wallet' 
                            ? darkMode
                              ? 'bg-amber-500/5 border-amber-500/40 shadow-md -translate-y-0.5' 
                              : 'bg-amber-50/20 border-amber-550 shadow-sm -translate-y-0.5'
                            : darkMode
                              ? 'bg-[#1E1D19] border-neutral-800 hover:bg-[#252420]'
                              : 'bg-white border-neutral-200/80 hover:bg-neutral-50 shadow-sm'
                        }`}
                      >
                        <div className="flex items-center justify-between cursor-pointer">
                          <div className="flex items-center space-x-3">
                            <span className="text-xl">💳</span>
                            <div>
                              <h5 className={`font-bold text-sm uppercase leading-tight ${darkMode ? 'text-white' : 'text-neutral-855'}`}>Goret Wallet</h5>
                              <p className={`text-[10px] font-semibold ${darkMode ? 'text-neutral-450' : 'text-neutral-500'}`}>Balance: ₹500.00</p>
                            </div>
                          </div>
                          <input type="radio" checked={paymentMethod === 'wallet'} readOnly className="accent-amber-500 h-4 w-4" />
                        </div>
                        {paymentMethod === 'wallet' && (
                          <div className="mt-2 pt-2" onClick={(e) => e.stopPropagation()}>
                            <div className={`border rounded-xl p-3 text-xs font-semibold text-center transition-colors ${
                              darkMode ? 'bg-amber-500/10 border-amber-500/20 text-amber-400' : 'bg-amber-50 border-amber-250 text-amber-800 shadow-sm'
                            }`}>
                              {grandTotal <= 500 ? (
                                <span>🎉 Your balance covers this order completely!</span>
                              ) : (
                                <span>Remaining ₹{(grandTotal - 500).toFixed(2)} will be paid via Cash on Delivery.</span>
                              )}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Cash on Delivery Option */}
                      <div 
                        onClick={() => setPaymentMethod('cod')}
                        className={`p-4 rounded-2xl border transition-all ${
                          paymentMethod === 'cod' 
                            ? darkMode
                              ? 'bg-amber-500/5 border-amber-500/40 shadow-md -translate-y-0.5' 
                              : 'bg-amber-50/20 border-amber-550 shadow-sm -translate-y-0.5'
                            : darkMode
                              ? 'bg-[#1E1D19] border-neutral-800 hover:bg-[#252420]'
                              : 'bg-white border-neutral-200/80 hover:bg-neutral-50 shadow-sm'
                        }`}
                      >
                        <div className="flex items-center justify-between cursor-pointer">
                          <div className="flex items-center space-x-3">
                            <span className="text-xl">🛵</span>
                            <div>
                              <h5 className={`font-bold text-sm uppercase leading-tight ${darkMode ? 'text-white' : 'text-neutral-855'}`}>Cash on Delivery (COD)</h5>
                              <p className={`text-[10px] font-semibold ${darkMode ? 'text-neutral-450' : 'text-neutral-500'}`}>Pay cash or QR scan at door</p>
                            </div>
                          </div>
                          <input type="radio" checked={paymentMethod === 'cod'} readOnly className="accent-amber-500 h-4 w-4" />
                        </div>
                        {paymentMethod === 'cod' && (
                          <div className="mt-2 pt-2" onClick={(e) => e.stopPropagation()}>
                            <p className={`text-[10px] font-semibold text-center ${darkMode ? 'text-neutral-400' : 'text-neutral-500'}`}>
                              Pay with cash or scan the QR code presented by our delivery partner.
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    {/* Customer Info Form */}
                    <div className={`border p-4 rounded-2xl space-y-3 shadow-sm transition-colors ${
                      darkMode ? 'bg-[#24201A]/60 border-amber-500/15' : 'bg-amber-50/40 border-amber-200/80'
                    }`}>
                      <h4 className={`font-bold text-xs uppercase tracking-wider ${
                        darkMode ? 'text-amber-400' : 'text-amber-800'
                      }`}>
                        {diningMode === 'dine-in' ? '🍽️ Dine-In Table Selection' : '📦 Delivery Coordinates'}
                      </h4>
                      
                      <div>
                        <label className={`block text-[10px] font-bold uppercase tracking-wider mb-1 ${darkMode ? 'text-neutral-400' : 'text-neutral-550'}`}>Recipient Name</label>
                        <input 
                          type="text" 
                          value={customerName}
                          onChange={(e) => setCustomerName(e.target.value)}
                          className={`w-full text-xs font-semibold rounded-lg p-2 focus:outline-none transition-all ${
                            darkMode 
                              ? 'bg-[#12110E] border border-neutral-800 text-white focus:border-amber-550' 
                              : 'bg-white border border-neutral-250 text-neutral-800 focus:border-amber-500 focus:ring-4 focus:ring-amber-550/10 shadow-sm'
                          }`}
                        />
                      </div>

                      {diningMode === 'dine-in' ? (
                        <div>
                          <label className={`block text-[10px] font-bold uppercase tracking-wider mb-1 ${darkMode ? 'text-neutral-400' : 'text-neutral-555'}`}>Table Number</label>
                          <input 
                            type="text" 
                            pattern="[0-9]*"
                            maxLength={2}
                            placeholder="Enter table number (1-12)"
                            value={tableNumber}
                            onChange={(e) => setTableNumber(e.target.value.replace(/\D/g, ''))}
                            className={`w-full text-xs font-semibold rounded-lg p-2 focus:outline-none transition-all ${
                              darkMode 
                                ? 'bg-[#12110E] border border-neutral-850 text-white focus:border-amber-550' 
                                : 'bg-white border border-neutral-250 text-neutral-800 focus:border-amber-500 focus:ring-4 focus:ring-amber-550/10 shadow-sm'
                            }`}
                          />
                        </div>
                      ) : (
                        <div>
                          <label className={`block text-[10px] font-bold uppercase tracking-wider mb-1 ${darkMode ? 'text-neutral-400' : 'text-neutral-555'}`}>Delivery Address</label>
                          <input 
                            type="text" 
                            value={customerAddress}
                            onChange={(e) => setCustomerAddress(e.target.value)}
                            className={`w-full text-xs font-semibold rounded-lg p-2 focus:outline-none transition-all ${
                              darkMode 
                                ? 'bg-[#12110E] border border-neutral-800 text-white focus:border-amber-550' 
                                : 'bg-white border border-neutral-250 text-neutral-800 focus:border-amber-500 focus:ring-4 focus:ring-amber-550/10 shadow-sm'
                            }`}
                          />
                        </div>
                      )}
                    </div>

                    {/* Cart Items List */}
                    <div className="space-y-3">
                      <h4 className={`font-bold text-xs uppercase tracking-wider ${darkMode ? 'text-neutral-400' : 'text-neutral-500'}`}>🛒 Basket Summary</h4>
                      {Object.entries(cart).map(([id, qty]) => {
                        const item = MENU_ITEMS.find(m => m.id === id);
                        if (!item) return null;
                        return (
                          <div key={id} className={`border rounded-xl p-3 flex items-center justify-between shadow-sm transition-colors ${
                            darkMode ? 'bg-[#24231E] border-neutral-800/80' : 'bg-white border-neutral-200/80'
                          }`}>
                            <div className="flex items-center space-x-3">
                              <img src={item.image} alt={item.name} className={`w-12 h-12 rounded-lg object-cover border ${
                                darkMode ? 'border-neutral-800' : 'border-neutral-200/80'
                              }`} />
                              <div>
                                <h5 className={`font-bold text-xs uppercase leading-tight ${darkMode ? 'text-white' : 'text-neutral-800'}`}>{item.name}</h5>
                                <span className={`text-[10px] font-bold ${darkMode ? 'text-neutral-450' : 'text-neutral-500'}`}>₹{item.price} each</span>
                              </div>
                            </div>

                            {/* Quantity Controls */}
                            <div className={`flex items-center space-x-1 border p-1 rounded-xl transition-colors ${
                              darkMode ? 'bg-[#12110E] border-neutral-800' : 'bg-neutral-100 border-neutral-200'
                            }`}>
                              <button 
                                onClick={() => removeFromCart(id)}
                                className={`w-6 h-6 rounded-lg font-bold flex items-center justify-center transform active:scale-95 transition-all text-xs ${
                                  darkMode ? 'bg-[#1A1916] hover:bg-neutral-800 text-white' : 'bg-white hover:bg-neutral-50 text-black border border-neutral-200'
                                }`}
                              >
                                ➖
                              </button>
                              <span className={`px-2 font-bold text-xs min-w-[16px] text-center ${darkMode ? 'text-white' : 'text-neutral-850'}`}>{qty}</span>
                              <button 
                                onClick={() => addToCart(id)}
                                className={`w-6 h-6 rounded-lg font-bold flex items-center justify-center transform active:scale-95 transition-all text-xs ${
                                  darkMode ? 'bg-[#1A1916] hover:bg-neutral-800 text-white' : 'bg-white hover:bg-neutral-50 text-black border border-neutral-200'
                                }`}
                              >
                                ➕
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </>
                )}
              </div>

              {/* Drawer Footer Calculations */}
              {totalCartItemsCount > 0 && (
                <div className={`p-6 border-t space-y-4 shadow-md transition-colors ${
                  darkMode ? 'bg-[#12110E] border-neutral-850' : 'bg-neutral-50 border-neutral-200/80'
                }`}>
                  {checkoutStep === 'cart' ? (
                    <div className="space-y-1">
                      <label className={`block text-[10px] font-bold uppercase tracking-wider mb-1 ${darkMode ? 'text-neutral-400' : 'text-neutral-550'}`}>Promo Code</label>
                      <div className="flex space-x-2">
                        <input 
                          type="text" 
                          placeholder="Try GORET15" 
                          value={promoCode}
                          onChange={(e) => setPromoCode(e.target.value)}
                          className={`flex-1 text-xs font-semibold uppercase tracking-wider rounded-xl p-2.5 focus:outline-none transition-all ${
                            darkMode 
                              ? 'bg-[#1A1916] border border-neutral-800 text-white focus:border-amber-550' 
                              : 'bg-white border border-neutral-250 text-neutral-850 focus:border-amber-500 focus:ring-4 focus:ring-amber-550/10 shadow-sm'
                          }`}
                        />
                        <button 
                          onClick={handleApplyPromo}
                          className={`font-semibold text-xs px-4 py-2.5 rounded-xl border transition-colors ${
                            darkMode 
                              ? 'bg-neutral-800 hover:bg-neutral-750 text-amber-400 border-neutral-700' 
                              : 'bg-black hover:bg-neutral-800 text-amber-400 border-black'
                          }`}
                        >
                          Apply
                        </button>
                      </div>
                      {promoError && <p className="text-[10px] font-semibold text-red-500 mt-1">{promoError}</p>}
                      {appliedPromo && <p className="text-[10px] font-semibold text-green-500 mt-1">🎉 Applied: {appliedPromo.code} (15% OFF!)</p>}
                    </div>
                  ) : (
                    <div className={`border rounded-xl p-3.5 flex justify-between items-center shadow-sm transition-colors ${
                      darkMode ? 'bg-[#1A1916] border-neutral-800' : 'bg-amber-50/50 border-amber-200/60'
                    }`}>
                      <div>
                        <span className={`text-[9px] font-bold uppercase block tracking-wider ${darkMode ? 'text-neutral-450' : 'text-amber-800'}`}>Selected Payment</span>
                        <span className={`text-xs font-bold uppercase ${darkMode ? 'text-white' : 'text-neutral-800'}`}>
                          {paymentMethod === 'upi' && '⚡ UPI Transfer'}
                          {paymentMethod === 'card' && `💳 Card (*${cardDetails.number.replace(/\s+/g, '').slice(-4) || '4242'})`}
                          {paymentMethod === 'wallet' && '💳 Goret Wallet Balance'}
                          {paymentMethod === 'cod' && '🛵 Cash/QR on Delivery'}
                        </span>
                      </div>
                      <button 
                        onClick={() => setCheckoutStep('cart')}
                        className={`text-[9px] font-bold uppercase border px-2.5 py-1 rounded-lg transition-colors ${
                          darkMode ? 'bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border-neutral-700' : 'bg-white hover:bg-neutral-50 text-neutral-800 border-neutral-200 shadow-sm'
                        }`}
                      >
                        Change
                      </button>
                    </div>
                  )}

                  {/* Calculations breakdown */}
                  <div className={`text-xs font-semibold space-y-1.5 transition-colors ${darkMode ? 'text-neutral-400' : 'text-neutral-600'}`}>
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span className={`font-bold ${darkMode ? 'text-white' : 'text-neutral-855'}`}>₹{subtotal.toFixed(2)}</span>
                    </div>
                    {appliedPromo && (
                      <div className="flex justify-between text-green-500 font-semibold">
                        <span>Discount ({appliedPromo.discount * 100}%)</span>
                        <span>-₹{discountAmount.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span>Express Delivery</span>
                      <span className={`font-bold ${darkMode ? 'text-white' : 'text-neutral-855'}`}>₹{deliveryFee.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>GST (5%)</span>
                      <span className={`font-bold ${darkMode ? 'text-white' : 'text-neutral-855'}`}>₹{taxAmount.toFixed(2)}</span>
                    </div>
                    <div className={`border-t border-dashed my-2 ${darkMode ? 'border-neutral-855' : 'border-neutral-200'}`}></div>
                    <div className={`flex justify-between items-center text-sm font-bold uppercase ${darkMode ? 'text-white' : 'text-neutral-850'}`}>
                      <span>Grand Total</span>
                      <span className={`px-2.5 py-1.5 border rounded-lg shadow-sm transition-colors ${
                        darkMode 
                          ? 'bg-amber-500/10 border-amber-500/20 text-amber-400' 
                          : 'bg-amber-50 border-amber-200/60 text-amber-600'
                      }`}>₹{grandTotal.toFixed(2)}</span>
                    </div>
                  </div>

                  {checkoutStep === 'cart' ? (
                    <button
                      onClick={() => {
                        if (user === null) {
                          setAuthTab('login');
                          setAuthError('Please sign in or register to place your order!');
                          setAuthForm({ name: '', email: '', password: '', address: '' });
                          setCurrentView('login');
                          setIsCartOpen(false);
                          playBuzzSound('remove');
                        } else {
                          setDiningStep('ask');
                          setTableNumber('');
                          setShowDiningModal(true);
                        }
                      }}
                      className={`w-full font-semibold text-xs py-3.5 px-6 rounded-xl transition-all shadow-md active:scale-[0.98] ${
                        darkMode 
                          ? 'bg-amber-500 hover:bg-amber-600 text-black shadow-[0_4px_12px_rgba(245,158,11,0.25)]' 
                          : 'bg-amber-500 hover:bg-amber-600 text-white shadow-[0_4px_12px_rgba(245,158,11,0.15)]'
                      }`}
                    >
                      🚀 Place Your Order (₹{grandTotal.toFixed(2)})
                    </button>
                  ) : (
                    <button
                      onClick={handleCheckout}
                      className={`w-full font-semibold text-xs py-3.5 px-6 rounded-xl transition-all shadow-md active:scale-[0.98] ${
                        darkMode 
                          ? 'bg-amber-500 hover:bg-amber-600 text-black shadow-[0_4px_12px_rgba(245,158,11,0.25)]' 
                          : 'bg-amber-500 hover:bg-amber-600 text-white shadow-[0_4px_12px_rgba(245,158,11,0.15)]'
                      }`}
                    >
                      💳 Confirm & Pay (₹{grandTotal.toFixed(2)})
                    </button>
                  )}
                  <p className="text-[9px] text-center font-bold uppercase tracking-wider text-neutral-500">
                    🔒 Secure checkout processed by Goret Security
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* DINING CHOICE MODAL OVERLAY */}
      {showDiningModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className={`w-full max-w-sm border p-6 sm:p-8 rounded-3xl space-y-6 relative overflow-hidden transition-all duration-300 ${
            darkMode 
              ? 'bg-[#1A1916] border-neutral-800/80 shadow-[0_20px_50px_rgba(0,0,0,0.4)]' 
              : 'bg-white border-neutral-200/85 shadow-[0_20px_50px_rgba(0,0,0,0.06)]'
          }`}>
            {/* Top honey drip border decor */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 to-amber-600" />

            {diningStep === 'ask' ? (
              <div className="text-center space-y-4">
                <span className="text-4xl block animate-bounce">🍽️</span>
                <h3 className={`text-lg font-bold uppercase transition-colors ${darkMode ? 'text-white' : 'text-neutral-850'}`}>Are you dining in the Cafe?</h3>
                <p className={`text-xs font-semibold leading-relaxed transition-colors ${darkMode ? 'text-neutral-400' : 'text-neutral-500'}`}>Please confirm if you are currently seated at one of our tables.</p>
                
                <div className="flex flex-col gap-2 pt-2">
                  <button
                    onClick={() => {
                      setDiningMode('dine-in');
                      setDiningStep('table');
                      playBuzzSound('add');
                    }}
                    className={`w-full font-semibold text-xs py-3 px-6 rounded-xl transition-all shadow-md active:scale-[0.98] ${
                      darkMode 
                        ? 'bg-amber-500 hover:bg-amber-600 text-black shadow-[0_4px_12px_rgba(245,158,11,0.25)]' 
                        : 'bg-amber-500 hover:bg-amber-600 text-white shadow-[0_4px_12px_rgba(245,158,11,0.15)]'
                    }`}
                  >
                    🍽️ Yes, Dining In
                  </button>
                  <button
                    onClick={() => {
                      setDiningMode('delivery');
                      setShowDiningModal(false);
                      setCheckoutStep('payment');
                      playBuzzSound('add');
                    }}
                    className={`w-full font-semibold text-xs py-3 px-6 rounded-xl transition-all border shadow-sm active:scale-[0.98] ${
                      darkMode 
                        ? 'bg-neutral-800 hover:bg-neutral-750 text-white border-neutral-700' 
                        : 'bg-white hover:bg-neutral-50 text-neutral-800 border-neutral-200'
                    }`}
                  >
                    🛵 No, Delivery
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center space-y-4">
                <span className="text-4xl block animate-pulse">🍽️</span>
                <h3 className={`text-lg font-bold uppercase transition-colors ${darkMode ? 'text-white' : 'text-neutral-855'}`}>Enter Table Number</h3>
                <p className={`text-xs font-semibold leading-relaxed transition-colors ${darkMode ? 'text-neutral-400' : 'text-neutral-500'}`}>Which table are you seated at? (1 to 12)</p>
                
                <div className="pt-2">
                  <input
                    type="text"
                    pattern="[0-9]*"
                    maxLength={2}
                    placeholder="Table number (e.g. 5)"
                    value={tableNumber}
                    onChange={(e) => setTableNumber(e.target.value.replace(/\D/g, ''))}
                    className={`w-full text-center text-sm font-semibold rounded-xl p-3 focus:outline-none transition-all ${
                      darkMode 
                        ? 'bg-[#12110E] border border-neutral-850 text-white focus:border-amber-550' 
                        : 'bg-neutral-50 border border-neutral-250 text-neutral-850 focus:bg-white focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 shadow-sm'
                    }`}
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setDiningStep('ask');
                      setTableNumber('');
                      playBuzzSound('remove');
                    }}
                    className={`flex-1 font-semibold text-xs py-2 px-4 rounded-xl border transition shadow-sm ${
                      darkMode 
                        ? 'bg-neutral-805 hover:bg-neutral-800 text-neutral-305 border-neutral-700' 
                        : 'bg-white hover:bg-neutral-100 text-neutral-700 border-neutral-200'
                    }`}
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (!tableNumber.trim()) {
                        alert("Please input your table number.");
                        return;
                      }
                      setShowDiningModal(false);
                      setCheckoutStep('payment');
                      playBuzzSound('checkout');
                    }}
                    className={`flex-1 font-semibold text-xs py-2.5 px-4 rounded-xl transition shadow-md active:scale-[0.98] ${
                      darkMode 
                        ? 'bg-amber-500 hover:bg-amber-600 text-black shadow-[0_4px_12px_rgba(245,158,11,0.25)]' 
                        : 'bg-amber-500 hover:bg-amber-600 text-white shadow-[0_4px_12px_rgba(245,158,11,0.15)]'
                    }`}
                  >
                    Confirm Table
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* FOOTER */}
      <footer className={`pt-16 pb-8 px-4 sm:px-8 border-t transition-colors duration-300 ${
        darkMode ? 'bg-[#0D0C0A] text-neutral-350 border-neutral-900' : 'bg-[#F8F7F3] text-neutral-600 border-neutral-200/60'
      }`}>
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          
          {/* Logo Brand Column */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <span className="text-3xl">🍽️</span>
              <h4 className={`text-xl font-bold uppercase tracking-tight transition-colors ${
                darkMode ? 'text-amber-400' : 'text-amber-600'
              }`}>GORET'S CAFE</h4>
            </div>
            <p className={`text-xs font-medium leading-relaxed transition-colors ${
              darkMode ? 'text-neutral-455' : 'text-neutral-500'
            }`}>
              We craft premium dining experiences! Since our founding we have served millions of satisfied customers with smiles. Come visit our cafe!
            </p>
            <div className="flex space-x-2.5 pt-2">
              <span className={`w-8 h-8 rounded-xl flex items-center justify-center text-[10px] font-bold cursor-pointer transition-all duration-300 hover:-translate-y-0.5 ${
                darkMode ? 'bg-neutral-900 text-neutral-400 hover:bg-amber-500 hover:text-black' : 'bg-white text-neutral-500 hover:bg-amber-500 hover:text-white border border-neutral-200 shadow-sm'
              }`}>FB</span>
              <span className={`w-8 h-8 rounded-xl flex items-center justify-center text-[10px] font-bold cursor-pointer transition-all duration-300 hover:-translate-y-0.5 ${
                darkMode ? 'bg-neutral-900 text-neutral-400 hover:bg-amber-500 hover:text-black' : 'bg-white text-neutral-500 hover:bg-amber-500 hover:text-white border border-neutral-200 shadow-sm'
              }`}>TW</span>
              <span className={`w-8 h-8 rounded-xl flex items-center justify-center text-[10px] font-bold cursor-pointer transition-all duration-300 hover:-translate-y-0.5 ${
                darkMode ? 'bg-neutral-900 text-neutral-400 hover:bg-amber-500 hover:text-black' : 'bg-white text-neutral-500 hover:bg-amber-500 hover:text-white border border-neutral-200 shadow-sm'
              }`}>IG</span>
            </div>
          </div>

          {/* Quick Links Column */}
          <div>
            <h5 className={`font-bold uppercase tracking-wider text-xs mb-4 transition-colors ${
              darkMode ? 'text-white' : 'text-neutral-900'
            }`}>🍽️ Delicious Links</h5>
            <ul className={`text-xs font-medium space-y-2.5 ${
              darkMode ? 'text-neutral-400' : 'text-neutral-600'
            }`}>
              <li className="hover:text-amber-500 transition-colors cursor-pointer" onClick={() => setActiveCategory('Fries')}>🍟 Premium fries menu</li>
              <li className="hover:text-amber-500 transition-colors cursor-pointer" onClick={() => setActiveCategory('Pizza')}>🍕 Gourmet pizza selections</li>
              <li className="hover:text-amber-500 transition-colors cursor-pointer" onClick={() => setActiveCategory('Burgers')}>🍔 Thick beef hamburgers</li>
              <li className="hover:text-amber-500 transition-colors cursor-pointer" onClick={() => setActiveCategory('Desserts')}>🧇 Sweet signature waffles</li>
            </ul>
          </div>

          {/* Opening Hours */}
          <div>
            <h5 className={`font-bold uppercase tracking-wider text-xs mb-4 transition-colors ${
              darkMode ? 'text-white' : 'text-neutral-900'
            }`}>⏰ Operating Hours</h5>
            <ul className={`text-xs font-medium space-y-2.5 ${
              darkMode ? 'text-neutral-400' : 'text-neutral-600'
            }`}>
              <li>Monday - Friday: <span className={darkMode ? 'text-amber-400' : 'text-amber-600 font-semibold'}>8:00 AM - 11:00 PM</span></li>
              <li>Saturday - Sunday: <span className={darkMode ? 'text-amber-400' : 'text-amber-600 font-semibold'}>7:00 AM - Midnight</span></li>
              <li className={`text-[10px] font-bold uppercase transition-colors ${darkMode ? 'text-neutral-500' : 'text-neutral-450'}`}>🌟 Courier Delivery operates 24/7</li>
            </ul>
          </div>

          {/* Contact Information */}
          <div>
            <h5 className={`font-bold uppercase tracking-wider text-xs mb-4 transition-colors ${
              darkMode ? 'text-white' : 'text-neutral-900'
            }`}>📍 Our Location</h5>
            <p className={`text-xs font-medium leading-relaxed transition-colors ${
              darkMode ? 'text-neutral-400' : 'text-neutral-600'
            }`}>
              100 Feet Road, 4th Block, Koramangala, Bengaluru<br/><br/>
              📞 Hotline: 1800-GORETS-HELP<br/>
              📧 Email: contact@goretscafe.com
            </p>
          </div>
        </div>

        <div className={`border-t pt-8 text-center text-[10px] font-semibold uppercase tracking-wider ${
          darkMode ? 'border-neutral-900 text-neutral-500' : 'border-neutral-200/60 text-neutral-400'
        }`}>
          <p>© {new Date().getFullYear()} GORET'S CAFE. Built with dedication, premium ingredients, and strict craftsmanship. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
