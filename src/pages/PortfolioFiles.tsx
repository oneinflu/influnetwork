import { useState } from "react";
import PageBreadcrumb from "../components/common/PageBreadCrumb";
import Button from "../components/ui/button/Button";
import Input from "../components/form/input/InputField";
import MultiSelect from "../components/form/MultiSelect";
import { 
  PlusIcon, 
  ListIcon, 
  GridIcon,
  DownloadIcon,
  FolderIcon,
  FileIcon
} from "../icons";
import { 
  PortfolioFile,
  PortfolioFolder,
  FileFilters,
  FileType,
  FileCategory,
  FileStatus,
  VisibilityLevel,
  ViewMode,
  SortBy,
  FILE_TYPE_OPTIONS,
  FILE_CATEGORY_OPTIONS,
  FILE_STATUS_OPTIONS,
  VISIBILITY_LEVEL_OPTIONS,
 
  formatFileSize
} from "../types/portfolio";

export default function PortfolioFiles() {
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<FileFilters>({});
  const [selectedFiles, ] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<SortBy>('dateModified');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [, setShowUploadModal] = useState(false);
  const [, setShowFileDetail] = useState(false);
  const [, setSelectedFile] = useState<PortfolioFile | null>(null);
  const [currentFolder, setCurrentFolder] = useState<string | null>(null);

  // Sample data - replace with actual data fetching
  const [files, ] = useState<PortfolioFile[]>([
    {
      id: "1",
      name: "Brand Campaign Video",
      originalName: "nike_campaign_final.mp4",
      description: "Final edited video for Nike collaboration campaign",
      type: "video",
      category: "Campaign",
      status: "Active",
      visibility: "Client Access",
      url: "/files/nike_campaign_final.mp4",
      thumbnailUrl: "/images/video-thumb/nike-thumb.jpg",
      metadata: {
        size: 157286400, // ~150MB
        dimensions: { width: 1920, height: 1080 },
        duration: 180,
        format: "mp4",
        mimeType: "video/mp4"
      },
      tags: ["Nike", "Campaign", "Video", "Final"],
      linkedCampaigns: ["nike-summer-2024"],
      linkedPeople: ["rhea-styles"],
      isDownloadable: true,
      isShareable: true,
      viewCount: 45,
      downloadCount: 12,
      shareCount: 8,
      createdAt: "2024-01-20T10:00:00Z",
      updatedAt: "2024-01-22T15:30:00Z",
      createdBy: "rhea-styles"
    },
    {
      id: "2",
      name: "Instagram Story Templates",
      originalName: "ig_story_templates.zip",
      description: "Collection of branded Instagram story templates",
      type: "archive",
      category: "Templates",
      status: "Active",
      visibility: "Team Only",
      url: "/files/ig_story_templates.zip",
      metadata: {
        size: 25600000, // ~25MB
        format: "zip",
        mimeType: "application/zip"
      },
      tags: ["Instagram", "Templates", "Stories", "Brand"],
      isDownloadable: true,
      isShareable: false,
      viewCount: 23,
      downloadCount: 15,
      shareCount: 0,
      createdAt: "2024-01-18T14:20:00Z",
      updatedAt: "2024-01-18T14:20:00Z",
      createdBy: "design-team"
    },
    {
      id: "3",
      name: "Product Photography Set",
      originalName: "product_photos_batch1.jpg",
      description: "High-resolution product photos for e-commerce",
      type: "image",
      category: "Portfolio",
      status: "Active",
      visibility: "Public",
      url: "/files/product_photos_batch1.jpg",
      thumbnailUrl: "/images/product/product-1.jpg",
      metadata: {
        size: 8400000, // ~8.4MB
        dimensions: { width: 4000, height: 3000 },
        format: "jpg",
        mimeType: "image/jpeg",
        resolution: 300
      },
      tags: ["Product", "Photography", "E-commerce", "High-res"],
      linkedCampaigns: ["product-launch-q1"],
      isDownloadable: true,
      isShareable: true,
      shareUrl: "https://portfolio.com/share/abc123",
      viewCount: 89,
      downloadCount: 34,
      shareCount: 12,
      createdAt: "2024-01-15T09:15:00Z",
      updatedAt: "2024-01-16T11:45:00Z",
      createdBy: "photographer"
    },
    {
      id: "4",
      name: "Brand Guidelines PDF",
      originalName: "brand_guidelines_v2.pdf",
      description: "Updated brand guidelines and style guide",
      type: "document",
      category: "Brand Assets",
      status: "Active",
      visibility: "Team Only",
      url: "/files/brand_guidelines_v2.pdf",
      thumbnailUrl: "/images/docs/pdf-thumb.png",
      metadata: {
        size: 12800000, // ~12.8MB
        format: "pdf",
        mimeType: "application/pdf"
      },
      tags: ["Brand", "Guidelines", "Style Guide", "Reference"],
      isDownloadable: true,
      isShareable: true,
      viewCount: 67,
      downloadCount: 28,
      shareCount: 5,
      createdAt: "2024-01-12T16:30:00Z",
      updatedAt: "2024-01-19T10:15:00Z",
      createdBy: "brand-manager"
    },
    {
      id: "5",
      name: "Podcast Episode Audio",
      originalName: "podcast_ep_12_final.mp3",
      description: "Final edited audio for podcast episode 12",
      type: "audio",
      category: "Portfolio",
      status: "Active",
      visibility: "Public",
      url: "/files/podcast_ep_12_final.mp3",
      metadata: {
        size: 45600000, // ~45.6MB
        duration: 2850, // 47.5 minutes
        format: "mp3",
        mimeType: "audio/mpeg"
      },
      tags: ["Podcast", "Audio", "Episode", "Final"],
      linkedCampaigns: ["podcast-series-2024"],
      isDownloadable: true,
      isShareable: true,
      viewCount: 156,
      downloadCount: 89,
      shareCount: 23,
      createdAt: "2024-01-10T12:00:00Z",
      updatedAt: "2024-01-11T09:30:00Z",
      createdBy: "audio-editor"
    },
    {
      id: "6",
      name: "Contract Template",
      originalName: "influencer_contract_template.docx",
      description: "Standard influencer collaboration contract template",
      type: "document",
      category: "Contracts",
      status: "Active",
      visibility: "Private",
      url: "/files/influencer_contract_template.docx",
      metadata: {
        size: 156000, // ~156KB
        format: "docx",
        mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      },
      tags: ["Contract", "Template", "Legal", "Influencer"],
      isDownloadable: true,
      isShareable: false,
      viewCount: 34,
      downloadCount: 12,
      shareCount: 0,
      createdAt: "2024-01-08T11:45:00Z",
      updatedAt: "2024-01-08T11:45:00Z",
      createdBy: "legal-team"
    }
  ]);

  const [folders, ] = useState<PortfolioFolder[]>([
    {
      id: "campaigns",
      name: "Campaigns",
      description: "Campaign-related files and assets",
      path: "/campaigns",
      color: "#3B82F6",
      visibility: "Team Only",
      isShared: true,
      fileCount: 24,
      totalSize: 450000000,
      createdAt: "2024-01-01T00:00:00Z",
      updatedAt: "2024-01-20T10:00:00Z",
      createdBy: "admin"
    },
    {
      id: "portfolio",
      name: "Portfolio",
      description: "Portfolio showcase items",
      path: "/portfolio",
      color: "#10B981",
      visibility: "Public",
      isShared: true,
      fileCount: 18,
      totalSize: 320000000,
      createdAt: "2024-01-01T00:00:00Z",
      updatedAt: "2024-01-18T14:20:00Z",
      createdBy: "admin"
    },
    {
      id: "templates",
      name: "Templates",
      description: "Reusable templates and assets",
      path: "/templates",
      color: "#8B5CF6",
      visibility: "Team Only",
      isShared: false,
      fileCount: 12,
      totalSize: 85000000,
      createdAt: "2024-01-01T00:00:00Z",
      updatedAt: "2024-01-15T09:15:00Z",
      createdBy: "design-team"
    }
  ]);

  // Filter files based on search and filters
  const filteredFiles = files.filter(file => {
    if (searchQuery && !file.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !file.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))) {
      return false;
    }
    
    if (filters.type && filters.type.length > 0 && !filters.type.includes(file.type)) {
      return false;
    }
    
    if (filters.category && filters.category.length > 0 && !filters.category.includes(file.category)) {
      return false;
    }
    
    if (filters.status && filters.status.length > 0 && !filters.status.includes(file.status)) {
      return false;
    }
    
    if (filters.visibility && filters.visibility.length > 0 && !filters.visibility.includes(file.visibility)) {
      return false;
    }
    
    if (currentFolder && file.folderId !== currentFolder) {
      return false;
    }
    
    return true;
  });

  // Sort files
  const sortedFiles = [...filteredFiles].sort((a, b) => {
    let aValue: any, bValue: any;
    
    switch (sortBy) {
      case 'name':
        aValue = a.name.toLowerCase();
        bValue = b.name.toLowerCase();
        break;
      case 'dateCreated':
        aValue = new Date(a.createdAt);
        bValue = new Date(b.createdAt);
        break;
      case 'dateModified':
        aValue = new Date(a.updatedAt);
        bValue = new Date(b.updatedAt);
        break;
      case 'size':
        aValue = a.metadata.size;
        bValue = b.metadata.size;
        break;
      case 'type':
        aValue = a.type;
        bValue = b.type;
        break;
      case 'category':
        aValue = a.category;
        bValue = b.category;
        break;
      default:
        return 0;
    }
    
    if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  const handleFileClick = (file: PortfolioFile) => {
    setSelectedFile(file);
    setShowFileDetail(true);
  };

  const handleBulkAction = (action: string) => {
    console.log(`Bulk action: ${action} on`, selectedFiles);
    // Implement bulk actions
  };

  const stats = {
    total: files.length,
    totalSize: files.reduce((sum, file) => sum + file.metadata.size, 0),
    images: files.filter(f => f.type === 'image').length,
    videos: files.filter(f => f.type === 'video').length,
    documents: files.filter(f => f.type === 'document').length,
    public: files.filter(f => f.visibility === 'Public').length
  };

  return (
    <div className="p-6 space-y-6">
      <PageBreadcrumb pageTitle="Portfolio & Files" />
      
      {/* Compact Header with Actions and View Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white/90">
            Portfolio & Files
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Manage your portfolio items, project files, documents, and media assets
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          {/* View Mode Toggle */}
          <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-md transition-colors ${
                viewMode === 'list'
                  ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
              title="List View"
            >
              <ListIcon className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-md transition-colors ${
                viewMode === 'grid'
                  ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
              title="Grid View"
            >
              <GridIcon className="w-4 h-4" />
            </button>
          </div>
          
          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <DownloadIcon className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button variant="outline" size="sm">
              <FolderIcon className="w-4 h-4 mr-2" />
              New Folder
            </Button>
            <Button
              onClick={() => setShowUploadModal(true)}
              className="flex items-center gap-2"
            >
              <PlusIcon className="w-4 h-4" />
              Upload Files
            </Button>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <div className="bg-white dark:bg-white/[0.03] rounded-lg border border-gray-200 dark:border-white/[0.05] p-4">
          <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Total Files</div>
        </div>
        <div className="bg-white dark:bg-white/[0.03] rounded-lg border border-gray-200 dark:border-white/[0.05] p-4">
          <div className="text-2xl font-bold text-blue-600">{formatFileSize(stats.totalSize)}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Total Size</div>
        </div>
        <div className="bg-white dark:bg-white/[0.03] rounded-lg border border-gray-200 dark:border-white/[0.05] p-4">
          <div className="text-2xl font-bold text-green-600">{stats.images}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Images</div>
        </div>
        <div className="bg-white dark:bg-white/[0.03] rounded-lg border border-gray-200 dark:border-white/[0.05] p-4">
          <div className="text-2xl font-bold text-purple-600">{stats.videos}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Videos</div>
        </div>
        <div className="bg-white dark:bg-white/[0.03] rounded-lg border border-gray-200 dark:border-white/[0.05] p-4">
          <div className="text-2xl font-bold text-orange-600">{stats.documents}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Documents</div>
        </div>
        <div className="bg-white dark:bg-white/[0.03] rounded-lg border border-gray-200 dark:border-white/[0.05] p-4">
          <div className="text-2xl font-bold text-teal-600">{stats.public}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Public</div>
        </div>
      </div>

      {/* Compact Filters */}
      <div className="bg-white dark:bg-white/[0.03] border border-gray-200 dark:border-white/[0.05] rounded-xl p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          <div className="xl:col-span-2">
            <Input
              type="text"
              placeholder="Search files, folders, or tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full"
            />
          </div>
          
          <MultiSelect
            label=""
            placeholder="File types"
            options={FILE_TYPE_OPTIONS.map(opt => ({ value: opt.value, text: opt.label }))}
            value={filters.type || []}
            onChange={(values) => setFilters(prev => ({ ...prev, type: values as FileType[] }))}
          />
          
          <MultiSelect
            label=""
            placeholder="Categories"
            options={FILE_CATEGORY_OPTIONS.map(opt => ({ value: opt.value, text: opt.label }))}
            value={filters.category || []}
            onChange={(values) => setFilters(prev => ({ ...prev, category: values as FileCategory[] }))}
          />
          
          <MultiSelect
            label=""
            placeholder="Status"
            options={FILE_STATUS_OPTIONS.map(opt => ({ value: opt.value, text: opt.label }))}
            value={filters.status || []}
            onChange={(values) => setFilters(prev => ({ ...prev, status: values as FileStatus[] }))}
          />
          
          <MultiSelect
            label=""
            placeholder="Visibility"
            options={VISIBILITY_LEVEL_OPTIONS.map(opt => ({ value: opt.value, text: opt.label }))}
            value={filters.visibility || []}
            onChange={(values) => setFilters(prev => ({ ...prev, visibility: values as VisibilityLevel[] }))}
          />
        </div>
        
        {/* Results Count and Bulk Actions */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200 dark:border-white/[0.05]">
          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Showing {sortedFiles.length} of {files.length} files
            </div>
            <select
              className="h-8 rounded-lg border border-gray-300 bg-white px-3 text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-white"
              value={`${sortBy}-${sortOrder}`}
              onChange={(e) => {
                const [sort, order] = e.target.value.split('-');
                setSortBy(sort as SortBy);
                setSortOrder(order as 'asc' | 'desc');
              }}
            >
              <option value="dateModified-desc">Latest Modified</option>
              <option value="dateCreated-desc">Latest Created</option>
              <option value="name-asc">Name A-Z</option>
              <option value="name-desc">Name Z-A</option>
              <option value="size-desc">Largest First</option>
              <option value="size-asc">Smallest First</option>
              <option value="type-asc">Type A-Z</option>
            </select>
          </div>
          {selectedFiles.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {selectedFiles.length} selected
              </span>
              <select
                className="h-8 rounded-lg border border-gray-300 bg-white px-3 text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                onChange={(e) => handleBulkAction(e.target.value)}
                defaultValue=""
              >
                <option value="" disabled>Bulk Actions</option>
                <option value="move">Move to Folder</option>
                <option value="copy">Copy</option>
                <option value="tag">Add Tags</option>
                <option value="changeVisibility">Change Visibility</option>
                <option value="download">Download</option>
                <option value="archive">Archive</option>
                <option value="delete">Delete</option>
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Content Area */}
      <div className="bg-white dark:bg-white/[0.03] rounded-xl border border-gray-200 dark:border-white/[0.05]">
        {sortedFiles.length > 0 ? (
          <div className="p-6">
            {/* Folders Section */}
            {!currentFolder && folders.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Folders</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 mb-6">
                  {folders.map((folder) => (
                    <div
                      key={folder.id}
                      className="p-4 border border-gray-200 dark:border-white/[0.05] rounded-lg hover:bg-gray-50 dark:hover:bg-white/[0.02] cursor-pointer transition-colors"
                      onClick={() => setCurrentFolder(folder.id)}
                    >
                      <div className="flex items-center mb-2">
                        <FolderIcon 
                          className="w-8 h-8 mr-3" 
                          style={{ color: folder.color }}
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                            {folder.name}
                          </h4>
                        </div>
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {folder.fileCount} files • {formatFileSize(folder.totalSize)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Files Section */}
            <div>
              {currentFolder && (
                <div className="flex items-center mb-4">
                  <button
                    onClick={() => setCurrentFolder(null)}
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    ← Back to all files
                  </button>
                </div>
              )}
              
              {viewMode === 'grid' ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                  {sortedFiles.map((file) => (
                    <div
                      key={file.id}
                      className="group border border-gray-200 dark:border-white/[0.05] rounded-lg overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => handleFileClick(file)}
                    >
                      <div className="aspect-square bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                        {file.thumbnailUrl ? (
                          <img
                            src={file.thumbnailUrl}
                            alt={file.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <FileIcon className="w-12 h-12 text-gray-400" />
                        )}
                      </div>
                      <div className="p-3">
                        <h4 className="text-sm font-medium text-gray-900 dark:text-white truncate mb-1">
                          {file.name}
                        </h4>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {formatFileSize(file.metadata.size)} • {file.type}
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            file.visibility === 'Public' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' :
                            file.visibility === 'Private' ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400' :
                            'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
                          }`}>
                            {file.visibility}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-2">
                  {sortedFiles.map((file) => (
                    <div
                      key={file.id}
                      className="flex items-center p-4 border border-gray-200 dark:border-white/[0.05] rounded-lg hover:bg-gray-50 dark:hover:bg-white/[0.02] cursor-pointer transition-colors"
                      onClick={() => handleFileClick(file)}
                    >
                      <div className="flex-shrink-0 mr-4">
                        {file.thumbnailUrl ? (
                          <img
                            src={file.thumbnailUrl}
                            alt={file.name}
                            className="w-10 h-10 object-cover rounded"
                          />
                        ) : (
                          <FileIcon className="w-10 h-10 text-gray-400" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                          {file.name}
                        </h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                          {file.description || file.originalName}
                        </p>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                        <span>{file.category}</span>
                        <span>{formatFileSize(file.metadata.size)}</span>
                        <span>{new Date(file.updatedAt).toLocaleDateString()}</span>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          file.visibility === 'Public' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' :
                          file.visibility === 'Private' ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400' :
                          'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
                        }`}>
                          {file.visibility}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="p-6">
            <div className="text-center py-12">
              <FileIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No files found
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Get started by uploading your first file to the portfolio.
              </p>
              <Button
                variant="primary"
                onClick={() => setShowUploadModal(true)}
              >
                <PlusIcon className="w-4 h-4 mr-2" />
                Upload Files
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}