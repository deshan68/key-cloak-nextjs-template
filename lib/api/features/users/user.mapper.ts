import type { ApiUser } from "./user.api.types";
import type { User } from "./user.types";

export const userMapper = {
  toDomain(api: ApiUser): User {
    return {
      id: api.id,
      userName: api.user_name,
      name: api.name,
      dpUrl: api.dp_url,
      email: api.email,
      teamId: api.team_id,
      role: api.role,
      isActive: api.is_active,
      isVerified: api.is_verified,
    };
  },
};
