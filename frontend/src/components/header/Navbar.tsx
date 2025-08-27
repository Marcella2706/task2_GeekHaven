"use client";

import { ShoppingCart, User, Search, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Navbar() {
  const { cart } = useCart();
  const router = useRouter();

  const [keyword, setKeyword] = useState("");
  const [category, setCategory] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    const query = new URLSearchParams();

    if (keyword) query.set("q", keyword);
    if (category) query.set("category", category);
    if (minPrice) query.set("min", minPrice);
    if (maxPrice) query.set("max", maxPrice);

    router.push(`/products?${query.toString()}`);
  };

  return (
    <header className="flex items-center justify-between px-6 py-4 shadow-md bg-white sticky top-0 z-50">
      <Link href="/">
        <h1 className="text-2xl font-bold text-primary">ReSellHub</h1>
      </Link>

      <form
        onSubmit={handleSearch}
        className="flex items-center gap-3 max-w-xl w-full"
      >
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 text-gray-400 w-4 h-4" />
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="Search products..."
            className="w-full pl-8 pr-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border rounded-lg px-2 py-2 focus:ring-2 focus:ring-primary"
        >
          <option value="">All Categories</option>
          <option value="electronics">Electronics</option>
          <option value="fashion">Fashion</option>
          <option value="home">Home</option>
          <option value="books">Books</option>
        </select>

        <input
          type="number"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
          placeholder="Min"
          className="w-20 border rounded-lg px-2 py-2 focus:ring-2 focus:ring-primary"
        />
        <input
          type="number"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          placeholder="Max"
          className="w-20 border rounded-lg px-2 py-2 focus:ring-2 focus:ring-primary"
        />

        <Button type="submit" variant="default">
          Search
        </Button>
      </form>

      <div className="flex items-center gap-6">
        <Button variant="outline" size="icon">
          <User className="h-5 w-5" />
        </Button>
        <Link href="/products" className="text-gray-700 hover:text-black">
          Products
        </Link>
        <Link href="/auth/signup" className="text-gray-700 hover:text-black">
          Signup
        </Link>
        <Link href="/auth/signin" className="text-gray-700 hover:text-black">
          Signin
        </Link>
        <Link href="/wishlist" className="text-gray-700 hover:text-black">
          <Heart className="h-6 w-6" />
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
    </header>
  );
}
