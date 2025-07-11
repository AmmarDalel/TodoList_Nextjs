"use client";

import { Button } from "~/components/ui/button";
import { LogOut } from "lucide-react";
import { useSession, signOut } from "next-auth/react";

export default function NavBar() {
  const { data: session } = useSession();
  const userName = session?.user?.name;

  return (
    <nav className="supports-[backdrop-filter]:bg-background/60 flex h-16 items-center border-b bg-red-500/95 backdrop-blur">
      <div className="mr-5 ml-auto flex items-center space-x-15">
        <div className="flex items-center space-x-3">
          <span className="hidden text-sm font-medium sm:inline-block">
            {userName}
          </span>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            void signOut({ callbackUrl: "/" });
          }}
          className="flex items-center space-x-2 bg-transparent"
        >
          <LogOut className="h-4 w-4" />
          <span className="hidden sm:inline">Déconnexion</span>
        </Button>
      </div>
    </nav>
  );
}
