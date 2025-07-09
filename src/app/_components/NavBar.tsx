"use client"

import { Button } from "~/components/ui/button"
import { LogOut } from "lucide-react"
import { useSession, signOut } from "next-auth/react"

export default function NavBar() {
  const { data: session } = useSession()
  const userName = session?.user?.name

  return (
   <nav className=" flex items-center border-b bg-red-500/95  h-16 backdrop-blur supports-[backdrop-filter]:bg-background/60">
     

        <div className="flex items-center space-x-15 ml-auto mr-5 ">
          <div className="flex items-center space-x-3">
            <span className="text-sm font-medium hidden sm:inline-block">{userName}</span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              void signOut({ callbackUrl: "/" })
            }}
            className="flex items-center space-x-2 bg-transparent"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">Déconnexion</span>
          </Button>
       
      </div>
    </nav>
  )
}
