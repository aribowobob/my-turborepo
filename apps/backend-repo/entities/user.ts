import { User } from "../../../packages/shared/user";

// Re-export the shared User interface
export { User };

// You can extend the User interface here if needed for backend-specific properties
export interface ExtendedUser extends User {
  // Backend-specific properties can be added here
}
