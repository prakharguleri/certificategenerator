'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const res = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (res.ok) {
      router.push('/login');
    } else {
      setError(data.message || 'Registration failed');
    }

    setLoading(false);
  };

  const handleGoogleRegister = () => {
    // Trigger Google OAuth with redirect to /google-register to insert into MongoDB
    signIn('google', { callbackUrl: '/google-register' });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-xl bg-white p-8 shadow-md space-y-4"
      >
        <h2 className="text-2xl font-bold text-center">Create Account</h2>

        <input
          placeholder="Name"
          required
          className="w-full p-3 border rounded-lg"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <input
          placeholder="Email"
          type="email"
          required
          className="w-full p-3 border rounded-lg"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <input
          placeholder="Password"
          type="password"
          required
          className="w-full p-3 border rounded-lg"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700"
        >
          {loading ? 'Registering...' : 'Register'}
        </button>

        <div className="text-center text-gray-500">OR</div>

        <button
          type="button"
          onClick={handleGoogleRegister}
          className="w-full bg-red-500 text-white py-3 rounded-lg hover:bg-red-600"
        >
          Register with Google
        </button>
      </form>
    </div>
  );
}
