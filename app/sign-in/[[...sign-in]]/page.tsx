import { SignIn } from "@clerk/nextjs";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function SignInPage() {
  return (
    <main>
      <Navbar />

      <section className="pt-40 pb-24 px-6">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h1 className="heading-display text-5xl sm:text-6xl text-black mb-6">
            Join Build for Public.
          </h1>
          <p className="text-lg text-black/60 max-w-xl mx-auto leading-relaxed">
            Sign in with Google to join as a member. Free, instant, no form required.
          </p>
        </div>

        <div className="flex justify-center">
          <SignIn
            forceRedirectUrl="/profile"
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
      </section>

      <Footer />
    </main>
  );
}
