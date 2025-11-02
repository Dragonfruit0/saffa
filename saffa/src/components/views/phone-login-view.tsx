
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Image from 'next/image';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Logo } from '@/components/ui/logo';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const phoneSchema = z.object({
  phone: z.string().min(10, 'Please enter a valid 10-digit phone number.').max(10, 'Please enter a valid 10-digit phone number.'),
});

type PhoneFormValues = z.infer<typeof phoneSchema>;

export function PhoneLoginView() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const phoneForm = useForm<PhoneFormValues>({
    resolver: zodResolver(phoneSchema),
    defaultValues: { phone: '' },
  });

  async function onPhoneSubmit(values: PhoneFormValues) {
    setIsLoading(true);
    // This is where you would call your backend to send an OTP
    // For now, we'll simulate a delay and then move to the home page
    console.log('Logging in with phone:', values.phone);
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // On successful verification
    try {
      localStorage.setItem('isAuthenticated', 'true');
    } catch (error) {
       console.error("Could not set auth status in local storage", error);
    }
    
    setIsLoading(false);
    toast({
      title: 'Success!',
      description: 'You have been successfully logged in.',
    });
    router.push('/home');
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
              Enter your mobile number to begin your sacred journey.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...phoneForm}>
              <form onSubmit={phoneForm.handleSubmit(onPhoneSubmit)} className="space-y-6">
                <FormField
                  control={phoneForm.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
                            +91
                          </span>
                          <Input
                            type="tel"
                            placeholder="98765 43210"
                            className="pl-12"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Proceed
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
