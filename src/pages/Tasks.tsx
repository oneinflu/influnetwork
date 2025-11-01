import PageBreadcrumb from "../components/common/PageBreadCrumb";

export default function Tasks() {
  return (
    <div className="p-6">
      <PageBreadcrumb pageTitle="Tasks" />
      <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-white/[0.05] dark:bg-white/[0.03]">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white/90 mb-4">
          Tasks Management
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Create, assign, and track tasks. Manage project deadlines, set priorities, and monitor team productivity.
        </p>
      </div>
    </div>
  );
}