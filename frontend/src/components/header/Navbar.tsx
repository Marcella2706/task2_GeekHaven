"use client";

import { ShoppingCart, User, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  return (
    <header className="flex items-center justify-between px-6 py-4 shadow-md bg-white sticky top-0 z-50">
      <h1 className="text-2xl font-bold text-primary">ReSellHub</h1>

      <div className="flex items-center gap-4">
        <div className="relative hidden sm:block">
          <Search className="absolute left-2 top-2.5 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search products..."
            className="pl-8 pr-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <Button variant="outline" size="icon">
          <User className="h-5 w-5" />
        </Button>

        <Button variant="outline" size="icon">
          <ShoppingCart className="h-5 w-5" />
        </Button>
      </div>
    </header>
  );
}
