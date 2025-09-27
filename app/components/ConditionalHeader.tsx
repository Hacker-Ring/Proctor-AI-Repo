'use client';

import { usePathname } from 'next/navigation';
import Header from './Header';

export default function ConditionalHeader() {
  const pathname = usePathname();
  
  // Show header only on public pages (index, auth, pricing, admissions, officers, debug)
  const shouldShowHeader = 
    pathname === '/' || 
    pathname.startsWith('/auth/') ||
    pathname === '/pricing' ||
    pathname === '/admissions' ||
    pathname === '/officers' ||
    pathname === '/debug-auth';
  
  if (!shouldShowHeader) {
    return null;
  }
  
  return <Header />;
}
