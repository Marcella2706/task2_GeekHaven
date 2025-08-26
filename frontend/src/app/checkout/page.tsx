"use client";

import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"; 
import { Label } from "@/components/ui/label"; 

type ShippingForm = {
  fullName: string;
  email: string;
  phone: string;
  address1: string;
  address2: string;
  city: string;
  state: string;
  pincode: string;
};

const INR = (n: number) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);

export default function CheckoutPage() {
  const { cart, removeFromCart } = useCart();
  const router = useRouter();

  const [paymentMethod, setPaymentMethod] = useState<"upi" | "card" | "cod">("upi");
  const [form, setForm] = useState<ShippingForm>({
    fullName: "",
    email: "",
    phone: "",
    address1: "",
    address2: "",
    city: "",
    state: "",
    pincode: "",
  });

  const subtotal = useMemo(() => cart.reduce((s, p) => s + p.price, 0), [cart]);
  const shipping = subtotal > 5000 || subtotal === 0 ? 0 : 99;
  const total = subtotal + shipping;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const placeOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cart.length) return;

    // light validation
    const requiredFields: (keyof ShippingForm)[] = [
      "fullName",
      "email",
      "phone",
      "address1",
      "city",
      "state",
      "pincode",
    ];
    const missing = requiredFields.filter((k) => !form[k]?.trim());
    if (missing.length) {
      alert("Please fill all required fields.");
      return;
    }

    const orderId = `ORD-${Date.now().toString().slice(-7)}`;
    const orderSummary = {
      orderId,
      items: cart,
      subtotal,
      shipping,
      total,
      paymentMethod,
      shippingTo: form,
      placedAt: new Date().toISOString(),
    };

    sessionStorage.setItem("lastOrder", JSON.stringify(orderSummary));

    cart.forEach((item) => removeFromCart(item.id));

    router.push("/order/success");
  };

  return (
    <div className="max-w-6xl mx-auto p-6 grid lg:grid-cols-5 gap-8">
      <form onSubmit={placeOrder} className="lg:col-span-3 space-y-6">
        <h1 className="text-3xl font-bold">Checkout</h1>

        <Card>
          <CardContent className="p-6 space-y-4">
            <h2 className="text-xl font-semibold">Shipping Details</h2>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="fullName">Full Name *</Label>
                <Input id="fullName" name="fullName" value={form.fullName} onChange={handleChange} required />
              </div>
              <div>
                <Label htmlFor="phone">Phone *</Label>
                <Input id="phone" name="phone" value={form.phone} onChange={handleChange} required />
              </div>
              <div>
                <Label htmlFor="email">Email *</Label>
                <Input id="email" name="email" type="email" value={form.email} onChange={handleChange} required />
              </div>
            </div>

            <div className="grid gap-4">
              <div>
                <Label htmlFor="address1">Address Line 1 *</Label>
                <Input id="address1" name="address1" value={form.address1} onChange={handleChange} required />
              </div>
              <div>
                <Label htmlFor="address2">Address Line 2</Label>
                <Input id="address2" name="address2" value={form.address2} onChange={handleChange} />
              </div>

              <div className="grid sm:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="city">City *</Label>
                  <Input id="city" name="city" value={form.city} onChange={handleChange} required />
                </div>
                <div>
                  <Label htmlFor="state">State *</Label>
                  <Input id="state" name="state" value={form.state} onChange={handleChange} required />
                </div>
                <div>
                  <Label htmlFor="pincode">Pincode *</Label>
                  <Input id="pincode" name="pincode" value={form.pincode} onChange={handleChange} required />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 space-y-4">
            <h2 className="text-xl font-semibold">Payment Method</h2>
            <div className="grid gap-3">
              <label className="flex items-center gap-3 border rounded-lg p-3 cursor-pointer">
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === "upi"}
                  onChange={() => setPaymentMethod("upi")}
                />
                <span>UPI (GPay/PhonePe/Paytm)</span>
              </label>
              <label className="flex items-center gap-3 border rounded-lg p-3 cursor-pointer opacity-60">
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === "card"}
                  onChange={() => setPaymentMethod("card")}
                />
                <span>Credit/Debit Card (mock)</span>
              </label>
              <label className="flex items-center gap-3 border rounded-lg p-3 cursor-pointer">
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === "cod"}
                  onChange={() => setPaymentMethod("cod")}
                />
                <span>Cash on Delivery</span>
              </label>
            </div>

            <Button
              type="submit"
              className="w-full mt-2"
              disabled={!cart.length}
            >
              Place Order
            </Button>
            {!cart.length && (
              <p className="text-sm text-gray-500 mt-1">Your cart is empty.</p>
            )}
          </CardContent>
        </Card>
      </form>

      <aside className="lg:col-span-2 space-y-4">
        <Card>
          <CardContent className="p-6 space-y-4">
            <h2 className="text-xl font-semibold">Order Summary</h2>

            <div className="space-y-3 max-h-[340px] overflow-auto pr-2">
              {cart.length === 0 ? (
                <p className="text-gray-500">No items in cart.</p>
              ) : (
                cart.map((item, idx) => (
                  <div
                    key={`${item.id}-${idx}`}
                    className="flex items-center justify-between gap-3 border rounded-lg p-2"
                  >
                    <div className="flex items-center gap-3">
                      <Image
                        src={item.image}
                        alt={item.name}
                        width={60}
                        height={60}
                        className="rounded-md object-cover"
                      />
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-gray-500">{INR(item.price)}</p>
                      </div>
                    </div>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => removeFromCart(item.id)}
                    >
                      Remove
                    </Button>
                  </div>
                ))
              )}
            </div>

            <div className="border-t pt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{INR(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>{shipping === 0 ? "Free" : INR(shipping)}</span>
              </div>
              <div className="flex justify-between font-semibold text-base">
                <span>Total</span>
                <span>{INR(total)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </aside>
    </div>
  );
}
