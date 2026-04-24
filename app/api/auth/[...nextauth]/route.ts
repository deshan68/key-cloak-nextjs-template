import { logoutRequest, refreshTokenRequest } from "@/lib/oidc";
import NextAuth from "next-auth";
import type { Account, User } from "next-auth";
import type { JWT } from "next-auth/jwt";
import KeycloakProvider from "next-auth/providers/keycloak";

const handler = NextAuth({
  debug: process.env.NODE_ENV === "development",
  providers: [
    KeycloakProvider({
      clientId: process.env.NEXT_PUBLIC_KEYCLOAK_ID ?? "",
      clientSecret: process.env.KEYCLOAK_SECRET ?? "",
      issuer: `${process.env.NEXT_PUBLIC_KEYCLOAK_URL}/realms/${process.env.NEXT_PUBLIC_KEYCLOAK_REALM}`,
      profile: (profile) => {
        profile.id = profile.sub;
        return profile;
      },
    }),
  ],
  pages: {
    signIn: "/",
    signOut: "/",
    error: "/",
  },
  events: {
    async signOut({ token }) {
      try {
        await logoutRequest(token.refresh_token);
      } catch (error) {
        console.error("Error during Keycloak logout:", error);
      }
    },
  },
  callbacks: {
    async redirect({ url, baseUrl }) {
      if (url.startsWith("/")) {
        return `${baseUrl}${url}`;
      }
      if (url.startsWith(baseUrl)) {
        return url;
      }
      return `${baseUrl}/dashboard`;
    },
    async jwt({
      token,
      account,
      user,
    }: {
      token: JWT;
      account: Account | null;
      user: User | null;
    }): Promise<JWT> {
      if (account && user) {
        console.warn("Initial sign in - storing tokens");

        const expiresAt = Math.floor(
          Date.now() / 1000 + Number(account.expires_in ?? 3600),
        );

        return {
          access_token: account.access_token ?? "",
          refresh_token: account.refresh_token ?? "",
          expires_at: expiresAt,
          user: {
            id: user.id,
            sub: user.sub,
            email: user.email,
            name: user.name,
            email_verified: user.email_verified,
          },
          error: null,
        };
      }

      const now = Math.floor(Date.now() / 1000);
      const isExpired = token.expires_at < now;

      if (!isExpired) {
        console.warn("Token still valid");
        return token;
      }

      console.warn("Token expired, refreshing...");

      try {
        const response = await refreshTokenRequest(token.refresh_token);

        const newExpiresAt = Math.floor(
          Date.now() / 1000 + (response.data.expires_in ?? 3600),
        );

        console.warn("Token refreshed successfully");

        return {
          ...token,
          access_token: response.data.access_token,
          refresh_token: response.data.refresh_token,
          expires_at: newExpiresAt,
          error: null,
        };
      } catch (error) {
        console.error("Token refresh failed:", error);

        return {
          ...token,
          error: "RefreshAccessTokenError",
        };
      }
    },

    async session({ session, token }) {
      if (token.error === "RefreshAccessTokenError") {
        console.warn("Session has expired - token refresh failed");
        session.error = token.error;
      } else {
        session.user = token.user;
        session.access_token = token.access_token;
      }

      return session;
    },
  },
});

export { handler as GET, handler as POST };
