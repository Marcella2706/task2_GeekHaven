"use client";

import { useCart } from "@/context/CartContext";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useRouter } from "next/navigation"; 

export default function CartPage() {
  const { cart, removeFromCart } = useCart();
  const router = useRouter(); 

  const total = cart.reduce((sum, item) => sum + item.price, 0);

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold mb-4">🛒 Your Cart</h1>

      {cart.length === 0 ? (
        <p className="text-gray-500 text-center text-lg">
          Your cart is empty. Add some products!
        </p>
      ) : (
        <>
          <div className="space-y-4">
            {cart.map((item, index) => (
              <Card
                key={`${item.id}-${index}`}
                className="flex items-center gap-4 p-4"
              >
                <Image
                  src={item.image}
                  alt={item.name}
                  width={90}
                  height={90}
                  className="rounded-md object-cover"
                />
                <CardContent className="flex-1 flex items-center justify-between">
                  <div>
                    <h2 className="font-semibold text-lg">{item.name}</h2>
                    <p className="text-sm text-gray-500">₹{item.price}</p>
                  </div>
                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      onClick={() => router.push(`/products/${item.id}`)} 
                      className="w-full"
                    >
                      View Details
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => removeFromCart(item.id)}
                    >
                      Remove
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="flex justify-between items-center border-t pt-4">
            <p className="font-semibold text-xl">Total:</p>
            <p className="text-xl font-bold">₹{total}</p>
          </div>

          <Button className="w-full text-lg py-6" onClick={()=>{router.push(`/checkout`)}}>Proceed to Checkout</Button>
        </>
      )}
    </div>
  );
}
