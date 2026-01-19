/**
 * mapping.ts - Data Transformation Utilities
 * 
 * This file contains functions to map WordPress/WooCommerce API responses
 * to our application's internal data structures.
 */

// WPProduct mirrors the final object structure including brand and UPC
interface WPProduct {
  id: string;
  name: string;
  slug: string;
  price: number;
  originalPrice: number;
  image: string;
  vendor: string;
  vendorSlug: string;
  category: string;
  brand: string;
  upc?: string; // added UPC
  description: string;
  tags: string[];
  acceptsOffers: boolean;
  isNew: boolean;
  isTrending: boolean;
  rating: number;
  reviewCount: number;
  stock: number;
  colors: string[];
  [key: string]: any; // allow extra fields
}

// MappedProduct identical to WPProduct
interface MappedProduct {
  id: string;
  name: string;
  slug: string;
  price: number;
  originalPrice: number;
  image: string;
  vendor: string;
  vendorSlug: string;
  category: string;
  brand: string;
  upc?: string; // added UPC
  description: string;
  tags: string[];
  acceptsOffers: boolean;
  isNew: boolean;
  isTrending: boolean;
  rating: number;
  reviewCount: number;
  stock: number;
  colors: string[];
}

/**
 * Maps a WordPress product to our internal Product interface
 * Ensures defaults and safe access with brand and UPC support
 * @param wpProduct - Raw product data from WordPress API
 * @returns Mapped product object
 */
export const mapWPProduct = (wpProduct: Partial<WPProduct>): MappedProduct => {
  // Extract vendor username from WordPress API
  let vendorSlug = wpProduct.vendorSlug || wpProduct.vendor_slug;
  
  // If vendorSlug not provided by API, we need to derive it from vendor name
  if (!vendorSlug) {
    // Check if vendor is an object with username
    if (typeof wpProduct.vendor === 'object' && wpProduct.vendor) {
      const vendorObj = wpProduct.vendor as any;
      vendorSlug = vendorObj.username || vendorObj.user_login || vendorObj.slug || vendorObj.user_nicename;
    }
    
    // Check for direct username fields
    if (!vendorSlug) {
      vendorSlug = (wpProduct as any).username ||           // Check username field
                   (wpProduct as any).store_username ||     // Check store_username
                   (wpProduct as any).vendor_username ||    // Check vendor_username
                   (wpProduct as any).user_login ||         // Check user_login
                   (wpProduct as any).author ||             // Check author
                   (wpProduct as any).author_name;          // Check author_name
    }
    
    // Last resort: derive from vendor display name
    if (!vendorSlug && typeof wpProduct.vendor === 'string') {
      const vendorName = wpProduct.vendor;
      vendorSlug = vendorName
        .toLowerCase()
        .replace(/\s+store$/i, '')      // Remove " Store"
        .replace(/\s+shop$/i, '')       // Remove " Shop"  
        .replace(/\s+market$/i, '')     // Remove " Market"
        .replace(/['\"`]/g, '')          // Remove quotes
        .replace(/\s+/g, '')            // Remove ALL spaces
        .replace(/[^a-z0-9]/g, '');     // Remove special chars including hyphens
    }
  }
  
  // Handle image URL from various WooCommerce formats
  let imageUrl = wpProduct.image || '';
  
  // Check for WooCommerce image objects
  if (!imageUrl && (wpProduct as any).images && Array.isArray((wpProduct as any).images)) {
    const images = (wpProduct as any).images;
    if (images.length > 0 && images[0].src) {
      imageUrl = images[0].src;
    }
  }
  
  // Check for featured_image or thumbnail
  if (!imageUrl) {
    imageUrl = (wpProduct as any).featured_image || 
               (wpProduct as any).thumbnail || 
               (wpProduct as any).image_url ||
               '';
  }
  
  return {
    id: wpProduct.id ?? "0",
    name: wpProduct.name ?? "Unnamed Product",
    slug: wpProduct.slug ?? "",
    price: wpProduct.price ?? 0,
    originalPrice: wpProduct.originalPrice ?? wpProduct.price ?? 0,
    image: imageUrl,
    vendor: wpProduct.vendor ?? "Default Vendor",
    vendorSlug: vendorSlug ?? "default-vendor",
    category: wpProduct.category ?? "Uncategorized",
    brand: wpProduct.brand ?? "Unknown Brand",
    upc: wpProduct.upc ?? "", // set UPC
    description: wpProduct.description ?? "",
    tags: wpProduct.tags ?? [],
    acceptsOffers: wpProduct.acceptsOffers ?? true,
    isNew: wpProduct.isNew ?? true,
    isTrending: wpProduct.isTrending ?? true,
    rating: wpProduct.rating ?? 0,
    reviewCount: wpProduct.reviewCount ?? 0,
    stock: wpProduct.stock ?? 0,
    colors: wpProduct.colors ?? ["#000000"],
  };
};

/**
 * Maps a WordPress vendor to our internal Vendor interface
 * @param wpVendor - Raw vendor data from WordPress API
 * @returns Mapped vendor object
 */
export const mapWPVendor = (wpVendor: any) => {
  return {
    id: wpVendor.id?.toString() || wpVendor.vendor_id?.toString() || '',
    name: wpVendor.name || wpVendor.store_name || wpVendor.shop_name || '',
    slug: wpVendor.slug || wpVendor.store_slug || '',
    logo: wpVendor.logo || wpVendor.gravatar || wpVendor.avatar || 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=400',
    banner: wpVendor.banner || wpVendor.banner_url || 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200',
    tagline: wpVendor.tagline || wpVendor.shop_description || '',
    bio: wpVendor.bio || wpVendor.description || wpVendor.about || 'No description available',
    location: wpVendor.location || wpVendor.address?.city || wpVendor.address?.state || wpVendor.city || 'Location not specified',
    specialty: wpVendor.specialty || wpVendor.categories?.[0]?.name || wpVendor.category || 'General',
    rating: parseFloat(wpVendor.rating || wpVendor.average_rating || '4.5'),
    latitude: wpVendor.latitude || wpVendor.lat || wpVendor.address?.latitude || '',
    longitude: wpVendor.longitude || wpVendor.lng || wpVendor.address?.longitude || '',
    distance: wpVendor.distance || 0,
    socialLinks: {
      website: wpVendor.website || wpVendor.social?.website || '',
      instagram: wpVendor.instagram || wpVendor.social?.instagram || '',
      facebook: wpVendor.facebook || wpVendor.social?.fb || wpVendor.social?.facebook || '',
      twitter: wpVendor.twitter || wpVendor.social?.twitter || ''
    },
    policies: {
      shipping: wpVendor.shipping_policy || wpVendor.policies?.shipping || 'Standard shipping applies. Contact store for details.',
      returns: wpVendor.return_policy || wpVendor.policies?.returns || '30-day return policy. Items must be in original condition.',
      faqs: wpVendor.faqs || wpVendor.policies?.faqs || 'Contact the store for any questions or concerns.'
    }
  };
};