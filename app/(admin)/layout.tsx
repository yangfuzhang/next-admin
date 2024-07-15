import { ReactNode } from "react";
import { SideBar } from "@/components/layout";
import { SessionProvider } from "next-auth/react";
import { auth } from "@/auth";

export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await auth();

  return (
    <SessionProvider session={session}>
      <div className="relative w-screen h-screen">
        <div className="fixed z-20 w-24 h-screen border-r bg-background/100 backdrop-blur">
          <SideBar />
        </div>

        <main className="w-screen h-screen bg-secondary pl-24">{children}</main>
      </div>
    </SessionProvider>
  );
}
