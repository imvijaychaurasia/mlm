import { User } from './auth.port';
import { Listing } from './listings.port';
import { Requirement } from './requirements.port';
import { Payment } from './payments.port';

export interface AdminStats {
  totalUsers: number;
  totalListings: number;
  totalRequirements: number;
  totalPayments: number;
  revenue: number;
  activeUsers: number;
  pendingApprovals: number;
}

export interface ModerationAction {
  id: string;
  entityType: 'listing' | 'requirement' | 'user';
  entityId: string;
  action: 'approve' | 'reject' | 'suspend' | 'ban';
  reason?: string;
  moderatorId: string;
  createdAt: Date;
}

export interface AdminPort {
  getStats(): Promise<AdminStats>;
  getUsers(filters?: any, page?: number, limit?: number): Promise<{
    users: User[];
    total: number;
    hasMore: boolean;
  }>;
  updateUserRole(userId: string, role: User['role']): Promise<User>;
  suspendUser(userId: string, reason?: string): Promise<void>;
  getListingsForModeration(page?: number, limit?: number): Promise<{
    listings: Listing[];
    total: number;
    hasMore: boolean;
  }>;
  moderateListing(listingId: string, action: 'approve' | 'reject', reason?: string): Promise<Listing>;
  getRequirementsForModeration(page?: number, limit?: number): Promise<{
    requirements: Requirement[];
    total: number;
    hasMore: boolean;
  }>;
  moderateRequirement(requirementId: string, action: 'approve' | 'reject', reason?: string): Promise<Requirement>;
  getModerationHistory(page?: number, limit?: number): Promise<{
    actions: ModerationAction[];
    total: number;
    hasMore: boolean;
  }>;
}