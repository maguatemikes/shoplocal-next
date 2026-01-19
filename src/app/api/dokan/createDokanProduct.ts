import { config } from '../../lib/config';

/**
 * Create a Dokan product with:
 * - Correct vendor assignment (author_id)
 * - Correct featured + gallery images
 * - WooCommerce-compliant product structure
 */
export async function createDokanProduct(productData: any) {
  console.log('🛍️ Creating Product via Dokan API:', productData);

  const authorId = productData.author;
  if (!authorId) {
    throw new Error('Author ID is required to create a product.');
  }

  console.log(`📝 Assigning product to vendor (author_id): ${authorId}`);

  /* ------------------------------------------------
   * IMAGE HANDLING (Dokan + WooCommerce REQUIRED FORMAT)
   * ------------------------------------------------ */
  let images: any[] = [];

  // If frontend sends a featured_media ID
  if (productData.featured_media) {
    images.push({
      id: productData.featured_media,
      position: 0, // FEATURED IMAGE
    });
  }

  // Add gallery images AFTER featured image
  if (productData.images && productData.images.length > 0) {
    productData.images.forEach((img: any) => {
      images.push({
        id: img.id,
        position: images.length, // auto-increment position
      });
    });
  }

  // If no featured image but gallery exists → first gallery becomes featured
  if (images.length > 0) {
    images = images.map((img, index) => ({
      id: img.id,
      position: index, // reorder properly
    }));
  }

  /* ------------------------------------------------
   * BUILD PRODUCT PAYLOAD (WooCommerce/Dokan Schema)
   * ------------------------------------------------ */
  const dokanProductData = {
    name: productData.name,
    type: productData.type || 'simple',
    status: 'publish',

    regular_price: productData.regular_price?.toString(),
    sale_price: productData.sale_price?.toString() || '',

    description: productData.description || '',
    short_description: productData.short_description || '',

    categories:
      productData.categories?.length > 0
        ? productData.categories
        : [{ id: 15 }], // Dokan requires at least one category

    tags: productData.tags || [],

    images, // final corrected image array

    manage_stock: productData.manage_stock || false,
    stock_quantity: productData.stock_quantity ?? null,

    // THE FIX THAT SETS THE VENDOR AS PRODUCT OWNER
    author_id: authorId,

    meta_data: [
      ...(productData.meta_data || []),
      { key: '_author_id', value: authorId.toString() },
      { key: '_created_via', value: 'shoplocal_dashboard' },
      { key: '_created_by_user', value: authorId.toString() }, // Track who actually created this product
    ],
  };

  /* ------------------------------------------------
   * SEND REQUEST TO DOKAN PRODUCT ENDPOINT
   * ------------------------------------------------ */
  const endpoint = `${config.api.dokan}/products`;
  const wpAuthHeader = btoa(
    `${config.auth.username}:${config.auth.appPassword}`
  );

  console.log('📡 Sending to:', endpoint);
  console.log('📦 Payload:', dokanProductData);

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Basic ${wpAuthHeader}`,
    },
    body: JSON.stringify(dokanProductData),
  });

  const responseText = await response.text();

  if (!response.ok) {
    let errorData;
    try {
      errorData = JSON.parse(responseText);
      throw new Error(`[${errorData.code}] ${errorData.message}`);
    } catch (e) {
      throw new Error('Failed to create product: Invalid server response.');
    }
  }

  const product = JSON.parse(responseText);

  console.log('✅ Product Created Successfully:', product);

  return product;
}