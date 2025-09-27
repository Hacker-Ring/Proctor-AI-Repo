'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: 'D' },
  { name: 'Officers', href: '/officers', icon: 'O' },
  { name: 'Manage Data', href: '/manage-data', icon: 'M' },
  { name: 'Pricing', href: '/pricing', icon: 'P' },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="w-64 bg-gray-50 border-r border-gray-200 min-h-screen">
      <div className="p-6">
        <h1 className="text-xl font-bold text-black">ProctorAI</h1>
        <p className="text-sm text-gray-600 mt-1">Admissions</p>
      </div>
      
      <nav className="px-4 space-y-2">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center px-4 py-2 text-gray-700 rounded-[6px] transition-all duration-200 hover:bg-gray-100 hover:text-black cursor-pointer ${isActive ? 'bg-black text-white hover:bg-gray-800' : ''}`}
            >
              <span className="w-6 h-6 bg-gray-200 rounded-[6px] flex items-center justify-center text-xs font-semibold mr-3">{item.icon}</span>
              <span className="font-medium">{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
