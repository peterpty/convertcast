"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  PlayCircle,
  Calendar,
  Users,
  DollarSign,
  Video,
  Clock,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

export interface Event {
  id: string | number;
  title: string;
  description?: string;
  date: string;
  time: string;
  attendees: number;
  status: "live" | "scheduled" | "completed" | "cancelled";
  revenue?: string;
  thumbnail?: string;
  duration?: string;
  type?: "webinar" | "meeting" | "workshop" | "demo";
}

interface EventCardProps {
  event: Event;
  className?: string;
  animate?: boolean;
  delay?: number;
  showActions?: boolean;
  compact?: boolean;
  onView?: (event: Event) => void;
  onEdit?: (event: Event) => void;
  onDelete?: (event: Event) => void;
  onClick?: (event: Event) => void;
}

export function EventCard({
  event,
  className,
  animate = true,
  delay = 0,
  showActions = true,
  compact = false,
  onView,
  onEdit,
  onDelete,
  onClick
}: EventCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "live": return "bg-red-500 animate-pulse text-white";
      case "scheduled": return "bg-blue-500 text-white";
      case "completed": return "bg-green-500 text-white";
      case "cancelled": return "bg-slate-500 text-white";
      default: return "bg-slate-600 text-white";
    }
  };

  const getTypeIcon = (type?: string) => {
    switch (type) {
      case "webinar": return PlayCircle;
      case "meeting": return Video;
      case "workshop": return Users;
      case "demo": return Eye;
      default: return PlayCircle;
    }
  };

  const TypeIcon = getTypeIcon(event.type);

  const CardWrapper = animate ? motion.div : "div";
  const cardProps = animate ? {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.4, delay }
  } : {};

  const handleCardClick = () => {
    if (onClick) {
      onClick(event);
    }
  };

  return (
    <CardWrapper {...cardProps}>
      <Card
        className={cn(
          "bg-slate-700/30 border-slate-600/30 hover:bg-slate-700/50 transition-all duration-200",
          onClick && "cursor-pointer hover:scale-[1.02]",
          className
        )}
        onClick={handleCardClick}
      >
        <CardContent className={cn("p-4", compact && "p-3")}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 flex-1 min-w-0">
              <div className={cn(
                "p-2 bg-slate-600/50 rounded-lg flex-shrink-0",
                compact && "p-1.5"
              )}>
                <TypeIcon className={cn(
                  "w-5 h-5 text-blue-400",
                  compact && "w-4 h-4"
                )} />
              </div>

              <div className="flex-1 min-w-0">
                <h3 className={cn(
                  "font-medium text-white truncate",
                  compact && "text-sm"
                )}>
                  {event.title}
                </h3>
                <div className={cn(
                  "flex items-center space-x-4 text-white/60",
                  compact ? "text-xs mt-0.5" : "text-sm mt-1"
                )}>
                  <div className="flex items-center space-x-1">
                    <Calendar className={cn("w-3 h-3", compact && "w-2.5 h-2.5")} />
                    <span>{event.date}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className={cn("w-3 h-3", compact && "w-2.5 h-2.5")} />
                    <span>{event.time}</span>
                  </div>
                  {event.duration && (
                    <span className="text-slate-400">
                      • {event.duration}
                    </span>
                  )}
                </div>
                {!compact && event.description && (
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                    {event.description}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-3 flex-shrink-0 ml-3">
              {!compact && (
                <div className="text-right">
                  <div className="flex items-center space-x-1 text-sm font-medium text-white">
                    <Users className="w-3 h-3" />
                    <span>{event.attendees}</span>
                  </div>
                  {event.revenue && (
                    <div className="flex items-center space-x-1 text-xs text-green-400 mt-1">
                      <DollarSign className="w-3 h-3" />
                      <span>{event.revenue}</span>
                    </div>
                  )}
                </div>
              )}

              <div className="flex items-center space-x-2">
                <Badge className={cn(
                  getStatusColor(event.status),
                  compact && "text-xs px-2 py-0.5"
                )}>
                  {event.status === "live" && <Video className="w-3 h-3 mr-1" />}
                  {event.status}
                </Badge>

                {showActions && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-slate-400 hover:text-white"
                      >
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-slate-800 border-slate-700">
                      {onView && (
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation();
                            onView(event);
                          }}
                          className="text-white hover:bg-slate-700"
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                      )}
                      {onEdit && (
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation();
                            onEdit(event);
                          }}
                          className="text-white hover:bg-slate-700"
                        >
                          <Edit className="w-4 h-4 mr-2" />
                          Edit Event
                        </DropdownMenuItem>
                      )}
                      {onDelete && (
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation();
                            onDelete(event);
                          }}
                          className="text-red-400 hover:bg-red-500/10"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete Event
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </CardWrapper>
  );
}