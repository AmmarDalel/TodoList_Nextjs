import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string({ required_error: "L'email est requis" })
    .email("Veuillez saisir un email valide"),

  password: z
    .string({ required_error: "Le mot de passe est requis" })
    .min(8, "Le mot de passe doit contenir au moins 8 caractères"),
});

export type LoginInput = z.infer<typeof loginSchema>;
