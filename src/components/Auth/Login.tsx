"use client";

/* ************************************************************************** */
/*                                Dependencies                                */
/* ************************************************************************** */

// Auth & Navigation
import { signIn } from "next-auth/react";
import { redirect } from "next/navigation";

// Form & Validation
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { type z } from "zod";
import { loginSchema } from "~/app/Validation/login";

// UI Components
import { Label } from "~/components/ui/label";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";

// Icons
import { Mail, Lock } from "lucide-react";

/* ************************************************************************** */
/*                                    Types                                   */
/* ************************************************************************** */

type LoginInput = z.infer<typeof loginSchema>;

/* ************************************************************************** */
/*                             Component Definition                           */
/* ************************************************************************** */

export function Login() {
  /* ************************************************************************ */
  /*                                   Hooks                                  */
  /* ************************************************************************ */

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  /* ************************************************************************ */
  /*                                Functions                                 */
  /* ************************************************************************ */

  const onSubmit = async (data: LoginInput) => {
    const res = await signIn("credentials", {
      ...data,
      redirect: false,
    });

    if (res?.error) {
      setError("root", {
        type: "manual",
        message: "Email ou mot de passe incorrecte !",
      });
      return;
    }

    redirect("/TodoList");
  };

  /* ************************************************************************ */
  /*                                   Render                              */
  /* ************************************************************************ */

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="mx-auto w-full max-w-md space-y-4"
    >
      {/* Champ : Email */}
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <div className="relative">
          <Mail className="absolute top-3 left-3 h-4 w-4 text-gray-400" />
          <Input
            id="email"
            type="email"
            className="pl-10"
            disabled={isSubmitting}
            {...register("email")}
          />
        </div>
        {errors.email && (
          <p className="text-sm text-red-600">{errors.email.message}</p>
        )}
      </div>

      {/* Champ : Mot de passe */}
      <div className="space-y-2">
        <Label htmlFor="password">Mot de passe</Label>
        <div className="relative">
          <Lock className="absolute top-3 left-3 h-4 w-4 text-gray-400" />
          <Input
            id="password"
            type="password"
            className="pl-10"
            disabled={isSubmitting}
            {...register("password")}
          />
        </div>
        {errors.password && (
          <p className="text-sm text-red-600">{errors.password.message}</p>
        )}
      </div>

      {/* Erreur globale (login incorrect) */}
      {errors.root?.message && (
        <p className="text-center text-sm text-red-600">
          {errors.root.message}
        </p>
      )}

      {/* Bouton de soumission */}
      <Button type="submit" className="w-full" disabled={isSubmitting}>
        se connecter
      </Button>
    </form>
  );
}
