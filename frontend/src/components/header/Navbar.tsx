"use client";

import { ShoppingCart, User, Search, Heart, Activity, Info, UserPlus, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useActionLogger } from "@/utils/seed";

export default function Navbar() {
  const { cart } = useCart();
  const router = useRouter();
  const { logAction } = useActionLogger();
  
  const [keyword, setKeyword] = useState("");
  const [category, setCategory] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    const query = new URLSearchParams();

    if (keyword) query.set("q", keyword);
    if (category) query.set("category", category);
    if (minPrice) query.set("min", minPrice);
    if (maxPrice) query.set("max", maxPrice);

    const searchParams = query.toString();
    logAction('search', `Searched: "${keyword || 'all'}" in ${category || 'all categories'}`, {
      keyword,
      category,
      minPrice,
      maxPrice,
      query: searchParams
    });

    router.push(`/products${searchParams ? '?' + searchParams : ''}`);
    
    setKeyword("");
    setCategory("");
    setMinPrice("");
    setMaxPrice("");
  };

  const handleNavClick = (path: string, label: string) => {
    logAction('navigate', `Navigated to ${label}`, { path });
    router.push(path);
  };

  if (!mounted) {
    return null;
  }

  return (
    <header className="navbar-glass sticky top-0 z-50 border-b border-primary/20">
      <div className="flex items-center justify-between px-6 py-4">
        <Link 
          href="/"
          onClick={() => logAction('navigate', 'Clicked logo to go home')}
        >
          <h1 className="text-3xl font-bold gradient-text hover:scale-105 transition-transform cursor-pointer">
            ReSellHub
          </h1>
        </Link>

        <form
          onSubmit={handleSearch}
          className="hidden md:flex items-center gap-3 max-w-2xl w-full mx-8"
        >
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 w-4 h-4" />
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="Search products, brands, categories..."
              className="input-gradient w-full pl-10 pr-4 py-3 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
            />
          </div>

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="input-gradient px-3 py-3 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary/50 bg-white/5"
          >
            <option value="" className="bg-gray-900">All Categories</option>
            <option value="electronics" className="bg-gray-900">Electronics</option>
            <option value="fashion" className="bg-gray-900">Fashion</option>
            <option value="home" className="bg-gray-900">Home</option>
            <option value="books" className="bg-gray-900">Books</option>
            <option value="sports" className="bg-gray-900">Sports</option>
          </select>

          <input
            type="number"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            placeholder="Min ₹"
            className="input-gradient w-20 px-3 py-3 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
          
          <input
            type="number"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            placeholder="Max ₹"
            className="input-gradient w-20 px-3 py-3 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-primary/50"
          />

          <Button type="submit" className="btn-gradient glow px-6">
            Search
          </Button>
        </form>

        <div className="md:hidden">
          <Button
            variant="outline"
            size="sm"
            className="border-primary/50 text-white hover:bg-primary/10"
            onClick={() => {
              logAction('click', 'Opened mobile search');
            }}
          >
            <Search className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            size="icon"
            className="border-primary/50 text-white hover:bg-primary/10 hover:border-primary glow"
            onClick={() => handleNavClick('/profile', 'Profile')}
          >
            <User className="h-5 w-5" />
          </Button>

          <Link 
            href="/products" 
            className="hidden sm:block text-white/80 hover:text-white transition-colors relative group"
            onClick={() => logAction('navigate', 'Navigated to Products page')}
          >
            Products
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full"></span>
          </Link>

          <Link 
            href="/about" 
            className="hidden sm:flex items-center gap-1 text-white/80 hover:text-white transition-colors relative group"
            onClick={() => logAction('navigate', 'Navigated to About page')}
          >
            <Info className="h-4 w-4" />
            About
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full"></span>
          </Link>

          <Link 
            href="/logs/recent" 
            className="hidden sm:flex items-center gap-1 text-white/80 hover:text-white transition-colors relative group"
            onClick={() => logAction('navigate', 'Navigated to Recent Logs page')}
          >
            <Activity className="h-4 w-4" />
            Logs
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full"></span>
          </Link>

          <div className="hidden sm:flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="border-primary/50 text-white hover:bg-primary/10 hover:border-primary"
              onClick={() => handleNavClick('/auth/signup', 'Sign Up')}
            >
              <UserPlus className="h-4 w-4 mr-1" />
              Sign Up
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="border-primary/50 text-white hover:bg-primary/10 hover:border-primary"
              onClick={() => handleNavClick('/auth/signin', 'Sign In')}
            >
              <LogIn className="h-4 w-4 mr-1" />
              Sign In
            </Button>
          </div>

          <Button
            variant="outline"
            size="icon"
            className="border-primary/50 text-white hover:bg-primary/10 hover:border-primary glow relative"
            onClick={() => handleNavClick('/wishlist', 'Wishlist')}
          >
            <Heart className="h-5 w-5" />
            <Badge className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-1 min-w-[1.25rem] h-5 flex items-center justify-center">
              0
            </Badge>
          </Button>

          <Link href="/cart" className="relative">
            <Button
              variant="outline"
              size="icon"
              className="border-primary/50 text-white hover:bg-primary/10 hover:border-primary glow relative"
              onClick={() => logAction('navigate', 'Navigated to Cart', { cartItems: cart.length })}
            >
              <ShoppingCart className="h-5 w-5" />
              {cart.length > 0 && (
                <Badge className="absolute -top-2 -right-2 bg-primary text-white text-xs px-1 min-w-[1.25rem] h-5 flex items-center justify-center pulse-pink">
                  {cart.length}
                </Badge>
              )}
            </Button>
          </Link>
        </div>
      </div>

      <div className="md:hidden px-6 pb-4">
        <form onSubmit={handleSearch} className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 w-4 h-4" />
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="Search products..."
              className="input-gradient w-full pl-10 pr-4 py-2 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
          <Button type="submit" size="sm" className="btn-gradient">
            Search
          </Button>
        </form>
        
        <div className="flex justify-center gap-4 mt-3 text-sm">
          <Link href="/products" className="text-white/80 hover:text-white">Products</Link>
          <Link href="/about" className="text-white/80 hover:text-white">About</Link>
          <Link href="/logs/recent" className="text-white/80 hover:text-white">Logs</Link>
          <Link href="/auth/signin" className="text-white/80 hover:text-white">Sign In</Link>
        </div>
      </div>
    </header>
  );
}