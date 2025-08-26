"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";

export default function SigninPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <h2 className="text-2xl font-bold text-center">Sign In</h2>
        </CardHeader>
        <CardContent>
          <form className="flex flex-col gap-4">
            <Input type="email" placeholder="Email" required />
            <Input type="password" placeholder="Password" required />
            <Button type="submit">Sign In</Button>
          </form>
        </CardContent>
        <CardFooter className="text-center text-sm text-gray-600">
          Don’t have an account?{" "}
          <Link href="/auth/signup" className="text-blue-600 hover:underline">
            Sign Up
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
