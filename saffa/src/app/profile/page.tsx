'use client';

import { useEffect, useState } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Loader2 } from 'lucide-react';
import { UserProfile } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      try {
        if (currentUser) {
          const userDocRef = doc(db, 'users', currentUser.uid);
          const userDoc = await getDoc(userDocRef);
          if (userDoc.exists()) {
            setUser(userDoc.data() as UserProfile);
          } else {
            setUser(null);
          }
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/home');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="mr-2 h-16 w-16 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col justify-center items-center h-screen space-y-4">
        <p className="text-lg">Please log in to view your profile.</p>
        <Button onClick={() => router.push('/auth')}>Go to Login</Button>
      </div>
    );
  }

  const getInitials = (name: string) => {
    if (!name) return '';
    return name.split(' ').map((n) => n[0]).join('');
  };

  return (
    <div className="container mx-auto py-10">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-center text-2xl">User Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center space-y-4">
            <Avatar className="h-24 w-24">
              <AvatarImage src={user.photoURL ?? `https://ui-avatars.com/api/?name=${user.name}&background=random`} />
              <AvatarFallback>{getInitials(user.name ?? '')}</AvatarFallback>
            </Avatar>
            <div className="text-center">
              <p className="text-xl font-semibold">{user.name}</p>
              <p className="text-muted-foreground">{user.email}</p>
            </div>
          </div>
          <div className="mt-6">
            <h3 className="text-lg font-semibold">Personal Details</h3>
            <div className="grid grid-cols-2 gap-4 mt-2">
              <div>
                <p className="text-sm text-muted-foreground">Gender</p>
                <p>{user.gender}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Date of Birth</p>
                <p>{user.dob}</p>
              </div>
            </div>
          </div>
          {user.address && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold">Address</h3>
              <div className="mt-2">
                <p>{user.address.street}</p>
                <p>{user.address.city}, {user.address.state} {user.address.zip}</p>
                <p>{user.address.country}</p>
              </div>
            </div>
          )}
          <div className="mt-6">
            <h3 className="text-lg font-semibold">Wishlist</h3>
            {/* Placeholder for wishlist */}
            <p className="text-muted-foreground mt-2">Your wishlist is empty.</p>
          </div>
          <div className="mt-6">
            <h3 className="text-lg font-semibold">Previous Trips</h3>
            {/* Placeholder for previous trips */}
            <p className="text-muted-foreground mt-2">You haven't booked any trips yet.</p>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center space-x-4">
          <Button onClick={() => router.push('/home')}>Home</Button>
          <Button onClick={handleLogout} variant="outline">Logout</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
