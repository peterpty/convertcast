"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  icon: LucideIcon;
  gradient?: string;
  trend?: "up" | "down" | "stable";
  className?: string;
  onClick?: () => void;
  animate?: boolean;
  delay?: number;
}

export function StatsCard({
  title,
  value,
  change,
  changeType = "positive",
  icon: Icon,
  gradient = "from-purple-500 to-blue-500",
  trend,
  className,
  onClick,
  animate = true,
  delay = 0
}: StatsCardProps) {
  const changeColor = {
    positive: "text-green-400",
    negative: "text-red-400",
    neutral: "text-slate-400"
  };

  const CardWrapper = animate ? motion.div : "div";
  const cardProps = animate ? {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, delay }
  } : {};

  return (
    <CardWrapper {...cardProps}>
      <Card
        className={cn(
          "bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-all duration-300 group overflow-hidden",
          onClick && "cursor-pointer hover:scale-105",
          className
        )}
        onClick={onClick}
      >
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <p className="text-sm font-medium text-slate-400">{title}</p>
              <p className="text-2xl font-bold text-white">{value}</p>
              {change && (
                <div className="flex items-center space-x-2">
                  <Badge
                    variant="secondary"
                    className={cn(
                      "text-xs px-2 py-0.5",
                      changeColor[changeType]
                    )}
                  >
                    {change}
                  </Badge>
                  {trend && (
                    <span className="text-xs text-slate-500">
                      from last month
                    </span>
                  )}
                </div>
              )}
            </div>
            <div className={cn(
              "p-3 rounded-lg bg-gradient-to-r",
              gradient,
              "group-hover:scale-110 transition-transform duration-300"
            )}>
              <Icon className="h-6 w-6 text-white" />
            </div>
          </div>
        </CardContent>
      </Card>
    </CardWrapper>
  );
}