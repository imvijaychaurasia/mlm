export interface Requirement {
  id: string;
  title: string;
  description: string;
  category: string;
  subcategory: string;
  budget: {
    min: number;
    max: number;
  };
  location: {
    lat: number;
    lng: number;
    address: string;
    city: string;
    state: string;
    pincode: string;
  };
  userId: string;
  userName: string;
  userPhone: string;
  status: 'active' | 'fulfilled' | 'expired' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
  expiresAt: Date;
  responses: number;
}

export interface RequirementFilters {
  category?: string;
  subcategory?: string;
  minBudget?: number;
  maxBudget?: number;
  location?: {
    lat: number;
    lng: number;
    radius: number;
  };
  query?: string;
  userId?: string;
  status?: Requirement['status'];
}

export interface CreateRequirementData {
  title: string;
  description: string;
  category: string;
  subcategory: string;
  budget: {
    min: number;
    max: number;
  };
  location: Requirement['location'];
  userPhone: string;
}

export interface RequirementsPort {
  getRequirements(filters?: RequirementFilters, page?: number, limit?: number): Promise<{
    requirements: Requirement[];
    total: number;
    hasMore: boolean;
  }>;
  getRequirement(id: string): Promise<Requirement | null>;
  createRequirement(data: CreateRequirementData): Promise<Requirement>;
  updateRequirement(id: string, data: Partial<CreateRequirementData>): Promise<Requirement>;
  deleteRequirement(id: string): Promise<void>;
}