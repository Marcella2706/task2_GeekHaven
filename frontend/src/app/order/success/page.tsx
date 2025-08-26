"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type LastOrder = {
  orderId: string;
  total: number;
  subtotal: number;
  shipping: number;
  paymentMethod: string;
  placedAt: string;
  items: { id: number; name: string; price: number; image: string }[];
  shippingTo: Record<string, string>;
};

const INR = (n: number) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);

export default function OrderSuccessPage() {
  const [order, setOrder] = useState<LastOrder | null>(null);

  useEffect(() => {
    const raw = sessionStorage.getItem("lastOrder");
    if (raw) setOrder(JSON.parse(raw));
  }, []);

  if (!order) {
    return (
      <div className="max-w-2xl mx-auto p-6 text-center">
        <h1 className="text-2xl font-bold mb-2">Order placed</h1>
        <p className="text-gray-600 mb-6">We couldn’t load the order summary, but you’re all set.</p>
        <Button asChild><Link href="/products">Continue Shopping</Link></Button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <Card>
        <CardContent className="p-6 space-y-3">
          <h1 className="text-2xl font-bold">🎉 Thank you! Your order is confirmed.</h1>
          <p className="text-gray-600">Order ID: <span className="font-mono">{order.orderId}</span></p>
          <p className="text-gray-600">Placed at: {new Date(order.placedAt).toLocaleString()}</p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6 space-y-2">
          <h2 className="text-xl font-semibold mb-2">Summary</h2>
          <div className="flex justify-between">
            <span>Subtotal</span><span>{INR(order.subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span>Shipping</span><span>{order.shipping ? INR(order.shipping) : "Free"}</span>
          </div>
          <div className="flex justify-between font-semibold text-base">
            <span>Total</span><span>{INR(order.total)}</span>
          </div>
          <p className="text-sm text-gray-500 mt-2">Payment: {order.paymentMethod.toUpperCase()}</p>
        </CardContent>
      </Card>

      <div className="flex gap-3">
        <Button asChild><Link href="/products">Continue Shopping</Link></Button>
        <Button variant="outline" asChild><Link href="/cart">View Cart</Link></Button>
      </div>
    </div>
  );
}
