"use client";

import { products } from "@/app/lib/mockData";
import Image from "next/image";
import { notFound, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { use } from "react";
import { useCart } from "@/context/CartContext";
import { useActionLogger } from "@/utils/seed";
import { generateProductIdWithChecksum, calculatePlatformFee } from "@/utils/seed";
import { 
  Heart, 
  ShoppingCart, 
  Share2, 
  Star, 
  MapPin, 
  Clock,
  Shield,
  Truck,
  RotateCcw,
  MessageCircle,
  TrendingUp,
  Eye,
  Users
} from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const getExtendedProduct = (id: number) => {
  const baseProduct = products.find((p) => p.id === id);
  if (!baseProduct) return null;

  return {
    ...baseProduct,
    description: "This premium quality product offers excellent value for money. Carefully maintained and in great condition, perfect for anyone looking for quality at an affordable price.",
    condition: "Like New",
    category: ["Electronics", "Fashion", "Home", "Books"][id % 4],
    specifications: [
      { label: "Brand", value: "Premium Brand" },
      { label: "Model", value: `Model-${id}` },
      { label: "Condition", value: "Like New" },
      { label: "Warranty", value: "6 months" }
    ],
    seller: {
      id: 1,
      name: "TechStore Premium",
      rating: 4.7,
      totalSales: 1580,
      location: "Mumbai, Maharashtra",
      verified: true,
      joinedDate: "2022-03-15",
      responseTime: "< 2 hours"
    },
    stats: {
      views: Math.floor(Math.random() * 500) + 50,
      likes: Math.floor(Math.random() * 100) + 10,
      watchers: Math.floor(Math.random() * 30) + 5
    },
    shipping: {
      cost: baseProduct.price > 2000 ? 0 : 99,
      estimatedDays: "2-3 days",
      methods: ["Standard Delivery", "Express Delivery"]
    },
    policies: {
      returns: "7-day return policy",
      warranty: "6 months warranty",
      authenticity: "100% authentic guarantee"
    },
    priceHistory: [
      { date: "2024-01-01", price: baseProduct.price + 500 },
      { date: "2024-01-15", price: baseProduct.price + 200 },
      { date: "2024-02-01", price: baseProduct.price }
    ],
    similarProducts: products.filter(p => p.id !== id).slice(0, 3),
    images: [baseProduct.image, baseProduct.image, baseProduct.image]
  };
};

export default function ProductDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const product = getExtendedProduct(Number(id));
  const { cart, toggleCartItem } = useCart();
  const { logAction } = useActionLogger();
  
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (product) {
      setMounted(true);
      logAction('view', `Viewed product details: ${product.name}`, { 
        productId: product.id,
        category: product.category,
        price: product.price
      });
    }
  }, [product, logAction]);

  if (!product) return notFound();

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  const inCart = cart.some((p) => p.id === product.id);
  const platformFee = calculatePlatformFee(product.price);
  const totalWithFee = product.price + platformFee;

  const handleCartToggle = () => {
    logAction('cart', inCart ? `Removed ${product.name} from cart` : `Added ${product.name} to cart`, {
      productId: product.id,
      action: inCart ? 'remove' : 'add',
      source: 'product_detail'
    });
    toggleCartItem(product);
  };

  const handleWishlistToggle = () => {
    setIsWishlisted(!isWishlisted);
    logAction('like', isWishlisted ? `Removed ${product.name} from wishlist` : `Added ${product.name} to wishlist`, {
      productId: product.id,
      action: isWishlisted ? 'remove' : 'add'
    });
  };

  const handleContactSeller = () => {
    logAction('click', `Contacted seller from product: ${product.name}`, { 
      productId: product.id,
      sellerId: product.seller.id
    });
    router.push(`profile/seller/${product.seller.id}`);
  };

  const handleShare = () => {
    logAction('click', `Shared product: ${product.name}`, { productId: product.id });
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: `Check out this ${product.name} on ReSellHub`,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  return (
    <div className="min-h-screen py-12 px-6">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="text-sm text-white/60 flex items-center gap-2">
          <span 
            className="cursor-pointer hover:text-primary"
            onClick={() => router.push('/products')}
          >
            Products
          </span>
          <span>›</span>
          <span 
            className="cursor-pointer hover:text-primary"
            onClick={() => router.push(`/products?category=${product.category.toLowerCase()}`)}
          >
            {product.category}
          </span>
          <span>›</span>
          <span className="text-white">{product.name}</span>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <Image
                src={product.images[activeImageIndex]}
                alt={product.name}
                width={600}
                height={500}
                className="w-full h-96 object-cover rounded-xl glow"
              />
              <div className="absolute top-4 left-4">
                <Badge className="bg-primary/20 text-primary border-primary/30">
                  {generateProductIdWithChecksum(product.id)}
                </Badge>
              </div>
              <div className="absolute top-4 right-4 flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleWishlistToggle}
                  className={`p-2 backdrop-blur-sm border-white/20 ${
                    isWishlisted 
                      ? 'bg-red-500/80 text-white' 
                      : 'bg-white/10 text-white hover:bg-white/20'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleShare}
                  className="p-2 bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 text-white"
                >
                  <Share2 className="w-4 h-4" />
                </Button>
              </div>
            </motion.div>

            <div className="flex gap-2">
              {product.images.map((image, index) => (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  onClick={() => setActiveImageIndex(index)}
                  className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                    activeImageIndex === index 
                      ? 'border-primary' 
                      : 'border-white/20 hover:border-white/40'
                  }`}
                >
                  <Image
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    width={80}
                    height={80}
                    className="w-full h-full object-cover"
                  />
                </motion.button>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-4xl font-bold text-white mb-2">{product.name}</h1>
                  <div className="flex items-center gap-4 text-white/70">
                    <span>Category: {product.category}</span>
                    <span>•</span>
                    <Badge className="bg-green-500/20 text-green-400 border-green-400/30">
                      {product.condition}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-4xl font-bold gradient-text">₹{product.price.toLocaleString()}</div>
                <div className="text-sm text-white/60">
                  Platform fee: ₹{platformFee} | Total: ₹{totalWithFee.toLocaleString()}
                </div>
                <div className="flex items-center gap-2 text-sm text-green-400">
                  <TrendingUp className="w-4 h-4" />
                  <span>Price dropped by ₹500 this month!</span>
                </div>
              </div>

              <div className="flex items-center gap-6 text-sm text-white/70">
                <div className="flex items-center gap-1">
                  <Eye className="w-4 h-4" />
                  <span>{product.stats.views} views</span>
                </div>
                <div className="flex items-center gap-1">
                  <Heart className="w-4 h-4" />
                  <span>{product.stats.likes} likes</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  <span>{product.stats.watchers} watching</span>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="text-xl font-semibold text-white">Description</h3>
                <p className="text-white/80 leading-relaxed">{product.description}</p>
              </div>
=
              <div className="flex gap-4">
                <Button
                  onClick={handleCartToggle}
                  className={`flex-1 text-lg py-4 ${
                    inCart 
                      ? "bg-red-500 hover:bg-red-600 text-white" 
                      : "btn-gradient glow"
                  }`}
                  size="lg"
                >
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  {inCart ? "Remove from Cart" : "Add to Cart"}
                </Button>
                <Button
                  onClick={handleContactSeller}
                  variant="outline"
                  className="border-primary/50 text-white hover:bg-primary/10"
                  size="lg"
                >
                  <MessageCircle className="w-5 h-5 mr-2" />
                  View Seller
                </Button>
              </div>
            </motion.div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="card-gradient glow">
            <CardHeader>
              <CardTitle className="text-lg gradient-text flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Seller
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                  <span className="text-primary font-semibold">
                    {product.seller.name.charAt(0)}
                  </span>
                </div>
                <div>
                  <div className="font-semibold text-white">{product.seller.name}</div>
                  <div className="text-xs text-white/60">
                    {product.seller.verified && (
                      <Badge className="bg-green-500/20 text-green-400 border-green-400/30 text-xs">
                        Verified
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
              <div className="space-y-1 text-sm text-white/70">
                <div className="flex items-center gap-1">
                  <Star className="w-3 h-3 text-yellow-400 fill-current" />
                  <span>{product.seller.rating} ({product.seller.totalSales} sales)</span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  <span>{product.seller.location}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>Response: {product.seller.responseTime}</span>
                </div>
              </div>
              <Button
                onClick={handleContactSeller}
                className="btn-gradient w-full"
                size="sm"
              >
                View Profile
              </Button>
            </CardContent>
          </Card>

          <Card className="card-gradient glow">
            <CardHeader>
              <CardTitle className="text-lg gradient-text flex items-center gap-2">
                <Truck className="w-5 h-5" />
                Shipping
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2 text-sm text-white/80">
                <div className="flex justify-between">
                  <span>Shipping Cost:</span>
                  <span className={product.shipping.cost === 0 ? "text-green-400 font-semibold" : "text-white"}>
                    {product.shipping.cost === 0 ? "FREE" : `₹${product.shipping.cost}`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery:</span>
                  <span>{product.shipping.estimatedDays}</span>
                </div>
              </div>
              <div className="text-xs text-white/60">
                {product.shipping.cost === 0 && "Free shipping on this item!"}
              </div>
            </CardContent>
          </Card>

          <Card className="card-gradient glow">
            <CardHeader>
              <CardTitle className="text-lg gradient-text flex items-center gap-2">
                <RotateCcw className="w-5 h-5" />
                Policies
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-white/80">
              <div>{product.policies.returns}</div>
              <div>{product.policies.warranty}</div>
              <div className="text-green-400">{product.policies.authenticity}</div>
            </CardContent>
          </Card>

          <Card className="card-gradient glow">
            <CardHeader>
              <CardTitle className="text-lg gradient-text">Specifications</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {product.specifications.map((spec, index) => (
                <div key={index} className="flex justify-between text-sm">
                  <span className="text-white/70">{spec.label}:</span>
                  <span className="text-white">{spec.value}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}