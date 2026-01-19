import { config } from '../../lib/config';

export interface DokanProduct {
  id: number;
  name: string;
  slug: string;
  permalink: string;
  date_created: string;
  type: string;
  status: string;
  description: string;
  short_description: string;
  price: string;
  regular_price: string;
  author?: number; // Add author field for filtering
  featured_media?: number; // Featured image media ID
  images: Array<{
    id: number;
    src: string;
    name: string;
    alt: string;
  }>;
  categories: Array<{
    id: number;
    name: string;
    slug: string;
  }>;
  stock_quantity: number;
  manage_stock: boolean;
  store: {
    id: number;
    name: string;
    url: string;
    avatar: string;
  };
}

/**
 * Get products for a specific vendor using Dokan API
 */
export async function getDokanProducts(userId: number): Promise<DokanProduct[]> {
  try {
    console.log('📦 Fetching Dokan products for user:', userId);

    // Use WooCommerce API with author filter to get products by specific seller
    const wpAuthHeader = btoa(`${config.auth.username}:${config.auth.appPassword}`);

    // Use WooCommerce API instead of Dokan API and filter by author (seller)
    // Request _embed to get featured image data embedded in the response
    const url = `${config.api.woocommerce}/products?per_page=100&_embed`;
    console.log('📡 Fetching from URL:', url);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${wpAuthHeader}`,
      },
    });

    console.log('📊 Response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Failed to fetch products:', response.statusText, errorText);
      return [];
    }

    const allProducts: DokanProduct[] = await response.json();
    console.log(`📦 Total products returned from API: ${allProducts.length}`);
    
    // Log first product to see what fields are available
    if (allProducts.length > 0) {
      console.log('🔍 Sample product data:', JSON.stringify(allProducts[0], null, 2));
      console.log('🖼️ Sample product images:', allProducts[0].images);
      console.log('🖼️ Sample product featured_media:', (allProducts[0] as any).featured_media);
    }
    
    // Client-side filtering by store.id (the vendor ID in Dokan)
    // This is the CORRECT way to filter - store.id represents the vendor who owns the product
    const userProducts = allProducts.filter(product => {
      const productData = product as any;
      
      // Primary filter: Check if the store.id matches the user ID
      // The store.id is the actual vendor/owner of the product in Dokan
      const storeId = productData.store?.id;
      
      // Don't show products without a store assigned (these are admin-created)
      if (!storeId) {
        console.log(`Product "${product.name}": ❌ No store assigned (admin product)`);
        return false;
      }
      
      // Don't show products where the store ID doesn't match the user
      if (storeId !== userId) {
        console.log(`Product "${product.name}": ❌ Belongs to different vendor (store ID: ${storeId})`);
        return false;
      }
      
      // Verify this product was created by the user (not just assigned to them by admin)
      // Check meta_data for _created_by_user to ensure they actually created it
      let createdByUser = false;
      if (productData.meta_data && Array.isArray(productData.meta_data)) {
        const createdByMeta = productData.meta_data.find((meta: any) => meta.key === '_created_by_user');
        if (createdByMeta) {
          createdByUser = parseInt(createdByMeta.value) === userId;
        }
      }
      
      // If the product has _created_by_user meta, it must match the current user
      // If it doesn't have this meta, it was created before we added tracking, so allow it based on store.id
      const hasCreatedByMeta = productData.meta_data?.some((meta: any) => meta.key === '_created_by_user');
      const isValid = !hasCreatedByMeta || createdByUser;
      
      console.log(`Product "${product.name}":`, {
        id: product.id,
        storeId: storeId,
        expectedUserId: userId,
        storeMatches: storeId === userId ? '✅' : '❌',
        createdByUser: createdByUser ? '✅' : '❌',
        hasCreatedByMeta: hasCreatedByMeta ? 'Yes' : 'No',
        finalResult: isValid && storeId === userId ? '✅ INCLUDED' : '❌ EXCLUDED',
        imagesCount: product.images?.length || 0,
      });
      
      return storeId === userId && isValid;
    });

    console.log(`✅ Filtered to ${userProducts.length} products for user ${userId} (from ${allProducts.length} total)`);

    return userProducts;
  } catch (error) {
    console.error('❌ Error fetching products:', error);
    return [];
  }
}

/**
 * Get a single product by ID using Dokan API
 */
export async function getDokanProductById(productId: number): Promise<DokanProduct | null> {
  try {
    console.log('🔍 Fetching Dokan product:', productId);

    const wpAuthHeader = btoa(`${config.auth.username}:${config.auth.appPassword}`);

    const response = await fetch(`${config.api.dokan}/products/${productId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${wpAuthHeader}`,
      },
    });

    if (!response.ok) {
      console.error('❌ Failed to fetch Dokan product:', response.statusText);
      return null;
    }

    const product: DokanProduct = await response.json();
    console.log('✅ Fetched Dokan product:', product.name);

    return product;
  } catch (error) {
    console.error('❌ Error fetching Dokan product:', error);
    return null;
  }
}

/**
 * Update a product using Dokan API
 */
export async function updateDokanProduct(
  productId: number,
  updates: Partial<DokanProduct>
): Promise<{ success: boolean; message: string; product?: DokanProduct }> {
  try {
    console.log('📝 Updating Dokan product:', productId, updates);

    const wpAuthHeader = btoa(`${config.auth.username}:${config.auth.appPassword}`);

    const response = await fetch(`${config.api.dokan}/products/${productId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${wpAuthHeader}`,
      },
      body: JSON.stringify(updates),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Failed to update Dokan product:', errorText);
      
      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch {
        errorData = { message: errorText };
      }

      return {
        success: false,
        message: errorData.message || `Failed to update: ${response.statusText}`,
      };
    }

    const product: DokanProduct = await response.json();
    console.log('✅ Updated Dokan product:', product.name);

    return {
      success: true,
      message: 'Product updated successfully!',
      product,
    };
  } catch (error: any) {
    console.error('❌ Error updating Dokan product:', error);
    return {
      success: false,
      message: error.message || 'Failed to update product',
    };
  }
}

/**
 * Delete a product using Dokan API
 */
export async function deleteDokanProduct(productId: number): Promise<{ success: boolean; message: string }> {
  try {
    console.log('🗑️ Deleting Dokan product:', productId);

    const wpAuthHeader = btoa(`${config.auth.username}:${config.auth.appPassword}`);

    const response = await fetch(`${config.api.dokan}/products/${productId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${wpAuthHeader}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Failed to delete Dokan product:', errorText);
      return {
        success: false,
        message: `Failed to delete: ${response.statusText}`,
      };
    }

    console.log('✅ Deleted Dokan product');

    return {
      success: true,
      message: 'Product deleted successfully!',
    };
  } catch (error: any) {
    console.error('❌ Error deleting Dokan product:', error);
    return {
      success: false,
      message: error.message || 'Failed to delete product',
    };
  }
}
