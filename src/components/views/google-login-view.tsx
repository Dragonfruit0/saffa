'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { FirebaseError } from 'firebase/app';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';

import { Button } from '@/components/ui/button';
import { Logo } from '@/components/ui/logo';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function GoogleLoginView() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  async function onGoogleSubmit() {
    setIsLoading(true);
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Create a new document in the 'users' collection
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        displayName: user.displayName,
        email: user.email,
      });

      console.log('Logged in with Google and user data saved:', user);
      localStorage.setItem('isAuthenticated', 'true');
      toast({
        title: 'Success!',
        description: 'You have been successfully logged in.',
      });
      router.push('/home');
    } catch (error) {
      console.error('Google sign-in error:', error);
      if (error instanceof FirebaseError) {
        if (error.code === 'auth/popup-closed-by-user') {
          toast({
            title: 'Sign-in cancelled',
            description: 'You closed the sign-in window before completion.',
            variant: 'destructive',
          });
        } else {
          toast({
            title: 'Error',
            description: `Failed to sign in with Google. Please try again. (${error.message})`,
            variant: 'destructive',
          });
        }
      } else {
        toast({
          title: 'An unexpected error occurred',
          description: 'Please try again later.',
          variant: 'destructive',
        });
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center bg-muted/40">
      <div className="absolute inset-0">
        <Image
          src="https://picsum.photos/seed/loginbg/1200/800"
          alt="Pilgrimage"
          fill
          className="object-cover"
          data-ai-hint="mosque closeup"
        />
        <div className="absolute inset-0 bg-background/60 backdrop-blur-sm" />
      </div>
      <div className="relative z-10 w-full max-w-md p-4">
        <Card className="shadow-2xl">
          <CardHeader className="text-center">
            <div className='flex justify-center mb-4'>
              <Logo />
            </div>
            <CardTitle className="text-2xl font-headline">
              Welcome, Pilgrim
            </CardTitle>
            <CardDescription>
              Sign in with Google to continue your sacred journey.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={onGoogleSubmit} className="w-full" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Sign in with Google
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
