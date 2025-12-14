import React, { useEffect, useState, useMemo } from 'react';
import { Sweet, SweetFilter } from '../types';
import { api } from '../services/api';
import SweetCard from '../components/SweetCard';
import Input from '../components/Input';
import { CATEGORIES } from '../constants';
import { Search, Filter, SlidersHorizontal, RefreshCcw } from 'lucide-react';
import Button from '../components/Button';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const [sweets, setSweets] = useState<Sweet[]>([]);
  const [loading, setLoading] = useState(true);
  const [purchasingId, setPurchasingId] = useState<string | null>(null);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Filters
  const [filters, setFilters] = useState<SweetFilter>({
    search: '',
    category: '',
    minPrice: 0,
    maxPrice: 2000
  });

  const [showFilters, setShowFilters] = useState(false);

  const fetchSweets = async () => {
    try {
      setLoading(true);
      const data = await api.sweets.getAll();
      setSweets(data);
    } catch (error) {
      console.error('Failed to fetch sweets', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSweets();
  }, []);

  const handlePurchase = async (sweet: Sweet) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    try {
      setPurchasingId(sweet.id);
      await api.sweets.purchase(sweet.id, 1);
      // Optimistic update or refetch
      await fetchSweets();
      alert(`Successfully purchased ${sweet.name}! Enjoy your treat.`);
    } catch (error: any) {
      alert(error.message || 'Failed to purchase sweet');
    } finally {
      setPurchasingId(null);
    }
  };

  const filteredSweets = useMemo(() => {
    return sweets.filter(sweet => {
      const matchesSearch = sweet.name.toLowerCase().includes(filters.search.toLowerCase()) || 
                            sweet.description.toLowerCase().includes(filters.search.toLowerCase());
      const matchesCategory = filters.category ? sweet.category === filters.category : true;
      const matchesPrice = sweet.price >= filters.minPrice && sweet.price <= filters.maxPrice;
      
      return matchesSearch && matchesCategory && matchesPrice;
    });
  }, [sweets, filters]);

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="relative bg-brand-600 rounded-2xl overflow-hidden shadow-lg p-8 sm:p-12">
        <div className="relative z-10 text-white max-w-2xl">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4">
            Satisfy Your Sweet Tooth
          </h1>
          <p className="text-lg text-brand-100 mb-8">
            Discover our handcrafted collection of gummies, chocolates, and artisan candies. 
            Delivered fresh to your doorstep.
          </p>
          <div className="flex gap-4">
             <Button variant="outline" className="bg-white text-brand-600 border-none hover:bg-brand-50" onClick={() => document.getElementById('shop-grid')?.scrollIntoView({ behavior: 'smooth' })}>
               Shop Now
             </Button>
          </div>
        </div>
        <div className="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-black/20 to-transparent hidden sm:block"></div>
        {/* Decorative circles */}
        <div className="absolute -bottom-12 -right-12 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute -top-12 -left-12 w-48 h-48 bg-yellow-400/20 rounded-full blur-2xl"></div>
      </div>

      {/* Filter Bar */}
      <div className="sticky top-20 z-30 bg-white/80 backdrop-blur-md border rounded-xl shadow-sm p-4" id="shop-grid">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-96">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-slate-400" />
            </div>
            <input
              type="text"
              placeholder="Search sweets..."
              className="block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg leading-5 bg-white placeholder-slate-500 focus:outline-none focus:ring-brand-500 focus:border-brand-500 sm:text-sm"
              value={filters.search}
              onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
            />
          </div>
          
          <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
             <button
                onClick={() => setFilters(prev => ({...prev, category: ''}))}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                  filters.category === '' 
                    ? 'bg-slate-900 text-white' 
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                All
              </button>
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setFilters(prev => ({...prev, category: cat}))}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                  filters.category === cat 
                    ? 'bg-brand-600 text-white' 
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <Button variant="ghost" size="sm" onClick={() => setShowFilters(!showFilters)} className="md:hidden">
            <SlidersHorizontal className="w-4 h-4 mr-2" />
            Filters
          </Button>
        </div>
        
        {/* Expanded Filters for Mobile/Desktop */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t grid grid-cols-1 md:grid-cols-2 gap-4">
             <div>
               <label className="text-sm font-medium text-slate-700">Max Price: ₹{filters.maxPrice}</label>
               <input 
                  type="range" 
                  min="0" 
                  max="5000" 
                  value={filters.maxPrice} 
                  onChange={(e) => setFilters(prev => ({...prev, maxPrice: Number(e.target.value)}))}
                  className="w-full mt-2"
               />
             </div>
          </div>
        )}
      </div>

      {/* Grid */}
      {loading ? (
        <div className="flex justify-center py-20">
          <RefreshCcw className="w-10 h-10 text-brand-500 animate-spin" />
        </div>
      ) : (
        <>
          {filteredSweets.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredSweets.map(sweet => (
                <SweetCard 
                  key={sweet.id} 
                  sweet={sweet} 
                  onPurchase={handlePurchase}
                  isPurchasing={purchasingId === sweet.id}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-slate-50 rounded-xl border-2 border-dashed border-slate-200">
              <Filter className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-900">No sweets found</h3>
              <p className="text-slate-500">Try adjusting your search or filters.</p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => setFilters({ search: '', category: '', minPrice: 0, maxPrice: 2000 })}
              >
                Clear Filters
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Home;