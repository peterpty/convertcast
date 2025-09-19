import { ReactNode } from 'react';
import { Button } from './button';
import { Badge } from './badge';

interface PageHeaderProps {
  title: string;
  description?: string;
  icon?: ReactNode;
  iconBg?: string;
  actions?: ReactNode;
  badge?: {
    text: string;
    variant?: 'default' | 'secondary' | 'destructive' | 'outline';
  };
  gradient?: boolean;
}

export function PageHeader({
  title,
  description,
  icon,
  iconBg = 'bg-purple-100',
  actions,
  badge,
  gradient = false
}: PageHeaderProps) {
  return (
    <div className={`mb-8 ${gradient ? 'bg-gradient-to-r from-purple-50 via-blue-50 to-indigo-50 -mx-6 -mt-6 px-6 pt-6 pb-8' : ''}`}>
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center gap-4 mb-2">
            {icon && (
              <div className={`p-3 rounded-xl ${iconBg}`}>
                {icon}
              </div>
            )}
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  {title}
                </h1>
                {badge && (
                  <Badge variant={badge.variant || 'default'} className="text-xs">
                    {badge.text}
                  </Badge>
                )}
              </div>
              {description && (
                <p className="text-gray-600 mt-2 text-lg">{description}</p>
              )}
            </div>
          </div>
        </div>
        {actions && (
          <div className="flex items-center gap-3">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
}