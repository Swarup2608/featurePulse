import { FeatureStatus } from "./feature.types";

const validTransitions: Record<FeatureStatus, FeatureStatus[]> = {
  [FeatureStatus.DRAFT]: [FeatureStatus.ACTIVE, FeatureStatus.ARCHIVED],
  [FeatureStatus.ACTIVE]: [FeatureStatus.RELEASED, FeatureStatus.ARCHIVED],
  [FeatureStatus.RELEASED]: [FeatureStatus.ARCHIVED],
  [FeatureStatus.ARCHIVED]: [],
};

export const canTransitionFeatureStatus = (currentStatus: FeatureStatus, nextStatus: FeatureStatus): boolean => {
  return validTransitions[currentStatus].includes(nextStatus);
};