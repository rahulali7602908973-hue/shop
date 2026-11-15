import React, { useState, useEffect } from 'react';
import { supabase } from './services/supabaseClient';
import { ShoppingBag, Search, User, Shield, Store, Menu, X, Heart, Package, LogOut, ArrowRight, Star, CheckCircle } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [products, setProducts] = useState([]);
  const [banners, setBanners] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Auth & Data Fetching on mount
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) fetchProfile(session.user.id);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) fetchProfile(session.user.id);
      else setProfile(null);
    });

    fetchStoreData();
    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (userId) => {
    const { data } = await supabase.from('profiles').select('*').eq('id', userId).single();
    if (data) setProfile(data);
  };

  const fetchStoreData = async () => {
    try {
      const [prodRes, banRes, catRes] = await Promise.all([
        supabase.from('products').select('*, sellers(store_name)').eq('approval_status', 'approved').eq('is_active', true),
        supabase.from('banners').select('*').eq('is_active', true).order('sort_order'),
        supabase.from('categories').select('*').eq('is_active', true).order('sort_order')
      ]);

      if (prodRes.data) setProducts(prodRes.data);
      if (banRes.data) setBanners(banRes.data);
      if (catRes.data) setCategories(catRes.data);
    } catch (err) {
      console.error('Error loading store data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
  };

  return (
    <div className="min-h-screen bg-[#F4F7F6] text-[#1D2928] font-sans">
      {/* Top Announcement Bar */}
      <div className="bg-[#123B3A] text-white text-xs sm:text-sm py-2 px-4 text-center font-medium">
        🎉 Welcome to <span className="text-[#FFB84D] font-bold">ShopKart</span> — India's Premier Multi-Vendor Marketplace | Free Delivery on First Order!
      </div>

      {/* Main Navigation Bar */}
      <header className="sticky top-0 z-50 bg-white shadow-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          
          {/* Brand Logo */}
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setActiveTab('home')}>
            <div className="bg-[#123B3A] text-[#FFB84D] p-2.5 rounded-xl font-extrabold text-2xl tracking-wider shadow-lg flex items-center gap-1">
              <ShoppingBag className="w-7 h-7" />
              <span>ShopKart</span>
            </div>
          </div>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-xl relative">
            <input 
              type="text" 
              placeholder="Search for Designer Kurtis, Gadgets, Electronics & More..." 
              className="w-full bg-[#F4F7F6] border border-gray-200 rounded-full py-3 pl-12 pr-4 text-sm focus:outline-none focus:border-[#16A6A0] transition"
            />
            <Search className="w-5 h-5 text-gray-400 absolute left-4 top-3.5" />
          </div>

          {/* Right Action Icons & Auth */}
          <div className="flex items-center gap-4 sm:gap-6">
            <button onClick={() => setActiveTab('wishlist')} className="flex flex-col items-center text-gray-600 hover:text-[#16A6A0] transition">
              <Heart className="w-6 h-6" />
              <span className="text-xs font-medium">Wishlist</span>
            </button>

            <button onClick={() => setActiveTab('cart')} className="flex flex-col items-center text-gray-600 hover:text-[#16A6A0] relative transition">
              <ShoppingBag className="w-6 h-6" />
              <span className="text-xs font-medium">Cart</span>
            </button>

            {user ? (
              <div className="flex items-center gap-3 bg-[#F4F7F6] py-1.5 px-3 rounded-full border border-gray-200">
                <User className="w-5 h-5 text-[#123B3A]" />
                <span className="text-sm font-bold text-[#123B3A] hidden sm:inline">{profile?.full_name || 'My Account'}</span>
                <button onClick={handleLogout} title="Logout" className="text-red-500 hover:text-red-700 ml-1">
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button 
                onClick={() => setActiveTab('login')}
                className="bg-[#16A6A0] hover:bg-[#123B3A] text-white px-5 py-2.5 rounded-full text-sm font-semibold shadow-md transition flex items-center gap-2"
              >
                <User className="w-4 h-4" />
                <span>Sign In</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* HOME PAGE */}
        {activeTab === 'home' && (
          <div className="space-y-12">
            
            {/* Hero Banner Section */}
            <div className="bg-gradient-to-r from-[#123B3A] to-[#16A6A0] rounded-3xl p-8 sm:p-12 text-white shadow-xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="space-y-4 max-w-lg z-10">
                <span className="bg-[#FFB84D] text-[#123B3A] font-bold text-xs px-3 py-1.5 rounded-full uppercase tracking-wider">
                  Mega Launch Offer 🚀
                </span>
                <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
                  Discover Quality & Style on ShopKart
                </h1>
                <p className="text-gray-100 text-sm sm:text-base">
                  Shop direct from verified independent sellers and top brands. Unbeatable prices on ethnic wear, electronics, and smart gadgets.
                </p>
                <button 
                  onClick={() => window.scrollTo({ top: 600, behavior: 'smooth' })}
                  className="bg-[#FFB84D] hover:bg-[#ffa726] text-[#1D2928] font-bold px-8 py-3.5 rounded-xl shadow-lg transition flex items-center gap-2"
                >
                  <span>Start Shopping Now</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
              <div className="z-10">
                <img 
                  src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=600&q=80" 
                  alt="ShopKart Festive Sale" 
                  className="rounded-2xl shadow-2xl w-full max-w-md object-cover border-4 border-white/20"
                />
              </div>
            </div>

            {/* Categories Grid */}
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-[#1D2928]">Shop by Categories</h2>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                {categories.map((cat) => (
                  <div key={cat.id} className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md border border-gray-100 text-center cursor-pointer transition group">
                    <div className="w-14 h-14 bg-[#F4F7F6] group-hover:bg-[#16A6A0]/10 rounded-full flex items-center justify-center mx-auto mb-3 text-[#16A6A0] transition">
                      <Package className="w-7 h-7" />
                    </div>
                    <h3 className="font-semibold text-sm text-[#1D2928] group-hover:text-[#16A6A0]">{cat.name}</h3>
                  </div>
                ))}
              </div>
            </div>

            {/* Trending / Featured Products */}
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-[#1D2928]">Trending Products & Best Sellers</h2>
              </div>

              {loading ? (
                <div className="text-center py-12 text-gray-500">Loading products from secure database...</div>
              ) : products.length === 0 ? (
                <div className="bg-white rounded-2xl p-12 text-center border border-gray-100 shadow-sm">
                  <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-bold text-gray-700">No approved products listed yet</h3>
                  <p className="text-sm text-gray-500 mt-1">Sellers can add products from the Seller Portal (/seller/login).</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {products.map((prod) => (
                    <div key={prod.id} className="bg-white rounded-2xl shadow-sm hover:shadow-xl border border-gray-100 overflow-hidden transition flex flex-col justify-between group">
                      <div>
                        <div className="relative overflow-hidden aspect-square bg-gray-100">
                          <img 
                            src={prod.thumbnail_url} 
                            alt={prod.title} 
                            className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                          />
                          {prod.discount_percent > 0 && (
                            <span className="absolute top-3 left-3 bg-[#FFB84D] text-[#1D2928] text-xs font-bold px-2.5 py-1 rounded-lg shadow">
                              {prod.discount_percent}% OFF
                            </span>
                          )}
                        </div>
                        <div className="p-5 space-y-2">
                          <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">{prod.sellers?.store_name || 'ShopKart Verified'}</span>
                          <h3 className="font-bold text-[#1D2928] line-clamp-1">{prod.title}</h3>
                          <div className="flex items-center gap-2">
                            <span className="text-lg font-extrabold text-[#123B3A]">₹{prod.selling_price}</span>
                            {prod.mrp_price > prod.selling_price && (
                              <span className="text-sm text-gray-400 line-through">₹{prod.mrp_price}</span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="p-5 pt-0">
                        <button className="w-full bg-[#123B3A] hover:bg-[#16A6A0] text-white py-3 rounded-xl font-semibold text-sm shadow transition flex items-center justify-center gap-2">
                          <ShoppingBag className="w-4 h-4" />
                          <span>Add to Cart</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        )}

        {/* LOGIN / AUTH VIEW */}
        {activeTab === 'login' && (
          <div className="max-w-md mx-auto bg-white rounded-3xl shadow-xl border border-gray-100 p-8 my-12">
            <div className="text-center mb-8">
              <div className="bg-[#123B3A] text-[#FFB84D] w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-md">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-extrabold text-[#1D2928]">Welcome to ShopKart</h2>
              <p className="text-sm text-gray-500 mt-1">Sign in with your email & password</p>
            </div>

            <form onSubmit={async (e) => {
              e.preventDefault();
              const email = e.target.email.value;
              const password = e.target.password.value;
              const { error } = await supabase.auth.signInWithPassword({ email, password });
              if (error) alert(error.message);
              else {
                alert('Successfully signed in!');
                setActiveTab('home');
              }
            }} className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase mb-2">Email Address</label>
                <input type="email" name="email" required placeholder="you@example.com" className="w-full bg-[#F4F7F6] border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#16A6A0]" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase mb-2">Password</label>
                <input type="password" name="password" required placeholder="••••••••" className="w-full bg-[#F4F7F6] border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#16A6A0]" />
              </div>
              <button type="submit" className="w-full bg-[#123B3A] hover:bg-[#16A6A0] text-white py-3.5 rounded-xl font-bold shadow-lg transition">
                Sign In Securely
              </button>
            </form>

            <div className="mt-6 text-center text-sm text-gray-500">
              Don't have an account? <button onClick={() => setActiveTab('register')} className="text-[#16A6A0] font-bold hover:underline">Register now</button>
            </div>
          </div>
        )}

        {/* REGISTER VIEW */}
        {activeTab === 'register' && (
          <div className="max-w-md mx-auto bg-white rounded-3xl shadow-xl border border-gray-100 p-8 my-12">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-extrabold text-[#1D2928]">Create Account</h2>
              <p className="text-sm text-gray-500 mt-1">Join ShopKart marketplace today</p>
            </div>

            <form onSubmit={async (e) => {
              e.preventDefault();
              const fullName = e.target.fullName.value;
              const email = e.target.email.value;
              const password = e.target.password.value;
              
              const { error } = await supabase.auth.signUp({
                email,
                password,
                options: { data: { full_name: fullName } }
              });

              if (error) alert(error.message);
              else {
                alert('Account created successfully! You can now sign in.');
                setActiveTab('login');
              }
            }} className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase mb-2">Full Name</label>
                <input type="text" name="fullName" required placeholder="Rahul Ali" className="w-full bg-[#F4F7F6] border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#16A6A0]" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase mb-2">Email Address</label>
                <input type="email" name="email" required placeholder="you@example.com" className="w-full bg-[#F4F7F6] border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#16A6A0]" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase mb-2">Password (Min 6 chars)</label>
                <input type="password" name="password" required placeholder="••••••••" className="w-full bg-[#F4F7F6] border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#16A6A0]" />
              </div>
              <button type="submit" className="w-full bg-[#16A6A0] hover:bg-[#123B3A] text-white py-3.5 rounded-xl font-bold shadow-lg transition">
                Create Account
              </button>
            </form>
          </div>
        )}

        {/* CART VIEW */}
        {activeTab === 'cart' && (
          <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-xl border border-gray-100 p-8 my-8">
            <h2 className="text-2xl font-extrabold text-[#1D2928] mb-6 flex items-center gap-3">
              <ShoppingBag className="w-7 h-7 text-[#16A6A0]" />
              <span>Shopping Cart</span>
            </h2>
            <div className="bg-[#F4F7F6] rounded-2xl p-8 text-center text-gray-500">
              <p>Your shopping cart is currently empty.</p>
              <button onClick={() => setActiveTab('home')} className="mt-4 bg-[#123B3A] text-white px-6 py-2.5 rounded-xl text-sm font-semibold shadow">
                Start Shopping
              </button>
            </div>
          </div>
        )}

        {/* WISHLIST VIEW */}
        {activeTab === 'wishlist' && (
          <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-xl border border-gray-100 p-8 my-8">
            <h2 className="text-2xl font-extrabold text-[#1D2928] mb-6 flex items-center gap-3">
              <Heart className="w-7 h-7 text-red-500" />
              <span>My Wishlist</span>
            </h2>
            <div className="bg-[#F4F7F6] rounded-2xl p-8 text-center text-gray-500">
              <p>Your wishlist is currently empty.</p>
              <button onClick={() => setActiveTab('home')} className="mt-4 bg-[#123B3A] text-white px-6 py-2.5 rounded-xl text-sm font-semibold shadow">
                Explore Products
              </button>
            </div>
          </div>
        )}

      </main>

      {/* Professional Footer */}
      <footer className="bg-[#123B3A] text-white mt-20 pt-16 pb-12 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="bg-[#FFB84D] text-[#123B3A] p-2 rounded-xl font-extrabold text-xl flex items-center gap-1">
                <ShoppingBag className="w-6 h-6" />
                <span>ShopKart</span>
              </div>
            </div>
            <p className="text-gray-300 text-sm">
              India's Modern Multi-Vendor E-Commerce Marketplace. Empowering independent sellers and delivering quality across India.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-[#FFB84D] mb-4 uppercase text-xs tracking-wider">Customer Portals</h4>
            <ul className="space-y-2.5 text-sm text-gray-300">
              <li><a href="#" className="hover:text-white transition">My Account</a></li>
              <li><a href="#" className="hover:text-white transition">Order Tracking</a></li>
              <li><a href="#" className="hover:text-white transition">Wishlist</a></li>
              <li><a href="#" className="hover:text-white transition">Returns & Refunds</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-[#FFB84D] mb-4 uppercase text-xs tracking-wider">Merchant & Admin</h4>
            <ul className="space-y-2.5 text-sm text-gray-300">
              <li><a href="/seller/login" className="hover:text-white transition">Seller Portal (/seller/login)</a></li>
              <li><a href="/admin/login" className="hover:text-white transition">Super Admin Panel (/admin/login)</a></li>
              <li><a href="#" className="hover:text-white transition">Partner With Us</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-[#FFB84D] mb-4 uppercase text-xs tracking-wider">Secure Tech</h4>
            <p className="text-xs text-gray-300 leading-relaxed">
              Powered by Supabase PostgreSQL Database, Row Level Security (RLS), and Cloudflare Enterprise Hosting.
            </p>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 border-t border-white/10 text-center text-xs text-gray-400">
          © {new Date().getFullYear()} ShopKart Marketplace. All rights reserved. Built with Professional Modern Architecture.
        </div>
      </footer>
    </div>
  );
}
