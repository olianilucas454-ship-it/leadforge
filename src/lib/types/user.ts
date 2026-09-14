export type UserRole = 'admin' | 'customer' | 'community_member';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  organizationId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Organization {
  id: string;
  name: string;
  subscriptionPlan: string;
  createdAt: string;
  updatedAt: string;
}
