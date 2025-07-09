import { type NextAuthConfig } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { db } from "~/server/db";

export const authConfig = {
  providers: [
    CredentialsProvider({
      name: 'Sign in',
      id: 'credentials',
      credentials: {
        email: {
          label: 'Email',
          type: 'email',
          placeholder: 'example@example.com',
        },
        password: { label: 'Password', type: 'password' },
      },
     async authorize(credentials) {
  console.log('credentials reçus:', credentials);

  if (!credentials?.email || !credentials.password) {
    console.log('email ou password manquant');
    return null;
  }

  const user = await db.query.users.findFirst({
    where: (users, { eq }) => eq(users.email, String(credentials.email)),
  });

  console.log('utilisateur trouvé:', user);

  if (!user) {
    console.log('utilisateur introuvable');
    return null;
  }

  const isValid = 
    String(credentials.password)=== user.password!;
 

  if (!isValid) {
    console.log('mot de passe invalide');
    return null;
  }

  console.log('Connexion réussie');

  return {
    id: user.id,
    email: user.email,
    name: user.name,
  };
}

    }),
  ],
  callbacks: {
  jwt : async({ token, user }) =>{
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
}
} satisfies NextAuthConfig;
