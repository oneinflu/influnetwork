import PageBreadcrumb from "../components/common/PageBreadCrumb";
import LeadsTable from "../components/tables/LeadsTable";

export default function LeadsDeals() {
  return (
    <div className="space-y-6">
      <PageBreadcrumb pageTitle="Leads & Deals" />
      
      <div className="space-y-6">
       

        {/* Leads Table Component */}
        <LeadsTable />
      </div>
    </div>
  );
}