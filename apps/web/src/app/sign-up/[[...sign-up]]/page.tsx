import { SignUp } from '@clerk/nextjs';

export default function SignUpPage() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center">
      <div className="flex flex-col items-center gap-6">
        <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-muted">
          Create your firm account
        </p>
        <SignUp
          signInUrl="/sign-in"
          forceRedirectUrl="/"
          fallbackRedirectUrl="/"
        />
      </div>
    </div>
  );
}
