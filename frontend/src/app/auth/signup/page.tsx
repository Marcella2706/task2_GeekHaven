"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useActionLogger } from "@/utils/seed";
import { useAuth } from "@/context/AuthContext"; 
import { motion, AnimatePresence } from "framer-motion";
import {
  UserPlus,
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  ShoppingBag,
  Store,
  ArrowRight,
  Check
} from "lucide-react";

type UserRole = "buyer" | "seller" | null;

interface FormData {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone: string;
  agreeToTerms: boolean;
}

export default function SignupPage() {
  const { logAction } = useActionLogger();
  const { register, googleAuth, isLoading } = useAuth(); 
  const [role, setRole] = useState<UserRole>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    agreeToTerms: false,
  });

  useEffect(() => {
    setMounted(true);
    logAction("navigate", "Visited Sign Up page");
  }, [logAction]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleRoleSelect = (selectedRole: UserRole) => {
    setRole(selectedRole);
    logAction("click", `Selected role: ${selectedRole}`);
  };

  const handleBack = () => {
    setRole(null);
    logAction("click", "Clicked back to role selection");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // 🔹 Validate form data
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    if (!formData.agreeToTerms) {
      setError("Please agree to the terms and conditions!");
      return;
    }

    if (role === "seller" && !/^[0-9]{10}$/.test(formData.phone)) {
      setError("Please enter a valid 10-digit phone number!");
      return;
    }

    try {
      await register({
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
        role: role ?? "buyer",
        phone: role === "seller" ? formData.phone : undefined,
      });

      setSuccess("Account created successfully! Redirecting...");
    } catch (err: any) {
      setError(err.message || "Registration failed. Try again!");
    }
  };

  const handleGoogleSignup = async () => {
    try {
      const googleToken = "FAKE_GOOGLE_TOKEN";
      await googleAuth(googleToken, role ?? "buyer");
    } catch (err: any) {
      setError(err.message || "Google authentication failed!");
    }
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
          <h1 className="text-4xl font-bold gradient-text">Join ReSellHub</h1>
          <p className="text-white/80">Start your journey in the marketplace</p>
          <Badge className="bg-primary/20 text-primary border-primary/30">
            Create Your Account
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
                  <UserPlus className="w-8 h-8 text-primary" />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-white">Create Account</h2>
              <p className="text-white/70">
                {!role ? "Choose your account type" : `Sign up as a ${role}`}
              </p>
            </CardHeader>

            <CardContent>
              <AnimatePresence mode="wait">
                {!role ? (
                  <motion.div
                    key="role-selection"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-4"
                  >
                    <p className="text-center text-white/80 mb-6">
                      What brings you to our marketplace?
                    </p>

                    <motion.button
                      onClick={() => handleRoleSelect("buyer")}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full p-6 glass-dark border border-primary/30 rounded-lg hover:border-primary/60 transition-all group"
                    >
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-blue-500/20 rounded-full">
                          <ShoppingBag className="w-6 h-6 text-blue-400" />
                        </div>
                        <div className="text-left">
                          <h3 className="font-semibold text-white group-hover:text-primary transition-colors">
                            I want to Buy
                          </h3>
                          <p className="text-sm text-white/70">
                            Discover amazing products and great deals
                          </p>
                        </div>
                        <ArrowRight className="w-5 h-5 text-white/50 ml-auto group-hover:text-primary transition-colors" />
                      </div>
                    </motion.button>

                    <motion.button
                      onClick={() => handleRoleSelect("seller")}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full p-6 glass-dark border border-primary/30 rounded-lg hover:border-primary/60 transition-all group"
                    >
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-green-500/20 rounded-full">
                          <Store className="w-6 h-6 text-green-400" />
                        </div>
                        <div className="text-left">
                          <h3 className="font-semibold text-white group-hover:text-primary transition-colors">
                            I want to Sell
                          </h3>
                          <p className="text-sm text-white/70">
                            Start your business and reach more customers
                          </p>
                        </div>
                        <ArrowRight className="w-5 h-5 text-white/50 ml-auto group-hover:text-primary transition-colors" />
                      </div>
                    </motion.button>
                  </motion.div>
                ) : (
                  <motion.div
                    key="registration-form"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-white/80" htmlFor="fullName">
                          Full Name
                        </label>
                        <Input
                          id="fullName"
                          name="fullName"
                          value={formData.fullName}
                          onChange={handleInputChange}
                          placeholder="Enter your full name"
                          className="input-gradient"
                          required
                        />
                      </div>

                      <div>
                        <label className="text-sm font-medium text-white/80" htmlFor="email">
                          Email Address
                        </label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="Enter your email"
                          className="input-gradient"
                          required
                        />
                      </div>

                      {role === "seller" && (
                        <div>
                          <label className="text-sm font-medium text-white/80" htmlFor="phone">
                            Phone Number
                          </label>
                          <Input
                            id="phone"
                            name="phone"
                            type="tel"
                            value={formData.phone}
                            onChange={handleInputChange}
                            placeholder="Enter your phone number"
                            className="input-gradient"
                            required
                          />
                        </div>
                      )}

                      <div>
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
                            placeholder="Create a strong password"
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

                      <div>
                        <label className="text-sm font-medium text-white/80" htmlFor="confirmPassword">
                          Confirm Password
                        </label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 w-4 h-4" />
                          <Input
                            id="confirmPassword"
                            name="confirmPassword"
                            type={showConfirmPassword ? "text" : "password"}
                            value={formData.confirmPassword}
                            onChange={handleInputChange}
                            placeholder="Confirm your password"
                            className="input-gradient pl-10 pr-10"
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white transition-colors"
                          >
                            {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                      <label className="flex items-start gap-3 text-sm text-white/70 cursor-pointer">
                        <input
                          type="checkbox"
                          name="agreeToTerms"
                          checked={formData.agreeToTerms}
                          onChange={handleInputChange}
                          className="mt-1 rounded border-primary/50 bg-white/10"
                          required
                        />
                        <span>
                          I agree to the{" "}
                          <Link href="/terms" className="text-primary hover:text-primary/80">
                            Terms of Service
                          </Link>{" "}
                          and{" "}
                          <Link href="/privacy" className="text-primary hover:text-primary/80">
                            Privacy Policy
                          </Link>
                        </span>
                      </label>

                      {error && <p className="text-red-500 text-sm">{error}</p>}
                      {success && <p className="text-green-500 text-sm">{success}</p>}

                      <Button
                        type="submit"
                        disabled={isLoading || !formData.agreeToTerms}
                        className="btn-gradient w-full text-lg py-3 glow"
                      >
                        {isLoading ? (
                          <div className="flex items-center gap-2">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            Creating Account...
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <Check className="w-4 h-4" />
                            Create {role} Account
                          </div>
                        )}
                      </Button>

                      <Button
                        type="button"
                        onClick={handleGoogleSignup}
                        variant="outline"
                        className="w-full mt-3"
                      >
                        Continue with Google
                      </Button>
                    </form>
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>

            <CardFooter className="text-center">
              <p className="text-sm text-white/60">
                Already have an account?{" "}
                <Link
                  href="/auth/signin"
                  className="text-primary hover:text-primary/80 font-semibold transition-colors"
                  onClick={() => logAction("click", "Clicked sign in link from sign up")}
                >
                  Sign In
                </Link>
              </p>
            </CardFooter>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
