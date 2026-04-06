"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { SidebarProvider, useSidebar } from "@/lib/sidebar-context";
import Sidebar from "@/components/layout/Sidebar";
import MobileNav from "@/components/layout/MobileNav";

function LayoutInner({ children }: { children: React.ReactNode }) {
  const { currentUser, isLoading } = useAuth();
  const router = useRouter();
  const { collapsed } = useSidebar();

  useEffect(() => {
    if (!isLoading && !currentUser) {
      router.push("/login");
    }
  }, [isLoading, currentUser, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="w-8 h-8 skeleton rounded-full mx-auto mb-3" />
          <div className="w-32 h-4 skeleton mx-auto" />
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Desktop sidebar */}
      <div className="hidden lg:block">
        <Sidebar />
      </div>

      {/* Mobile nav */}
      <div className="lg:hidden">
        <MobileNav />
      </div>

      {/* Main content */}
      <main
        className="pt-14 lg:pt-0 min-h-screen transition-all duration-200"
        style={{ marginLeft: undefined }}
      >
        <div className={`hidden lg:block ${collapsed ? "ml-16" : "ml-64"}`}>
          <div className="p-4 lg:p-6">{children}</div>
        </div>
        <div className="lg:hidden">
          <div className="p-4 lg:p-6">{children}</div>
        </div>
      </main>
    </div>
  );
}

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <LayoutInner>{children}</LayoutInner>
    </SidebarProvider>
  );
}
