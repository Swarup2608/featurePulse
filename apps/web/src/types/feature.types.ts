export type FeatureStatus = "DRAFT" | "ACTIVE" | "RELEASED" | "ARCHIVED";

export interface Feature {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  organizationId: string;
  projectId: string;
  createdBy: string;
  status: FeatureStatus;
  releasedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface FeaturePagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface FeaturesResponse {
  features: Feature[];
  pagination: FeaturePagination;
}

export interface CreateFeatureInput {
  name: string;
  description?: string;
}

export interface UpdateFeatureInput {
  name?: string;
  description?: string;
  status?: FeatureStatus;
}
