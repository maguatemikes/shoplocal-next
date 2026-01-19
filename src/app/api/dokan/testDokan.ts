import { config } from '../../lib/config';

/**
 * Test Dokan API endpoint to check if it's available
 * @returns Response from Dokan products endpoint
 */
export async function testDokanAPI() {
  try {
    console.log('🧪 Testing Dokan API endpoint...');
    
    const url = `${config.api.dokan}/products`;
    
    // Use WordPress Application Password (this is what works with Dokan)
    const wpAuthHeader = btoa(`${config.auth.username}:${config.auth.appPassword}`);
    
    console.log('📍 URL:', url);
    console.log('🔑 WordPress Auth:', `Basic ${wpAuthHeader.substring(0, 20)}...`);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${wpAuthHeader}`,
      },
    });

    console.log('📊 Response Status:', response.status);
    console.log('📊 Response Status Text:', response.statusText);
    
    // Get response headers
    const headers: Record<string, string> = {};
    response.headers.forEach((value, key) => {
      headers[key] = value;
    });
    console.log('📊 Response Headers:', headers);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Dokan API Error Response:', errorText);
      
      try {
        const errorData = JSON.parse(errorText);
        return {
          success: false,
          status: response.status,
          message: errorData.message || 'Dokan API request failed',
          data: errorData,
        };
      } catch {
        return {
          success: false,
          status: response.status,
          message: errorText || 'Dokan API request failed',
          data: null,
        };
      }
    }

    const data = await response.json();
    console.log('✅ Dokan API Response:', data);
    
    return {
      success: true,
      status: response.status,
      message: 'Dokan API is available',
      data: data,
    };
  } catch (error: any) {
    console.error('❌ Error testing Dokan API:', error);
    return {
      success: false,
      status: 0,
      message: error.message || 'Failed to connect to Dokan API',
      data: null,
    };
  }
}

/**
 * Test Dokan stores endpoint
 * @returns Response from Dokan stores endpoint
 */
export async function testDokanStores() {
  try {
    console.log('🧪 Testing Dokan Stores API endpoint...');
    
    const url = `${config.api.dokan}/stores`;
    
    // Use WordPress Application Password (this is what works with Dokan)
    const wpAuthHeader = btoa(`${config.auth.username}:${config.auth.appPassword}`);
    console.log('🔑 WordPress Auth:', `Basic ${wpAuthHeader.substring(0, 20)}...`);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${wpAuthHeader}`,
      },
    });

    console.log('📊 Stores Response Status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Dokan Stores API Error:', errorText);
      
      try {
        const errorData = JSON.parse(errorText);
        return {
          success: false,
          status: response.status,
          message: errorData.message || 'Dokan Stores API request failed',
          data: errorData,
        };
      } catch {
        return {
          success: false,
          status: response.status,
          message: errorText || 'Dokan Stores API request failed',
          data: null,
        };
      }
    }

    const data = await response.json();
    console.log('✅ Dokan Stores Response:', data);
    
    return {
      success: true,
      status: response.status,
      message: 'Dokan Stores API is available',
      data: data,
    };
  } catch (error: any) {
    console.error('❌ Error testing Dokan Stores API:', error);
    return {
      success: false,
      status: 0,
      message: error.message || 'Failed to connect to Dokan Stores API',
      data: null,
    };
  }
}

/**
 * Test creating a product via Dokan API
 * @returns Response from Dokan product creation
 */
export async function testCreateDokanProduct(userId: number) {
  try {
    console.log('🧪 Testing Dokan Product Creation...');
    
    const url = `${config.api.dokan}/products`;
    
    // Test product data with required category
    const productData = {
      name: 'TEST Dokan Product - ' + new Date().toISOString(),
      type: 'simple',
      regular_price: '29.99',
      description: 'This is a test product created via Dokan REST API',
      short_description: 'Test product for Dokan API integration',
      status: 'draft', // Keep as draft for testing
      catalog_visibility: 'visible',
      manage_stock: true,
      stock_quantity: 100,
      categories: [
        { id: 15 } // Default "Uncategorized" category - you may need to adjust this
      ],
    };

    console.log('📦 Product Data:', productData);
    console.log('📍 URL:', url);
    
    // Use WordPress Application Password (this is what works with Dokan)
    const wpAuthHeader = btoa(`${config.auth.username}:${config.auth.appPassword}`);
    console.log('🔑 WordPress Auth:', `Basic ${wpAuthHeader.substring(0, 20)}...`);

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${wpAuthHeader}`,
      },
      body: JSON.stringify(productData),
    });

    console.log('📊 Response Status:', response.status);
    console.log('📊 Response Status Text:', response.statusText);

    const responseText = await response.text();
    console.log('📊 Raw Response:', responseText);

    let result;
    try {
      result = JSON.parse(responseText);
    } catch {
      result = { message: responseText };
    }

    if (response.ok) {
      console.log('✅ Dokan Product Created Successfully!', result);
      return {
        success: true,
        status: response.status,
        message: 'Product created via Dokan API',
        data: result,
        authMethod: 'WordPress Application Password',
      };
    }

    console.error('❌ Dokan Product Creation Failed:', result);
    return {
      success: false,
      status: response.status,
      message: result.message || 'Failed to create product via Dokan API',
      data: result,
      authMethod: 'WordPress Application Password',
    };

  } catch (error: any) {
    console.error('❌ Error creating Dokan product:', error);
    return {
      success: false,
      status: 0,
      message: error.message || 'Failed to create product via Dokan API',
      data: null,
      authMethod: 'Error',
    };
  }
}
