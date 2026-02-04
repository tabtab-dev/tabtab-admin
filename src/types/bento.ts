export type BentoCardSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';

export type BentoCardVariant = 'default' | 'gradient' | 'outline' | 'glass';

export type BentoGridColumns = 1 | 2 | 3 | 4 | 6;

export interface BentoCardProps {
  size?: BentoCardSize;
  variant?: BentoCardVariant;
  colSpan?: number;
  rowSpan?: number;
  title?: string;
  description?: string;
  icon?: any;
  value?: string | number;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  action?: {
    label: string;
    onClick: () => void;
  };
}

export interface BentoGridProps {
  columns?: BentoGridColumns;
  gap?: 'sm' | 'md' | 'lg';
  className?: string;
}

export interface MetricCardData {
  title: string;
  value: string | number;
  change?: number;
  icon?: any;
  description?: string;
}

export interface ChartCardData {
  title: string;
  type: 'line' | 'bar' | 'area';
  data: any[];
  description?: string;
}

export interface ActivityItem {
  id: string;
  type: 'success' | 'warning' | 'error' | 'info';
  title: string;
  description?: string;
  time: string;
}

export interface QuickAction {
  id: string;
  label: string;
  icon?: any;
  onClick: () => void;
  variant?: 'default' | 'primary' | 'danger';
}

export interface DashboardConfig {
  heroCard?: BentoCardProps;
  featureCards?: BentoCardProps[];
  supportingCards?: BentoCardProps[];
}
