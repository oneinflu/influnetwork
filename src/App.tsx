import { BrowserRouter as Router, Routes, Route } from "react-router";
import SignIn from "./pages/AuthPages/SignIn";
import SignUp from "./pages/AuthPages/SignUp";
import NotFound from "./pages/OtherPage/NotFound";
import UserProfiles from "./pages/UserProfiles";
import Videos from "./pages/UiElements/Videos";
import Images from "./pages/UiElements/Images";
import Alerts from "./pages/UiElements/Alerts";
import Badges from "./pages/UiElements/Badges";
import Avatars from "./pages/UiElements/Avatars";
import Buttons from "./pages/UiElements/Buttons";
import LineChart from "./pages/Charts/LineChart";
import BarChart from "./pages/Charts/BarChart";
import Calendar from "./pages/Calendar";
import BasicTables from "./pages/Tables/BasicTables";
import FormElements from "./pages/Forms/FormElements";
import Blank from "./pages/Blank";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import Home from "./pages/Dashboard/Home";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/auth/ProtectedRoute";

// Business Portal Pages
import LeadsDeals from "./pages/LeadsDeals";
import CampaignsProjects from "./pages/CampaignsProjects";
import People from "./pages/People";
import PortfolioFiles from "./pages/PortfolioFiles";
import RateCards from "./pages/RateCards";
import InvoicesPayments from "./pages/InvoicesPayments";
import Tasks from "./pages/Tasks";
import ReportsInsights from "./pages/ReportsInsights";
import Discovery from "./pages/Discovery";
import Messages from "./pages/Messages";
import ToolsIntegrations from "./pages/ToolsIntegrations";
import Settings from "./pages/Settings";
import HelpSupport from "./pages/HelpSupport";

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />
        <Routes>
          {/* Dashboard Layout - Protected Routes */}
          <Route element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }>
            <Route index path="/" element={<Home />} />

            {/* Business Portal Pages */}
            <Route path="/leads-deals" element={<LeadsDeals />} />
            <Route path="/campaigns-projects" element={<CampaignsProjects />} />
            <Route path="/people" element={<People />} />
            <Route path="/portfolio-files" element={<PortfolioFiles />} />
            <Route path="/rate-cards" element={<RateCards />} />
            <Route path="/invoices-payments" element={<InvoicesPayments />} />
            <Route path="/tasks" element={<Tasks />} />
            <Route path="/reports-insights" element={<ReportsInsights />} />
            <Route path="/discovery" element={<Discovery />} />
            <Route path="/messages" element={<Messages />} />
            <Route path="/tools-integrations" element={<ToolsIntegrations />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/help-support" element={<HelpSupport />} />

            {/* Others Page */}
            <Route path="/profile" element={<UserProfiles />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/blank" element={<Blank />} />

            {/* Forms */}
            <Route path="/form-elements" element={<FormElements />} />

            {/* Tables */}
            <Route path="/basic-tables" element={<BasicTables />} />

            {/* Ui Elements */}
            <Route path="/alerts" element={<Alerts />} />
            <Route path="/avatars" element={<Avatars />} />
            <Route path="/badge" element={<Badges />} />
            <Route path="/buttons" element={<Buttons />} />
            <Route path="/images" element={<Images />} />
            <Route path="/videos" element={<Videos />} />

            {/* Charts */}
            <Route path="/line-chart" element={<LineChart />} />
            <Route path="/bar-chart" element={<BarChart />} />
          </Route>

          {/* Auth Layout - Public Routes */}
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />

          {/* Fallback Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
