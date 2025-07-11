"use client";

import { signIn } from "next-auth/react";
import { type z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Label } from "~/components/ui/label";
import { Input } from "~/components/ui/input";
import { Mail, Lock } from "lucide-react";
import { loginSchema } from "~/app/Validation/login";
import { Button } from "~/components/ui/button";
import { redirect } from "next/navigation";

type LoginInput = z.infer<typeof loginSchema>;

export function Login() {
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

  const onSubmit = async (data: LoginInput) => {
    const res = await signIn("credentials", {
      ...data,
      redirect: false,
    });

    if (res?.error) {
      setError("root", {
        type: "manual",
        message: "Email ou mot de passe incorrecte ! ",
      });
    }

    redirect("/TodoList");
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="mx-auto w-full max-w-md space-y-4"
    >
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

      {errors.root?.message && (
        <p className="text-center text-sm text-red-600">
          {errors.root.message}
        </p>
      )}

      <Button type="submit" className="w-full">
        se connecter
      </Button>
    </form>
  );
}
