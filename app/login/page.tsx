'use client';

import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const res = await signIn('credentials', {
      ...form,
      redirect: false,
    });

    if (res?.ok) {
      router.push('/dashboard');
    } else {
      setError('Login failed');
    }

    setLoading(false);
  };

  const handleGoogleLogin = () => {
    signIn('google');
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-lg space-y-4">
        <h2 className="text-2xl font-bold text-center">Login</h2>

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            placeholder="Email"
            type="email"
            required
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full p-3 border rounded-lg"
          />
          <input
            placeholder="Password"
            type="password"
            required
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="w-full p-3 border rounded-lg"
          />
          {error && <p className="text-sm text-red-500 text-center">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700"
          >
            {loading ? 'Logging in...' : 'Login with Email'}
          </button>
        </form>

        <button
          onClick={handleGoogleLogin}
          className="w-full bg-red-500 text-white py-3 rounded-lg hover:bg-red-600"
        >
          Sign in with Google
        </button>

        <div className="text-center pt-2">
          <span className="text-gray-500">Don’t have an account?</span>{' '}
          <Link
            href="/register"
            className="text-blue-600 hover:underline font-medium"
          >
            Create one
          </Link>
        </div>
      </div>
    </div>
  );
}
