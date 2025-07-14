"use client";

/* ************************************************************************** */
/*                                Dependencies                                */
/* ************************************************************************** */

//  Auth & Validation
import { api } from "~/trpc/react";
import { registerSchema } from "~/app/Validation/register";
import { type z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

// UI Components
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "~/components/ui/card";

//  Icons
import { Loader2, Lock, Mail, User } from "lucide-react";

/* ************************************************************************** */
/*                                    Types                                   */
/* ************************************************************************** */

type FormData = z.infer<typeof registerSchema>;

/* ************************************************************************** */
/*                             Component Definition                           */
/* ************************************************************************** */

export default function Register() {
  /* ************************************************************************ */
  /*                                   Hooks                                  */
  /* ************************************************************************ */

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  // Mutation TRPC pour enregistrer l'utilisateur
  const registerMutation = api.users.register.useMutation({
    onSuccess: () => {
      reset(); // Réinitialise le formulaire après succès
    },
  });

  /* ************************************************************************ */
  /*                                Functions                                 */
  /* ************************************************************************ */

  const onSubmit = async (data: FormData) => {
    try {
      registerMutation.mutate(data);
    } catch (error) {
      console.error("Erreur lors de l'inscription :", error);
    }
  };

  /* ************************************************************************ */
  /*                                   Render                               */
  /* ************************************************************************ */

  return (
    <div className="mx-auto max-w-md p-4">
      <Card>
        <CardHeader>
          <CardTitle>Créer un compte</CardTitle>
          <CardDescription>
            Inscrivez-vous pour accéder à vos tâches
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4"
            noValidate
          >
            {/* Champ : Nom complet */}
            <div>
              <Label htmlFor="name">Nom complet</Label>
              <div className="relative">
                <User className="absolute top-3 left-3 h-4 w-4 text-gray-400" />
                <Input
                  id="name"
                  type="text"
                  placeholder="Votre nom"
                  className="pl-10"
                  disabled={registerMutation.isPending}
                  {...register("name")}
                />
              </div>
              {errors.name && (
                <p className="text-sm text-red-600">{errors.name.message}</p>
              )}
            </div>

            {/* Champ : Email */}
            <div>
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute top-3 left-3 h-4 w-4 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="votre@email.com"
                  className="pl-10"
                  disabled={registerMutation.isPending}
                  {...register("email")}
                />
              </div>
              {errors.email && (
                <p className="text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            {/* Champ : Mot de passe */}
            <div>
              <Label htmlFor="password">Mot de passe</Label>
              <div className="relative">
                <Lock className="absolute top-3 left-3 h-4 w-4 text-gray-400" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  className="pl-10"
                  disabled={registerMutation.isPending}
                  {...register("password")}
                />
              </div>
              {errors.password && (
                <p className="text-sm text-red-600">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Champ : Confirmation mot de passe */}
            <div>
              <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
              <div className="relative">
                <Lock className="absolute top-3 left-3 h-4 w-4 text-gray-400" />
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  className="pl-10"
                  disabled={registerMutation.isPending}
                  {...register("confirmPassword")}
                />
              </div>
              {errors.confirmPassword && (
                <p className="text-sm text-red-600">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            {/* Bouton de soumission */}
            <Button
              type="submit"
              className="w-full"
              disabled={registerMutation.isPending}
            >
              {registerMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Création...
                </>
              ) : (
                "Créer un compte"
              )}
            </Button>

            {/* Message d'erreur global */}
            {registerMutation.isError && (
              <p className="text-sm text-red-600">
                {registerMutation.error.message}
              </p>
            )}

            {/* Message de succès */}
            {registerMutation.isSuccess && (
              <p className="text-sm text-green-600">
                Compte créé avec succès ! Vous pouvez maintenant vous connecter.
              </p>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
