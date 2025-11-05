import { Suspense } from 'react';
import { SignupView } from "@/components/views/signup-view";
import { Loading } from '@/components/ui/loading';

export default function Signup() {
  return (
    <Suspense fallback={<Loading />}>
      <SignupView />
    </Suspense>
  );
}
