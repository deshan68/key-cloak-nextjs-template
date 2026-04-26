import axios from "axios";
import { jwtDecode, type JwtPayload } from "jwt-decode";

const params = {
  client_id: process.env.NEXT_PUBLIC_KEYCLOAK_ID || "",
  client_secret: process.env.KEYCLOAK_SECRET || "",
  grant_type: "refresh_token",
};

export const oidc = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_KEYCLOAK_URL}/realms/${process.env.NEXT_PUBLIC_KEYCLOAK_REALM}/protocol/openid-connect`,
  headers: {
    "Content-Type": "application/x-www-form-urlencoded",
  },
  withCredentials: true,
});

export const _refreshTokenRequest = (refresh_token: string) => {
  return oidc({
    method: "POST",
    url: "/token",
    data: new URLSearchParams({
      refresh_token,
      ...params,
    }),
  });
};

export const _logoutRequest = (refresh_token: string) => {
  return oidc({
    method: "POST",
    url: "/logout",
    data: new URLSearchParams({
      refresh_token,
      ...params,
    }),
  });
};

type TokenResponse = {
  access_token: string;
  refresh_token: string;
  expires_in: number;
};

/**
 * Refresh the access token using the refresh token
 * @throws Error if refresh fails
 */
export async function refreshTokenRequest(refreshToken: string) {
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_KEYCLOAK_URL}/realms/${process.env.NEXT_PUBLIC_KEYCLOAK_REALM}/protocol/openid-connect/token`,
      new URLSearchParams({
        client_id: process.env.NEXT_PUBLIC_KEYCLOAK_ID ?? "",
        client_secret: process.env.KEYCLOAK_SECRET ?? "",
        grant_type: "refresh_token",
        refresh_token: refreshToken,
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        withCredentials: true,
      },
    );

    const data = response.data as TokenResponse;

    return {
      status: response.status,
      data: {
        access_token: data.access_token,
        refresh_token: data.refresh_token,
        expires_in: data.expires_in,
      },
    };
  } catch (error) {
    console.error("❌ Token refresh failed:", error);
    throw error;
  }
}

/**
 * Logout from Keycloak - revokes refresh token
 * This should be called when user signs out
 */
export async function logoutRequest(refreshToken: string) {
  if (!refreshToken) {
    console.warn("⚠️ No refresh token provided for logout");
    return;
  }

  try {
    await axios.post(
      `${process.env.NEXT_PUBLIC_KEYCLOAK_URL}/realms/${process.env.NEXT_PUBLIC_KEYCLOAK_REALM}/protocol/openid-connect/logout`,
      new URLSearchParams({
        client_id: process.env.NEXT_PUBLIC_KEYCLOAK_ID ?? "",
        client_secret: process.env.KEYCLOAK_SECRET ?? "",
        refresh_token: refreshToken,
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      },
    );
    console.warn("Successfully logged out from Keycloak");
  } catch (error) {
    console.error("❌ Keycloak logout failed:", error);
    // Don't throw - logout should still complete even if Keycloak request fails
  }
}

/**
 * Check if token is revoked or blacklisted
 * "Token is not active" usually means:
 * 1. Token was revoked
 * 2. User logged out elsewhere
 * 3. User's session was invalidated
 * 4. Token lifespan exceeded
 */
export function isTokenRevoked(token: string): boolean {
  try {
    const decoded: JwtPayload = jwtDecode(token);
    const now = Math.floor(Date.now() / 1000);

    if (!decoded.exp) {
      console.warn("Token does not have exp claim - treating as revoked");
      return true;
    }

    if (now >= decoded.exp) return true;

    return false;
  } catch (error) {
    console.error("Error decoding token:", error);
    return false;
  }
}
