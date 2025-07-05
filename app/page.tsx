// app/page.tsx
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth'; // Changed import path
import { redirect } from 'next/navigation';
import CertificateDownload from './CertificateDownloadClient';