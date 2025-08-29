"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useActionLogger } from "@/utils/seed";
import { products } from "@/app/lib/mockData";
import { generateProductIdWithChecksum, calculatePlatformFee } from "@/utils/seed";
import { 
  Star, 
  MapPin, 
  Calendar, 
  Package, 
  MessageCircle, 
  Shield,
  ShoppingCart,
  Eye,
  Heart,
  Award
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { use } from "react";

const mockSeller = {
  id: 1,
  name: "TechStore Premium",
  avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
  location: "Mumbai, Maharashtra",
  joinedDate: "2022-03-15",
  rating: 4.7,
  totalReviews: 234,
  totalSales: 1580,
  responseTime: "< 2 hours",
  verified: true,
  description: "Premium electronics seller with over 5 years of experience. We specialize in genuine products with warranty support.",
  stats: {
    totalListings: 45,
    activeListings: 28,
    soldItems: 1580,
    repeatCustomers: 67
  },
  badges: ["Top Seller", "Verified", "Fast Shipping", "Excellent Service"],
  policies: {
    returns: "7-day return policy",
    shipping: "Free shipping on orders above ₹2000",
    warranty: "1-year warranty on electronics"
  }
};

const mockReviews = [
  {
    id: 1,
    buyer: "Rahul S.",
    rating: 5,
    comment: "Excellent product quality and fast delivery. Highly recommended!",
    date: "2024-01-15",
    product: "Smart Watch"
  },
  {
    id: 2,
    buyer: "Priya M.",
    rating: 4,
    comment: "Good seller, product as described. Quick response to queries.",
    date: "2024-01-10",
    product: "Vintage Sneakers"
  },
  {
    id: 3,
    buyer: "Amit K.",
    rating: 5,
    comment: "Amazing service! The product was delivered in perfect condition.",
    date: "2024-01-08",
    product: "Leather Jacket"
  }
];

export default function SellerProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { logAction } = useActionLogger();
  const [activeTab, setActiveTab] = useState<"products" | "reviews" | "about">("products");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    logAction('navigate', `Visited seller profile: ${mockSeller.name}`, { sellerId: id });
  }, [logAction, id]);

  const handleProductClick = (product: any) => {
    logAction('view', `Viewed product ${product.name} from seller profile`, { 
      productId: product.id, 
      sellerId: id 
    });
    router.push(`/products/${product.id}`);
  };

  const handleContactSeller = () => {
    logAction('click', `Contacted seller: ${mockSeller.name}`, { sellerId: id });
    router.push(`/products/profile/seller/${id}/chat`);
  };
  

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-6">
      <div className="max-w-6xl mx-auto space-y-8">
        <Card className="card-gradient glow">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row items-start gap-6">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <img
                    src={mockSeller.avatar}
                    alt={mockSeller.name}
                    className="w-20 h-20 rounded-full object-cover border-2 border-primary/50"
                  />
                  {mockSeller.verified && (
                    <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-1">
                      <Shield className="w-3 h-3 text-white" />
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <h1 className="text-3xl font-bold gradient-text">{mockSeller.name}</h1>
                    {mockSeller.verified && (
                      <Badge className="bg-green-500/20 text-green-400 border-green-400/30">
                        <Shield className="w-3 h-3 mr-1" />
                        Verified
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-4 text-white/80">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      <span>{mockSeller.location}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>Joined {new Date(mockSeller.joinedDate).getFullYear()}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <div className="flex">
                        {Array.from({ length: 5 }, (_, i) => (
                          <Star 
                            key={i} 
                            className={`w-4 h-4 ${
                              i < Math.floor(mockSeller.rating) 
                                ? 'text-yellow-400 fill-current' 
                                : 'text-gray-400'
                            }`} 
                          />
                        ))}
                      </div>
                      <span className="text-white font-semibold">{mockSeller.rating}</span>
                      <span className="text-white/60">({mockSeller.totalReviews} reviews)</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="ml-auto flex flex-col gap-3">
                <Button 
                  onClick={handleContactSeller}
                  className="btn-gradient"
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Contact Seller
                </Button>
                <div className="text-center">
                  <div className="text-sm text-white/60">Response time:</div>
                  <div className="text-primary font-semibold">{mockSeller.responseTime}</div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
              {mockSeller.badges.map((badge) => (
                <Badge key={badge} className="bg-primary/20 text-primary border-primary/30">
                  <Award className="w-3 h-3 mr-1" />
                  {badge}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="card-gradient glow">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold gradient-text">{mockSeller.stats.totalListings}</div>
              <div className="text-sm text-white/70">Total Listings</div>
            </CardContent>
          </Card>
          <Card className="card-gradient glow">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold gradient-text">{mockSeller.stats.soldItems.toLocaleString()}</div>
              <div className="text-sm text-white/70">Items Sold</div>
            </CardContent>
          </Card>
          <Card className="card-gradient glow">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold gradient-text">{mockSeller.stats.repeatCustomers}%</div>
              <div className="text-sm text-white/70">Repeat Customers</div>
            </CardContent>
          </Card>
          <Card className="card-gradient glow">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold gradient-text">{mockSeller.stats.activeListings}</div>
              <div className="text-sm text-white/70">Active Listings</div>
            </CardContent>
          </Card>
        </div>

        <Card className="card-gradient glow">
          <CardHeader>
            <div className="flex gap-4">
              <Button
                variant={activeTab === "products" ? "default" : "outline"}
                onClick={() => {
                  setActiveTab("products");
                  logAction('click', 'Switched to products tab', { sellerId: id });
                }}
                className={activeTab === "products" ? "btn-gradient" : "border-primary/50 text-white hover:bg-primary/10"}
              >
                <Package className="w-4 h-4 mr-2" />
                Products ({mockSeller.stats.activeListings})
              </Button>
              <Button
                variant={activeTab === "reviews" ? "default" : "outline"}
                onClick={() => {
                  setActiveTab("reviews");
                  logAction('click', 'Switched to reviews tab', { sellerId: id });
                }}
                className={activeTab === "reviews" ? "btn-gradient" : "border-primary/50 text-white hover:bg-primary/10"}
              >
                <Star className="w-4 h-4 mr-2" />
                Reviews ({mockSeller.totalReviews})
              </Button>
              <Button
                variant={activeTab === "about" ? "default" : "outline"}
                onClick={() => {
                  setActiveTab("about");
                  logAction('click', 'Switched to about tab', { sellerId: id });
                }}
                className={activeTab === "about" ? "btn-gradient" : "border-primary/50 text-white hover:bg-primary/10"}
              >
                About
              </Button>
            </div>
          </CardHeader>
          
          <CardContent>
            {activeTab === "products" && (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                    className="cursor-pointer group"
                  >
                    <Card className="glass-dark border border-primary/20 hover:border-primary/40 transition-all overflow-hidden">
                      <div className="relative">
                        <Image
                          src={product.image}
                          alt={product.name}
                          width={250}
                          height={150}
                          className="w-full h-40 object-cover transition-transform duration-300 group-hover:scale-110"
                          onClick={() => handleProductClick(product)}
                        />
                        <div className="absolute top-2 left-2">
                          <Badge className="bg-primary/20 text-primary border-primary/30 text-xs">
                            {generateProductIdWithChecksum(product.id)}
                          </Badge>
                        </div>
                        <div className="absolute top-2 right-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="p-2 bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20"
                            onClick={(e) => {
                              e.stopPropagation();
                              logAction('like', `Liked ${product.name} from seller profile`, { productId: product.id });
                            }}
                          >
                            <Heart className="w-3 h-3 text-white" />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="p-4 space-y-3">
                        <div onClick={() => handleProductClick(product)}>
                          <h3 className="font-semibold text-white group-hover:text-primary transition-colors">
                            {product.name}
                          </h3>
                          <p className="text-xl font-bold gradient-text">₹{product.price.toLocaleString()}</p>
                          <p className="text-xs text-white/60">Fee: ₹{calculatePlatformFee(product.price)}</p>
                        </div>
                        
                        <div className="flex gap-2">
                          <Button
                            onClick={() => {
                              logAction('cart', `Added ${product.name} to cart from seller profile`, { productId: product.id });
                            }}
                            className="btn-gradient flex-1"
                            size="sm"
                          >
                            <ShoppingCart className="w-3 h-3 mr-1" />
                            Add to Cart
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
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}

            {activeTab === "reviews" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-white">Customer Reviews</h3>
                  <div className="flex items-center gap-2">
                    <div className="flex">
                      {Array.from({ length: 5 }, (_, i) => (
                        <Star 
                          key={i} 
                          className={`w-5 h-5 ${
                            i < Math.floor(mockSeller.rating) 
                              ? 'text-yellow-400 fill-current' 
                              : 'text-gray-400'
                          }`} 
                        />
                      ))}
                    </div>
                    <span className="text-xl font-bold gradient-text">{mockSeller.rating}</span>
                    <span className="text-white/60">({mockSeller.totalReviews} reviews)</span>
                  </div>
                </div>

                {mockReviews.map((review, index) => (
                  <motion.div
                    key={review.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                  >
                    <Card className="glass-dark border border-white/10">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                              <span className="text-primary font-semibold">
                                {review.buyer.charAt(0)}
                              </span>
                            </div>
                            <div>
                              <div className="font-semibold text-white">{review.buyer}</div>
                              <div className="text-xs text-white/60">
                                {new Date(review.date).toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                          <div className="flex">
                            {Array.from({ length: 5 }, (_, i) => (
                              <Star 
                                key={i} 
                                className={`w-4 h-4 ${
                                  i < review.rating 
                                    ? 'text-yellow-400 fill-current' 
                                    : 'text-gray-400'
                                }`} 
                              />
                            ))}
                          </div>
                        </div>
                        
                        <p className="text-white/80 mb-2">{review.comment}</p>
                        <div className="text-sm text-primary">Product: {review.product}</div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}

            {activeTab === "about" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">About the Seller</h3>
                  <p className="text-white/80 leading-relaxed">{mockSeller.description}</p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">Policies</h3>
                  <div className="grid md:grid-cols-3 gap-4">
                    <Card className="glass-dark border border-white/10">
                      <CardContent className="p-4">
                        <h4 className="font-semibold text-primary mb-2">Returns</h4>
                        <p className="text-sm text-white/70">{mockSeller.policies.returns}</p>
                      </CardContent>
                    </Card>
                    <Card className="glass-dark border border-white/10">
                      <CardContent className="p-4">
                        <h4 className="font-semibold text-primary mb-2">Shipping</h4>
                        <p className="text-sm text-white/70">{mockSeller.policies.shipping}</p>
                      </CardContent>
                    </Card>
                    <Card className="glass-dark border border-white/10">
                      <CardContent className="p-4">
                        <h4 className="font-semibold text-primary mb-2">Warranty</h4>
                        <p className="text-sm text-white/70">{mockSeller.policies.warranty}</p>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">Performance Metrics</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-4 glass-dark rounded-lg">
                      <div className="text-2xl font-bold gradient-text">98%</div>
                      <div className="text-sm text-white/70">Positive Feedback</div>
                    </div>
                    <div className="text-center p-4 glass-dark rounded-lg">
                      <div className="text-2xl font-bold gradient-text">2.1 days</div>
                      <div className="text-sm text-white/70">Avg Shipping Time</div>
                    </div>
                    <div className="text-center p-4 glass-dark rounded-lg">
                      <div className="text-2xl font-bold gradient-text"> 1 hour</div>
                      <div className="text-sm text-white/70">Response Time</div>
                    </div>
                    <div className="text-center p-4 glass-dark rounded-lg">
                      <div className="text-2xl font-bold gradient-text">99.5%</div>
                      <div className="text-sm text-white/70">Order Accuracy</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}