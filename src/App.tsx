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
    const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
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
  const [customerName, setCustomerName] = useState('Bee Lover');
  const [customerAddress, setCustomerAddress] = useState('Honeycomb Enclave, Sector 15, HSR Layout, Bengaluru');
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<{ code: string; discount: number } | null>(null); // { code: 'BEEWELCOMED', discount: 0.15 }
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
    { name: 'Queen Bee', email: 'honey@lover.com', password: 'sweetness123', address: 'Royal Hive, Chamber 1, Honeycomb City' }
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
    
    let payText = 'Cash on Delivery';
    if (paymentMethod === 'upi') payText = 'Bumble Pay UPI';
    else if (paymentMethod === 'card') {
      const lastFour = cardDetails.number.replace(/\s+/g, '').slice(-4) || '4242';
      payText = `Sweet Card (*${lastFour})`;
    }
    else if (paymentMethod === 'wallet') payText = 'Bee Wallet Balance';

    setActiveOrder({
      id: `BEE-${Math.floor(10000 + Math.random() * 90000)}-GP`,
      items: Object.entries(cart).map(([id, qty]) => ({ id, qty })),
      subtotal,
      discount: discountAmount,
      deliveryFee,
      tax: taxAmount,
      total: grandTotal,
      promoCode: appliedPromo?.code || null,
      customerName: customerName || 'Bee Lover',
      customerAddress: diningMode === 'dine-in' ? `Table ${tableNumber} (Dine-In)` : (customerAddress || 'Honeycomb Enclave, Sector 15, HSR Layout, Bengaluru'),
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
        { sender: 'system', text: isDineIn ? '🐝 Order received by the kitchen! Getting ready to serve.' : '🐝 Order received by the hive! Preparing wings.', time: timestamp },
        { sender: 'driver', text: isDineIn 
            ? `Bzzzt! Hi! I'm Buster Bee, your server today. I'm heading to Goret's kitchen to collect your order for Table ${tableNum}! 🍽️`
            : "Bzzzt! Hi! I'm Buster Bee, your rider. I'm heading to Goret's Cafe to pick up your order! 🛵", 
          time: timestamp }
      ]);
    } else if (orderStatus === 'preparing') {
      setDriverMessages(prev => [
        ...prev,
        { sender: 'system', text: '🍳 Goret\'s kitchen is buzz-preparing your food!', time: timestamp },
        { sender: 'driver', text: 'Chef Goret is drizzling the fresh organic honey glaze on your food now. Smells so sweet! 🍯', time: timestamp }
      ]);
    } else if (orderStatus === 'delivering') {
      setDriverMessages(prev => [
        ...prev,
        { sender: 'system', text: isDineIn ? `🍽️ Order is on the way! Buster Bee is carrying it to Table ${tableNum}.` : '🛵 Order is out for delivery! Buster Bee is in flight.', time: timestamp },
        { sender: 'driver', text: isDineIn 
            ? `Walking fast to Table ${tableNum}! Watch out, hot and sweet food coming your way! 🏃‍♂️🐝`
            : 'Wings loaded! I\'m airborne now. Flying over the traffic to bring you your feast! 🚀🐝', 
          time: timestamp }
      ]);
    } else if (orderStatus === 'delivered') {
      setDriverMessages(prev => [
        ...prev,
        { sender: 'system', text: isDineIn ? `🎉 Order served to Table ${tableNum}!` : '🎉 Order successfully delivered to your hive!', time: timestamp },
        { sender: 'driver', text: isDineIn 
            ? `Feast served! Enjoy your hot meal at Table ${tableNum}! Let me know if everything tastes amazing. 🍽️💛`
            : 'Package dropped off! Enjoy your sweet meal! Let me know if it tastes amazing. 🐝💛', 
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

        {/* Header Action Buttons (Track Order & Basket) */}
        <div className="flex items-center space-x-3">
          {orderStatus !== 'idle' && currentView === 'menu' && (
            <button
              onClick={() => setCurrentView('tracking')}
              className="bg-black hover:bg-neutral-800 text-amber-400 border-2 border-black px-4 py-3 rounded-2xl flex items-center space-x-2 transition-all transform hover:-translate-y-0.5 active:translate-y-0 shadow-[4px_4px_0px_0px_rgba(251,191,36,1)] border-b-4 hover:shadow-[2px_2px_0px_0px_rgba(251,191,36,1)] animate-bounce"
              title="Track your active honeybee order!"
            >
              <span className="animate-pulse">🛵</span>
              <span className="font-black text-xs uppercase tracking-wider hidden xs:inline">Track Order</span>
            </button>
          )}

          {/* User Sign In / Profile dropdown */}
          {user === null ? (
            <button
              onClick={() => {
                setAuthTab('login');
                setAuthError('');
                setAuthForm({ name: '', email: '', password: '', address: '' });
                setCurrentView('login');
                playBuzzSound('add');
              }}
              className="bg-black hover:bg-neutral-800 text-amber-400 border-2 border-black px-4 py-3 rounded-2xl flex items-center space-x-2 transition-all transform hover:-translate-y-0.5 active:translate-y-0 shadow-[4px_4px_0px_0px_rgba(251,191,36,1)] hover:shadow-[2px_2px_0px_0px_rgba(251,191,36,1)]"
              title="Sign in to Goret's Hive"
            >
              <span>👤</span>
              <span className="font-black text-xs uppercase tracking-wider hidden xs:inline">Sign In</span>
            </button>
          ) : (
            <div className="flex items-center space-x-1.5 bg-black text-white border-2 border-black px-3 py-2.5 rounded-2xl shadow-[4px_4px_0px_0px_rgba(251,191,36,1)]">
              <span className="text-xs">🐝</span>
              <span className="font-black text-xs text-amber-400 uppercase tracking-tight hidden sm:inline select-none">
                {user.name.split(' ')[0]}
              </span>
              <button
                onClick={() => {
                  setUser(null);
                  setCurrentView('menu');
                  playBuzzSound('remove');
                }}
                className="text-[9px] font-black uppercase bg-neutral-900 text-red-400 hover:text-red-500 border border-neutral-800 hover:border-red-500 px-1.5 py-0.5 rounded-lg transition"
                title="Log out of Goret's Hive"
              >
                Out
              </button>
            </div>
          )}

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
        </div>
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

      {currentView === 'login' ? (
        <div className="max-w-md mx-auto my-12 px-4 animate-fade-in">
          {/* Back button */}
          <button
            onClick={() => {
              setCurrentView('menu');
              setAuthError('');
            }}
            className="flex items-center space-x-1.5 text-xs font-black text-amber-800 hover:text-black uppercase mb-4 focus:outline-none"
          >
            <span>←</span> <span>Back to Feast Menu</span>
          </button>

          <div className="bg-white border-4 border-black p-6 sm:p-8 rounded-3xl shadow-[8px_8px_0px_rgba(0,0,0,1)] space-y-6 relative overflow-hidden">
            {/* Top honey drip border decor */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-amber-400 border-b border-black" />
            
            {/* Logo/Bee */}
            <div className="text-center space-y-2">
              <div className="w-16 h-16 rounded-2xl bg-amber-400 border-4 border-black flex items-center justify-center text-3xl font-black mx-auto shadow-[3px_3px_0px_rgba(0,0,0,1)] animate-bounce duration-1000">
                🐝
              </div>
              <h3 className="text-2xl font-black uppercase text-black">Goret's Hive Account</h3>
              <p className="text-xs font-bold text-neutral-500">Sign in to save address, track orders, and collect honey points!</p>
            </div>

            {/* Error message */}
            {authError && (
              <div className="bg-red-100 border-2 border-red-600 text-red-900 rounded-xl p-3 text-xs font-black text-center shadow-[1px_1px_0px_rgba(0,0,0,1)]">
                ⚠️ {authError}
              </div>
            )}

            {/* Tabs */}
            <div className="flex border-2 border-black rounded-2xl overflow-hidden shadow-[3px_3px_0px_rgba(0,0,0,1)]">
              <button
                type="button"
                onClick={() => {
                  setAuthTab('login');
                  setAuthError('');
                }}
                className={`flex-1 py-3 text-xs font-black uppercase tracking-wider transition-colors ${
                  authTab === 'login' ? 'bg-amber-400 text-black' : 'bg-white hover:bg-amber-50 text-neutral-500'
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
                className={`flex-1 py-3 text-xs font-black uppercase tracking-wider transition-colors border-l-2 border-black ${
                  authTab === 'register' ? 'bg-amber-400 text-black' : 'bg-white hover:bg-amber-50 text-neutral-500'
                }`}
              >
                🐝 Create Account
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
                    setAuthError('Oops! Invalid email or password. Try the demo credentials!');
                    playBuzzSound('remove');
                  }
                } else {
                  // Registration logic
                  const name = authForm.name.trim();
                  const address = authForm.address.trim();

                  if (!name || !email || !password || !address) {
                    setAuthError('Please fill out all honeycomb fields!');
                    playBuzzSound('remove');
                    return;
                  }

                  if (accounts.some(acc => acc.email.toLowerCase() === email.toLowerCase())) {
                    setAuthError('Bzzzt! Email is already registered in our hive!');
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
                  <label className="block text-[10px] font-black text-black uppercase mb-1">Bee Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Buzzy McBee"
                    value={authForm.name}
                    onChange={(e) => setAuthForm(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full text-xs font-black bg-[#FFFEEB] border-2 border-black rounded-xl p-3 focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>
              )}

              <div>
                <label className="block text-[10px] font-black text-black uppercase mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="honey@lover.com"
                  value={authForm.email}
                  onChange={(e) => setAuthForm(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full text-xs font-black bg-[#FFFEEB] border-2 border-black rounded-xl p-3 focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black text-black uppercase mb-1">Password</label>
                <div className="relative">
                  <input
                    type={passwordVisible ? 'text' : 'password'}
                    required
                    placeholder="••••••••"
                    value={authForm.password}
                    onChange={(e) => setAuthForm(prev => ({ ...prev, password: e.target.value }))}
                    className="w-full text-xs font-black bg-[#FFFEEB] border-2 border-black rounded-xl p-3 pr-10 focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                  <button
                    type="button"
                    onClick={() => setPasswordVisible(!passwordVisible)}
                    className="absolute right-3 top-3 text-neutral-600 focus:outline-none text-sm"
                  >
                    {passwordVisible ? '👁️' : '🙈'}
                  </button>
                </div>
              </div>

              {authTab === 'register' && (
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-[10px] font-black text-black uppercase">Delivery Address (Hive)</label>
                    <button
                      type="button"
                      onClick={() => {
                        const addresses = [
                          'Hive 42, Sweet Nectar Street, Sector 3, HSR Layout, Bengaluru',
                          'Honeycomb Duplex, Sector 15, HSR Layout, Bengaluru',
                          'Flower Garden Enclave, Level 4, Bengaluru',
                          'Royal Queen Hive Palace, Chamber 7, Bengaluru'
                        ];
                        const randomAddress = addresses[Math.floor(Math.random() * addresses.length)];
                        setAuthForm(prev => ({ ...prev, address: randomAddress }));
                        playBuzzSound('add');
                        alert("Mock GPS located your hive! 🛰️🐝");
                      }}
                      className="text-[9px] font-black text-amber-700 hover:text-black uppercase focus:outline-none"
                    >
                      📍 Locate Hive (GPS)
                    </button>
                  </div>
                  <input
                    type="text"
                    required
                    placeholder="Enter your hive address..."
                    value={authForm.address}
                    onChange={(e) => setAuthForm(prev => ({ ...prev, address: e.target.value }))}
                    className="w-full text-xs font-black bg-[#FFFEEB] border-2 border-black rounded-xl p-3 focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-black hover:bg-neutral-800 text-amber-400 font-black uppercase text-sm py-3.5 rounded-2xl border-4 border-black text-center shadow-[4px_4px_0px_rgba(251,191,36,1)] hover:shadow-[2px_2px_0px_rgba(251,191,36,1)] transform hover:-translate-y-0.5 active:translate-y-0 transition-all mt-4"
              >
                {authTab === 'login' ? '🚀 Log In to Hive' : '🐝 Register New Bee'}
              </button>
            </form>

            {/* Quick Test Credentials Box */}
            {authTab === 'login' && (
              <div 
                onClick={() => {
                  setAuthForm({ name: '', email: 'honey@lover.com', password: 'sweetness123', address: '' });
                  setAuthError('');
                  playBuzzSound('add');
                }}
                className="bg-amber-50 border-2 border-dashed border-amber-600 rounded-2xl p-3.5 cursor-pointer hover:bg-amber-100 transition-colors shadow-[2px_2px_0px_rgba(0,0,0,1)]"
              >
                <div className="flex items-center space-x-2 text-[10px] font-black text-amber-800 uppercase">
                  <span>💡</span>
                  <span>Demo Hive Credentials (Click to fill)</span>
                </div>
                <div className="text-[11px] font-mono mt-1 text-neutral-700">
                  <p>Email: <span className="font-black text-black">honey@lover.com</span></p>
                  <p>Pass: <span className="font-black text-black">sweetness123</span></p>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : currentView === 'tracking' && activeOrder ? (
        <div className="max-w-7xl mx-auto px-4 py-8 sm:px-8 space-y-8 animate-fade-in">
          {/* Tracking Page Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white border-4 border-black p-6 rounded-3xl shadow-[6px_6px_0px_rgba(0,0,0,1)] gap-4">
            <div>
              <div className="flex items-center space-x-2 text-xs font-black text-amber-600 uppercase tracking-widest">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                </span>
                <span>{activeOrder.diningMode === 'dine-in' ? 'Active Table Radar' : 'Active Delivery Radar'}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black uppercase text-black mt-1">
                Track Order: <span className="text-amber-600 font-mono">{activeOrder.id}</span>
              </h2>
              <p className="text-xs font-bold text-neutral-500">Placed on today at {activeOrder.timestamp}</p>
            </div>
            
            <button
              onClick={() => setCurrentView('menu')}
              className="bg-black hover:bg-neutral-800 text-amber-400 font-black uppercase text-xs px-5 py-3 rounded-2xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(251,191,36,1)] hover:shadow-[2px_2px_0px_0px_rgba(251,191,36,1)] transform hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center space-x-2"
            >
              <span>←</span>
              <span>Back to Feast Menu</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            
            {/* LEFT / CENTER: STATUS, STEPPER, MAP, CHAT */}
            <div className="lg:col-span-2 space-y-8">
              
              {/* STATUS CARD */}
              <div className="bg-amber-400 border-4 border-black p-6 rounded-3xl shadow-[6px_6px_0px_rgba(0,0,0,1)] relative overflow-hidden">
                <div className="absolute top-3 right-5 text-6xl opacity-20 select-none animate-pulse">🍯</div>
                
                <h3 className="text-xs font-black uppercase tracking-wider text-black opacity-75">
                  {activeOrder.diningMode === 'dine-in' ? 'Current Table Service Phase' : 'Current Delivery Phase'}
                </h3>
                <h2 className="text-2xl sm:text-3xl font-black uppercase text-black mt-1">
                  {orderStatus === 'placed' && (activeOrder.diningMode === 'dine-in' ? '🐝 Table order received!' : '🐝 Preparing to fly...')}
                  {orderStatus === 'preparing' && '🍳 Honey-glazing your order...'}
                  {orderStatus === 'delivering' && (activeOrder.diningMode === 'dine-in' ? '🏃‍♂️ Waiter bringing it to your table!' : '🛵 Swooping down your lane!')}
                  {orderStatus === 'delivered' && (activeOrder.diningMode === 'dine-in' ? '🎉 Served at Table!' : '🎉 Sweetness delivered!')}
                </h2>
                
                <div className="mt-4 flex items-center space-x-2">
                  <div className="bg-black text-amber-400 text-xs font-black uppercase tracking-widest px-3 py-1.5 rounded-lg border border-black shadow-[1px_1px_0px_rgba(255,255,255,0.2)]">
                    {orderStatus === 'placed' && (activeOrder.diningMode === 'dine-in' ? 'ETA: 15 mins' : 'ETA: 25 mins')}
                    {orderStatus === 'preparing' && (activeOrder.diningMode === 'dine-in' ? 'ETA: 8 mins' : 'ETA: 18 mins')}
                    {orderStatus === 'delivering' && (activeOrder.diningMode === 'dine-in' ? 'ETA: 2 mins' : 'ETA: 8 mins')}
                    {orderStatus === 'delivered' && 'Served!'}
                  </div>
                  <span className="text-xs font-bold text-neutral-800">
                    {orderStatus === 'placed' && 'Waiting for kitchen to fire up the stoves.'}
                    {orderStatus === 'preparing' && (activeOrder.diningMode === 'dine-in' ? 'Our chefs are preparing your dine-in meal.' : 'Our chefs are applying fresh organic honeycombs.')}
                    {orderStatus === 'delivering' && (activeOrder.diningMode === 'dine-in' ? `Buster Bee is bringing your food to Table ${activeOrder.tableNumber}.` : 'Buster Bee is airborne via Vespa flight path.')}
                    {orderStatus === 'delivered' && (activeOrder.diningMode === 'dine-in' ? `Delicious hot food served at Table ${activeOrder.tableNumber}.` : 'Delicious hot food dropped at your address.')}
                  </span>
                </div>

                {/* Progress bar */}
                <div className="mt-6 w-full bg-neutral-900 border-2 border-black h-4 rounded-full overflow-hidden relative shadow-[inset_1px_1px_3px_rgba(0,0,0,0.5)]">
                  <div 
                    className="h-full bg-yellow-300 transition-all duration-1000"
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
              <div className="bg-white border-4 border-black p-6 rounded-3xl shadow-[6px_6px_0px_rgba(0,0,0,1)]">
                <h4 className="font-black text-sm uppercase text-neutral-800 tracking-wider mb-6 flex items-center space-x-1.5">
                  <span>📝</span> <span>Tracking Steps</span>
                </h4>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 relative">
                  {/* Step 1 */}
                  <div className="flex flex-col items-center text-center p-3 rounded-2xl border-2 border-black bg-amber-50 shadow-[2px_2px_0px_rgba(0,0,0,1)]">
                    <span className="text-2xl">📝</span>
                    <span className="font-black text-xs uppercase mt-2">Order Confirmed</span>
                    <span className="text-[10px] text-green-700 font-bold mt-1">✓ Completed</span>
                  </div>

                  {/* Step 2 */}
                  <div className={`flex flex-col items-center text-center p-3 rounded-2xl border-2 border-black transition-all shadow-[2px_2px_0px_rgba(0,0,0,1)] ${
                    orderStatus !== 'placed' ? 'bg-amber-50 border-black' : 'bg-neutral-50 border-neutral-300 opacity-60'
                  }`}>
                    <span className="text-2xl">🍳</span>
                    <span className="font-black text-xs uppercase mt-2">Glazing Kitchen</span>
                    <span className={`text-[10px] font-bold mt-1 ${
                      orderStatus === 'placed' ? 'text-neutral-500' :
                      orderStatus === 'preparing' ? 'text-amber-700 animate-pulse font-black' : 'text-green-700'
                    }`}>
                      {orderStatus === 'placed' && 'Pending'}
                      {orderStatus === 'preparing' && 'In Progress...'}
                      {orderStatus !== 'placed' && orderStatus !== 'preparing' && '✓ Baked'}
                    </span>
                  </div>

                  {/* Step 3 */}
                  <div className={`flex flex-col items-center text-center p-3 rounded-2xl border-2 border-black transition-all shadow-[2px_2px_0px_rgba(0,0,0,1)] ${
                    orderStatus === 'delivering' || orderStatus === 'delivered' ? 'bg-amber-50 border-black' : 'bg-neutral-50 border-neutral-300 opacity-60'
                  }`}>
                    <span className="text-2xl">{activeOrder.diningMode === 'dine-in' ? '🍽️' : '🛵'}</span>
                    <span className="font-black text-xs uppercase mt-2">
                      {activeOrder.diningMode === 'dine-in' ? 'Table Delivery' : 'Bumble Flight'}
                    </span>
                    <span className={`text-[10px] font-bold mt-1 ${
                      orderStatus === 'placed' || orderStatus === 'preparing' ? 'text-neutral-500' :
                      orderStatus === 'delivering' ? 'text-amber-700 animate-pulse font-black' : 'text-green-700'
                    }`}>
                      {orderStatus === 'placed' || orderStatus === 'preparing' ? 'Waiting' :
                       orderStatus === 'delivering' ? (activeOrder.diningMode === 'dine-in' ? 'On the Way!' : 'Airborne!') : '✓ Arrived'}
                    </span>
                  </div>

                  {/* Step 4 */}
                  <div className={`flex flex-col items-center text-center p-3 rounded-2xl border-2 border-black transition-all shadow-[2px_2px_0px_rgba(0,0,0,1)] ${
                    orderStatus === 'delivered' ? 'bg-green-100 border-green-700' : 'bg-neutral-50 border-neutral-300 opacity-60'
                  }`}>
                    <span className="text-2xl">{activeOrder.diningMode === 'dine-in' ? '🎉' : '🍔'}</span>
                    <span className="font-black text-xs uppercase mt-2">
                      {activeOrder.diningMode === 'dine-in' ? 'Served at Table' : 'Hive Dropoff'}
                    </span>
                    <span className={`text-[10px] font-bold mt-1 ${orderStatus === 'delivered' ? 'text-green-700 font-black' : 'text-neutral-500'}`}>
                      {orderStatus === 'delivered' ? (activeOrder.diningMode === 'dine-in' ? 'Served' : 'Delivered') : 'Pending'}
                    </span>
                  </div>
                </div>
              </div>

              {/* MAP CARD */}
              <div className="bg-white border-4 border-black p-6 rounded-3xl shadow-[6px_6px_0px_rgba(0,0,0,1)] relative overflow-hidden">
                <h4 className="font-black text-sm uppercase text-neutral-800 tracking-wider mb-4 flex items-center space-x-1.5">
                  <span>📍</span> <span>{activeOrder.diningMode === 'dine-in' ? 'Cafe Floor Plan Map' : 'Bee-GPS Flight Path'}</span>
                </h4>
                
                <div className="relative">
                  {activeOrder.diningMode === 'dine-in' ? (
                    <svg viewBox="0 0 400 200" className="w-full h-56 bg-amber-50 border-4 border-black rounded-2xl relative overflow-hidden">
                      <defs>
                        <pattern id="cafeGrid" width="20" height="20" patternUnits="userSpaceOnUse">
                          <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#fde047" strokeWidth="0.75" />
                        </pattern>
                      </defs>
                      <rect width="100%" height="100%" fill="url(#cafeGrid)" />
                      
                      {/* Kitchen / Counter area */}
                      <g transform="translate(10, 10)">
                        <rect width="380" height="35" rx="8" fill="black" />
                        <rect width="376" height="31" x="2" y="2" rx="6" fill="#facc15" stroke="black" strokeWidth="1" />
                        <text x="190" y="22" textAnchor="middle" fontSize="11" fontWeight="900" fill="black" className="uppercase font-sans tracking-wider">
                          🍳 GORET'S KITCHEN & COUNTER 🍯
                        </text>
                      </g>

                      {/* Path to table */}
                      {(() => {
                        const tableNum = activeOrder.tableNumber || '1';
                        const targetCoords = TABLE_COORDINATES[tableNum] || TABLE_COORDINATES['1'];
                        return (
                          <>
                            <path d={`M 200,45 L ${targetCoords.x},${targetCoords.y}`} fill="none" stroke="black" strokeWidth="6" strokeLinecap="round" />
                            <path d={`M 200,45 L ${targetCoords.x},${targetCoords.y}`} fill="none" stroke="#facc15" strokeWidth="2" strokeDasharray="6 3" strokeLinecap="round" />
                          </>
                        );
                      })()}

                      {/* Render All Tables */}
                      {Object.entries(TABLE_COORDINATES).map(([num, coords]) => {
                        const isSelected = activeOrder.tableNumber === num;
                        return (
                          <g key={num} transform={`translate(${coords.x}, ${coords.y})`}>
                            {/* Chairs around table */}
                            <circle cx="-16" cy="0" r="4" fill="black" />
                            <circle cx="16" cy="0" r="4" fill="black" />
                            <circle cx="0" cy="-16" r="4" fill="black" />
                            <circle cx="0" cy="16" r="4" fill="black" />
                            
                            {/* Table itself */}
                            <circle r="12" fill="black" />
                            <circle r="10" fill={isSelected ? '#22c55e' : '#ffffff'} stroke="black" strokeWidth="1.5" />
                            <text x="0" y="3.5" textAnchor="middle" fontSize="8" fontWeight="bold" fill="black">
                              {num}
                            </text>
                          </g>
                        );
                      })}

                      {/* Labels */}
                      <text x="200" y="70" textAnchor="middle" fontSize="8" fontWeight="black" fill="black" className="uppercase font-sans opacity-45">Seating Area</text>
                      
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
                            <circle r="18" fill="#fde047" opacity="0.5" className="animate-ping" />
                            <circle r="12" fill="black" />
                            <circle r="10" fill="#facc15" stroke="black" strokeWidth="1.5" />
                            <text x="-7" y="4" fontSize="11">🐝</text>
                          </g>
                        );
                      })()}
                    </svg>
                  ) : (
                    <svg viewBox="0 0 400 200" className="w-full h-56 bg-amber-50 border-4 border-black rounded-2xl relative overflow-hidden">
                      <defs>
                        <pattern id="mapGrid" width="20" height="20" patternUnits="userSpaceOnUse">
                          <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#fde047" strokeWidth="0.75" />
                        </pattern>
                      </defs>
                      <rect width="100%" height="100%" fill="url(#mapGrid)" />
                      
                      {/* Roads/Flight Paths */}
                      <path d="M 0,40 L 400,40 M 0,120 L 400,120 M 0,160 L 400,160 M 120,0 L 120,200 M 280,0 L 280,200" stroke="#fef08a" strokeWidth="4" />
                      
                      {/* Route Line */}
                      <path d="M 40,40 L 120,40 L 120,120 L 280,120 L 280,160 L 360,160" fill="none" stroke="black" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M 40,40 L 120,40 L 120,120 L 280,120 L 280,160 L 360,160" fill="none" stroke="#eab308" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="8 4" />
                      
                      {/* Cafe Node */}
                      <g transform="translate(40,40)">
                        <circle r="16" fill="black" />
                        <circle r="13" fill="#facc15" stroke="black" strokeWidth="2" />
                        <text x="-9" y="5" fontSize="13">🍯</text>
                      </g>
                      
                      {/* Home Node */}
                      <g transform="translate(360,160)">
                        <circle r="16" fill="black" />
                        <circle r="13" fill="#22c55e" stroke="black" strokeWidth="2" />
                        <text x="-9" y="5" fontSize="13">🏠</text>
                      </g>
                      
                      {/* Labels */}
                      <text x="64" y="32" fontSize="9" fontWeight="black" fill="black" className="uppercase font-sans">Goret's Cafe</text>
                      <text x="312" y="190" fontSize="9" fontWeight="black" fill="black" className="uppercase font-sans">Your Hive</text>
                      
                      {/* Moving Bee Rider */}
                      {(() => {
                        const coords = getBeeCoordinates(mapProgress);
                        return (
                          <g transform={`translate(${coords.x},${coords.y})`} className="transition-transform duration-500 ease-out">
                            <circle r="18" fill="#fde047" opacity="0.5" className="animate-ping" />
                            <circle r="12" fill="black" />
                            <circle r="10" fill="#facc15" stroke="black" strokeWidth="1.5" />
                            <text x="-7" y="4" fontSize="11">🐝</text>
                          </g>
                        );
                      })()}
                    </svg>
                  )}
                  
                  {/* Status Overlay */}
                  <div className="absolute bottom-3 left-3 bg-black text-amber-400 text-[10px] font-mono px-3 py-1 rounded-lg border-2 border-black shadow-[2px_2px_0px_rgba(255,255,255,0.2)]">
                    ⚡ STATUS: {orderStatus === 'delivering' ? (activeOrder.diningMode === 'dine-in' ? 'SERVING RUN' : 'AIRBORNE WINGS') : orderStatus === 'delivered' ? (activeOrder.diningMode === 'dine-in' ? 'SERVED' : 'LANDED') : 'DOCKING'}
                  </div>
                </div>
              </div>

              {/* RIDER PROFILE & CHAT CARD */}
              <div className="bg-white border-4 border-black p-6 rounded-3xl shadow-[6px_6px_0px_rgba(0,0,0,1)]">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between pb-6 border-b-2 border-dashed border-neutral-300 gap-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 rounded-full bg-amber-400 border-4 border-black flex items-center justify-center text-3xl font-black shadow-[2px_2px_0px_rgba(0,0,0,1)]">
                      {activeOrder.diningMode === 'dine-in' ? '🏃‍♂️' : '🐝'}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h4 className="font-black text-lg uppercase text-black leading-none">
                          {activeOrder.diningMode === 'dine-in' ? 'Buster Bee (Server)' : 'Buster Bee'}
                        </h4>
                        <span className="bg-amber-100 border border-amber-600 text-amber-800 text-[10px] font-black px-1.5 py-0.5 rounded">
                          ⭐ 4.9 Rating
                        </span>
                      </div>
                      <p className="text-xs text-neutral-500 font-bold mt-1">
                        {activeOrder.diningMode === 'dine-in' ? 'Serving you with lightning speed' : 'Gliding on high-speed golden wind currents'}
                      </p>
                      <p className="text-[10px] text-amber-600 font-black uppercase mt-1">
                        {activeOrder.diningMode === 'dine-in' ? '⚡ Server ID: #SERVER-8293' : '⚡ Drone Flyer ID: #WINGS-8293'}
                      </p>
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => {
                      playBuzzSound('add');
                      if (activeOrder.diningMode === 'dine-in') {
                        alert("Bzzzt! Sent a honey-buzz alert to Buster Bee's pager! 📳🐝");
                      } else {
                        alert("Bzzzt! Sent a honey-buzz alert to Buster Bee's receiver wings! 🐝");
                      }
                    }}
                    className="w-full md:w-auto bg-amber-400 hover:bg-black hover:text-amber-400 text-black font-black uppercase text-xs px-6 py-3 rounded-2xl border-2 border-black shadow-[3px_3px_0px_rgba(0,0,0,1)] active:translate-y-0.5 transition-all flex items-center justify-center space-x-2"
                  >
                    <span>⚡</span> <span>Buzz {activeOrder.diningMode === 'dine-in' ? 'Server' : 'Rider'}</span>
                  </button>
                </div>

                {/* DRIVER CHAT */}
                <div className="mt-6 space-y-4">
                  <h5 className="font-black text-xs uppercase text-neutral-500 tracking-wider">
                    {activeOrder.diningMode === 'dine-in' ? '💬 Hive Chat with Server' : '💬 Hive Chat with Rider'}
                  </h5>
                  
                  <div className="bg-[#FFFEEB] border-2 border-black rounded-2xl p-4 h-48 overflow-y-auto space-y-3 flex flex-col scrollbar-none">
                    {driverMessages.length === 0 ? (
                      <p className="text-center text-xs text-neutral-400 italic my-auto font-bold">No messages yet. Send Buster a message!</p>
                    ) : (
                      driverMessages.map((msg, idx) => {
                        if (msg.sender === 'system') {
                          return (
                            <div key={idx} className="self-center bg-amber-100 border border-amber-300 text-[10px] text-amber-800 font-black uppercase px-2.5 py-0.5 rounded-full my-1">
                              {msg.text}
                            </div>
                          );
                        }
                        const isUser = msg.sender === 'user';
                        return (
                          <div key={idx} className={`max-w-[80%] rounded-2xl p-3 text-xs font-bold border-2 border-black shadow-[2px_2px_0px_rgba(0,0,0,0.15)] ${
                            isUser ? 'self-end bg-black text-white' : 'self-start bg-white text-black'
                          }`}>
                            <div className="flex justify-between items-center text-[8px] opacity-75 mb-1 gap-2">
                              <span>{isUser ? 'YOU' : (activeOrder.diningMode === 'dine-in' ? 'BUSTER (SERVER)' : 'BUSTER BEE')}</span>
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
                              ? `Bzzzt! Understood, Goret Lover! I'm coming to Table ${activeOrder.tableNumber} right away! 🍽️`
                              : "Bzzzt! Understood, Goret Lover! I'm flapping my wings! 🐝";
                            const lower = msg.toLowerCase();
                            if (lower.includes('fast') || lower.includes('hurry') || lower.includes('quick') || lower.includes('speed')) {
                              reply = activeOrder.diningMode === 'dine-in'
                                ? `Bzzzt! Speeding up your order preparation! Walking fast to Table ${activeOrder.tableNumber}! 🏃‍♂️🐝`
                                : "Bzzzt! Triggered turbo boosters. Flying over the streets now! 🚀🐝";
                            } else if (lower.includes('napkin') || lower.includes('sauce') || lower.includes('extra')) {
                              reply = activeOrder.diningMode === 'dine-in'
                                ? `Bzzzt! Got it, I'll bring extra napkins/sauces to Table ${activeOrder.tableNumber}! 🍯`
                                : "Bzzzt! Got it, I'll make sure the kitchen packs extra napkins/sauces for your feast! 🍯";
                            } else if (lower.includes('thank') || lower.includes('thanks')) {
                              reply = "Bzzzt! You are very welcome! Delivering sweetness is my specialty! 💛";
                            }
                            
                            setDriverMessages(prev => [...prev, { sender: 'driver', text: reply, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
                            playBuzzSound('add');
                          }, 1000);
                        }
                      }}
                      placeholder={activeOrder.diningMode === 'dine-in' ? "Type message to Buster & press Enter (e.g. 'extra napkins please')..." : "Type message to Buster & press Enter (e.g. 'extra napkins please')..."}
                      className="flex-1 text-xs font-bold bg-[#FFFEEB] border-2 border-black rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-amber-500"
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
                            ? `Bzzzt! Understood, Goret Lover! I'm coming to Table ${activeOrder.tableNumber} right away! 🍽️`
                            : "Bzzzt! Understood, Goret Lover! I'm flapping my wings! 🐝";
                          const lower = msg.toLowerCase();
                          if (lower.includes('fast') || lower.includes('hurry') || lower.includes('quick') || lower.includes('speed')) {
                            reply = activeOrder.diningMode === 'dine-in'
                              ? `Bzzzt! Speeding up your order preparation! Walking fast to Table ${activeOrder.tableNumber}! 🏃‍♂️🐝`
                              : "Bzzzt! Triggered turbo boosters. Flying over the streets now! 🚀🐝";
                          } else if (lower.includes('napkin') || lower.includes('sauce') || lower.includes('extra')) {
                            reply = activeOrder.diningMode === 'dine-in'
                              ? `Bzzzt! Got it, I'll bring extra napkins/sauces to Table ${activeOrder.tableNumber}! 🍯`
                              : "Bzzzt! Got it, I'll make sure the kitchen packs extra napkins/sauces for your feast! 🍯";
                          } else if (lower.includes('thank') || lower.includes('thanks')) {
                            reply = "Bzzzt! You are very welcome! Delivering sweetness is my specialty! 💛";
                          }
                          
                          setDriverMessages(prev => [...prev, { sender: 'driver', text: reply, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
                          playBuzzSound('add');
                        }, 1000);
                      }}
                      className="bg-black hover:bg-neutral-800 text-amber-400 font-black uppercase text-xs px-6 py-3 rounded-xl border-2 border-black shadow-[2px_2px_0px_rgba(0,0,0,1)]"
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
              <div className="bg-white border-4 border-black p-6 rounded-3xl shadow-[6px_6px_0px_rgba(0,0,0,1)] relative">
                <div className="absolute top-0 left-0 right-0 h-1 bg-[repeating-linear-gradient(90deg,transparent,transparent_8px,black_8px,black_16px)]" />
                
                <div className="text-center pb-4 border-b-2 border-dashed border-black pt-2">
                  <span className="text-3xl">🍯</span>
                  <h4 className="font-black text-lg uppercase text-black mt-2">Goret's Invoice</h4>
                  <p className="text-[10px] font-mono tracking-widest text-neutral-500">OFFICIAL HIVE RECEIPT</p>
                </div>

                <div className="py-4 space-y-3 text-xs font-bold text-neutral-700">
                  <div className="flex justify-between">
                    <span>Order Reference</span>
                    <span className="font-black text-black font-mono">{activeOrder.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Payment Method</span>
                    <span className="font-black text-black uppercase">{activeOrder.paymentMethod}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Deliver To</span>
                    <span className="font-black text-black">{activeOrder.customerName}</span>
                  </div>
                  <div className="flex flex-col space-y-1 pt-1">
                    <span className="text-[10px] text-neutral-500 font-black uppercase">Hive Address</span>
                    <span className="text-black leading-snug">{activeOrder.customerAddress}</span>
                  </div>
                </div>

                <div className="border-t border-dashed border-black py-4">
                  <h5 className="font-black text-xs uppercase text-neutral-500 tracking-wider mb-2">Items Ordered</h5>
                  
                  <div className="space-y-2">
                    {activeOrder.items.map((itemObj) => {
                      const item = MENU_ITEMS.find(m => m.id === itemObj.id);
                      if (!item) return null;
                      return (
                        <div key={itemObj.id} className="flex justify-between items-center text-xs">
                          <div>
                            <span className="font-black text-black">{item.name}</span>
                            <span className="text-neutral-500 font-bold ml-1.5">x{itemObj.qty}</span>
                          </div>
                          <span className="font-black text-black">₹{(item.price * itemObj.qty).toFixed(2)}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="border-t border-dashed border-black pt-4 space-y-2 text-xs font-bold text-neutral-700">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-black text-black">₹{activeOrder.subtotal.toFixed(2)}</span>
                  </div>
                  {activeOrder.discount > 0 && (
                    <div className="flex justify-between text-green-700 font-black">
                      <span>Discount ({activeOrder.promoCode})</span>
                      <span>-₹{activeOrder.discount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Bee Rider Delivery</span>
                    <span className="font-black text-black">₹{activeOrder.deliveryFee.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>GST (5%)</span>
                    <span className="font-black text-black">₹{activeOrder.tax.toFixed(2)}</span>
                  </div>
                  <div className="border-t-2 border-black pt-2 flex justify-between text-sm font-black text-black uppercase">
                    <span>Total Paid</span>
                    <span className="bg-amber-400 border-2 border-black px-2 py-0.5 rounded-lg shadow-[1px_1px_0px_rgba(0,0,0,1)]">
                      ₹{activeOrder.total.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Receipt Barcode mockup */}
                <div className="mt-6 flex flex-col items-center justify-center opacity-60">
                  <div className="h-8 w-44 bg-[repeating-linear-gradient(90deg,black,black_2px,transparent_2px,transparent_6px,black_6px,black_10px,transparent_10px,transparent_12px)] border-x border-black" />
                  <span className="text-[8px] font-mono tracking-widest mt-1">*{activeOrder.id}*</span>
                </div>
              </div>

              {/* ORDER ACTIONS */}
              <div className="space-y-3">
                {/* Cancel Order (Only if not delivered/delivering) */}
                {(orderStatus === 'placed' || orderStatus === 'preparing') && (
                  <button
                    onClick={() => {
                      if (confirm("Are you sure you want to cancel your honeybee feast order? 😢")) {
                        handleResetOrder();
                      }
                    }}
                    className="w-full bg-red-500 hover:bg-red-600 text-white font-black uppercase text-xs py-4 rounded-2xl border-4 border-black text-center shadow-[4px_4px_0px_rgba(0,0,0,1)] active:translate-y-0.5 transition-all"
                  >
                    🚫 Cancel & Void Order
                  </button>
                )}

                {/* Reset order (Only if delivered) */}
                {orderStatus === 'delivered' && (
                  <button
                    onClick={handleResetOrder}
                    className="w-full bg-green-500 hover:bg-green-600 text-white font-black uppercase text-xs py-4 rounded-2xl border-4 border-black text-center shadow-[4px_4px_0px_rgba(0,0,0,1)] active:translate-y-0.5 transition-all"
                  >
                    🐝 Order Something Else 🍯
                  </button>
                )}
                
                {/* Active Support Card */}
                <div className="bg-[#FFFEEB] border-4 border-black p-4 rounded-3xl text-center space-y-1 shadow-[4px_4px_0px_rgba(0,0,0,1)]">
                  <h5 className="font-black text-xs uppercase text-neutral-800">Support Hotline</h5>
                  <p className="text-[10px] font-bold text-neutral-500">Need help? Dial 1800-GORETS-BUZZ</p>
                </div>
              </div>

            </div>
          </div>
        </div>
      ) : (
        <>
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
                      <span>{catHeader}</span>
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
                          <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-amber-55 border-b-4 border-black">
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
                                const target = e.target as HTMLImageElement;
                                target.onerror = null;
                                target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80';
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

                            {/* ADD TO CART SECTION */}
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
                ) : checkoutStep === 'payment' ? (
                  <div className="space-y-4">
                    {/* Back Button */}
                    <button 
                      onClick={() => setCheckoutStep('cart')}
                      className="flex items-center space-x-1.5 text-xs font-black text-amber-800 hover:text-black uppercase focus:outline-none"
                    >
                      <span>←</span> <span>Back to Basket</span>
                    </button>

                    <div className="bg-amber-100 border-2 border-black p-4 rounded-2xl text-center space-y-1 shadow-[2px_2px_0px_rgba(0,0,0,1)]">
                      <span className="text-xs font-bold text-neutral-600 uppercase">Amount to Pay</span>
                      <h4 className="text-2xl font-black text-black">₹{grandTotal.toFixed(2)}</h4>
                    </div>

                    <div className="space-y-3">
                      <h4 className="font-black text-xs uppercase text-neutral-500 tracking-wider">Choose Payment Method</h4>
                      
                      {/* UPI Option */}
                      <div 
                        onClick={() => setPaymentMethod('upi')}
                        className={`p-3 rounded-2xl border-2 border-black cursor-pointer transition-all ${
                          paymentMethod === 'upi' ? 'bg-amber-300 shadow-[3px_3px_0px_rgba(0,0,0,1)] -translate-y-0.5' : 'bg-white hover:bg-amber-50 shadow-[1px_1px_0px_rgba(0,0,0,1)]'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <span className="text-xl">⚡</span>
                            <div>
                              <h5 className="font-black text-sm uppercase leading-tight">Bumble Pay UPI</h5>
                              <p className="text-[10px] text-neutral-500 font-bold">Google Pay, PhonePe, Paytm</p>
                            </div>
                          </div>
                          <input type="radio" checked={paymentMethod === 'upi'} readOnly className="accent-black" />
                        </div>
                        {paymentMethod === 'upi' && (
                          <div className="mt-3 pt-3 border-t border-dashed border-black space-y-2" onClick={(e) => e.stopPropagation()}>
                            <div className="flex gap-2">
                              {['GPay', 'PhonePe', 'Paytm'].map((app) => (
                                <button key={app} type="button" className="flex-1 bg-white hover:bg-amber-100 border border-black rounded-lg py-1 text-xs font-black">
                                  {app}
                                </button>
                              ))}
                            </div>
                            <input 
                              type="text" 
                              placeholder="Enter UPI ID (e.g. goret@okaxis)" 
                              className="w-full text-xs font-black bg-white border border-black rounded-lg p-2 focus:ring-1 focus:ring-amber-500"
                            />
                          </div>
                        )}
                      </div>

                      {/* Card Option */}
                      <div 
                        onClick={() => setPaymentMethod('card')}
                        className={`p-3 rounded-2xl border-2 border-black cursor-pointer transition-all ${
                          paymentMethod === 'card' ? 'bg-amber-300 shadow-[3px_3px_0px_rgba(0,0,0,1)] -translate-y-0.5' : 'bg-white hover:bg-amber-50 shadow-[1px_1px_0px_rgba(0,0,0,1)]'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <span className="text-xl">💳</span>
                            <div>
                              <h5 className="font-black text-sm uppercase leading-tight">Sweet Card</h5>
                              <p className="text-[10px] text-neutral-500 font-bold">Credit or Debit Card</p>
                            </div>
                          </div>
                          <input type="radio" checked={paymentMethod === 'card'} readOnly className="accent-black" />
                        </div>
                        {paymentMethod === 'card' && (
                          <div className="mt-3 pt-3 border-t border-dashed border-black space-y-3" onClick={(e) => e.stopPropagation()}>
                            
                            {/* Card Mockup */}
                            <div className="bg-gradient-to-r from-amber-500 to-yellow-600 border-2 border-black rounded-xl p-3 text-white shadow-[2px_2px_0px_rgba(0,0,0,1)] relative overflow-hidden">
                              <div className="absolute right-2 top-2 text-2xl opacity-20 font-black font-mono">BEE CARD</div>
                              <div className="text-[9px] font-black tracking-widest uppercase">GORET GOLD CARD</div>
                              <div className="text-sm font-mono tracking-widest my-3">
                                {cardDetails.number || '•••• •••• •••• ••••'}
                              </div>
                              <div className="flex justify-between items-center text-[10px] font-mono">
                                <div>
                                  <span className="text-[7px] block opacity-75">CARDHOLDER</span>
                                  <span>BEE LOVER</span>
                                </div>
                                <div className="text-right">
                                  <span className="text-[7px] block opacity-75">EXPIRES</span>
                                  <span>{cardDetails.expiry || 'MM/YY'}</span>
                                </div>
                              </div>
                            </div>

                            <div className="space-y-2">
                              <div>
                                <label className="block text-[9px] font-black text-black uppercase">Card Number</label>
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
                                  className="w-full text-xs font-black bg-white border border-black rounded-lg p-2 focus:ring-1 focus:ring-amber-500"
                                />
                              </div>
                              <div className="flex gap-2">
                                <div className="flex-1">
                                  <label className="block text-[9px] font-black text-black uppercase">Expiry</label>
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
                                    className="w-full text-xs font-black bg-white border border-black rounded-lg p-2 focus:ring-1 focus:ring-amber-500"
                                  />
                                </div>
                                <div className="flex-1">
                                  <label className="block text-[9px] font-black text-black uppercase">CVV</label>
                                  <input 
                                    type="password" 
                                    placeholder="•••" 
                                    value={cardDetails.cvv}
                                    onChange={(e) => {
                                      let v = e.target.value.replace(/\D/g, '');
                                      if (v.length > 3) v = v.slice(0, 3);
                                      setCardDetails(prev => ({ ...prev, cvv: v }));
                                    }}
                                    className="w-full text-xs font-black bg-white border border-black rounded-lg p-2 focus:ring-1 focus:ring-amber-500"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Bee Wallet Option */}
                      <div 
                        onClick={() => setPaymentMethod('wallet')}
                        className={`p-3 rounded-2xl border-2 border-black cursor-pointer transition-all ${
                          paymentMethod === 'wallet' ? 'bg-amber-300 shadow-[3px_3px_0px_rgba(0,0,0,1)] -translate-y-0.5' : 'bg-white hover:bg-amber-50 shadow-[1px_1px_0px_rgba(0,0,0,1)]'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <span className="text-xl">🍯</span>
                            <div>
                              <h5 className="font-black text-sm uppercase leading-tight">Bee Wallet</h5>
                              <p className="text-[10px] text-neutral-500 font-bold">Balance: ₹500.00</p>
                            </div>
                          </div>
                          <input type="radio" checked={paymentMethod === 'wallet'} readOnly className="accent-black" />
                        </div>
                        {paymentMethod === 'wallet' && (
                          <div className="mt-2 pt-2 border-t border-dashed border-black" onClick={(e) => e.stopPropagation()}>
                            <div className="bg-amber-100 border border-amber-600 text-amber-900 rounded-lg p-2 text-xs font-bold text-center">
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
                        className={`p-3 rounded-2xl border-2 border-black cursor-pointer transition-all ${
                          paymentMethod === 'cod' ? 'bg-amber-300 shadow-[3px_3px_0px_rgba(0,0,0,1)] -translate-y-0.5' : 'bg-white hover:bg-amber-50 shadow-[1px_1px_0px_rgba(0,0,0,1)]'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <span className="text-xl">🛵</span>
                            <div>
                              <h5 className="font-black text-sm uppercase leading-tight">Honey on Delivery (COD)</h5>
                              <p className="text-[10px] text-neutral-500 font-bold">Pay cash or QR scan at door</p>
                            </div>
                          </div>
                          <input type="radio" checked={paymentMethod === 'cod'} readOnly className="accent-black" />
                        </div>
                        {paymentMethod === 'cod' && (
                          <div className="mt-2 pt-2 border-t border-dashed border-black" onClick={(e) => e.stopPropagation()}>
                            <p className="text-[10px] text-neutral-600 font-bold text-center">
                              Pay with cash or scan the QR code presented by Buster Bee.
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    {/* Customer Info Form */}
                    <div className="bg-amber-100 border-2 border-black p-4 rounded-2xl space-y-3 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                      <h4 className="font-black text-xs uppercase text-amber-800 tracking-wider">
                        {diningMode === 'dine-in' ? '🍽️ Dine-In Table Selection' : '📦 Delivery Coordinates'}
                      </h4>
                      
                      <div>
                        <label className="block text-[10px] font-black text-black uppercase">Recipient Name</label>
                        <input 
                          type="text" 
                          value={customerName}
                          onChange={(e) => setCustomerName(e.target.value)}
                          className="w-full text-xs font-bold bg-[#FFFEEB] border border-black rounded-lg p-1.5 focus:ring-1 focus:ring-amber-500"
                        />
                      </div>

                      {diningMode === 'dine-in' ? (
                        <div>
                          <label className="block text-[10px] font-black text-black uppercase">Table Number</label>
                          <input 
                            type="text" 
                            pattern="[0-9]*"
                            maxLength={2}
                            placeholder="Enter table number (1-12)"
                            value={tableNumber}
                            onChange={(e) => setTableNumber(e.target.value.replace(/\D/g, ''))}
                            className="w-full text-xs font-bold bg-[#FFFEEB] border border-black rounded-lg p-1.5 focus:ring-1 focus:ring-amber-500"
                          />
                        </div>
                      ) : (
                        <div>
                          <label className="block text-[10px] font-black text-black uppercase">Hive Address</label>
                          <input 
                            type="text" 
                            value={customerAddress}
                            onChange={(e) => setCustomerAddress(e.target.value)}
                            className="w-full text-xs font-bold bg-[#FFFEEB] border border-black rounded-lg p-1.5 focus:ring-1 focus:ring-amber-500"
                          />
                        </div>
                      )}
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
                  {checkoutStep === 'cart' ? (
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
                  ) : (
                    <div className="bg-amber-200 border-2 border-black rounded-xl p-3 flex justify-between items-center shadow-[1px_1px_0px_rgba(0,0,0,1)]">
                      <div>
                        <span className="text-[9px] font-black text-amber-800 uppercase block">Selected Payment</span>
                        <span className="text-xs font-black uppercase text-black">
                          {paymentMethod === 'upi' && '⚡ Bumble Pay UPI'}
                          {paymentMethod === 'card' && `💳 Card (*${cardDetails.number.replace(/\s+/g, '').slice(-4) || '4242'})`}
                          {paymentMethod === 'wallet' && '🍯 Bee Wallet Balance'}
                          {paymentMethod === 'cod' && '🛵 Cash/QR on Delivery'}
                        </span>
                      </div>
                      <button 
                        onClick={() => setCheckoutStep('cart')}
                        className="text-[10px] font-black uppercase bg-black hover:bg-neutral-800 text-amber-400 px-2 py-1 rounded-lg border border-black"
                      >
                        Change
                      </button>
                    </div>
                  )}

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

                  {checkoutStep === 'cart' ? (
                    <button
                      onClick={() => {
                        if (user === null) {
                          setAuthTab('login');
                          setAuthError('Please sign in or register to place your buzz order!');
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
                      className="w-full bg-black hover:bg-neutral-800 text-amber-400 font-black uppercase text-sm py-4 rounded-2xl border-4 border-black text-center shadow-[4px_4px_0px_0px_rgba(251,191,36,1)] hover:shadow-[2px_2px_0px_0px_rgba(251,191,36,1)] transform hover:-translate-y-0.5 active:translate-y-0 transition-all"
                    >
                      🚀 Place Buzz Order! (₹{grandTotal.toFixed(2)})
                    </button>
                  ) : (
                    <button
                      onClick={handleCheckout}
                      className="w-full bg-black hover:bg-neutral-800 text-amber-400 font-black uppercase text-sm py-4 rounded-2xl border-4 border-black text-center shadow-[4px_4px_0px_0px_rgba(251,191,36,1)] hover:shadow-[2px_2px_0px_0px_rgba(251,191,36,1)] transform hover:-translate-y-0.5 active:translate-y-0 transition-all"
                    >
                      💳 Confirm & Pay (₹{grandTotal.toFixed(2)})
                    </button>
                  )}
                  <p className="text-[9px] text-center font-black uppercase tracking-wider text-neutral-500">
                    🔒 Sweetened payment gateway checked by Goret Security
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
          <div className="w-full max-w-sm bg-white border-4 border-black p-6 sm:p-8 rounded-3xl shadow-[8px_8px_0px_rgba(0,0,0,1)] space-y-6 relative overflow-hidden">
            {/* Top honey drip border decor */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-amber-400 border-b border-black" />

            {diningStep === 'ask' ? (
              <div className="text-center space-y-4">
                <span className="text-4xl block animate-bounce">🍽️</span>
                <h3 className="text-xl font-black uppercase text-black leading-tight">Are you inside the Cafe?</h3>
                <p className="text-xs font-bold text-neutral-500">Let us know if you are currently seated at one of our honeycomb tables!</p>
                
                <div className="flex flex-col gap-2 pt-2">
                  <button
                    onClick={() => {
                      setDiningMode('dine-in');
                      setDiningStep('table');
                      playBuzzSound('add');
                    }}
                    className="w-full bg-amber-400 hover:bg-amber-500 text-black font-black uppercase text-xs py-3.5 rounded-xl border-2 border-black shadow-[2px_2px_0px_rgba(0,0,0,1)] active:translate-y-0.5 transition-all"
                  >
                    🍯 Yes, Dining In
                  </button>
                  <button
                    onClick={() => {
                      setDiningMode('delivery');
                      setShowDiningModal(false);
                      setCheckoutStep('payment');
                      playBuzzSound('add');
                    }}
                    className="w-full bg-white hover:bg-neutral-50 text-black font-black uppercase text-xs py-3.5 rounded-xl border-2 border-black shadow-[2px_2px_0px_rgba(0,0,0,1)] active:translate-y-0.5 transition-all"
                  >
                    🛵 No, Takeaway / Delivery
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center space-y-4">
                <span className="text-4xl block animate-pulse">🐝</span>
                <h3 className="text-xl font-black uppercase text-black leading-tight">Enter Table Number</h3>
                <p className="text-xs font-bold text-neutral-500">Which table are you seated at? (1 to 12)</p>
                
                <div className="pt-2">
                  <input
                    type="text"
                    pattern="[0-9]*"
                    maxLength={2}
                    placeholder="Table number (e.g. 5)"
                    value={tableNumber}
                    onChange={(e) => setTableNumber(e.target.value.replace(/\D/g, ''))}
                    className="w-full text-center text-sm font-black bg-[#FFFEEB] border-2 border-black rounded-xl p-3 focus:outline-none focus:ring-1 focus:ring-amber-500 shadow-[2px_2px_0px_rgba(0,0,0,1)]"
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
                    className="flex-1 bg-white hover:bg-neutral-100 text-black font-black uppercase text-[10px] py-2.5 rounded-xl border-2 border-black"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (!tableNumber.trim()) {
                        alert("Please input your table number! 🍯");
                        return;
                      }
                      setShowDiningModal(false);
                      setCheckoutStep('payment');
                      playBuzzSound('checkout');
                    }}
                    className="flex-1 bg-amber-400 hover:bg-amber-500 text-black font-black uppercase text-[10px] py-2.5 rounded-xl border-2 border-black shadow-[2px_2px_0px_rgba(0,0,0,1)] active:translate-y-0.5 transition-all"
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
