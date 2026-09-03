import { Types } from "mongoose";
import { AppError } from "../../utils/AppError";
import { generateSlug } from "../../utils/slug";
import { Project } from "../projects/project.model";
import { EventSource } from "./event-source.model";
import { CreateEventSourceInput, UpdateEventSourceInput } from "./event-source.validation";

const validateProject = async (organizationId: string, projectId: string) => {
  if (!Types.ObjectId.isValid(projectId)) throw new AppError("Invalid project ID", 400);
  const project = await Project.findOne({ _id: projectId, organizationId });
  if (!project) throw new AppError("Project not found", 404);
  return project;
};

const createUniqueSourceSlug = async (projectId: string, name: string): Promise<string> => {
  const baseSlug = generateSlug(name);
  let slug = baseSlug;
  let counter = 1;
  while (await EventSource.exists({ projectId, slug })) {
    slug = `${baseSlug}-${counter}`;
    counter++;
  }
  return slug;
};

export const createEventSource = async (organizationId: string, projectId: string, userId: string, input: CreateEventSourceInput) => {
  await validateProject(organizationId, projectId);
  const slug = await createUniqueSourceSlug(projectId, input.name);
  return EventSource.create({
    name: input.name,
    slug,
    type: input.type as any,
    environment: input.environment as any,
    organizationId,
    projectId,
    createdBy: userId,
    isActive: true,
  });
};

export const getEventSources = async (organizationId: string, projectId: string) => {
  await validateProject(organizationId, projectId);
  return EventSource.find({ organizationId, projectId }).sort({ createdAt: -1 });
};

export const getEventSourceById = async (organizationId: string, projectId: string, eventSourceId: string) => {
  if (!Types.ObjectId.isValid(eventSourceId)) throw new AppError("Invalid event source ID", 400);
  const eventSource = await EventSource.findOne({ _id: eventSourceId, organizationId, projectId });
  if (!eventSource) throw new AppError("Event source not found", 404);
  return eventSource;
};

export const updateEventSource = async (organizationId: string, projectId: string, eventSourceId: string, input: UpdateEventSourceInput) => {
  const eventSource = await getEventSourceById(organizationId, projectId, eventSourceId);
  if (input.name && input.name !== eventSource.name) {
    eventSource.name = input.name;
    eventSource.slug = await createUniqueSourceSlug(projectId, input.name);
  }
  if (input.type !== undefined) eventSource.type = input.type as any;
  if (input.environment !== undefined) eventSource.environment = input.environment as any;
  if (input.isActive !== undefined) eventSource.isActive = input.isActive;
  await eventSource.save();
  return eventSource;
};