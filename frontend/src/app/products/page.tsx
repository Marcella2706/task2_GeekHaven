"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { products } from "../lib/mockData";
import { useActionLogger } from "@/utils/seed";
import { generateProductIdWithChecksum, calculatePlatformFee } from "@/utils/seed";
import { Heart, ShoppingCart, Eye, Filter, Grid, List, ChevronDown, Star, MapPin } from "lucide-react";
import Image from "next/image";
import { motion } from "framer-motion";
import { useEffect, useState, useMemo } from "react";
import { useCart } from "@/context/CartContext";

type SortOption = "relevance" | "price-low" | "price-high" | "newest" | "popular";
type ViewMode = "grid" | "list";

const extendedProducts = products.map((product, index) => ({
  ...product,
  category: ["electronics", "fashion", "home", "books"][index % 4],
  condition: ["new", "like-new", "good", "fair"][Math.floor(Math.random() * 4)],
  seller: {
    name: ["TechStore", "FashionHub", "HomeDecor", "BookWorld"][index % 4],
    rating: 4.2 + Math.random() * 0.8,
    location: ["Mumbai", "Delhi", "Bangalore", "Chennai"][index % 4],
    verified: true
  },
  likes: Math.floor(Math.random() * 100) + 10,
  views: Math.floor(Math.random() * 500) + 50,
  createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000)
}));

export default function ProductsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { cart, toggleCartItem } = useCart();
  const { logAction } = useActionLogger();
  
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [sortBy, setSortBy] = useState<SortOption>("relevance");
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [mounted, setMounted] = useState(false);
  
  const ITEMS_PER_PAGE = 8;

  useEffect(() => {
    setMounted(true);
    const searchQuery = searchParams?.get("q") || "";
    const category = searchParams?.get("category") || "";
    logAction('navigate', 'Visited Products page', { searchQuery, category });
  }, [logAction, searchParams]);

  const searchQuery = searchParams?.get("q") || "";
  const categoryFilter = searchParams?.get("category") || "";
  const minPrice = parseInt(searchParams?.get("min") || "0");
  const maxPrice = parseInt(searchParams?.get("max") || "999999");

  const filteredProducts = useMemo(() => {
    let filtered = extendedProducts.filter(product => {
      const matchesSearch = !searchQuery || 
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = !categoryFilter || product.category === categoryFilter;
      const matchesPrice = product.price >= minPrice && product.price <= maxPrice;
      
      return matchesSearch && matchesCategory && matchesPrice;
    });

    switch (sortBy) {
      case "price-low":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "newest":
        filtered.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
        break;
      case "popular":
        filtered.sort((a, b) => (b.likes + b.views) - (a.likes + a.views));
        break;
      default:
        break;
    }

    return filtered;
  }, [searchQuery, categoryFilter, minPrice, maxPrice, sortBy]);

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleProductClick = (product: any) => {
    logAction('view', `Viewed product: ${product.name}`, { 
      productId: product.id, 
      source: 'products_page' 
    });
    router.push(`/products/${product.id}`);
  };

  const handleCartToggle = (product: any) => {
    const inCart = cart.some((item) => item.id === product.id);
    logAction('cart', inCart ? `Removed ${product.name} from cart` : `Added ${product.name} to cart`, {
      productId: product.id,
      action: inCart ? 'remove' : 'add',
      source: 'products_page'
    });
    toggleCartItem(product);
  };

  const handleLike = (product: any) => {
    logAction('like', `Liked product: ${product.name}`, { productId: product.id });
  };

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="text-center space-y-4">
          <motion.h1 
            className="text-4xl font-bold gradient-text"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Explore Products
          </motion.h1>
          {searchQuery && (
            <p className="text-xl text-white/80">
              Search results for: <span className="gradient-text">"{searchQuery}"</span>
            </p>
          )}
          <div className="flex flex-wrap justify-center gap-2">
            <Badge className="bg-primary/20 text-primary border-primary/30">
              {filteredProducts.length} Products Found
            </Badge>
            {categoryFilter && (
              <Badge className="bg-secondary/20 text-secondary border-secondary/30">
                Category: {categoryFilter}
              </Badge>
            )}
            {(minPrice > 0 || maxPrice < 999999) && (
              <Badge className="bg-accent/20 text-accent border-accent/30">
                ₹{minPrice} - ₹{maxPrice}
              </Badge>
            )}
          </div>
        </div>

        <Card className="card-gradient glow">
          <CardContent className="p-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Button
                    variant={viewMode === "grid" ? "default" : "outline"}
                    size="sm"
                    onClick={() => {
                      setViewMode("grid");
                      logAction('click', 'Changed to grid view');
                    }}
                    className={viewMode === "grid" ? "btn-gradient" : "border-primary/50 text-white hover:bg-primary/10"}
                  >
                    <Grid className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "default" : "outline"}
                    size="sm"
                    onClick={() => {
                      setViewMode("list");
                      logAction('click', 'Changed to list view');
                    }}
                    className={viewMode === "list" ? "btn-gradient" : "border-primary/50 text-white hover:bg-primary/10"}
                  >
                    <List className="w-4 h-4" />
                  </Button>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setShowFilters(!showFilters);
                    logAction('click', 'Toggled filters panel');
                  }}
                  className="border-primary/50 text-white hover:bg-primary/10"
                >
                  <Filter className="w-4 h-4 mr-2" />
                  Filters
                  <ChevronDown className={`w-4 h-4 ml-2 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
                </Button>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-white/80 text-sm">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => {
                    setSortBy(e.target.value as SortOption);
                    logAction('click', 'Changed sort option', { sortBy: e.target.value });
                  }}
                  className="input-gradient px-3 py-1 rounded text-sm"
                >
                  <option value="relevance" className="bg-gray-900">Relevance</option>
                  <option value="price-low" className="bg-gray-900">Price: Low to High</option>
                  <option value="price-high" className="bg-gray-900">Price: High to Low</option>
                  <option value="newest" className="bg-gray-900">Newest First</option>
                  <option value="popular" className="bg-gray-900">Most Popular</option>
                </select>
              </div>
            </div>

            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 pt-4 border-t border-white/10"
              >
                <div className="grid md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-2">Category</label>
                    <select className="input-gradient w-full px-3 py-2 rounded text-sm">
                      <option value="" className="bg-gray-900">All Categories</option>
                      <option value="electronics" className="bg-gray-900">Electronics</option>
                      <option value="fashion" className="bg-gray-900">Fashion</option>
                      <option value="home" className="bg-gray-900">Home</option>
                      <option value="books" className="bg-gray-900">Books</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-2">Condition</label>
                    <select className="input-gradient w-full px-3 py-2 rounded text-sm">
                      <option value="" className="bg-gray-900">Any Condition</option>
                      <option value="new" className="bg-gray-900">New</option>
                      <option value="like-new" className="bg-gray-900">Like New</option>
                      <option value="good" className="bg-gray-900">Good</option>
                      <option value="fair" className="bg-gray-900">Fair</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-2">Location</label>
                    <select className="input-gradient w-full px-3 py-2 rounded text-sm">
                      <option value="" className="bg-gray-900">Any Location</option>
                      <option value="mumbai" className="bg-gray-900">Mumbai</option>
                      <option value="delhi" className="bg-gray-900">Delhi</option>
                      <option value="bangalore" className="bg-gray-900">Bangalore</option>
                      <option value="chennai" className="bg-gray-900">Chennai</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-2">Rating</label>
                    <select className="input-gradient w-full px-3 py-2 rounded text-sm">
                      <option value="" className="bg-gray-900">Any Rating</option>
                      <option value="4" className="bg-gray-900">4★ & Above</option>
                      <option value="4.5" className="bg-gray-900">4.5★ & Above</option>
                    </select>
                  </div>
                </div>
              </motion.div>
            )}
          </CardContent>
        </Card>

        {filteredProducts.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16 space-y-6"
          >
            <Card className="card-gradient glow max-w-md mx-auto">
              <CardContent className="p-12 space-y-6">
                <div className="text-6xl">🔍</div>
                <h3 className="text-2xl font-bold text-white">No products found</h3>
                <p className="text-white/80">
                  Try adjusting your search criteria or browse all products.
                </p>
                <Button 
                  onClick={() => {
                    logAction('click', 'Clicked Browse All from no results');
                    router.push('/products');
                  }}
                  className="btn-gradient"
                >
                  Browse All Products
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <>
            <div className={viewMode === "grid" 
              ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" 
              : "space-y-4"
            }>
              {paginatedProducts.map((product, index) => {
                const inCart = cart.some((item) => item.id === product.id);

                return viewMode === "grid" ? (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                    whileHover={{ scale: 1.02 }}
                    className="cursor-pointer group"
                  >
                    <Card className="card-gradient glow overflow-hidden h-full">
                      <div className="relative overflow-hidden">
                        <Image
                          src={product.image}
                          alt={product.name}
                          width={300}
                          height={200}
                          className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
                          onClick={() => handleProductClick(product)}
                        />
                        <div className="absolute top-3 right-3 flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="p-2 bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleLike(product);
                            }}
                          >
                            <Heart className="w-4 h-4 text-red-400" />
                          </Button>
                        </div>
                        <div className="absolute top-3 left-3">
                          <Badge className="bg-primary/20 text-primary border-primary/30 text-xs">
                            {generateProductIdWithChecksum(product.id)}
                          </Badge>
                        </div>
                        <div className="absolute bottom-3 left-3 right-3">
                          <Badge className={`text-xs ${
                            product.condition === 'new' ? 'bg-green-500/20 text-green-400' :
                            product.condition === 'like-new' ? 'bg-blue-500/20 text-blue-400' :
                            product.condition === 'good' ? 'bg-yellow-500/20 text-yellow-400' :
                            'bg-orange-500/20 text-orange-400'
                          }`}>
                            {product.condition.toUpperCase()}
                          </Badge>
                        </div>
                      </div>
                      
                      <CardContent className="p-4 space-y-3">
                        <div onClick={() => handleProductClick(product)}>
                          <h3 className="font-bold text-lg text-white group-hover:text-primary transition-colors line-clamp-2">
                            {product.name}
                          </h3>
                          
                          <div className="flex items-center justify-between mt-2">
                            <p className="text-xl font-bold gradient-text">₹{product.price.toLocaleString()}</p>
                          </div>

                          <div className="flex items-center gap-2 mt-2">
                            <div className="flex items-center gap-1">
                              <Star className="w-3 h-3 text-yellow-400 fill-current" />
                              <span className="text-xs text-white/70">{product.seller.rating.toFixed(1)}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <MapPin className="w-3 h-3 text-white/70" />
                              <span className="text-xs text-white/70">{product.seller.location}</span>
                            </div>
                          </div>

                          <p className="text-xs text-white/60 mt-1">
                            by {product.seller.name} • {product.likes} likes
                          </p>
                        </div>

                        <div className="flex gap-2">
                          <Button
                            onClick={() => handleCartToggle(product)}
                            className={`flex-1 text-xs ${
                              inCart 
                                ? "bg-red-500 hover:bg-red-600 text-white" 
                                : "btn-gradient"
                            }`}
                            size="sm"
                          >
                            <ShoppingCart className="w-3 h-3 mr-1" />
                            {inCart ? "Remove" : "Add to Cart"}
                          </Button>
                          <Button
                            onClick={() => handleProductClick(product)}
                            variant="outline"
                            className="border-primary/50 text-white hover:bg-primary/10"
                            size="sm"
                          >
                            <Eye className="w-3 h-3" />
                          </Button>
                        </div>

                        <div className="text-xs text-white/50 text-center">
                          Fee: ₹{calculatePlatformFee(product.price)}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ) : (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                  >
                    <Card className="card-gradient glow">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-4">
                          <div className="relative flex-shrink-0">
                            <Image
                              src={product.image}
                              alt={product.name}
                              width={120}
                              height={90}
                              className="rounded-lg object-cover cursor-pointer"
                              onClick={() => handleProductClick(product)}
                            />
                            <Badge className="absolute -top-2 -right-2 bg-primary/20 text-primary border-primary/30 text-xs">
                              {generateProductIdWithChecksum(product.id)}
                            </Badge>
                          </div>
                          
                          <div className="flex-1 space-y-2">
                            <div className="flex justify-between items-start">
                              <h3 
                                className="font-bold text-xl text-white hover:text-primary transition-colors cursor-pointer"
                                onClick={() => handleProductClick(product)}
                              >
                                {product.name}
                              </h3>
                              <div className="text-right">
                                <p className="text-2xl font-bold gradient-text">₹{product.price.toLocaleString()}</p>
                                <p className="text-xs text-white/60">Fee: ₹{calculatePlatformFee(product.price)}</p>
                              </div>
                            </div>

                            <div className="flex items-center gap-4">
                              <Badge className={`text-xs ${
                                product.condition === 'new' ? 'bg-green-500/20 text-green-400' :
                                product.condition === 'like-new' ? 'bg-blue-500/20 text-blue-400' :
                                product.condition === 'good' ? 'bg-yellow-500/20 text-yellow-400' :
                                'bg-orange-500/20 text-orange-400'
                              }`}>
                                {product.condition.toUpperCase()}
                              </Badge>
                              
                              <div className="flex items-center gap-1">
                                <Star className="w-3 h-3 text-yellow-400 fill-current" />
                                <span className="text-xs text-white/70">{product.seller.rating.toFixed(1)}</span>
                              </div>
                              
                              <div className="flex items-center gap-1">
                                <MapPin className="w-3 h-3 text-white/70" />
                                <span className="text-xs text-white/70">{product.seller.location}</span>
                              </div>
                            </div>

                            <p className="text-sm text-white/70">
                              Sold by {product.seller.name} • {product.likes} likes • {product.views} views
                            </p>

                            <div className="flex items-center gap-2">
                              <Button
                                onClick={() => handleCartToggle(product)}
                                className={inCart 
                                  ? "bg-red-500 hover:bg-red-600 text-white" 
                                  : "btn-gradient"
                                }
                                size="sm"
                              >
                                <ShoppingCart className="w-4 h-4 mr-2" />
                                {inCart ? "Remove from Cart" : "Add to Cart"}
                              </Button>
                              
                              <Button
                                onClick={() => handleProductClick(product)}
                                variant="outline"
                                className="border-primary/50 text-white hover:bg-primary/10"
                                size="sm"
                              >
                                <Eye className="w-4 h-4 mr-2" />
                                View Details
                              </Button>
                              
                              <Button
                                onClick={() => handleLike(product)}
                                variant="outline"
                                className="border-primary/50 text-white hover:bg-primary/10"
                                size="sm"
                              >
                                <Heart className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>

            {totalPages > 1 && (
              <Card className="card-gradient glow">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-white/70">
                      Showing {((currentPage - 1) * ITEMS_PER_PAGE) + 1} to {Math.min(currentPage * ITEMS_PER_PAGE, filteredProducts.length)} of {filteredProducts.length} products
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button
                        onClick={() => {
                          setCurrentPage(prev => Math.max(prev - 1, 1));
                          logAction('click', 'Navigated to previous page', { page: currentPage - 1 });
                        }}
                        disabled={currentPage === 1}
                        variant="outline"
                        size="sm"
                        className="border-primary/50 text-white hover:bg-primary/10 disabled:opacity-50"
                      >
                        Previous
                      </Button>
                      
                      <div className="flex items-center gap-1">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                          <Button
                            key={page}
                            onClick={() => {
                              setCurrentPage(page);
                              logAction('click', 'Navigated to page', { page });
                            }}
                            variant={currentPage === page ? "default" : "outline"}
                            size="sm"
                            className={currentPage === page 
                              ? "btn-gradient" 
                              : "border-primary/50 text-white hover:bg-primary/10"
                            }
                          >
                            {page}
                          </Button>
                        ))}
                      </div>
                      
                      <Button
                        onClick={() => {
                          setCurrentPage(prev => Math.min(prev + 1, totalPages));
                          logAction('click', 'Navigated to next page', { page: currentPage + 1 });
                        }}
                        disabled={currentPage === totalPages}
                        variant="outline"
                        size="sm"
                        className="border-primary/50 text-white hover:bg-primary/10 disabled:opacity-50"
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </>
        )}
      </div>
    </div>
  );
}