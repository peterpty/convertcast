import Mux from '@mux/mux-node';

// Initialize Mux with credentials
const { Video } = new Mux({
  tokenId: process.env.MUX_TOKEN_ID!,
  tokenSecret: process.env.MUX_TOKEN_SECRET!,
});

export interface LiveStream {
  id: string;
  playbackUrl: string;
  streamKey: string;
  status: 'idle' | 'active' | 'disconnected';
  createdAt: string;
}

export interface StreamAsset {
  id: string;
  playbackUrl: string;
  status: 'preparing' | 'ready' | 'errored';
  duration?: number;
  createdAt: string;
}

export class MuxService {
  /**
   * Create a new live stream
   */
  static async createLiveStream(options: {
    playbackPolicy: 'public' | 'signed';
    newAssetSettings?: {
      playbackPolicy: 'public' | 'signed';
    };
  }): Promise<LiveStream> {
    try {
      const liveStream = await Video.LiveStreams.create({
        playback_policy: [options.playbackPolicy],
        new_asset_settings: options.newAssetSettings ? {
          playback_policy: [options.newAssetSettings.playbackPolicy],
        } : undefined,
      });

      return {
        id: liveStream.id!,
        playbackUrl: liveStream.playback_ids?.[0]?.id ?
          `https://stream.mux.com/${liveStream.playback_ids[0].id}.m3u8` : '',
        streamKey: liveStream.stream_key!,
        status: liveStream.status as 'idle' | 'active' | 'disconnected',
        createdAt: liveStream.created_at!,
      };
    } catch (error) {
      console.error('Error creating live stream:', error);
      throw new Error('Failed to create live stream');
    }
  }

  /**
   * Get live stream details
   */
  static async getLiveStream(streamId: string): Promise<LiveStream> {
    try {
      const liveStream = await Video.LiveStreams.get(streamId);

      return {
        id: liveStream.id!,
        playbackUrl: liveStream.playback_ids?.[0]?.id ?
          `https://stream.mux.com/${liveStream.playback_ids[0].id}.m3u8` : '',
        streamKey: liveStream.stream_key!,
        status: liveStream.status as 'idle' | 'active' | 'disconnected',
        createdAt: liveStream.created_at!,
      };
    } catch (error) {
      console.error('Error getting live stream:', error);
      throw new Error('Failed to get live stream');
    }
  }

  /**
   * Delete a live stream
   */
  static async deleteLiveStream(streamId: string): Promise<void> {
    try {
      await Video.LiveStreams.del(streamId);
    } catch (error) {
      console.error('Error deleting live stream:', error);
      throw new Error('Failed to delete live stream');
    }
  }

  /**
   * Create a direct upload for video assets
   */
  static async createDirectUpload(options: {
    corsOrigin: string;
    newAssetSettings: {
      playbackPolicy: 'public' | 'signed';
    };
  }) {
    try {
      const upload = await Video.Uploads.create({
        cors_origin: options.corsOrigin,
        new_asset_settings: {
          playback_policy: [options.newAssetSettings.playbackPolicy],
        },
      });

      return {
        id: upload.id!,
        url: upload.url!,
        assetId: upload.asset_id,
      };
    } catch (error) {
      console.error('Error creating direct upload:', error);
      throw new Error('Failed to create direct upload');
    }
  }

  /**
   * Get asset details
   */
  static async getAsset(assetId: string): Promise<StreamAsset> {
    try {
      const asset = await Video.Assets.get(assetId);

      return {
        id: asset.id!,
        playbackUrl: asset.playback_ids?.[0]?.id ?
          `https://stream.mux.com/${asset.playback_ids[0].id}.m3u8` : '',
        status: asset.status as 'preparing' | 'ready' | 'errored',
        duration: asset.duration,
        createdAt: asset.created_at!,
      };
    } catch (error) {
      console.error('Error getting asset:', error);
      throw new Error('Failed to get asset');
    }
  }

  /**
   * Get live stream statistics
   */
  static async getStreamMetrics(streamId: string, timeframe: string = '7:days') {
    try {
      // Get basic stream info
      const stream = await Video.LiveStreams.get(streamId);

      // For demo purposes, return mock metrics
      // In production, you would use Mux Data API for real metrics
      return {
        streamId,
        status: stream.status,
        viewerCount: Math.floor(Math.random() * 1000) + 50, // Mock data
        totalViewTime: Math.floor(Math.random() * 10000) + 1000, // Mock data
        peakViewers: Math.floor(Math.random() * 1500) + 100, // Mock data
        avgWatchTime: Math.floor(Math.random() * 300) + 60, // Mock data
        timeframe,
      };
    } catch (error) {
      console.error('Error getting stream metrics:', error);
      throw new Error('Failed to get stream metrics');
    }
  }

  /**
   * Generate a signed playback URL (for private streams)
   */
  static generateSignedUrl(playbackId: string, options: {
    expiration?: number; // Unix timestamp
    type?: 'video' | 'audio' | 'storyboard';
  } = {}) {
    try {
      // This requires the Mux signing key - for demo purposes
      // In production, you would implement proper JWT signing
      return `https://stream.mux.com/${playbackId}.m3u8?token=demo-signed-token`;
    } catch (error) {
      console.error('Error generating signed URL:', error);
      throw new Error('Failed to generate signed URL');
    }
  }

  /**
   * Create a livestream simulcast target (for multi-platform streaming)
   */
  static async createSimulcastTarget(streamId: string, options: {
    url: string;
    streamKey: string;
    passthrough?: string;
  }) {
    try {
      const target = await Video.LiveStreams.createSimulcastTarget(streamId, {
        url: options.url,
        stream_key: options.streamKey,
        passthrough: options.passthrough,
      });

      return {
        id: target.id!,
        status: target.status,
        streamKey: target.stream_key,
        url: target.url,
      };
    } catch (error) {
      console.error('Error creating simulcast target:', error);
      throw new Error('Failed to create simulcast target');
    }
  }

  /**
   * Test Mux connection and credentials
   */
  static async testConnection(): Promise<{ success: boolean; error?: string }> {
    try {
      // Try to list live streams to test connection
      await Video.LiveStreams.list({ limit: 1 });
      return { success: true };
    } catch (error: any) {
      console.error('Mux connection test failed:', error);
      return {
        success: false,
        error: error?.message || 'Failed to connect to Mux'
      };
    }
  }
}

// Export default instance
export const mux = MuxService;