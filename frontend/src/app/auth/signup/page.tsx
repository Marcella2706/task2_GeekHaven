"use client";
import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";

export default function SignupPage() {
  const [role, setRole] = useState<"buyer" | "seller" | null>(null);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <h2 className="text-2xl font-bold text-center">Create Account</h2>
        </CardHeader>
        <CardContent>
          {!role && (
            <div className="flex flex-col gap-4">
              <p className="text-center text-gray-600">Sign up as...</p>
              <Button onClick={() => setRole("buyer")}>Buyer</Button>
              <Button onClick={() => setRole("seller")} variant="outline">
                Seller
              </Button>
            </div>
          )}

          {role === "buyer" && (
            <form className="flex flex-col gap-4">
              <Input type="text" placeholder="Full Name" required />
              <Input type="email" placeholder="Email" required />
              <Input type="password" placeholder="Password" required />
              <Button type="submit">Sign Up as Buyer</Button>
              <Button type="button" variant="ghost" onClick={() => setRole(null)}>
                ← Back
              </Button>
            </form>
          )}

          {role === "seller" && (
            <form className="flex flex-col gap-4">
              <Input type="text" placeholder="Full Name" required />
              <Input type="email" placeholder="Email" required />
              <Input type="password" placeholder="Password" required />
              <Button type="submit">Sign Up as Seller</Button>
              <Button type="button" variant="ghost" onClick={() => setRole(null)}>
                ← Back
              </Button>
            </form>
          )}
        </CardContent>
        <CardFooter className="text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link href="/auth/signin" className="text-blue-600 hover:underline">
            Sign In
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
