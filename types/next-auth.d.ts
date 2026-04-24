import "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    access_token: string;
    error?: string | null;
    user: {
      id: string;
      sub: string;
      email: string;
      name: string;
      email_verified: boolean;
    };
  }

  interface User {
    id: string;
    sub: string;
    email: string;
    name: string;
    email_verified: boolean;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    access_token: string;
    refresh_token: string;
    expires_at: number;
    user: {
      id: string;
      sub: string;
      email: string;
      name: string;
      email_verified: boolean;
    };
    error?: string | null;
  }
}
