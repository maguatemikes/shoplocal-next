import axios from "axios";
import { mapWPProduct } from "../../lib/mapping";

// Base URL for public WooCommerce store API
const BASE_URL = "https://shoplocal.kinsta.cloud/wp-json/custom-api/v1";

// ------------------- Products -------------------

export const getProducts = async (page = 1, perPage = 12) => {
  try {
    const response = await axios.get(`${BASE_URL}/products`, {
      params: { page, per_page: perPage },
      headers: { "Content-Type": "application/json" },
      maxBodyLength: Infinity,
    });

    console.log('🔍 Raw API Response - First Product:', response.data.products[0]);
    console.log('🔍 ALL FIELDS in first product:', Object.keys(response.data.products[0]));
    console.log('🔍 Vendor-related fields:', {
      vendor: response.data.products[0]?.vendor,
      vendorSlug: response.data.products[0]?.vendorSlug,
      vendor_slug: response.data.products[0]?.vendor_slug,
      username: response.data.products[0]?.username,
      store_username: response.data.products[0]?.store_username,
      vendor_username: response.data.products[0]?.vendor_username,
      author: response.data.products[0]?.author,
      author_name: response.data.products[0]?.author_name,
    });

    const mappedProducts = response.data.products.map(mapWPProduct);
    return { mapped: mappedProducts, res: response.data };

  } catch (error) {
    console.error("Failed to fetch products:", error);
    throw error;
  }
};

export const getProductDetail = async (slug : any) => {
  try {
    const response = await axios.get(`${BASE_URL}/product/${slug}`, {
      headers: { "Content-Type": "application/json" },
      maxBodyLength: Infinity,
    });

    console.log("Product detail:", response.data);
    return response.data;

  } catch (error) {
    console.error("Failed to fetch product detail:", error);
    throw error;
  }
};

export const getShortProductDetail = async (slug:any) => {
  try {
    const response = await axios.get(`${BASE_URL}/product-short/${slug}`, {
      headers: { "Content-Type": "application/json" },
      maxBodyLength: Infinity,
    });

    console.log("Short product detail:", response.data);
    return response.data;

  } catch (error) {
    console.error("Failed to fetch short product detail:", error);
    throw error;
  }
};

// ------------------- Places/Vendors -------------------

export const getPlaces = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/places`, {
      headers: { "Content-Type": "application/json" },
      maxBodyLength: Infinity,
    });

    console.log("Places:", response.data);
    return response.data;

  } catch (error) {
    console.error("Failed to fetch places:", error);
    throw error;
  }
};

// ------------------- GeoDirectory Vendors (NEW) -------------------

export const getGeoDirectoryVendors = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/geodirectory-vendors`, {
      headers: { "Content-Type": "application/json" },
      maxBodyLength: Infinity,
    });

    return response.data;
  } catch (error) {
    console.error("Failed to fetch GeoDirectory vendors:", error);
    throw error;
  }
};

export const getGeoDirectoryVendorDetail = async (placeId: number) => {
  try {
    const response = await axios.get(`${BASE_URL}/geodirectory-vendor/${placeId}`, {
      headers: { "Content-Type": "application/json" },
      maxBodyLength: Infinity,
    });

    return response.data;
  } catch (error) {
    console.error("Failed to fetch GeoDirectory vendor detail:", error);
    throw error;
  }
};

// ------------------- Nearby Vendors -------------------

export const getNearbyVendors = async (lat: any, lng: any, radius: any) => {
  console.log("Fetching nearby vendors...");
  try {
    const response = await axios.get(`${BASE_URL}/vendors-nearby`, {
      params: { lat, lng, radius },
      headers: { "Content-Type": "application/json" },
      maxBodyLength: Infinity,
    });

    return response.data;
  } catch (error) {
    console.error("Failed to fetch nearby vendors:", error);
    throw error;
  }
};

export const getVendorDetail = async (slug: any) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/vendor-by-username/${slug}?ddddd22d`,
      {
        headers: { "Content-Type": "application/json" },
        maxBodyLength: Infinity,
      }
    );

    return response.data;
  } catch (error: any) {
    // If 404, try alternative slug formats
    if (error.response?.status === 404) {
      // Try removing "-store" suffix if present
      if (slug.endsWith('-store')) {
        const alternativeSlug = slug.replace('-store', '');
        
        try {
          const response = await axios.get(
            `${BASE_URL}/vendor-by-username/${alternativeSlug}?ddddd22d`,
            {
              headers: { "Content-Type": "application/json" },
              maxBodyLength: Infinity,
            }
          );
          return response.data;
        } catch (retryError: any) {
          if (retryError.response?.status === 404) {
            // Try without hyphens (e.g., "mery-joy" → "meryjoy")
            const noHyphensSlug = alternativeSlug.replace(/-/g, '');
            
            try {
              const response = await axios.get(
                `${BASE_URL}/vendor-by-username/${noHyphensSlug}?ddddd22d`,
                {
                  headers: { "Content-Type": "application/json" },
                  maxBodyLength: Infinity,
                }
              );
              return response.data;
            } catch (finalError) {
              // Final fallback failed
            }
          }
        }
      }
      
      return null;
    }
    // Log other errors
    console.error('❌ API: Failed to fetch vendor detail:', error.message);
    console.error('❌ API: Error response:', error.response?.data);
    return null;
  }
};

export const getVendorDetailAndRecordVisit = async (vendorIdOrSlug: any) => {
  try {
    // 1️⃣ Record the visit (POST)
    await axios.post(
      `${BASE_URL}/visit/${vendorIdOrSlug}`,
      {},
      {
        headers: { "Content-Type": "application/json" },
        maxBodyLength: Infinity,
      }
    );
  } catch (error) {
    console.error("Failed to fetch vendor detail or record visit:", error);
    throw error;
  }
};