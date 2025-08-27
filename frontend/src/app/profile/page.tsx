"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useActionLogger } from "@/utils/seed";
import { products } from "@/app/lib/mockData";
import { generateProductIdWithChecksum, calculatePlatformFee } from "@/utils/seed";
import { User, Mail, Phone, MapPin, Calendar, Edit3, Save, X, ShoppingBag, Heart, Package, Shield, Settings, Eye, Camera} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

const mockUser = {
  id: 1,
  name: "Alex Johnson",
  email: "alex.johnson@email.com",
  phone: "+91 98765 43210",
  avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
  location: "Mumbai, Maharashtra",
  joinedDate: "2023-06-15",
  verified: true,
  role: "buyer",
  stats: {
    orders: 24,
    wishlist: 12,
    reviews: 8,
    savedAddresses: 3
  },
  preferences: {
    notifications: {
      email: true,
      sms: true,
      push: false
    },
    privacy: {
      showProfile: true,
      showActivity: false
    }
  },
  recentOrders: [
    {
      id: "ORD-1234567",
      date: "2024-01-20",
      total: 2500,
      status: "delivered",
      items: 2
    },
    {
      id: "ORD-1234568", 
      date: "2024-01-15",
      total: 1200,
      status: "delivered",
      items: 1
    },
    {
      id: "ORD-1234569",
      date: "2024-01-10", 
      total: 3200,
      status: "processing",
      items: 3
    }
  ]
};

type TabType = "profile" | "orders" | "wishlist" | "addresses" | "settings";

export default function UserProfilePage() {
  const { logAction } = useActionLogger();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>("profile");
  const [isEditing, setIsEditing] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [userForm, setUserForm] = useState({
    name: mockUser.name,
    email: mockUser.email,
    phone: mockUser.phone,
    location: mockUser.location
  });

  useEffect(() => {
    setMounted(true);
    logAction('navigate', 'Visited Profile page');
  }, [logAction]);

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    logAction('click', `Switched to ${tab} tab in profile`);
  };

  const handleEditToggle = () => {
    if (isEditing) {
      logAction('click', 'Saved profile changes', { changes: userForm });
    } else {
      logAction('click', 'Started editing profile');
    }
    setIsEditing(!isEditing);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserForm(prev => ({ ...prev, [name]: value }));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'bg-green-500/20 text-green-400 border-green-400/30';
      case 'processing': return 'bg-blue-500/20 text-blue-400 border-blue-400/30';
      case 'shipped': return 'bg-purple-500/20 text-purple-400 border-purple-400/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-400/30';
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
    <div className="min-h-screen py-12 px-6">
      <div className="max-w-6xl mx-auto space-y-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Card className="card-gradient glow">
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="relative">
                  <img
                    src={mockUser.avatar}
                    alt={mockUser.name}
                    className="w-24 h-24 rounded-full object-cover border-4 border-primary/50"
                  />
                  <button
                    onClick={() => logAction('click', 'Clicked change avatar')}
                    className="absolute -bottom-1 -right-1 bg-primary rounded-full p-2 hover:bg-primary/80 transition-colors"
                  >
                    <Camera className="w-3 h-3 text-white" />
                  </button>
                  {mockUser.verified && (
                    <div className="absolute -top-1 -right-1 bg-green-500 rounded-full p-1">
                      <Shield className="w-3 h-3 text-white" />
                    </div>
                  )}
                </div>
                
                <div className="flex-1 text-center md:text-left space-y-2">
                  {isEditing ? (
                    <Input
                      name="name"
                      value={userForm.name}
                      onChange={handleInputChange}
                      className="input-gradient text-2xl font-bold text-center md:text-left"
                    />
                  ) : (
                    <h1 className="text-3xl font-bold gradient-text">{userForm.name}</h1>
                  )}
                  
                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-white/80">
                    <div className="flex items-center gap-1">
                      <Mail className="w-4 h-4" />
                      <span>{userForm.email}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Phone className="w-4 h-4" />
                      <span>{userForm.phone}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      <span>{userForm.location}</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                    <Badge className="bg-primary/20 text-primary border-primary/30">
                      <User className="w-3 h-3 mr-1" />
                      {mockUser.role.toUpperCase()}
                    </Badge>
                    {mockUser.verified && (
                      <Badge className="bg-green-500/20 text-green-400 border-green-400/30">
                        <Shield className="w-3 h-3 mr-1" />
                        Verified
                      </Badge>
                    )}
                    <Badge className="bg-blue-500/20 text-blue-400 border-blue-400/30">
                      <Calendar className="w-3 h-3 mr-1" />
                      Since {new Date(mockUser.joinedDate).getFullYear()}
                    </Badge>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <Button
                    onClick={handleEditToggle}
                    className={isEditing ? "bg-green-500 hover:bg-green-600" : "btn-gradient"}
                  >
                    {isEditing ? (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Save Changes
                      </>
                    ) : (
                      <>
                        <Edit3 className="w-4 h-4 mr-2" />
                        Edit Profile
                      </>
                    )}
                  </Button>
                  {isEditing && (
                    <Button
                      onClick={() => {
                        setIsEditing(false);
                        setUserForm({
                          name: mockUser.name,
                          email: mockUser.email,
                          phone: mockUser.phone,
                          location: mockUser.location
                        });
                        logAction('click', 'Cancelled profile editing');
                      }}
                      variant="outline"
                      className="border-red-500/50 text-red-400 hover:bg-red-500/10"
                    >
                      <X className="w-4 h-4 mr-2" />
                      Cancel
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          <Card className="card-gradient glow">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold gradient-text">{mockUser.stats.orders}</div>
              <div className="text-sm text-white/70">Total Orders</div>
            </CardContent>
          </Card>
          <Card className="card-gradient glow">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold gradient-text">{mockUser.stats.wishlist}</div>
              <div className="text-sm text-white/70">Wishlist Items</div>
            </CardContent>
          </Card>
          <Card className="card-gradient glow">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold gradient-text">{mockUser.stats.reviews}</div>
              <div className="text-sm text-white/70">Reviews Given</div>
            </CardContent>
          </Card>
          <Card className="card-gradient glow">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold gradient-text">{mockUser.stats.savedAddresses}</div>
              <div className="text-sm text-white/70">Saved Addresses</div>
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
              <div className="flex flex-wrap gap-2">
                {[
                  { id: "profile" as TabType, label: "Profile", icon: User },
                  { id: "orders" as TabType, label: "Orders", icon: Package },
                  { id: "wishlist" as TabType, label: "Wishlist", icon: Heart },
                  { id: "addresses" as TabType, label: "Addresses", icon: MapPin },
                  { id: "settings" as TabType, label: "Settings", icon: Settings }
                ].map((tab) => {
                  const IconComponent = tab.icon;
                  return (
                    <Button
                      key={tab.id}
                      variant={activeTab === tab.id ? "default" : "outline"}
                      onClick={() => handleTabChange(tab.id)}
                      className={activeTab === tab.id 
                        ? "btn-gradient" 
                        : "border-primary/50 text-white hover:bg-primary/10"
                      }
                      size="sm"
                    >
                      <IconComponent className="w-4 h-4 mr-2" />
                      {tab.label}
                    </Button>
                  );
                })}
              </div>
            </CardHeader>
            
            <CardContent>
              {activeTab === "profile" && (
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold gradient-text">Personal Information</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Full Name</Label>
                        <Input
                          name="name"
                          value={userForm.name}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          className="input-gradient"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Email Address</Label>
                        <Input
                          name="email"
                          value={userForm.email}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          className="input-gradient"
                        />
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Phone Number</Label>
                        <Input
                          name="phone"
                          value={userForm.phone}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          className="input-gradient"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Location</Label>
                        <Input
                          name="location"
                          value={userForm.location}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          className="input-gradient"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "orders" && (
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold gradient-text">Recent Orders</h3>
                  <div className="space-y-3">
                    {mockUser.recentOrders.map((order, index) => (
                      <motion.div
                        key={order.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.1 }}
                      >
                        <Card className="glass-dark border border-primary/20 hover:border-primary/40 transition-all">
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                  <span className="font-semibold text-white">Order #{order.id}</span>
                                  <Badge className={getStatusColor(order.status)}>
                                    {order.status.toUpperCase()}
                                  </Badge>
                                </div>
                                <div className="text-sm text-white/70">
                                  {new Date(order.date).toLocaleDateString()} • {order.items} items
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="text-xl font-bold gradient-text">
                                  ₹{order.total.toLocaleString()}
                                </div>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => {
                                    logAction('click', `Viewed order details: ${order.id}`);
                                    router.push(`/order/${order.id}`);
                                  }}
                                  className="border-primary/50 text-white hover:bg-primary/10 mt-1"
                                >
                                  <Eye className="w-3 h-3 mr-1" />
                                  View Details
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === "wishlist" && (
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold gradient-text">Your Wishlist</h3>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {products.slice(0, 3).map((product, index) => (
                      <motion.div
                        key={product.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.1 }}
                        whileHover={{ scale: 1.02 }}
                        className="cursor-pointer group"
                      >
                        <Card className="glass-dark border border-primary/20 hover:border-primary/40 transition-all overflow-hidden">
                          <div className="relative">
                            <Image
                              src={product.image}
                              alt={product.name}
                              width={200}
                              height={120}
                              className="w-full h-32 object-cover"
                            />
                            <div className="absolute top-2 left-2">
                              <Badge className="bg-primary/20 text-primary border-primary/30 text-xs">
                                {generateProductIdWithChecksum(product.id)}
                              </Badge>
                            </div>
                          </div>
                          <div className="p-4">
                            <h4 className="font-semibold text-white group-hover:text-primary transition-colors">
                              {product.name}
                            </h4>
                            <p className="text-lg font-bold gradient-text">
                              ₹{product.price.toLocaleString()}
                            </p>
                            <p className="text-xs text-white/60">
                              Fee: ₹{calculatePlatformFee(product.price)}
                            </p>
                            <Button
                              onClick={() => {
                                logAction('click', `Added ${product.name} to cart from wishlist`);
                              }}
                              className="btn-gradient w-full mt-2"
                              size="sm"
                            >
                              <ShoppingBag className="w-3 h-3 mr-1" />
                              Add to Cart
                            </Button>
                          </div>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === "addresses" && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-xl font-semibold gradient-text">Saved Addresses</h3>
                    <Button
                      onClick={() => logAction('click', 'Clicked add new address')}
                      className="btn-gradient"
                      size="sm"
                    >
                      Add New Address
                    </Button>
                  </div>
                  <div className="space-y-3">
                    {["Home", "Office", "Parents"].map((addressType, index) => (
                      <Card key={addressType} className="glass-dark border border-primary/20">
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <Badge className="bg-primary/20 text-primary border-primary/30">
                                  {addressType}
                                </Badge>
                              </div>
                              <p className="text-white/80">
                                123 Sample Street, Sample Area,<br />
                                Mumbai, Maharashtra 400001
                              </p>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => logAction('click', `Edit ${addressType} address`)}
                                className="border-primary/50 text-white hover:bg-primary/10"
                              >
                                <Edit3 className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === "settings" && (
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold gradient-text">Account Settings</h3>
                  
                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-white">Notifications</h4>
                    <div className="space-y-3">
                      {Object.entries(mockUser.preferences.notifications).map(([key, value]) => (
                        <div key={key} className="flex items-center justify-between p-3 glass-dark rounded-lg">
                          <span className="text-white capitalize">{key} Notifications</span>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              defaultChecked={value}
                              onChange={() => logAction('click', `Toggled ${key} notifications`)}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-white">Privacy</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 glass-dark rounded-lg">
                        <span className="text-white">Show Profile Publicly</span>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            defaultChecked={mockUser.preferences.privacy.showProfile}
                            onChange={() => logAction('click', 'Toggled profile visibility')}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-white/10">
                    <Button
                      onClick={() => {
                        logAction('click', 'Clicked delete account');
                        alert("Account deletion would require additional security verification.");
                      }}
                      variant="destructive"
                      size="sm"
                    >
                      Delete Account
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}