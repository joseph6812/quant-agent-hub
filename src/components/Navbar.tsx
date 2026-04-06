'use client';

import Link from 'next/link';
import { TrendingUp } from 'lucide-react';
import UserMenu from './UserMenu';

export default function Navbar() {
  return (
    <nav className="border-b bg-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-6 w-6 text-primary" />
            <Link href="/" className="text-xl font-bold">
              QuantAgent Hub
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/strategies" className="text-muted-foreground hover:text-foreground">
              策略广场
            </Link>
            <Link href="/upload" className="text-muted-foreground hover:text-foreground">
              分享策略
            </Link>
            <Link href="/disclaimer" className="text-sm text-muted-foreground hover:text-foreground">
              免责声明
            </Link>
            <div className="border-l pl-4 ml-2">
              <UserMenu />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
