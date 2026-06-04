import React, { useState, useEffect, useMemo, useRef } from 'react';

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
    name: 'Cheesy Beehive Loaded Fries',
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
    name: 'Sweet & Spicy Bee Pizza',
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
    name: 'Honeycomb Margherita',
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
    name: 'BBQ Buzz Chicken Pizza',
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
    name: 'Golden Hive Double Burger',
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
    name: 'Bumble Crispy Chicken Burger',
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
    name: 'Beehive Caramel Cupcakes',
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
    name: 'Bumblebee Caramel Macchiato',
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
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    
    osc.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    
    if (type === 'add') {
      // Ascending sweet bumble pop
      osc.type = 'sine';
      osc.frequency.setValueAtTime(250, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(600, audioCtx.currentTime + 0.15);
      gainNode.gain.setValueAtTime(0.15, audioCtx.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.01, audioCtx.currentTime + 0.15);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.16);
    } else if (type === 'remove') {
      // Descending buzz pop
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

export default function App() {
  const [cart, setCart] = useState({});
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [orderStatus, setOrderStatus] = useState('idle'); // idle -> placed -> preparing -> delivering -> delivered
  const [customerName, setCustomerName] = useState('Bee Lover');
  const [customerAddress, setCustomerAddress] = useState('Honeycomb Enclave, Sector 15, HSR Layout, Bengaluru');
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState(null); // { code: 'BEEWELCOMED', discount: 0.15 }
  const [promoError, setPromoError] = useState('');

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

  const deliveryFee = subtotal > 0 ? 39 : 0;
  const discountAmount = appliedPromo ? subtotal * appliedPromo.discount : 0;
  const taxAmount = (subtotal - discountAmount) * 0.05; // 5% GST for Food Delivery in India
  const grandTotal = subtotal > 0 ? (subtotal - discountAmount + deliveryFee + taxAmount) : 0;

  // Cart operations
  const addToCart = (itemId) => {
    setCart(prev => ({
      ...prev,
      [itemId]: (prev[itemId] || 0) + 1
    }));
    playBuzzSound('add');
  };

  const removeFromCart = (itemId) => {
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
    if (code === 'BEEFREE15' || code === 'GORET15') {
      setAppliedPromo({ code, discount: 0.15 });
      setPromoError('');
    } else {
      setPromoError('Oops! Invalid Honeybee code.');
    }
  };

  // Checkout Simulators
  const handleCheckout = () => {
    if (totalCartItemsCount === 0) return;
    setOrderStatus('placed');
    setIsCartOpen(false);
    playBuzzSound('checkout');
  };

  // Status transitions
  useEffect(() => {
    if (orderStatus === 'placed') {
      const timer1 = setTimeout(() => setOrderStatus('preparing'), 4000);
      const timer2 = setTimeout(() => setOrderStatus('delivering'), 9000);
      const timer3 = setTimeout(() => setOrderStatus('delivered'), 16000);
      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
        clearTimeout(timer3);
      };
    }
  }, [orderStatus]);

  const handleResetOrder = () => {
    setCart({});
    setOrderStatus('idle');
    setAppliedPromo(null);
    setPromoCode('');
  };

  return (
    <div className="min-h-screen bg-[#FFFEEB] text-neutral-900 font-sans selection:bg-amber-400 selection:text-black transition-all duration-300">
      {/* HEADER SECTION */}
      <header className="sticky top-0 z-40 bg-amber-400 border-b-4 border-black px-4 py-3 sm:px-8 flex justify-between items-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
        {/* Honeybee Logo and Name */}
        <div className="flex items-center space-x-3 cursor-pointer group" onClick={() => setActiveCategory('All')}>
          <div className="bg-black p-2 rounded-xl border border-amber-400 transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
            {/* Cute Bee SVG */}
            <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 fill-amber-400 animate-pulse" viewBox="0 0 24 24">
              <path d="M12 2a4 4 0 0 0-4 4c0 1.25.5 2.39 1.41 3.19C7.14 10.32 6 12 6 14v1c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2v-1c0-2-1.14-3.68-3.41-4.81C15.5 8.39 16 7.25 16 6a4 4 0 0 0-4-4zm0 2c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm-4 10c0-1.66 1.34-3 3-3s3 1.34 3 3v1H8v-1z"/>
              <path d="M4 14a3 3 0 0 1-3-3V9.5a1.5 1.5 0 0 1 3 0V11a3 3 0 0 1 0 3zm16 0a3 3 0 0 0 3-3V9.5a1.5 1.5 0 0 0-3 0V11a3 3 0 0 0 0 3z" />
              <path d="M12 21a2 2 0 1 1-4 0h4z" />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tighter text-black uppercase transform group-hover:skew-x-2 transition-transform">
              Goret's Cafe
            </h1>
            <p className="text-xs font-bold text-neutral-800 tracking-widest uppercase -mt-1 hidden sm:block">
              🐝 Fresh & Honey-Sweetened 🍯
            </p>
          </div>
        </div>

        {/* Search Input on Desktop Header */}
        <div className="hidden md:flex flex-1 max-w-md mx-8 relative">
          <input
            type="text"
            placeholder="Search crunchy honey fries, sweet pizzas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#FFFEEB] border-2 border-black rounded-xl py-2 px-4 pl-10 text-sm font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
          <div className="absolute left-3 top-2.5 text-neutral-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          {searchTerm && (
            <button onClick={() => setSearchTerm('')} className="absolute right-3 top-2.5 text-xs font-bold bg-amber-300 hover:bg-amber-400 border border-black px-1 rounded">
              Clear
            </button>
          )}
        </div>

        {/* Cart Button with Bubble Badge */}
        <button
          onClick={() => setIsCartOpen(true)}
          className="relative bg-black text-white hover:bg-neutral-800 border-2 border-black p-3 rounded-2xl flex items-center space-x-2 transition-all transform hover:-translate-y-0.5 active:translate-y-0 shadow-[4px_4px_0px_0px_rgba(251,191,36,1)] hover:shadow-[2px_2px_0px_0px_rgba(251,191,36,1)]"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 stroke-amber-400" fill="none" viewBox="0 0 24 24" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
          <span className="font-black text-amber-400 hidden sm:inline">My Basket</span>
          {totalCartItemsCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 border-2 border-black text-white text-xs font-black rounded-full h-6 w-6 flex items-center justify-center animate-bounce">
              {totalCartItemsCount}
            </span>
          )}
        </button>
      </header>

      {/* MOBILE SEARCH BAR */}
      <div className="p-4 md:hidden bg-amber-200 border-b-2 border-black">
        <div className="relative">
          <input
            type="text"
            placeholder="Search crispy chicken, shakes, fries..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#FFFEEB] border-2 border-black rounded-xl py-2 px-4 pl-10 text-sm font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:outline-none"
          />
          <div className="absolute left-3 top-2.5 text-neutral-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          {searchTerm && (
            <button onClick={() => setSearchTerm('')} className="absolute right-3 top-2.5 text-xs font-bold bg-amber-300 hover:bg-amber-400 border border-black px-1.5 rounded">
              Clear
            </button>
          )}
        </div>
      </div>

      {/* HERO SECTION WITH DELIGHTFUL BEE GRAPHICS */}
      <div className="relative overflow-hidden bg-gradient-to-b from-amber-400 to-yellow-300 text-black py-10 px-4 sm:px-8 border-b-4 border-black">
        {/* Honeycomb Pattern Graphic Background Overlay */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="honeycomb" width="40" height="70" patternUnits="userSpaceOnUse" patternTransform="scale(1)">
                <path d="M 40,0 L 20,10 L 0,0 L 0,20 L 20,30 L 40,20 Z M 0,35 L 20,45 L 40,35 L 40,55 L 20,65 L 0,55 Z" fill="none" stroke="currentColor" strokeWidth="2"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#honeycomb)" />
          </svg>
        </div>

        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between relative z-10 space-y-6 md:space-y-0">
          <div className="text-center md:text-left md:max-w-xl space-y-3">
            <div className="inline-flex items-center space-x-2 bg-black text-amber-400 text-xs font-black uppercase tracking-widest px-3 py-1.5 rounded-full border border-black shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]">
              <span>⚡ EXTREMELY BUZZY BEE DELIVERY 🐝</span>
            </div>
            <h2 className="text-4xl sm:text-6xl font-black tracking-tight uppercase leading-none">
              FRESHLY BAKED, <br/>
              <span className="text-white drop-shadow-[2px_2px_0px_rgba(0,0,0,1)]">SWEETLY DELIVERED!</span>
            </h2>
            <p className="text-base sm:text-lg font-bold text-neutral-800 max-w-lg">
              Indulge in Goret's honey-kissed crispy fries, sweet glaze pizzas, loaded cheese burgers, and freshly brewed lemon teas. Order right now for the ultimate sweetness!
            </p>
            <div className="flex flex-wrap gap-2 justify-center md:justify-start pt-2">
              <span className="bg-white border-2 border-black px-3 py-1.5 rounded-xl font-black text-xs shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                🚀 Delivery under 20 mins
              </span>
              <span className="bg-black text-amber-400 border-2 border-black px-3 py-1.5 rounded-xl font-black text-xs shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]">
                🎟 Code: BEEFREE15 (15% OFF)
              </span>
            </div>
          </div>

          {/* Large Hero Bee Graphic / Delivery Illustration */}
          <div className="relative group">
            <div className="absolute -inset-1 bg-black rounded-3xl blur opacity-20 group-hover:opacity-30 transition duration-1000"></div>
            <div className="relative bg-[#FFFEEB] border-4 border-black p-6 rounded-3xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] max-w-sm flex flex-col items-center text-center">
              {/* Bee Animation */}
              <div className="relative w-32 h-32 mb-4 animate-bounce duration-1000">
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  {/* Wings */}
                  <ellipse cx="35" cy="30" rx="15" ry="25" fill="#bae6fd" stroke="black" strokeWidth="3" transform="rotate(-30 35 30)" className="animate-pulse" />
                  <ellipse cx="65" cy="30" rx="15" ry="25" fill="#bae6fd" stroke="black" strokeWidth="3" transform="rotate(30 65 30)" className="animate-pulse" />
                  {/* Antennae */}
                  <line x1="45" y1="20" x2="35" y2="5" stroke="black" strokeWidth="3" />
                  <circle cx="35" cy="5" r="4" fill="black" />
                  <line x1="55" y1="20" x2="65" y2="5" stroke="black" strokeWidth="3" />
                  <circle cx="65" cy="5" r="4" fill="black" />
                  {/* Body (Banded bee yellow/black) */}
                  <ellipse cx="50" cy="55" rx="25" ry="32" fill="#fbbf24" stroke="black" strokeWidth="4" />
                  {/* Stripes */}
                  <path d="M 30 45 Q 50 48 70 45" stroke="black" strokeWidth="5" fill="none" />
                  <path d="M 26 55 Q 50 58 74 55" stroke="black" strokeWidth="5" fill="none" />
                  <path d="M 28 65 Q 50 68 72 65" stroke="black" strokeWidth="5" fill="none" />
                  {/* Eyes */}
                  <circle cx="42" cy="45" r="4" fill="black" />
                  <circle cx="58" cy="45" r="4" fill="black" />
                  {/* Smile */}
                  <path d="M 46 52 Q 50 56 54 52" stroke="black" strokeWidth="3" fill="none" />
                </svg>
                {/* Honey Pot overlay */}
                <div className="absolute bottom-0 right-0 bg-amber-500 border-2 border-black rounded-lg px-2 py-0.5 text-xs font-black text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                  HONEY🍯
                </div>
              </div>
              <h4 className="font-black text-xl uppercase">GORET'S SWEET BOX</h4>
              <p className="text-xs font-bold text-neutral-600 mt-1">Get custom stickers, fresh honey-drizzled complimentary bun and free delivery with first 5 orders!</p>
            </div>
          </div>
        </div>
      </div>

      {/* LIVE ORDER STATUS TRACKING BAR (If order is active) */}
      {orderStatus !== 'idle' && (
        <div className="bg-black text-white py-6 px-4 border-b-4 border-black relative">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6 space-y-2 sm:space-y-0">
              <div>
                <span className="text-xs font-black uppercase text-amber-400 tracking-wider">🎯 Real-time Bee Radar</span>
                <h3 className="text-lg sm:text-xl font-black">
                  Your Buzz-Order is {orderStatus === 'placed' && 'Placed! 📝'}
                  {orderStatus === 'preparing' && 'being Glazed in the Kitchen! 🍳'}
                  {orderStatus === 'delivering' && 'Bzzzt! Flying to your hive! 🛵'}
                  {orderStatus === 'delivered' && 'Arrived! Enjoy sweet deliciousness! 🎉'}
                </h3>
              </div>
              <button 
                onClick={handleResetOrder} 
                className="bg-amber-400 hover:bg-amber-500 text-black font-black text-xs px-3 py-1.5 rounded-lg border-2 border-black shadow-[2px_2px_0px_rgba(255,255,255,0.3)] transition"
              >
                {orderStatus === 'delivered' ? 'Order Something Else 🍯' : 'Cancel & Reset Order'}
              </button>
            </div>

            {/* Tracker Stepper Map Grid */}
            <div className="grid grid-cols-4 gap-2 relative">
              {/* Progress Line */}
              <div className="absolute top-5 left-[12%] right-[12%] h-1 bg-neutral-800 z-0">
                <div 
                  className="h-full bg-amber-400 transition-all duration-1000"
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
                <div className={`w-10 h-10 rounded-full border-2 border-black flex items-center justify-center font-black text-sm transition-all duration-300 ${
                  orderStatus === 'placed' || orderStatus === 'preparing' || orderStatus === 'delivering' || orderStatus === 'delivered'
                    ? 'bg-amber-400 text-black scale-110' : 'bg-neutral-800 text-neutral-400'
                }`}>
                  📝
                </div>
                <span className="text-xs font-black mt-2">Order Placed</span>
              </div>

              {/* Step 2: Kitchen */}
              <div className="flex flex-col items-center text-center z-10">
                <div className={`w-10 h-10 rounded-full border-2 border-black flex items-center justify-center font-black text-sm transition-all duration-300 ${
                  orderStatus === 'preparing' || orderStatus === 'delivering' || orderStatus === 'delivered'
                    ? 'bg-amber-400 text-black scale-110' : 'bg-neutral-800 text-neutral-400'
                }`}>
                  🍳
                </div>
                <span className="text-xs font-black mt-2">Sweet Preparing</span>
              </div>

              {/* Step 3: Bee Rider */}
              <div className="flex flex-col items-center text-center z-10 relative">
                <div className={`w-10 h-10 rounded-full border-2 border-black flex items-center justify-center font-black text-sm transition-all duration-300 ${
                  orderStatus === 'delivering' || orderStatus === 'delivered'
                    ? 'bg-amber-400 text-black scale-110' : 'bg-neutral-800 text-neutral-400'
                }`}>
                  🐝
                </div>
                {/* Little Bee Animation on "delivering" status */}
                {orderStatus === 'delivering' && (
                  <span className="absolute -top-3 text-lg animate-bounce">⚡</span>
                )}
                <span className="text-xs font-black mt-2">Bumble Delivery</span>
              </div>

              {/* Step 4: Arrived */}
              <div className="flex flex-col items-center text-center z-10">
                <div className={`w-10 h-10 rounded-full border-2 border-black flex items-center justify-center font-black text-sm transition-all duration-300 ${
                  orderStatus === 'delivered'
                    ? 'bg-green-500 text-white scale-110' : 'bg-neutral-800 text-neutral-400'
                }`}>
                  🍔
                </div>
                <span className="text-xs font-black mt-2">At Your Door</span>
              </div>
            </div>

            {/* Simulated interactive delivery map card */}
            {orderStatus === 'delivering' && (
              <div className="mt-6 bg-[#1e1e1e] border-2 border-amber-400 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between">
                <div className="flex items-center space-x-3 mb-3 md:mb-0">
                  <div className="w-12 h-12 rounded-full bg-amber-400 flex items-center justify-center text-2xl border-2 border-black">
                    🐝
                  </div>
                  <div>
                    <h4 className="font-black text-amber-400 text-sm">Bumble Rider: Buster Bee</h4>
                    <p className="text-xs text-neutral-400">Gliding over golden wind current (1.2 km away)</p>
                  </div>
                </div>
                <div className="w-full md:w-64 bg-black border border-neutral-700 h-12 rounded-xl relative overflow-hidden flex items-center px-4">
                  <div className="text-[10px] text-yellow-300 font-mono tracking-widest uppercase animate-pulse">
                    🚀 BEE-GPS SIGNAL ONLINE
                  </div>
                  {/* Moving bee illustration representing GPS */}
                  <div className="absolute right-4 animate-ping bg-amber-400 rounded-full h-2.5 w-2.5"></div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* CATEGORY SELECTOR SLIDER */}
      <div className="bg-amber-100 border-b-2 border-black px-4 py-4 sm:px-8 overflow-x-auto whitespace-nowrap flex items-center space-x-2 scrollbar-none sticky top-[69px] sm:top-[77px] z-30 shadow-[0_2px_4px_rgba(0,0,0,0.05)]">
        <span className="font-black text-xs text-neutral-700 uppercase tracking-widest mr-2 hidden md:inline-block">
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
              className={`px-6 py-2 rounded-2xl font-black text-sm border-2 border-black uppercase transition-all duration-200 transform hover:-translate-y-0.5 ${
                isActive
                  ? 'bg-black text-amber-400 shadow-[3px_3px_0px_0px_rgba(251,191,36,1)]'
                  : 'bg-white text-black hover:bg-amber-200 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
              }`}
            >
              {cat === 'All' && '📋 All Feasts'}
              {cat === 'Fries' && '🍟 Crispy Fries'}
              {cat === 'Pizza' && '🍕 Honey Pizza'}
              {cat === 'Burgers' && '🍔 Big Burgers'}
              {cat === 'Desserts' && '🧇 Sweet Desserts'}
              {cat === 'Drinks' && '🥤 Buzzy Drinks'}
            </button>
          );
        })}
      </div>

      {/* MAIN CONTAINER */}
      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-8">
        
        {/* Active Category Header Title with items count */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-2xl sm:text-3xl font-black uppercase text-black flex items-center space-x-2">
              <span className="bg-amber-400 border-2 border-black p-1.5 rounded-lg text-lg">🐝</span>
              <span>{activeCategory} Menu Selection</span>
            </h3>
            <p className="text-sm font-bold text-neutral-600">
              Showing {filteredMenuItems.length} freshly curated bumblebee delights
            </p>
          </div>

          {searchTerm && (
            <div className="bg-amber-200 border-2 border-black rounded-xl px-3 py-1 text-xs font-bold">
              Filtered by: "{searchTerm}"
            </div>
          )}
        </div>

        {/* Empty Search / Category Results state */}
        {filteredMenuItems.length === 0 && (
          <div className="bg-white border-4 border-black p-12 text-center rounded-3xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] max-w-lg mx-auto my-12">
            <span className="text-5xl">🐝</span>
            <h4 className="text-xl font-black uppercase mt-4">Oh Bother! No Dishes Found</h4>
            <p className="text-sm font-bold text-neutral-600 mt-2">
              Our bee gatherers couldn't find anything matching your search. Try looking for fries, pizza, burgers, or refreshing drinks.
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setActiveCategory('All');
                playBuzzSound('add');
              }}
              className="mt-6 bg-amber-400 hover:bg-amber-500 border-2 border-black px-6 py-2.5 rounded-2xl font-black text-sm uppercase shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
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
              <div className="flex items-center space-x-3 mb-6 pb-2 border-b-2 border-black">
                <h4 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-black flex items-center space-x-2">
                  <span>{catHeader === 'Fries' ? '🍟' : catHeader === 'Pizza' ? '🍕' : catHeader === 'Burgers' ? '🍔' : catHeader === 'Desserts' ? '🧇' : '🥤'}</span>
                  <span>{catHeader} Heading</span>
                </h4>
                <div className="h-1 flex-1 bg-amber-200"></div>
                <span className="bg-black text-amber-400 text-xs font-black px-2.5 py-1 rounded-full border border-black">
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
                      className="group bg-white border-4 border-black rounded-3xl overflow-hidden hover:scale-[1.01] transition-all duration-200 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[10px_10px_0px_0px_rgba(251,191,36,1)] flex flex-col justify-between"
                    >
                      {/* Food Image Container */}
                      <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-amber-50 border-b-4 border-black">
                        {/* Rating Star Badge */}
                        <div className="absolute top-3 left-3 bg-white border-2 border-black text-black font-black text-xs px-2 py-1 rounded-xl flex items-center space-x-1 z-10 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                          <span>⭐</span>
                          <span>{item.rating}</span>
                          <span className="text-neutral-500 font-bold">({item.reviews})</span>
                        </div>

                        {/* Top-Right Tags */}
                        <div className="absolute top-3 right-3 flex flex-col gap-1 items-end z-10">
                          {item.tags.map((tag, idx) => (
                            <span 
                              key={idx} 
                              className="bg-amber-400 text-black border-2 border-black text-[10px] font-black uppercase px-2 py-0.5 rounded-lg shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>

                        {/* Image */}
                        <img 
                          src={item.image} 
                          alt={item.name} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          loading="lazy"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80';
                          }}
                        />
                      </div>

                      {/* Content Card Body */}
                      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-4">
                        <div>
                          <div className="flex justify-between items-start gap-2">
                            <h5 className="font-black text-lg sm:text-xl text-black uppercase tracking-tight hover:text-amber-500 transition-colors">
                              {item.name}
                            </h5>
                            <span className="text-xl font-black text-black whitespace-nowrap bg-amber-100 border-2 border-black px-2 py-0.5 rounded-xl shadow-[1px_1px_0px_rgba(0,0,0,1)]">
                              ₹{item.price}
                            </span>
                          </div>
                          <p className="text-xs sm:text-sm text-neutral-600 font-semibold mt-2 line-clamp-2">
                            {item.description}
                          </p>
                        </div>

                        {/* ADD TO CART SECTION (With + & - buttons) */}
                        <div className="pt-2 flex items-center justify-between">
                          <span className="text-[11px] font-black uppercase text-amber-600 tracking-wider">
                            🐝 Goret's Recipe
                          </span>

                          {quantityInCart === 0 ? (
                            <button
                              onClick={() => addToCart(item.id)}
                              className="bg-amber-400 hover:bg-black hover:text-amber-400 text-black font-black uppercase text-xs px-5 py-2.5 rounded-2xl border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-y-0.5 transition-all flex items-center space-x-1.5"
                            >
                              <span>Add to Basket</span>
                              <span>➕</span>
                            </button>
                          ) : (
                            <div className="flex items-center space-x-1 bg-black border-2 border-black p-1 rounded-2xl shadow-[3px_3px_0px_0px_rgba(251,191,36,1)]">
                              <button
                                onClick={() => removeFromCart(item.id)}
                                className="w-8 h-8 rounded-xl bg-amber-400 hover:bg-amber-500 text-black font-black flex items-center justify-center border border-black transform active:scale-95 transition-all text-sm"
                                title="Decrease item"
                              >
                                ➖
                              </button>
                              <span className="px-3 text-white font-black text-sm text-center min-w-[24px]">
                                {quantityInCart}
                              </span>
                              <button
                                onClick={() => addToCart(item.id)}
                                className="w-8 h-8 rounded-xl bg-amber-400 hover:bg-amber-500 text-black font-black flex items-center justify-center border border-black transform active:scale-95 transition-all text-sm"
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
      <section className="bg-amber-400 border-y-4 border-black py-12 px-4 sm:px-8 mt-12 shadow-inner">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-[#FFFEEB] border-4 border-black p-6 rounded-3xl shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] text-center">
            <div className="w-16 h-16 bg-amber-300 rounded-2xl border-2 border-black flex items-center justify-center text-3xl mx-auto mb-4">
              🐝
            </div>
            <h5 className="font-black text-lg uppercase">100% Pure Organic Glaze</h5>
            <p className="text-xs font-bold text-neutral-600 mt-2">
              Every dessert, pizza sauce, and fry sprinkle is sourced with native, hand-filtered raw honeycombs for that sweet nectar bite.
            </p>
          </div>

          <div className="bg-[#FFFEEB] border-4 border-black p-6 rounded-3xl shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] text-center">
            <div className="w-16 h-16 bg-amber-300 rounded-2xl border-2 border-black flex items-center justify-center text-3xl mx-auto mb-4">
              ⚡
            </div>
            <h5 className="font-black text-lg uppercase">Supersonic Drone Flight</h5>
            <p className="text-xs font-bold text-neutral-600 mt-2">
              Packed in specialized insulated hive-bags that preserve correct heat and crispness during high-speed delivery cycles.
            </p>
          </div>

          <div className="bg-[#FFFEEB] border-4 border-black p-6 rounded-3xl shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] text-center">
            <div className="w-16 h-16 bg-amber-300 rounded-2xl border-2 border-black flex items-center justify-center text-3xl mx-auto mb-4">
              🛡️
            </div>
            <h5 className="font-black text-lg uppercase">Golden Guarantee</h5>
            <p className="text-xs font-bold text-neutral-600 mt-2">
              Not fully satisfied? Send a buzz-ticket back to the hive and we will refund or replace your food immediately, no questions asked.
            </p>
          </div>
        </div>
      </section>

      {/* CART DRAWER / SIDEBAR */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <div 
            onClick={() => setIsCartOpen(false)}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
          />

          <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-md bg-[#FFFEEB] border-l-4 border-black flex flex-col justify-between shadow-[0px_0px_30px_rgba(0,0,0,0.5)]">
              
              {/* Drawer Header */}
              <div className="p-6 bg-amber-400 border-b-4 border-black flex justify-between items-center shadow-[0_2px_4px_rgba(0,0,0,0.1)]">
                <div className="flex items-center space-x-2">
                  <span className="text-2xl">🍯</span>
                  <h3 className="text-xl font-black uppercase text-black">Your Sweet Box</h3>
                  <span className="bg-black text-amber-400 font-black text-xs px-2.5 py-1 rounded-full border border-black">
                    {totalCartItemsCount} Items
                  </span>
                </div>
                <button 
                  onClick={() => setIsCartOpen(false)}
                  className="bg-black text-amber-400 hover:bg-neutral-800 border-2 border-black p-2 rounded-xl text-xs font-black"
                >
                  ✖ Close
                </button>
              </div>

              {/* Drawer Scroll Body */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                
                {/* Empty Cart State */}
                {totalCartItemsCount === 0 ? (
                  <div className="text-center py-16 space-y-4">
                    <span className="text-6xl animate-bounce inline-block">🐝</span>
                    <h4 className="font-black text-lg uppercase text-neutral-800">Your basket is empty!</h4>
                    <p className="text-xs font-bold text-neutral-500 max-w-xs mx-auto">
                      Fill up your hive-box with our premium signature honey pizzas, golden crinkle-cut fries, and warm sweetened waffles!
                    </p>
                    <button
                      onClick={() => setIsCartOpen(false)}
                      className="bg-amber-400 hover:bg-amber-500 border-2 border-black px-6 py-2.5 rounded-xl font-black text-xs uppercase"
                    >
                      Start Ordering Now
                    </button>
                  </div>
                ) : (
                  <>
                    {/* Customer Info Form */}
                    <div className="bg-amber-100 border-2 border-black p-4 rounded-2xl space-y-3 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                      <h4 className="font-black text-xs uppercase text-amber-800 tracking-wider">📦 Delivery Coordinates</h4>
                      
                      <div>
                        <label className="block text-[10px] font-black text-black uppercase">Recipient Name</label>
                        <input 
                          type="text" 
                          value={customerName}
                          onChange={(e) => setCustomerName(e.target.value)}
                          className="w-full text-xs font-bold bg-[#FFFEEB] border border-black rounded-lg p-1.5 focus:ring-1 focus:ring-amber-500"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-black text-black uppercase">Hive Address</label>
                        <input 
                          type="text" 
                          value={customerAddress}
                          onChange={(e) => setCustomerAddress(e.target.value)}
                          className="w-full text-xs font-bold bg-[#FFFEEB] border border-black rounded-lg p-1.5 focus:ring-1 focus:ring-amber-500"
                        />
                      </div>
                    </div>

                    {/* Cart Items List */}
                    <div className="space-y-3">
                      <h4 className="font-black text-xs uppercase text-neutral-500 tracking-wider">🛒 Basket Summary</h4>
                      {Object.entries(cart).map(([id, qty]) => {
                        const item = MENU_ITEMS.find(m => m.id === id);
                        if (!item) return null;
                        return (
                          <div key={id} className="bg-white border-2 border-black rounded-2xl p-3 flex items-center justify-between shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                            <div className="flex items-center space-x-3">
                              <img src={item.image} alt={item.name} className="w-12 h-12 rounded-lg object-cover border border-black" />
                              <div>
                                <h5 className="font-black text-sm uppercase text-black leading-tight">{item.name}</h5>
                                <span className="text-xs font-bold text-neutral-600">₹{item.price} each</span>
                              </div>
                            </div>

                            {/* Quantity Controls */}
                            <div className="flex items-center space-x-2 bg-neutral-100 border border-black rounded-xl p-1">
                              <button 
                                onClick={() => removeFromCart(id)}
                                className="w-6 h-6 rounded-lg bg-amber-400 hover:bg-amber-500 text-black font-black flex items-center justify-center text-xs"
                              >
                                ➖
                              </button>
                              <span className="font-black text-xs min-w-[16px] text-center">{qty}</span>
                              <button 
                                onClick={() => addToCart(id)}
                                className="w-6 h-6 rounded-lg bg-amber-400 hover:bg-amber-500 text-black font-black flex items-center justify-center text-xs"
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
                <div className="p-6 bg-amber-100 border-t-4 border-black space-y-4 shadow-[0_-4px_6px_rgba(0,0,0,0.05)]">
                  {/* Promo Input */}
                  <div className="space-y-1">
                    <label className="block text-[10px] font-black uppercase text-neutral-600">Promo Code</label>
                    <div className="flex space-x-2">
                      <input 
                        type="text" 
                        placeholder="Try BEEFREE15" 
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                        className="flex-1 text-xs font-black uppercase tracking-wider bg-white border-2 border-black rounded-xl p-2 focus:ring-1 focus:ring-amber-500"
                      />
                      <button 
                        onClick={handleApplyPromo}
                        className="bg-black hover:bg-neutral-800 text-amber-400 font-black text-xs px-4 py-2 rounded-xl border-2 border-black"
                      >
                        Apply
                      </button>
                    </div>
                    {promoError && <p className="text-[10px] font-black text-red-600">{promoError}</p>}
                    {appliedPromo && <p className="text-[10px] font-black text-green-700">🎉 Applied: {appliedPromo.code} (15% OFF!)</p>}
                  </div>

                  {/* Calculations breakdown */}
                  <div className="text-xs font-bold space-y-1 text-neutral-700">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span className="font-black text-black">₹{subtotal.toFixed(2)}</span>
                    </div>
                    {appliedPromo && (
                      <div className="flex justify-between text-green-700 font-black">
                        <span>Discount ({appliedPromo.discount * 100}%)</span>
                        <span>-₹{discountAmount.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span>Bee Rider Delivery</span>
                      <span className="font-black text-black">₹{deliveryFee.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>GST (5%)</span>
                      <span className="font-black text-black">₹{taxAmount.toFixed(2)}</span>
                    </div>
                    <div className="border-t border-dashed border-black my-2"></div>
                    <div className="flex justify-between text-base font-black text-black uppercase">
                      <span>Grand Total</span>
                      <span className="bg-amber-400 border-2 border-black px-2 py-0.5 rounded-lg shadow-[1px_1px_0px_rgba(0,0,0,1)]">₹{grandTotal.toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Checkout CTA */}
                  <button
                    onClick={handleCheckout}
                    className="w-full bg-black hover:bg-neutral-800 text-amber-400 font-black uppercase text-sm py-4 rounded-2xl border-4 border-black text-center shadow-[4px_4px_0px_0px_rgba(251,191,36,1)] hover:shadow-[2px_2px_0px_0px_rgba(251,191,36,1)] transform hover:-translate-y-0.5 active:translate-y-0 transition-all"
                  >
                    🚀 Place Buzz Order! (₹{grandTotal.toFixed(2)})
                  </button>
                  <p className="text-[9px] text-center font-black uppercase tracking-wider text-neutral-500">
                    🔒 Sweetened payment gateway checked by Goret Security
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* FOOTER */}
      <footer className="bg-black text-[#FFFEEB] border-t-4 border-black pt-12 pb-6 px-4 sm:px-8">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          {/* Logo Brand Column */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <span className="text-3xl">🐝</span>
              <h4 className="text-xl font-black uppercase text-amber-400">GORET'S CAFE</h4>
            </div>
            <p className="text-xs font-bold text-neutral-400 leading-relaxed">
              We make lives honey-sweetened! Since our founding we have served millions of honeycombs and smiles. Come visit our hive store!
            </p>
            <div className="flex space-x-2 pt-2">
              <span className="w-8 h-8 rounded-lg bg-amber-400 text-black border border-black flex items-center justify-center font-black cursor-pointer hover:bg-amber-500">F</span>
              <span className="w-8 h-8 rounded-lg bg-amber-400 text-black border border-black flex items-center justify-center font-black cursor-pointer hover:bg-amber-500">T</span>
              <span className="w-8 h-8 rounded-lg bg-amber-400 text-black border border-black flex items-center justify-center font-black cursor-pointer hover:bg-amber-500">I</span>
            </div>
          </div>

          {/* Quick Links Column */}
          <div>
            <h5 className="font-black text-amber-400 uppercase tracking-widest text-sm mb-4">🍯 Delicious Links</h5>
            <ul className="text-xs font-bold space-y-2 text-neutral-300">
              <li className="hover:text-amber-400 cursor-pointer" onClick={() => setActiveCategory('Fries')}>🍟 Honey fries menu</li>
              <li className="hover:text-amber-400 cursor-pointer" onClick={() => setActiveCategory('Pizza')}>🍕 Glaze pizza recipes</li>
              <li className="hover:text-amber-400 cursor-pointer" onClick={() => setActiveCategory('Burgers')}>🍔 Thick beef hamburgers</li>
              <li className="hover:text-amber-400 cursor-pointer" onClick={() => setActiveCategory('Desserts')}>🧇 Sweet honeycomb waffles</li>
            </ul>
          </div>

          {/* Opening Hours */}
          <div>
            <h5 className="font-black text-amber-400 uppercase tracking-widest text-sm mb-4">⏰ Hive Hours</h5>
            <ul className="text-xs font-bold space-y-2 text-neutral-300">
              <li>Monday - Friday: <span className="text-amber-400">8:00 AM - 11:00 PM</span></li>
              <li>Saturday - Sunday: <span className="text-amber-400">7:00 AM - Midnight</span></li>
              <li className="text-neutral-500 font-black">🌟 Drone Delivery operates 24/7</li>
            </ul>
          </div>

          {/* Contact Information */}
          <div>
            <h5 className="font-black text-amber-400 uppercase tracking-widest text-sm mb-4">📍 Hive Address</h5>
            <p className="text-xs font-bold text-neutral-300 leading-relaxed">
              🍯 Sweet Nectar Lane, Level 54, Golden Honeycomb Center, City of Bees<br/><br/>
              📞 Hotline: 1800-GORETS-BUZZ<br/>
              📧 Email: hello@goretscafe.buzz
            </p>
          </div>
        </div>

        <div className="border-t border-neutral-800 pt-6 text-center text-[10px] font-bold text-neutral-500 uppercase tracking-widest">
          <p>© {new Date().getFullYear()} GORET'S CAFE. Built with love, premium honey, and strict craftsmanship. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}