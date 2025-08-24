import { SignInForm } from "@/components/signin-form";

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-20 w-32 h-32 bg-primary neo-shadow-xl transform -rotate-12"></div>
        <div className="absolute top-40 right-32 w-24 h-24 bg-secondary neo-shadow-lg transform rotate-45"></div>
        <div className="absolute bottom-32 left-1/4 w-28 h-28 bg-accent neo-shadow-xl transform rotate-12"></div>
        <div className="absolute bottom-20 right-20 w-20 h-20 bg-primary neo-shadow-lg transform -rotate-45"></div>
      </div>

      {/* Main content */}
      <div className="relative z-10 w-full max-w-md">
        <SignInForm />

        {/* Additional branding */}
        <div className="mt-8 text-center">
          <div className="flex items-center justify-center gap-4">
            <div className="h-1 w-16 bg-border neo-shadow-mobile"></div>
            <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground neo-text-shadow-black">
              Secure Access
            </span>
            <div className="h-1 w-16 bg-border neo-shadow-mobile"></div>
          </div>
        </div>
      </div>
    </div>
  );
}