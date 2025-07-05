'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const sessions = [
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

const semesters = [
  { id: 1, label: 'Odd' },
  { id: 2, label: 'Even' },
  { id: 3, label: 'Summer' },
];

const programmes = [
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
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  const [entryNumber, setEntryNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [sessionId, setSessionId] = useState('');
  const [semesterId, setSemesterId] = useState('');
  const [programmeId, setProgrammeId] = useState('');

  const handleSingleDownload = async () => {
    if (!entryNumber) {
      setError('Please enter an entry number');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:5000/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ entryNumber }),
      });

      if (!response.ok) throw new Error('Certificate not found');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${entryNumber}.pdf`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to download certificate');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleBulkDownload = async () => {
    if (!sessionId || !semesterId || !programmeId) {
      setError('Please select all options for bulk download');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:5000/bulk-download', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: Number(sessionId),
          semesterId: Number(semesterId),
          programmeId: Number(programmeId),
        }),
      });

      if (!response.ok) throw new Error('Failed to generate bulk download');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `certificates_${sessionId}_${semesterId}_${programmeId}.zip`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to download bulk certificates');
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (status === 'loading') {
    return <div className="p-4 text-center">Checking login status...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      {/* UI code remains unchanged */}
      {/* ... */}
    </div>
  );
}
