import { ReactNode } from 'react';
import { Card } from './card';
import { Badge } from './badge';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: {
    value: string;
    trend: 'up' | 'down' | 'neutral';
    period?: string;
  };
  icon: ReactNode;
  iconColor?: string;
  description?: string;
  loading?: boolean;
}

function StatCard({
  title,
  value,
  change,
  icon,
  iconColor = 'text-purple-600',
  description,
  loading = false
}: StatCardProps) {
  if (loading) {
    return (
      <Card className="p-6">
        <div className="animate-pulse">
          <div className="flex items-center">
            <div className="p-3 bg-gray-200 rounded-xl w-12 h-12"></div>
            <div className="ml-4 flex-1">
              <div className="h-4 bg-gray-200 rounded w-20 mb-2"></div>
              <div className="h-8 bg-gray-200 rounded w-16"></div>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  const getTrendIcon = (trend: 'up' | 'down' | 'neutral') => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-3 h-3" />;
      case 'down':
        return <TrendingDown className="w-3 h-3" />;
      default:
        return <Minus className="w-3 h-3" />;
    }
  };

  const getTrendColor = (trend: 'up' | 'down' | 'neutral') => {
    switch (trend) {
      case 'up':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'down':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  return (
    <Card className="p-6 hover:shadow-lg transition-shadow duration-200 border-0 bg-gradient-to-br from-white to-gray-50/50">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className={`p-3 rounded-xl bg-gradient-to-br from-purple-50 to-blue-50`}>
            <div className={iconColor}>
              {icon}
            </div>
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-3xl font-bold text-gray-900 mt-1">
              {typeof value === 'number' ? value.toLocaleString() : value}
            </p>
            {description && (
              <p className="text-xs text-gray-500 mt-1">{description}</p>
            )}
          </div>
        </div>
        {change && (
          <div className="text-right">
            <Badge
              className={`text-xs font-medium ${getTrendColor(change.trend)} flex items-center gap-1`}
            >
              {getTrendIcon(change.trend)}
              {change.value}
            </Badge>
            {change.period && (
              <p className="text-xs text-gray-500 mt-1">{change.period}</p>
            )}
          </div>
        )}
      </div>
    </Card>
  );
}

interface StatsGridProps {
  stats: StatCardProps[];
  columns?: 2 | 3 | 4;
  loading?: boolean;
}

export function StatsGrid({ stats, columns = 4, loading = false }: StatsGridProps) {
  const gridCols = {
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
  };

  if (loading) {
    return (
      <div className={`grid ${gridCols[columns]} gap-6`}>
        {[...Array(columns)].map((_, index) => (
          <StatCard
            key={index}
            title=""
            value=""
            icon={<div className="w-6 h-6" />}
            loading={true}
          />
        ))}
      </div>
    );
  }

  return (
    <div className={`grid ${gridCols[columns]} gap-6`}>
      {stats.map((stat, index) => (
        <StatCard key={index} {...stat} />
      ))}
    </div>
  );
}

export { StatCard };