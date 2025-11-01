import {
  UserIcon,
  DocsIcon,
  DollarLineIcon,
  PlusIcon,
  ArrowRightIcon,
} from "../../icons";

interface QuickActionButtonProps {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  onClick: () => void;
  color: string;
}

function QuickActionButton({ icon: Icon, title, description, onClick, color }: QuickActionButtonProps) {
  return (
    <button
      onClick={onClick}
      className="flex items-center justify-between w-full p-4 text-left bg-white border border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 dark:bg-white/[0.03] dark:border-gray-800 dark:hover:bg-white/[0.06] dark:hover:border-gray-700 transition-all group"
    >
      <div className="flex items-center space-x-3">
        <div className={`flex items-center justify-center w-10 h-10 ${color} rounded-lg`}>
          <Icon className="size-5 text-white" />
        </div>
        <div>
          <h4 className="font-medium text-gray-800 dark:text-white/90">{title}</h4>
          <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>
        </div>
      </div>
      <ArrowRightIcon className="size-5 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors" />
    </button>
  );
}

export default function QuickActions() {
  const quickActions = [
    {
      icon: UserIcon,
      title: "Add New Client",
      description: "Register a new client to your CRM",
      color: "bg-blue-500",
      onClick: () => console.log("Add New Client clicked"),
    },
    {
      icon: DocsIcon,
      title: "Create Invoice",
      description: "Generate and send invoices",
      color: "bg-green-500",
      onClick: () => console.log("Create Invoice clicked"),
    },
    {
      icon: DollarLineIcon,
      title: "Record New Payment",
      description: "Log received payments",
      color: "bg-emerald-500",
      onClick: () => console.log("Record New Payment clicked"),
    },
    {
      icon: DollarLineIcon,
      title: "Record New Expenses",
      description: "Track business expenses",
      color: "bg-red-500",
      onClick: () => console.log("Record New Expenses clicked"),
    },
    {
      icon: PlusIcon,
      title: "Add New Lead",
      description: "Add potential clients to pipeline",
      color: "bg-purple-500",
      onClick: () => console.log("Add New Lead clicked"),
    },
  ];

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white/90">
          Quick Actions
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Frequently used actions for your CRM
        </p>
      </div>
      
      <div className="space-y-3">
        {quickActions.map((action, index) => (
          <QuickActionButton
            key={index}
            icon={action.icon}
            title={action.title}
            description={action.description}
            onClick={action.onClick}
            color={action.color}
          />
        ))}
      </div>
    </div>
  );
}