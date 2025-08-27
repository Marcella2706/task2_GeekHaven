"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useActionLogger } from "@/utils/seed";
import { Heart, ShoppingCart, Eye, Plus } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { generateProductIdWithChecksum, calculatePlatformFee } from "@/utils/seed";

export default function WishlistPage() {
  const { logAction } = useActionLogger();
  const router = useRouter();
  const [wishlist, setWishlist] = useState<any[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    logAction("navigate", "Visited Wishlist page");

    const storedWishlist = localStorage.getItem("wishlist");
    if (storedWishlist) {
      setWishlist(JSON.parse(storedWishlist));
    }
  }, [logAction]);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem("wishlist", JSON.stringify(wishlist));
    }
  }, [wishlist, mounted]);

  const removeFromWishlist = (productId: number) => {
    const product = wishlist.find((p) => p.id === productId);
    if (product) {
      logAction("like", `Removed ${product.name} from wishlist`, { productId });
      setWishlist((prev) => prev.filter((p) => p.id !== productId));
    }
  };

  const viewProduct = (productId: number) => {
    const product = wishlist.find((p) => p.id === productId);
    if (product) {
      logAction("view", `Viewed ${product.name} from wishlist`, { productId });
      router.push(`/products/${productId}`);
    }
  };

  const addToCart = (productId: number) => {
    const product = wishlist.find((p) => p.id === productId);
    if (product) {
      logAction("cart", `Added ${product.name} to cart from wishlist`, { productId });
    }
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
            Your Wishlist
          </motion.h1>
          {wishlist.length > 0 && (
            <Badge className="bg-red-500/20 text-red-400 border-red-400/30 text-lg px-4 py-2">
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
            <Card className="card-gradient glow max-w-md mx-auto">
              <CardContent className="p-12 space-y-6">
                <div className="text-6xl">💝</div>
                <h3 className="text-2xl font-bold text-white">Your wishlist is empty</h3>
                <p className="text-white/80">
                  Save your favorite products to buy them later!
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
            {wishlist.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
              >
                <Card className="card-gradient glow overflow-hidden h-full group">
                  <div className="relative overflow-hidden">
                    <Image
                      src={product.image}
                      alt={product.name}
                      width={300}
                      height={200}
                      className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110 cursor-pointer"
                      onClick={() => viewProduct(product.id)}
                    />
                    <div className="absolute top-3 right-3">
                      <Button
                        size="sm"
                        variant="destructive"
                        className="p-2 bg-red-500/80 hover:bg-red-600/80"
                        onClick={() => removeFromWishlist(product.id)}
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
                      onClick={() => viewProduct(product.id)}
                    >
                      <h3 className="font-bold text-xl text-white group-hover:text-primary transition-colors">
                        {product.name}
                      </h3>
                      <div className="flex items-center justify-between mt-2">
                        <p className="text-2xl font-bold gradient-text">
                          ₹{product.price.toLocaleString()}
                        </p>
                        <Badge
                          variant="outline"
                          className="text-green-400 border-green-400/50"
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
                        onClick={() => addToCart(product.id)}
                        className="btn-gradient flex-1"
                        size="sm"
                      >
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        Add to Cart
                      </Button>
                      <Button
                        onClick={() => viewProduct(product.id)}
                        variant="outline"
                        className="border-primary/50 text-white hover:bg-primary/10"
                        size="sm"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
