"use client";

import { ShoppingCart, User, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useCart } from "@/context/CartContext";

export default function Navbar() {
  const { cart } = useCart();

  return (
    <header className="flex items-center justify-between px-6 py-4 shadow-md bg-white sticky top-0 z-50">
      <Link href="/" className="text-2xl font-bold text-primary">
        ReSellHub
      </Link>

      <div className="flex items-center gap-4">
        <div className="relative hidden sm:block">
          <Search className="absolute left-2 top-2.5 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search products..."
            className="pl-8 pr-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div className="flex items-center gap-2">
          <Link href="/auth/signin">
            <Button variant="outline" className="flex items-center gap-1">
              <User className="h-4 w-4" /> Sign In
            </Button>
          </Link>
          <Link href="/auth/signup">
            <Button className="bg-primary text-white hover:bg-primary/90">
              Sign Up
            </Button>
          </Link>
        </div>

        <div className="flex items-center gap-6 ml-4">
          <Link href="/products" className="text-gray-700 hover:text-black">
            Products
          </Link>

          <Link href="/cart" className="relative">
            <ShoppingCart className="h-6 w-6" />
            {cart.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                {cart.length}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
}
