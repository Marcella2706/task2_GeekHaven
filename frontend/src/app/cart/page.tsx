"use client";

import { useCart } from "@/context/CartContext";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation"; 
import { useActionLogger } from "@/utils/seed";
import { calculatePlatformFee, generateProductIdWithChecksum } from "@/utils/seed";
import { ShoppingCart, Trash2, Eye, ShoppingBag, CreditCard, Info } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect } from "react";

export default function CartPage() {
  const { cart, removeFromCart } = useCart();
  const router = useRouter();
  const { logAction } = useActionLogger();

  useEffect(() => {
    logAction('navigate', 'Visited Cart page', { itemCount: cart.length });
  }, [logAction, cart.length]);

  const subtotal = cart.reduce((sum, item) => sum + item.price, 0);
  const platformFee = calculatePlatformFee(subtotal);
  const shipping = subtotal > 5000 || subtotal === 0 ? 0 : 99;
  const total = subtotal + platformFee + shipping;

  const handleRemoveItem = (item: any) => {
    logAction('cart', `Removed ${item.name} from cart`, { productId: item.id, price: item.price });
    removeFromCart(item.id);
  };

  const handleViewDetails = (item: any) => {
    logAction('view', `Viewed product details for ${item.name} from cart`, { productId: item.id });
    router.push(`/products/${item.id}`);
  };

  const handleCheckout = () => {
    logAction('click', 'Proceeded to checkout', { 
      itemCount: cart.length, 
      subtotal, 
      platformFee, 
      shipping, 
      total 
    });
    router.push(`/checkout`);
  };

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
            <ShoppingCart className="w-10 h-10" />
            Your Shopping Cart
          </motion.h1>
          {cart.length > 0 && (
            <Badge className="bg-primary/20 text-primary border-primary/30 text-lg px-4 py-2">
              {cart.length} {cart.length === 1 ? 'Item' : 'Items'}
            </Badge>
          )}
        </div>

        {cart.length === 0 ? (
          <motion.div 
            className="text-center py-16 space-y-6"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            <Card className="card-gradient glow max-w-md mx-auto">
              <CardContent className="p-12 space-y-6">
                <div className="text-6xl">🛒</div>
                <h3 className="text-2xl font-bold text-white">Your cart is empty</h3>
                <p className="text-white/80">
                  Discover amazing products and add them to your cart!
                </p>
                <Button 
                  onClick={() => {
                    logAction('click', 'Clicked Start Shopping from empty cart');
                    router.push('/products');
                  }}
                  className="btn-gradient text-lg px-8 py-3 glow"
                >
                  <ShoppingBag className="w-5 h-5 mr-2" />
                  Start Shopping
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              <Card className="card-gradient glow">
                <CardHeader>
                  <CardTitle className="text-2xl gradient-text">Cart Items</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {cart.map((item, index) => (
                    <motion.div
                      key={`${item.id}-${index}`}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                    >
                      <Card className="glass-dark border border-primary/20 hover:border-primary/40 transition-all">
                        <CardContent className="p-4">
                          <div className="flex items-center gap-4">
                            <div className="relative">
                              <Image
                                src={item.image}
                                alt={item.name}
                                width={100}
                                height={100}
                                className="rounded-lg object-cover"
                              />
                              <Badge className="absolute -top-2 -right-2 bg-primary/20 text-primary border-primary/30 text-xs">
                                {generateProductIdWithChecksum(item.id)}
                              </Badge>
                            </div>
                            
                            <div className="flex-1 space-y-2">
                              <h3 className="font-bold text-xl text-white">{item.name}</h3>
                              <div className="flex items-center gap-4">
                                <p className="text-2xl font-bold gradient-text">₹{item.price.toLocaleString()}</p>
                                <Badge variant="outline" className="text-green-400 border-green-400/50">
                                  Verified
                                </Badge>
                              </div>
                              <div className="text-sm text-white/60">
                                Platform fee: ₹{calculatePlatformFee(item.price)}
                              </div>
                            </div>

                            <div className="flex flex-col gap-2">
                              <Button
                                onClick={() => handleViewDetails(item)}
                                className="btn-gradient"
                                size="sm"
                              >
                                <Eye className="w-4 h-4 mr-2" />
                                View Details
                              </Button>
                              <Button
                                onClick={() => handleRemoveItem(item)}
                                variant="destructive"
                                size="sm"
                              >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Remove
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </CardContent>
              </Card>
            </div>

            <div className="space-y-4">
              <Card className="card-gradient glow sticky top-24">
                <CardHeader>
                  <CardTitle className="text-2xl gradient-text flex items-center gap-2">
                    <CreditCard className="w-6 h-6" />
                    Order Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center pb-2 border-b border-white/10">
                      <span className="text-white/80">Subtotal ({cart.length} items)</span>
                      <span className="font-semibold text-white">₹{subtotal.toLocaleString()}</span>
                    </div>
                    
                    <div className="flex justify-between items-center pb-2 border-b border-white/10">
                      <span className="text-white/80 flex items-center gap-1">
                        Platform Fee
                        <div className="group relative">
                          <Info className="w-4 h-4 text-white/60 cursor-help" />
                          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block">
                            <div className="bg-black/80 text-white text-xs p-2 rounded whitespace-nowrap">
                              Calculated based on seed: {((calculatePlatformFee(100) / 100) * 100).toFixed(1)}%
                            </div>
                          </div>
                        </div>
                      </span>
                      <span className="font-semibold text-primary">₹{platformFee.toLocaleString()}</span>
                    </div>
                    
                    <div className="flex justify-between items-center pb-2 border-b border-white/10">
                      <span className="text-white/80">Shipping</span>
                      <span className="font-semibold text-white">
                        {shipping === 0 ? (
                          <Badge className="bg-green-500/20 text-green-400">Free</Badge>
                        ) : (
                          `₹${shipping}`
                        )}
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center pt-2">
                      <span className="text-xl font-bold text-white">Total</span>
                      <span className="text-2xl font-bold gradient-text">₹{total.toLocaleString()}</span>
                    </div>
                  </div>

                  <Button 
                    onClick={handleCheckout}
                    className="btn-gradient w-full text-lg py-4 glow"
                    size="lg"
                  >
                    <CreditCard className="w-5 h-5 mr-2" />
                    Proceed to Checkout
                  </Button>

                  <div className="text-center text-sm text-white/60 space-y-1">
                    <p>Secure payment processing</p>
                    <p>SSL encrypted transactions</p>
                    <p>{shipping === 0 ? 'Free delivery on orders over ₹5000' : 'Standard shipping available'}</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="card-gradient glow">
                <CardContent className="p-6 text-center space-y-4">
                  <h3 className="font-bold text-white">Continue Shopping?</h3>
                  <Button
                    onClick={() => {
                      logAction('click', 'Clicked Continue Shopping from cart');
                      router.push('/products');
                    }}
                    variant="outline"
                    className="w-full border-primary/50 text-white hover:bg-primary/10"
                  >
                    <ShoppingBag className="w-4 h-4 mr-2" />
                    Browse More Products
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}