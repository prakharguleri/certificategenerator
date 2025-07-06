'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface Option {
  id: number;
  label: string;
}

const sessions: Option[] = [
  { id: 1, label: '2017-2018' },
  // ... (keep your existing sessions array)
];

const semesters: Option[] = [
  { id: 1, label: 'Odd' },
  // ... (keep your existing semesters array)
];

const programmes: Option[] = [
  { id: 1, label: 'BACHELOR OF TECHNOLOGY' },
  // ... (keep your existing programmes array)
];

export default function CertificateDownload() {
  const { status } = useSession();
  const router = useRouter();
  const [entryNumber, setEntryNumber] = useState('');
  const [isSingleLoading, setIsSingleLoading] = useState(false);
  const [isBulkLoading, setIsBulkLoading] = useState(false);
  const [error, setError] = useState('');
  const [sessionId, setSessionId] = useState<number | ''>('');
  const [semesterId, setSemesterId] = useState<number | ''>('');
  const [programmeId, setProgrammeId] = useState<number | ''>('');

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/login');
  }, [status, router]);

  const handleSingleDownload = async () => {
    if (!entryNumber) {
      setError('Please enter an entry number');
      return;
    }

    setIsSingleLoading(true);
    setError('');

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ entryNumber }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Request failed');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${entryNumber}.docx`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to download certificate');
    } finally {
      setIsSingleLoading(false);
    }
  };

  const handleBulkDownload = async () => {
    if (!sessionId || !semesterId || !programmeId) {
      setError('Please select all options for bulk download');
      return;
    }

    setIsBulkLoading(true);
    setError('');

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/bulk-download`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: Number(sessionId),
          semesterId: Number(semesterId),
          programmeId: Number(programmeId),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Bulk download failed');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `certificates_${sessionId}_${semesterId}_${programmeId}.zip`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to download bulk certificates');
    } finally {
      setIsBulkLoading(false);
    }
  };

  if (status === 'loading') {
    return <div className="p-4 text-center">Checking login status...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <h2 className="text-2xl font-bold text-center mb-6">Certificate Portal</h2>
      <div className="max-w-md mx-auto bg-white p-6 rounded shadow-md space-y-6">
        {/* Single Download Section */}
        <div>
          <label className="block mb-1 font-medium">Entry Number</label>
          <input
            type="text"
            className="w-full border p-2 rounded"
            value={entryNumber}
            onChange={(e) => setEntryNumber(e.target.value)}
          />
          <button
            className="mt-2 bg-blue-600 text-white px-4 py-2 rounded w-full disabled:opacity-50"
            onClick={handleSingleDownload}
            disabled={isSingleLoading || !entryNumber}
          >
            {isSingleLoading ? 'Generating...' : 'Download Certificate'}
          </button>
        </div>

        {/* Bulk Download Section */}
        <div className="border-t pt-4">
          <label className="block mb-1 font-medium">Session</label>
          <select
            className="w-full border p-2 rounded"
            value={sessionId}
            onChange={(e) => setSessionId(Number(e.target.value) || '')}
          >
            <option value="">Select</option>
            {sessions.map((s) => (
              <option key={s.id} value={s.id}>{s.label}</option>
            ))}
          </select>

          {/* Repeat for semester and programme selects */}

          <button
            className="mt-4 bg-green-600 text-white px-4 py-2 rounded w-full disabled:opacity-50"
            onClick={handleBulkDownload}
            disabled={isBulkLoading || !sessionId || !semesterId || !programmeId}
          >
            {isBulkLoading ? 'Generating ZIP...' : 'Download Bulk Certificates'}
          </button>
        </div>

        {error && <p className="text-red-600 mt-2 text-center">{error}</p>}

        <button
          onClick={() => signOut()}
          className="text-center text-sm text-gray-600 underline block mt-4"
        >
          Logout
        </button>
      </div>
    </div>
  );
}