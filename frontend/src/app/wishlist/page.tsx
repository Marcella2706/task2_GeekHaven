"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useActionLogger } from "@/utils/seed";
import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";
import { Heart, ShoppingCart, Eye, Plus } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { generateProductIdWithChecksum, calculatePlatformFee } from "@/utils/seed";

export default function WishlistPage() {
  const { logAction } = useActionLogger();
  const router = useRouter();
  const { wishlist, removeFromWishlist } = useWishlist();
  const { toggleCartItem, cart } = useCart();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    logAction("navigate", "Visited Wishlist page", { itemCount: wishlist.length });
  }, [logAction, wishlist.length]);

  const handleRemoveFromWishlist = (productId: number) => {
    const product = wishlist.find((p) => p.id === productId);
    if (product) {
      logAction("like", `Removed ${product.name} from wishlist`, { productId });
      removeFromWishlist(productId);
    }
  };

  const handleViewProduct = (productId: number) => {
    const product = wishlist.find((p) => p.id === productId);
    if (product) {
      logAction("view", `Viewed ${product.name} from wishlist`, { productId });
      router.push(`/products/${productId}`);
    }
  };

  const handleAddToCart = (product: any) => {
    logAction("cart", `Added ${product.name} to cart from wishlist`, { productId: product.id });
    toggleCartItem(product);
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
        <div className="text-center space-y-4">
          <motion.h1
            className="text-4xl font-bold gradient-text flex items-center justify-center gap-3"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Heart className="w-10 h-10" />
            🌲 Your Wishlist
          </motion.h1>
          {wishlist.length > 0 && (
            <Badge className="bg-red-600/20 text-red-400 border-red-400/30 text-lg px-4 py-2 pulse-wood">
              {wishlist.length} Saved {wishlist.length === 1 ? "Item" : "Items"}
            </Badge>
          )}
        </div>

        {wishlist.length === 0 ? (
          <motion.div
            className="text-center py-16 space-y-6"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            <Card className="card-gradient glow max-w-md mx-auto wood-texture">
              <CardContent className="p-12 space-y-6">
                <div className="text-6xl">💝</div>
                <h3 className="text-2xl font-bold text-white">Your wishlist is empty</h3>
                <p className="text-white/80">
                  Save your favorite products to buy them later! Click the heart icon on any product to add it here.
                </p>
                <Button
                  onClick={() => {
                    logAction("click", "Clicked Discover Products from empty wishlist");
                    router.push("/products");
                  }}
                  className="btn-gradient text-lg px-8 py-3 glow"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Discover Products
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {wishlist.map((product, index) => {
              const inCart = cart.some((item) => item.id === product.id);
              
              return (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <Card className="card-gradient glow overflow-hidden h-full group wood-texture">
                    <div className="relative overflow-hidden">
                      <Image
                        src={product.image}
                        alt={product.name}
                        width={300}
                        height={200}
                        className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110 cursor-pointer"
                        onClick={() => handleViewProduct(product.id)}
                      />
                      <div className="absolute top-3 right-3">
                        <Button
                          size="sm"
                          className="p-2 bg-red-600/90 hover:bg-red-700/90 text-white border-none"
                          onClick={() => handleRemoveFromWishlist(product.id)}
                        >
                          <Heart className="w-4 h-4 fill-current" />
                        </Button>
                      </div>
                      <div className="absolute top-3 left-3">
                        <Badge className="bg-primary/20 text-primary border-primary/30">
                          {generateProductIdWithChecksum(product.id)}
                        </Badge>
                      </div>
                    </div>

                    <CardContent className="p-6 space-y-4">
                      <div
                        className="cursor-pointer"
                        onClick={() => handleViewProduct(product.id)}
                      >
                        <h3 className="font-bold text-xl text-white group-hover:text-primary transition-colors">
                          {product.name}
                        </h3>
                        <div className="flex items-center justify-between mt-2">
                          <p className="text-2xl font-bold gradient-text">
                            ₹{product.price.toLocaleString()}
                          </p>
                          <Badge
                            className="text-green-400 border-green-400/50 bg-green-500/20"
                          >
                            ✅ Available
                          </Badge>
                        </div>
                        <div className="text-sm text-white/60 mt-1">
                          Platform fee: ₹{calculatePlatformFee(product.price)}
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleAddToCart(product)}
                          className={`flex-1 ${
                            inCart 
                              ? "bg-green-600 hover:bg-green-700 text-white" 
                              : "btn-gradient"
                          }`}
                          size="sm"
                        >
                          <ShoppingCart className="w-4 h-4 mr-2" />
                          {inCart ? "✓ In Cart" : "Add to Cart"}
                        </Button>
                        <Button
                          onClick={() => handleViewProduct(product.id)}
                          variant="outline"
                          className="border-primary/50 text-white hover:bg-primary/10"
                          size="sm"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                      </div>

                      <div className="text-xs text-center text-white/60">
                        Added to wishlist • Click heart to remove
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        )}

        {wishlist.length > 0 && (
          <div className="text-center">
            <Card className="card-gradient glow inline-block">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-white mb-2">Ready to shop?</h3>
                <p className="text-white/70 mb-4">Continue exploring more amazing products</p>
                <Button
                  onClick={() => {
                    logAction("click", "Clicked Continue Shopping from wishlist");
                    router.push("/products");
                  }}
                  className="btn-gradient"
                >
                  Continue Shopping
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}