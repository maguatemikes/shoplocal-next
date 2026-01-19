import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../contexts/AuthContext';
import { User, LogOut, Settings, ChevronDown, LayoutDashboard, Home } from 'lucide-react';
import { toast } from 'sonner';
import { config } from '../lib/config';

// WordPress SSO Configuration
const WORDPRESS_API_URL = 'https://shoplocal.kinsta.cloud/wp-json';
const MAGIC_LINK_ENDPOINT = `${WORDPRESS_API_URL}/reactapp/v1/request-magic-link`;
const SSO_API_KEY = 'a8f7b2c9d4e6f1a3b5c7d9e2f4a6b8c0d2e4f6a8b0c2d4e6f8a0b2c4d6e8f0a2';

// IMPORTANT: WordPress MUST have the Magic Link SSO PHP code installed
// The API key above must match the key in WordPress wp-config.php or plugin

// Session storage key
const WP_SESSION_KEY = 'shoplocal_wp_session';

export function UserMenu() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [listingsCount, setListingsCount] = useState(0);
  const [isGeneratingToken, setIsGeneratingToken] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch claimed listings count on mount (for badge)
  useEffect(() => {
    if (user && (user.role === 'vendor' || user.role === 'seller' || user.role === 'pending_vendor')) {
      fetchClaimedListingsCount();
    }
  }, [user]);

  const fetchClaimedListingsCount = async () => {
    if (!user) return;
    
    try {
      // Fetch from GeoDirectory API - filter by user's email or ID
      const response = await fetch(
        `${config.api.geodir}/places?author=${user.id}&claimed=1&per_page=50`
      );
      
      if (response.ok) {
        const data = await response.json();
        
        // TEMPORARY DEMO: If no claimed listings, set count to 2 for demo
        if (data.length === 0 && (user.role === 'vendor' || user.role === 'seller')) {
          setListingsCount(3); // Demo count
        } else {
          setListingsCount(data.length);
        }
      }
    } catch (error) {
      console.error('Failed to fetch claimed listings count:', error);
    }
  };

  if (!user) return null;

  const handleLogout = () => {
    // Clear WordPress session on logout
    localStorage.removeItem(WP_SESSION_KEY);
    console.log('🗑️ WordPress session cleared on logout');
    
    logout();
    router.push('/');
    setIsOpen(false);
  };

  // Show dashboard link for vendors
  const isVendor = user.role === 'vendor' || user.role === 'seller' || user.role === 'pending_vendor';

  // Handle SSO redirect to WordPress Dokan Dashboard using Magic Link
  const handleVendorDashboardClick = async () => {
    if (!user || !user.email) {
      toast.error('User email not found. Please log in again.');
      return;
    }
    
    setIsOpen(false);
    setIsGeneratingToken(true);

    try {
      console.log('🔐 Requesting magic link for:', user.email);
      
      // Call the magic link endpoint
      // API key sent in body to avoid CORS preflight issues
      const response = await fetch(MAGIC_LINK_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: user.email,
          api_key: SSO_API_KEY
        })
      });

      if (!response.ok) {
        console.error(`❌ Magic link request failed: ${response.status}`);
        
        if (response.status === 404) {
          toast.error('User not found in WordPress. Please contact support.');
        } else if (response.status === 403) {
          toast.error('You do not have vendor access. Please contact support.');
        } else if (response.status >= 500) {
          toast.error('WordPress server error. Please try again later.');
        } else {
          toast.error(`Failed to generate login link (${response.status})`);
        }
        
        setIsGeneratingToken(false);
        return;
      }

      const data = await response.json();
      console.log('✅ Magic link response:', data);

      if (data.success && data.url) {
        console.log('✅ Redirecting to magic link URL');
        toast.success('Redirecting to vendor dashboard...');
        
        // Store session timestamp
        storeWordPressSession();
        
        // Redirect to the magic link URL
        window.location.href = data.url;
      } else {
        console.error('❌ Magic link error:', data);
        toast.error(data.message || 'Failed to generate login link');
        setIsGeneratingToken(false);
      }
    } catch (error) {
      console.error('❌ Error requesting magic link:', error);
      
      if (error instanceof TypeError && error.message.includes('fetch')) {
        toast.error('Cannot connect to WordPress. Please check your connection.');
      } else {
        toast.error('Failed to access vendor dashboard. Please try again.');
      }
      
      setIsGeneratingToken(false);
    }
  };

  // Check if user has an active WordPress session
  const checkWordPressSession = (): boolean => {
    try {
      const sessionData = localStorage.getItem(WP_SESSION_KEY);
      if (!sessionData) return false;

      const session = JSON.parse(sessionData);
      const now = Date.now();
      const sessionAge = now - session.timestamp;
      
      // Session is valid for 24 hours (86400000 milliseconds)
      const SESSION_DURATION = 24 * 60 * 60 * 1000;
      
      if (sessionAge < SESSION_DURATION && session.userId === user?.id) {
        return true;
      } else {
        // Session expired, remove it
        localStorage.removeItem(WP_SESSION_KEY);
        return false;
      }
    } catch (error) {
      console.error('Error checking WordPress session:', error);
      return false;
    }
  };

  // Store WordPress session info
  const storeWordPressSession = () => {
    try {
      const sessionData = {
        userId: user?.id,
        timestamp: Date.now()
      };
      localStorage.setItem(WP_SESSION_KEY, JSON.stringify(sessionData));
      console.log('💾 WordPress session stored');
    } catch (error) {
      console.error('Error storing WordPress session:', error);
    }
  };

  const menuItems = [
    {
      label: 'Summary',
      icon: Home,
      onClick: () => {
        router.push('/dashboard');
        setIsOpen(false);
      },
      show: true,
      isPrimary: true
    },
    {
      label: 'Vendor Dashboard',
      icon: LayoutDashboard,
      onClick: handleVendorDashboardClick,
      show: isVendor,
      badge: listingsCount > 0 ? listingsCount : undefined,
      isPrimary: false,
      isLoading: isGeneratingToken
    },
    {
      label: 'Account Settings',
      icon: Settings,
      onClick: () => {
        router.push('/account-settings');
        setIsOpen(false);
      },
      show: true,
      isPrimary: false
    }
  ];

  return (
    <div className="relative" ref={menuRef}>
      {/* User Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 px-4 py-2 rounded-xl hover:bg-gray-100 transition-colors relative"
      >
        <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center relative">
          <User className="w-5 h-5 text-white" />
          {isVendor && listingsCount > 0 && (
            <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center border-2 border-white">
              <span className="text-xs text-white">{listingsCount}</span>
            </div>
          )}
        </div>
        <div className="hidden md:block text-left">
          <div className="text-base text-gray-900">{user.username || user.email.split('@')[0]}</div>
          <div className="text-xs text-gray-500 capitalize">{user.role.replace('_', ' ')}</div>
        </div>
        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50">
          {/* User Info */}
          <div className="px-4 py-3 border-b border-gray-100">
            <div className="text-sm text-gray-900 mb-1">{user.displayName}</div>
            <div className="text-xs text-gray-500">{user.email}</div>
            <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs mt-2 ${
              user.role === 'vendor' || user.role === 'seller'
                ? 'bg-green-100 text-green-700' 
                : user.role === 'pending_vendor'
                ? 'bg-yellow-100 text-yellow-700'
                : 'bg-gray-100 text-gray-700'
            }`}>
              <span className="capitalize">{user.role.replace('_', ' ')}</span>
            </div>
          </div>

          {/* Menu Items */}
          <div className="py-2">
            {menuItems.filter(item => item.show).map((item, index) => {
              const Icon = item.icon;
              const isLoading = item.isLoading;
              return (
                <button
                  key={index}
                  onClick={item.onClick}
                  disabled={isLoading}
                  className="w-full px-4 py-2 hover:bg-gray-50 transition-colors flex items-center gap-3 text-left group disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Icon className="w-5 h-5 text-gray-400 group-hover:text-green-500 transition-colors" />
                  <span className="text-sm text-gray-700 group-hover:text-gray-900 flex-1">
                    {item.label} {isLoading && '...'}
                  </span>
                  {item.badge && !isLoading && (
                    <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Logout */}
          <div className="border-t border-gray-100 pt-2">
            <button
              onClick={handleLogout}
              className="w-full px-4 py-2 hover:bg-red-50 transition-colors flex items-center gap-3 text-left"
            >
              <LogOut className="w-5 h-5 text-red-500" />
              <span className="text-sm text-red-600">Logout</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}