'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [resetError, setResetError] = useState('');
  const [resetSuccess, setResetSuccess] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    try {
      const res = await fetch('/api/auth/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      
      const data = await res.json();
      
      if (data.success) {
        document.cookie = `admin_token=${data.token}; path=/; max-age=86400`;
        router.push('/admin');
      } else {
        setError('Credenciais inválidas');
      }
    } catch (error) {
      setError('Falha no login');
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetError('');
    setResetSuccess(false);
    
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, currentPassword, newPassword }),
      });
      
      const data = await res.json();
      
      if (data.success) {
        setResetSuccess(true);
        setCurrentPassword('');
        setNewPassword('');
      } else {
        setResetError(data.error || 'Erro ao redefinir senha');
      }
    } catch (error) {
      setResetError('Erro ao redefinir senha');
    }
  };

  return (
    <div className="bg-black min-h-screen text-white flex items-center justify-center">
      <div className="bg-gray-900 p-8 rounded-lg w-full max-w-md">
        {!showResetPassword ? (
          <>
            <h1 className="text-3xl font-bold text-gold mb-6 text-center">Admin Login</h1>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm mb-2">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-3 bg-gray-800 rounded border border-gray-700 focus:border-gold outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm mb-2">Senha</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-3 bg-gray-800 rounded border border-gray-700 focus:border-gold outline-none"
                  required
                />
              </div>
              {error && <p className="text-red-400 text-sm">{error}</p>}
              <button
                type="submit"
                className="w-full bg-gold text-black py-3 rounded-lg font-bold hover:bg-gold/90 transition"
              >
                Login
              </button>
            </form>
            <button
              onClick={() => setShowResetPassword(true)}
              className="w-full mt-4 text-gray-400 hover:text-gold text-sm"
            >
              Redefinir Senha
            </button>
          </>
        ) : (
          <>
            <h1 className="text-3xl font-bold text-gold mb-6 text-center">Redefinir Senha</h1>
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div>
                <label className="block text-sm mb-2">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-3 bg-gray-800 rounded border border-gray-700 focus:border-gold outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm mb-2">Senha Atual</label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full p-3 bg-gray-800 rounded border border-gray-700 focus:border-gold outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm mb-2">Nova Senha</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full p-3 bg-gray-800 rounded border border-gray-700 focus:border-gold outline-none"
                  required
                />
              </div>
              {resetError && <p className="text-red-400 text-sm">{resetError}</p>}
              {resetSuccess && <p className="text-green-400 text-sm">Senha redefinida com sucesso!</p>}
              <button
                type="submit"
                className="w-full bg-gold text-black py-3 rounded-lg font-bold hover:bg-gold/90 transition"
              >
                Redefinir
              </button>
            </form>
            <button
              onClick={() => setShowResetPassword(false)}
              className="w-full mt-4 text-gray-400 hover:text-gold text-sm"
            >
              Voltar ao Login
            </button>
          </>
        )}
      </div>
    </div>
  );
}
