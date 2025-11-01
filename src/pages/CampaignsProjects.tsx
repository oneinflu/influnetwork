import PageBreadcrumb from "../components/common/PageBreadCrumb";

export default function CampaignsProjects() {
  return (
    <div className="p-6">
      <PageBreadcrumb pageTitle="Campaigns & Projects" />
      <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-white/[0.05] dark:bg-white/[0.03]">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white/90 mb-4">
          Campaigns & Projects
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Create and manage marketing campaigns and project workflows. Track campaign performance and project milestones.
        </p>
      </div>
    </div>
  );
}