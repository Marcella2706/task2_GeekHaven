"use client";

import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { products } from "../lib/mockData";

export default function ProductsPage() {
  const router = useRouter();

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-8">Explore Products</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {products.map((product) => (
          <Card key={product.id} className="shadow-md">
            <CardHeader>
              <CardTitle>{product.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-40 object-cover rounded-md mb-4"
              />
              <p className="text-lg font-semibold mb-2">₹{product.price}</p>
              <Button
                onClick={() => router.push(`/products/${product.id}`)}
                className="w-full"
              >
                View Details
              </Button>
              
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
