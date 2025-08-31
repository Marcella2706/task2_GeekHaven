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
import { useAuth } from "@/context/AuthContext"; 
import { GoogleLogin } from "@react-oauth/google"; 

export default function SigninPage() {
  const { logAction } = useActionLogger();
  const { login, googleAuth, isLoading } = useAuth();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
    logAction("navigate", "Visited Sign In page");
  }, [logAction]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    logAction("click", "Attempted sign in", { email: formData.email });

    try {
      await login(formData.email, formData.password);
      logAction("click", "Sign in completed", { email: formData.email });
    } catch (err: any) {
      setError(err.message || "Login failed");
    }
  };

  const handleGoogleSuccess = async (response: any) => {
    try {
      const token = response.credential;
      await googleAuth(token);
      logAction("click", "Google sign-in successful");
    } catch (err: any) {
      setError(err.message || "Google authentication failed");
    }
  };

  const handleGoogleError = () => {
    setError("Google authentication failed. Please try again.");
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
              <p className="text-white/70">
                Enter your credentials to access your account
              </p>
            </CardHeader>

            <CardContent>
              {error && (
                <p className="text-red-500 text-center mb-4">{error}</p>
              )}

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
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
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
                    onClick={() => logAction("click", "Clicked forgot password")}
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

              {/* Divider */}
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

                {/* Google Login */}
                <div className="flex justify-center mt-4">
                  <GoogleLogin
                    onSuccess={handleGoogleSuccess}
                    onError={handleGoogleError}
                    useOneTap
                  />
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
                    onClick={() => logAction("click", "Clicked sign up link from sign in")}
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
