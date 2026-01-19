"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Star, ShoppingCart, Heart, Share2, Package, Shield, ArrowLeft, Truck, 
  CheckCircle, FileText, Award, MapPin, Navigation 
} from 'lucide-react';

import { Button } from "@/app/components/ui/button";
import { Badge } from "@/app/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/app/components/ui/accordion";
import { getProductDetail, getNearbyVendors } from "@/app/api/woo/products";

import AddToCartModal from "@/app/components/AddtoCartModal";
import VariationSelector from "@/app/components/VariationSelector";
import Loading from "@/app/components/Loading";

// Basic Image fallback component if not provided
function ImageWithFallback({ src, alt, className }: any) {
  // Defensive check for 'false' or null src
  const safeSrc = src || 'https://via.placeholder.com/600';
  return <img src={safeSrc} alt={alt} className={className} onError={(e: any) => e.target.src = 'https://via.placeholder.com/600'} />;
}

export default function ProductDetail({ slug, initialProduct, initialXtraData }: { slug: string, initialProduct: any, initialXtraData: any }) {
  const router = useRouter();
  
  const [product_item, setProducItem] = useState<any>(initialProduct);
  const [product, setProduct] = useState<any>(initialProduct);
  const [xtraData, setXtraData] = useState<any>(initialXtraData);
  
  const [vendors, setVendors] = useState<any[]>([]);
  const [coords, setCoords] = useState<any>(null);

  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);

  const [showModal, setShowModal] = useState(false);
  const [lastAddedProduct, setLastAddedProduct] = useState({
    name: "",
    image: "",
  });

  const handleVariationChange = (selectedAttrs: any) => {
    const normalize = (str: string) => str.toLowerCase().replace(/\s+/g, '-');
    const matched = product_item.variations?.find((v: any) =>
      Object.keys(selectedAttrs).every(key => {
        const wcKey = `pa_${key.toLowerCase()}`;
        const selectedValue = normalize(selectedAttrs[key]);
        const variationValue = v.attributes[wcKey] ? normalize(v.attributes[wcKey]) : '';
        return selectedValue === variationValue;
      })
    );

    if (matched) {
      setProduct((prev: any) => ({
        ...prev,
        id: matched.id,
        price: parseFloat(matched.price),
        originalPrice: parseFloat(matched.regularPrice),
        image: matched.image || prev.image,
        stock: matched.stock,
        salePrice: matched.salePrice || null,
        selectedAttributes: matched.attributes || {}
      }));
    }
  };

  useEffect(() => {
    if (!initialXtraData && slug) {
      const fetchFullData = async () => {
        try {
          const detail = await getProductDetail(slug);
          setXtraData(detail);
        } catch (err: any) {
          console.error("Failed to fetch extra product details on client:", err);
        }
      };
      fetchFullData();
    }
  }, [slug, initialXtraData]);

  useEffect(() => {
    if (typeof window !== 'undefined' && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setCoords({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          });
        },
        (err) => {
          console.warn("Unable to retrieve your location for nearby vendors");
        }
      );
    }
  }, []);

  useEffect(() => {
    if (!coords) return;

    const fetchVendors = async () => {
      try {
        const data = await getNearbyVendors(coords.lat, coords.lng, 100000);
        setVendors(data);
      } catch (err: any) {
        console.error(err.message);
      }
    };

    fetchVendors();
  }, [coords]);

  function timeAgo(dateString: string) {
    if (!dateString) return "";
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    const intervals: any = {
      year: 31536000,
      month: 2592000,
      week: 604800,
      day: 86400,
      hour: 3600,
      minute: 60,
    };

    for (const unit in intervals) {
      const value = Math.floor(seconds / intervals[unit]);
      if (value >= 1) {
        return `${value} ${unit}${value > 1 ? "s" : ""} ago`;
      }
    }

    return "Just now";
  }

  const handleAddToCart = () => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const existingIndex = cart.findIndex((item: any) => item.id === product.id);

    if (existingIndex !== -1) {
      cart[existingIndex].quantity += quantity;
    } else {
      cart.push({
        id: product.id,
        name: xtraData?.name || product_item.name,
        image: product.image,
        price: product.price,
        quantity: quantity,
      });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    setLastAddedProduct({
      name: xtraData?.name || product_item.name,
      image: product.image,
    });
    setShowModal(true);
    setTimeout(() => setShowModal(false), 2000);
  };

  if (loading && !product_item) {
    return <Loading message="Fetching Product..." />;
  }

  return (
    <>
      <div className="min-h-screen bg-white">
        <div className="border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <button
              onClick={() => router.push('/products')}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Products</span>
            </button>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <div className="sticky top-24">
                <div className="aspect-square rounded-2xl overflow-hidden bg-gray-100 mb-4">
                  <ImageWithFallback
                    src={
                      (Array.isArray(xtraData?.gallery_images) && xtraData.gallery_images.length > 0)
                        ? ([
                            String(product_item?.image || xtraData.featured_img || ''),
                            ...xtraData.gallery_images
                          ][selectedImage] || String(product_item?.image || xtraData.featured_img || ''))
                        : String(product.image || xtraData?.featured_img || '')
                    }
                    alt={product_item?.name ?? 'Product'}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="grid grid-cols-4 gap-4">
                  {Array.isArray(xtraData?.gallery_images) ? (
                    [xtraData.featured_img, ...xtraData.gallery_images].map((img: any, idx: number) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedImage(idx)}
                        className={`aspect-square rounded-xl overflow-hidden border-2 ${selectedImage === idx ? 'border-blue-600' : 'border-gray-200'}`}
                      >
                        <ImageWithFallback
                          src={String(img || '')}
                          alt={`${product_item?.name ?? 'Product'} ${idx + 1}`}
                          className="w-full h-full object-cover" />
                      </button>
                    ))
                  ) : null}
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-gray-600">Sold by</span>
                <button
                  onClick={() => router.push(`/vendor/${product.vendorSlug}`)}
                  className="text-green-500 hover:text-green-600 hover:underline"
                >
                  {product_item.vendor}
                </button>
                <Badge variant="outline" className="ml-2">Verified Seller</Badge>
              </div>

              <h1 className="text-4xl text-gray-900 mb-4">{xtraData?.name || product_item.name}</h1>

              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${i < Math.floor(xtraData?.average_rating || product_item.rating)
                          ? 'fill-amber-400 text-amber-400'
                          : 'fill-none text-gray-300'}`} />
                  ))}
                </div>
                <span className="text-gray-600 text-sm">
                  {xtraData?.average_rating || product_item.rating} ({xtraData?.review_count || product_item.reviewCount} reviews)
                </span>
              </div>

              <div className="mb-8">
                <div className="flex items-baseline gap-3 mb-2">
                  <span className="text-4xl text-gray-900">${product.price?.toFixed(2)}</span>
                  {product.originalPrice && product.originalPrice > 0 && product.originalPrice > product.price && (
                    <>
                      <span className="text-xl text-gray-500 line-through">
                        ${product.originalPrice.toFixed(2)}
                      </span>
                      <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                        Save {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                      </Badge>
                    </>
                  )}
                </div>
              </div>

              {product.stock > 0 ?
                <div className="flex items-center gap-2 mb-8 text-green-600">
                  <CheckCircle className="w-5 h-5" />
                  <span>In Stock - Ready to Ship</span>
                </div> :<div className="flex items-center gap-2 mb-8 text-red-600">
                  <CheckCircle className="w-5 h-5" />
                  <span>Out of stock</span>
                </div>}
              
              {product_item.attributes?.length ? (
                <div className="mb-8">
                  <h2 className="text-lg font-medium mb-4">Choose Options</h2>
                  <VariationSelector
                    attributes={product_item.attributes}
                    variations={product_item.variations}
                    onChange={handleVariationChange}
                  />
                </div>
              ) : null}

              <div className="mb-8">
                <label className="block text-gray-900 mb-3 font-medium">Quantity</label>
                <div className="flex items-center gap-4">
                  <div className="flex items-center border-2 border-gray-200 rounded-xl overflow-hidden">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-4 py-3 hover:bg-gray-50 transition-colors"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-20 text-center border-x-2 border-gray-200 py-3" />
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="px-4 py-3 hover:bg-gray-50 transition-colors"
                    >
                      +
                    </button>
                  </div>
                  <span className="text-gray-600">Available: {product.stock} units</span>
                </div>
              </div>

              <div className="flex gap-4 mb-8">
                <Button
                  size="lg"
                  className="flex-1 bg-[#F57C00] hover:bg-[#E67000] rounded-xl"
                  disabled={product.stock === 0}
                  onClick={handleAddToCart}
                >
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Add to Cart
                </Button>
                <Button size="lg" variant="outline" className="rounded-xl">
                  <Heart className="w-5 h-5" />
                </Button>
                <Button size="lg" variant="outline" className="rounded-xl">
                  <Share2 className="w-5 h-5" />
                </Button>
              </div>

              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="features">
                  <AccordionTrigger className="text-gray-900 hover:text-gray-900">
                    <div className="flex items-center gap-2">
                      <Package className="w-5 h-5 text-green-500" />
                      <span>Product Features</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4 pt-2">
                      <div className="flex items-start gap-3">
                        <Truck className="w-5 h-5 text-green-500 mt-0.5" />
                        <div>
                          <p className="text-gray-900">Free Shipping</p>
                          <p className="text-sm text-gray-600">On orders over $500</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Shield className="w-5 h-5 text-green-500 mt-0.5" />
                        <div>
                          <p className="text-gray-900">Buyer Protection</p>
                          <p className="text-sm text-gray-600">Secure payments & refunds</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Package className="w-5 h-5 text-green-500 mt-0.5" />
                        <div>
                          <p className="text-gray-900">Fast Fulfillment</p>
                          <p className="text-sm text-gray-600">Ships within 2-3 business days</p>
                        </div>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="shipping">
                  <AccordionTrigger className="text-gray-900 hover:text-gray-900">
                    <div className="flex items-center gap-2">
                      <Truck className="w-5 h-5 text-green-500" />
                      <span>Shipping Information</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4 pt-2 text-gray-600">
                      <p>This product ships from the seller's warehouse.</p>
                      <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                        <div className="flex justify-between">
                          <span>Processing Time:</span>
                          <span className="text-gray-900">2-3 business days</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Standard Shipping:</span>
                          <span className="text-gray-900">5-7 business days ($15)</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Express Shipping:</span>
                          <span className="text-gray-900">2-3 business days ($35)</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Free Shipping:</span>
                          <span className="text-gray-900">Orders over $500</span>
                        </div>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="reviews">
                  <AccordionTrigger className="text-gray-900 hover:text-gray-900">
                    <div className="flex items-center gap-2">
                      <Star className="w-5 h-5 text-green-500" />
                      <span>Customer Reviews ({xtraData?.review_count || 0})</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-6 pt-2">
                      {xtraData?.reviews?.map((review: any) => (
                        <div key={review.id} className="border-b border-gray-200 pb-4 last:border-0">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-4 h-4 ${i < review.rating ? "fill-amber-400 text-amber-400" : "text-gray-300"}`} />
                              ))}
                            </div>
                            <span className="text-gray-900">{review.author}</span>
                            <span className="text-gray-500">• {timeAgo(review.date)}</span>
                          </div>
                          <p className="text-gray-600 text-sm">{review.content}</p>
                        </div>
                      )) || <p className="text-gray-500 text-sm">No reviews yet.</p>}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>

          <div className="mt-16">
            <Tabs defaultValue="description" className="w-full">
              <TabsList className="w-full flex flex-wrap justify-start border-b rounded-none h-auto p-0 bg-transparent">
                {['description', 'specifications', 'warranty', 'care', 'local'].map((tab) => (
                  <TabsTrigger
                    key={tab}
                    value={tab}
                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent px-6 py-4 capitalize"
                  >
                    {tab}
                  </TabsTrigger>
                ))}
              </TabsList>

              <TabsContent value="description" className="py-8">
                <div className="prose max-w-none text-gray-700">
                  {xtraData?.description || 'No Description'}
                </div>
              </TabsContent>

              <TabsContent value="specifications" className="py-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    {[
                      { label: "Category", value: product_item.category || "Uncategorized" },
                      { label: "Brand", value: product_item.brand || "Unknown Brand" },
                      { label: "SKU/UPC", value: product_item.upc || "N/A" },
                      { label: "Stock", value: product_item.stock ?? "N/A" },
                    ].map((item, idx) => (
                      <div key={idx} className="flex justify-between py-3 border-b border-gray-200">
                        <span className="text-gray-600">{item.label}:</span>
                        <span className="text-gray-900 font-medium">{item.value}</span>
                      </div>
                    ))}
                  </div>
                  <div className="space-y-3">
                    {[
                      { label: "Vendor", value: product_item.vendor || "Default Vendor" },
                      { label: "Price", value: `$${product_item.price}` },
                      { label: "Original Price", value: product_item.originalPrice ? `$${product_item.originalPrice}` : "-" },
                      { label: "Accepts Offers", value: product_item.acceptsOffers ? "Yes" : "No" },
                    ].map((item, idx) => (
                      <div key={idx} className="flex justify-between py-3 border-b border-gray-200">
                        <span className="text-gray-600">{item.label}:</span>
                        <span className="text-gray-900 font-medium">{item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="warranty" className="py-8">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl text-gray-900 mb-3 flex items-center gap-2">
                      <Shield className="w-5 h-5 text-green-500" />
                      Warranty Coverage
                    </h3>
                    <div className="bg-gray-50 rounded-xl p-6 text-gray-600">
                      <div className="prose" dangerouslySetInnerHTML={{ __html: xtraData?.warranty || '<p>No warranty information available.</p>' }} />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl text-gray-900 mb-3 flex items-center gap-2">
                      <Award className="w-5 h-5 text-green-500" />
                      Return Policy
                    </h3>
                    <div className="bg-gray-50 rounded-xl p-6 text-gray-600">
                      <div className="prose" dangerouslySetInnerHTML={{ __html: xtraData?.return_policy || '<p>No return policy available.</p>' }} />
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="care" className="py-8">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl text-gray-900 mb-3 flex items-center gap-2">
                      <FileText className="w-5 h-5 text-green-500" />
                      Care & Maintenance
                    </h3>
                    <div className="bg-gray-50 rounded-xl p-6">
                       <div className="prose" dangerouslySetInnerHTML={{ __html: xtraData?.care_maintenance || '<p>No care instructions available.</p>' }} />
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="local" className="py-8">
                <div className="space-y-6">
                  <div className="bg-sky-50 border border-sky-200 rounded-xl p-6 mb-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-sky-600 rounded-xl flex items-center justify-center flex-shrink-0">
                        <MapPin className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg text-gray-900 mb-2">Shop Local, Support Your Community</h3>
                        <p className="text-gray-600 mb-3">
                          This product is also available at authorized local retailers near you.
                        </p>
                        <button
                          onClick={() => router.push('/vendors')}
                          className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-lg transition-colors inline-flex items-center gap-2"
                        >
                          <Navigation className="w-4 h-4" />
                          Find Local Stores
                        </button>
                      </div>
                    </div>
                  </div>

                  <h3 className="text-xl text-gray-900 mb-4">Nearby Authorized Retailers</h3>
                  <div className="space-y-4">
                    {Array.isArray(vendors) && vendors.map((store: any, index: number) => {
                      const addressObj = store.address || {};
                      const address = `${addressObj.street_1 || ''}${addressObj.street_2 ? ', ' + addressObj.street_2 : ''}, ${addressObj.city || ''}${addressObj.state ? ', ' + addressObj.state : ''}${addressObj.zip ? ', ' + addressObj.zip : ''}${addressObj.country ? ', ' + addressObj.country : ''}`;

                      return (
                        <div key={index} className="bg-white border-2 border-gray-200 rounded-xl p-6 hover:border-sky-500 transition-colors">
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <div className="flex items-center gap-2 mb-2">
                                <h4 className="text-lg text-gray-900 font-medium">{store.store_name}</h4>
                                <Badge className="bg-green-100 text-green-800 border-green-300">
                                  {store.status || 'Authorized'}
                                </Badge>
                              </div>
                              <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                                <MapPin className="w-4 h-4" />
                                <span>{address}</span>
                              </div>
                              <div className="text-sm text-gray-600">{store.phone}</div>
                            </div>
                            <div className="text-right">
                              <div className="text-sky-600 mb-1 font-medium">{store.distance_miles?.toFixed(1) || 0} miles</div>
                            </div>
                          </div>
                          <div className="flex gap-3">
                            <Button size="sm" className="bg-sky-600 hover:bg-sky-700 rounded-lg">
                              View Store
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="rounded-lg"
                              onClick={() => {
                                if (store.store_nfi?.latitude) {
                                  window.open(`https://www.google.com/maps/search/?api=1&query=${store.store_nfi.latitude},${store.store_nfi.longitude}`, "_blank");
                                }
                              }}
                            >
                              <Navigation className="w-4 h-4 mr-2" />
                              Get Directions
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          <div className="mt-20">
            <h2 className="text-3xl text-gray-900 mb-8 font-semibold">More from this Seller</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {xtraData?.related_products?.slice(0, 4).map((relatedProduct: any) => (
                <button
                  key={relatedProduct.id}
                  onClick={() => router.push(`/product/${relatedProduct.id}`)}
                  className="group text-left"
                >
                  <div className="aspect-square rounded-xl overflow-hidden bg-gray-100 mb-3">
                     <ImageWithFallback
                      src={String(relatedProduct.image || '')}
                      alt={relatedProduct.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  </div>
                  <h3 className="text-gray-900 mb-1 group-hover:text-green-500 font-medium line-clamp-1">
                    {relatedProduct.name}
                  </h3>
                  <p className="text-gray-600 font-medium">${relatedProduct.price}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      <AddToCartModal
        show={showModal}
        onClose={() => setShowModal(false)}
        productName={lastAddedProduct.name}
        productImage={lastAddedProduct.image} />
    </>
  );
}
