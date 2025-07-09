"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/ui/tabs"
import { CheckCircle2 } from "lucide-react"
import { Alert, AlertDescription } from "../../../components/ui/alert"
import { Login } from "./Login"
import Register from "./Register"

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState("login")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <CheckCircle2 className="w-12 h-12 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Ma Liste de Tâches</h1>
          <p className="text-gray-600">Connectez-vous pour accéder à vos tâches</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-center">Authentification</CardTitle>
            <CardDescription className="text-center">Connectez-vous ou créez un nouveau compte</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Connexion</TabsTrigger>
                <TabsTrigger value="register">Inscription</TabsTrigger>
              </TabsList>

              <TabsContent value="login">
                <Login setError={setError} setSuccess={setSuccess} />
              </TabsContent>
              <TabsContent value="register">
                <Register />
              </TabsContent>
              
              
            </Tabs>

            {error && (
              <Alert className="mt-4 border-red-200 bg-red-50">
                <AlertDescription className="text-red-700">{error}</AlertDescription>
              </Alert>
            )}

            {success && (
              <Alert className="mt-4 border-green-200 bg-green-50">
                <AlertDescription className="text-green-700">{success}</AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        <div className="mt-6 text-center text-sm text-gray-500">
          <p>Compte de test : demo@example.com / password</p>
        </div>
      </div>
    </div>
  )
}
