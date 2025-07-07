'use client';

/* eslint-disable */
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface Option {
  id: number;
  label: string;
}

const sessions: Option[] = [
  { id: 1, label: '2017-2018' },
  { id: 2, label: '2016-2017' },
  { id: 3, label: '2015-2016' },
  { id: 4, label: '2014-2015' },
  { id: 5, label: '2013-2014' },
  { id: 6, label: '2012-2013' },
  { id: 7, label: '2011-2012' },
  { id: 8, label: '2010-2011' },
  { id: 9, label: '2009-2010' },
  { id: 10, label: '2018-2019' },
  { id: 11, label: '2007-2008' },
  { id: 12, label: '2008-2009' },
  { id: 13, label: '2006-2007' },
  { id: 14, label: '2019-2020' },
  { id: 16, label: '2020-2021' },
  { id: 17, label: '2021-2022' },
  { id: 18, label: '2022-2023' },
  { id: 19, label: '2023-2024' },
  { id: 20, label: '2024-2025' },
  { id: 21, label: '2025-2026' },
];

const semesters: Option[] = [
  { id: 1, label: 'Odd' },
  { id: 2, label: 'Even' },
  { id: 3, label: 'Summer' },
];

const programmes: Option[] = [
  { id: 1, label: 'BACHELOR OF TECHNOLOGY' },
  { id: 3, label: 'MASTER OF SCIENCE' },
  { id: 4, label: 'MASTER OF TECHNOLOGY (MTECH)' },
  { id: 5, label: 'DOCTOR OF PHILOSOPHY (PHD)' },
  { id: 7, label: 'B.TECH-M.TECH (DUAL)' },
  { id: 8, label: 'M.SC-PH.D (DUAL DEGREE)' },
  { id: 9, label: 'M.B.A.' },
  { id: 10, label: 'MS-RESEARCH' },
  { id: 11, label: 'MASTER IN PUBLIC POLICY' },
  { id: 12, label: 'ADVANCE DEGREE' },
  { id: 13, label: 'BACHELOR OF DESIGN' },
  { id: 23, label: 'MDES' },
  { id: 24, label: 'INTERDISCIPLINARY M.TECH' },
  { id: 25, label: 'PGDIP' },
  { id: 26, label: 'PGDIIT' },
  { id: 27, label: 'INTEGRATED M.TECH' },
  { id: 28, label: 'UG-VST' },
  { id: 29, label: 'PG-VST' },
  { id: 30, label: 'M. TECH HVA - HIGH VALUE ASSISTANTSHIP (3 YEARS)' },
  { id: 31, label: 'DIPLOMA' },
  { id: 32, label: 'ABU DHABI' },
  { id: 33, label: 'MA' },
  { id: 34, label: 'EXECUTIVE MBA' },
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
        <div>
          <label className="block mb-1 font-medium">Entry Number</label>
          <input
            type="text"
            className="w-full border p-2 rounded"
            value={entryNumber}
            onChange={(e) => setEntryNumber(e.target.value.toUpperCase())}
          />
          <button
            className="mt-2 bg-blue-600 text-white px-4 py-2 rounded w-full disabled:opacity-50"
            onClick={handleSingleDownload}
            disabled={isSingleLoading || !entryNumber}
          >
            {isSingleLoading ? 'Generating...' : 'Download Certificate'}
          </button>
        </div>

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

          <label className="block mt-4 mb-1 font-medium">Semester</label>
          <select
            className="w-full border p-2 rounded"
            value={semesterId}
            onChange={(e) => setSemesterId(Number(e.target.value) || '')}
          >
            <option value="">Select</option>
            {semesters.map((s) => (
              <option key={s.id} value={s.id}>{s.label}</option>
            ))}
          </select>

          <label className="block mt-4 mb-1 font-medium">Programme</label>
          <select
            className="w-full border p-2 rounded"
            value={programmeId}
            onChange={(e) => setProgrammeId(Number(e.target.value) || '')}
          >
            <option value="">Select</option>
            {programmes.map((p) => (
              <option key={p.id} value={p.id}>{p.label}</option>
            ))}
          </select>

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
