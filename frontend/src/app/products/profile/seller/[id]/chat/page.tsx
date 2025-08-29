"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Send,
  ArrowLeft,
  Shield,
  Star,
} from "lucide-react";
import Image from "next/image";

const mockSeller = {
  id: 1,
  name: "TechStore Premium",
  avatar:
    "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
  rating: 4.8,
  isOnline: true,
  verified: true,
};

export default function ChatPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [messages, setMessages] = useState([
    {
      id: 1,
      senderId: "seller",
      senderName: mockSeller.name,
      content:
        "Hi! Thanks for your interest. How can I help you?",
      timestamp: new Date(),
      type: "text" as const,
    },
  ]);
  const [newMessage, setNewMessage] = useState("");

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const message = {
      id: messages.length + 1,
      senderId: "user",
      senderName: "You",
      content: newMessage,
      timestamp: new Date(),
      type: "text" as const,
    };

    setMessages((prev) => [...prev, message]);
    setNewMessage("");
  };

  return (
    <div className="min-h-screen py-6 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Card className="card-gradient glow h-[80vh] flex flex-col">
            <CardHeader className="flex items-center justify-between border-b border-primary/20">
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => router.back()}
                  className="border-primary/50 text-white hover:bg-primary/10"
                >
                  <ArrowLeft className="w-4 h-4" />
                </Button>
                <Image
                  src={mockSeller.avatar}
                  alt={mockSeller.name}
                  width={48}
                  height={48}
                  className="rounded-full border-2 border-primary/50"
                />
                <div>
                  <h2 className="font-bold text-white">{mockSeller.name}</h2>
                  {mockSeller.verified && (
                    <Badge className="bg-green-500/20 text-green-400 border-green-400/30 text-xs">
                      <Shield className="w-3 h-3 mr-1" />
                      Verified
                    </Badge>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex flex-col flex-1 p-4 overflow-y-auto">
              <div className="space-y-4">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${
                      msg.senderId === "user"
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >
                    <div
                      className={`px-4 py-2 rounded-2xl max-w-[70%] ${
                        msg.senderId === "user"
                          ? "bg-primary text-white"
                          : "bg-white/10 text-white"
                      }`}
                    >
                      {msg.content}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <form
              onSubmit={handleSendMessage}
              className="p-4 border-t border-primary/20 flex gap-2"
            >
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
                className="flex-1"
              />
              <Button type="submit" className="btn-gradient">
                <Send className="w-4 h-4" />
              </Button>
            </form>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
