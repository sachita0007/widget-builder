"use client";

import Link from "next/link";

interface Breadcrumb {
  label: string;
  href?: string;
}

interface DashboardHeaderProps {
  breadcrumbs?: Breadcrumb[];
}

export function DashboardHeader({ breadcrumbs }: DashboardHeaderProps) {
  return (
    <header className="h-16 bg-white border-b border-gray-200 px-6 flex items-center sticky top-0 z-30">
      <div className="flex items-center gap-3">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-sm">
            F
          </div>
          <span className="font-bold text-lg tracking-tight text-gray-900">
            Freestand
          </span>
        </Link>

        {breadcrumbs?.map((bc, i) => (
          <div key={i} className="flex items-center gap-3">
            <span className="text-gray-300">/</span>
            {bc.href ? (
              <Link
                href={bc.href}
                className="text-sm text-gray-500 hover:text-blue-600 transition-colors"
              >
                {bc.label}
              </Link>
            ) : (
              <span className="text-sm font-medium text-gray-900">
                {bc.label}
              </span>
            )}
          </div>
        ))}
      </div>
    </header>
  );
}
