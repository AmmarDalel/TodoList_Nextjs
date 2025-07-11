import { type NextAuthConfig } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { db } from "~/server/db";

export const authConfig = {
  providers: [
    CredentialsProvider({
      name: "Sign in",
      id: "credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "example@example.com",
        },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        if (!credentials?.email || !credentials.password) {
          throw new Error("Email ou mot de passe manquant");
        }

        const user = await db.query.users.findFirst({
          where: (users, { eq }) => eq(users.email, String(credentials.email)),
        });

        if (!user) {
          throw new Error("Utilisateur introuvable");
        }

        const isValid = credentials.password === user.password;

        if (!isValid) {
          console.log("password invalid");
          throw new Error("Mot de passe invalide");
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
        };
      },
    }),
  ],
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) {
        token.sub = user.id;
      }
      return token;
    },
    session: async ({ session, token }) => {
      if (session.user && token.sub) {
        session.user.id = token.sub;
      }
      return session;
    },
  },
  pages: {
    signIn: "/",
    //error: "/",
  },
} satisfies NextAuthConfig;
