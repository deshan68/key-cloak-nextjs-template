import type { userService } from ".";
import type { User } from "./user.types";

export interface ApiUser {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: "app_user" | "app_admin";
  created_at: string;
  updated_at: string;
}

export interface CreateUserRequest {
  email: string;
  first_name: string;
  last_name: string;
  role: "app_user" | "app_admin";
}

export interface UpdateUserRequest {
  first_name?: string;
  last_name?: string;
  role?: "app_user" | "app_admin";
}

export interface UsersListResponse {
  data: User[];
  total: number;
  page: number;
  limit: number;
}

export interface UserFilters {
  page?: number;
  limit?: number;
  role?: "app_user" | "app_admin";
  search?: string;
}

export type UpdateUserVariables = {
  userId: string;
  updates: UpdateUserRequest;
};
export type DeleteUserResult = Awaited<
  ReturnType<typeof userService.deleteUser>
>;
