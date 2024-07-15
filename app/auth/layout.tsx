import { ReactNode } from "react";
import { AuthWrapper } from "./auth-wrapper";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <AuthWrapper>
      <main className="min-h-screen flex flex-col items-center justify-center">
        {children}
      </main>
    </AuthWrapper>
  );
}
