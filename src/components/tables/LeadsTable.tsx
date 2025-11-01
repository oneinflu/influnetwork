import { useState } from "react";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "../ui/table";
import Badge from "../ui/badge/Badge";
import Button from "../ui/button/Button";
import { EyeIcon, PencilIcon, TrashBinIcon, AlertIcon } from "../../icons";
import LeadDetailModal from "../modals/LeadDetailModal";
import LeadFormModal from "../modals/LeadFormModal";

// Define the Lead interface based on the specifications
export interface Lead {
  id: string;
  businessName: string;
  contactPerson: string;
  contactNumber: string;
  email: string;
  website: string;
  leadType: string;
  leadSource: string;
  status: 'New' | 'Contacted' | 'Proposal Sent' | 'Negotiation' | 'Won' | 'Lost';
  budgetRange: string;
  lastContacted: string;
  nextFollowUp: string;
  assignedTo: string;
  notes: string;
  conversionProbability: number;
  attachments: string;
  hasReminders: boolean;
  createdOn: string;
}

// Sample data for demonstration
const sampleLeads: Lead[] = [
  {
    id: "1",
    businessName: "Nykaa",
    contactPerson: "Rohan Sharma",
    contactNumber: "+91 98765 43210",
    email: "rohan@nykaa.com",
    website: "instagram.com/nykaabeauty",
    leadType: "Fashion",
    leadSource: "Inbound",
    status: "Proposal Sent",
    budgetRange: "₹25,000 – ₹1,00,000",
    lastContacted: "2025-10-30",
    nextFollowUp: "2025-11-02",
    assignedTo: "Ritika (Manager)",
    notes: "Discussed Diwali Campaign – waiting for approval",
    conversionProbability: 70,
    attachments: "proposal_nykaa.pdf",
    hasReminders: true,
    createdOn: "2025-10-25"
  },
  {
    id: "2",
    businessName: "Tanishq",
    contactPerson: "Priya Mehta",
    contactNumber: "+91 87654 32109",
    email: "priya@tanishq.co.in",
    website: "tanishq.co.in",
    leadType: "Lifestyle",
    leadSource: "Referral",
    status: "Negotiation",
    budgetRange: "₹50,000 – ₹2,00,000",
    lastContacted: "2025-10-28",
    nextFollowUp: "2025-11-01",
    assignedTo: "Amit (Sales)",
    notes: "Interested in jewelry campaign for wedding season",
    conversionProbability: 85,
    attachments: "tanishq_brief.pdf",
    hasReminders: false,
    createdOn: "2025-10-20"
  },
  {
    id: "3",
    businessName: "Zudio",
    contactPerson: "Karan Singh",
    contactNumber: "+91 76543 21098",
    email: "karan@zudio.com",
    website: "instagram.com/zudio_official",
    leadType: "Fashion",
    leadSource: "Discovery",
    status: "New",
    budgetRange: "₹15,000 – ₹75,000",
    lastContacted: "2025-10-29",
    nextFollowUp: "2025-11-03",
    assignedTo: "Sarah (Executive)",
    notes: "New brand launch campaign discussion",
    conversionProbability: 45,
    attachments: "",
    hasReminders: true,
    createdOn: "2025-10-29"
  }
];

export default function LeadsTable() {
  const [leads, setLeads] = useState<Lead[]>(sampleLeads);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [formMode, setFormMode] = useState<'add' | 'edit'>('add');

  // Modal handlers
  const handleViewLead = (lead: Lead) => {
    setSelectedLead(lead);
    setIsDetailModalOpen(true);
  };

  const handleEditLead = (lead: Lead) => {
    setSelectedLead(lead);
    setFormMode('edit');
    setIsFormModalOpen(true);
  };

  const handleDeleteLead = (leadId: string) => {
    if (window.confirm('Are you sure you want to delete this lead?')) {
      setLeads(prev => prev.filter(lead => lead.id !== leadId));
    }
  };

  const handleAddNewLead = () => {
    setSelectedLead(null);
    setFormMode('add');
    setIsFormModalOpen(true);
  };

  const handleSaveLead = (leadData: Partial<Lead>) => {
    if (formMode === 'add') {
      setLeads(prev => [...prev, leadData as Lead]);
    } else if (formMode === 'edit' && selectedLead) {
      setLeads(prev => prev.map(lead => 
        lead.id === selectedLead.id ? { ...lead, ...leadData } : lead
      ));
    }
  };

  const getStatusBadgeColor = (status: Lead['status']) => {
    switch (status) {
      case 'New':
        return 'info';
      case 'Contacted':
        return 'warning';
      case 'Proposal Sent':
        return 'primary';
      case 'Negotiation':
        return 'warning';
      case 'Won':
        return 'success';
      case 'Lost':
        return 'error';
      default:
        return 'light';
    }
  };

  const getLeadTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'fashion':
        return 'text-pink-600 dark:text-pink-400';
      case 'tech':
        return 'text-blue-600 dark:text-blue-400';
      case 'fmcg':
        return 'text-green-600 dark:text-green-400';
      case 'lifestyle':
        return 'text-purple-600 dark:text-purple-400';
      default:
        return 'text-gray-600 dark:text-gray-400';
    }
  };

  const getProbabilityColor = (probability: number) => {
    if (probability >= 70) return 'text-green-600 dark:text-green-400';
    if (probability >= 50) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      {/* Header with Add Lead Button */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-white/[0.05]">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Leads Management
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Track and manage your sales pipeline
          </p>
        </div>
        <Button onClick={handleAddNewLead}>
          Add New Lead
        </Button>
      </div>

      {/* Table */}
      <div className="max-w-full overflow-x-auto">
        <Table>
          <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
            <TableRow>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Business
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Contact
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Type
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Source
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Status
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Budget
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Assigned To
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Probability
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Next Follow-up
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Actions
              </TableCell>
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
            {leads.map((lead) => (
              <TableRow key={lead.id}>
                <TableCell className="px-5 py-4 sm:px-6 text-start">
                  <div>
                    <div className="font-medium text-gray-800 text-theme-sm dark:text-white/90">
                      {lead.businessName}
                    </div>
                    <div className="text-gray-500 text-theme-xs dark:text-gray-400">
                      {lead.contactPerson}
                    </div>
                  </div>
                </TableCell>
                <TableCell className="px-4 py-3 text-start">
                  <div>
                    <div className="text-gray-800 text-theme-sm dark:text-white/90">
                      {lead.email}
                    </div>
                    <div className="text-gray-500 text-theme-xs dark:text-gray-400">
                      {lead.contactNumber}
                    </div>
                  </div>
                </TableCell>
                <TableCell className="px-4 py-3 text-start">
                  <span className={`font-medium text-theme-sm ${getLeadTypeColor(lead.leadType)}`}>
                    {lead.leadType}
                  </span>
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                  {lead.leadSource}
                </TableCell>
                <TableCell className="px-4 py-3 text-start">
                  <Badge
                    size="sm"
                    color={getStatusBadgeColor(lead.status)}
                  >
                    {lead.status}
                  </Badge>
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                  {lead.budgetRange}
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                  {lead.assignedTo}
                </TableCell>
                <TableCell className="px-4 py-3 text-start">
                  <div className="flex items-center gap-2">
                    <span className={`font-medium text-theme-sm ${getProbabilityColor(lead.conversionProbability)}`}>
                      {lead.conversionProbability}%
                    </span>
                    <div className="w-16 bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${lead.conversionProbability}%` }}
                      ></div>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="px-4 py-3 text-start">
                  <div className="flex items-center gap-1">
                    <span className="text-gray-500 text-theme-sm dark:text-gray-400">
                      {new Date(lead.nextFollowUp).toLocaleDateString()}
                    </span>
                    {lead.hasReminders && (
                      <AlertIcon className="w-4 h-4 text-orange-500" />
                    )}
                  </div>
                </TableCell>
                <TableCell className="px-4 py-3 text-start">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleViewLead(lead)}
                      className="p-1 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                      title="View Details"
                    >
                      <EyeIcon className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleEditLead(lead)}
                      className="p-1 text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300"
                      title="Edit Lead"
                    >
                      <PencilIcon className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteLead(lead.id)}
                      className="p-1 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                      title="Delete Lead"
                    >
                      <TrashBinIcon className="w-4 h-4" />
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-gray-200 dark:border-white/[0.05]">
        <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
          <span>Showing {leads.length} leads</span>
          <span>Total conversion probability: {Math.round(leads.reduce((sum, lead) => sum + lead.conversionProbability, 0) / leads.length)}%</span>
        </div>
      </div>

      {/* Modals */}
      <LeadDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        lead={selectedLead}
        onEdit={(lead) => {
          setIsDetailModalOpen(false);
          handleEditLead(lead);
        }}
        onDelete={(leadId) => {
          setIsDetailModalOpen(false);
          handleDeleteLead(leadId);
        }}
      />

      <LeadFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        onSave={handleSaveLead}
        lead={selectedLead}
        mode={formMode}
      />
    </div>
  );
}