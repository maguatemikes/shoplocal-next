

import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getProductDetail, getShortProductDetail, getProducts } from "@/app/api/woo/products";
import { mapWPProduct } from "@/app/lib/mapping";
import ProductDetail from "./ProductDetail";
import { BreadcrumbSEO } from "@/app/components/SEO";

interface Props {
  params: Promise<{ slug: string }>;
}

// ✅ ENHANCED METADATA - Optimized for Facebook, Twitter, Google, WhatsApp
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  
  try {
    const product = await getShortProductDetail(slug);
    if (!product) {
      return { 
        title: 'Product Not Found | ShopLocal',
        robots: {
          index: false,
          follow: false,
        }
      };
    }

    // Clean description (remove HTML, limit to 160 chars)
    const cleanDescription = product.description
      ?.replace(/<[^>]*>/g, '')
      .substring(0, 160) || `Buy ${product.name} from ${product.vendor || 'ShopLocal'}. ${product.price ? `Only $${product.price}.` : ''} Support local businesses.`;

    // Generate full URL
    const productUrl = `https://shoplocal.com/product/${slug}`;
    
    // Product image (ensure it's a full URL)
    const imageUrl = product.image && product.image.startsWith('http') 
      ? product.image 
      : product.image ? `https://shoplocal.com${product.image}` : null;

    return {
      title: `${product.name} | ShopLocal`,
      description: cleanDescription,
      
      // ✅ CANONICAL URL - Prevents duplicate content issues
      alternates: {
        canonical: productUrl,
      },
      
      // ✅ OPEN GRAPH - Facebook, WhatsApp, LinkedIn
      openGraph: {
        title: product.name,
        description: cleanDescription,
        url: productUrl,
        siteName: 'ShopLocal',
        type: 'website',
        images: imageUrl ? [
          {
            url: imageUrl,
            width: 1200,
            height: 630,
            alt: product.name,
            type: 'image/jpeg',
          }
        ] : [],
        locale: 'en_US',
        
        // ✅ Product-specific OG tags (Facebook Product Catalog)
        ...(product.price && {
          // @ts-ignore - Facebook product tags
          'product:price:amount': product.price.toString(),
          'product:price:currency': 'USD',
        }),
        ...(product.brand && {
          // @ts-ignore
          'product:brand': product.brand,
        }),
        ...(product.category && {
          // @ts-ignore
          'product:category': product.category,
        }),
        ...(product.stock !== undefined && {
          // @ts-ignore
          'product:availability': product.stock > 0 ? 'in stock' : 'out of stock',
        }),
      },
      
      // ✅ TWITTER CARD - Enhanced product preview
      twitter: {
        card: 'summary_large_image',
        title: product.name,
        description: cleanDescription,
        images: product.image ? [imageUrl] : [],
        creator: '@shoplocal',
        site: '@shoplocal',
      },
      
      // ✅ ROBOTS - Control indexing
      robots: {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          'max-video-preview': -1,
          'max-image-preview': 'large',
          'max-snippet': -1,
        },
      },
      
      // ✅ ADDITIONAL META TAGS
      other: {
        // Product-specific meta
        'product:price:amount': product.price?.toString() || '',
        'product:price:currency': 'USD',
        'product:availability': product.stock > 0 ? 'in stock' : 'out of stock',
        'product:condition': 'new',
        ...(product.brand && { 'product:brand': product.brand }),
        ...(product.upc && { 'product:retailer_item_id': product.upc }),
        
        // Additional SEO signals
        'theme-color': '#22c55e',
        'mobile-web-app-capable': 'yes',
        'apple-mobile-web-app-capable': 'yes',
      },
      
      // ✅ KEYWORDS (legacy but some crawlers still use)
      keywords: [
        product.name,
        product.brand,
        product.category,
        product.vendor,
        'buy online',
        'shop local',
        ...(product.tags || []),
      ].filter(Boolean).join(', '),
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return { 
      title: 'Product Detail | ShopLocal',
      robots: {
        index: false,
        follow: true,
      }
    };
  }
}

// ✅ STATIC GENERATION - Pre-build top 100 products
export async function generateStaticParams() {
  try {
    const data = await getProducts(1, 100, null, null, null);
    
    if (!data || !Array.isArray(data.products)) {
      return [];
    }
    
    return data.products.map((product: any) => ({
      slug: product.slug,
    }));
  } catch (error) {
    console.error('Failed to generate static params:', error);
    return [];
  }
}

// ✅ ISR - Revalidate every 5 minutes
export const revalidate = 300;

// ✅ Allow dynamic rendering for products not pre-built
export const dynamicParams = true;

// ✅ MAIN PAGE COMPONENT
export default async function Page({ params }: Props) {
  const { slug } = await params;
  
  let initialProduct = null;
  let initialXtraData = null;

  try {
    // Fetch both in parallel for speed
    const [shortDetail, moreDetail] = await Promise.all([
      getShortProductDetail(slug),
      getProductDetail(slug)
    ]);
    
    initialProduct = shortDetail ? mapWPProduct(shortDetail) : null;
    initialXtraData = moreDetail;
  } catch (err) {
    console.error("Error fetching product data on server:", err);
  }

  // ✅ NOT FOUND - Proper 404 handling
  if (!initialProduct) {
    notFound();
  }

  // ✅ STRUCTURED DATA (JSON-LD) - Google Rich Snippets
  const productStructuredData = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": initialProduct.name,
    "description": initialProduct.description?.replace(/<[^>]*>/g, '').substring(0, 300) || '',
    "image": initialProduct.image,
    "brand": {
      "@type": "Brand",
      "name": initialProduct.brand || initialProduct.vendor || 'ShopLocal'
    },
    "offers": {
      "@type": "Offer",
      "url": `https://shoplocal.com/product/${slug}`,
      "priceCurrency": "USD",
      "price": initialProduct.price || 0,
      "availability": initialProduct.stock > 0 
        ? "https://schema.org/InStock" 
        : "https://schema.org/OutOfStock",
      "seller": {
        "@type": "Organization",
        "name": initialProduct.vendor || "ShopLocal"
      },
      ...(initialProduct.originalPrice && initialProduct.originalPrice > initialProduct.price && {
        "priceValidUntil": new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      })
    },
    ...(initialProduct.rating && {
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": initialProduct.rating,
        "reviewCount": initialProduct.reviewCount || 1,
        "bestRating": 5,
        "worstRating": 1
      }
    }),
    ...(initialProduct.category && {
      "category": initialProduct.category
    }),
    ...(initialProduct.upc && {
      "gtin": initialProduct.upc
    }),
    "sku": initialProduct.id || slug,
    "itemCondition": "https://schema.org/NewCondition"
  };

  // ✅ BREADCRUMB STRUCTURED DATA
  const breadcrumbStructuredData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://shoplocal.com"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Products",
        "item": "https://shoplocal.com/products"
      },
      ...(initialProduct.category ? [{
        "@type": "ListItem",
        "position": 3,
        "name": initialProduct.category,
        "item": `https://shoplocal.com/products?category=${encodeURIComponent(initialProduct.category)}`
      }] : []),
      {
        "@type": "ListItem",
        "position": initialProduct.category ? 4 : 3,
        "name": initialProduct.name,
        "item": `https://shoplocal.com/product/${slug}`
      }
    ]
  };

  return (
    <>
      {/* ✅ JSON-LD Structured Data - Appears in Google Rich Results */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productStructuredData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbStructuredData) }}
      />
      
      {/* ✅ Breadcrumb Component */}
      <BreadcrumbSEO 
        items={[
          { name: 'Home', url: '/' },
          { name: 'Products', url: '/products' },
          ...(initialProduct.category ? [{ 
            name: initialProduct.category, 
            url: `/products?category=${encodeURIComponent(initialProduct.category)}` 
          }] : []),
          { name: initialProduct.name, url: `/product/${slug}` }
        ]}
      />
      
      {/* ✅ Product Detail Component */}
      <ProductDetail 
        slug={slug} 
        initialProduct={initialProduct} 
        initialXtraData={initialXtraData} 
      />
    </>
  );
}
