import { Types } from "mongoose";
import { AppError } from "../../utils/AppError";
import { generateSlug } from "../../utils/slug";

import { Project } from "../projects/project.model";

import { Feature } from "./feature.model";
import { FeatureStatus } from "./feature.types";
import { canTransitionFeatureStatus } from "./feature.state";
import { CreateFeatureInput, UpdateFeatureInput } from "./feature.validation";

const validationProject = async (organizationId: string, projectId: string) => {
  if (!Types.ObjectId.isValid(projectId)) throw new AppError("Invalid project ID", 400);
  const project = await Project.findOne({ _id: projectId, organizationId });
  if (!project) throw new AppError("Project not found", 404);
  return project;
};

const createUniqueFeatureSlug = async (projectId: string, name: string): Promise<string> => {
  const baseSlug = generateSlug(name);
  let slug = baseSlug;
  let counter = 1;
  while (await Feature.exists({ projectId, slug })) {
    slug = `${baseSlug}-${counter}`;
    counter++;
  }
  return slug;
};

export const createFeature = async (organizationId: string, projectId: string, userId: string, input: CreateFeatureInput) => {
  await validationProject(organizationId, projectId);
  const slug = await createUniqueFeatureSlug(projectId, input.name);
  return Feature.create({
    name: input.name,
    slug,
    description: input.description,
    organizationId,
    projectId,
    createdBy: userId,
    status: FeatureStatus.DRAFT,
  });
};

export const getFeatures = async (organizationId: string, projectId: string, page: number, limit: number) => {
  await validationProject(organizationId, projectId);
  const skip = (page - 1) * limit;
  const [features, total] = await Promise.all([
    Feature.find({ organizationId, projectId }).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Feature.countDocuments({ organizationId, projectId }),
  ]);
  return {
    features,
    pagination: {
      page,
      total,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const getFeatureById = async (organizationId: string, projectId: string, featureId: string) => {
  if (!Types.ObjectId.isValid(featureId)) throw new AppError("Invalid feature ID", 400);
  const feature = await Feature.findOne({ _id: featureId, organizationId, projectId });
  if (!feature) throw new AppError("Feature not found", 404);
  return feature;
};

export const updateFeature = async ( organizationId: string, projectId: string, featureId: string, input: UpdateFeatureInput ) => {
  const feature = await getFeatureById(organizationId, projectId, featureId);

  if (input.status && input.status !== feature.status) {
    const nextStatus = input.status as FeatureStatus;
    if (!canTransitionFeatureStatus(feature.status, nextStatus)) {
      throw new AppError(`Cannot transition feature from ${feature.status} to ${nextStatus}`, 400);
    }
    feature.status = nextStatus;
    if (nextStatus === FeatureStatus.RELEASED) feature.releasedAt = new Date();
  }

  if (input.name && input.name !== feature.name) {
    feature.name = input.name;
    feature.slug = await createUniqueFeatureSlug(projectId, input.name);
  }

  if (input.description !== undefined) {
    feature.description = input.description;
  }

  await feature.save();
  return feature;
};

export const archiveFeature = async ( organizationId: string, projectId: string, featureId: string ) => {
  return updateFeature(
    organizationId,
    projectId,
    featureId,
    {
      status: FeatureStatus.ARCHIVED,
    }
  );
};