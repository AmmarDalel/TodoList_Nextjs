/* ************************************************************************** */
/*                             Dependencies                                  */
/* ************************************************************************** */
import { type NextAuthConfig } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { db } from "~/server/db";

/* ************************************************************************** */
/*                            NextAuth Configuration                         */
/* ************************************************************************** */
export const authConfig = {
  /* ************************************************************************** */
  /*                            Providers Setup                               */
  /* ************************************************************************** */
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

      /* ************************************************************************** */
      /*                             Authorization Logic                          */
      /* ************************************************************************** */
      authorize: async (credentials) => {
        if (!credentials?.email || !credentials.password) {
          throw new Error("Email ou mot de passe manquant");
        }

        // Recherche de l'utilisateur dans la base par email
        const user = await db.query.users.findFirst({
          where: (users, { eq }) => eq(users.email, String(credentials.email)),
        });

        if (!user) {
          throw new Error("Utilisateur introuvable");
        }

        // Vérification simple du mot de passe (à remplacer par un hash sécurisé)
        const isValid = credentials.password === user.password;

        if (!isValid) {
          console.log("password invalid");
          throw new Error("Mot de passe invalide");
        }

        // Retour des informations utilisateur pour la session
        return {
          id: user.id,
          email: user.email,
          name: user.name,
        };
      },
    }),
  ],

  /* ************************************************************************** */
  /*                             Callbacks                                     */
  /* ************************************************************************** */
  callbacks: {
    // Ajout de l'id utilisateur au token JWT
    jwt: async ({ token, user }) => {
      if (user) {
        token.sub = user.id;
      }
      return token;
    },
    // Ajout de l'id utilisateur à la session
    session: async ({ session, token }) => {
      if (session.user && token.sub) {
        session.user.id = token.sub;
      }
      return session;
    },
  },

  /* ************************************************************************** */
  /*                             Pages Customization                          */
  /* ************************************************************************** */
  pages: {
    signIn: "/", // Page de connexion personnalisée (home ici)
    // error: "/", // Possibilité d'ajouter une page d'erreur
  },
} satisfies NextAuthConfig;
