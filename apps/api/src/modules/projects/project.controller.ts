import { Request, Response } from "express";
import { AppError } from "../../utils/AppError";
import { asyncHandler } from "../../utils/asyncHandler";

import { createProject, deleteProject, getProjectById, getProjects, updateProject } from "./project.service";
import { createProjectSchema, updateProjectSchema } from "./project.validation";

export const createController = asyncHandler(async (req: Request, res: Response) => {
    if (!req.userId) {
        throw new AppError("Authentication Required!", 401);
    }

    const organizationId = req.params.organizationId;
    if (!organizationId || Array.isArray(organizationId)) {
        throw new AppError("Organization ID is required", 400);
    }

    const validatedData = createProjectSchema.parse(req.body);
    const project = await createProject(organizationId, req.userId, validatedData);

    res.status(201).json({
        success: true,
        message: "Project created successfully!",
        data: {
            project,
        },
    });
});

export const getAllController = asyncHandler(async (req: Request, res: Response) => {
    const organizationId = req.params.organizationId;
    if (!organizationId || Array.isArray(organizationId)) {
        throw new AppError("Organization ID is required", 400);
    }

    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 10));
    const result = await getProjects(organizationId, page, limit);

    res.status(200).json({
        success: true,
        data: result,
    });
});

export const getById = asyncHandler(async (req: Request, res: Response) => {
    const organizationId = req.params.organizationId;
    if (!organizationId || Array.isArray(organizationId)) {
        throw new AppError("Organization ID is required", 400);
    }

    const projectId = req.params.projectId;
    if (!projectId || Array.isArray(projectId)) {
        throw new AppError("Project ID is required", 400);
    }

    const project = await getProjectById(organizationId, projectId);

    res.status(200).json({
        success: true,
        data: {
            project,
        },
    });
});

export const update = asyncHandler(async (req: Request, res: Response) => {
    const organizationId = req.params.organizationId;
    if (!organizationId || Array.isArray(organizationId)) {
        throw new AppError("Organization ID is required", 400);
    }

    const projectId = req.params.projectId;
    if (!projectId || Array.isArray(projectId)) {
        throw new AppError("Project ID is required", 400);
    }

    const validatedData = updateProjectSchema.parse(req.body);
    const project = await updateProject(organizationId, projectId, validatedData);

    res.status(200).json({
        success: true,
        message: "Project updated successfully",
        data: {
            project,
        },
    });
});

export const remove = asyncHandler(async (req: Request, res: Response) => {
    const organizationId = req.params.organizationId;
    if (!organizationId || Array.isArray(organizationId)) {
        throw new AppError("Organization ID is required", 400);
    }

    const projectId = req.params.projectId;
    if (!projectId || Array.isArray(projectId)) {
        throw new AppError("Project ID is required", 400);
    }

    await deleteProject(organizationId, projectId);

    res.status(200).json({
        success: true,
        message: "Project deleted successfully",
    });
});
