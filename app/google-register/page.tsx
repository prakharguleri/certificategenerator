'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function GoogleRegister() {
  const router = useRouter();

  useEffect(() => {
    router.push('/unauthorized');
  }, [router]);

  return <div className="p-8 text-center">Registering your account...</div>;
}
