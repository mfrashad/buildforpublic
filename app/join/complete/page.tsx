"use client";

import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CompleteProfileForm from "./CompleteProfileForm";

export default function CompletePage() {
  const { isSignedIn, isLoaded } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push("/join");
    }
  }, [isLoaded, isSignedIn, router]);

  if (!isLoaded || !isSignedIn) return null;

  return (
    <main>
      <Navbar />

      <section className="pt-40 pb-16 px-6 text-center">
        <div className="max-w-3xl mx-auto">
          <h1 className="heading-display text-4xl sm:text-5xl text-black mb-4">
            One more step.
          </h1>
          <p className="text-lg text-black/60 max-w-xl mx-auto leading-relaxed">
            Tell us a bit about yourself so we can show you in the community
            directory and match you with the right projects.
          </p>
        </div>
      </section>

      <section className="section-padding pt-0 px-6">
        <div className="max-w-2xl mx-auto">
          <CompleteProfileForm />
        </div>
      </section>

      <Footer />
    </main>
  );
}
