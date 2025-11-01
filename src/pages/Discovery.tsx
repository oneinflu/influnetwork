import PageBreadcrumb from "../components/common/PageBreadCrumb";

export default function Discovery() {
  return (
    <div className="p-6">
      <PageBreadcrumb pageTitle="Discovery" />
      <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-white/[0.05] dark:bg-white/[0.03]">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white/90 mb-4">
          Discovery
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Explore new opportunities, research market trends, and discover potential clients and partnerships.
        </p>
      </div>
    </div>
  );
}