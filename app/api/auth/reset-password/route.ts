import { createClient } from '@/lib/supabaseServer';
import bcrypt from 'bcrypt';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { email, currentPassword, newPassword } = await req.json();
    const supabase = createClient();

    const { data: admin } = await supabase
      .from('admin_users')
      .select('*')
      .eq('email', email)
      .single();

    if (!admin) {
      return NextResponse.json({ success: false, error: 'Admin não encontrado' }, { status: 404 });
    }

    const isValid = await bcrypt.compare(currentPassword, admin.password_hash);

    if (!isValid) {
      return NextResponse.json({ success: false, error: 'Senha atual incorreta' }, { status: 401 });
    }

    const newPasswordHash = await bcrypt.hash(newPassword, 10);

    await supabase
      .from('admin_users')
      .update({ password_hash: newPasswordHash })
      .eq('email', email);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error resetting password:', error);
    return NextResponse.json({ success: false, error: 'Erro ao redefinir senha' }, { status: 500 });
  }
}
