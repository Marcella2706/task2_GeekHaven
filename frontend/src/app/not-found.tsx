"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useActionLogger } from "@/utils/seed";
import { useEffect } from "react";

export default function NotFound() {
  const router = useRouter();
  const { logAction } = useActionLogger();

  useEffect(() => {
    logAction('navigate', '404 page visited', { url: window.location.pathname });
  }, [logAction]);

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <Card className="card-gradient glow max-w-md w-full">
        <CardContent className="p-12 text-center space-y-6">
          <div className="text-8xl">🔍</div>
          <h1 className="text-4xl font-bold gradient-text">404</h1>
          <h2 className="text-2xl font-semibold text-white">Page Not Found</h2>
          <p className="text-white/80">
            The page you're looking for doesn't exist or has been moved.
          </p>
          <div className="space-y-3">
            <Button 
              onClick={() => {
                logAction('click', 'Clicked Back to Home from 404');
                router.push('/');
              }}
              className="btn-gradient w-full"
            >
              Back to Home
            </Button>
            <Button 
              onClick={() => {
                logAction('click', 'Clicked Browse Products from 404');
                router.push('/products');
              }}
              variant="outline"
              className="w-full border-primary/50 text-white hover:bg-primary/10"
            >
              Browse Products
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}