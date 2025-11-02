'use client';

import { useState, useEffect } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, User, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { FirebaseError } from "firebase/app";
import { Loader2 } from "lucide-react";

export function SignupView() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<any>({});
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingLocation, setIsFetchingLocation] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        const userDocRef = doc(db, 'users', currentUser.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists() && userDoc.data()?.dob) {
          router.push('/home');
        } else {
          setUser(currentUser);
          setFormData((prevData: any) => ({
            ...prevData,
            name: currentUser.displayName || '',
            email: currentUser.email || '',
          }));
          setStep(2);
        }
      } else {
        setUser(null);
        setStep(1);
      }
    });
    return () => unsubscribe();
  }, [router]);

  const onGoogleSubmit = async () => {
    setIsLoading(true);
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
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

  const handleNextStep = () => setStep(step + 1);
  const handlePrevStep = () => setStep(step - 1);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value });
  }

  const handleLocationFetch = () => {
    setIsFetchingLocation(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
            const data = await response.json();
            const { address } = data;
            setFormData({
              ...formData,
              street: address.road || '',
              city: address.city || address.town || address.village || '',
              state: address.state || '',
              zip: address.postcode || '',
              country: address.country || '',
            });
            toast({
              title: "Location fetched",
              description: "Address has been pre-filled.",
            });
          } catch (error) {
            console.error("Error fetching address: ", error);
            toast({
              title: "Error",
              description: "Could not fetch address. Please enter it manually.",
              variant: "destructive"
            });
          } finally {
            setIsFetchingLocation(false);
          }
        },
        (error) => {
          console.error("Geolocation error: ", error);
          toast({
            title: "Error",
            description: "Could not access location. Please enable location services or enter the address manually.",
            variant: "destructive"
          });
          setIsFetchingLocation(false);
        }
      );
    } else {
      toast({
        title: "Error",
        description: "Geolocation is not supported by your browser.",
        variant: "destructive"
      });
      setIsFetchingLocation(false);
    }
  };


  const handleSubmit = async () => {
    if (!user) {
      toast({ title: "Error", description: "You must be logged in to complete the sign-up." });
      return;
    }

    const { name, gender, dob, street, city, state, zip, country } = formData;

    const userProfile = {
      uid: user.uid,
      name: name || user.displayName,
      email: user.email,
      photoURL: user.photoURL,
      gender: gender,
      dob: dob,
      address: {
        street: street,
        city: city,
        state: state,
        zip: zip,
        country: country,
      },
    };

    try {
      await setDoc(doc(db, "users", user.uid), userProfile, { merge: true });
      toast({ title: "Success", description: "Your profile has been updated." });
      router.push("/home");
    } catch (error) {
      console.error("Error updating profile: ", error);
      toast({ title: "Error", description: "There was an error updating your profile." });
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Sign Up</CardTitle>
        </CardHeader>
        <CardContent>
          {step === 1 && (
            <div>
              <p className="text-center text-muted-foreground mb-4">Please log in to continue</p>
              <Button onClick={onGoogleSubmit} className="w-full" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Sign in with Google
              </Button>
            </div>
          )}
          {step === 2 && (
            <div>
              <Label htmlFor="name">Name</Label>
              <Input id="name" name="name" value={formData.name || ''} onChange={handleChange} />
              <Label htmlFor="gender">Gender</Label>
              <Select onValueChange={(value) => handleSelectChange("gender", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
              <Label htmlFor="dob">Date of Birth</Label>
              <Input id="dob" name="dob" type="date" onChange={handleChange} value={formData.dob || ''}/>
            </div>
          )}
          {step === 3 && (
            <div>
              <Button onClick={handleLocationFetch} className="w-full mb-4" disabled={isFetchingLocation}>
                {isFetchingLocation && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Use my location
              </Button>
              <Label htmlFor="street">Street</Label>
              <Input id="street" name="street" onChange={handleChange} value={formData.street || ''} />
              <Label htmlFor="city">City</Label>
              <Input id="city" name="city" onChange={handleChange} value={formData.city || ''} />
              <Label htmlFor="state">State</Label>
              <Input id="state" name="state" onChange={handleChange} value={formData.state || ''} />
              <Label htmlFor="zip">Zip Code</Label>
              <Input id="zip" name="zip" onChange={handleChange} value={formData.zip || ''} />
              <Label htmlFor="country">Country</Label>
              <Input id="country" name="country" onChange={handleChange} value={formData.country || ''} />
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          {step > 2 && <Button variant="outline" onClick={handlePrevStep}>Go Back</Button>}
          {step < 3 && step > 1 && <Button onClick={handleNextStep}>Continue</Button>}
          {step === 3 && <Button onClick={handleSubmit}>Finish</Button>}
        </CardFooter>
      </Card>
    </div>
  );
}
