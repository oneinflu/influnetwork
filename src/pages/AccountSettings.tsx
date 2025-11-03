import { useState } from "react";
import { useNavigate } from "react-router";
import PageBreadcrumb from "../components/common/PageBreadCrumb";
import PageMeta from "../components/common/PageMeta";
import Button from "../components/ui/button/Button";
import Input from "../components/form/input/InputField";
import Label from "../components/form/Label";
import { Modal } from "../components/ui/modal";
import { useModal } from "../hooks/useModal";
import { useAuth } from "../context/AuthContext";

export default function AccountSettings() {
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const { isOpen, openModal, closeModal } = useModal();
  
  const [deleteConfirmation, setDeleteConfirmation] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteAccount = async () => {
    if (deleteConfirmation !== "DELETE") {
      return;
    }

    setIsDeleting(true);
    try {
      // Simulate API call to delete account
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Logout and redirect to signin
      logout();
      navigate('/signin');
    } catch (error) {
      console.error("Error deleting account:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <PageMeta
        title="Account Settings | Influencer Network"
        description="Manage your account settings and preferences"
      />
      <PageBreadcrumb pageTitle="Account Settings" />
      
      <div className="space-y-6">
        {/* Account Information */}
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
          <h3 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90">
            Account Information
          </h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between rounded-lg border border-gray-200 p-4 dark:border-gray-700">
              <div>
                <h4 className="font-medium text-gray-800 dark:text-white/90">
                  Profile Settings
                </h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Update your personal information, photo, and contact details
                </p>
              </div>
              <Button
                variant="outline"
                onClick={() => navigate("/profile/edit")}
              >
                Edit Profile
              </Button>
            </div>

            <div className="flex items-center justify-between rounded-lg border border-gray-200 p-4 dark:border-gray-700">
              <div>
                <h4 className="font-medium text-gray-800 dark:text-white/90">
                  Email Address
                </h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {user?.email || "musharof@example.com"}
                </p>
              </div>
              <Button variant="outline" disabled>
                Verified
              </Button>
            </div>

            <div className="flex items-center justify-between rounded-lg border border-gray-200 p-4 dark:border-gray-700">
              <div>
                <h4 className="font-medium text-gray-800 dark:text-white/90">
                  Account Status
                </h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Your account is active and in good standing
                </p>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-green-500"></div>
                <span className="text-sm font-medium text-green-600 dark:text-green-400">
                  Active
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Privacy & Security */}
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
          <h3 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90">
            Privacy & Security
          </h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between rounded-lg border border-gray-200 p-4 dark:border-gray-700">
              <div>
                <h4 className="font-medium text-gray-800 dark:text-white/90">
                  Two-Factor Authentication
                </h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Add an extra layer of security to your account
                </p>
              </div>
              <Button variant="outline" disabled>
                Enable 2FA
              </Button>
            </div>

            <div className="flex items-center justify-between rounded-lg border border-gray-200 p-4 dark:border-gray-700">
              <div>
                <h4 className="font-medium text-gray-800 dark:text-white/90">
                  Login Sessions
                </h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Manage your active login sessions across devices
                </p>
              </div>
              <Button variant="outline" disabled>
                View Sessions
              </Button>
            </div>

            <div className="flex items-center justify-between rounded-lg border border-gray-200 p-4 dark:border-gray-700">
              <div>
                <h4 className="font-medium text-gray-800 dark:text-white/90">
                  Data Export
                </h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Download a copy of your account data
                </p>
              </div>
              <Button variant="outline" disabled>
                Export Data
              </Button>
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
          <h3 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90">
            Notification Preferences
          </h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between rounded-lg border border-gray-200 p-4 dark:border-gray-700">
              <div>
                <h4 className="font-medium text-gray-800 dark:text-white/90">
                  Email Notifications
                </h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Receive updates about campaigns, payments, and messages
                </p>
              </div>
              <label className="relative inline-flex cursor-pointer items-center">
                <input type="checkbox" className="peer sr-only" defaultChecked />
                <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:border-gray-600 dark:bg-gray-700 dark:peer-focus:ring-blue-800"></div>
              </label>
            </div>

            <div className="flex items-center justify-between rounded-lg border border-gray-200 p-4 dark:border-gray-700">
              <div>
                <h4 className="font-medium text-gray-800 dark:text-white/90">
                  Push Notifications
                </h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Get instant notifications on your device
                </p>
              </div>
              <label className="relative inline-flex cursor-pointer items-center">
                <input type="checkbox" className="peer sr-only" />
                <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:border-gray-600 dark:bg-gray-700 dark:peer-focus:ring-blue-800"></div>
              </label>
            </div>

            <div className="flex items-center justify-between rounded-lg border border-gray-200 p-4 dark:border-gray-700">
              <div>
                <h4 className="font-medium text-gray-800 dark:text-white/90">
                  Marketing Communications
                </h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Receive promotional emails and product updates
                </p>
              </div>
              <label className="relative inline-flex cursor-pointer items-center">
                <input type="checkbox" className="peer sr-only" defaultChecked />
                <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:border-gray-600 dark:bg-gray-700 dark:peer-focus:ring-blue-800"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="rounded-2xl border border-red-200 bg-red-50 p-5 dark:border-red-800 dark:bg-red-900/10 lg:p-6">
          <h3 className="mb-5 text-lg font-semibold text-red-800 dark:text-red-400">
            Danger Zone
          </h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between rounded-lg border border-red-200 bg-white p-4 dark:border-red-700 dark:bg-red-900/20">
              <div>
                <h4 className="font-medium text-red-800 dark:text-red-400">
                  Delete Account
                </h4>
                <p className="text-sm text-red-600 dark:text-red-300">
                  Permanently delete your account and all associated data. This action cannot be undone.
                </p>
              </div>
              <Button
                variant="outline"
                onClick={openModal}
                className="border-red-300 text-red-700 hover:bg-red-50 hover:border-red-400 dark:border-red-600 dark:text-red-400 dark:hover:bg-red-900/30"
              >
                Delete Account
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Account Modal */}
      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-md">
        <div className="rounded-3xl bg-white p-6 dark:bg-gray-900">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20">
            <svg className="h-6 w-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-2.186-.833-2.956 0L3.858 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          
          <h3 className="mb-2 text-lg font-semibold text-gray-800 dark:text-white/90">
            Delete Account
          </h3>
          
          <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
            This action will permanently delete your account and all associated data. This cannot be undone.
          </p>
          
          <div className="mb-4">
            <Label htmlFor="deleteConfirmation">
              Type "DELETE" to confirm
            </Label>
            <Input
              id="deleteConfirmation"
              value={deleteConfirmation}
              onChange={(e) => setDeleteConfirmation(e.target.value)}
              placeholder="DELETE"
              className="mt-1"
            />
          </div>
          
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={closeModal}
              disabled={isDeleting}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleDeleteAccount}
              disabled={deleteConfirmation !== "DELETE" || isDeleting}
              className="flex-1 bg-red-600 hover:bg-red-700 focus:ring-red-500"
            >
              {isDeleting ? "Deleting..." : "Delete Account"}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}