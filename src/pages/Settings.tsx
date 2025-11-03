import { useState } from "react";
import PageBreadcrumb from "../components/common/PageBreadCrumb";
import Button from "../components/ui/button/Button";
import Input from "../components/form/input/InputField";
import Label from "../components/form/Label";
import Select from "../components/form/Select";
import TextArea from "../components/form/input/TextArea";
import FileInput from "../components/form/input/FileInput";
import { 
  PlusIcon, 
  TrashBinIcon,
  PencilIcon,
  CheckLineIcon,
  CloseIcon
} from "../icons";

interface BusinessInfo {
  businessName: string;
  businessLogo: string;
  gstNumber: string;
  panNumber: string;
  cinNumber: string;
  businessType: string;
  incorporationDate: string;
}

interface BusinessAddress {
  street: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  phone: string;
  email: string;
  website: string;
}

interface GSTSlab {
  id: string;
  name: string;
  rate: number;
  description: string;
  isActive: boolean;
}

interface TaxSettings {
  defaultGSTRate: number;
  enableTDS: boolean;
  tdsRate: number;
  enableReverseCharge: boolean;
  financialYearStart: string;
}

export default function Settings() {
  const [activeTab, setActiveTab] = useState("business-info");
  const [isEditing, setIsEditing] = useState<string | null>(null);
  
  // Business Information State
  const [businessInfo, setBusinessInfo] = useState<BusinessInfo>({
    businessName: "Influencer Network Pvt Ltd",
    businessLogo: "",
    gstNumber: "27AABCI1234L1Z5",
    panNumber: "AABCI1234L",
    cinNumber: "U74999MH2020PTC123456",
    businessType: "Private Limited Company",
    incorporationDate: "2020-01-15"
  });

  // Business Address State
  const [businessAddress, setBusinessAddress] = useState<BusinessAddress>({
    street: "123 Business Park, Sector 18",
    city: "Gurugram",
    state: "Haryana",
    pincode: "122015",
    country: "India",
    phone: "+91 9876543210",
    email: "contact@influencernetwork.com",
    website: "https://www.influencernetwork.com"
  });

  // GST Slabs State
  const [gstSlabs, setGstSlabs] = useState<GSTSlab[]>([
    { id: "1", name: "Standard Rate", rate: 18, description: "Standard GST rate for most services", isActive: true },
    { id: "2", name: "Reduced Rate", rate: 12, description: "Reduced rate for specific services", isActive: true },
    { id: "3", name: "Lower Rate", rate: 5, description: "Lower rate for essential services", isActive: true },
    { id: "4", name: "Zero Rate", rate: 0, description: "Zero rated or exempt services", isActive: false }
  ]);

  // Tax Settings State
  const [taxSettings, setTaxSettings] = useState<TaxSettings>({
    defaultGSTRate: 18,
    enableTDS: true,
    tdsRate: 10,
    enableReverseCharge: false,
    financialYearStart: "2024-04-01"
  });

  const businessTypeOptions = [
    { value: "Private Limited Company", label: "Private Limited Company" },
    { value: "Public Limited Company", label: "Public Limited Company" },
    { value: "Partnership", label: "Partnership" },
    { value: "LLP", label: "Limited Liability Partnership" },
    { value: "Sole Proprietorship", label: "Sole Proprietorship" },
    { value: "OPC", label: "One Person Company" }
  ];

  const stateOptions = [
    { value: "Andhra Pradesh", label: "Andhra Pradesh" },
    { value: "Arunachal Pradesh", label: "Arunachal Pradesh" },
    { value: "Assam", label: "Assam" },
    { value: "Bihar", label: "Bihar" },
    { value: "Chhattisgarh", label: "Chhattisgarh" },
    { value: "Delhi", label: "Delhi" },
    { value: "Goa", label: "Goa" },
    { value: "Gujarat", label: "Gujarat" },
    { value: "Haryana", label: "Haryana" },
    { value: "Himachal Pradesh", label: "Himachal Pradesh" },
    { value: "Jharkhand", label: "Jharkhand" },
    { value: "Karnataka", label: "Karnataka" },
    { value: "Kerala", label: "Kerala" },
    { value: "Madhya Pradesh", label: "Madhya Pradesh" },
    { value: "Maharashtra", label: "Maharashtra" },
    { value: "Manipur", label: "Manipur" },
    { value: "Meghalaya", label: "Meghalaya" },
    { value: "Mizoram", label: "Mizoram" },
    { value: "Nagaland", label: "Nagaland" },
    { value: "Odisha", label: "Odisha" },
    { value: "Punjab", label: "Punjab" },
    { value: "Rajasthan", label: "Rajasthan" },
    { value: "Sikkim", label: "Sikkim" },
    { value: "Tamil Nadu", label: "Tamil Nadu" },
    { value: "Telangana", label: "Telangana" },
    { value: "Tripura", label: "Tripura" },
    { value: "Uttar Pradesh", label: "Uttar Pradesh" },
    { value: "Uttarakhand", label: "Uttarakhand" },
    { value: "West Bengal", label: "West Bengal" }
  ];

  const handleBusinessInfoChange = (field: keyof BusinessInfo, value: string) => {
    setBusinessInfo(prev => ({ ...prev, [field]: value }));
  };

  const handleBusinessAddressChange = (field: keyof BusinessAddress, value: string) => {
    setBusinessAddress(prev => ({ ...prev, [field]: value }));
  };

  const handleTaxSettingsChange = (field: keyof TaxSettings, value: string | number | boolean) => {
    setTaxSettings(prev => ({ ...prev, [field]: value }));
  };

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // In a real app, you would upload this to a server
      const reader = new FileReader();
      reader.onload = (e) => {
        setBusinessInfo(prev => ({ ...prev, businessLogo: e.target?.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const addGSTSlab = () => {
    const newSlab: GSTSlab = {
      id: Date.now().toString(),
      name: "",
      rate: 0,
      description: "",
      isActive: true
    };
    setGstSlabs(prev => [...prev, newSlab]);
    setIsEditing(newSlab.id);
  };

  const updateGSTSlab = (id: string, field: keyof GSTSlab, value: string | number | boolean) => {
    setGstSlabs(prev => prev.map(slab => 
      slab.id === id ? { ...slab, [field]: value } : slab
    ));
  };

  const deleteGSTSlab = (id: string) => {
    setGstSlabs(prev => prev.filter(slab => slab.id !== id));
  };

  const saveSettings = () => {
    // In a real app, you would save this to a backend
    console.log("Saving settings:", { businessInfo, businessAddress, gstSlabs, taxSettings });
    alert("Settings saved successfully!");
  };

  const tabs = [
    { id: "business-info", label: "Business Information" },
    { id: "address", label: "Business Address" },
    { id: "gst-slabs", label: "GST Slabs" },
    { id: "tax-settings", label: "Tax & Compliance" }
  ];

  return (
    <div className="p-6">
      <PageBreadcrumb pageTitle="Business Settings" />
      
      {/* Tab Navigation */}
      <div className="mb-6">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? "border-brand-500 text-brand-600 dark:text-brand-400"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-white/[0.05] dark:bg-white/[0.03]">
        
        {/* Business Information Tab */}
        {activeTab === "business-info" && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white/90 mb-4">
                Business Information
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Configure your business details, registration information, and company logo.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Business Logo */}
              <div className="lg:col-span-2">
                <Label>Business Logo</Label>
                <div className="flex items-center space-x-4">
                  {businessInfo.businessLogo ? (
                    <img 
                      src={businessInfo.businessLogo} 
                      alt="Business Logo" 
                      className="w-16 h-16 object-cover rounded-lg border border-gray-200 dark:border-gray-700"
                    />
                  ) : (
                    <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 flex items-center justify-center">
                      <span className="text-gray-400 text-xs">No Logo</span>
                    </div>
                  )}
                  <FileInput onChange={handleLogoUpload} className="flex-1" />
                </div>
              </div>

              {/* Business Name */}
              <div>
                <Label htmlFor="businessName">Business Name *</Label>
                <Input
                  id="businessName"
                  type="text"
                  value={businessInfo.businessName}
                  onChange={(e) => handleBusinessInfoChange('businessName', e.target.value)}
                  placeholder="Enter business name"
                />
              </div>

              {/* Business Type */}
              <div>
                <Label htmlFor="businessType">Business Type *</Label>
                <Select
                  options={businessTypeOptions}
                  value={businessInfo.businessType}
                  onChange={(value) => handleBusinessInfoChange('businessType', value)}
                />
              </div>

              {/* GST Number */}
              <div>
                <Label htmlFor="gstNumber">GST Number *</Label>
                <Input
                  id="gstNumber"
                  type="text"
                  value={businessInfo.gstNumber}
                  onChange={(e) => handleBusinessInfoChange('gstNumber', e.target.value)}
                  placeholder="27AABCI1234L1Z5"
                />
              </div>

              {/* PAN Number */}
              <div>
                <Label htmlFor="panNumber">PAN Number *</Label>
                <Input
                  id="panNumber"
                  type="text"
                  value={businessInfo.panNumber}
                  onChange={(e) => handleBusinessInfoChange('panNumber', e.target.value)}
                  placeholder="AABCI1234L"
                />
              </div>

              {/* CIN Number */}
              <div>
                <Label htmlFor="cinNumber">CIN Number</Label>
                <Input
                  id="cinNumber"
                  type="text"
                  value={businessInfo.cinNumber}
                  onChange={(e) => handleBusinessInfoChange('cinNumber', e.target.value)}
                  placeholder="U74999MH2020PTC123456"
                />
              </div>

              {/* Incorporation Date */}
              <div>
                <Label htmlFor="incorporationDate">Incorporation Date</Label>
                <Input
                  id="incorporationDate"
                  type="date"
                  value={businessInfo.incorporationDate}
                  onChange={(e) => handleBusinessInfoChange('incorporationDate', e.target.value)}
                />
              </div>
            </div>
          </div>
        )}

        {/* Business Address Tab */}
        {activeTab === "address" && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white/90 mb-4">
                Business Address & Contact
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Configure your business address and contact information.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Street Address */}
              <div className="lg:col-span-2">
                <Label htmlFor="street">Street Address *</Label>
                <TextArea
                  value={businessAddress.street}
                  onChange={(value) => handleBusinessAddressChange('street', value)}
                  placeholder="Enter complete street address"
                  rows={2}
                />
              </div>

              {/* City */}
              <div>
                <Label htmlFor="city">City *</Label>
                <Input
                  id="city"
                  type="text"
                  value={businessAddress.city}
                  onChange={(e) => handleBusinessAddressChange('city', e.target.value)}
                  placeholder="Enter city"
                />
              </div>

              {/* State */}
              <div>
                <Label htmlFor="state">State *</Label>
                <Select
                  options={stateOptions}
                  value={businessAddress.state}
                  onChange={(value) => handleBusinessAddressChange('state', value)}
                />
              </div>

              {/* Pincode */}
              <div>
                <Label htmlFor="pincode">Pincode *</Label>
                <Input
                  id="pincode"
                  type="text"
                  value={businessAddress.pincode}
                  onChange={(e) => handleBusinessAddressChange('pincode', e.target.value)}
                  placeholder="123456"
                />
              </div>

              {/* Country */}
              <div>
                <Label htmlFor="country">Country *</Label>
                <Input
                  id="country"
                  type="text"
                  value={businessAddress.country}
                  onChange={(e) => handleBusinessAddressChange('country', e.target.value)}
                  placeholder="India"
                />
              </div>

              {/* Phone */}
              <div>
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={businessAddress.phone}
                  onChange={(e) => handleBusinessAddressChange('phone', e.target.value)}
                  placeholder="+91 9876543210"
                />
              </div>

              {/* Email */}
              <div>
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  value={businessAddress.email}
                  onChange={(e) => handleBusinessAddressChange('email', e.target.value)}
                  placeholder="contact@company.com"
                />
              </div>

              {/* Website */}
              <div className="lg:col-span-2">
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  type="url"
                  value={businessAddress.website}
                  onChange={(e) => handleBusinessAddressChange('website', e.target.value)}
                  placeholder="https://www.company.com"
                />
              </div>
            </div>
          </div>
        )}

        {/* GST Slabs Tab */}
        {activeTab === "gst-slabs" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white/90 mb-2">
                  GST Slabs Configuration
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Configure GST rates for different types of services and products.
                </p>
              </div>
              <Button
                onClick={addGSTSlab}
                className="inline-flex items-center gap-2"
              >
                <PlusIcon className="w-4 h-4" />
                Add GST Slab
              </Button>
            </div>

            <div className="space-y-4">
              {gstSlabs.map((slab) => (
                <div key={slab.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  {isEditing === slab.id ? (
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div>
                        <Label>Slab Name</Label>
                        <Input
                          type="text"
                          value={slab.name}
                          onChange={(e) => updateGSTSlab(slab.id, 'name', e.target.value)}
                          placeholder="Enter slab name"
                        />
                      </div>
                      <div>
                        <Label>Rate (%)</Label>
                        <Input
                          type="number"
                          value={slab.rate.toString()}
                          onChange={(e) => updateGSTSlab(slab.id, 'rate', parseFloat(e.target.value) || 0)}
                          placeholder="18"
                          min="0"
                          max="100"
                          step={0.01}
                        />
                      </div>
                      <div className="md:col-span-2">
                        <Label>Description</Label>
                        <Input
                          type="text"
                          value={slab.description}
                          onChange={(e) => updateGSTSlab(slab.id, 'description', e.target.value)}
                          placeholder="Enter description"
                        />
                      </div>
                      <div className="md:col-span-4 flex justify-end space-x-2">
                        <Button
                          onClick={() => setIsEditing(null)}
                          className="inline-flex items-center gap-2 bg-success-500 hover:bg-success-600"
                        >
                          <CheckLineIcon className="w-4 h-4" />
                          Save
                        </Button>
                        <Button
                          onClick={() => {
                            if (slab.name === "") {
                              deleteGSTSlab(slab.id);
                            }
                            setIsEditing(null);
                          }}
                          className="inline-flex items-center gap-2 bg-gray-500 hover:bg-gray-600"
                        >
                          <CloseIcon className="w-4 h-4" />
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex justify-between items-center">
                      <div className="flex-1">
                        <div className="flex items-center space-x-4">
                          <h3 className="font-medium text-gray-800 dark:text-white/90">
                            {slab.name}
                          </h3>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-brand-100 text-brand-800 dark:bg-brand-900/20 dark:text-brand-400">
                            {slab.rate}%
                          </span>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            slab.isActive 
                              ? "bg-success-100 text-success-800 dark:bg-success-900/20 dark:text-success-400"
                              : "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400"
                          }`}>
                            {slab.isActive ? "Active" : "Inactive"}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          {slab.description}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => updateGSTSlab(slab.id, 'isActive', !slab.isActive)}
                          className={`px-3 py-1 rounded text-xs font-medium ${
                            slab.isActive
                              ? "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300"
                              : "bg-success-100 text-success-700 hover:bg-success-200 dark:bg-success-900/20 dark:text-success-400"
                          }`}
                        >
                          {slab.isActive ? "Deactivate" : "Activate"}
                        </button>
                        <Button
                          onClick={() => setIsEditing(slab.id)}
                          className="inline-flex items-center gap-1 px-3 py-1 text-xs bg-brand-500 hover:bg-brand-600"
                        >
                          <PencilIcon className="w-3 h-3" />
                          Edit
                        </Button>
                        <Button
                          onClick={() => deleteGSTSlab(slab.id)}
                          className="inline-flex items-center gap-1 px-3 py-1 text-xs bg-error-500 hover:bg-error-600"
                        >
                          <TrashBinIcon className="w-3 h-3" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tax Settings Tab */}
        {activeTab === "tax-settings" && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white/90 mb-4">
                Tax & Compliance Settings
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Configure tax rates, TDS settings, and compliance preferences.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Default GST Rate */}
              <div>
                <Label htmlFor="defaultGSTRate">Default GST Rate (%)</Label>
                <Input
                  id="defaultGSTRate"
                  type="number"
                  value={taxSettings.defaultGSTRate.toString()}
                  onChange={(e) => handleTaxSettingsChange('defaultGSTRate', parseFloat(e.target.value) || 0)}
                  placeholder="18"
                  min="0"
                  max="100"
                  step={0.01}
                />
              </div>

              {/* Financial Year Start */}
              <div>
                <Label htmlFor="financialYearStart">Financial Year Start</Label>
                <Input
                  id="financialYearStart"
                  type="date"
                  value={taxSettings.financialYearStart}
                  onChange={(e) => handleTaxSettingsChange('financialYearStart', e.target.value)}
                />
              </div>

              {/* TDS Settings */}
              <div className="lg:col-span-2 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <h3 className="font-medium text-gray-800 dark:text-white/90 mb-4">TDS Settings</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      id="enableTDS"
                      checked={taxSettings.enableTDS}
                      onChange={(e) => handleTaxSettingsChange('enableTDS', e.target.checked)}
                      className="w-4 h-4 text-brand-600 bg-gray-100 border-gray-300 rounded focus:ring-brand-500 dark:focus:ring-brand-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                    />
                    <Label htmlFor="enableTDS" className="mb-0">Enable TDS Deduction</Label>
                  </div>
                  {taxSettings.enableTDS && (
                    <div>
                      <Label htmlFor="tdsRate">TDS Rate (%)</Label>
                      <Input
                        id="tdsRate"
                        type="number"
                        value={taxSettings.tdsRate.toString()}
                        onChange={(e) => handleTaxSettingsChange('tdsRate', parseFloat(e.target.value) || 0)}
                        placeholder="10"
                        min="0"
                        max="100"
                        step={0.01}
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Reverse Charge */}
              <div className="lg:col-span-2">
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="enableReverseCharge"
                    checked={taxSettings.enableReverseCharge}
                    onChange={(e) => handleTaxSettingsChange('enableReverseCharge', e.target.checked)}
                    className="w-4 h-4 text-brand-600 bg-gray-100 border-gray-300 rounded focus:ring-brand-500 dark:focus:ring-brand-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <div>
                    <Label htmlFor="enableReverseCharge" className="mb-0">Enable Reverse Charge Mechanism</Label>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Enable reverse charge for applicable transactions as per GST rules
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Save Button */}
        <div className="flex justify-end pt-6 border-t border-gray-200 dark:border-gray-700">
          <Button
            onClick={saveSettings}
            className="inline-flex items-center gap-2 bg-brand-500 hover:bg-brand-600"
          >
            <CheckLineIcon className="w-4 h-4" />
            Save Settings
          </Button>
        </div>
      </div>
    </div>
  );
}