import { SignUp } from "@clerk/nextjs";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function SignUpPage() {
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
          <p className="text-lg text-black/60 max-w-xl mx-auto leading-relaxed">
            Sign up to attend events, contribute to projects, and appear in the
            member directory.
          </p>
        </div>

        <div className="flex justify-center">
          <SignUp
            forceRedirectUrl="/join/complete"
            appearance={{
              elements: {
                card: "shadow-none border-2 border-black rounded-2xl",
                headerTitle: "font-bold text-black",
                headerSubtitle: "text-black/60",
                socialButtonsBlockButton:
                  "border-2 border-black rounded-xl font-medium hover:bg-black/5 transition-colors",
                formFieldInput:
                  "border-2 border-black rounded-xl focus:ring-0 focus:border-black/50",
                formButtonPrimary:
                  "bg-[#fff200] text-black border-2 border-black rounded-xl hover:bg-[#ffe600] shadow-none font-semibold",
                footerActionLink: "text-black font-semibold underline",
              },
            }}
          />
        </div>

        <p className="text-center text-sm text-black/40 mt-8">
          Want to work on NGO projects?{" "}
          <a href="/volunteer" className="text-black underline underline-offset-2">
            Apply as a volunteer instead
          </a>
        </p>
      </section>

      <Footer />
    </main>
  );
}
