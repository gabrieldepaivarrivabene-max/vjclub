import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const adminToken = cookies().get('admin_token');
  
  if (!adminToken) {
    redirect('/admin/login');
  }

  return <div>{children}</div>;
}
