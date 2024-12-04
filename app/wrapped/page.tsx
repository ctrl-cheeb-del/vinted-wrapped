"use client";

import { useEffect, useState, useRef } from 'react';
import { 
  TrendingUp, 
  Calendar, 
  ShoppingBag, 
  MessageCircle,
  Star,
  ShoppingCart,
  Package,
  MessageSquare,
  Banknote,
  Calculator,
  Heart
} from 'lucide-react';
import { Background } from './components/Background';
import { StatCard } from './components/StatCard';
import { TokenModal } from './components/TokenModal';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchAllData } from './utils/api';
import Image from 'next/image';
import Link from 'next/link';

interface SalesData {
  totalSales: number;
  itemsSold: number;
  bestMonth: string;
  mostExpensiveSale: number;
  averageSalePrice: number;
  busiestDay: string;
  averageRating: number;
  totalSpent: number;
  itemsPurchased: number;
  totalConversations: number;
  activeConversations: number;
  mostActiveMonth: {
    month: string;
    activity: number;
  };
  currency: string;
}

const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

interface CachedData extends SalesData {
  timestamp: number;
}

const createSlides = (salesData: SalesData | null) => [
  {
    id: 0,
    title: "Welcome to Your Vinted Wrapped",
    Icon: Star,
    value: "2024",
    description: "Let's explore your journey!",
    color: "text-white",
    bgColor: "bg-gradient-to-b from-indigo-600 to-purple-900"
  },
  {
    id: 1,
    title: "Your Total Sales in 2024",
    Icon: TrendingUp,
    value: salesData?.totalSales !== undefined 
      ? `${CURRENCY_SYMBOLS[salesData?.currency || 'EUR']}${salesData.totalSales.toFixed(2)}`
      : `${CURRENCY_SYMBOLS['EUR']}0.00`,
    description: "Amazing work! 🎉",
    color: "text-green-400",
    bgColor: "bg-gradient-to-b from-green-600 to-green-900"
  },
  {
    id: 2,
    title: "Items Found New Homes",
    Icon: ShoppingBag,
    value: salesData?.itemsSold ?? 0,
    description: "items sold",
    color: "text-blue-400",
    bgColor: "bg-gradient-to-b from-blue-600 to-blue-900"
  },
  {
    id: 3,
    title: "Your Best Month Was",
    Icon: Calendar,
    value: salesData?.bestMonth || "Loading...",
    description: "Keep that momentum going!",
    color: "text-purple-400",
    bgColor: "bg-gradient-to-b from-purple-600 to-purple-900"
  },
  {
    id: 4,
    title: "Your Biggest Sale",
    Icon: Banknote,
    value: salesData?.mostExpensiveSale !== undefined
      ? `${CURRENCY_SYMBOLS[salesData?.currency || 'EUR']}${salesData.mostExpensiveSale.toFixed(2)}`
      : `${CURRENCY_SYMBOLS['EUR']}0.00`,
    description: "was your highest sale!",
    color: "text-yellow-400",
    bgColor: "bg-gradient-to-b from-yellow-600 to-yellow-900"
  },
  {
    id: 5,
    title: "Average Sale Price",
    Icon: Calculator,
    value: salesData?.averageSalePrice !== undefined
      ? `${CURRENCY_SYMBOLS[salesData?.currency || 'EUR']}${Number(salesData.averageSalePrice).toFixed(2)}`
      : `${CURRENCY_SYMBOLS['EUR']}0.00`,
    description: "per item sold",
    color: "text-pink-400",
    bgColor: "bg-gradient-to-b from-pink-600 to-pink-900"
  },
  {
    id: 6,
    title: "Your Best Day",
    Icon: Calendar,
    value: salesData?.busiestDay || "Loading...",
    description: "was your busiest day!",
    color: "text-violet-400",
    bgColor: "bg-gradient-to-b from-violet-600 to-violet-900"
  },
  {
    id: 7,
    title: "Your Shopping Spree",
    Icon: ShoppingCart,
    value: salesData?.totalSpent !== undefined
      ? `${CURRENCY_SYMBOLS[salesData?.currency || 'EUR']}${salesData.totalSpent.toFixed(2)}`
      : `${CURRENCY_SYMBOLS['EUR']}0.00`,
    description: "spent on purchases",
    color: "text-indigo-400",
    bgColor: "bg-gradient-to-b from-indigo-600 to-indigo-900"
  },
  {
    id: 8,
    title: "Items You Bought",
    Icon: Package,
    value: salesData?.itemsPurchased ?? 0,
    description: "new treasures found",
    color: "text-orange-400",
    bgColor: "bg-gradient-to-b from-orange-600 to-orange-900"
  },
  {
    id: 9,
    title: "Conversations Started",
    Icon: MessageSquare,
    value: salesData?.totalConversations ?? 0,
    description: "connections made",
    color: "text-teal-400",
    bgColor: "bg-gradient-to-b from-teal-600 to-teal-900"
  },
  {
    id: 10,
    title: "Hope you enjoyed!",
    Icon: Heart,
    value: "Want More?",
    description: "Check out these amazing tools:",
    color: "text-white",
    bgColor: "bg-gradient-to-b from-pink-600 to-purple-900",
    isLastSlide: true
  }
];

const lerp = (start: number, end: number, t: number) => {
  return start * (1 - t) + end * t;
};

interface LoadingState {
  orders: boolean;
  conversations: boolean;
  purchases: boolean;
}

const calculateBestSellingBrand = (orders: any[]) => {
  const brandCounts: Record<string, number> = {};
  orders.forEach((order: any) => {
    const brand = order.brand || "Unknown Brand";
    brandCounts[brand] = (brandCounts[brand] || 0) + 1;
  });

  return Object.entries(brandCounts)
    .reduce((a, b) => brandCounts[a[0]] > brandCounts[b[0]] ? a : b)[0];
};

interface VintedPrice {
  amount: string;
  currency_code: string;
}

interface VintedOrder {
  status: string;
  transaction_user_status: string;
  price?: VintedPrice;
  date: string;
  brand?: string;
}

interface VintedPurchase {
  status: string;
  transaction_user_status: string;
  price?: VintedPrice;
  date: string;
}

const calculateMostExpensiveSale = (orders: VintedOrder[]) => {
  return orders.reduce((max, order) => {
    if (order.status.toLowerCase().includes('completed') || order.transaction_user_status === 'completed') {
      const price = parseFloat(order.price?.amount || '0');
      return price > max ? price : max;
    }
    return max;
  }, 0);
};

const calculateAverageSalePrice = (orders: VintedOrder[]) => {
  const completedOrders = orders.filter(order => 
    order.status.toLowerCase().includes('completed') || 
    order.transaction_user_status === 'completed'
  );
  
  const total = completedOrders.reduce((sum, order) => 
    sum + parseFloat(order.price?.amount || '0'), 0
  );
  
  const average = completedOrders.length > 0 ? total / completedOrders.length : 0;
  return Number(average.toFixed(2));
};

const calculateBusiestDay = (orders: VintedOrder[]) => {
  const dayCounts: Record<string, number> = {};
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  
  orders.forEach(order => {
    // Only count completed orders
    if (order.status.toLowerCase().includes('completed') || 
        order.transaction_user_status === 'completed') {
      const date = new Date(order.date);
      const dayOfWeek = days[date.getDay()];
      dayCounts[dayOfWeek] = (dayCounts[dayOfWeek] || 0) + 1;
    }
  });
  
  // If no completed orders, return "No sales yet"
  if (Object.keys(dayCounts).length === 0) {
    return "No sales yet";
  }
  
  return Object.entries(dayCounts)
    .reduce((a, b) => dayCounts[a[0]] > dayCounts[b[0]] ? a : b)[0];
};

const CURRENCY_SYMBOLS: Record<string, string> = {
  'GBP': '£',
  'EUR': '€',
  'USD': '$',
  'PLN': 'zł',
  'CZK': 'Kč',
};

export default function Wrapped() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const [showTokenModal, setShowTokenModal] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);
  const [salesData, setSalesData] = useState<SalesData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loadingState, setLoadingState] = useState<LoadingState>({
    orders: false,
    conversations: false,
    purchases: false
  });

  useEffect(() => {
    const checkCache = () => {
      const cached = localStorage.getItem('vintedWrappedData');
      if (cached) {
        const parsedCache: CachedData = JSON.parse(cached);
        const now = Date.now();
        
        if (now - parsedCache.timestamp < CACHE_DURATION) {
          console.log('Using cached data from:', new Date(parsedCache.timestamp));
          const { timestamp, ...salesData } = parsedCache;
          setSalesData(salesData);
          setShowTokenModal(false);
        } else {
          console.log('Cache expired, needs refresh');
          localStorage.removeItem('vintedWrappedData');
          setShowTokenModal(true);
        }
      } else {
        console.log('No cache found');
        setShowTokenModal(true);
      }
    };

    checkCache();
  }, []);

  if (showTokenModal === null) {
    return <div className="fixed inset-0 bg-black" />;
  }

  const calculateMostActiveMonth = (items: any[]) => {
    const monthCounts: Record<string, number> = {};
    items.forEach((item: any) => {
      const date = new Date(item.date);
      const monthKey = `${date.getFullYear()}-${date.getMonth() + 1}`;
      monthCounts[monthKey] = (monthCounts[monthKey] || 0) + 1;
    });

    const [bestMonth] = Object.entries(monthCounts).reduce((a, b) => 
      monthCounts[a[0]] > monthCounts[b[0]] ? a : b
    );

    const [year, month] = bestMonth.split('-');
    return {
      month: new Date(parseInt(year), parseInt(month) - 1).toLocaleString('default', { month: 'long' }),
      activity: monthCounts[bestMonth]
    };
  };

  const fetchSalesData = async (tokens: { 
    accessToken: string; 
    xcsrfToken: string; 
    domain: string 
  }) => {
    setLoading(true);
    setError(null);
    
    try {
      setLoadingState({ orders: true, conversations: false, purchases: false });
      const { orders, conversations, purchases } = await fetchAllData(
        tokens.accessToken,
        tokens.xcsrfToken,
        tokens.domain
      );

      const currency = orders[0]?.price?.currency_code || 'EUR';
      const totalSales = orders.reduce((sum: number, order: VintedOrder) => {
        if (
          (order.status?.toLowerCase().includes('completed') || 
           order.transaction_user_status === 'completed') &&
          order.price?.amount
        ) {
          const amount = parseFloat(order.price.amount);
          return !isNaN(amount) ? sum + amount : sum;
        }
        return sum;
      }, 0);

      const totalSpent = purchases.reduce((sum: number, purchase: any) => {
        if (purchase.status.toLowerCase().includes('completed') || 
            purchase.transaction_user_status === 'completed') {
          return sum + parseFloat(purchase.price?.amount || '0');
        }
        return sum;
      }, 0);

      const monthCounts: Record<string, number> = {};
      orders.forEach((order: any) => {
        const date = new Date(order.date);
        const monthKey = `${date.getFullYear()}-${date.getMonth() + 1}`;
        monthCounts[monthKey] = (monthCounts[monthKey] || 0) + 1;
      });

      const bestMonth = Object.entries(monthCounts).reduce((a, b) => 
        monthCounts[a[0]] > monthCounts[b[0]] ? a : b
      )[0];

      const [year, month] = bestMonth.split('-');
      const monthName = new Date(parseInt(year), parseInt(month) - 1)
        .toLocaleString('default', { month: 'long' });

      const newSalesData = {
        totalSales,
        itemsSold: orders.filter((order: VintedOrder) => 
          (order.status?.toLowerCase().includes('completed') || 
           order.transaction_user_status === 'completed') &&
          order.price?.amount
        ).length,
        bestMonth: monthName,
        mostExpensiveSale: calculateMostExpensiveSale(orders),
        averageSalePrice: calculateAverageSalePrice(orders),
        busiestDay: calculateBusiestDay(orders),
        averageRating: 5,
        totalSpent,
        itemsPurchased: purchases.filter((purchase: VintedPurchase) => 
          purchase.status.toLowerCase().includes('completed') || 
          purchase.transaction_user_status === 'completed'
        ).length,
        totalConversations: conversations.length,
        activeConversations: conversations.filter((c: any) => c.unread).length,
        mostActiveMonth: calculateMostActiveMonth([...orders, ...purchases]),
        currency
      };

      const cacheData: CachedData = {
        ...newSalesData,
        timestamp: Date.now()
      };
      localStorage.setItem('vintedWrappedData', JSON.stringify(cacheData));

      setSalesData(newSalesData);
      setShowTokenModal(false);
    } catch (err: any) {
      console.error('Error processing data:', err);
      setError(
        err.response?.data?.error || 
        err.message || 
        'Failed to fetch data'
      );
    } finally {
      setLoading(false);
      setLoadingState({ orders: false, conversations: false, purchases: false });
    }
  };

  useEffect(() => {
    if (showTokenModal || loading || error) return;

    const container = containerRef.current;
    if (!container) return;

    const currentSlides = createSlides(salesData);
    let scrollTimeout: NodeJS.Timeout;
    
    const handleScroll = () => {
      clearTimeout(scrollTimeout);
      
      scrollTimeout = setTimeout(() => {
        const slideHeight = window.innerHeight;
        const scrollPosition = container.scrollTop;
        const currentIndex = Math.round(scrollPosition / slideHeight);
        
        if (currentIndex !== currentSlide && currentIndex >= 0 && currentIndex < currentSlides.length) {
          setCurrentSlide(currentIndex);
        }
      }, 50);
    };

    container.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      container.removeEventListener('scroll', handleScroll);
      clearTimeout(scrollTimeout);
    };
  }, [currentSlide, showTokenModal, loading, error, salesData]);

  const slides = createSlides(salesData);

  return (
    <main className="fixed inset-0 overflow-hidden">
      {showTokenModal && (
        <TokenModal
          onSubmit={fetchSalesData}
          isLoading={loading}
          errorMessage={error}
        />
      )}
      
      {!showTokenModal && (
        <>
          <div className="absolute inset-0">
            <AnimatePresence initial={false}>
              <motion.div
                key={currentSlide}
                className="absolute inset-0"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
              >
                <Background color={slides[currentSlide].bgColor} />
              </motion.div>
            </AnimatePresence>
          </div>
          
          <div 
            ref={containerRef}
            className="h-screen w-full overflow-y-scroll snap-mandatory snap-y scrollbar-hide relative z-10"
            style={{ 
              scrollSnapType: 'y mandatory',
              WebkitOverflowScrolling: 'touch',
              scrollBehavior: 'smooth',
              height: '100dvh'
            }}
          >
            {slides.map((slide, index) => (
              <section
                key={slide.id}
                data-index={index}
                className="h-screen flex items-center justify-center"
                style={{
                  scrollSnapAlign: 'start',
                  scrollSnapStop: 'always',
                  height: '100dvh'
                }}
              >
                <StatCard
                  index={index}
                  title={slide.title}
                  Icon={slide.Icon}
                  value={slide.value}
                  description={slide.description}
                  color={slide.color}
                  inView={currentSlide === index}
                  isLastSlide={slide.isLastSlide}
                />
              </section>
            ))}
          </div>

          <div className="fixed bottom-4 left-0 right-0 z-50 flex justify-center">
            <div className="text-white/60 text-sm flex items-center gap-2 bg-black/20 backdrop-blur-sm px-4 py-2 rounded-full">
              Sponsored by
              <Link href="https://resoled.it" target="_blank" className="hover:opacity-80 transition-opacity inline-flex items-center gap-2">
                <Image
                  src="/resoled.png"
                  alt="Resoled"
                  width={16}
                  height={16}
                  className="inline-block object-contain"
                />
                <span>Resoled</span>
              </Link>
              and
              <Link href="https://vinta.app" target="_blank" className="hover:opacity-80 transition-opacity inline-flex items-center gap-2">
                <Image
                  src="/vinta.png"
                  alt="Vinta"
                  width={16}
                  height={16}
                  className="inline-block object-contain"
                />
                <span>Vinta</span>
              </Link>
            </div>
          </div>
        </>
      )}
    </main>
  );
}