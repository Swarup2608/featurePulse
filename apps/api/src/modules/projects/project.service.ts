import { Types } from "mongoose";

import { AppError } from "../../utils/AppError";
import { generateSlug } from "../../utils/slug";

import { Project } from "./project.model";
import { CreateProjectInput, UpdateProjectInput, } from "./project.validation";

const createUniqueProjectSlug = async ( organizationId: string, name: string ): Promise<string> => {
  const baseSlug = generateSlug(name);

  let slug = baseSlug;
  let counter = 1;

  while ( await Project.exists({ organizationId, slug, }) ) {
    slug = `${baseSlug}-${counter}`;
    counter++;
  }

  return slug;
};

export const createProject = async ( organizationId: string, userId: string, input: CreateProjectInput ) => {
  const slug = await createUniqueProjectSlug( organizationId, input.name );

  const project = await Project.create({
    name: input.name,
    slug,
    description: input.description,
    organizationId,
    createdBy: userId,
  });

  return project;
};

export const getProjects = async ( organizationId: string, page: number, limit: number ) => {
  const skip = (page - 1) * limit;

  const [projects, total] = await Promise.all([
    Project.find({ organizationId, }).sort({ createdAt: -1,}).skip(skip).limit(limit),

    Project.countDocuments({ organizationId, }),
  ]);

  return {
    projects,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const getProjectById = async ( organizationId: string, projectId: string ) => {
  if (!Types.ObjectId.isValid(projectId)) {
    throw new AppError("Invalid project ID", 400);
  }

  const project = await Project.findOne({ _id: projectId, organizationId, });

  if (!project) {
    throw new AppError("Project not found", 404);
  }

  return project;
};

export const updateProject = async ( organizationId: string, projectId: string, input: UpdateProjectInput ) => {
  const project = await getProjectById( organizationId, projectId );

  if (input.name && input.name !== project.name) {
    project.name = input.name;
    project.slug = await createUniqueProjectSlug( organizationId, input.name );
  }

  if (input.description !== undefined) {
    project.description = input.description;
  }

  if (input.status !== undefined) {
    project.status = input.status;
  }

  await project.save();

  return project;
};

export const deleteProject = async ( organizationId: string, projectId: string ) => {
  const project = await getProjectById( organizationId, projectId );
  await project.deleteOne();
  return {
    id: project._id,
  };
};
