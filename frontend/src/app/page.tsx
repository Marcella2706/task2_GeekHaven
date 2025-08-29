"use client";

import { products } from "./lib/mockData";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useActionLogger } from "@/utils/seed";
import { generateProductIdWithChecksum, calculatePlatformFee, ASSIGNMENT_SEED } from "@/utils/seed";
import { Heart, ShoppingBag, Sparkles, TrendingUp, Users, Shield, TreePine } from "lucide-react";
import { useEffect, useState } from "react";

export default function LandingPage() {
  const router = useRouter();
  const { cart, toggleCartItem } = useCart();
  const { wishlist, toggleWishlistItem, isInWishlist } = useWishlist();
  const { logAction } = useActionLogger();
  const [mounted, setMounted] = useState(false);

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

  const handleWishlistToggle = (product: any) => {
    const inWishlist = isInWishlist(product.id);
    logAction(
      "like", 
      inWishlist ? `Removed ${product.name} from wishlist` : `Added ${product.name} to wishlist`, 
      { productId: product.id }
    );
    toggleWishlistItem(product);
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
      <section className="relative overflow-hidden py-20 px-6 wood-texture">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-accent/20"></div>

        <div className="relative z-10 text-center space-y-8">
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-4"
          >
            <h1 className="text-6xl md:text-8xl font-bold gradient-text float">
              🌲 ReSellHub
            </h1>
          </motion.div>

          <motion.h2
            className="text-3xl md:text-5xl font-bold text-white"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Buy & Sell with <span className="gradient-text">Natural Elegance</span>
          </motion.h2>

          <motion.p
            className="text-xl text-white/80 max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            Experience the warmth and sophistication of our wood-inspired marketplace. 
            Discover premium pre-owned items with the timeless appeal of natural aesthetics.
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
              <TreePine className="w-5 h-5 mr-2" />
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
              <h3 className="text-4xl font-bold gradient-text mb-2">🌟 Featured Products</h3>
              <p className="text-xl text-white/80">Handpicked treasures with natural appeal</p>
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
              const inWishlist = isInWishlist(product.id);
              const productIdWithChecksum = generateProductIdWithChecksum(product.id);

              return (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  className="cursor-pointer group"
                >
                  <Card className="card-gradient glow overflow-hidden h-full wood-texture">
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
                          className={`p-2 backdrop-blur-sm border-white/20 transition-all duration-300 ${
                            inWishlist 
                              ? 'bg-red-600/80 hover:bg-red-700/80 text-white border-red-500/50' 
                              : 'bg-white/10 hover:bg-white/20 text-white'
                          }`}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleWishlistToggle(product);
                          }}
                        >
                          <Heart
                            className={`w-4 h-4 transition-all duration-300 ${
                              inWishlist ? "text-red-100 fill-current scale-110" : "text-white"
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
                          <Badge className="text-green-400 border-green-400/50 bg-green-500/20">
                            Verified
                          </Badge>
                        </div>
                      </div>

                      <motion.div whileTap={{ scale: 0.95 }} className="space-y-2">
                        <Button
                          onClick={() => handleCartToggle(product)}
                          className={`w-full transition-all duration-300 ${
                            inCart
                              ? "bg-red-600 hover:bg-red-700 text-white"
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

      <section className="py-16 px-6 wood-texture">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h3 className="text-4xl font-bold gradient-text mb-4">🌿 Why Choose ReSellHub?</h3>
            <p className="text-xl text-white/80">Experience the perfect blend of nature and technology</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Card className="card-gradient glow text-center h-full">
                <CardContent className="p-6 space-y-4">
                  <div className="w-16 h-16 mx-auto bg-primary/20 rounded-full flex items-center justify-center">
                    <TreePine className="w-8 h-8 text-primary" />
                  </div>
                  <h4 className="text-xl font-bold text-white">Natural Design</h4>
                  <p className="text-white/70">
                    Experience the warmth of wood-inspired aesthetics in every interaction
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <Card className="card-gradient glow text-center h-full">
                <CardContent className="p-6 space-y-4">
                  <div className="w-16 h-16 mx-auto bg-primary/20 rounded-full flex items-center justify-center">
                    <Shield className="w-8 h-8 text-primary" />
                  </div>
                  <h4 className="text-xl font-bold text-white">Trusted Platform</h4>
                  <p className="text-white/70">
                    Every seller is verified and every transaction is protected
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Card className="card-gradient glow text-center h-full">
                <CardContent className="p-6 space-y-4">
                  <div className="w-16 h-16 mx-auto bg-primary/20 rounded-full flex items-center justify-center">
                    <TrendingUp className="w-8 h-8 text-primary" />
                  </div>
                  <h4 className="text-xl font-bold text-white">Smart Features</h4>
                  <p className="text-white/70">
                    Advanced search, wishlist management, and intelligent recommendations
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Card className="card-gradient glow text-center h-full">
                <CardContent className="p-6 space-y-4">
                  <div className="w-16 h-16 mx-auto bg-primary/20 rounded-full flex items-center justify-center">
                    <Users className="w-8 h-8 text-primary" />
                  </div>
                  <h4 className="text-xl font-bold text-white">Community First</h4>
                  <p className="text-white/70">
                    Join thousands of satisfied buyers and sellers in our ecosystem
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}