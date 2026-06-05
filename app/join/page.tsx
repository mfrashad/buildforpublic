"use client";

import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CompleteProfileForm from "./complete/CompleteProfileForm";

export default function JoinPage() {
  const { isSignedIn, isLoaded, user } = useUser();
  const router = useRouter();

  // If signed in but came to /join, send them to complete profile
  useEffect(() => {
    if (isLoaded && isSignedIn) {
      router.replace("/join/complete");
    }
  }, [isLoaded, isSignedIn, router]);

  // Don't render until Clerk has loaded
  if (!isLoaded) {
    return (
      <main>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-black border-t-transparent rounded-full animate-spin" />
        </div>
      </main>
    );
  }

  // Signed in — show profile form inline (in case redirect is slow)
  if (isSignedIn) {
    return (
      <main>
        <Navbar />
        <section className="pt-40 pb-24 px-6">
          <div className="max-w-2xl mx-auto">
            <h1 className="heading-display text-4xl text-black mb-4">
              Complete your profile.
            </h1>
            <p className="text-black/60 mb-10">
              Signed in as {user?.primaryEmailAddress?.emailAddress}.
            </p>
            <CompleteProfileForm />
          </div>
        </section>
        <Footer />
      </main>
    );
  }

  // Signed out — show join page with link to /sign-up
  return (
    <main>
      <Navbar />

      <section className="pt-40 pb-24 px-6">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <div className="inline-flex items-center gap-2 mb-8 text-sm font-medium text-black/60 bg-surface px-5 py-2 rounded-full border border-black">
            FREE · NO COMMITMENT
          </div>
          <h1 className="heading-display text-5xl sm:text-6xl text-black mb-6">
            Join the community.
          </h1>
          <p className="text-lg text-black/60 max-w-xl mx-auto mb-10 leading-relaxed">
            Sign up to attend events, contribute to open-source projects, and
            appear in the member directory.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/sign-up" className="btn-primary btn-primary-yellow text-base px-10 py-3">
              Create your account →
            </a>
            <a href="/sign-in" className="btn-pill btn-pill-outline text-base px-8 py-3">
              Sign in
            </a>
          </div>
        </div>

        {/* What you get */}
        <div className="max-w-4xl mx-auto">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { icon: "🛠️", title: "Monthly build sprints", body: "In-person hackathons in KL. Show up, pick a project, build something real." },
              { icon: "🌐", title: "Open-source projects", body: "Contribute to NGO tools and public-interest software." },
              { icon: "🤝", title: "Community directory", body: "Appear on the member map. Connect with builders across Southeast Asia." },
              { icon: "💡", title: "Post your builds", body: "Share your projects on the Projects Board." },
              { icon: "📢", title: "No pitch culture", body: "A community that builds, not networks." },
              { icon: "🚀", title: "Path to Fellow", body: "Work on NGO projects by applying as a Fellow anytime." },
            ].map(({ icon, title, body }) => (
              <div key={title} className="card p-5">
                <div className="text-2xl mb-2">{icon}</div>
                <h3 className="text-sm font-semibold text-black mb-1.5" style={{ fontFamily: "var(--font-display)" }}>{title}</h3>
                <p className="text-xs text-black/60 leading-relaxed">{body}</p>
              </div>
            ))}
          </div>

          <p className="text-center text-sm text-black/40 mt-8">
            Want to work on NGO projects?{" "}
            <a href="/volunteer" className="text-black underline underline-offset-2">
              Apply as a Fellow
            </a>
          </p>
        </div>
      </section>

      <Footer />
    </main>
  );
}
