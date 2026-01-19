import axios from "axios";
import { mapWPProduct } from "../../lib/mapping";

// Base URL for public WooCommerce store API
const BASE_URL = "https://shoplocal.kinsta.cloud/wp-json/custom-api/v1";

// ------------------- Products -------------------

export const getProducts = async (page: number, perPage: number, category: string | null, brand: string | null, search: string | null) => {
  try {
    const response = await axios.get(`${BASE_URL}/products`, {
      params: {
        page,
        per_page: perPage,
        category: category !== '' ? category : undefined,
        brand: brand !== '' ? brand : undefined,
        search: search !== '' ? search : undefined,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Failed to fetch products:", error);
    throw error;
  }
};


export const getProductDetail = async (slug: any) => {
  try {
    const response = await axios.get(`${BASE_URL}/product/${slug}?gggg`, {
      headers: { "Content-Type": "application/json" },
      maxBodyLength: Infinity,
    });

    console.log("xtra data", response.data);
    return response.data;

  } catch (error) {
    console.error("Failed to fetch product detail:", error);
    throw error;
  }
};

export const getProductCategories = async () => {
  try {
    const response = await axios.get(
      `https://shoplocal.kinsta.cloud/wp-json/wp/v2/product_cat?per_page=100`,
      {
        headers: { "Content-Type": "application/json" },
        maxBodyLength: Infinity,
      }
    );

    console.log("Categories data", response.data);
    return response.data;

  } catch (error) {
    console.error("Failed to fetch product categories:", error);
    throw error;
  }
};


export const getProductBrands = async () => {
  try {
    const response = await axios.get(
      `https://shoplocal.kinsta.cloud/wp-json/wp/v2/product_brand?per_page=100`,
      {
        headers: { "Content-Type": "application/json" },
        maxBodyLength: Infinity,
      }
    );

    return response.data;

  } catch (error) {
    console.error("Failed to fetch brands:", error);
    throw error;
  }
};



export const getShortProductDetail = async (slug: any) => {
  try {
    const response = await axios.get(`${BASE_URL}/product-short/${slug}?lll`, {
      headers: { "Content-Type": "application/json" },
      maxBodyLength: Infinity,
    });

    console.log("xtra", response.data);
    return response.data;

  } catch (error) {
    console.error("Failed to fetch product detail:", error);
    throw error;
  }
};

// ------------------- Nearby Vendors -------------------

export const getNearbyVendors = async (lat: any, lng: any, radius: any) => {
    console.log('entered detching vendorsdd');
  try {
    const response = await axios.get(`${BASE_URL}/vendors-nearby`, {
      params: { lat, lng, radius,}, // t=Date.now() to bust cache
      headers: { "Content-Type": "application/json" },
      maxBodyLength: Infinity,
    });

    return response.data;

  } catch (error) {
    console.error("Failed to fetch nearby vendors:", error);
    throw error;
  }
};
