"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useActionLogger, UserAction } from "@/utils/seed";
import { Trash2, RefreshCw, Activity, Search, Eye, ShoppingCart, Heart, Navigation } from "lucide-react";

const getActionIcon = (type: UserAction['type']) => {
  switch (type) {
    case 'click': return <Activity className="w-4 h-4" />;
    case 'search': return <Search className="w-4 h-4" />;
    case 'view': return <Eye className="w-4 h-4" />;
    case 'cart': return <ShoppingCart className="w-4 h-4" />;
    case 'like': return <Heart className="w-4 h-4" />;
    case 'navigate': return <Navigation className="w-4 h-4" />;
    default: return <Activity className="w-4 h-4" />;
  }
};

const getActionColor = (type: UserAction['type']) => {
  switch (type) {
    case 'click': return 'bg-blue-500/20 text-blue-400';
    case 'search': return 'bg-green-500/20 text-green-400';
    case 'view': return 'bg-purple-500/20 text-purple-400';
    case 'cart': return 'bg-orange-500/20 text-orange-400';
    case 'like': return 'bg-red-500/20 text-red-400';
    case 'navigate': return 'bg-yellow-500/20 text-yellow-400';
    default: return 'bg-gray-500/20 text-gray-400';
  }
};

const actionTypes: UserAction['type'][] = ['click', 'search', 'view', 'cart', 'like', 'navigate'];

export default function LogsRecentPage() {
  const { getRecentActions, clearActions, logAction } = useActionLogger();
  const [actions, setActions] = useState<UserAction[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setActions(getRecentActions());
    logAction('navigate', 'Visited Recent Logs page');
  }, []);  


  const handleClearLogs = () => {
    clearActions();
    setActions([]);
    logAction('click', 'Cleared all logs');
    setTimeout(() => setActions(getRecentActions()), 100);
  };

  const handleRefresh = () => {
    setActions(getRecentActions());
    logAction('click', 'Refreshed logs view');
    setTimeout(() => setActions(getRecentActions()), 100);
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
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold gradient-text float">
            Recent Activity Logs
          </h1>
          <p className="text-xl text-white/80">
            Tracks the last 20 user interactions and system events
          </p>
        </div>

        <div className="flex flex-wrap gap-4 justify-between items-center">
          <div className="flex items-center gap-4">
            <Badge className="bg-primary text-white pulse-pink">
              {actions.length} Total Actions
            </Badge>
            <Badge className="bg-green-500/20 text-green-400">
              Real-time Tracking
            </Badge>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={handleRefresh}
              className="btn-gradient"
              size="sm"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
            <Button
              onClick={handleClearLogs}
              variant="destructive"
              size="sm"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Clear Logs
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {actionTypes.map(type => {
                const count = actions.filter(action => action.type === type).length;
                return (
                <Card key={type} className="card-gradient glow">
                    <CardContent className="p-4 text-center">
                    <div className="flex items-center justify-center gap-2 mb-2">
                        <div className={`p-2 rounded-full ${getActionColor(type)}`}>
                        {getActionIcon(type)}
                        </div>
                    </div>
                    <div className="text-2xl font-bold gradient-text">{count}</div>
                    <div className="text-sm text-white/70 capitalize">{type}s</div>
                    </CardContent>
                </Card>
                );
            })}
        </div>


        <Card className="card-gradient glow">
          <CardHeader>
            <CardTitle className="text-2xl gradient-text flex items-center gap-2">
               Activity Timeline
              <Badge variant="gradient">Live</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {actions.length === 0 ? (
              <div className="text-center py-12 space-y-4">
                <div className="text-6xl">📝</div>
                <h3 className="text-xl font-semibold text-white">No Actions Recorded</h3>
                <p className="text-white/70">
                  Start interacting with the platform to see your activity logs here.
                </p>
              </div>
            ) : (
              <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
                {actions.map((action, index) => (
                  <div
                    key={action.id}
                    className="flex items-start gap-4 p-4 glass-dark rounded-lg hover:bg-white/5 transition-all"
                  >
                    <div className="flex-shrink-0">
                      <div className={`p-2 rounded-full ${getActionColor(action.type)}`}>
                        {getActionIcon(action.type)}
                      </div>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge className={getActionColor(action.type)}>
                              {action.type.toUpperCase()}
                            </Badge>
                            <span className="text-xs text-white/50">#{index + 1}</span>
                          </div>
                          <p className="text-white font-medium">{action.description}</p>
                          {action.details && Object.keys(action.details).length > 0 && (
                            <div className="mt-2 p-2 bg-black/20 rounded text-xs">
                              <pre className="text-white/70 whitespace-pre-wrap">
                                {JSON.stringify(action.details, null, 2)}
                              </pre>
                            </div>
                          )}
                        </div>
                        
                        <div className="text-right flex-shrink-0">
                          <div className="text-sm text-white/70">
                            {action.timestamp.toLocaleTimeString()}
                          </div>
                          <div className="text-xs text-white/50">
                            {action.timestamp.toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {actions.length > 0 && (
          <Card className="card-gradient glow">
            <CardHeader>
              <CardTitle className="text-primary">📈 Session Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center space-y-2">
                  <div className="text-2xl font-bold gradient-text">
                    {actions.length > 0 ? Math.round((Date.now() - new Date(actions[actions.length - 1].timestamp).getTime()) / 60000) : 0}
                  </div>
                  <div className="text-sm text-white/70">Minutes Active</div>
                </div>
                
                <div className="text-center space-y-2">
                  <div className="text-2xl font-bold gradient-text">
                    {new Set(actions.map(a => a.type)).size}
                  </div>
                  <div className="text-sm text-white/70">Action Types</div>
                </div>
                
                <div className="text-center space-y-2">
                  <div className="text-2xl font-bold gradient-text">
                    {actions.length > 1 ? Math.round((new Date(actions[0].timestamp).getTime() - new Date(actions[actions.length - 1].timestamp).getTime()) / 1000) : 0}s
                  </div>
                  <div className="text-sm text-white/70">Session Duration</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}