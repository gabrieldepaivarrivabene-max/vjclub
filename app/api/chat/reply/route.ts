import { createClient } from '@/lib/supabaseServer';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { sessionId, message } = await req.json();
    const supabase = createClient();

    await supabase.from('chat_messages').insert({
      session_id: sessionId,
      sender_type: 'admin',
      message,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error sending reply:', error);
    return NextResponse.json({ error: 'Error sending reply' }, { status: 500 });
  }
}
