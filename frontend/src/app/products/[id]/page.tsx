"use client";

import { products } from "@/app/lib/mockData";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { use } from "react";
import { useCart } from "@/context/CartContext";

export default function ProductDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const product = products.find((p) => p.id === Number(id));
  const { cart, toggleCartItem } = useCart();

  if (!product) return notFound();

  const inCart = cart.some((p) => p.id === product.id);

  return (
    <div className="max-w-3xl mx-auto py-12">
      <div className="grid md:grid-cols-2 gap-8">
        <Image
          src={product.image}
          alt={product.name}
          width={500}
          height={400}
          className="rounded-xl object-cover w-full h-[400px]"
        />
        <div className="flex flex-col justify-center">
          <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
          <p className="text-xl font-semibold mb-6">₹{product.price}</p>
          <Button
            onClick={() => toggleCartItem(product)}
            className="mt-3 w-full"
          >
            {inCart ? "Remove from Cart" : "Add to Cart"}
          </Button>
        </div>
      </div>
    </div>
  );
}
