import { Resend } from 'resend';
import { NextResponse } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { message, sessionId } = await req.json();
    
    await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: process.env.ADMIN_EMAIL!,
      subject: `New chat message from VJ CLUB visitor (${sessionId})`,
      html: `<p><strong>Message:</strong> ${message}</p><p><a href="${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/admin?chat=${sessionId}">Reply in admin panel</a></p>`,
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json({ error: 'Error sending email' }, { status: 500 });
  }
}
