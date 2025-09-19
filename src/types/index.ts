// User Types
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  role: UserRole;
  timezone: string;
  emailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export type UserRole = 'streamer' | 'viewer' | 'admin';

// Authentication Types
export interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

export interface SignInData {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface SignUpData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  agreeToTerms: boolean;
}

// Event Types
export interface Event {
  id: string;
  title: string;
  description: string;
  streamerId: string;
  streamer: User;
  scheduledAt: string;
  duration: number; // in minutes
  timezone: string;
  status: EventStatus;
  maxAttendees?: number;
  registrationRequired: boolean;
  registrationFields: RegistrationField[];
  landingPageConfig: LandingPageConfig;
  streamConfig: StreamConfig;
  createdAt: string;
  updatedAt: string;
  _count: {
    participants: number;
    messages: number;
  };
}

export type EventStatus = 'draft' | 'scheduled' | 'live' | 'ended' | 'cancelled';

export interface RegistrationField {
  id: string;
  type: 'text' | 'email' | 'phone' | 'select' | 'textarea';
  label: string;
  placeholder?: string;
  required: boolean;
  options?: string[]; // for select type
  order: number;
}

export interface LandingPageConfig {
  theme: 'default' | 'modern' | 'minimal';
  primaryColor: string;
  backgroundImage?: string;
  showCountdown: boolean;
  showSpeakerInfo: boolean;
  customCss?: string;
}

// Stream Types
export interface StreamConfig {
  muxStreamId?: string;
  muxPlaybackId?: string;
  recordingEnabled: boolean;
  chatEnabled: boolean;
  reactionsEnabled: boolean;
  overlaysEnabled: boolean;
  qualitySettings: QualitySettings;
}

export interface QualitySettings {
  resolution: '720p' | '1080p' | '4K';
  bitrate: number;
  fps: 30 | 60;
  encodingTier: 'baseline' | 'smart';
}

// Participant Types
export interface Participant {
  id: string;
  eventId: string;
  userId?: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  company?: string;
  registrationData: Record<string, any>;
  joinedAt?: string;
  leftAt?: string;
  isActive: boolean;
  watchTime: number; // in seconds
  createdAt: string;
}

// Message Types
export interface Message {
  id: string;
  eventId: string;
  participantId?: string;
  senderId?: string;
  senderName: string;
  senderAvatar?: string;
  content: string;
  type: MessageType;
  isModerated: boolean;
  isPinned: boolean;
  timestamp: string;
  reactions: MessageReaction[];
}

export type MessageType = 'chat' | 'system' | 'announcement';

export interface MessageReaction {
  emoji: string;
  count: number;
  userIds: string[];
}

// Overlay Types
export interface OverlayElement {
  id: string;
  eventId: string;
  type: OverlayType;
  position: OverlayPosition;
  config: OverlayConfig;
  isActive: boolean;
  startTime?: string;
  endTime?: string;
  duration?: number; // in seconds
  createdAt: string;
}

export type OverlayType =
  | 'alert'
  | 'countdown'
  | 'progress'
  | 'gif_sound'
  | 'persistent_message'
  | 'marquee';

export type OverlayPosition =
  | 'top-left'
  | 'top-center'
  | 'top-right'
  | 'middle-left'
  | 'middle-center'
  | 'middle-right'
  | 'bottom-left'
  | 'bottom-center'
  | 'bottom-right';

export interface OverlayConfig {
  // Alert specific
  alertType?: 'success' | 'donation' | 'follow' | 'subscribe' | 'custom';
  message?: string;

  // Progress specific
  title?: string;
  current?: number;
  target?: number;
  color?: string;
  size?: 'S' | 'M' | 'L' | 'XL';

  // GIF + Sound specific
  gifUrl?: string;
  soundUrl?: string;
  participantName?: string;
  location?: string;

  // Countdown specific
  targetDate?: string;

  // Persistent message specific
  opacity?: number;
  pulseInterval?: number;

  // Marquee specific
  scrollSpeed?: number;
  spacing?: number;

  // Common styling
  fontSize?: number;
  fontWeight?: 'normal' | 'bold';
  textColor?: string;
  backgroundColor?: string;
  borderRadius?: number;
}

// Payment Types
export interface Transaction {
  id: string;
  eventId: string;
  participantId: string;
  amount: number;
  currency: string;
  status: TransactionStatus;
  paymentMethod: PaymentMethod;
  paymentIntentId?: string;
  description: string;
  metadata: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export type TransactionStatus = 'pending' | 'succeeded' | 'failed' | 'cancelled' | 'refunded';
export type PaymentMethod = 'stripe' | 'paypal';

// Analytics Types
export interface Analytics {
  eventId: string;
  totalViews: number;
  uniqueViewers: number;
  peakConcurrentViewers: number;
  averageWatchTime: number;
  totalWatchTime: number;
  chatMessages: number;
  conversionRate: number;
  revenue: number;
  engagementRate: number;
  dropOffPoints: DropOffPoint[];
  viewerGeography: GeographyData[];
  deviceBreakdown: DeviceData[];
  trafficSources: TrafficSource[];
}

export interface DropOffPoint {
  timestamp: number;
  viewerCount: number;
  dropOffRate: number;
}

export interface GeographyData {
  country: string;
  viewers: number;
  percentage: number;
}

export interface DeviceData {
  device: 'desktop' | 'mobile' | 'tablet';
  count: number;
  percentage: number;
}

export interface TrafficSource {
  source: string;
  visitors: number;
  conversions: number;
  conversionRate: number;
}

// WebSocket Types
export interface WebSocketMessage {
  type: WebSocketMessageType;
  eventId: string;
  data: any;
  timestamp: string;
}

export type WebSocketMessageType =
  | 'chat_message'
  | 'user_joined'
  | 'user_left'
  | 'stream_started'
  | 'stream_ended'
  | 'overlay_update'
  | 'moderation_action'
  | 'system_announcement';

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T = any> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

// Form Types
export interface FormError {
  field: string;
  message: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: FormError[];
}

// Notification Types
export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  data?: Record<string, any>;
}

export type NotificationType = 'info' | 'success' | 'warning' | 'error' | 'event';