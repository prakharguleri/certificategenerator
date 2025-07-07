'use client';
import Link from 'next/link';

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-red-50 px-4">
      <div className="bg-white p-8 rounded-xl shadow-md text-center max-w-md w-full">
        <h1 className="text-3xl font-bold text-red-600 mb-4">401 - Unauthorized</h1>
        <p className="text-gray-700 mb-6">
          Your account is not approved to access this portal.
        </p>
        <Link href="/login" className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg">
          Go Back to Login
        </Link>
      </div>
    </div>
  );
}
