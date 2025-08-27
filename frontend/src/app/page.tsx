"use client";

import { products } from "./lib/mockData";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { useActionLogger } from "@/utils/seed";
import { generateProductIdWithChecksum, calculatePlatformFee, ASSIGNMENT_SEED } from "@/utils/seed";
import { Heart, ShoppingBag, Sparkles, TrendingUp, Users, Shield } from "lucide-react";
import { useEffect, useState } from "react";

export default function LandingPage() {
  const router = useRouter();
  const { cart, toggleCartItem } = useCart();
  const { logAction } = useActionLogger();
  const [mounted, setMounted] = useState(false);

  const [likedProducts, setLikedProducts] = useState<string[]>([]);

  useEffect(() => {
    setMounted(true);
    logAction("navigate", "Visited home page");
  }, [logAction]);

  const handleExploreClick = () => {
    logAction("click", "Clicked Start Exploring button");
    router.push("/products");
  };

  const handleProductClick = (product: any) => {
    logAction("view", `Viewed product: ${product.name}`, { productId: product.id });
    router.push(`/products/${product.id}`);
  };

  const handleCartToggle = (product: any) => {
    const inCart = cart.some((item) => item.id === product.id);
    logAction(
      "cart",
      inCart ? `Removed ${product.name} from cart` : `Added ${product.name} to cart`,
      {
        productId: product.id,
        action: inCart ? "remove" : "add",
      }
    );
    toggleCartItem(product);
  };

  const handleLikeToggle = (productId: string, productName: string) => {
    setLikedProducts((prevLiked) =>
      prevLiked.includes(productId)
        ? prevLiked.filter((id) => id !== productId)
        : [...prevLiked, productId]
    );

    logAction("like", `Toggled like for product: ${productName}`, { productId });
  };

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <section className="relative overflow-hidden py-20 px-6">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-accent/20"></div>

        <div className="relative z-10 text-center space-y-8">
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-4"
          >
            <h1 className="text-6xl md:text-8xl font-bold gradient-text float">
              ReSellHub
            </h1>
          </motion.div>

          <motion.h2
            className="text-3xl md:text-5xl font-bold text-white"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Buy & Sell with <span className="gradient-text">Ease</span>
          </motion.h2>

          <motion.p
            className="text-xl text-white/80 max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            Discover unique products, resell your treasures, and find the best deals
            in our dynamic marketplace with cutting-edge features and stunning design.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex flex-wrap gap-4 justify-center"
          >
            <Button
              onClick={handleExploreClick}
              size="lg"
              className="btn-gradient text-lg px-8 py-4 glow"
            >
              <Sparkles className="w-5 h-5 mr-2" />
              Start Exploring
            </Button>
            <Button
              onClick={() => {
                logAction("click", "Clicked Learn More button");
                router.push("/about");
              }}
              size="lg"
              variant="outline"
              className="border-primary/50 text-white hover:bg-primary/10 text-lg px-8 py-4"
            >
              Learn More
            </Button>
          </motion.div>
        </div>
      </section>

      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex justify-between items-center mb-12"
          >
            <div>
              <h3 className="text-4xl font-bold gradient-text mb-2">Featured Products</h3>
              <p className="text-xl text-white/80">Discover today's hottest deals</p>
            </div>
            <Button
              onClick={() => {
                logAction("click", "Clicked View All Products from featured section");
                router.push("/products");
              }}
              className="btn-gradient"
            >
              View All
            </Button>
          </motion.div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((product, index) => {
              const inCart = cart.some((item) => item.id === product.id);
              const productIdWithChecksum = generateProductIdWithChecksum(product.id);
              const isLiked = likedProducts.includes(String(product.id));

              return (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
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
                      <div className="absolute top-3 right-3">
                        <Button
                          size="sm"
                          variant="outline"
                          className={`p-2 bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 transition-colors duration-300`}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleLikeToggle(String(product.id), product.name);
                          }}
                        >
                          <Heart
                            className={`w-4 h-4 transition-colors duration-300 ${
                              isLiked ? "text-red-500 fill-red-500" : "text-white"
                            }`}
                          />
                        </Button>
                      </div>
                      <div className="absolute top-3 left-3">
                        <Badge className="bg-primary/20 text-primary border-primary/30">
                          ID: {productIdWithChecksum}
                        </Badge>
                      </div>
                    </div>

                    <CardContent className="p-6 space-y-4">
                      <div onClick={() => handleProductClick(product)}>
                        <h4 className="font-bold text-xl text-white group-hover:text-primary transition-colors">
                          {product.name}
                        </h4>
                        <div className="flex items-center justify-between mt-2">
                          <p className="text-2xl font-bold gradient-text">
                            ₹{product.price.toLocaleString()}
                          </p>
                          <Badge variant="outline" className="text-green-400 border-green-400/50">
                            Verified
                          </Badge>
                        </div>
                      </div>

                      <motion.div whileTap={{ scale: 0.95 }} className="space-y-2">
                        <Button
                          onClick={() => handleCartToggle(product)}
                          className={`w-full transition-all duration-300 ${
                            inCart
                              ? "bg-red-500 hover:bg-red-600 text-white"
                              : "btn-gradient"
                          }`}
                        >
                          <ShoppingBag className="w-4 h-4 mr-2" />
                          {inCart ? "Remove from Cart" : "Add to Cart"}
                        </Button>

                        <div className="text-xs text-white/60 text-center">
                          Platform fee: ₹{calculatePlatformFee(product.price)}
                        </div>
                      </motion.div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
