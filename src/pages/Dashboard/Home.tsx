import EcommerceMetrics from "../../components/ecommerce/EcommerceMetrics";
 
import PageMeta from "../../components/common/PageMeta";
import ProfileCompletionBar from "../../components/common/ProfileCompletionBar";
import ProfileBadge from "../../components/common/ProfileBadge";
import QuickActions from "../../components/common/QuickActions";
import { useAuth } from "../../context/AuthContext";

export default function Home() {
  const { getProfileCompletion } = useAuth();
  const profileCompletion = getProfileCompletion();
  const showCompletionBar = profileCompletion.percentage < 100;

  return (
    <>
      <PageMeta
        title="React.js Ecommerce Dashboard | TailAdmin - React.js Admin Dashboard Template"
        description="This is React.js Ecommerce Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      
      {showCompletionBar && (
        <div className="mb-6">
          <ProfileCompletionBar 
            completionPercentage={profileCompletion.percentage}
            missingFields={profileCompletion.missingFields}
          />
        </div>
      )}

      <div className="grid grid-cols-12 gap-4 md:gap-6">
        {/* Profile Badge - Full width at top */}
        <div className="col-span-12">
          <ProfileBadge />
        </div>

        {/* Metrics - Full width */}
        <div className="col-span-12">
          <EcommerceMetrics />
        </div>

        {/* Quick Actions - Full width */}
        <div className="col-span-12">
          <QuickActions />
        </div>
      </div>
    </>
  );
}
