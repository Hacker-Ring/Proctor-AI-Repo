'use client';

import { usePathname } from 'next/navigation';

export default function ConditionalHeader() {
  const pathname = usePathname();
  
  // Show header only on specific pages (auth, pricing, admissions, officers, debug)
  // Note: Home page (/) has its own built-in header
  const shouldShowHeader = 
    pathname.startsWith('/auth/') ||
    pathname === '/pricing' ||
    pathname === '/admissions' ||
    pathname === '/officers' ||
    pathname === '/debug-auth';
  
  if (!shouldShowHeader) {
    return null;
  }
  
  // For now, return null since we don't have a Header component
  // This can be updated later if needed for other pages
  return null;
}
