
'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';

import { MainNav } from '@/components/layout/main-nav';
import { MobileNav } from '@/components/layout/mobile-nav';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

export function SiteHeader() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const { toast } = useToast();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setIsAuthenticated(!!user);
        });
        return () => unsubscribe();
    }, []);

    const handleLogout = async () => {
        try {
            await signOut(auth);
            localStorage.removeItem('isAuthenticated');
            toast({ title: 'Logged out', description: 'You have been successfully logged out.' });
        } catch (error) {
            console.error('Logout error:', error);
            toast({ title: 'Error', description: 'Failed to log out. Please try again.', variant: 'destructive' });
        }
    };

    return (
        <header className="sticky top-0 z-40 w-full border-b bg-background">
            <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
                <MainNav />
                <MobileNav />
                <div className="flex flex-1 items-center justify-end space-x-4">
                    <nav className="flex items-center space-x-2">
                        {isAuthenticated ? (
                            <>
                                <Button asChild variant="ghost">
                                    <Link href="/profile">Profile</Link>
                                </Button>
                                <Button onClick={handleLogout} variant="ghost">Logout</Button>
                            </>
                        ) : (
                            <Button asChild>
                                <Link href="/login">Login</Link>
                            </Button>
                        )}
                    </nav>
                </div>
            </div>
        </header>
    );
}
