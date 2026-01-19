/**
 * mockData.ts - Application Mock Data & Type Definitions
 * 
 * This file contains:
 * 1. TypeScript interfaces for data models (Vendor, Product, MarketplaceItem)
 * 2. Mock data arrays for development and demonstration
 * 3. Sample vendors, products, and marketplace items
 * 
 * Used throughout the application for displaying sample content.
 * In production, this would be replaced with API calls to a real database.
 * 
 * @module mockData
 */

// ============================================
// TYPE DEFINITIONS
// ============================================

/**
 * Vendor Interface
 * Represents a seller/vendor on the platform
 * 
 * @property {string} id - Unique identifier
 * @property {string} name - Display name of the vendor
 * @property {string} slug - URL-friendly identifier
 * @property {string} logo - Logo image URL
 * @property {string} banner - Banner image URL for vendor page
 * @property {string} tagline - Short marketing tagline
 * @property {string} bio - Full vendor description
 * @property {string} specialty - Vendor's specialty/category
 * @property {number} categoryId - Optional category ID
 * @property {number} rating - Average rating (1-5)
 * @property {string} location - Physical location
 * @property {string} latitude - Latitude coordinate for location
 * @property {string} longitude - Longitude coordinate for location
 * @property {number} distance - Distance from user's location in miles
 * @property {number} claimed - 0 = unclaimed, 1 = claimed by business owner
 * @property {boolean} verified - Admin-approved verified status
 * @property {string} [brand] - Optional brand name
 * @property {string} [upc] - Optional UPC code
 * // Additional storefront fields
 * @property {number} [visits] - Optional number of visits to the storefront
 * @property {number} [totalSales] - Optional total sales amount
 * @property {number} [yearsInBusiness] - Optional number of years in business
 * @property {string} [responseTime] - Optional average response time
 * @property {number} [reviewCount] - Optional number of reviews
 * @property {number} [followers] - Optional number of followers
 * @property {object} [socialLinks] - Optional social media links
 * @property {object} policies - Vendor policies (shipping, returns, FAQs)
 */
export interface Vendor {
  id: string;
  name: string;
  slug: string;
  dokanUsername?: string; // Dokan vendor username for storefront navigation
  logo: string;
  banner: string;
  tagline: string;
  bio: string;
  specialty: string;
  categoryId?: number;
  rating: number;
  location: string;
  latitude?: string;
  longitude?: string;
  distance?: number; // Distance from user's location in miles
  claimed?: number; // 0 = unclaimed, 1 = claimed by business owner
  verified?: boolean; // Admin-approved verified status
  brand?: string;
  upc?: string;
  // Additional storefront fields
  visits?: number;
  totalSales?: number;
  yearsInBusiness?: number;
  responseTime?: string;
  reviewCount?: number;
  followers?: number;
  socialLinks?: {
    instagram?: string;
    website?: string;
    facebook?: string;
    twitter?: string;
  };
  policies: {
    shipping: string;
    returns: string;
    faqs: string;
  };
}

/**
 * Product Interface
 * Represents a product listing
 * 
 * @property {string} id - Unique identifier
 * @property {string} name - Product name
 * @property {string} slug - URL-friendly identifier
 * @property {number} price - Current price
 * @property {string} image - Product image URL
 * @property {string} vendor - Vendor name
 * @property {string} vendorSlug - Vendor slug for linking
 * @property {string} category - Product category
 * @property {string} description - Full product description
 * @property {string[]} tags - Search/filter tags
 * @property {boolean} acceptsOffers - Whether vendor accepts price offers
 * @property {boolean} isNew - New product badge
 * @property {boolean} isTrending - Trending product badge
 * @property {number} [rating] - Optional average rating
 * @property {number} [reviewCount] - Optional number of reviews
 * @property {number} [stock] - Optional stock quantity
 * @property {number} [originalPrice] - Optional original price (for discounts)
 * @property {string[]} [colors] - Optional available colors
 */
export interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  image: string;
  vendor: string | { name: string };
  vendorSlug: string;
  category: string;
  description: string;
  tags: string[];
  acceptsOffers: boolean;
  isNew: boolean;
  isTrending: boolean;
  rating?: number;
  reviewCount?: number;
  stock?: number;
  originalPrice?: number;
  colors?: string[];
}

/**
 * MarketplaceItem Interface
 * Represents items in the broader marketplace (beyond standard products)
 * Includes services, rentals, events, food, etc.
 * 
 * @property {string} id - Unique identifier
 * @property {string} name - Item name
 * @property {string} slug - URL-friendly identifier
 * @property {number} price - Price (or starting price for auctions)
 * @property {string} image - Item image URL
 * @property {string} vendor - Vendor/seller name
 * @property {string} marketplaceCategory - Main category
 * @property {string} subCategory - Subcategory within main category
 * @property {string} description - Item description
 * @property {string[]} tags - Search/filter tags
 * @property {boolean} isNew - New listing badge
 * @property {string} [location] - Optional physical location
 * @property {string} [date] - Optional date (for events/auctions)
 * @property {string} [duration] - Optional duration (for rentals)
 */
export interface MarketplaceItem {
  id: string;
  name: string;
  slug: string;
  price: number;
  image: string;
  vendor: string;
  marketplaceCategory: 'Products' | 'Food' | 'Rentals' | 'Services' | 'Used Goods' | 'Auctions' | 'Local Community' | 'Events';
  subCategory: string;
  description: string;
  tags: string[];
  isNew: boolean;
  location?: string;
  date?: string;
  duration?: string;
}

// ============================================
// MOCK DATA: VENDORS
// Sample vendor data for demonstration
// ============================================

export const vendors: Vendor[] = [
  {
    id: '1',
    name: 'Jhimson Clothing',
    slug: 'jhimson-clothing',
    logo: 'https://images.unsplash.com/photo-1523359346063-d879354c0ea5?w=200&h=200&fit=crop',
    banner: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=1200&h=400&fit=crop',
    tagline: 'Premium streetwear and custom apparel',
    bio: 'Jhimson Clothing offers premium streetwear, custom embroidery, and screen printing services. We specialize in high-quality fashion apparel for brands and individuals who demand the best.',
    specialty: 'Streetwear & Custom Apparel',
    categoryId: 1,
    rating: 4.9,
    location: 'New York, NY',
    latitude: '40.7128',
    longitude: '-74.0060',
    verified: true, // Verified by admin ✅
    brand: 'Jhimson',
    upc: '987654321098',
    // Additional storefront fields
    visits: 1500,
    totalSales: 50000,
    yearsInBusiness: 5,
    responseTime: '1-2 days',
    reviewCount: 156,
    followers: 2000,
    socialLinks: {
      instagram: 'https://instagram.com/jhimsonclothing',
      website: 'https://jhimsonclothing.com',
      facebook: 'https://facebook.com/jhimsonclothing',
      twitter: 'https://twitter.com/jhimsonclothing'
    },
    policies: {
      shipping: 'We ship within 2-4 business days via USPS Priority Mail. Free shipping on orders over $150.',
      returns: '30-day return policy on all unworn items with tags attached.',
      faqs: 'Custom orders require 50% deposit. Turnaround time is 7-14 days for custom work.'
    }
  },
  {
    id: '2',
    name: 'Test 5 Store',
    slug: 'test-5',
    logo: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=200&h=200&fit=crop',
    banner: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&h=400&fit=crop',
    tagline: 'Quality products and exceptional service',
    bio: 'Test 5 Store is your go-to destination for a wide variety of quality products. We pride ourselves on customer satisfaction and fast shipping. Whether you\'re looking for electronics, fashion, or home goods, we have something for everyone.',
    specialty: 'General Merchandise',
    categoryId: 1,
    rating: 4.7,
    location: 'San Francisco, CA',
    latitude: '37.7749',
    longitude: '-122.4194',
    brand: 'Test5',
    upc: '555555555555',
    socialLinks: {
      instagram: 'https://instagram.com/test5store',
      website: 'https://test5store.com'
    },
    policies: {
      shipping: 'Free shipping on orders over $50. Standard delivery takes 3-5 business days.',
      returns: '30-day hassle-free returns. No questions asked.',
      faqs: 'We offer price matching and bulk discounts. Contact us for more information.'
    }
  },
  {
    id: '3',
    name: 'Green Threads Co.',
    slug: 'green-threads-co',
    logo: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=200&h=200&fit=crop',
    banner: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&h=400&fit=crop',
    tagline: 'Sustainable fashion for conscious brands',
    bio: 'We create eco-friendly apparel and custom embroidered products for businesses that care about the planet. All our materials are sustainably sourced and ethically produced.',
    specialty: 'Eco-Friendly Apparel',
    categoryId: 1,
    rating: 4.8,
    location: 'Portland, OR',
    latitude: '45.5231',
    longitude: '-122.6765',
    brand: 'EcoWear',
    upc: '123456789012',
    socialLinks: {
      instagram: 'https://instagram.com/greenthreads',
      website: 'https://greenthreads.example.com'
    },
    policies: {
      shipping: 'We ship within 3-5 business days via USPS or UPS. Free shipping on orders over $200.',
      returns: '30-day return policy on all unused items in original packaging.',
      faqs: 'Minimum order quantity is 25 units for custom orders. Standard items have no MOQ.'
    }
  },
  {
    id: '4',
    name: 'Artisan Crafts Studio',
    slug: 'artisan-crafts-studio',
    logo: 'https://images.unsplash.com/photo-1611224885990-ab7363d1f2b2?w=200&h=200&fit=crop',
    banner: 'https://images.unsplash.com/photo-1452860606245-08befc0ff44b?w=1200&h=400&fit=crop',
    tagline: 'Handmade goods with a personal touch',
    bio: 'Family-owned business specializing in handcrafted leather goods, ceramics, and wooden products. Each item is made with care and attention to detail.',
    specialty: 'Handmade Leather & Wood',
    categoryId: 2,
    rating: 4.9,
    location: 'Austin, TX',
    latitude: '30.2672',
    longitude: '-97.7431',
    brand: 'Artisan Collection',
    upc: '234567890123',
    policies: {
      shipping: 'Ships in 5-7 business days. Express shipping available.',
      returns: '14-day return policy. Custom items are final sale.',
      faqs: 'Lead time for custom orders is 2-3 weeks.'
    }
  },
  {
    id: '5',
    name: 'Custom Print House',
    slug: 'custom-print-house',
    logo: 'https://images.unsplash.com/photo-1626785774625-ddcddc3445e9?w=200&h=200&fit=crop',
    banner: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=1200&h=400&fit=crop',
    tagline: 'Professional printing for your brand',
    bio: 'We offer high-quality screen printing, DTG, and embroidery services. Perfect for promotional products, corporate gifts, and retail merchandise.',
    specialty: 'Custom Printing & Embroidery',
    categoryId: 3,
    rating: 4.7,
    location: 'Los Angeles, CA',
    latitude: '34.0522',
    longitude: '-118.2437',
    brand: 'PrintPro',
    upc: '345678901234',
    policies: {
      shipping: 'Standard shipping 7-10 days. Rush orders available.',
      returns: 'Returns accepted for defective items only.',
      faqs: 'Setup fees apply for new designs. Volume discounts available.'
    }
  },
  {
    id: '6',
    name: 'Natural Beauty Co.',
    slug: 'natural-beauty-co',
    logo: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=200&h=200&fit=crop',
    banner: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=1200&h=400&fit=crop',
    tagline: 'Organic skincare and beauty products',
    bio: 'We create natural, vegan skincare products using organic ingredients. Perfect for retailers looking to stock clean beauty brands.',
    specialty: 'Organic Skincare',
    categoryId: 4,
    rating: 4.9,
    location: 'Brooklyn, NY',
    latitude: '40.6501',
    longitude: '-73.9496',
    brand: 'NaturalGlow',
    upc: '456789012345',
    policies: {
      shipping: 'Ships within 2-4 business days. Temperature-controlled shipping in summer.',
      returns: '30-day satisfaction guarantee.',
      faqs: 'All products are cruelty-free and vegan. Wholesale pricing starts at 50% off retail.'
    }
  },
  {
    id: '7',
    name: 'Tech Accessories Hub',
    slug: 'tech-accessories-hub',
    logo: 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=200&h=200&fit=crop',
    banner: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=1200&h=400&fit=crop',
    tagline: 'Modern tech accessories for every device',
    bio: 'Curated collection of premium phone cases, laptop sleeves, and tech organizers. We work with designers worldwide to bring unique products to market.',
    specialty: 'Tech Accessories',
    categoryId: 5,
    rating: 4.6,
    location: 'San Francisco, CA',
    latitude: '37.7749',
    longitude: '-122.4194',
    brand: 'TechLife',
    upc: '567890123456',
    policies: {
      shipping: 'Free shipping on orders over $150. Ships in 3-5 days.',
      returns: '45-day return policy on all items.',
      faqs: 'Bulk discounts available. Custom branding options for orders over 100 units.'
    }
  },
  {
    id: '8',
    name: 'Sustainable Home Goods',
    slug: 'sustainable-home-goods',
    logo: 'https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=200&h=200&fit=crop',
    banner: 'https://images.unsplash.com/photo-1556911220-bff31c812dba?w=1200&h=400&fit=crop',
    tagline: 'Eco-friendly products for modern living',
    bio: 'We source and create sustainable home products including reusable containers, bamboo utensils, and organic textiles. Perfect for eco-conscious retailers.',
    specialty: 'Sustainable Home Products',
    categoryId: 6,
    rating: 4.8,
    location: 'Seattle, WA',
    latitude: '47.6062',
    longitude: '-122.3321',
    brand: 'EcoHome',
    upc: '678901234567',
    policies: {
      shipping: 'Carbon-neutral shipping available. Standard delivery 5-7 days.',
      returns: '60-day return policy.',
      faqs: 'Minimum order is $250. Custom packaging available for retailers.'
    }
  }
];

// ============================================
// MOCK DATA: PRODUCTS
// Sample product data for demonstration
// ============================================

export const products: Product[] = [
  {
    id: '1',
    name: 'Premium Streetwear Hoodie',
    slug: 'premium-streetwear-hoodie',
    price: 89.99,
    image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600&h=600&fit=crop',
    vendor: 'Jhimson Clothing',
    vendorSlug: 'jhimson-clothing',
    category: 'Streetwear',
    description: 'Premium quality hoodie with custom embroidery options. Made from heavyweight cotton blend.',
    tags: ['streetwear', 'hoodie', 'customizable'],
    acceptsOffers: true,
    isNew: true,
    isTrending: true,
    rating: 4.9,
    reviewCount: 156,
    stock: 85,
    originalPrice: 119.99,
    colors: ['#000000', '#FFFFFF', '#1F2937', '#DC2626', '#0EA5E9']
  },
  {
    id: '2',
    name: 'Custom Embroidered T-Shirt',
    slug: 'custom-embroidered-tshirt',
    price: 45.00,
    image: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=600&h=600&fit=crop',
    vendor: 'Jhimson Clothing',
    vendorSlug: 'jhimson-clothing',
    category: 'Streetwear',
    description: 'High-quality t-shirt with professional embroidery services. Perfect for brands and events.',
    tags: ['streetwear', 'tshirt', 'customizable', 'embroidery'],
    acceptsOffers: true,
    isNew: true,
    isTrending: true,
    rating: 4.8,
    reviewCount: 203,
    stock: 120,
    colors: ['#000000', '#FFFFFF', '#1F2937', '#DC2626', '#10B981', '#F59E0B']
  },
  {
    id: '3',
    name: 'Designer Joggers',
    slug: 'designer-joggers',
    price: 75.00,
    image: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600&h=600&fit=crop',
    vendor: 'Jhimson Clothing',
    vendorSlug: 'jhimson-clothing',
    category: 'Streetwear',
    description: 'Comfortable designer joggers with premium fabric and modern fit.',
    tags: ['streetwear', 'joggers', 'pants'],
    acceptsOffers: false,
    isNew: true,
    isTrending: true,
    rating: 4.7,
    reviewCount: 89,
    stock: 65,
    colors: ['#000000', '#1F2937', '#0EA5E9']
  },
  {
    id: '4',
    name: 'Snapback Cap Collection',
    slug: 'snapback-cap-collection',
    price: 35.00,
    image: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=600&h=600&fit=crop',
    vendor: 'Jhimson Clothing',
    vendorSlug: 'jhimson-clothing',
    category: 'Accessories',
    description: 'Premium snapback caps with custom embroidery available. Multiple colorways.',
    tags: ['accessories', 'hat', 'customizable'],
    acceptsOffers: true,
    isNew: false,
    isTrending: true,
    rating: 4.8,
    reviewCount: 145,
    stock: 200,
    colors: ['#000000', '#FFFFFF', '#DC2626', '#0EA5E9']
  },
  {
    id: '4a',
    name: 'Wireless Bluetooth Headphones',
    slug: 'wireless-bluetooth-headphones',
    price: 79.99,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=600&fit=crop',
    vendor: 'Test 5 Store',
    vendorSlug: 'test-5',
    category: 'Electronics',
    description: 'High-quality wireless headphones with noise cancellation and long battery life.',
    tags: ['electronics', 'audio', 'wireless'],
    acceptsOffers: true,
    isNew: true,
    isTrending: true,
    rating: 4.6,
    reviewCount: 89,
    stock: 45,
    colors: ['#000000', '#FFFFFF', '#DC2626']
  },
  {
    id: '4b',
    name: 'Smart Watch Pro',
    slug: 'smart-watch-pro',
    price: 199.99,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&h=600&fit=crop',
    vendor: 'Test 5 Store',
    vendorSlug: 'test-5',
    category: 'Electronics',
    description: 'Advanced smartwatch with fitness tracking, heart rate monitor, and mobile notifications.',
    tags: ['electronics', 'wearable', 'fitness'],
    acceptsOffers: false,
    isNew: true,
    isTrending: true,
    rating: 4.7,
    reviewCount: 134,
    stock: 30,
    colors: ['#000000', '#9CA3AF', '#DC2626']
  },
  {
    id: '4c',
    name: 'Portable Power Bank',
    slug: 'portable-power-bank',
    price: 39.99,
    image: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=600&h=600&fit=crop',
    vendor: 'Test 5 Store',
    vendorSlug: 'test-5',
    category: 'Electronics',
    description: '20000mAh portable charger with fast charging support for all devices.',
    tags: ['electronics', 'charger', 'portable'],
    acceptsOffers: true,
    isNew: false,
    isTrending: true,
    rating: 4.5,
    reviewCount: 256,
    stock: 120,
    colors: ['#000000', '#FFFFFF', '#0EA5E9']
  },
  {
    id: '4d',
    name: 'LED Desk Lamp',
    slug: 'led-desk-lamp',
    price: 45.99,
    image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600&h=600&fit=crop',
    vendor: 'Test 5 Store',
    vendorSlug: 'test-5',
    category: 'Home & Office',
    description: 'Adjustable LED desk lamp with multiple brightness levels and USB charging port.',
    tags: ['home', 'office', 'lighting'],
    acceptsOffers: false,
    isNew: true,
    isTrending: false,
    rating: 4.6,
    reviewCount: 78,
    stock: 65,
    colors: ['#000000', '#FFFFFF', '#9CA3AF']
  },
  {
    id: '5',
    name: 'Organic Cotton T-Shirt',
    slug: 'organic-cotton-tshirt',
    price: 18.50,
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&h=600&fit=crop',
    vendor: 'Green Threads Co.',
    vendorSlug: 'green-threads-co',
    category: 'Eco-Friendly',
    description: '100% organic cotton t-shirt. Perfect for custom printing and embroidery.',
    tags: ['apparel', 'organic', 'customizable'],
    acceptsOffers: true,
    isNew: true,
    isTrending: true,
    rating: 4.8,
    reviewCount: 234,
    stock: 150,
    originalPrice: 24.99,
    colors: ['#000000', '#FFFFFF', '#0EA5E9', '#10B981', '#F59E0B']
  },
  {
    id: '6',
    name: 'Recycled Tote Bag',
    slug: 'recycled-tote-bag',
    price: 12.00,
    image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=600&h=600&fit=crop',
    vendor: 'Green Threads Co.',
    vendorSlug: 'green-threads-co',
    category: 'Eco-Friendly',
    description: 'Durable tote bag made from recycled materials. Great for promotional giveaways.',
    tags: ['bags', 'recycled', 'promotional'],
    acceptsOffers: false,
    isNew: false,
    isTrending: true,
    rating: 4.6,
    reviewCount: 189,
    stock: 320,
    colors: ['#1F2937', '#DC2626', '#0EA5E9']
  },
  {
    id: '7',
    name: 'Handcrafted Leather Wallet',
    slug: 'handcrafted-leather-wallet',
    price: 45.00,
    image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=600&h=600&fit=crop',
    vendor: 'Artisan Crafts Studio',
    vendorSlug: 'artisan-crafts-studio',
    category: 'Handmade',
    description: 'Premium leather wallet with custom embossing available. Made to last.',
    tags: ['leather', 'handmade', 'customizable'],
    acceptsOffers: true,
    isNew: false,
    isTrending: false,
    rating: 4.9,
    reviewCount: 412,
    stock: 45,
    colors: ['#78350F', '#000000', '#7C2D12']
  },
  {
    id: '8',
    name: 'Custom Embroidered Hat',
    slug: 'custom-embroidered-hat',
    price: 22.00,
    image: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=600&h=600&fit=crop',
    vendor: 'Custom Print House',
    vendorSlug: 'custom-print-house',
    category: 'Customizable',
    description: 'High-quality baseball cap with custom embroidery. Multiple colors available.',
    tags: ['apparel', 'hats', 'customizable'],
    acceptsOffers: false,
    isNew: true,
    isTrending: true,
    rating: 4.7,
    reviewCount: 156,
    stock: 280,
    originalPrice: 28.00,
    colors: ['#000000', '#1F2937', '#DC2626', '#FFFFFF', '#0EA5E9', '#10B981']
  },
  {
    id: '9',
    name: 'Organic Face Serum',
    slug: 'organic-face-serum',
    price: 32.00,
    image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&h=600&fit=crop',
    vendor: 'Natural Beauty Co.',
    vendorSlug: 'natural-beauty-co',
    category: 'Eco-Friendly',
    description: 'All-natural face serum with vitamin C and hyaluronic acid. Vegan and cruelty-free.',
    tags: ['skincare', 'organic', 'vegan'],
    acceptsOffers: false,
    isNew: true,
    isTrending: true,
    rating: 4.8,
    reviewCount: 328,
    stock: 95,
    colors: ['#FDE68A', '#FCA5A5']
  },
  {
    id: '10',
    name: 'Bamboo Phone Case',
    slug: 'bamboo-phone-case',
    price: 28.00,
    image: 'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=600&h=600&fit=crop',
    vendor: 'Tech Accessories Hub',
    vendorSlug: 'tech-accessories-hub',
    category: 'Eco-Friendly',
    description: 'Sustainable bamboo phone case. Compatible with wireless charging.',
    tags: ['tech', 'bamboo', 'eco-friendly'],
    acceptsOffers: true,
    isNew: false,
    isTrending: false
  },
  {
    id: '11',
    name: 'Ceramic Coffee Mug Set',
    slug: 'ceramic-coffee-mug-set',
    price: 38.00,
    image: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=600&h=600&fit=crop',
    vendor: 'Artisan Crafts Studio',
    vendorSlug: 'artisan-crafts-studio',
    category: 'Handmade',
    description: 'Set of 4 handmade ceramic mugs. Each piece is unique.',
    tags: ['ceramics', 'handmade', 'drinkware'],
    acceptsOffers: false,
    isNew: false,
    isTrending: true
  },
  {
    id: '12',
    name: 'Reusable Water Bottle',
    slug: 'reusable-water-bottle',
    price: 24.00,
    image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=600&h=600&fit=crop',
    vendor: 'Sustainable Home Goods',
    vendorSlug: 'sustainable-home-goods',
    category: 'Eco-Friendly',
    description: 'Stainless steel water bottle. Custom engraving available.',
    tags: ['drinkware', 'sustainable', 'customizable'],
    acceptsOffers: true,
    isNew: true,
    isTrending: false
  },
  {
    id: '13',
    name: 'Screen Printed Poster',
    slug: 'screen-printed-poster',
    price: 15.00,
    image: 'https://images.unsplash.com/photo-1578320339911-9f895d8a49c9?w=600&h=600&fit=crop',
    vendor: 'Custom Print House',
    vendorSlug: 'custom-print-house',
    category: 'Customizable',
    description: 'Custom screen printed posters. Perfect for events and promotions.',
    tags: ['printing', 'customizable', 'promotional'],
    acceptsOffers: false,
    isNew: false,
    isTrending: false
  },
  {
    id: '14',
    name: 'Wooden Desk Organizer',
    slug: 'wooden-desk-organizer',
    price: 42.00,
    image: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=600&h=600&fit=crop',
    vendor: 'Artisan Crafts Studio',
    vendorSlug: 'artisan-crafts-studio',
    category: 'Handmade',
    description: 'Handcrafted wooden desk organizer. Sustainable walnut or oak.',
    tags: ['wood', 'handmade', 'office'],
    acceptsOffers: true,
    isNew: false,
    isTrending: false
  },
  {
    id: '15',
    name: 'Laptop Sleeve',
    slug: 'laptop-sleeve',
    price: 35.00,
    image: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=600&h=600&fit=crop',
    vendor: 'Tech Accessories Hub',
    vendorSlug: 'tech-accessories-hub',
    category: 'Customizable',
    description: 'Premium padded laptop sleeve. Custom branding available.',
    tags: ['tech', 'accessories', 'customizable'],
    acceptsOffers: false,
    isNew: true,
    isTrending: true
  },
  {
    id: '16',
    name: 'Bamboo Utensil Set',
    slug: 'bamboo-utensil-set',
    price: 16.00,
    image: 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=600&h=600&fit=crop',
    vendor: 'Sustainable Home Goods',
    vendorSlug: 'sustainable-home-goods',
    category: 'Eco-Friendly',
    description: 'Reusable bamboo utensil set with carrying case.',
    tags: ['bamboo', 'sustainable', 'kitchenware'],
    acceptsOffers: false,
    isNew: true,
    isTrending: true
  }
];

// ============================================
// MOCK DATA: CATEGORIES
// Sample product categories for demonstration
// ============================================

export const categories = [
  { name: 'Handmade', iconName: 'Palette' },
  { name: 'Eco-Friendly', iconName: 'Leaf' },
  { name: 'Customizable', iconName: 'Pencil' },
  { name: 'Limited Stock', iconName: 'Zap' }
];

// ============================================
// MOCK DATA: MARKETPLACE ITEMS
// Sample marketplace items for demonstration
// ============================================

// Marketplace items for the new Marketplace & Community section
export const marketplaceItems: MarketplaceItem[] = [
  // Products - Custom Gifts
  {
    id: 'mp1',
    name: 'Custom Keychain',
    slug: 'custom-keychain',
    price: 8.99,
    image: 'https://images.unsplash.com/photo-1742400911147-cec5992e93da?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjdXN0b20lMjBrZXljaGFpbnxlbnwxfHx8fDE3NjEzMTQwODh8MA&ixlib=rb-4.1.0&q=80&w=1080',
    vendor: 'Custom Print House',
    marketplaceCategory: 'Products',
    subCategory: 'Custom Gifts',
    description: 'Personalized keychains with custom engraving',
    tags: ['custom', 'gift', 'personalized'],
    isNew: true
  },
  {
    id: 'mp2',
    name: 'Engraved Photo Frame',
    slug: 'engraved-photo-frame',
    price: 24.99,
    image: 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=600&h=600&fit=crop',
    vendor: 'Artisan Crafts Studio',
    marketplaceCategory: 'Products',
    subCategory: 'Custom Gifts',
    description: 'Beautiful wooden frame with custom engraving options',
    tags: ['custom', 'gift', 'wood', 'personalized'],
    isNew: false
  },
  // Products - Toys
  {
    id: 'mp3',
    name: 'Stuffed Toy Dog',
    slug: 'stuffed-toy-dog',
    price: 15.99,
    image: 'https://images.unsplash.com/photo-1751110750385-03a586815aec?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHVmZmVkJTIwdG95JTIwZG9nfGVufDF8fHx8MTc2MTMxNDA4OHww&ixlib=rb-4.1.0&q=80&w=1080',
    vendor: 'Toy Makers Studio',
    marketplaceCategory: 'Products',
    subCategory: 'Toys',
    description: 'Soft and cuddly stuffed dog toy for kids',
    tags: ['toys', 'kids', 'plush'],
    isNew: true
  },
  {
    id: 'mp4',
    name: 'Panda Stuffed Animal',
    slug: 'panda-stuffed-animal',
    price: 18.99,
    image: 'https://images.unsplash.com/photo-1683761412430-ca62eda29b62?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYW5kYSUyMHN0dWZmZWQlMjBhbmltYWx8ZW58MXx8fHwxNzYxMzE0MDkzfDA&ixlib=rb-4.1.0&q=80&w=1080',
    vendor: 'Toy Makers Studio',
    marketplaceCategory: 'Products',
    subCategory: 'Toys',
    description: 'Adorable panda stuffed animal, perfect gift for children',
    tags: ['toys', 'kids', 'plush', 'panda'],
    isNew: true
  },
  {
    id: 'mp5',
    name: 'Colorful Building Blocks',
    slug: 'colorful-building-blocks',
    price: 29.99,
    image: 'https://images.unsplash.com/photo-1696527014341-a874bd839540?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2xvcmZ1bCUyMHRveXxlbnwxfHx8fDE3NjEyMzQ5NTJ8MA&ixlib=rb-4.1.0&q=80&w=1080',
    vendor: 'Toy Makers Studio',
    marketplaceCategory: 'Products',
    subCategory: 'Toys',
    description: 'Educational colorful building blocks set',
    tags: ['toys', 'kids', 'educational', 'blocks'],
    isNew: false
  },
  // Products - Sports
  {
    id: 'mp6',
    name: 'Professional Sportswear Jersey',
    slug: 'professional-sportswear-jersey',
    price: 45.99,
    image: 'https://images.unsplash.com/photo-1677124121040-b57ce9071901?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcG9ydHN3ZWFyJTIwamVyc2V5fGVufDF8fHx8MTc2MTMxNDA4N3ww&ixlib=rb-4.1.0&q=80&w=1080',
    vendor: 'Athletic Gear Pro',
    marketplaceCategory: 'Products',
    subCategory: 'Sports',
    description: 'High-performance athletic jersey for team sports',
    tags: ['sports', 'jersey', 'athletic', 'apparel'],
    isNew: true
  },
  {
    id: 'mp7',
    name: 'Sports Training Outfit',
    slug: 'sports-training-outfit',
    price: 65.99,
    image: 'https://images.unsplash.com/photo-1678356188535-1c23c93b0746?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcG9ydHMlMjBjbG90aGluZ3xlbnwxfHx8fDE3NjEyNjkyNTd8MA&ixlib=rb-4.1.0&q=80&w=1080',
    vendor: 'Athletic Gear Pro',
    marketplaceCategory: 'Products',
    subCategory: 'Sports',
    description: 'Complete training outfit for athletes',
    tags: ['sports', 'training', 'athletic', 'apparel'],
    isNew: false
  },
  // Products - Jewelry
  {
    id: 'mp8',
    name: 'Diamond Engagement Ring',
    slug: 'diamond-engagement-ring',
    price: 899.99,
    image: 'https://images.unsplash.com/photo-1629201690245-fa87a9c6598e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaWFtb25kJTIwcmluZyUyMGpld2Vscnl8ZW58MXx8fHwxNzYxMjk0NzU4fDA&ixlib=rb-4.1.0&q=80&w=1080',
    vendor: 'Luxury Jewelers',
    marketplaceCategory: 'Products',
    subCategory: 'Jewelry',
    description: 'Stunning diamond ring, perfect for engagements',
    tags: ['jewelry', 'diamond', 'ring', 'luxury'],
    isNew: true
  },
  {
    id: 'mp9',
    name: 'Gold Necklace Set',
    slug: 'gold-necklace-set',
    price: 249.99,
    image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600&h=600&fit=crop',
    vendor: 'Luxury Jewelers',
    marketplaceCategory: 'Products',
    subCategory: 'Jewelry',
    description: 'Elegant gold necklace with matching earrings',
    tags: ['jewelry', 'gold', 'necklace', 'luxury'],
    isNew: false
  },
  // Products - Clothes
  {
    id: 'mp10',
    name: 'Designer Summer Dress',
    slug: 'designer-summer-dress',
    price: 79.99,
    image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&h=600&fit=crop',
    vendor: 'Fashion Forward',
    marketplaceCategory: 'Products',
    subCategory: 'Clothes',
    description: 'Beautiful floral summer dress',
    tags: ['clothing', 'dress', 'fashion', 'summer'],
    isNew: true
  },
  {
    id: 'mp11',
    name: 'Men\'s Casual Jacket',
    slug: 'mens-casual-jacket',
    price: 89.99,
    image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&h=600&fit=crop',
    vendor: 'Fashion Forward',
    marketplaceCategory: 'Products',
    subCategory: 'Clothes',
    description: 'Stylish casual jacket for everyday wear',
    tags: ['clothing', 'jacket', 'menswear', 'casual'],
    isNew: false
  },
  // Food
  {
    id: 'mp12',
    name: 'Artisan Pizza Delivery',
    slug: 'artisan-pizza-delivery',
    price: 18.99,
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&h=600&fit=crop',
    vendor: 'Local Pizza Kitchen',
    marketplaceCategory: 'Food',
    subCategory: 'Pizza',
    description: 'Fresh artisan pizza made with local ingredients',
    tags: ['food', 'pizza', 'delivery', 'italian'],
    isNew: true,
    location: 'Downtown'
  },
  {
    id: 'mp13',
    name: 'Organic Salad Bowl',
    slug: 'organic-salad-bowl',
    price: 12.99,
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&h=600&fit=crop',
    vendor: 'Fresh & Healthy Cafe',
    marketplaceCategory: 'Food',
    subCategory: 'Healthy',
    description: 'Healthy organic salad with fresh vegetables',
    tags: ['food', 'healthy', 'salad', 'organic'],
    isNew: false,
    location: 'Midtown'
  },
  {
    id: 'mp14',
    name: 'Gourmet Burger Meal',
    slug: 'gourmet-burger-meal',
    price: 15.99,
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&h=600&fit=crop',
    vendor: 'The Burger Spot',
    marketplaceCategory: 'Food',
    subCategory: 'Burgers',
    description: 'Premium burger with fries and drink',
    tags: ['food', 'burger', 'american', 'meal'],
    isNew: true,
    location: 'Downtown'
  },
  // Rentals
  {
    id: 'mp15',
    name: 'Wedding Tent Rental',
    slug: 'wedding-tent-rental',
    price: 299.99,
    image: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=600&h=600&fit=crop',
    vendor: 'Event Rentals Co.',
    marketplaceCategory: 'Rentals',
    subCategory: 'Events',
    description: 'Large tent for weddings and events',
    tags: ['rental', 'event', 'wedding', 'tent'],
    isNew: false,
    duration: 'Per Day'
  },
  {
    id: 'mp16',
    name: 'Party Sound System',
    slug: 'party-sound-system',
    price: 150.00,
    image: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=600&h=600&fit=crop',
    vendor: 'Audio Equipment Rentals',
    marketplaceCategory: 'Rentals',
    subCategory: 'Audio/Video',
    description: 'Professional sound system for parties and events',
    tags: ['rental', 'audio', 'party', 'event'],
    isNew: true,
    duration: 'Per Day'
  },
  {
    id: 'mp17',
    name: 'Luxury Car Rental',
    slug: 'luxury-car-rental',
    price: 199.99,
    image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=600&h=600&fit=crop',
    vendor: 'Premium Auto Rentals',
    marketplaceCategory: 'Rentals',
    subCategory: 'Vehicles',
    description: 'Rent a luxury car for special occasions',
    tags: ['rental', 'car', 'luxury', 'vehicle'],
    isNew: true,
    duration: 'Per Day'
  },
  // Services
  {
    id: 'mp18',
    name: 'Professional Cleaning Service',
    slug: 'professional-cleaning-service',
    price: 120.00,
    image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600&h=600&fit=crop',
    vendor: 'Clean Team Pro',
    marketplaceCategory: 'Services',
    subCategory: 'Cleaning',
    description: 'Deep cleaning service for homes and offices',
    tags: ['service', 'cleaning', 'professional', 'home'],
    isNew: false,
    location: 'Local Area'
  },
  {
    id: 'mp19',
    name: 'Lawn Care & Landscaping',
    slug: 'lawn-care-landscaping',
    price: 85.00,
    image: 'https://images.unsplash.com/photo-1558904541-efa843a96f01?w=600&h=600&fit=crop',
    vendor: 'Green Lawn Services',
    marketplaceCategory: 'Services',
    subCategory: 'Lawn Care',
    description: 'Professional lawn maintenance and landscaping',
    tags: ['service', 'lawn', 'landscaping', 'outdoor'],
    isNew: true,
    location: 'Local Area'
  },
  {
    id: 'mp20',
    name: 'Plumbing Repair Service',
    slug: 'plumbing-repair-service',
    price: 95.00,
    image: 'https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=600&h=600&fit=crop',
    vendor: 'Expert Plumbers',
    marketplaceCategory: 'Services',
    subCategory: 'Plumbing',
    description: 'Fast and reliable plumbing repairs',
    tags: ['service', 'plumbing', 'repair', 'home'],
    isNew: false,
    location: 'Local Area'
  },
  // Used Goods
  {
    id: 'mp21',
    name: 'Vintage Leather Sofa',
    slug: 'vintage-leather-sofa',
    price: 350.00,
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&h=600&fit=crop',
    vendor: 'Second Hand Treasures',
    marketplaceCategory: 'Used Goods',
    subCategory: 'Furniture',
    description: 'Classic leather sofa in excellent condition',
    tags: ['used', 'furniture', 'vintage', 'sofa'],
    isNew: false,
    location: 'Downtown'
  },
  {
    id: 'mp22',
    name: 'Refurbished Laptop',
    slug: 'refurbished-laptop',
    price: 450.00,
    image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&h=600&fit=crop',
    vendor: 'Tech Resale',
    marketplaceCategory: 'Used Goods',
    subCategory: 'Electronics',
    description: 'Professionally refurbished laptop, like new',
    tags: ['used', 'electronics', 'laptop', 'refurbished'],
    isNew: true,
    location: 'Tech District'
  },
  {
    id: 'mp23',
    name: 'Antique Dining Table',
    slug: 'antique-dining-table',
    price: 580.00,
    image: 'https://images.unsplash.com/photo-1617806118233-18e1de247200?w=600&h=600&fit=crop',
    vendor: 'Antique Finds',
    marketplaceCategory: 'Used Goods',
    subCategory: 'Antiques',
    description: 'Beautiful antique oak dining table',
    tags: ['used', 'furniture', 'antique', 'dining'],
    isNew: false,
    location: 'Antique Row'
  },
  // Auctions
  {
    id: 'mp24',
    name: 'Rare Collectible Watch',
    slug: 'rare-collectible-watch',
    price: 1200.00,
    image: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=600&h=600&fit=crop',
    vendor: 'Auction House',
    marketplaceCategory: 'Auctions',
    subCategory: 'Jewelry',
    description: 'Vintage watch up for auction, starting bid',
    tags: ['auction', 'watch', 'collectible', 'luxury'],
    isNew: true,
    date: 'Ends Dec 30, 2025'
  },
  {
    id: 'mp25',
    name: 'Limited Edition Artwork',
    slug: 'limited-edition-artwork',
    price: 850.00,
    image: 'https://images.unsplash.com/photo-1561214115-f2f134cc4912?w=600&h=600&fit=crop',
    vendor: 'Art Auctions',
    marketplaceCategory: 'Auctions',
    subCategory: 'Art',
    description: 'Original artwork by local artist, current bid',
    tags: ['auction', 'art', 'painting', 'collectible'],
    isNew: true,
    date: 'Ends Dec 28, 2025'
  },
  {
    id: 'mp26',
    name: 'Vintage Guitar Collection',
    slug: 'vintage-guitar-collection',
    price: 2500.00,
    image: 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=600&h=600&fit=crop',
    vendor: 'Music Memorabilia Auctions',
    marketplaceCategory: 'Auctions',
    subCategory: 'Music',
    description: 'Rare vintage guitar, collector\'s item',
    tags: ['auction', 'guitar', 'vintage', 'music'],
    isNew: false,
    date: 'Ends Jan 5, 2026'
  },
  // Local Community
  {
    id: 'mp27',
    name: 'Community Yoga Classes',
    slug: 'community-yoga-classes',
    price: 15.00,
    image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=600&h=600&fit=crop',
    vendor: 'Wellness Center',
    marketplaceCategory: 'Local Community',
    subCategory: 'Fitness',
    description: 'Join our weekly community yoga sessions',
    tags: ['community', 'yoga', 'wellness', 'fitness'],
    isNew: true,
    location: 'Community Center',
    date: 'Every Saturday'
  },
  {
    id: 'mp28',
    name: 'Local Farmers Market',
    slug: 'local-farmers-market',
    price: 0,
    image: 'https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=600&h=600&fit=crop',
    vendor: 'Community Market',
    marketplaceCategory: 'Local Community',
    subCategory: 'Markets',
    description: 'Weekly farmers market with local produce',
    tags: ['community', 'market', 'local', 'food'],
    isNew: false,
    location: 'Main Street',
    date: 'Every Sunday'
  },
  {
    id: 'mp29',
    name: 'Neighborhood Book Club',
    slug: 'neighborhood-book-club',
    price: 0,
    image: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=600&h=600&fit=crop',
    vendor: 'Local Library',
    marketplaceCategory: 'Local Community',
    subCategory: 'Clubs',
    description: 'Monthly book club meetings, all welcome',
    tags: ['community', 'books', 'reading', 'social'],
    isNew: true,
    location: 'Public Library',
    date: 'First Monday'
  },
  // Events
  {
    id: 'mp30',
    name: 'Summer Music Festival',
    slug: 'summer-music-festival',
    price: 45.00,
    image: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=600&h=600&fit=crop',
    vendor: 'City Events',
    marketplaceCategory: 'Events',
    subCategory: 'Music',
    description: 'Three-day outdoor music festival',
    tags: ['event', 'music', 'festival', 'outdoor'],
    isNew: true,
    location: 'City Park',
    date: 'July 15-17, 2026'
  },
  {
    id: 'mp31',
    name: 'Food & Wine Tasting',
    slug: 'food-wine-tasting',
    price: 65.00,
    image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=600&h=600&fit=crop',
    vendor: 'Gourmet Events',
    marketplaceCategory: 'Events',
    subCategory: 'Food & Drink',
    description: 'Evening of wine tasting and gourmet food',
    tags: ['event', 'food', 'wine', 'tasting'],
    isNew: true,
    location: 'Downtown Plaza',
    date: 'Jan 20, 2026'
  },
  {
    id: 'mp32',
    name: 'Art Gallery Opening',
    slug: 'art-gallery-opening',
    price: 0,
    image: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=600&h=600&fit=crop',
    vendor: 'Modern Art Gallery',
    marketplaceCategory: 'Events',
    subCategory: 'Art',
    description: 'Grand opening of new art exhibition',
    tags: ['event', 'art', 'gallery', 'exhibition'],
    isNew: false,
    location: 'Art District',
    date: 'Jan 10, 2026'
  },
  // Additional Food items
  {
    id: 'mp33',
    name: 'Gourmet Dessert Platter',
    slug: 'gourmet-dessert-platter',
    price: 22.99,
    image: 'https://images.unsplash.com/photo-1680090966824-eb9e8500bc2b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZXNzZXJ0JTIwY2FrZXxlbnwxfHx8fDE3NjEyMjM4NjF8MA&ixlib=rb-4.1.0&q=80&w=1080',
    vendor: 'Sweet Treats Bakery',
    marketplaceCategory: 'Food',
    subCategory: 'Desserts',
    description: 'Assorted gourmet desserts and pastries',
    tags: ['food', 'dessert', 'bakery', 'sweets'],
    isNew: true,
    location: 'Downtown'
  },
  {
    id: 'mp34',
    name: 'Fresh Sushi Combo',
    slug: 'fresh-sushi-combo',
    price: 24.99,
    image: 'https://images.unsplash.com/photo-1708738749907-8618aaf409fc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdXNoaSUyMGFzaWFuJTIwZm9vZHxlbnwxfHx8fDE3NjEyODMwOTZ8MA&ixlib=rb-4.1.0&q=80&w=1080',
    vendor: 'Sushi House',
    marketplaceCategory: 'Food',
    subCategory: 'Asian',
    description: 'Fresh sushi rolls and sashimi combo',
    tags: ['food', 'sushi', 'asian', 'japanese'],
    isNew: true,
    location: 'Midtown'
  },
  // Additional Rentals items
  {
    id: 'mp35',
    name: 'Projector & Screen Rental',
    slug: 'projector-screen-rental',
    price: 120.00,
    image: 'https://images.unsplash.com/photo-1554936970-ce06538caf54?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9qZWN0b3IlMjBlcXVpcG1lbnR8ZW58MXx8fHwxNzYxMjQxNTEzfDA&ixlib=rb-4.1.0&q=80&w=1080',
    vendor: 'Event Tech Rentals',
    marketplaceCategory: 'Rentals',
    subCategory: 'Equipment',
    description: 'HD projector with large screen for presentations',
    tags: ['rental', 'projector', 'equipment', 'tech'],
    isNew: false,
    duration: 'Per Day'
  },
  // Additional Services items
  {
    id: 'mp36',
    name: 'Electrical Repair Service',
    slug: 'electrical-repair-service',
    price: 110.00,
    image: 'https://images.unsplash.com/photo-1661338148448-c12887abcd47?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVjdHJpY2lhbiUyMHRvb2xzfGVufDF8fHx8MTc2MTI0NjA3MXww&ixlib=rb-4.1.0&q=80&w=1080',
    vendor: 'Pro Electricians',
    marketplaceCategory: 'Services',
    subCategory: 'Electrical',
    description: 'Licensed electrician for repairs and installations',
    tags: ['service', 'electrical', 'repair', 'licensed'],
    isNew: true,
    location: 'Local Area'
  },
  {
    id: 'mp37',
    name: 'Handyman Services',
    slug: 'handyman-services',
    price: 75.00,
    image: 'https://images.unsplash.com/photo-1633759593085-1eaeb724fc88?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYW5keW1hbiUyMHJlcGFpcnxlbnwxfHx8fDE3NjEzMTQ2ODl8MA&ixlib=rb-4.1.0&q=80&w=1080',
    vendor: 'Fix-It Pros',
    marketplaceCategory: 'Services',
    subCategory: 'Handyman',
    description: 'General handyman services for home repairs',
    tags: ['service', 'handyman', 'repair', 'home'],
    isNew: false,
    location: 'Local Area'
  }
];