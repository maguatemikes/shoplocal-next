"use client"

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, SlidersHorizontal, X, Grid3x3, Tag, Barcode, BadgePercent, RotateCcw, Navigation, Loader2, MapPin } from 'lucide-react';
import { Input } from '../components/ui/input';
import { Checkbox } from '../components/ui/checkbox';
import { ProductCard } from '../components/ProductCard';
import { products, vendors } from '../lib/mockData';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { Button } from '../components/ui/button';
import { calculateDistance } from '../lib/distance';
import { getProducts,getProductCategories,getProductBrands } from '../api/woo/products';
import { mapWPProduct } from '../lib/mapping';
import Loading from '../components/Loading';

interface UserLocation {
  lat: number;
  lon: number;
}

export default function ProductCatalog() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [acceptsOffers, setAcceptsOffers] = useState(false);
  const [product_categories,setCategories] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedBrand, setSelectedBrand] = useState<string>('all');
  const [product_brands,setBrands] = useState<any[]>([]);
  const [brandFilter, setBrandFilter] = useState<string>('');
  const [searcht, setSearch] = useState<string>('');
  const [upcFilter, setUpcFilter] = useState<string>('');
  const [products_api, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const perPage = 12; // number of products per page
  const [page, setPage] = useState<number>(1);
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [showManualLocation, setShowManualLocation] = useState(false);
  const [manualZipCode, setManualZipCode] = useState('');

  useEffect(() => {
    fetchProducts(1);
    fetchCategories();
    fetchBrands();
  }, []);

  const fetchBrands = async () => {
    try {
      const data = await getProductBrands();
      setBrands(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const fetchCategories = async () => {
    try {
      const data = await getProductCategories();
      setCategories(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const fetchProducts = async (
    pageNumber: number,
    category: string | null = selectedCategory,
    brand: string | null = selectedBrand,
    search: string | null = searcht
  ) => {
    setLoading(true);
    try {
      const data = await getProducts(pageNumber, perPage, category, brand, search);

      if (pageNumber === 1) {
        setProducts(data.products.map(mapWPProduct));
      } else {
        setProducts(prev => [...prev, ...data.products.map(mapWPProduct)]);
      }

      setHasMore(pageNumber * perPage < data.total);
      if (data.products.length === 0) setHasMore(false);

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadMoreProducts = () => {
    if (!hasMore || loading) return;
    const nextPage = page + 1;
    setPage(nextPage);
    fetchProducts(nextPage);
  };

  const handleUseMyLocation = () => {
    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser");
      setShowManualLocation(true);
      return;
    }

    setLocationLoading(true);
    setLocationError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const newLocation = {
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        };
        setUserLocation(newLocation);
        setLocationLoading(false);
        setLocationError(null);
        setSortBy('nearest');
      },
      (error) => {
        setLocationLoading(false);
        setShowManualLocation(true);
        let errorMessage = "Unable to detect your location.";
        switch(error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = "Location permission denied. Please enter your zip code below.";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = "Location information unavailable. Please enter your zip code below.";
            break;
          case error.TIMEOUT:
            errorMessage = "Location request timed out. Please enter your zip code below.";
            break;
        }
        setLocationError(errorMessage);
      },
      {
        enableHighAccuracy: false,
        timeout: 15000,
        maximumAge: 300000
      }
    );
  };

  const handleManualLocation = async () => {
    if (!manualZipCode.trim()) {
      setLocationError("Please enter a zip code or city name");
      return;
    }

    setLocationLoading(true);
    setLocationError(null);

    try {
      const query = encodeURIComponent(manualZipCode.trim());
      const url = `https://nominatim.openstreetmap.org/search?format=json&q=${query}&countrycodes=us&limit=1`;
      const response = await fetch(url, {
        headers: { 'User-Agent': 'ShopLocal Marketplace Directory' }
      });
      const data = await response.json();
      
      if (data && data.length > 0) {
        const newLocation = {
          lat: parseFloat(data[0].lat),
          lon: parseFloat(data[0].lon)
        };
        setUserLocation(newLocation);
        setLocationLoading(false);
        setLocationError(null);
        setShowManualLocation(false);
        setSortBy('nearest');
      } else {
        setLocationError("Location not found. Please try a valid US zip code or city name.");
        setLocationLoading(false);
      }
    } catch (error) {
      console.error("Geocoding error:", error);
      setLocationError("Unable to find location. Please try again.");
      setLocationLoading(false);
    }
  };

  const clearUserLocation = () => {
    setUserLocation(null);
    setLocationError(null);
    setShowManualLocation(false);
    setManualZipCode('');
    setSortBy('newest');
  };

  const filteredProducts = products_api;
  const hasActiveFilters = selectedCategory !== 'all' || acceptsOffers || brandFilter !== 'all' || upcFilter !== '';

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="bg-white border-b border-gray-100 py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center text-sm text-gray-500 mb-6">
            <button onClick={() => router.push('/')} className="hover:text-gray-900">
              Home
            </button>
            <span className="mx-2">→</span>
            <span className="text-gray-900">Products</span>
          </div>
          <h1 className="text-5xl tracking-tight text-gray-900 mb-4">All Products</h1>
          <p className="text-xl text-gray-600">
            Browse unique products from independent sellers
          </p>
          {locationError && (
            <div className="mt-4 max-w-md mx-auto bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {locationError}
            </div>
          )}
        </div>
      </section>

      <section className="bg-white border-b border-gray-100 py-6 sticky top-20 z-40 backdrop-blur-md bg-white/95">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-4 md:items-stretch h-10">
            <div className="flex-1 relative h-full">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Search products..."
                value={searcht}
                onChange={(e) => {
                  const value = e.target.value;
                  setSearch(value);
                  fetchProducts(1, selectedCategory, selectedBrand, value);
                }}
                className="pl-12 h-full rounded-xl border-gray-200 bg-gray-50"
              />
            </div>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full md:w-[200px] h-full rounded-xl border-gray-200 bg-gray-50">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="popular">Most Popular</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="nearest">Nearest to Me</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-8">
            <aside className="lg:w-64 flex-shrink-0">
              <div className="bg-white rounded-2xl p-6 border border-gray-100 sticky top-40">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <SlidersHorizontal className="w-5 h-5 text-gray-900" />
                    <h3 className="text-lg text-gray-900">Filters</h3>
                  </div>
                  {hasActiveFilters && (
                    <button
                      onClick={() => {
                        setSearch('');
                        setSelectedCategory('all');
                        setAcceptsOffers(false);
                        setBrandFilter('all');
                        setUpcFilter('');
                        fetchProducts(1);
                      }}
                      className="text-sm text-gray-600 hover:text-gray-900"
                    >
                      Clear
                    </button>
                  )}
                </div>

                <div className="mb-6 pb-6 border-b border-gray-100">
                  <div className="flex items-center gap-2 mb-3">
                    <Search className="w-4 h-4 text-gray-600" />
                    <h4 className="text-sm text-gray-900">Search</h4>
                  </div>
                  <Input
                    type="text"
                    placeholder="Search products..."
                    value={searcht}
                    onChange={(e) => {
                      const value = e.target.value;
                      setSearch(value);
                      fetchProducts(1, selectedCategory, selectedBrand, value);
                    }}
                    className="bg-gray-50 border-0 rounded-lg h-9"
                  />
                </div>

                <div className="mb-6 pb-6 border-b border-gray-100">
                  <div className="flex items-center gap-2 mb-3">
                    <Grid3x3 className="w-4 h-4 text-gray-600" />
                    <h4 className="text-sm text-gray-900">Category</h4>
                  </div>
                  <Select
                    value={selectedCategory}
                    onValueChange={(value: any) => {
                      setSelectedCategory(value);
                      fetchProducts(1, value, selectedBrand);
                    }}
                  >
                    <SelectTrigger className="bg-gray-50 border-0 rounded-lg h-9">
                      <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem key={"all"} value="all">All Categories</SelectItem>
                      {product_categories.map((x) => (
                        <SelectItem key={x.slug} value={x.slug}>
                          {x.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="mb-6 pb-6 border-b border-gray-100">
                  <div className="flex items-center gap-2 mb-3">
                    <Tag className="w-4 h-4 text-gray-600" />
                    <h4 className="text-sm text-gray-900">Brand</h4>
                  </div>
                  <Select
                    value={selectedBrand}
                    onValueChange={(value: any) => {
                      setSelectedBrand(value);
                      fetchProducts(1, selectedCategory, value);
                    }}
                  >
                    <SelectTrigger className="bg-gray-50 border-0 rounded-lg h-9">
                      <SelectValue placeholder="All Brands" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem key={"all"} value="all">All Brands</SelectItem>
                      {product_brands.map((b) => (
                        <SelectItem key={b.slug} value={b.slug}>
                          {b.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="mb-6 pb-6 border-b border-gray-100">
                  <div className="flex items-center gap-2 mb-3">
                    <Barcode className="w-4 h-4 text-gray-600" />
                    <h4 className="text-sm text-gray-900">UPC</h4>
                  </div>
                  <Input
                    type="text"
                    placeholder="Enter UPC..."
                    value={upcFilter}
                    onChange={(e) => setUpcFilter(e.target.value)}
                    className="bg-gray-50 border-0 rounded-lg h-9"
                  />
                </div>

                <div className="pt-2">
                  <label className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                    <Checkbox
                      checked={acceptsOffers}
                      onCheckedChange={(checked: any) => setAcceptsOffers(checked as boolean)}
                    />
                    <div className="flex items-center gap-2">
                      <BadgePercent className="w-4 h-4 text-gray-600" />
                      <span className="text-sm text-gray-700">Accepts Offers</span>
                    </div>
                  </label>
                </div>

                {hasActiveFilters && (
                  <>
                    <div className="h-px bg-gray-100 my-6" />
                    <button
                      onClick={() => {
                        setSearch('');
                        setSelectedCategory('all');
                        setAcceptsOffers(false);
                        setBrandFilter('all');
                        setUpcFilter('');
                        fetchProducts(1);
                      }}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all"
                    >
                      <RotateCcw className="w-4 h-4" />
                      Clear All Filters
                    </button>
                  </>
                )}
              </div>
            </aside>

            <div className="flex-1">
              <div className="mb-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <p className="text-gray-600">
                    {products_api.length} product{products_api.length !== 1 ? 's' : ''}
                  </p>
                  
                  <div className="flex flex-wrap items-center gap-2">
                    <Button
                      variant="outline"
                      onClick={handleUseMyLocation}
                      disabled={locationLoading}
                      className="rounded-lg"
                      size="sm"
                    >
                      {locationLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Getting Location...
                        </>
                      ) : userLocation ? (
                        <>
                          <MapPin className="w-4 h-4 mr-2 text-green-600" />
                          Location Set
                        </>
                      ) : (
                        <>
                          <Navigation className="w-4 h-4 mr-2" />
                          Use My Location
                        </>
                      )}
                    </Button>

                    {userLocation ? (
                      <Button
                        variant="ghost"
                        onClick={clearUserLocation}
                        className="rounded-lg text-gray-600 hover:text-red-600"
                        size="sm"
                      >
                        Clear Location
                      </Button>
                    ) : !showManualLocation ? (
                      <Button
                        variant="ghost"
                        onClick={() => setShowManualLocation(true)}
                        className="rounded-lg text-gray-600 hover:text-gray-900"
                        size="sm"
                      >
                        <MapPin className="w-4 h-4 mr-2" />
                        Enter Zip Code
                      </Button>
                    ) : null}
                    
                    {hasActiveFilters && (
                      <button
                        onClick={() => {
                          setSearch('');
                          setSelectedCategory('all');
                          setAcceptsOffers(false);
                          setBrandFilter('all');
                          setUpcFilter('');
                          fetchProducts(1);
                        }}
                        className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
                      >
                        <X className="w-4 h-4" />
                        Clear filters
                      </button>
                    )}
                  </div>
                </div>
                
                {showManualLocation && !userLocation && (
                  <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-start gap-3 mb-3">
                      <MapPin className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <h3 className="text-sm text-blue-900 mb-1">Enter Your Location Manually</h3>
                        <p className="text-xs text-blue-700">
                          Location detection failed. Enter your zip code or city to see distances.
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Input
                        type="text"
                        placeholder="Enter zip code or city..."
                        value={manualZipCode}
                        onChange={(e) => setManualZipCode(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleManualLocation()}
                        className="flex-1 rounded-lg h-9"
                        disabled={locationLoading}
                      />
                      <Button
                        onClick={handleManualLocation}
                        disabled={locationLoading || !manualZipCode.trim()}
                        className="rounded-lg bg-sky-600 hover:bg-sky-700"
                        size="sm"
                      >
                        {locationLoading ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          "Set Location"
                        )}
                      </Button>
                    </div>
                    {locationError && (
                      <p className="text-xs text-red-600 mt-2">{locationError}</p>
                    )}
                  </div>
                )}
              </div>
              
              {loading && page === 1 ? (
                <Loading />
              ) : filteredProducts.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredProducts.map((product) => (
                      <ProductCard
                        key={product.id}
                        product={product}
                        onViewProduct={(slug) => router.push(`/product/${slug}`)}
                        onViewVendor={(slug) => router.push(`/vendor/${slug}`)}
                      />
                    ))}
                  </div>
                  {hasMore && (
                    <div className="mt-12 text-center">
                      <Button
                        onClick={loadMoreProducts}
                        disabled={loading}
                        className="bg-gray-900 text-white hover:bg-gray-800 rounded-xl px-8"
                      >
                        {loading ? 'Loading...' : 'Load More Products'}
                      </Button>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-24">
                  <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Search className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-xl text-gray-900 mb-2">No products found</h3>
                  <p className="text-gray-600 mb-6">Try adjusting your filters or search term</p>
                  <button
                    onClick={() => {
                      setSearch('');
                      setSelectedCategory('all');
                      setAcceptsOffers(false);
                      setBrandFilter('all');
                      setUpcFilter('');
                      fetchProducts(1);
                    }}
                    className="px-6 py-3 bg-gray-900 hover:bg-gray-800 text-white rounded-xl transition-all"
                  >
                    Clear all filters
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-white border-t border-gray-100">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-3xl tracking-tight text-gray-900 mb-4">Want to see your products here?</h2>
          <p className="text-gray-600 mb-8">
            Join thousands of sellers reaching wholesale buyers on our platform
          </p>
          <button
            onClick={() => router.push('/sell/')}
            className="px-8 py-4 bg-gray-900 hover:bg-gray-800 text-white rounded-xl transition-all"
          >
            Become a Seller
          </button>
        </div>
      </section>
    </div>
  );
}