// Portfolio and File Management Types

export type FileType = 'image' | 'video' | 'document' | 'audio' | 'archive' | 'other';

export type FileCategory = 
  | 'Portfolio'
  | 'Campaign'
  | 'Brand Assets'
  | 'Contracts'
  | 'Media Kit'
  | 'Templates'
  | 'Personal'
  | 'Archive';

export type FileStatus = 'Active' | 'Archived' | 'Draft' | 'Under Review';

export type VisibilityLevel = 'Public' | 'Private' | 'Team Only' | 'Client Access';

export type SortBy = 'name' | 'dateCreated' | 'dateModified' | 'size' | 'type' | 'category';

export type ViewMode = 'grid' | 'list' | 'masonry';

export interface FileMetadata {
  size: number; // in bytes
  dimensions?: {
    width: number;
    height: number;
  };
  duration?: number; // for video/audio files in seconds
  format: string; // file extension
  mimeType: string;
  colorProfile?: string;
  resolution?: number; // DPI for images
}

export interface PortfolioFile {
  id: string;
  name: string;
  originalName: string;
  description?: string;
  type: FileType;
  category: FileCategory;
  status: FileStatus;
  visibility: VisibilityLevel;
  url: string;
  thumbnailUrl?: string;
  previewUrl?: string;
  metadata: FileMetadata;
  tags: string[];
  
  // Organization
  folderId?: string;
  folderPath?: string;
  
  // Relationships
  linkedCampaigns?: string[];
  linkedPeople?: string[];
  linkedRateCards?: string[];
  
  // Permissions
  isDownloadable: boolean;
  isShareable: boolean;
  shareUrl?: string;
  
  // Analytics
  viewCount: number;
  downloadCount: number;
  shareCount: number;
  
  // Timestamps
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  lastAccessedAt?: string;
}

export interface PortfolioFolder {
  id: string;
  name: string;
  description?: string;
  parentId?: string;
  path: string;
  color?: string;
  icon?: string;
  
  // Permissions
  visibility: VisibilityLevel;
  isShared: boolean;
  
  // Stats
  fileCount: number;
  totalSize: number;
  
  // Timestamps
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

export interface FileFilters {
  search?: string;
  type?: FileType[];
  category?: FileCategory[];
  status?: FileStatus[];
  visibility?: VisibilityLevel[];
  tags?: string[];
  folderId?: string;
  createdBy?: string[];
  dateRange?: {
    start: string;
    end: string;
  };
  sizeRange?: {
    min: number;
    max: number;
  };
}

export interface FileUploadProgress {
  fileId: string;
  fileName: string;
  progress: number;
  status: 'uploading' | 'processing' | 'completed' | 'error';
  error?: string;
}

export interface BulkAction {
  type: 'move' | 'copy' | 'delete' | 'archive' | 'tag' | 'changeVisibility' | 'download';
  fileIds: string[];
  params?: {
    folderId?: string;
    tags?: string[];
    visibility?: VisibilityLevel;
  };
}

export interface ShareSettings {
  isPublic: boolean;
  allowDownload: boolean;
  allowComments: boolean;
  expiresAt?: string;
  password?: string;
  allowedEmails?: string[];
}

// Form Data Types
export interface FileFormData {
  name: string;
  description?: string;
  category: FileCategory;
  status: FileStatus;
  visibility: VisibilityLevel;
  tags: string[];
  folderId?: string;
  isDownloadable: boolean;
  isShareable: boolean;
}

export interface FolderFormData {
  name: string;
  description?: string;
  parentId?: string;
  color?: string;
  visibility: VisibilityLevel;
  isShared: boolean;
}

// Options for dropdowns
export const FILE_TYPE_OPTIONS = [
  { value: 'image', label: 'Images' },
  { value: 'video', label: 'Videos' },
  { value: 'document', label: 'Documents' },
  { value: 'audio', label: 'Audio' },
  { value: 'archive', label: 'Archives' },
  { value: 'other', label: 'Other' },
] as const;

export const FILE_CATEGORY_OPTIONS = [
  { value: 'Portfolio', label: 'Portfolio' },
  { value: 'Campaign', label: 'Campaign' },
  { value: 'Brand Assets', label: 'Brand Assets' },
  { value: 'Contracts', label: 'Contracts' },
  { value: 'Media Kit', label: 'Media Kit' },
  { value: 'Templates', label: 'Templates' },
  { value: 'Personal', label: 'Personal' },
  { value: 'Archive', label: 'Archive' },
] as const;

export const FILE_STATUS_OPTIONS = [
  { value: 'Active', label: 'Active' },
  { value: 'Archived', label: 'Archived' },
  { value: 'Draft', label: 'Draft' },
  { value: 'Under Review', label: 'Under Review' },
] as const;

export const VISIBILITY_LEVEL_OPTIONS = [
  { value: 'Public', label: 'Public' },
  { value: 'Private', label: 'Private' },
  { value: 'Team Only', label: 'Team Only' },
  { value: 'Client Access', label: 'Client Access' },
] as const;

export const SORT_BY_OPTIONS = [
  { value: 'name', label: 'Name' },
  { value: 'dateCreated', label: 'Date Created' },
  { value: 'dateModified', label: 'Date Modified' },
  { value: 'size', label: 'File Size' },
  { value: 'type', label: 'File Type' },
  { value: 'category', label: 'Category' },
] as const;

// Utility functions
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const getFileIcon = (type: FileType): string => {
  const icons = {
    image: '🖼️',
    video: '🎥',
    document: '📄',
    audio: '🎵',
    archive: '📦',
    other: '📎',
  };
  return icons[type];
};

export const getFileTypeFromMimeType = (mimeType: string): FileType => {
  if (mimeType.startsWith('image/')) return 'image';
  if (mimeType.startsWith('video/')) return 'video';
  if (mimeType.startsWith('audio/')) return 'audio';
  if (mimeType.includes('zip') || mimeType.includes('rar') || mimeType.includes('tar')) return 'archive';
  if (mimeType.includes('pdf') || mimeType.includes('doc') || mimeType.includes('text')) return 'document';
  return 'other';
};