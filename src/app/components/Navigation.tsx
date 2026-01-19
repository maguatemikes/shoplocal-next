'use client';

import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Search, ShoppingCart, User, Phone, Menu, X, LogIn, LogOut, Home, LayoutDashboard } from 'lucide-react';
import { CartDrawer } from './CartDrawer';
import { UserMenu } from './UserMenu';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';
// import logoImage from 'figma:asset/c39e04a0e29966c7c7a53b0631d8fe12fc22d4ae.png';
const logoImage = '/logo.png'; // Placeholder

// WordPress SSO Configuration
const WORDPRESS_API_URL = 'https://shoplocal.kinsta.cloud/wp-json';
const VENDOR_SSO_ENDPOINT = `${WORDPRESS_API_URL}/reactapp/v1/vendor-sso`;

// IMPORTANT: WordPress MUST have CORS headers configured to allow this domain
// See /VENDOR_SSO_SETUP.md for complete setup instructions

/**
 * Navigation Component
 * 
 * Main navigation bar with three-tier design:
 * - White top bar with logo, search, and user actions
 * - Dark navigation bar with main menu links
 * - Blue promotional banner
 * 
 * @returns {JSX.Element} Complete navigation system
 */
export function Navigation() {
  const router = useRouter();
  const pathname = usePathname();

  // Compatibility wrappers for converted code removed
  
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { isAuthenticated, user, logout } = useAuth();

  // Handle SSO redirect to WordPress Dokan Dashboard
  const handleVendorDashboardClick = async () => {
    if (!user) return;
    
    setMobileMenuOpen(false);

    try {
      console.log('🔐 Starting SSO redirect for user:', user.id);
      
      // Call the reactapp/v1/vendor-sso endpoint
      const response = await fetch(`${VENDOR_SSO_ENDPOINT}?user_id=${user.id}`, {
        method: 'GET',
        credentials: 'include', // Important: Include cookies for WordPress session
      });

      if (!response.ok) {
        console.error(`❌ SSO request failed: ${response.status} ${response.statusText}`);
        
        if (response.status === 404) {
          toast.error('Vendor SSO endpoint not found. Please ensure the WordPress plugin is installed.');
        } else if (response.status >= 500) {
          toast.error('WordPress server error. Please try again later.');
        } else {
          toast.error(`Failed to connect to vendor dashboard (${response.status})`);
        }
        
        return;
      }

      const data = await response.json();
      console.log('✅ SSO Response:', data);

      if (data.success && data.dashboard_url) {
        console.log('✅ SSO successful! Redirecting to:', data.dashboard_url);
        // Redirect to Dokan dashboard
        window.location.href = data.dashboard_url;
      } else if (data.code === 'not_vendor') {
        console.error('❌ User is not a Dokan vendor');
        toast.error('You are not registered as a vendor. Please contact support.');
      } else if (data.code === 'invalid_user') {
        console.error('❌ Invalid user');
        toast.error('User not found. Please try logging in again.');
      } else {
        console.error('❌ SSO error:', data);
        toast.error(data.message || 'Failed to access vendor dashboard. Please try again.');
      }
    } catch (error) {
      console.error('❌ Error during SSO:', error);
      
      if (error instanceof TypeError && error.message.includes('fetch')) {
        toast.error('Cannot connect to WordPress. Please check if the site is accessible.');
      } else {
        toast.error('Failed to access vendor dashboard. Please check your connection.');
      }
    }
  };

  /**
   * Main navigation links configuration
   * Each link includes:
   * - label: Display text
   * - path: Route path
   */
  const mainNavLinks = [
    { label: 'Shop Local', path: '/products' },
    { label: 'Vendors', path: '/vendors' },
    { label: 'Deals', path: '/deals' },
    { label: 'How It Works', path: '/how-it-works' },
    { label: 'Become a Seller', path: '/sell' },
    { label: 'Help', path: '/help' },
    { label: 'About', path: '/about' }
  ];

  const handleSearch = () => {
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setMobileMenuOpen(false);
    } else {
      router.push('/search');
    }
  };

  return (
    <nav className="sticky top-0 z-50">
      {/* ============================================
          TOP BAR - WHITE SECTION
          Contains logo, search bar, and action buttons
          ============================================ */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo - Clickable, navigates to homepage */}
            <div 
              className="cursor-pointer"
              onClick={() => router.push('/')}
            >
              <img 
                src={logoImage}
                alt="Berlin Housewares - General Store & MarketPlace"
                className="h-10 sm:h-12"
              />
            </div>

            {/* Search Bar - Center (Desktop only) */}
            <div className="hidden md:flex flex-1 max-w-md mx-8">
              <div className="relative w-full">
                {/* Search Input - Triggers search on Enter key */}
                <input
                  type="text"
                  placeholder="Search products, vendors..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleSearch();
                    }
                  }}
                  className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                />
                {/* Search Icon Button */}
                <button 
                  onClick={handleSearch}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                >
                  <Search className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                </button>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-6 ">
              {/* Cart Button with Badge (Desktop only) */}
              <button 
                onClick={() => setCartOpen(!cartOpen)}
                className="flex flex-col items-center gap-1 text-gray-700 hover:text-gray-900 transition-colors relative"
              >
                <ShoppingCart className="w-5 h-5" />
                {/* Cart Item Count Badge */}
                <span className="absolute -top-1 -right-1 bg-green-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center text-[10px]">
                  3
                </span>
                <span className="text-xs">Checkout</span>
              </button>
              
              {/* Contact Us Button (Desktop only) */}
              <button 
                onClick={() => router.push('/contact')}
                className="flex flex-col items-center gap-1 text-gray-700 hover:text-gray-900 transition-colors"
              >
                <Phone className="w-5 h-5" />
                <span className="text-xs">Contact Us</span>
              </button>
            </div>
            {/* Right Action Icons (Desktop) and Mobile Menu Button */}
            <div className="flex items-center justify-end md:justify-between  ml-8 ">
              {/* Left Group: Checkout and Contact */}

              {/* Right Group: User Menu or Login/Register */}
              <div className="hidden md:flex items-center gap-6">
                {isAuthenticated ? (
                  <UserMenu />
                ) : (
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => router.push('/login')}
                      className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-gray-900 transition-colors"
                    >
                      <LogIn className="w-4 h-4" />
                      <span className="text-sm">Login</span>
                    </button>
                    <button 
                      onClick={() => router.push('/register')}
                      className="px-4 py-2 bg-[#F57C00] hover:bg-[#E67000] text-white rounded-md transition-colors text-sm"
                    >
                      Sign Up
                    </button>
                  </div>
                )}
              </div>

              {/* Mobile Menu Toggle Button */}
              <button
                className="md:hidden p-2 -mr-2"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ============================================
          MAIN NAVIGATION - DARK SECTION
          Primary navigation links (Desktop only)
          ============================================ */}
      <div className="bg-[#272621] hidden md:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-12">
            {mainNavLinks.map((link) => (
              <button
                key={link.path}
                onClick={() => router.push(link.path)}
                className={`flex items-center gap-1 px-4 py-3 text-white transition-colors text-sm ${
                  pathname === link.path ? 'bg-green-500/10' : 'hover:bg-green-500/5'
                }`}
              >
                {link.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ============================================
          PROMOTIONAL BANNER - DARK SPRUCE SECTION
          Marketing messages and promotions
          ============================================ */}
      <div className="bg-green-500 text-white text-center py-2">
        <p className="text-sm">
          <span className="font-semibold">Free Shipping</span> on Orders over $50 | <span className="font-semibold">Support Local Sellers</span>
        </p>
      </div>

      {/* ============================================
          MOBILE MENU
          Slide-down menu for mobile devices
          ============================================ */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-gray-200">
          <div className="px-4 py-4 space-y-3">
            
            {/* Mobile Search Bar */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search products, vendors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSearch();
                  }
                }}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>

            {/* Mobile Navigation Links */}
            <div className="space-y-1">
              {mainNavLinks.map((link) => (
                <button
                  key={link.path}
                  onClick={() => {
                    router.push(link.path);
                    setMobileMenuOpen(false); // Close menu after navigation
                  }}
                  className={`flex items-center justify-between w-full px-4 py-3 rounded-md text-sm ${
                    pathname === link.path 
                      ? 'bg-[#D2D0B9] text-[#0F120C]' 
                      : 'text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  {link.label}
                </button>
              ))}
            </div>

            {/* Mobile Action Buttons Grid */}
            <div className="grid grid-cols-3 gap-2 pt-4 border-t border-gray-200">
              
              {/* Account/Login Button */}
              {isAuthenticated ? (
                <button 
                  onClick={() => {
                    router.push('/account-settings');
                    setMobileMenuOpen(false);
                  }}
                  className="flex flex-col items-center gap-1 p-3 text-gray-700 hover:bg-gray-50 rounded-md"
                >
                  <User className="w-5 h-5" />
                  <span className="text-xs">Account</span>
                </button>
              ) : (
                <button 
                  onClick={() => {
                    router.push('/login');
                    setMobileMenuOpen(false);
                  }}
                  className="flex flex-col items-center gap-1 p-3 text-gray-700 hover:bg-gray-50 rounded-md"
                >
                  <LogIn className="w-5 h-5" />
                  <span className="text-xs">Login</span>
                </button>
              )}
              
              {/* Cart Button with Badge */}
              <button 
                onClick={() => {
                  setCartOpen(true);
                  setMobileMenuOpen(false);
                }}
                className="flex flex-col items-center gap-1 p-3 text-gray-700 hover:bg-gray-50 rounded-md relative"
              >
                <ShoppingCart className="w-5 h-5" />
                {/* Cart Item Count Badge */}
                <span className="absolute top-1 right-1 bg-green-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center text-[10px]">
                  3
                </span>
                <span className="text-xs">Checkout</span>
              </button>
              
              {/* Contact Button */}
              <button 
                onClick={() => {
                  router.push('/contact');
                  setMobileMenuOpen(false);
                }}
                className="flex flex-col items-center gap-1 p-3 text-gray-700 hover:bg-gray-50 rounded-md"
              >
                <Phone className="w-5 h-5" />
                <span className="text-xs">Contact</span>
              </button>
            </div>

            {/* Sign Up Button (Mobile - Only when not authenticated) */}
            {!isAuthenticated && (
              <div className="pt-3">
                <button 
                  onClick={() => {
                    setMobileMenuOpen(false);
                    router.push('/register');
                  }}
                  className="w-full px-4 py-3 bg-[#F57C00] hover:bg-[#E67000] text-white rounded-md transition-colors"
                >
                  Sign Up
                </button>
              </div>
            )}

            {/* User Info & Logout (Mobile - Only when authenticated) */}
            {isAuthenticated && user && (
              <div className="pt-3 border-t border-gray-200 mt-3">
                <div className="px-4 py-3 bg-gray-50 rounded-lg mb-2">
                  <div className="text-sm text-gray-900 mb-1">{user.displayName}</div>
                  <div className="text-xs text-gray-500 mb-2">{user.email}</div>
                  <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs ${
                    user.role === 'vendor' || user.role === 'seller'
                      ? 'bg-green-100 text-green-700' 
                      : user.role === 'pending_vendor'
                      ? 'bg-yellow-100 text-yellow-700'
                      : 'bg-gray-100 text-gray-700'
                  }`}>
                    <span className="capitalize">{user.role.replace('_', ' ')}</span>
                  </div>
                </div>
                
                {/* My Dashboard Button (Mobile) - For all authenticated users */}
                <button 
                  onClick={() => {
                    router.push('/dashboard');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full px-4 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors flex items-center justify-center gap-2 mb-2"
                >
                  <Home className="w-4 h-4" />
                  <span>My Dashboard</span>
                </button>
                
                {/* Vendor Dashboard Button (Mobile) */}
                {(user.role === 'vendor' || user.role === 'pending_vendor') && (
                  <button 
                    onClick={handleVendorDashboardClick}
                    className="w-full px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-lg transition-colors flex items-center justify-center gap-2 mb-2"
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    <span>Vendor Dashboard</span>
                  </button>
                )}
                
                <button 
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                    router.push('/');
                  }}
                  className="w-full px-4 py-3 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Cart Drawer */}
      <CartDrawer open={cartOpen} onOpenChange={setCartOpen} />
    </nav>
  );
}