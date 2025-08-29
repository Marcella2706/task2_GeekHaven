"use client";

import { ShoppingCart, User, Heart, Activity, Info, UserPlus, LogIn, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useActionLogger } from "@/utils/seed";

export default function Navbar() {
  const { cart } = useCart();
  const { wishlist } = useWishlist();
  const router = useRouter();
  const { logAction } = useActionLogger();
  
  const [mounted, setMounted] = useState(false);
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    setMounted(true);
    const storedTheme = localStorage.getItem('theme') || 'dark';
    setTheme(storedTheme);
    document.documentElement.classList.toggle('dark', storedTheme === 'dark');
  }, []);

  const handleNavClick = (path: string, label: string) => {
    logAction('navigate', `Mapsd to ${label}`, { path });
    router.push(path);
  };

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
    logAction('click', `Toggled theme to ${newTheme}`);
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
            🌲 ReSellHub
          </h1>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          <Link 
            href="/products" 
            className="text-white/80 hover:text-white transition-colors relative group font-medium"
            onClick={() => logAction('navigate', 'Navigated to Products page')}
          >
            Products
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full"></span>
          </Link>

          <Link 
            href="/about" 
            className="flex items-center gap-1 text-white/80 hover:text-white transition-colors relative group font-medium"
            onClick={() => logAction('navigate', 'Navigated to About page')}
          >
            <Info className="h-4 w-4" />
            About
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full"></span>
          </Link>

          <Link 
            href="/logs/recent" 
            className="flex items-center gap-1 text-white/80 hover:text-white transition-colors relative group font-medium"
            onClick={() => logAction('navigate', 'Navigated to Recent Logs page')}
          >
            <Activity className="h-4 w-4" />
            Logs
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full"></span>
          </Link>
        </nav>

        <div className="flex items-center gap-4">
           <Button 
            variant="outline" 
            size="icon"
            className="border-primary/50 text-white hover:bg-primary/10 hover:border-primary glow"
            onClick={toggleTheme}
          >
            {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>

          <Button 
            variant="outline" 
            size="icon"
            className="border-primary/50 text-white hover:bg-primary/10 hover:border-primary glow"
            onClick={() => handleNavClick('/profile', 'Profile')}
          >
            <User className="h-5 w-5" />
          </Button>

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
            {wishlist.length > 0 && (
              <Badge className="absolute -top-2 -right-2 bg-red-600 text-white text-xs px-1 min-w-[1.25rem] h-5 flex items-center justify-center pulse-wood">
                {wishlist.length}
              </Badge>
            )}
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
                <Badge className="absolute -top-2 -right-2 bg-primary text-white text-xs px-1 min-w-[1.25rem] h-5 flex items-center justify-center pulse-wood">
                  {cart.length}
                </Badge>
              )}
            </Button>
          </Link>
        </div>
      </div>

      <div className="md:hidden px-6 pb-4">        
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