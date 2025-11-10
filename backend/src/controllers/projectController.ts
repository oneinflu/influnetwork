import { Request, Response } from 'express';
import { catchAsync, sendSuccessResponse, sendPaginatedResponse } from '../middleware/errorHandler';
import {
  listProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  updateMilestoneStatus,
  getProjectsByClient,
  getProjectStats,
  IProjectFilter
} from '../services/projectService';

export const getAllProjects = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const sortBy = (req.query.sortBy as string) || 'createdAt';
  const sortOrder = (req.query.sortOrder as 'asc' | 'desc') || 'desc';

  const filter: IProjectFilter = {};

  // Status filter
  if (req.query.status) {
    filter.status = req.query.status as string;
  }

  // Campaign type filter
  if (req.query.campaignType) {
    filter.campaignType = req.query.campaignType as string;
  }

  // Client filter
  if (req.query.clientId) {
    filter.clientId = req.query.clientId as string;
  }

  // Date range filters
  if (req.query.startDateFrom || req.query.startDateTo) {
    filter.startDate = {};
    if (req.query.startDateFrom) {
      filter.startDate.$gte = new Date(req.query.startDateFrom as string);
    }
    if (req.query.startDateTo) {
      filter.startDate.$lte = new Date(req.query.startDateTo as string);
    }
  }

  if (req.query.endDateFrom || req.query.endDateTo) {
    filter.endDate = {};
    if (req.query.endDateFrom) {
      filter.endDate.$gte = new Date(req.query.endDateFrom as string);
    }
    if (req.query.endDateTo) {
      filter.endDate.$lte = new Date(req.query.endDateTo as string);
    }
  }

  // Search filter
  if (req.query.search) {
    const searchRegex = new RegExp(String(req.query.search), 'i');
    filter.$or = [
      { campaignName: searchRegex },
      { description: searchRegex }
    ];
  }

  const result = await listProjects(filter, page, limit, sortBy, sortOrder);
  sendPaginatedResponse(res, result.data, result.total, result.page, result.limit, 'Projects retrieved successfully');
});

export const getProject = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const project = await getProjectById(req.params.id);
  if (!project) {
    res.status(404).json({ success: false, message: 'Project not found' });
    return;
  }
  sendSuccessResponse(res, { project }, 'Project retrieved successfully');
});

export const addProject = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const payload = { ...req.body, createdBy: req.user?._id };
  const project = await createProject(payload);
  sendSuccessResponse(res, { project }, 'Project created successfully', 201);
});

export const editProject = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const project = await updateProject(req.params.id, req.body);
  if (!project) {
    res.status(404).json({ success: false, message: 'Project not found' });
    return;
  }
  sendSuccessResponse(res, { project }, 'Project updated successfully');
});

export const removeProject = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const project = await deleteProject(req.params.id);
  if (!project) {
    res.status(404).json({ success: false, message: 'Project not found' });
    return;
  }
  sendSuccessResponse(res, null, 'Project deleted successfully');
});

export const updateProjectMilestone = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const { projectId, milestoneId } = req.params;
  const { status, completedAt } = req.body;

  const project = await updateMilestoneStatus(
    projectId,
    milestoneId,
    status,
    completedAt ? new Date(completedAt) : undefined
  );

  if (!project) {
    res.status(404).json({ success: false, message: 'Project or milestone not found' });
    return;
  }

  sendSuccessResponse(res, { project }, 'Milestone updated successfully');
});

export const getClientProjects = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const projects = await getProjectsByClient(req.params.clientId);
  sendSuccessResponse(res, { projects }, 'Client projects retrieved successfully');
});

export const getProjectStatistics = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const stats = await getProjectStats();
  sendSuccessResponse(res, { stats }, 'Project statistics retrieved successfully');
});