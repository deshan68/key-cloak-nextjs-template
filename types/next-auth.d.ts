import "next-auth";
import { ProviderType } from "next-auth/providers/index";

declare module "next-auth/jwt" {
  interface JWT {
    access_token: string;
    refresh_token: string;
    refresh_expires_in: number;
    expires_in: number;
    user: {
      sub: string;
      email_verified: boolean;
      name: string;
      preferred_username: string;
      given_name: string;
      family_name: string;
      email: string;
      id: string;
    };
    error?: string | null;
  }
}

interface Account {
  provider: string;
  type: ProviderType;
  id: string;
  access_token: string;
  refresh_token: string;
  idToken: string;
  expires_in: number;
  refresh_expires_in: number;
  token_type: string;
  id_token: string;
  "not-before-policy": number;
  session_state: string;
  scope: string;
}

declare module "next-auth" {
  // Define custom session properties
  interface Session {
    user: {
      sub: string;
      email_verified: boolean;
      name: string;
      preferred_username: string;
      given_name: string;
      family_name: string;
      email: string;
      id: string;
    };
    error?: string | null;
    access_token: string;
  }

  interface User {
    sub: string;
    email_verified: boolean;
    name: string;
    preferred_username: string;
    given_name: string;
    family_name: string;
    email: string;
    id: string;
  }
}
