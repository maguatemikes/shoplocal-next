"use client"

import { Heart, Tag, Flame, Star, ShoppingCart, Eye } from 'lucide-react';
import { Product } from '../lib/mockData';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

/**
 * ProductCard Props Interface
 * 
 * @property {Product} product - Product data to display
 * @property {Function} [onViewProduct] - Optional callback when viewing product details
 * @property {Function} [onViewVendor] - Optional callback when viewing vendor page
 */
interface ProductCardProps {
  product: Product;
  onViewProduct?: (slug: string) => void;
  onViewVendor?: (slug: string) => void;
}

/**
 * ProductCard Component
 * 
 * Displays a single product with all relevant information and actions.
 * Includes smart badge logic for discounts, new items, trending products, and low stock.
 * 
 * @param {ProductCardProps} props - Component props
 * @returns {JSX.Element} Product card with image, details, and actions
 */
export function ProductCard({ product, onViewProduct, onViewVendor }: ProductCardProps) {
  const router = useRouter();
  const [isWishlisted, setIsWishlisted] = useState(false);

  // Calculate discount information
  const hasDiscount = product.originalPrice && product.originalPrice > product.price;
  const discountPercentage = hasDiscount 
    ? Math.round(((product.originalPrice! - product.price) / product.originalPrice!) * 100)
    : 0;

  // Check if stock is low (less than 20 items)
  const isLowStock = product.stock !== undefined && product.stock < 20;

  /**
   * Handle card click to view product details
   * Uses the product's existing slug to navigate to product page
   * 
   * @param {React.MouseEvent} e - Click event
   */
  const handleCardClick = (e: React.MouseEvent) => {
    // Use the existing product slug from the API
    if (onViewProduct) {
      onViewProduct(product.slug);
    } else {
      router.push(`/product/${product.slug}`);
    }
  };

  /**
   * Handle vendor name click to navigate to WordPress vendor dashboard
   * Opens the WordPress dashboard if user is already logged in
   * 
   * @param {React.MouseEvent} e - Click event
   */
  const handleVendorClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    // Navigate to internal vendor dashboard
    if (onViewVendor && product.vendorSlug) {
      onViewVendor(product.vendorSlug);
    } else if (product.vendorSlug) {
      router.push(`/vendor/${product.vendorSlug}`);
    }
  };

  // Get vendor name - handle both string and object formats
  const vendorName = typeof product.vendor === 'string' 
    ? product.vendor 
    : product.vendor?.name || 'Unknown Vendor';

  return (
    <div 
      className="group bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-gray-200 transition-all hover:shadow-xl hover:shadow-gray-100/50 flex flex-col h-full"
    >
      {/* ============================================
          PRODUCT IMAGE SECTION
          Image with hover zoom, badges, and wishlist button
          ============================================ */}
      <div className="relative aspect-square overflow-hidden bg-gray-50 w-full">
        {/* Clickable Image Container */}
        <button
          onClick={handleCardClick}
          className="absolute inset-0 w-full h-full"
        >
          {/* <ImageWithFallback
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          /> */}
        </button>
        
        {/* Wishlist Toggle Button - Top Right */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsWishlisted(!isWishlisted);
          }}
          className={`absolute top-3 right-3 w-9 h-9 backdrop-blur-sm rounded-full flex items-center justify-center transition-all shadow-sm z-10 ${
            isWishlisted 
              ? 'bg-green-600 text-white hover:bg-green-700' 
              : 'bg-white/90 text-gray-600 hover:bg-white hover:scale-110'
          }`}
          aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
        </button>
        
        {/* Status Badges - Top Left Corner */}
        <div className="absolute top-3 left-3 flex flex-col gap-2 z-10">
          {/* Discount Badge */}
          {hasDiscount && (
            <span className="px-2.5 py-1 bg-red-600 text-white rounded-lg text-xs">
              -{discountPercentage}%
            </span>
          )}
          
          {/* New Item Badge */}
          {product.isNew && (
            <span className="px-2.5 py-1 bg-green-600 text-white rounded-lg text-xs">
              New
            </span>
          )}
          
          {/* Trending Badge */}
          {product.isTrending && (
            <span className="px-2.5 py-1 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg text-xs flex items-center gap-1">
              <Flame className="w-3 h-3" /> Trending
            </span>
          )}
        </div>
        
        {/* Bottom Status Badges */}
        <div className="absolute bottom-3 left-3 flex gap-2 z-10">
          {/* Accepts Offers Badge */}
          {product.acceptsOffers && (
            <span className="px-2.5 py-1 bg-green-600 text-white rounded-lg text-xs flex items-center gap-1">
              <Tag className="w-3 h-3" />
              Offers
            </span>
          )}
          
          {/* Low Stock Warning */}
          {isLowStock && (
            <span className="px-2.5 py-1 bg-amber-500 text-white rounded-lg text-xs">
              Only {product.stock} left
            </span>
          )}
        </div>
      </div>
      
      {/* ============================================
          PRODUCT INFORMATION SECTION
          Vendor, name, rating, price, and actions
          ============================================ */}
      <div className="p-5 flex flex-col flex-1">
        
        {/* Vendor Name - Non-clickable */}
        <span
          className="text-xs text-gray-600 mb-2 transition-colors text-left uppercase tracking-wide block"
        >
          {vendorName}
        </span>
        
        {/* Product Name - Clickable */}
        <button
          onClick={handleCardClick}
          className="block w-full text-left mb-3 group/title flex-1"
        >
          <h3 className="text-gray-900 group-hover/title:text-green-500 transition-colors line-clamp-2 leading-snug">
            {product.name}
          </h3>
        </button>
        
        {/* Rating & Review Count */}
        {product.rating && (
          <div className="flex items-center gap-2 mb-3">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span className="text-sm text-gray-900">{product.rating}</span>
            </div>
            {product.reviewCount && (
              <>
                <span className="text-gray-300">•</span>
                <span className="text-xs text-gray-500">
                  {product.reviewCount} {product.reviewCount === 1 ? 'review' : 'reviews'}
                </span>
              </>
            )}
          </div>
        )}
        
        {/* Price & Category Section */}
        <div className="flex items-center justify-between mt-auto">
          {/* Price Display with Optional Original Price */}
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <span className="text-lg text-gray-900">${product.price.toFixed(2)}</span>
              {hasDiscount && (
                <span className="text-sm text-gray-400 line-through">
                  ${product.originalPrice!.toFixed(2)}
                </span>
              )}
            </div>
          </div>
          
          {/* Category Badge */}
          <span className="text-xs text-gray-500 px-2 py-1 bg-gray-50 rounded">{product.category}</span>
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            // TODO: Implement add to cart logic
          }}
          className="w-full mt-4 bg-[#F57C00] text-white px-4 py-2.5 rounded-md hover:bg-[#E67000] transition-colors text-sm flex items-center justify-center gap-2"
        >
          <ShoppingCart className="w-4 h-4" />
          Add to Cart
        </button>
      </div>
    </div>
  );
}