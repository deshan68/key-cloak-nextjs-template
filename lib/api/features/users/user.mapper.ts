import type { ApiUser } from "./user.api.types";
import type { User } from "./user.types";

export const userMapper = {
  toDomain(api: ApiUser): User {
    return {
      id: api.id,
      email: api.email,
      firstName: api.first_name,
      lastName: api.last_name,
      role: api.role,
      createdAt: new Date(api.created_at).toISOString(),
      updatedAt: new Date(api.updated_at).toISOString(),
    };
  },
};
