import { useState } from "react";
import PageBreadcrumb from "../components/common/PageBreadCrumb";
import Button from "../components/ui/button/Button";
import Input from "../components/form/input/InputField";
import Label from "../components/form/Label";
import Select from "../components/form/Select";
import TextArea from "../components/form/input/TextArea";
import { Modal } from "../components/ui/modal";
import { 
  ChevronDownIcon, 
  ChevronUpIcon, 
  PaperPlaneIcon, 
  EnvelopeIcon,
  InfoIcon,
  CheckCircleIcon
} from "../icons";

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
}

interface SupportTicket {
  subject: string;
  category: string;
  priority: string;
  description: string;
  email: string;
  name: string;
}

export default function HelpSupport() {
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);
  const [isTicketSubmitted, setIsTicketSubmitted] = useState(false);
  const [ticketData, setTicketData] = useState<SupportTicket>({
    subject: "",
    category: "",
    priority: "medium",
    description: "",
    email: "",
    name: ""
  });

  const faqCategories = [
    { value: "all", label: "All Categories" },
    { value: "getting-started", label: "Getting Started" },
    { value: "campaigns", label: "Campaigns & Projects" },
    { value: "invoices", label: "Invoices & Payments" },
    { value: "people", label: "People & Contacts" },
    { value: "reports", label: "Reports & Analytics" },
    { value: "settings", label: "Settings & Configuration" },
    { value: "technical", label: "Technical Issues" }
  ];

  const faqs: FAQ[] = [
    // Getting Started
    {
      id: "1",
      question: "How do I get started with the platform?",
      answer: "Welcome to our influencer marketing platform! Start by completing your business profile in Settings, then add your first campaign or client. Our dashboard will guide you through the essential features like managing contacts, creating invoices, and tracking campaign performance.",
      category: "getting-started"
    },
    {
      id: "2",
      question: "What are the main features of this platform?",
      answer: "Our platform offers comprehensive influencer marketing management including: Campaign & Project management, Client & Influencer database, Invoice & Payment tracking, Rate card management, Analytics & Reporting, Task management, File storage, and Integration tools.",
      category: "getting-started"
    },
    {
      id: "3",
      question: "How do I navigate the dashboard?",
      answer: "The dashboard is organized into main sections accessible via the sidebar: Dashboard (overview), Campaigns & Projects, People (contacts), Invoices & Payments, Rate Cards, Reports & Insights, Tasks, Portfolio & Files, Messages, and Settings. Each section contains relevant tools and data for that area.",
      category: "getting-started"
    },

    // Campaigns
    {
      id: "4",
      question: "How do I create a new campaign?",
      answer: "Go to 'Campaigns & Projects' and click 'Add Campaign'. Fill in the campaign details including name, client, budget, timeline, and deliverables. You can assign team members, set milestones, and track progress throughout the campaign lifecycle.",
      category: "campaigns"
    },
    {
      id: "5",
      question: "Can I duplicate existing campaigns?",
      answer: "Yes! In the Campaigns section, click the three-dot menu next to any campaign and select 'Duplicate'. This creates a copy with all the original settings, which you can then modify for your new campaign.",
      category: "campaigns"
    },
    {
      id: "6",
      question: "How do I track campaign performance?",
      answer: "Campaign performance can be tracked through the Reports & Analytics section. You'll find metrics on reach, engagement, conversions, ROI, and other KPIs. Each campaign also has its own performance dashboard with real-time updates.",
      category: "campaigns"
    },

    // Invoices & Payments
    {
      id: "7",
      question: "How do I create and send invoices?",
      answer: "Navigate to 'Invoices & Payments', click 'Create Invoice', select your client, add line items with descriptions and amounts, set payment terms, and send directly through the platform. You can track payment status and send reminders automatically.",
      category: "invoices"
    },
    {
      id: "8",
      question: "What payment methods are supported?",
      answer: "We support various payment methods including Bank Transfer, UPI, Credit/Debit Cards, Digital Wallets, and Cryptocurrency. Payment tracking helps you monitor which invoices are paid, pending, or overdue.",
      category: "invoices"
    },
    {
      id: "9",
      question: "How do I handle GST and tax calculations?",
      answer: "Configure your GST settings in the Settings page. You can set up different GST slabs (0%, 5%, 12%, 18%, 28%) and the system will automatically calculate taxes on invoices. TDS and reverse charge mechanisms are also supported.",
      category: "invoices"
    },

    // People & Contacts
    {
      id: "10",
      question: "How do I manage my contacts and influencers?",
      answer: "The 'People' section lets you manage all contacts including clients, influencers, team members, and vendors. You can store contact details, social media profiles, rates, availability, and interaction history in one centralized database.",
      category: "people"
    },
    {
      id: "11",
      question: "Can I import contacts from other platforms?",
      answer: "Yes, you can import contacts via CSV upload or connect with popular platforms through our integrations. The system will help you map fields and avoid duplicates during the import process.",
      category: "people"
    },

    // Reports & Analytics
    {
      id: "12",
      question: "What types of reports are available?",
      answer: "Our reporting suite includes Invoice summaries, Expense tracking, Purchase orders, Client performance, Payment analytics, and Payout reports. All reports can be filtered by date range and exported to CSV for further analysis.",
      category: "reports"
    },
    {
      id: "13",
      question: "How do I export data for external analysis?",
      answer: "Most data tables include an 'Export' or 'Download CSV' button. You can also generate custom reports in the Reports section and export them in various formats including CSV, PDF, and Excel.",
      category: "reports"
    },

    // Settings & Configuration
    {
      id: "14",
      question: "How do I configure my business settings?",
      answer: "Go to Settings to configure your business information, logo, GST details, PAN number, business address, tax settings, and other compliance requirements. These settings affect invoicing, reporting, and legal compliance.",
      category: "settings"
    },
    {
      id: "15",
      question: "Can I customize the platform for my brand?",
      answer: "Yes! Upload your business logo, set your brand colors, and customize invoice templates in the Settings section. You can also configure default rates, payment terms, and other business-specific preferences.",
      category: "settings"
    },

    // Technical Issues
    {
      id: "16",
      question: "The platform is loading slowly. What should I do?",
      answer: "Try refreshing your browser, clearing cache and cookies, or switching to a different browser. Ensure you have a stable internet connection. If issues persist, contact our support team with details about your browser and operating system.",
      category: "technical"
    },
    {
      id: "17",
      question: "I'm having trouble uploading files. What's wrong?",
      answer: "Check that your file size is under the limit (usually 10MB), file format is supported (PDF, JPG, PNG, DOC, etc.), and you have sufficient storage space. Try uploading a smaller file or different format to isolate the issue.",
      category: "technical"
    },
    {
      id: "18",
      question: "How do I reset my password?",
      answer: "Click 'Forgot Password' on the login page, enter your email address, and follow the instructions in the reset email. If you don't receive the email, check your spam folder or contact support for assistance.",
      category: "technical"
    }
  ];

  const ticketCategories = [
    { value: "", label: "Select Category" },
    { value: "technical", label: "Technical Issue" },
    { value: "billing", label: "Billing & Payments" },
    { value: "feature", label: "Feature Request" },
    { value: "account", label: "Account Management" },
    { value: "integration", label: "Integration Support" },
    { value: "other", label: "Other" }
  ];

  const priorityOptions = [
    { value: "low", label: "Low" },
    { value: "medium", label: "Medium" },
    { value: "high", label: "High" },
    { value: "urgent", label: "Urgent" }
  ];

  const filteredFAQs = selectedCategory === "all" 
    ? faqs 
    : faqs.filter(faq => faq.category === selectedCategory);

  const toggleFAQ = (faqId: string) => {
    setExpandedFAQ(expandedFAQ === faqId ? null : faqId);
  };

  const handleTicketInputChange = (field: keyof SupportTicket, value: string) => {
    setTicketData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleTicketSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!ticketData.name || !ticketData.email || !ticketData.subject || !ticketData.description) {
      alert('Please fill in all required fields');
      return;
    }

    // Simulate ticket submission
    console.log('Support ticket submitted:', ticketData);
    setIsTicketSubmitted(true);
    
    // Reset form after 3 seconds
    setTimeout(() => {
      setIsTicketSubmitted(false);
      setIsTicketModalOpen(false);
      setTicketData({
        subject: "",
        category: "",
        priority: "medium",
        description: "",
        email: "",
        name: ""
      });
    }, 3000);
  };

  return (
    <div className="p-6">
      <PageBreadcrumb pageTitle="Help & Support" />
      
      {/* Header Section */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-white/[0.05] dark:bg-white/[0.03] mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-white/90 mb-2">
              Help & Support Center
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Find answers to common questions or contact our support team for assistance
            </p>
          </div>
          <Button 
            onClick={() => setIsTicketModalOpen(true)}
            className="inline-flex items-center gap-2 bg-brand-500 hover:bg-brand-600 text-white px-6 py-3"
          >
            <PaperPlaneIcon className="w-4 h-4" />
            Contact Support
          </Button>
        </div>
      </div>

      {/* Quick Help Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-white/[0.03] border border-gray-200 dark:border-white/[0.05] rounded-xl p-6">
          <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mb-4">
            <InfoIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90 mb-2">
            Getting Started Guide
          </h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            New to the platform? Check out our comprehensive getting started guide and tutorials.
          </p>
        </div>

        <div className="bg-white dark:bg-white/[0.03] border border-gray-200 dark:border-white/[0.05] rounded-xl p-6">
          <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center mb-4">
            <EnvelopeIcon className="w-6 h-6 text-green-600 dark:text-green-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90 mb-2">
            Email Support
          </h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Get personalized help from our support team. Average response time: 2-4 hours.
          </p>
        </div>

        <div className="bg-white dark:bg-white/[0.03] border border-gray-200 dark:border-white/[0.05] rounded-xl p-6">
          <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center mb-4">
            <CheckCircleIcon className="w-6 h-6 text-purple-600 dark:text-purple-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90 mb-2">
            System Status
          </h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            All systems operational. Check our status page for real-time updates and maintenance schedules.
          </p>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="bg-white dark:bg-white/[0.03] border border-gray-200 dark:border-white/[0.05] rounded-xl p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-white/90">
            Frequently Asked Questions
          </h3>
          <div className="w-full sm:w-64">
            <Select
              value={selectedCategory}
              onChange={(value) => setSelectedCategory(value)}
              options={faqCategories}
              placeholder="Filter by category"
            />
          </div>
        </div>

        <div className="space-y-4">
          {filteredFAQs.map((faq) => (
            <div
              key={faq.id}
              className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden"
            >
              <button
                onClick={() => toggleFAQ(faq.id)}
                className="w-full px-6 py-4 text-left bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors flex items-center justify-between"
              >
                <span className="font-medium text-gray-800 dark:text-white/90">
                  {faq.question}
                </span>
                {expandedFAQ === faq.id ? (
                  <ChevronUpIcon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                ) : (
                  <ChevronDownIcon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                )}
              </button>
              {expandedFAQ === faq.id && (
                <div className="px-6 py-4 bg-white dark:bg-gray-900/50">
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        {filteredFAQs.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500 dark:text-gray-400">
              No FAQs found for the selected category.
            </p>
          </div>
        )}
      </div>

      {/* Contact Information */}
      <div className="mt-8 bg-gradient-to-r from-brand-50 to-blue-50 dark:from-brand-900/20 dark:to-blue-900/20 border border-brand-200 dark:border-brand-800 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90 mb-4">
          Still need help?
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Can't find what you're looking for? Our support team is here to help you succeed.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Button 
            onClick={() => setIsTicketModalOpen(true)}
            className="inline-flex items-center gap-2 bg-brand-500 hover:bg-brand-600 text-white"
          >
            <PaperPlaneIcon className="w-4 h-4" />
            Submit Support Ticket
          </Button>
          <Button 
            variant="outline"
            className="inline-flex items-center gap-2"
          >
            <EnvelopeIcon className="w-4 h-4" />
            Email: support@oneinflu.com
          </Button>
        </div>
      </div>

      {/* Support Ticket Modal */}
      <Modal isOpen={isTicketModalOpen} onClose={() => setIsTicketModalOpen(false)} className="w-full max-w-2xl mx-2 sm:mx-4 my-2 sm:my-4">
        <div className="relative w-full max-h-[90vh] flex flex-col overflow-hidden rounded-3xl bg-white dark:bg-gray-900">
          {!isTicketSubmitted ? (
            <>
              {/* Modal Header */}
              <div className="flex-shrink-0 p-6 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-2xl font-semibold text-gray-800 dark:text-white/90 mb-2">
                  Submit Support Ticket
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Describe your issue and we'll get back to you as soon as possible
                </p>
              </div>

              {/* Modal Body */}
              <div className="flex-1 overflow-y-auto p-6">
                <form id="ticket-form" onSubmit={handleTicketSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                       <Label htmlFor="name">Full Name *</Label>
                       <Input
                         id="name"
                         type="text"
                         value={ticketData.name}
                         onChange={(e) => handleTicketInputChange('name', e.target.value)}
                         placeholder="Your full name"
                       />
                     </div>
                     <div>
                       <Label htmlFor="email">Email Address *</Label>
                       <Input
                         id="email"
                         type="email"
                         value={ticketData.email}
                         onChange={(e) => handleTicketInputChange('email', e.target.value)}
                         placeholder="your.email@example.com"
                       />
                     </div>
                  </div>

                  <div>
                     <Label htmlFor="subject">Subject *</Label>
                     <Input
                       id="subject"
                       type="text"
                       value={ticketData.subject}
                       onChange={(e) => handleTicketInputChange('subject', e.target.value)}
                       placeholder="Brief description of your issue"
                     />
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                     <div>
                       <Label htmlFor="category">Category</Label>
                       <Select
                         value={ticketData.category}
                         onChange={(value) => handleTicketInputChange('category', value)}
                         options={ticketCategories}
                         placeholder="Select category"
                       />
                     </div>
                     <div>
                       <Label htmlFor="priority">Priority</Label>
                       <Select
                         value={ticketData.priority}
                         onChange={(value) => handleTicketInputChange('priority', value)}
                         options={priorityOptions}
                         placeholder="Select priority"
                       />
                     </div>
                   </div>

                   <div>
                     <Label htmlFor="description">Description *</Label>
                     <TextArea
                       value={ticketData.description}
                       onChange={(value) => handleTicketInputChange('description', value)}
                       placeholder="Please provide detailed information about your issue, including steps to reproduce if applicable..."
                       rows={6}
                     />
                   </div>
                </form>
              </div>

              {/* Modal Footer */}
              <div className="flex-shrink-0 p-6 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
                <div className="flex justify-end gap-3">
                  <Button 
                    variant="outline" 
                    onClick={() => setIsTicketModalOpen(false)}
                    className="min-w-[100px]"
                  >
                    Cancel
                  </Button>
                  <button 
                    type="submit"
                    form="ticket-form"
                    className="inline-flex items-center justify-center gap-2 rounded-lg transition px-5 py-3.5 text-sm bg-brand-500 text-white shadow-theme-xs hover:bg-brand-600 disabled:bg-brand-300 min-w-[120px]"
                  >
                    <PaperPlaneIcon className="w-4 h-4" />
                    Submit Ticket
                  </button>
                </div>
              </div>
            </>
          ) : (
            /* Success State */
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircleIcon className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white/90 mb-2">
                Ticket Submitted Successfully!
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Thank you for contacting us. We've received your support ticket and will respond within 2-4 hours.
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                You'll receive a confirmation email with your ticket number shortly.
              </p>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
}