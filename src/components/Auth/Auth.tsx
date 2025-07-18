"use client";

/* ************************************************************************** */
/*                                Dependencies                                */
/* ************************************************************************** */
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { CheckCircle2 } from "lucide-react";
import { Login } from "./Login";
import Register from "./Register";

/* ************************************************************************** */
/*                             Component Definition                           */
/* ************************************************************************** */
export default function AuthPage() {
  /* ************************************************************************** */
  /*                                   State                                   */
  /* ************************************************************************** */
  const [activeTab, setActiveTab] = useState("login");

  /* ************************************************************************** */
  /*                                   Render                                  */
  /* ************************************************************************** */
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-md">
        {/* Header avec icône et titre */}
        <div className="mb-8 text-center">
          <div className="mb-4 flex items-center justify-center">
            <CheckCircle2 className="h-12 w-12 text-blue-600" />
          </div>
          <h1 className="mb-2 text-3xl font-bold text-gray-800">
            Ma Liste de Tâches
          </h1>
          <p className="text-gray-600">
            Connectez-vous pour accéder à vos tâches
          </p>
        </div>

        {/* Card principale contenant les onglets */}
        <Card>
          <CardHeader>
            <CardTitle className="text-center">Authentification</CardTitle>
            <CardDescription className="text-center">
              Connectez-vous ou créez un nouveau compte
            </CardDescription>
          </CardHeader>

          <CardContent>
            {/* Tabs pour switcher entre Login et Register */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Connexion</TabsTrigger>
                <TabsTrigger value="register">Inscription</TabsTrigger>
              </TabsList>

              <TabsContent value="login">
                <Login />
              </TabsContent>

              <TabsContent value="register">
                <Register />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Informations supplémentaires / compte de test */}
        <div className="mt-6 text-center text-sm text-gray-500">
          <p>Compte de test : demo@example.com / password</p>
        </div>
      </div>
    </div>
  );
}
