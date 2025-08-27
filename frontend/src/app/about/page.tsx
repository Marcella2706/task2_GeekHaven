"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useActionLogger } from "../../utils/seed";
import { ASSIGNMENT_SEED, generateColorFromSeed, getSeedNumber, hashSeed } from "../../utils/seed";

export default function AboutPage() {
  const { logAction } = useActionLogger();
  const [seedColors, setSeedColors] = useState(generateColorFromSeed(ASSIGNMENT_SEED));
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    logAction('navigate', 'Visited About page');
  }, [logAction]);

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  const seedInfo = {
    seed: ASSIGNMENT_SEED,
    hash: hashSeed(ASSIGNMENT_SEED),
    number: getSeedNumber(),
    colors: seedColors
  };

  return (
    <div className="min-h-screen py-12 px-6">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-4 mb-12">
          <h1 className="text-6xl font-bold gradient-text float">
            ReSellHub
          </h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            The ultimate marketplace for buying and selling pre-loved items. 
            Built with passion, powered by innovation.
          </p>
        </div>

        <Card className="card-gradient glow">
          <CardHeader>
            <CardTitle className="text-2xl gradient-text flex items-center gap-2">
               Assignment Seed Information
              <Badge className="bg-primary text-white pulse-pink">
                Unique ID
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="p-4 glass-dark rounded-lg">
                  <h3 className="font-semibold text-primary mb-2">Seed Value</h3>
                  <p className="font-mono text-lg text-white bg-black/30 p-2 rounded">
                    {seedInfo.seed}
                  </p>
                </div>
                
                <div className="p-4 glass-dark rounded-lg">
                  <h3 className="font-semibold text-primary mb-2">Hash Value</h3>
                  <p className="text-white">{seedInfo.hash.toLocaleString()}</p>
                </div>

                <div className="p-4 glass-dark rounded-lg">
                  <h3 className="font-semibold text-primary mb-2">Seed Number</h3>
                  <p className="text-white">{seedInfo.number.toLocaleString()}</p>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-primary">Generated Theme Colors</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-8 h-8 rounded-full border-2 border-white/20"
                      style={{ backgroundColor: seedInfo.colors.primary }}
                    ></div>
                    <span className="text-white">Primary: {seedInfo.colors.primary}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-8 h-8 rounded-full border-2 border-white/20"
                      style={{ backgroundColor: seedInfo.colors.secondary }}
                    ></div>
                    <span className="text-white">Secondary: {seedInfo.colors.secondary}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-8 h-8 rounded-full border-2 border-white/20"
                      style={{ backgroundColor: seedInfo.colors.accent }}
                    ></div>
                    <span className="text-white">Accent: {seedInfo.colors.accent}</span>
                  </div>
                </div>
                
                <div className="mt-4">
                  <h4 className="font-semibold text-primary mb-2">Generated Gradient</h4>
                  <div 
                    className="h-16 rounded-lg border-2 border-white/20"
                    style={{ background: seedInfo.colors.gradient }}
                  ></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="card-gradient glow">
            <CardHeader>
              <CardTitle className="text-primary">Smart Marketplace</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-white/80">
                Advanced search and filtering system with real-time updates 
                and intelligent product recommendations.
              </p>
            </CardContent>
          </Card>

          <Card className="card-gradient glow">
            <CardHeader>
              <CardTitle className="text-primary">Premium Experience</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-white/80">
                Seamless cart management with dynamic pricing, 
                seed-based platform fees, and secure checkout.
              </p>
            </CardContent>
          </Card>

          <Card className="card-gradient glow">
            <CardHeader>
              <CardTitle className="text-primary">Dynamic Theming</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-white/80">
                Unique color schemes generated from assignment seed, 
                ensuring each instance has its own visual identity.
              </p>
            </CardContent>
          </Card>

          <Card className="card-gradient glow">
            <CardHeader>
              <CardTitle className="text-primary">Responsive Design</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-white/80">
                Mobile-first approach with glass morphism effects 
                and smooth animations for modern user experience.
              </p>
            </CardContent>
          </Card>

          <Card className="card-gradient glow">
            <CardHeader>
              <CardTitle className="text-primary">Secure Platform</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-white/80">
                Product verification with checksum validation 
                and comprehensive user action logging.
              </p>
            </CardContent>
          </Card>

          <Card className="card-gradient glow">
            <CardHeader>
              <CardTitle className="text-primary">Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-white/80">
                Optimized with Next.js, server-side rendering, 
                and intelligent caching strategies.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}