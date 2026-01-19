import axios from "axios";

const BASE_URL = "https://shoplocal.kinsta.cloud/wp-json/custom-api/v1";

export const getShippingMethods = async (payload: any) => {
  try {
    const response = await axios.post(`${BASE_URL}/shipping-methods`,
      payload,
      {
        headers: {
          "Content-Type": "application/json",
        },
        maxBodyLength: Infinity,
      }
    );

    console.log("Shipping methods:", response.data);
    return response.data;

  } catch (error) {
    console.error("Failed to fetch shipping methods:", error);
    throw error;
  }
};
