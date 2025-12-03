import { logoutRequest, refreshTokenRequest } from "@/lib/oidc";
import NextAuth, { Account, User } from "next-auth";
import { JWT } from "next-auth/jwt";
import KeycloakProvider from "next-auth/providers/keycloak";

const handler = NextAuth({
  debug: true,
  providers: [
    KeycloakProvider({
      clientId: process.env.NEXT_PUBLIC_KEYCLOAK_ID!,
      clientSecret: process.env.KEYCLOAK_SECRET!,
      issuer: `${process.env.NEXT_PUBLIC_KEYCLOAK_URL}/realms/${process.env.NEXT_PUBLIC_KEYCLOAK_REALM}`,
      profile: (profile) => {
        profile.id = profile.sub;
        return profile;
      },
    }),
  ],
  events: {
    async signOut({ token }) {
      await logoutRequest(token.refresh_token as string);
    },
  },
  callbacks: {
    async jwt({
      token,
      account,
      user,
    }: {
      token: JWT;
      account: Account | null;
      user: User | null;
    }) {
      if (account && account.access_token && account.refresh_token && user) {
        token.access_token = account.access_token;
        token.refresh_token = account.refresh_token;
        token.user = user;
        return token;
      } else {
        try {
          const response = await refreshTokenRequest(token.refresh_token);
          const tokenResult = response.data as unknown as JWT;
          if (response.status !== 200) throw tokenResult;

          return {
            ...token,
            access_token: tokenResult.access_token,
            refresh_token: tokenResult.refresh_token ?? token.refresh_token,
            error: null,
          };
        } catch (e) {
          console.error(e);
          return null as unknown as JWT;
        }
      }
    },

    async session({ session, token }) {
      session.user = token.user;
      session.error = token.error;
      session.access_token = token.access_token;
      return session;
    },
  },
});

export { handler as GET, handler as POST };
