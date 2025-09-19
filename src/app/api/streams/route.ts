import { NextRequest, NextResponse } from 'next/server';
import { MuxService } from '@/lib/mux';
import { supabase } from '@/lib/supabase';

// GET /api/streams - List user's streams
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const eventId = searchParams.get('eventId');

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    let query = supabase
      .from('streams')
      .select(`
        *,
        events (
          id,
          title,
          status
        )
      `)
      .eq('user_id', userId);

    if (eventId) {
      query = query.eq('event_id', eventId);
    }

    const { data: streams, error } = await query.order('created_at', { ascending: false });

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json({ error: 'Failed to fetch streams' }, { status: 500 });
    }

    return NextResponse.json({ streams });
  } catch (error) {
    console.error('Error fetching streams:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/streams - Create a new stream
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { eventId, userId, title, description, isPrivate = false } = body;

    if (!eventId || !userId || !title) {
      return NextResponse.json({
        error: 'Event ID, User ID, and title are required'
      }, { status: 400 });
    }

    // Create live stream with Mux
    const muxStream = await MuxService.createLiveStream({
      playbackPolicy: isPrivate ? 'signed' : 'public',
      newAssetSettings: {
        playbackPolicy: isPrivate ? 'signed' : 'public',
      },
    });

    // Save stream to database
    const { data: stream, error } = await supabase
      .from('streams')
      .insert([
        {
          event_id: eventId,
          user_id: userId,
          title,
          description,
          mux_stream_id: muxStream.id,
          stream_key: muxStream.streamKey,
          playback_url: muxStream.playbackUrl,
          status: 'idle',
          is_private: isPrivate,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error('Database error:', error);
      // Clean up Mux stream if database insert fails
      try {
        await MuxService.deleteLiveStream(muxStream.id);
      } catch (cleanupError) {
        console.error('Error cleaning up Mux stream:', cleanupError);
      }
      return NextResponse.json({ error: 'Failed to create stream' }, { status: 500 });
    }

    return NextResponse.json({
      stream: {
        ...stream,
        mux: muxStream,
      }
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating stream:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}