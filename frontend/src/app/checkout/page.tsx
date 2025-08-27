"use client";

import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useMemo, useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"; 
import { Label } from "@/components/ui/label"; 
import { Badge } from "@/components/ui/badge";
import { useActionLogger } from "@/utils/seed";
import { calculatePlatformFee, generateProductIdWithChecksum } from "@/utils/seed";
import { 
  CreditCard, 
  Truck, 
  Shield, 
  MapPin, 
  User, 
  Phone, 
  Mail, 
  Home,
  Trash2,
  Lock,
  CheckCircle,
  Info
} from "lucide-react";
import { motion } from "framer-motion";

type ShippingForm = {
  fullName: string;
  email: string;
  phone: string;
  address1: string;
  address2: string;
  city: string;
  state: string;
  pincode: string;
};

type PaymentMethod = "upi" | "card" | "cod" | "wallet";

const INR = (n: number) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);

const paymentMethods = [
  {
    id: "upi" as PaymentMethod,
    name: "UPI Payment",
    description: "Pay with GPay, PhonePe, Paytm",
    icon: "",
    popular: true
  },
  {
    id: "card" as PaymentMethod,
    name: "Credit/Debit Card",
    description: "Visa, Mastercard, RuPay",
    icon: "",
    popular: false
  },
  {
    id: "wallet" as PaymentMethod,
    name: "Digital Wallet",
    description: "Paytm, Amazon Pay, etc.",
    icon: "",
    popular: false
  },
  {
    id: "cod" as PaymentMethod,
    name: "Cash on Delivery",
    description: "Pay when you receive",
    icon: "",
    popular: false
  }
];

export default function CheckoutPage() {
  const { cart, removeFromCart } = useCart();
  const router = useRouter();
  const { logAction } = useActionLogger();

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("upi");
  const [isProcessing, setIsProcessing] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [form, setForm] = useState<ShippingForm>({
    fullName: "",
    email: "",
    phone: "",
    address1: "",
    address2: "",
    city: "",
    state: "",
    pincode: "",
  });

  useEffect(() => {
    setMounted(true);
    logAction('navigate', 'Visited Checkout page', { itemCount: cart.length });
  }, [logAction, cart.length]);

  const subtotal = useMemo(() => cart.reduce((s, p) => s + p.price, 0), [cart]);
  const platformFee = useMemo(() => calculatePlatformFee(subtotal), [subtotal]);
  const shipping = subtotal > 5000 || subtotal === 0 ? 0 : 99;
  const taxes = Math.round(subtotal * 0.18 * 100) / 100; // 18% GST
  const total = subtotal + platformFee + shipping + taxes;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handlePaymentMethodSelect = (method: PaymentMethod) => {
    setPaymentMethod(method);
    logAction('click', `Selected payment method: ${method}`);
  };

  const placeOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cart.length) return;

    const requiredFields: (keyof ShippingForm)[] = [
      "fullName",
      "email", 
      "phone",
      "address1",
      "city",
      "state",
      "pincode",
    ];
    const missing = requiredFields.filter((k) => !form[k]?.trim());
    if (missing.length) {
      alert("Please fill all required fields.");
      return;
    }

    setIsProcessing(true);
    logAction('click', 'Started order placement', {
      itemCount: cart.length,
      subtotal,
      platformFee,
      shipping,
      taxes,
      total,
      paymentMethod
    });

    await new Promise(resolve => setTimeout(resolve, 2000));

    const orderId = `ORD-${Date.now().toString().slice(-7)}`;
    const orderSummary = {
      orderId,
      items: cart.map(item => ({
        ...item,
        checksum: generateProductIdWithChecksum(item.id)
      })),
      subtotal,
      platformFee,
      shipping,
      taxes,
      total,
      paymentMethod,
      shippingTo: form,
      placedAt: new Date().toISOString(),
    };

    sessionStorage.setItem("lastOrder", JSON.stringify(orderSummary));

    cart.forEach((item) => removeFromCart(item.id));

    logAction('click', 'Order placed successfully', {
      orderId,
      total,
      paymentMethod
    });

    setIsProcessing(false);
    router.push("/order/success");
  };

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!cart.length) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <Card className="card-gradient glow max-w-md w-full">
          <CardContent className="p-12 text-center space-y-6">
            <div className="text-6xl">🛒</div>
            <h2 className="text-2xl font-bold text-white">Your cart is empty</h2>
            <p className="text-white/80">Add some products to continue with checkout</p>
            <Button 
              onClick={() => {
                logAction('click', 'Clicked Start Shopping from empty checkout');
                router.push('/products');
              }}
              className="btn-gradient glow"
            >
              Start Shopping
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8 space-y-4"
        >
          <h1 className="text-4xl font-bold gradient-text">Secure Checkout</h1>
          <div className="flex justify-center gap-4">
            <Badge className="bg-primary/20 text-primary border-primary/30">
              {cart.length} {cart.length === 1 ? 'Item' : 'Items'}
            </Badge>
            <Badge className="bg-green-500/20 text-green-400 border-green-400/30">
              <Shield className="w-3 h-3 mr-1" />
              SSL Encrypted
            </Badge>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <form onSubmit={placeOrder} className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                <Card className="card-gradient glow">
                  <CardHeader>
                    <CardTitle className="text-2xl gradient-text flex items-center gap-2">
                      <Truck className="w-6 h-6" />
                      Shipping Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="fullName" className="flex items-center gap-1">
                          <User className="w-4 h-4" />
                          Full Name *
                        </Label>
                        <Input 
                          id="fullName" 
                          name="fullName" 
                          value={form.fullName} 
                          onChange={handleChange}
                          className="input-gradient"
                          required 
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone" className="flex items-center gap-1">
                          <Phone className="w-4 h-4" />
                          Phone *
                        </Label>
                        <Input 
                          id="phone" 
                          name="phone" 
                          value={form.phone} 
                          onChange={handleChange}
                          className="input-gradient"
                          required 
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email" className="flex items-center gap-1">
                        <Mail className="w-4 h-4" />
                        Email *
                      </Label>
                      <Input 
                        id="email" 
                        name="email" 
                        type="email" 
                        value={form.email} 
                        onChange={handleChange}
                        className="input-gradient"
                        required 
                      />
                    </div>

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="address1" className="flex items-center gap-1">
                          <Home className="w-4 h-4" />
                          Address Line 1 *
                        </Label>
                        <Input 
                          id="address1" 
                          name="address1" 
                          value={form.address1} 
                          onChange={handleChange}
                          className="input-gradient"
                          placeholder="Street address, house number"
                          required 
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="address2">Address Line 2</Label>
                        <Input 
                          id="address2" 
                          name="address2" 
                          value={form.address2} 
                          onChange={handleChange}
                          className="input-gradient"
                          placeholder="Apartment, suite, building (optional)"
                        />
                      </div>

                      <div className="grid sm:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="city" className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            City *
                          </Label>
                          <Input 
                            id="city" 
                            name="city" 
                            value={form.city} 
                            onChange={handleChange}
                            className="input-gradient"
                            required 
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="state">State *</Label>
                          <Input 
                            id="state" 
                            name="state" 
                            value={form.state} 
                            onChange={handleChange}
                            className="input-gradient"
                            required 
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="pincode">Pincode *</Label>
                          <Input 
                            id="pincode" 
                            name="pincode" 
                            value={form.pincode} 
                            onChange={handleChange}
                            className="input-gradient"
                            pattern="[0-9]{6}"
                            required 
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <Card className="card-gradient glow">
                  <CardHeader>
                    <CardTitle className="text-2xl gradient-text flex items-center gap-2">
                      <CreditCard className="w-6 h-6" />
                      Payment Method
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-3">
                      {paymentMethods.map((method) => (
                        <motion.label
                          key={method.id}
                          whileHover={{ scale: 1.01 }}
                          whileTap={{ scale: 0.99 }}
                          className={`flex items-center gap-4 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                            paymentMethod === method.id
                              ? 'border-primary bg-primary/10'
                              : 'border-white/20 hover:border-white/40 glass-dark'
                          }`}
                        >
                          <input
                            type="radio"
                            name="payment"
                            checked={paymentMethod === method.id}
                            onChange={() => handlePaymentMethodSelect(method.id)}
                            className="sr-only"
                          />
                          <div className="text-2xl">{method.icon}</div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-white">{method.name}</span>
                              {method.popular && (
                                <Badge className="bg-primary/20 text-primary border-primary/30 text-xs">
                                  Popular
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-white/70">{method.description}</p>
                          </div>
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                            paymentMethod === method.id
                              ? 'border-primary bg-primary'
                              : 'border-white/40'
                          }`}>
                            {paymentMethod === method.id && (
                              <CheckCircle className="w-3 h-3 text-white" />
                            )}
                          </div>
                        </motion.label>
                      ))}
                    </div>

                    <div className="mt-6 p-4 glass-dark rounded-lg">
                      <div className="flex items-center gap-2 text-sm text-white/80">
                        <Lock className="w-4 h-4" />
                        <span>Your payment information is encrypted and secure</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <Button
                  type="submit"
                  disabled={isProcessing}
                  className="btn-gradient w-full text-lg py-4 glow"
                >
                  {isProcessing ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Processing Order...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Shield className="w-5 h-5" />
                      Place Secure Order - {INR(total)}
                    </div>
                  )}
                </Button>
              </motion.div>
            </form>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-6"
          >
            <Card className="card-gradient glow sticky top-24">
              <CardHeader>
                <CardTitle className="text-xl gradient-text">Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3 max-h-80 overflow-auto pr-2">
                  {cart.map((item, idx) => (
                    <div
                      key={`${item.id}-${idx}`}
                      className="flex items-center gap-3 p-3 glass-dark rounded-lg"
                    >
                      <Image
                        src={item.image}
                        alt={item.name}
                        width={50}
                        height={50}
                        className="rounded-md object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-white text-sm truncate">{item.name}</p>
                        <p className="text-xs text-white/60">
                          ID: {generateProductIdWithChecksum(item.id)}
                        </p>
                        <p className="text-sm font-semibold gradient-text">{INR(item.price)}</p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          logAction('cart', `Removed ${item.name} from cart during checkout`, { productId: item.id });
                          removeFromCart(item.id);
                        }}
                        className="border-red-500/50 text-red-400 hover:bg-red-500/10 p-1"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  ))}
                </div>

                <div className="border-t border-white/10 pt-4 space-y-3">
                  <div className="flex justify-between text-white/80">
                    <span>Subtotal ({cart.length} items)</span>
                    <span>{INR(subtotal)}</span>
                  </div>
                  
                  <div className="flex justify-between text-white/80">
                    <span className="flex items-center gap-1">
                      Platform Fee
                      <div className="group relative">
                        <Info className="w-3 h-3 text-white/50 cursor-help" />
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block z-10">
                          <div className="bg-black/90 text-white text-xs p-2 rounded whitespace-nowrap">
                            Based on seed calculation
                          </div>
                        </div>
                      </div>
                    </span>
                    <span className="text-primary">{INR(platformFee)}</span>
                  </div>
                  
                  <div className="flex justify-between text-white/80">
                    <span>Shipping</span>
                    <span className={shipping === 0 ? "text-green-400" : ""}>
                      {shipping === 0 ? "FREE" : INR(shipping)}
                    </span>
                  </div>
                  
                  <div className="flex justify-between text-white/80">
                    <span>Taxes (GST)</span>
                    <span>{INR(taxes)}</span>
                  </div>
                  
                  <div className="border-t border-white/10 pt-3">
                    <div className="flex justify-between font-bold text-lg">
                      <span className="text-white">Total</span>
                      <span className="gradient-text">{INR(total)}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 p-3 glass-dark rounded-lg">
                  <div className="text-sm space-y-2">
                    <div className="flex items-center gap-2 text-green-400">
                      <CheckCircle className="w-4 h-4" />
                      <span>Estimated delivery: 2-3 business days</span>
                    </div>
                    {shipping === 0 && (
                      <div className="flex items-center gap-2 text-green-400">
                        <CheckCircle className="w-4 h-4" />
                        <span>Free shipping applied!</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-blue-400">
                      <Shield className="w-4 h-4" />
                      <span>Protected by buyer guarantee</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}