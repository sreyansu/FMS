'use client';

import { useSession, signOut } from 'next-auth/react';
import type { Session } from 'next-auth';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { LogOut, User, MessageSquare, LayoutDashboard } from 'lucide-react';
import Button from '@/components/ui/Button';
import { ModeToggle } from "@/components/ui/mode-toggle";

interface CustomSession extends Session {
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
  };
}

export default function Header() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    router.push('/');
  };

  const renderUserActions = () => {
    if (status === 'loading') {
      return <div className="w-24 h-8 animate-pulse bg-muted rounded-md" />;
    }

    if (session) {
      const customSession = session as unknown as CustomSession;
      return (
        <div className="flex items-center gap-4">
          <span className="hidden sm:inline-flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <User className="h-5 w-5" />
            {customSession.user?.name || 'User'}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push('/dashboard/forms')}
          >
            <LayoutDashboard className="h-4 w-4 mr-2" />
            Dashboard
          </Button>
          <Button variant="ghost" size="sm" onClick={handleSignOut}>
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </div>
      );
    }

    return (
      <div className="flex items-center gap-2">
        <Link href="/login">
          <Button variant="ghost" size="sm">
            Sign In
          </Button>
        </Link>
        <Link href="/signup">
          <Button size="sm">Sign Up</Button>
        </Link>
      </div>
    );
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="flex items-center space-x-2">
            <MessageSquare className="h-6 w-6 text-primary" />
            <span className="hidden font-bold sm:inline-block">
              FeedbackHub
            </span>
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            {/* <CommandMenu /> */}
          </div>
          <nav className="flex items-center space-x-2">
            <ModeToggle />
            {renderUserActions()}
          </nav>
        </div>
      </div>
    </header>
  );
}
