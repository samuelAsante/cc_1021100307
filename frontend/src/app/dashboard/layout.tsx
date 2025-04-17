'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Users, PlusSquare, Settings } from 'lucide-react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const navLinks = [
    { href: '/dashboard', label: 'All Contacts', icon: <Users size={18} /> },
    { href: '/dashboard/contacts/add', label: 'Add Contact', icon: <PlusSquare size={18} /> },
    { href: '/settings', label: 'Settings', icon: <Settings size={18} /> },
  ];

   const currentUser = {
    name: 'John Doe',
    email: 'johndoe@example.com',
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row text-black bg-gray-50">
      {/* Sidebar */}
      <nav className="bg-white border-b md:border-r md:border-b-0 w-full md:w-64 p-4 flex flex-col justify-between shadow-sm md:shadow-none">
        <div>
          <div className="text-xl font-semibold mb-4">Contact Manager</div>
          <div className="flex md:flex-col w-full gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg w-full hover:bg-red-50 transition ${
                  pathname === link.href ? 'bg-red-100 font-medium' : ''
                }`}
              >
                {link.icon}
                <span className="text-sm">{link.label}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* User Info at the bottom */}
        <div className="mt-6 border-t pt-4 text-sm">
          <p className="font-medium">{currentUser.name}</p>
          <p className="text-xs">{currentUser.email}</p>
        </div>
      </nav>

      {/* Main content */}
      <main className="flex-1 p-6 overflow-y-auto">{children}</main>
    </div>
  );
}
