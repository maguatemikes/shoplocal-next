import { config } from '../../lib/config';

export interface WooCommerceProductData {
  name: string;
  type?: 'simple' | 'grouped' | 'external' | 'variable';
  regular_price?: string;
  description?: string;
  short_description?: string;
  categories?: Array<{ id?: number; name?: string }>;
  images?: Array<{ src: string; alt?: string }>;
  attributes?: Array<{ name: string; options: string[] }>;
  stock_quantity?: number;
  manage_stock?: boolean;
  status?: 'draft' | 'pending' | 'private' | 'publish';
  featured?: boolean;
  tags?: Array<{ id?: number; name?: string }>;
  meta_data?: Array<{ key: string; value: any }>;
}

export interface WooCommerceProduct {
  id: number;
  name: string;
  slug: string;
  permalink: string;
  date_created: string;
  status: string;
  price: string;
  regular_price: string;
  [key: string]: any;
}

/**
 * Create a WooCommerce product
 * @param productData - Product data in WooCommerce format
 * @returns Created product data from WooCommerce
 */
export async function createWooCommerceProduct(
  productData: WooCommerceProductData
): Promise<WooCommerceProduct> {
  try {
    console.log('🛍️ Creating WooCommerce product:', productData.name);

    const url = `${config.api.woocommerce}/products`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${config.woocommerce.authHeader}`,
      },
      body: JSON.stringify(productData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('❌ WooCommerce API error:', errorData);
      throw new Error(errorData.message || 'Failed to create WooCommerce product');
    }

    const product: WooCommerceProduct = await response.json();
    console.log('✅ WooCommerce product created successfully:', product.id);
    
    return product;
  } catch (error) {
    console.error('❌ Error creating WooCommerce product:', error);
    throw error;
  }
}

/**
 * Map GeoDirectory listing data to WooCommerce product format
 * @param listingData - Data from GeoDirectory listing
 * @param imageUrl - Featured image URL
 * @returns WooCommerce product data
 */
export function mapListingToWooProduct(
  listingData: any,
  imageUrl?: string
): WooCommerceProductData {
  const productData: WooCommerceProductData = {
    name: listingData.title || 'Untitled Product',
    type: 'simple',
    description: listingData.content || '',
    short_description: listingData.content ? listingData.content.substring(0, 200) : '',
    status: 'publish',
    manage_stock: false,
  };

  // Add price if available
  if (listingData.price) {
    productData.regular_price = listingData.price.toString();
  }

  // Add categories
  if (listingData.post_category) {
    // Handle both string and array formats
    const categories = Array.isArray(listingData.post_category)
      ? listingData.post_category
      : [listingData.post_category];
    
    productData.categories = categories.map((cat: any) => {
      if (typeof cat === 'object' && cat.name) {
        return { name: cat.name };
      }
      return { name: String(cat) };
    });
  }

  // Add tags
  if (listingData.post_tags) {
    const tags = Array.isArray(listingData.post_tags)
      ? listingData.post_tags
      : listingData.post_tags.split(',').map((t: string) => t.trim());
    
    productData.tags = tags.map((tag: any) => {
      if (typeof tag === 'object' && tag.name) {
        return { name: tag.name };
      }
      return { name: String(tag) };
    });
  }

  // Add featured image
  if (imageUrl) {
    productData.images = [{ src: imageUrl }];
  }

  // Add meta data to link back to GeoDirectory listing
  productData.meta_data = [
    {
      key: '_geodirectory_listing_id',
      value: listingData.id || '',
    },
    {
      key: '_geodirectory_source',
      value: 'shoplocal_sync',
    },
  ];

  // Add location data if available
  if (listingData.city || listingData.region || listingData.country) {
    const locationData = {
      street: listingData.street || '',
      city: listingData.city || '',
      region: listingData.region || '',
      country: listingData.country || '',
      zip: listingData.zip || '',
    };
    
    productData.meta_data.push({
      key: '_geodirectory_location',
      value: JSON.stringify(locationData),
    });
  }

  return productData;
}

/**
 * Update a WooCommerce product
 * @param productId - WooCommerce product ID
 * @param productData - Updated product data
 * @returns Updated product data
 */
export async function updateWooCommerceProduct(
  productId: number,
  productData: Partial<WooCommerceProductData>
): Promise<WooCommerceProduct> {
  try {
    console.log(`🔄 Updating WooCommerce product ${productId}`);

    const url = `${config.api.woocommerce}/products/${productId}`;
    
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${config.woocommerce.authHeader}`,
      },
      body: JSON.stringify(productData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('❌ WooCommerce API error:', errorData);
      throw new Error(errorData.message || 'Failed to update WooCommerce product');
    }

    const product: WooCommerceProduct = await response.json();
    console.log('✅ WooCommerce product updated successfully');
    
    return product;
  } catch (error) {
    console.error('❌ Error updating WooCommerce product:', error);
    throw error;
  }
}

/**
 * Get a WooCommerce product by ID
 * @param productId - WooCommerce product ID
 * @returns Product data
 */
export async function getProductById(productId: number): Promise<WooCommerceProduct> {
  try {
    console.log(`📦 Fetching product ${productId}`);

    const url = `${config.api.woocommerce}/products/${productId}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${config.woocommerce.authHeader}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('❌ WooCommerce API error:', errorData);
      throw new Error(errorData.message || 'Failed to fetch product');
    }

    const product: WooCommerceProduct = await response.json();
    console.log('✅ Product fetched successfully');
    
    return product;
  } catch (error) {
    console.error('❌ Error fetching product:', error);
    throw error;
  }
}

/**
 * Delete a WooCommerce product
 * @param productId - WooCommerce product ID
 * @param force - Whether to permanently delete (true) or move to trash (false)
 */
export async function deleteWooCommerceProduct(
  productId: number,
  force: boolean = false
): Promise<void> {
  try {
    console.log(`🗑️ Deleting WooCommerce product ${productId}`);

    const url = `${config.api.woocommerce}/products/${productId}?force=${force}`;
    
    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Authorization': `Basic ${config.woocommerce.authHeader}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('❌ WooCommerce API error:', errorData);
      throw new Error(errorData.message || 'Failed to delete WooCommerce product');
    }

    console.log('✅ WooCommerce product deleted successfully');
  } catch (error) {
    console.error('❌ Error deleting WooCommerce product:', error);
    throw error;
  }
}

/**
 * Get products created by a specific user
 * @param userId - WordPress user ID
 * @returns Array of products created by the user
 */
export async function getUserProducts(userId: number): Promise<WooCommerceProduct[]> {
  try {
    console.log(`📦 Fetching products for user ${userId}`);

    // Check if we're in development/demo mode (no real API configured)
    if (!config.api.woocommerce || !config.woocommerce.authHeader) {
      console.log('ℹ️ WooCommerce API not configured, using local cache');
      
      // Try to get from localStorage
      const cachedProducts = localStorage.getItem(`user_products_${userId}`);
      if (cachedProducts) {
        const products = JSON.parse(cachedProducts);
        console.log(`✅ Found ${products.length} cached products for user ${userId}`);
        return products;
      }
      
      // Return empty array if no cache
      console.log('ℹ️ No cached products found');
      return [];
    }

    // Fetch all products and filter by meta_data
    const url = `${config.api.woocommerce}/products?per_page=100`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${config.woocommerce.authHeader}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('❌ WooCommerce API error:', errorData);
      
      // Try to return cached data on error
      const cachedProducts = localStorage.getItem(`user_products_${userId}`);
      if (cachedProducts) {
        console.log('ℹ️ Returning cached products due to API error');
        return JSON.parse(cachedProducts);
      }
      
      throw new Error(errorData.message || 'Failed to fetch user products');
    }

    const allProducts: WooCommerceProduct[] = await response.json();
    
    // Filter products created by this user
    const userProducts = allProducts.filter(product => {
      const createdByMeta = product.meta_data?.find(
        (meta: any) => meta.key === '_created_by_user'
      );
      return createdByMeta && createdByMeta.value === userId.toString();
    });

    console.log(`✅ Found ${userProducts.length} products for user ${userId}`);
    
    // Cache the products
    localStorage.setItem(`user_products_${userId}`, JSON.stringify(userProducts));
    
    return userProducts;
  } catch (error) {
    console.error('❌ Error fetching user products:', error);
    
    // Try to return cached data as a last resort
    try {
      const cachedProducts = localStorage.getItem(`user_products_${userId}`);
      if (cachedProducts) {
        console.log('ℹ️ Returning cached products due to fetch error');
        return JSON.parse(cachedProducts);
      }
    } catch (cacheError) {
      console.error('❌ Error reading cache:', cacheError);
    }
    
    // Return empty array instead of throwing to prevent UI crash
    console.log('ℹ️ Returning empty products array');
    return [];
  }
}