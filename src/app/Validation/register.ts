import { z } from "zod";

const baseRegisterSchema = z.object({
  name: z.string().min(1, "Nom requis"),
  email: z.string().min(1, "Email requis").email("Email invalide"),
  password: z
    .string()
    .min(1, "Mot de passe requis")
    .min(8, "Le mot de passe doit contenir au moins 8 caractères")
    .refine(
      (val) =>
        /[a-z]/.test(val) &&
        /[A-Z]/.test(val) &&
        /[0-9]/.test(val) &&
        /[^A-Za-z0-9]/.test(val),
      {
        message:
          "Le mot de passe doit contenir au moins une lettre minuscule, une lettre majuscule, un chiffre et un caractère spécial",
      },
    ),
  confirmPassword: z.string().min(1, "Confirmé le mot de passe requis"),
});

export const registerSchema = baseRegisterSchema.refine(
  (data) => data.password === data.confirmPassword,
  {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"],
  },
);

export const registerInputSchema = baseRegisterSchema.pick({
  name: true,
  email: true,
  password: true,
  confirmPassword: true,
});
