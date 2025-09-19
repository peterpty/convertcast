"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface QuickActionProps {
  title: string;
  description?: string;
  href: string;
  icon: LucideIcon;
  iconColor?: string;
  badge?: string;
  badgeVariant?: "default" | "secondary" | "destructive" | "outline";
  className?: string;
  disabled?: boolean;
  external?: boolean;
  animate?: boolean;
  delay?: number;
  onClick?: () => void;
}

export function QuickAction({
  title,
  description,
  href,
  icon: Icon,
  iconColor = "text-purple-400",
  badge,
  badgeVariant = "secondary",
  className,
  disabled = false,
  external = false,
  animate = true,
  delay = 0,
  onClick
}: QuickActionProps) {
  const ActionWrapper = animate ? motion.div : "div";
  const actionProps = animate ? {
    initial: { opacity: 0, x: -10 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.4, delay }
  } : {};

  const handleClick = () => {
    if (onClick) {
      onClick();
    }
  };

  const buttonContent = (
    <Button
      variant="outline"
      disabled={disabled}
      onClick={handleClick}
      className={cn(
        "w-full justify-start bg-slate-700/30 border-slate-600/50 text-white hover:bg-slate-700/50 hover:border-slate-500/50 transition-all duration-200 h-auto p-4",
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
    >
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center space-x-3">
          <Icon className={cn("w-5 h-5", iconColor)} />
          <div className="text-left">
            <div className="font-medium">{title}</div>
            {description && (
              <div className="text-xs text-slate-400 mt-1">{description}</div>
            )}
          </div>
        </div>
        {badge && (
          <Badge variant={badgeVariant} className="text-xs">
            {badge}
          </Badge>
        )}
      </div>
    </Button>
  );

  return (
    <ActionWrapper {...actionProps}>
      {external ? (
        <a href={href} target="_blank" rel="noopener noreferrer" className="block">
          {buttonContent}
        </a>
      ) : (
        <Link href={href} className="block">
          {buttonContent}
        </Link>
      )}
    </ActionWrapper>
  );
}