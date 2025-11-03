import { useState } from "react";
import PageBreadcrumb from "../components/common/PageBreadCrumb";
import DatePicker from "../components/form/date-picker";
import { Modal } from "../components/ui/modal";
import { 
  DocsIcon, 
  DollarLineIcon, 
  CheckCircleIcon, 
  TimeIcon,
  EyeIcon,
  DownloadIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  CloseIcon
} from "../icons";
import Badge from "../components/ui/badge/Badge";
import Button from "../components/ui/button/Button";

interface ReportSummary {
  id: string;
  title: string;
  count: number;
  amount?: number;
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
}

interface ReportSection {
  id: string;
  title: string;
  description: string;
  isExpanded: boolean;
  reports: ReportItem[];
}

interface ReportItem {
  id: string;
  name: string;
  description: string;
  lastGenerated: string;
  recordCount: number;
}

interface ReportModalData {
  isOpen: boolean;
  reportId: string;
  reportName: string;
  data: Record<string, string | number>[];
  columns: string[];
}

export default function ReportsInsights() {
  const [dateRange, setDateRange] = useState("Oct 01, 2025 - Oct 31, 2025");
  const [reportModal, setReportModal] = useState<ReportModalData>({
    isOpen: false,
    reportId: '',
    reportName: '',
    data: [],
    columns: []
  });

  // Sample data for different report types
  const getReportData = (reportId: string) => {
    const reportDataMap: Record<string, { columns: string[], data: Record<string, string | number>[] }> = {
      'invoices-list': {
        columns: ['Invoice ID', 'Client', 'Amount', 'Status', 'Due Date', 'Created Date'],
        data: [
          { 'Invoice ID': 'INV-001', 'Client': 'TechCorp Ltd', 'Amount': '₹25,000', 'Status': 'Paid', 'Due Date': '2025-01-15', 'Created Date': '2025-01-01' },
          { 'Invoice ID': 'INV-002', 'Client': 'Fashion Brand', 'Amount': '₹18,500', 'Status': 'Pending', 'Due Date': '2025-01-20', 'Created Date': '2025-01-05' },
          { 'Invoice ID': 'INV-003', 'Client': 'Beauty Co', 'Amount': '₹32,000', 'Status': 'Overdue', 'Due Date': '2025-01-10', 'Created Date': '2024-12-28' },
          { 'Invoice ID': 'INV-004', 'Client': 'Travel Agency', 'Amount': '₹15,750', 'Status': 'Draft', 'Due Date': '2025-01-25', 'Created Date': '2025-01-08' },
          { 'Invoice ID': 'INV-005', 'Client': 'Food Delivery', 'Amount': '₹28,900', 'Status': 'Paid', 'Due Date': '2025-01-18', 'Created Date': '2025-01-03' }
        ]
      },
      'overdue-invoices': {
        columns: ['Invoice ID', 'Client', 'Amount', 'Days Overdue', 'Due Date', 'Last Reminder'],
        data: [
          { 'Invoice ID': 'INV-003', 'Client': 'Beauty Co', 'Amount': '₹32,000', 'Days Overdue': 15, 'Due Date': '2025-01-10', 'Last Reminder': '2025-01-20' },
          { 'Invoice ID': 'INV-007', 'Client': 'Lifestyle Brand', 'Amount': '₹22,500', 'Days Overdue': 8, 'Due Date': '2025-01-17', 'Last Reminder': '2025-01-22' },
          { 'Invoice ID': 'INV-012', 'Client': 'Tech Startup', 'Amount': '₹45,000', 'Days Overdue': 3, 'Due Date': '2025-01-22', 'Last Reminder': '2025-01-24' }
        ]
      },
      'paid-invoices': {
        columns: ['Invoice ID', 'Client', 'Amount', 'Payment Date', 'Payment Method', 'Transaction ID'],
        data: [
          { 'Invoice ID': 'INV-001', 'Client': 'TechCorp Ltd', 'Amount': '₹25,000', 'Payment Date': '2025-01-14', 'Payment Method': 'Bank Transfer', 'Transaction ID': 'TXN-001' },
          { 'Invoice ID': 'INV-005', 'Client': 'Food Delivery', 'Amount': '₹28,900', 'Payment Date': '2025-01-16', 'Payment Method': 'UPI', 'Transaction ID': 'TXN-005' },
          { 'Invoice ID': 'INV-008', 'Client': 'E-commerce', 'Amount': '₹35,200', 'Payment Date': '2025-01-19', 'Payment Method': 'Credit Card', 'Transaction ID': 'TXN-008' }
        ]
      },
      'expenses-report': {
        columns: ['Expense ID', 'Category', 'Description', 'Amount', 'Date', 'Vendor', 'Status'],
        data: [
          { 'Expense ID': 'EXP-001', 'Category': 'Marketing', 'Description': 'Social Media Ads', 'Amount': '₹12,000', 'Date': '2025-01-15', 'Vendor': 'Meta Ads', 'Status': 'Approved' },
          { 'Expense ID': 'EXP-002', 'Category': 'Office Supplies', 'Description': 'Stationery & Equipment', 'Amount': '₹8,500', 'Date': '2025-01-18', 'Vendor': 'Office Mart', 'Status': 'Pending' },
          { 'Expense ID': 'EXP-003', 'Category': 'Travel', 'Description': 'Client Meeting Travel', 'Amount': '₹15,200', 'Date': '2025-01-20', 'Vendor': 'Travel Agency', 'Status': 'Approved' },
          { 'Expense ID': 'EXP-004', 'Category': 'Software', 'Description': 'Design Tools Subscription', 'Amount': '₹5,800', 'Date': '2025-01-22', 'Vendor': 'Adobe', 'Status': 'Approved' }
        ]
      },
      'client-list': {
        columns: ['Client ID', 'Company Name', 'Contact Person', 'Email', 'Phone', 'Industry', 'Status'],
        data: [
          { 'Client ID': 'CL-001', 'Company Name': 'TechCorp Ltd', 'Contact Person': 'John Smith', 'Email': 'john@techcorp.com', 'Phone': '+91 98765 43210', 'Industry': 'Technology', 'Status': 'Active' },
          { 'Client ID': 'CL-002', 'Company Name': 'Fashion Brand', 'Contact Person': 'Sarah Johnson', 'Email': 'sarah@fashionbrand.com', 'Phone': '+91 98765 43211', 'Industry': 'Fashion', 'Status': 'Active' },
          { 'Client ID': 'CL-003', 'Company Name': 'Beauty Co', 'Contact Person': 'Mike Wilson', 'Email': 'mike@beautyco.com', 'Phone': '+91 98765 43212', 'Industry': 'Beauty', 'Status': 'Inactive' },
          { 'Client ID': 'CL-004', 'Company Name': 'Travel Agency', 'Contact Person': 'Lisa Brown', 'Email': 'lisa@travelagency.com', 'Phone': '+91 98765 43213', 'Industry': 'Travel', 'Status': 'Active' }
        ]
      },
      'payment-history': {
        columns: ['Payment ID', 'Invoice ID', 'Client', 'Amount', 'Payment Date', 'Method', 'Status'],
        data: [
          { 'Payment ID': 'PAY-001', 'Invoice ID': 'INV-001', 'Client': 'TechCorp Ltd', 'Amount': '₹25,000', 'Payment Date': '2025-01-14', 'Method': 'Bank Transfer', 'Status': 'Completed' },
          { 'Payment ID': 'PAY-002', 'Invoice ID': 'INV-005', 'Client': 'Food Delivery', 'Amount': '₹28,900', 'Payment Date': '2025-01-16', 'Method': 'UPI', 'Status': 'Completed' },
          { 'Payment ID': 'PAY-003', 'Invoice ID': 'INV-008', 'Client': 'E-commerce', 'Amount': '₹35,200', 'Payment Date': '2025-01-19', 'Method': 'Credit Card', 'Status': 'Completed' },
          { 'Payment ID': 'PAY-004', 'Invoice ID': 'INV-010', 'Client': 'Startup Inc', 'Amount': '₹42,500', 'Payment Date': '2025-01-21', 'Method': 'Bank Transfer', 'Status': 'Processing' }
        ]
      },
      'influencer-payouts': {
        columns: ['Payout ID', 'Influencer', 'Campaign', 'Amount', 'Payout Date', 'Method', 'Status'],
        data: [
          { 'Payout ID': 'PO-001', 'Influencer': 'Alex Kumar', 'Campaign': 'Fashion Week 2025', 'Amount': '₹15,000', 'Payout Date': '2025-01-15', 'Method': 'Bank Transfer', 'Status': 'Completed' },
          { 'Payout ID': 'PO-002', 'Influencer': 'Priya Sharma', 'Campaign': 'Beauty Launch', 'Amount': '₹22,500', 'Payout Date': '2025-01-18', 'Method': 'UPI', 'Status': 'Completed' },
          { 'Payout ID': 'PO-003', 'Influencer': 'Rahul Verma', 'Campaign': 'Tech Review', 'Amount': '₹18,000', 'Payout Date': '2025-01-20', 'Method': 'Bank Transfer', 'Status': 'Pending' },
          { 'Payout ID': 'PO-004', 'Influencer': 'Sneha Patel', 'Campaign': 'Lifestyle Brand', 'Amount': '₹25,000', 'Payout Date': '2025-01-22', 'Method': 'UPI', 'Status': 'Processing' }
        ]
      }
    };

    return reportDataMap[reportId] || { columns: [], data: [] };
  };

  const [reportSections, setReportSections] = useState<ReportSection[]>([
    {
      id: "invoices",
      title: "Invoices Summary",
      description: "Invoice generation and payment tracking reports",
      isExpanded: true,
      reports: [
        {
          id: "invoices-list",
          name: "All Invoices",
          description: "Complete list of invoices with status and amounts",
          lastGenerated: "2025-01-25",
          recordCount: 156
        },
        {
          id: "overdue-invoices",
          name: "Overdue Invoices",
          description: "Invoices past their due date requiring follow-up",
          lastGenerated: "2025-01-25",
          recordCount: 12
        },
        {
          id: "paid-invoices",
          name: "Paid Invoices",
          description: "Successfully paid invoices with payment details",
          lastGenerated: "2025-01-25",
          recordCount: 89
        }
      ]
    },
    {
      id: "purchases",
      title: "Purchases and Expenses Summary",
      description: "Business expenses and purchase order tracking",
      isExpanded: true,
      reports: [
        {
          id: "expenses-report",
          name: "Expense Report",
          description: "Detailed breakdown of business expenses by category",
          lastGenerated: "2025-01-25",
          recordCount: 234
        },
        {
          id: "vendor-expenses",
          name: "Vendor Expenses",
          description: "Expenses grouped by vendor and supplier",
          lastGenerated: "2025-01-25",
          recordCount: 67
        },
        {
          id: "monthly-expenses",
          name: "Monthly Expense Trends",
          description: "Month-over-month expense analysis and trends",
          lastGenerated: "2025-01-25",
          recordCount: 12
        }
      ]
    },
    {
      id: "purchase-orders",
      title: "Purchase Order Summary",
      description: "Purchase order management and tracking reports",
      isExpanded: true,
      reports: [
        {
          id: "po-list",
          name: "Purchase Orders List",
          description: "All purchase orders with status and amounts",
          lastGenerated: "2025-01-25",
          recordCount: 45
        },
        {
          id: "pending-pos",
          name: "Pending Purchase Orders",
          description: "Purchase orders awaiting approval or delivery",
          lastGenerated: "2025-01-25",
          recordCount: 8
        }
      ]
    },
    {
      id: "clients",
      title: "Clients Report",
      description: "Client management and relationship reports",
      isExpanded: false,
      reports: [
        {
          id: "client-list",
          name: "Client Directory",
          description: "Complete client database with contact information",
          lastGenerated: "2025-01-25",
          recordCount: 89
        },
        {
          id: "client-revenue",
          name: "Client Revenue Report",
          description: "Revenue generated by each client over time",
          lastGenerated: "2025-01-25",
          recordCount: 89
        },
        {
          id: "client-activity",
          name: "Client Activity Report",
          description: "Client engagement and project activity summary",
          lastGenerated: "2025-01-25",
          recordCount: 89
        }
      ]
    },
    {
      id: "payments",
      title: "Payment Report",
      description: "Payment processing and transaction reports",
      isExpanded: false,
      reports: [
        {
          id: "payment-history",
          name: "Payment History",
          description: "Complete payment transaction history",
          lastGenerated: "2025-01-25",
          recordCount: 156
        },
        {
          id: "payment-methods",
          name: "Payment Methods Report",
          description: "Breakdown of payments by method (bank, card, etc.)",
          lastGenerated: "2025-01-25",
          recordCount: 156
        },
        {
          id: "failed-payments",
          name: "Failed Payments",
          description: "Failed payment attempts requiring attention",
          lastGenerated: "2025-01-25",
          recordCount: 7
        }
      ]
    },
    {
      id: "payouts",
      title: "Payouts Report",
      description: "Influencer and vendor payout tracking",
      isExpanded: false,
      reports: [
        {
          id: "influencer-payouts",
          name: "Influencer Payouts",
          description: "Payments made to influencers for campaigns",
          lastGenerated: "2025-01-25",
          recordCount: 67
        },
        {
          id: "vendor-payouts",
          name: "Vendor Payouts",
          description: "Payments made to vendors and suppliers",
          lastGenerated: "2025-01-25",
          recordCount: 34
        },
        {
          id: "pending-payouts",
          name: "Pending Payouts",
          description: "Payouts scheduled or awaiting processing",
          lastGenerated: "2025-01-25",
          recordCount: 12
        }
      ]
    }
  ]);

  // Summary data based on the image provided
  const summaryData: ReportSummary[] = [
    {
      id: "invoices",
      title: "Invoices",
      count: 0,
      amount: 0,
      icon: <DocsIcon className="size-6" />,
      iconBg: "bg-blue-100 dark:bg-blue-800/20",
      iconColor: "text-blue-600 dark:text-blue-400"
    },
    {
      id: "total-amount",
      title: "Total Amount",
      count: 0,
      amount: 0,
      icon: <DollarLineIcon className="size-6" />,
      iconBg: "bg-green-100 dark:bg-green-800/20",
      iconColor: "text-green-600 dark:text-green-400"
    },
    {
      id: "amount-due",
      title: "Amount Due",
      count: 0,
      amount: 0,
      icon: <TimeIcon className="size-6" />,
      iconBg: "bg-amber-100 dark:bg-amber-800/20",
      iconColor: "text-amber-600 dark:text-amber-400"
    },
    {
      id: "payment-received",
      title: "Payment Received",
      count: 0,
      amount: 0,
      icon: <CheckCircleIcon className="size-6" />,
      iconBg: "bg-emerald-100 dark:bg-emerald-800/20",
      iconColor: "text-emerald-600 dark:text-emerald-400"
    }
  ];

  const toggleSection = (sectionId: string) => {
    setReportSections(prev => 
      prev.map(section => 
        section.id === sectionId 
          ? { ...section, isExpanded: !section.isExpanded }
          : section
      )
    );
  };

  const handleViewReport = (reportId: string, reportName: string) => {
    const reportData = getReportData(reportId);
    setReportModal({
      isOpen: true,
      reportId,
      reportName,
      data: reportData.data,
      columns: reportData.columns
    });
  };

  const handleDownloadReport = (reportId: string) => {
    const reportData = getReportData(reportId);
    
    // Create CSV content
    const csvContent = [
      reportData.columns.join(','),
      ...reportData.data.map(row => 
        reportData.columns.map(col => `"${row[col] || ''}"`).join(',')
      )
    ].join('\n');

    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${reportId}-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const closeReportModal = () => {
    setReportModal({
      isOpen: false,
      reportId: '',
      reportName: '',
      data: [],
      columns: []
    });
  };

  const getStatusBadgeColor = (status: string | number): "success" | "warning" | "error" | "light" => {
    const statusStr = String(status).toLowerCase();
    if (statusStr.includes('paid') || statusStr.includes('completed') || statusStr.includes('active')) {
      return 'success';
    } else if (statusStr.includes('pending') || statusStr.includes('processing')) {
      return 'warning';
    } else if (statusStr.includes('overdue') || statusStr.includes('failed') || statusStr.includes('cancelled')) {
      return 'error';
    }
    return 'light';
  };

  return (
    <div className="p-6 space-y-6">
      <PageBreadcrumb pageTitle="Reports & Insights" />
      
      {/* Header Section */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white/90 mb-2">
              Select Filters to see Reports
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Generate comprehensive reports and gain insights into your business performance.
            </p>
          </div>
        </div>
      </div>

      {/* Date Range Filter */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Select Date Range
            </label>
            <DatePicker
              id="dateRange"
              mode="range"
              placeholder="Select date range"
              defaultDate={dateRange}
              onChange={(_dates, currentDateString) => {
                setDateRange(currentDateString);
              }}
            />
          </div>
          <div className="sm:mt-6">
            <Button className="w-full sm:w-auto">
              Apply Filter
            </Button>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {summaryData.map((item) => (
          <div key={item.id} className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
            <div className={`flex items-center justify-center w-12 h-12 rounded-xl ${item.iconBg}`}>
              <div className={item.iconColor}>
                {item.icon}
              </div>
            </div>
            <div className="mt-5">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {item.title}
              </span>
              <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
                {item.amount !== undefined ? `₹${item.amount.toLocaleString()}` : item.count}
              </h4>
            </div>
          </div>
        ))}
      </div>

      {/* Report Sections */}
      <div className="space-y-4">
        {reportSections.map((section) => (
          <div key={section.id} className="rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
            {/* Section Header */}
            <div 
              className="flex items-center justify-between p-6 cursor-pointer hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors"
              onClick={() => toggleSection(section.id)}
            >
              <div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                  {section.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {section.description}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Badge color="light">
                  {section.reports.length} reports
                </Badge>
                {section.isExpanded ? (
                  <ChevronUpIcon className="w-5 h-5 text-gray-400" />
                ) : (
                  <ChevronDownIcon className="w-5 h-5 text-gray-400" />
                )}
              </div>
            </div>

            {/* Section Content */}
            {section.isExpanded && (
              <div className="border-t border-gray-200 dark:border-white/[0.05] p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {section.reports.map((report) => (
                    <div key={report.id} className="border border-gray-200 dark:border-white/[0.05] rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-800 dark:text-white/90 mb-1">
                            {report.name}
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                            {report.description}
                          </p>
                          <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                            <span>Last generated: {report.lastGenerated}</span>
                            <span>{report.recordCount} records</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 pt-3 border-t border-gray-200 dark:border-white/[0.05]">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewReport(report.id, report.name)}
                          className="flex items-center gap-1 flex-1"
                        >
                          <EyeIcon className="w-4 h-4" />
                          View
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDownloadReport(report.id)}
                          className="flex items-center gap-1 flex-1"
                        >
                          <DownloadIcon className="w-4 h-4" />
                          Download
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Report Data Modal */}
      <Modal 
        isOpen={reportModal.isOpen} 
        onClose={closeReportModal}
        className="w-full max-w-7xl mx-2 sm:mx-4 my-4 sm:my-8 max-h-[95vh] sm:max-h-[90vh]"
      >
        <div className="relative w-full h-full overflow-hidden rounded-3xl bg-white dark:bg-gray-900">
          <div className="h-full overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 z-10 flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {reportModal.reportName}
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {reportModal.data.length} records • Generated on {new Date().toLocaleDateString()}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDownloadReport(reportModal.reportId)}
                  className="flex items-center gap-2"
                >
                  <DownloadIcon className="w-4 h-4" />
                  Download CSV
                </Button>
                <button
                  onClick={closeReportModal}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <CloseIcon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                </button>
              </div>
            </div>

            {/* Modal Body - Data Table */}
            <div className="p-6">
              {reportModal.data.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-gray-200 dark:border-gray-700 rounded-lg">
                    <thead>
                      <tr className="bg-gray-50 dark:bg-gray-800">
                        {reportModal.columns.map((column, index) => (
                          <th 
                            key={index}
                            className="border border-gray-200 dark:border-gray-700 px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white"
                          >
                            {column}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {reportModal.data.map((row, rowIndex) => (
                        <tr 
                          key={rowIndex}
                          className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                        >
                          {reportModal.columns.map((column, colIndex) => (
                            <td 
                              key={colIndex}
                              className="border border-gray-200 dark:border-gray-700 px-4 py-3 text-sm text-gray-900 dark:text-gray-300"
                            >
                              {column === 'Status' ? (
                                <Badge color={getStatusBadgeColor(row[column])}>
                                  {row[column]}
                                </Badge>
                              ) : (
                                row[column] || '-'
                              )}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="text-gray-500 dark:text-gray-400">
                    <DocsIcon className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p className="text-lg font-medium mb-2">No Data Available</p>
                    <p className="text-sm">This report doesn't have any data for the selected date range.</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}