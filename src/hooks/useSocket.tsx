'use client';

import { createContext, useContext, useEffect, useState, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from './useAuth';
import { WebSocketMessage, Message, OverlayElement } from '@/types';

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  joinEventRoom: (eventId: string) => void;
  leaveEventRoom: (eventId: string) => void;
  sendMessage: (eventId: string, content: string) => void;
  sendSystemMessage: (eventId: string, content: string) => void;
  updateOverlay: (eventId: string, overlay: OverlayElement) => void;
  removeOverlay: (eventId: string, overlayId: string) => void;
  onMessage: (callback: (message: Message) => void) => () => void;
  onUserJoined: (callback: (data: { eventId: string; participantId: string; name: string }) => void) => () => void;
  onUserLeft: (callback: (data: { eventId: string; participantId: string; name: string }) => void) => () => void;
  onStreamStatusChange: (callback: (data: { eventId: string; status: 'started' | 'ended' }) => void) => () => void;
  onOverlayUpdate: (callback: (overlay: OverlayElement) => void) => () => void;
  onModerationAction: (callback: (data: { eventId: string; messageId: string; action: string }) => void) => () => void;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export function SocketProvider({ children }: { children: React.ReactNode }) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const { user } = useAuth();
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 5;

  useEffect(() => {
    if (!user) {
      if (socket) {
        socket.disconnect();
        setSocket(null);
        setIsConnected(false);
      }
      return;
    }

    const socketInstance = io(process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001', {
      auth: {
        userId: user.id,
        userEmail: user.email,
        userName: `${user.firstName} ${user.lastName}`,
      },
      transports: ['websocket', 'polling'],
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: maxReconnectAttempts,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      timeout: 20000,
    });

    socketInstance.on('connect', () => {
      console.log('Socket connected:', socketInstance.id);
      setIsConnected(true);
      reconnectAttempts.current = 0;
    });

    socketInstance.on('disconnect', (reason) => {
      console.log('Socket disconnected:', reason);
      setIsConnected(false);
    });

    socketInstance.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
      reconnectAttempts.current += 1;

      if (reconnectAttempts.current >= maxReconnectAttempts) {
        console.error('Max reconnection attempts reached');
      }
    });

    socketInstance.on('reconnect', (attemptNumber) => {
      console.log('Socket reconnected after', attemptNumber, 'attempts');
      reconnectAttempts.current = 0;
    });

    socketInstance.on('reconnect_failed', () => {
      console.error('Socket reconnection failed');
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
      setSocket(null);
      setIsConnected(false);
    };
  }, [user]);

  const joinEventRoom = (eventId: string) => {
    if (!socket || !isConnected) {
      console.warn('Socket not connected, cannot join event room');
      return;
    }

    socket.emit('join_event', { eventId }, (response: any) => {
      if (response.success) {
        console.log('Joined event room:', eventId);
      } else {
        console.error('Failed to join event room:', response.error);
      }
    });
  };

  const leaveEventRoom = (eventId: string) => {
    if (!socket || !isConnected) return;

    socket.emit('leave_event', { eventId }, (response: any) => {
      if (response.success) {
        console.log('Left event room:', eventId);
      } else {
        console.error('Failed to leave event room:', response.error);
      }
    });
  };

  const sendMessage = (eventId: string, content: string) => {
    if (!socket || !isConnected || !user) {
      console.warn('Cannot send message: socket not connected or user not authenticated');
      return;
    }

    socket.emit('send_message', {
      eventId,
      content,
      senderName: `${user.firstName} ${user.lastName}`,
      senderAvatar: user.avatar,
      type: 'chat',
    }, (response: any) => {
      if (!response.success) {
        console.error('Failed to send message:', response.error);
      }
    });
  };

  const sendSystemMessage = (eventId: string, content: string) => {
    if (!socket || !isConnected) return;

    socket.emit('send_message', {
      eventId,
      content,
      senderName: 'System',
      type: 'system',
    }, (response: any) => {
      if (!response.success) {
        console.error('Failed to send system message:', response.error);
      }
    });
  };

  const updateOverlay = (eventId: string, overlay: OverlayElement) => {
    if (!socket || !isConnected) return;

    socket.emit('update_overlay', {
      eventId,
      overlay,
    }, (response: any) => {
      if (!response.success) {
        console.error('Failed to update overlay:', response.error);
      }
    });
  };

  const removeOverlay = (eventId: string, overlayId: string) => {
    if (!socket || !isConnected) return;

    socket.emit('remove_overlay', {
      eventId,
      overlayId,
    }, (response: any) => {
      if (!response.success) {
        console.error('Failed to remove overlay:', response.error);
      }
    });
  };

  const onMessage = (callback: (message: Message) => void) => {
    if (!socket) return () => {};

    const handler = (data: WebSocketMessage) => {
      if (data.type === 'chat_message') {
        callback(data.data);
      }
    };

    socket.on('message', handler);
    return () => socket.off('message', handler);
  };

  const onUserJoined = (callback: (data: { eventId: string; participantId: string; name: string }) => void) => {
    if (!socket) return () => {};

    const handler = (data: WebSocketMessage) => {
      if (data.type === 'user_joined') {
        callback(data.data);
      }
    };

    socket.on('message', handler);
    return () => socket.off('message', handler);
  };

  const onUserLeft = (callback: (data: { eventId: string; participantId: string; name: string }) => void) => {
    if (!socket) return () => {};

    const handler = (data: WebSocketMessage) => {
      if (data.type === 'user_left') {
        callback(data.data);
      }
    };

    socket.on('message', handler);
    return () => socket.off('message', handler);
  };

  const onStreamStatusChange = (callback: (data: { eventId: string; status: 'started' | 'ended' }) => void) => {
    if (!socket) return () => {};

    const handler = (data: WebSocketMessage) => {
      if (data.type === 'stream_started' || data.type === 'stream_ended') {
        callback({
          eventId: data.eventId,
          status: data.type === 'stream_started' ? 'started' : 'ended',
        });
      }
    };

    socket.on('message', handler);
    return () => socket.off('message', handler);
  };

  const onOverlayUpdate = (callback: (overlay: OverlayElement) => void) => {
    if (!socket) return () => {};

    const handler = (data: WebSocketMessage) => {
      if (data.type === 'overlay_update') {
        callback(data.data);
      }
    };

    socket.on('message', handler);
    return () => socket.off('message', handler);
  };

  const onModerationAction = (callback: (data: { eventId: string; messageId: string; action: string }) => void) => {
    if (!socket) return () => {};

    const handler = (data: WebSocketMessage) => {
      if (data.type === 'moderation_action') {
        callback(data.data);
      }
    };

    socket.on('message', handler);
    return () => socket.off('message', handler);
  };

  const value: SocketContextType = {
    socket,
    isConnected,
    joinEventRoom,
    leaveEventRoom,
    sendMessage,
    sendSystemMessage,
    updateOverlay,
    removeOverlay,
    onMessage,
    onUserJoined,
    onUserLeft,
    onStreamStatusChange,
    onOverlayUpdate,
    onModerationAction,
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
}

export function useSocket() {
  const context = useContext(SocketContext);
  if (context === undefined) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
}