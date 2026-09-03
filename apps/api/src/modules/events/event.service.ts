import { Types } from "mongoose";
import { AppError } from "../../utils/AppError";
import { Project } from "../projects/project.model";
import { EventDefinition } from "./event.model";
import { CreateEventDefinitionInput, UpdateEventDefinitionInput } from "./event.validation";

const  validateProject = async (organizationId: string, projectId: string) => {
    if(!Types.ObjectId.isValid(organizationId)) {
        throw new AppError("Invalid organization ID", 400);
    }
    if(!Types.ObjectId.isValid(projectId)) {
        throw new AppError("Invalid project ID", 400);
    }
    const project = await Project.findOne({ _id: projectId, organizationId });
    if(!project) {
        throw new AppError("Project not found", 404);
    }
    return project;
}

export const createEventDefinition = async ( organizationId: string, projectId: string, input: CreateEventDefinitionInput, userId: string ) => {
    await validateProject(organizationId, projectId);
    const exisitingEvent = await EventDefinition.findOne({ projectId, name: input.name });

    if(exisitingEvent) {
        throw new AppError("Event with this name already exists", 400);
    }
    return EventDefinition.create({
      name: input.name,
      displayName: input.displayName,
      description: input.description,

      organizationId,
      projectId,
      createdBy: userId,
    });
}

export const getEventDefinitions = async (organizationId: string, projectId: string, page: number, limit: number) => {
    await validateProject(organizationId, projectId);
    const skip = (page - 1) * limit;

    const [events,total] = await Promise.all([
        EventDefinition.find({ projectId }).sort({ createdAt: -1 }).skip(skip).limit(limit),
        EventDefinition.countDocuments({ projectId })
    ]);
    return {
      events,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
}

export const getEventDefinitionById = async (organizationId: string, projectId: string, eventId: string) => {
    if(!Types.ObjectId.isValid(eventId)) {
        throw new AppError("Invalid event ID", 400);
    }
    const event = await EventDefinition.findOne({ _id: eventId, projectId, organizationId });
    if(!event) {
        throw new AppError("Event not found", 404);
    }
    return event;
}

export const updateEventDefinition = async (organizationId: string, projectId: string, eventId: string, input: UpdateEventDefinitionInput, userId: string) => {
    const event = await getEventDefinitionById(organizationId, projectId, eventId);
    if(input.displayName !== undefined){
        const exisitingEvent = await EventDefinition.findOne({ projectId, displayName: input.displayName });

        if(exisitingEvent) {
            throw new AppError("Event with this displayName already exists", 400);
        }
        event.displayName = input.displayName;
    }
    
    await event.save();
    return event;
}

