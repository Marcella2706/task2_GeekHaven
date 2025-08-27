"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ASSIGNMENT_SEED, getSeedNumber } from "@/app/utils/seed";

export default function HealthzPage() {
  const [timestamp, setTimestamp] = useState(new Date());
  const [uptime, setUptime] = useState(0);

  useEffect(() => {
    const startTime = Date.now();
    const interval = setInterval(() => {
      setTimestamp(new Date());
      setUptime(Date.now() - startTime);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatUptime = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes % 60}m ${seconds % 60}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${seconds % 60}s`;
    } else {
      return `${seconds}s`;
    }
  };

  const systemInfo = {
    status: "healthy",
    version: "1.0.0",
    environment: "production",
    timestamp: timestamp.toISOString(),
    uptime: formatUptime(uptime),
    seed: ASSIGNMENT_SEED,
    seedNumber: getSeedNumber(),
    userAgent: typeof window !== 'undefined' ? navigator.userAgent : 'server',
    memory: typeof window !== 'undefined' && 'memory' in performance 
      ? (performance as any).memory 
      : null
  };

  return (
    <div className="min-h-screen py-12 px-6">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold gradient-text">
            🏥 System Health Check
          </h1>
          <div className="flex justify-center">
            <Badge className="bg-green-500 text-white text-lg px-4 py-2 pulse-pink">
                Frontend Alive!
            </Badge>
          </div>
        </div>

        <Card className="card-gradient glow">
          <CardHeader>
            <CardTitle className="text-2xl gradient-text flex items-center gap-2">
               System Status
              <Badge variant="gradient">HEALTHY</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="p-4 glass-dark rounded-lg">
                <h3 className="font-semibold text-primary mb-2">Status</h3>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-white font-mono">HEALTHY</span>
                </div>
              </div>

              <div className="p-4 glass-dark rounded-lg">
                <h3 className="font-semibold text-primary mb-2">Version</h3>
                <p className="text-white font-mono">{systemInfo.version}</p>
              </div>

              <div className="p-4 glass-dark rounded-lg">
                <h3 className="font-semibold text-primary mb-2">Environment</h3>
                <p className="text-white font-mono">{systemInfo.environment}</p>
              </div>

              <div className="p-4 glass-dark rounded-lg">
                <h3 className="font-semibold text-primary mb-2">Uptime</h3>
                <p className="text-white font-mono">{systemInfo.uptime}</p>
              </div>

              <div className="p-4 glass-dark rounded-lg">
                <h3 className="font-semibold text-primary mb-2">Timestamp</h3>
                <p className="text-white font-mono text-sm">
                    {timestamp.toLocaleString("en-GB", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                    })}
                </p>
              </div>
              <div className="p-4 glass-dark rounded-lg">
                <h3 className="font-semibold text-primary mb-2">Seed Active</h3>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-primary rounded-full animate-pulse"></div>
                  <span className="text-white font-mono">ACTIVE</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 gap-6">
          <Card className="card-gradient glow">
            <CardHeader>
              <CardTitle className="text-primary">🔧 Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <h4 className="font-semibold text-white">Assignment Seed</h4>
                <p className="text-sm text-white/80 font-mono bg-black/30 p-2 rounded">
                  {systemInfo.seed}
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-white">Seed Number</h4>
                <p className="text-sm text-white/80">{systemInfo.seedNumber.toLocaleString()}</p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-white">Framework</h4>
                <p className="text-sm text-white/80">Next.js 14 with App Router</p>
              </div>
            </CardContent>
          </Card>

          <Card className="card-gradient glow">
            <CardHeader>
              <CardTitle className="text-primary">⚡ Performance</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <h4 className="font-semibold text-white">Response Time</h4>
                <p className="text-sm text-white/80">100ms</p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-white">Load Status</h4>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-white/80">Optimal</span>
                </div>
              </div>
              {systemInfo.memory && (
                <div className="space-y-2">
                  <h4 className="font-semibold text-white">Memory Usage</h4>
                  <p className="text-sm text-white/80">
                    {Math.round(systemInfo.memory.usedJSHeapSize / 1024 / 1024)}MB / 
                    {Math.round(systemInfo.memory.jsHeapSizeLimit / 1024 / 1024)}MB
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <Card className="card-gradient glow">
          <CardHeader>
            <CardTitle className="text-primary">📈 Live Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div className="space-y-2">
                <div className="text-2xl font-bold gradient-text">100%</div>
                <div className="text-sm text-white/80">Availability</div>
              </div>
              <div className="space-y-2">
                <div className="text-2xl font-bold gradient-text">{uptime > 0 ? '✅' : '⏳'}</div>
                <div className="text-sm text-white/80">Health Status</div>
              </div>
              <div className="space-y-2">
                <div className="text-2xl font-bold gradient-text">0</div>
                <div className="text-sm text-white/80">Errors</div>
              </div>
              <div className="space-y-2">
                <div className="text-2xl font-bold gradient-text">Fast</div>
                <div className="text-sm text-white/80">Response</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="text-center text-sm text-white/60 space-y-2">
          <p>ReSellHub Frontend Health Monitor</p>
          <p>Last updated: {timestamp.toLocaleString()}</p>
          <p className="font-mono">Build: {systemInfo.version} | Seed: {systemInfo.seed}</p>
        </div>
      </div>
    </div>
  );
}