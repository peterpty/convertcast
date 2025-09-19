"use client";

import { useRouter } from "next/navigation";
import { OnboardingWizard } from "@/components/onboarding/OnboardingWizard";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

export default function OnboardingPage() {
  const router = useRouter();

  const handleOnboardingComplete = (data: any) => {
    console.log("Onboarding completed with data:", data);
    // TODO: Save onboarding data to user profile in Supabase
    router.push("/dashboard");
  };

  const handleSkip = () => {
    router.push("/dashboard");
  };

  return (
    <ProtectedRoute>
      <OnboardingWizard
        onComplete={handleOnboardingComplete}
        onSkip={handleSkip}
      />
    </ProtectedRoute>
  );
}