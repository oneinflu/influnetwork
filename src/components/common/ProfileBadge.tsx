import { useState } from "react";
import {
  UserCircleIcon,
  PencilIcon,
  CopyIcon,
  EyeIcon,
 
} from "../../icons";

export default function ProfileBadge() {
  const [username] = useState("xyz");
  const profileUrl = `https://oneinflu.com/@${username}`;

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(profileUrl);
    // You can add a toast notification here
  };

  const handleViewProfile = () => {
    window.open(profileUrl, "_blank");
  };

  const handleEditUsername = () => {
    // You can add edit functionality here
    console.log("Edit username clicked");
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-xl dark:bg-blue-800/20">
            <UserCircleIcon className="text-blue-600 size-6 dark:text-blue-400" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-800 dark:text-white/90">
              Share My Profile
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 font-mono">
              {profileUrl}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={handleEditUsername}
            className="flex items-center justify-center w-9 h-9 text-gray-500 bg-gray-100 rounded-lg hover:bg-gray-200 hover:text-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-300 transition-colors"
            title="Edit Username"
          >
            <PencilIcon className="size-4" />
          </button>
          
          <button
            onClick={handleCopyUrl}
            className="flex items-center justify-center w-9 h-9 text-gray-500 bg-gray-100 rounded-lg hover:bg-gray-200 hover:text-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-300 transition-colors"
            title="Copy URL"
          >
            <CopyIcon className="size-4" />
          </button>
          
          <button
            onClick={handleViewProfile}
            className="flex items-center justify-center w-9 h-9 text-gray-500 bg-gray-100 rounded-lg hover:bg-gray-200 hover:text-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-300 transition-colors"
            title="View Profile"
          >
            <EyeIcon className="size-4" />
          </button>
        </div>
      </div>
    </div>
  );
}