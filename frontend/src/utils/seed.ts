export const ASSIGNMENT_SEED = "FRONT25-018";

export function hashSeed(seed: string): number {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    const char = seed.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; 
  }
  return Math.abs(hash);
}

export function getSeedNumber(): number {
  return hashSeed(ASSIGNMENT_SEED) % 1000000;
}

export function generateColorFromSeed(seed: string): {
  primary: string;
  secondary: string;
  accent: string;
  gradient: string;
} {
  const hash = hashSeed(seed);
  const browns = ['#8B4513', '#A0522D', '#CD853F', '#D2691E', '#B8860B'];
  const ambers = ['#FF8C00', '#FFA500', '#DAA520', '#F4A460', '#DEB887'];
  
  const primaryIndex = hash % browns.length;
  const secondaryIndex = (hash + 1) % ambers.length;
  const accentIndex = (hash + 2) % browns.length;
  
  const primary = browns[primaryIndex];
  const secondary = ambers[secondaryIndex];
  const accent = browns[accentIndex];
  const gradient = `linear-gradient(135deg, ${primary} 0%, ${secondary} 50%, ${accent} 100%)`;
  
  return { primary, secondary, accent, gradient };
}

export function calculatePlatformFee(subtotal: number): number {
  const seedNum = getSeedNumber();
  const feePercentage = (seedNum % 10) / 100; 
  return Math.round(subtotal * feePercentage * 100) / 100; 
}

export function generateProductIdWithChecksum(productId: number): string {
  const seedNum = getSeedNumber();
  const checksum = (productId + seedNum) % 10;
  return `${productId}-${checksum}`;
}

export function extractOriginalProductId(idWithChecksum: string): number {
  const parts = idWithChecksum.split('-');
  return parseInt(parts[0]) || 0;
}

export interface UserAction {
  id: string;
  type: 'click' | 'search' | 'view' | 'cart' | 'like' | 'navigate';
  description: string;
  timestamp: Date;
  details?: Record<string, any>;
}

class ActionLogger {
  private static instance: ActionLogger;
  private actions: UserAction[] = [];
  private readonly MAX_ACTIONS = 20;

  private constructor() {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('user_actions');
      if (stored) {
        try {
          this.actions = JSON.parse(stored).map((action: any) => ({
            ...action,
            timestamp: new Date(action.timestamp)
          }));
        } catch (e) {
          console.warn('Failed to load stored actions');
        }
      }
    }
  }

  static getInstance(): ActionLogger {
    if (!ActionLogger.instance) {
      ActionLogger.instance = new ActionLogger();
    }
    return ActionLogger.instance;
  }

  logAction(type: UserAction['type'], description: string, details?: Record<string, any>) {
    const action: UserAction = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      type,
      description,
      timestamp: new Date(),
      details
    };

    this.actions.unshift(action);
    
    if (this.actions.length > this.MAX_ACTIONS) {
      this.actions = this.actions.slice(0, this.MAX_ACTIONS);
    }

    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('user_actions', JSON.stringify(this.actions));
      } catch (e) {
        console.warn('Failed to save actions to localStorage');
      }
    }
  }

  getRecentActions(): UserAction[] {
    return [...this.actions];
  }

  clearActions() {
    this.actions = [];
    if (typeof window !== 'undefined') {
      localStorage.removeItem('user_actions');
    }
  }
}

export const actionLogger = ActionLogger.getInstance();

export function useActionLogger() {
  const logAction = (type: UserAction['type'], description: string, details?: Record<string, any>) => {
    actionLogger.logAction(type, description, details);
  };

  return {
    logAction,
    getRecentActions: () => actionLogger.getRecentActions(),
    clearActions: () => actionLogger.clearActions()
  };
}