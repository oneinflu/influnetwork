import PageBreadcrumb from "../components/common/PageBreadCrumb";

export default function Messages() {
  return (
    <div className="p-6">
      <PageBreadcrumb pageTitle="Messages" />
      <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-white/[0.05] dark:bg-white/[0.03]">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white/90 mb-4">
          Messages
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Manage your communications with clients, team members, and stakeholders. View message history and send new messages.
        </p>
      </div>
    </div>
  );
}