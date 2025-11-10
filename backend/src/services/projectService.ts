import { Project, IProject } from '../models/Project';
import { PaymentTermsTemplate } from '../models/PaymentTerms';
import mongoose from 'mongoose';

export interface IProjectFilter {
  status?: string;
  campaignType?: string;
  clientId?: string;
  startDate?: { $gte?: Date; $lte?: Date };
  endDate?: { $gte?: Date; $lte?: Date };
  $or?: Array<{ [key: string]: RegExp }>;
}

export const listProjects = async (
  filter: IProjectFilter = {},
  page: number = 1,
  limit: number = 10,
  sortBy: string = 'createdAt',
  sortOrder: 'asc' | 'desc' = 'desc'
) => {
  const skip = (page - 1) * limit;
  const sort: { [key: string]: 1 | -1 } = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };

  const [projects, total] = await Promise.all([
    Project.find(filter)
      .populate('clientId', 'businessName logo category')
      .populate('peopleInvolved', 'fullName email roles profilePhoto')
      .populate('paymentTermsTemplateId', 'name description')
      .populate('createdBy', 'name email')
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean(),
    Project.countDocuments(filter)
  ]);

  return {
    data: projects,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit)
  };
};

export const getProjectById = async (id: string): Promise<any> => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return null;
  }

  return await Project.findById(id)
    .populate('clientId', 'businessName logo category website socialMedia')
    .populate('peopleInvolved', 'fullName email roles profilePhoto organization')
    .populate('paymentTermsTemplateId', 'name description milestones')
    .populate('createdBy', 'name email')
    .lean();
};

export const createProject = async (projectData: Partial<IProject>): Promise<IProject> => {
  // If using default payment terms and no template specified, get the default template
  if (projectData.paymentTerms === 'default' && !projectData.paymentTermsTemplateId) {
    const defaultTemplate = await PaymentTermsTemplate.findOne({ isDefault: true, isActive: true });
    if (defaultTemplate) {
      projectData.paymentTermsTemplateId = new mongoose.Types.ObjectId(defaultTemplate._id);
      
      // Convert template milestones to project milestones
      if (defaultTemplate.milestones && defaultTemplate.milestones.length > 0) {
        projectData.milestones = defaultTemplate.milestones.map((milestone, index) => ({
          id: `milestone-${index + 1}`,
          milestoneName: milestone.description,
          payment: {
            type: milestone.isPercentage ? 'percentage' as const : 'amount' as const,
            value: milestone.isPercentage ? (milestone.percentage || 0) : (milestone.amount || 0)
          },
          collectIn: milestone.daysFromStart,
          status: 'pending' as const
        }));
      }
    }
  }

  const project = new Project(projectData);
  return await project.save();
};

export const updateProject = async (id: string, updateData: Partial<IProject>): Promise<any> => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return null;
  }

  return await Project.findByIdAndUpdate(
    id,
    { ...updateData, updatedAt: new Date() },
    { new: true, runValidators: true }
  )
    .populate('clientId', 'businessName logo category')
    .populate('peopleInvolved', 'fullName email roles profilePhoto')
    .populate('paymentTermsTemplateId', 'name description')
    .populate('createdBy', 'name email')
    .lean();
};

export const deleteProject = async (id: string): Promise<any> => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return null;
  }

  return await Project.findByIdAndDelete(id).lean();
};

export const updateMilestoneStatus = async (
  projectId: string,
  milestoneId: string,
  status: 'pending' | 'completed' | 'overdue',
  completedAt?: Date
): Promise<any> => {
  if (!mongoose.Types.ObjectId.isValid(projectId)) {
    return null;
  }

  const updateData: any = {
    'milestones.$.status': status,
    updatedAt: new Date()
  };

  if (status === 'completed' && completedAt) {
    updateData['milestones.$.completedAt'] = completedAt;
  }

  return await Project.findOneAndUpdate(
    { _id: projectId, 'milestones.id': milestoneId },
    updateData,
    { new: true, runValidators: true }
  )
    .populate('clientId', 'businessName logo category')
    .populate('peopleInvolved', 'fullName email roles profilePhoto')
    .populate('paymentTermsTemplateId', 'name description')
    .lean();
};

export const getProjectsByClient = async (clientId: string): Promise<any[]> => {
  if (!mongoose.Types.ObjectId.isValid(clientId)) {
    return [];
  }

  return await Project.find({ clientId })
    .populate('peopleInvolved', 'fullName email roles profilePhoto')
    .populate('paymentTermsTemplateId', 'name description')
    .populate('createdBy', 'name email')
    .sort({ createdAt: -1 })
    .lean();
};

export const getProjectStats = async () => {
  const stats = await Project.aggregate([
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
        totalBudget: { $sum: '$projectAgreedBudget' }
      }
    }
  ]);

  const campaignTypeStats = await Project.aggregate([
    {
      $group: {
        _id: '$campaignType',
        count: { $sum: 1 },
        totalBudget: { $sum: '$projectAgreedBudget' }
      }
    }
  ]);

  return {
    statusStats: stats,
    campaignTypeStats
  };
};