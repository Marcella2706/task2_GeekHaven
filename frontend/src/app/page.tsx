"use client"

import { products } from "./lib/mockData";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";

export default function LandingPage() {
  const router = useRouter();
  const { cart, toggleCartItem } = useCart();

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-100">
      <section className="text-center py-16 px-6">
        <motion.h2
          className="text-4xl font-bold mb-4"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Buy & Sell with Ease
        </motion.h2>
        <p className="text-gray-600 max-w-xl mx-auto mb-6">
          Discover unique products, resell your treasures, and find the best deals in our dynamic marketplace.
        </p>
        <Button onClick={() => router.push("/products")} size="lg">
          Start Exploring
        </Button>
      </section>

      <section className="px-6 py-10">
        <h3 className="text-2xl font-semibold mb-6">Latest Listings</h3>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => {
            const inCart = cart.some((item) => item.id === product.id);

            return (
              <motion.div
                key={product.id}
                whileHover={{ scale: 1.05 }}
                className="cursor-pointer"
              >
                <Card className="overflow-hidden shadow hover:shadow-lg transition">
                  <Image
                    src={product.image}
                    alt={product.name}
                    width={200}
                    height={100}
                    className="w-full h-40 object-cover rounded-lg"
                  />
                  <CardContent className="p-4">
                    <h4 className="font-semibold">{product.name}</h4>
                    <p className="text-gray-500">₹{product.price}</p>

                    <motion.div
                      initial={{ scale: 0.9 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 200 }}
                    >
                      <Button
                        onClick={() => toggleCartItem(product)} 
                        className={`mt-3 w-full ${
                          inCart ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"
                        }`}
                      >
                        {inCart ? "Remove from Cart" : "Add to Cart"}
                      </Button>

                    </motion.div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
