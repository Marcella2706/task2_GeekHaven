"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useActionLogger } from "@/utils/seed";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { LogIn, Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";

export default function SigninPage() {
  const { logAction } = useActionLogger();
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    logAction('navigate', 'Visited Sign In page');
  }, [logAction]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    logAction('click', 'Attempted sign in', { email: formData.email });
    
    setTimeout(() => {
      setIsLoading(false);
      logAction('click', 'Sign in completed', { email: formData.email });
      alert("Sign in functionality would integrate with your authentication system!");
    }, 1500);
  };

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8 space-y-4"
        >
          <h1 className="text-4xl font-bold gradient-text">Welcome Back</h1>
          <p className="text-white/80">Sign in to continue your journey</p>
          <Badge className="bg-primary/20 text-primary border-primary/30">
            Secure Login Portal
          </Badge>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <Card className="card-gradient glow">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <div className="p-4 bg-primary/20 rounded-full">
                  <LogIn className="w-8 h-8 text-primary" />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-white">Sign In</h2>
              <p className="text-white/70">Enter your credentials to access your account</p>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/80" htmlFor="email">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 w-4 h-4" />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Enter your email"
                      className="input-gradient pl-10"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/80" htmlFor="password">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 w-4 h-4" />
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="Enter your password"
                      className="input-gradient pl-10 pr-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 text-sm text-white/70">
                    <input
                      type="checkbox"
                      className="rounded border-primary/50 bg-white/10"
                    />
                    Remember me
                  </label>
                  <button
                    type="button"
                    onClick={() => logAction('click', 'Clicked forgot password')}
                    className="text-sm text-primary hover:text-primary/80 transition-colors"
                  >
                    Forgot password?
                  </button>
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="btn-gradient w-full text-lg py-3 glow"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Signing In...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      Sign In
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  )}
                </Button>
              </form>
              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-white/20"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="bg-gradient-to-r from-transparent via-card to-transparent px-4 text-white/60">
                      Or continue with
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-0.5 gap-3 mt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => logAction('click', 'Clicked Google sign in')}
                    className=" border-primary/50 text-white hover:bg-primary/10"
                  >
                    <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                      <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    Google
                  </Button> 
                </div>
              </div>
            </CardContent>

            <CardFooter className="text-center">
              <div className="w-full space-y-4">
                <p className="text-sm text-white/60">
                  Don't have an account?{" "}
                  <Link 
                    href="/auth/signup" 
                    className="text-primary hover:text-primary/80 font-semibold transition-colors"
                    onClick={() => logAction('click', 'Clicked sign up link from sign in')}
                  >
                    Create Account
                  </Link>
                </p>
              </div>
            </CardFooter>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}