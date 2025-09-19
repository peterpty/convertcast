"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle,
  AlertCircle,
  Info,
  X,
  Clock,
  Bell,
  ExternalLink
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface Notification {
  id: string;
  type: "success" | "error" | "warning" | "info";
  title: string;
  message: string;
  timestamp?: Date;
  duration?: number; // in milliseconds, 0 for persistent
  actionLabel?: string;
  actionUrl?: string;
  onAction?: () => void;
  onDismiss?: () => void;
}

interface NotificationToastProps {
  notification: Notification;
  onDismiss?: (id: string) => void;
  className?: string;
}

export function NotificationToast({
  notification,
  onDismiss,
  className
}: NotificationToastProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (notification.duration && notification.duration > 0) {
      const timer = setTimeout(() => {
        handleDismiss();
      }, notification.duration);

      return () => clearTimeout(timer);
    }
  }, [notification.duration]);

  const handleDismiss = () => {
    setIsVisible(false);
    setTimeout(() => {
      if (onDismiss) onDismiss(notification.id);
      if (notification.onDismiss) notification.onDismiss();
    }, 300);
  };

  const handleAction = () => {
    if (notification.onAction) {
      notification.onAction();
    }
    if (notification.actionUrl) {
      window.open(notification.actionUrl, "_blank");
    }
  };

  const getIcon = () => {
    switch (notification.type) {
      case "success": return CheckCircle;
      case "error": return AlertCircle;
      case "warning": return AlertCircle;
      case "info": return Info;
      default: return Bell;
    }
  };

  const getColors = () => {
    switch (notification.type) {
      case "success":
        return {
          bg: "bg-green-500/10 border-green-500/20",
          icon: "text-green-400",
          accent: "bg-green-500"
        };
      case "error":
        return {
          bg: "bg-red-500/10 border-red-500/20",
          icon: "text-red-400",
          accent: "bg-red-500"
        };
      case "warning":
        return {
          bg: "bg-yellow-500/10 border-yellow-500/20",
          icon: "text-yellow-400",
          accent: "bg-yellow-500"
        };
      case "info":
        return {
          bg: "bg-blue-500/10 border-blue-500/20",
          icon: "text-blue-400",
          accent: "bg-blue-500"
        };
      default:
        return {
          bg: "bg-slate-500/10 border-slate-500/20",
          icon: "text-slate-400",
          accent: "bg-slate-500"
        };
    }
  };

  const Icon = getIcon();
  const colors = getColors();

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / 60000);

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, x: 300, scale: 0.3 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: 300, scale: 0.5, transition: { duration: 0.2 } }}
          className={cn(
            "relative max-w-sm w-full rounded-lg border backdrop-blur-xl",
            colors.bg,
            className
          )}
        >
          {/* Accent bar */}
          <div className={cn("absolute left-0 top-0 w-1 h-full rounded-l-lg", colors.accent)} />

          <div className="p-4 pl-6">
            <div className="flex items-start space-x-3">
              <Icon className={cn("w-5 h-5 mt-0.5 flex-shrink-0", colors.icon)} />

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-white">
                      {notification.title}
                    </h4>
                    <p className="text-sm text-slate-300 mt-1">
                      {notification.message}
                    </p>
                  </div>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleDismiss}
                    className="h-6 w-6 p-0 text-slate-400 hover:text-white ml-2"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>

                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center space-x-2">
                    {notification.timestamp && (
                      <div className="flex items-center space-x-1 text-xs text-slate-400">
                        <Clock className="w-3 h-3" />
                        <span>{formatTimestamp(notification.timestamp)}</span>
                      </div>
                    )}

                    <Badge variant="secondary" className="text-xs">
                      {notification.type}
                    </Badge>
                  </div>

                  {(notification.actionLabel || notification.actionUrl) && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleAction}
                      className="h-7 text-xs border-slate-600 text-white hover:bg-slate-700"
                    >
                      {notification.actionLabel || "View"}
                      {notification.actionUrl && (
                        <ExternalLink className="w-3 h-3 ml-1" />
                      )}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Toast container component
interface NotificationContainerProps {
  notifications: Notification[];
  onDismiss: (id: string) => void;
  position?: "top-right" | "top-left" | "bottom-right" | "bottom-left";
  className?: string;
}

export function NotificationContainer({
  notifications,
  onDismiss,
  position = "top-right",
  className
}: NotificationContainerProps) {
  const getPositionClasses = () => {
    switch (position) {
      case "top-right": return "top-4 right-4";
      case "top-left": return "top-4 left-4";
      case "bottom-right": return "bottom-4 right-4";
      case "bottom-left": return "bottom-4 left-4";
      default: return "top-4 right-4";
    }
  };

  return (
    <div className={cn(
      "fixed z-50 pointer-events-none",
      getPositionClasses(),
      className
    )}>
      <div className="space-y-2 pointer-events-auto">
        {notifications.map((notification) => (
          <NotificationToast
            key={notification.id}
            notification={notification}
            onDismiss={onDismiss}
          />
        ))}
      </div>
    </div>
  );
}