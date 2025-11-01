import PageBreadcrumb from "../components/common/PageBreadCrumb";

export default function PortfolioFiles() {
  return (
    <div className="p-6">
      <PageBreadcrumb pageTitle="Portfolio & Files" />
      <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-white/[0.05] dark:bg-white/[0.03]">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white/90 mb-4">
          Portfolio & Files
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Manage your portfolio items, project files, documents, and media assets. Organize and share your work with clients.
        </p>
      </div>
    </div>
  );
}