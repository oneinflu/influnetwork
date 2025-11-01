import { useState } from "react";

import RateCardsTable from "../components/tables/RateCardsTable";
import { RateCard } from "../types/rateCard";

// Sample data for testing
const sampleRateCards: RateCard[] = [
  {
    id: "1",
    rateCardName: "Instagram Story – Fashion",
    category: "Instagram",
    serviceType: "Story",
    contentDuration: "30 sec",
    baseRate: 8000,
    discountPercentage: 10,
    finalRate: 7200,
    pricingType: "Per Post",
    linkedInfluencer: "@rhea_styles",
    applicableFor: "Brand",
    inclusions: "1 story + usage rights for 24 hours",
    deliveryTime: "1 day",
    lastUpdated: "2025-01-25",
    visibility: "Public",
    createdBy: "Rhea Styles (Influencer)",
    createdOn: "2025-01-15",
    attachments: ["contract.pdf", "brief.docx"],
  },
  {
    id: "2",
    rateCardName: "YouTube Product Review",
    category: "YouTube",
    serviceType: "Video",
    contentDuration: "5-8 min",
    baseRate: 25000,
    discountPercentage: 0,
    finalRate: 25000,
    pricingType: "Per Video",
    linkedInfluencer: "@manishtech",
    applicableFor: "Brand",
    inclusions: "1 dedicated review video + 3 social media posts",
    deliveryTime: "7 days",
    lastUpdated: "2025-01-24",
    visibility: "Private",
    createdBy: "Manish Tech (Influencer)",
    createdOn: "2025-01-10",
    attachments: ["guidelines.pdf"],
  },
  {
    id: "3",
    rateCardName: "Event Appearance – Lifestyle Expo",
    category: "Event",
    serviceType: "Appearance",
    contentDuration: "4 hours",
    baseRate: 40000,
    discountPercentage: 10,
    finalRate: 36000,
    pricingType: "Per Event",
    linkedInfluencer: "@nisha_vogue",
    applicableFor: "Agency",
    inclusions: "4-hour appearance + 5 social media posts + meet & greet",
    deliveryTime: "Event day",
    lastUpdated: "2025-01-23",
    visibility: "Public",
    createdBy: "Nisha Vogue (Influencer)",
    createdOn: "2025-01-08",
    attachments: [],
  },
  {
    id: "4",
    rateCardName: "TikTok Dance Challenge",
    category: "TikTok",
    serviceType: "Video",
    contentDuration: "15-30 sec",
    baseRate: 5000,
    discountPercentage: 15,
    finalRate: 4250,
    pricingType: "Per Post",
    linkedInfluencer: "@dance_queen",
    applicableFor: "Brand",
    inclusions: "1 TikTok video + 2 Instagram stories",
    deliveryTime: "2 days",
    lastUpdated: "2025-01-22",
    visibility: "Public",
    createdBy: "Dance Queen (Influencer)",
    createdOn: "2025-01-05",
    attachments: ["music_brief.pdf", "choreography.mp4"],
  },
  {
    id: "5",
    rateCardName: "LinkedIn Thought Leadership",
    category: "LinkedIn",
    serviceType: "Post",
    contentDuration: "N/A",
    baseRate: 12000,
    discountPercentage: 5,
    finalRate: 11400,
    pricingType: "Per Post",
    linkedInfluencer: "@business_guru",
    applicableFor: "B2B Brand",
    inclusions: "1 LinkedIn post + engagement for 48 hours",
    deliveryTime: "3 days",
    lastUpdated: "2025-01-21",
    visibility: "Private",
    createdBy: "Business Guru (Influencer)",
    createdOn: "2025-01-01",
    attachments: ["content_strategy.docx"],
  },
];

export default function RateCards() {
  const [rateCards, setRateCards] = useState<RateCard[]>(sampleRateCards);

  const handleAddRateCard = () => {
    console.log("Add rate card");
  };

  const handleEditRateCard = (rateCard: RateCard) => {
    console.log("Edit rate card:", rateCard);
  };

  const handleDuplicateRateCard = (rateCard: RateCard) => {
    const duplicatedCard: RateCard = {
      ...rateCard,
      id: Date.now().toString(),
      rateCardName: `${rateCard.rateCardName} (Copy)`,
      createdOn: new Date().toISOString().split('T')[0],
      lastUpdated: new Date().toISOString().split('T')[0],
    };
    setRateCards(prev => [...prev, duplicatedCard]);
    console.log("Duplicated rate card:", duplicatedCard);
  };

  const handleDeleteRateCard = (id: string) => {
    setRateCards(prev => prev.filter(card => card.id !== id));
    console.log("Deleted rate card with id:", id);
  };

  const handleViewRateCard = (rateCard: RateCard) => {
    console.log("View rate card:", rateCard);
    // You can implement a detail modal here later
    alert(`Viewing: ${rateCard.rateCardName}\nInfluencer: ${rateCard.linkedInfluencer}\nRate: ₹${rateCard.finalRate.toLocaleString()}`);
  };

  const handleToggleVisibility = (id: string, visibility: 'Public' | 'Private') => {
    setRateCards(prev => prev.map(card => 
      card.id === id ? { ...card, visibility, lastUpdated: new Date().toISOString().split('T')[0] } : card
    ));
    console.log("Toggle visibility:", id, visibility);
  };

  return (
    <div className="p-6">
   
      <RateCardsTable
        rateCards={rateCards}
        onAddRateCard={handleAddRateCard}
        onEditRateCard={handleEditRateCard}
        onDuplicateRateCard={handleDuplicateRateCard}
        onDeleteRateCard={handleDeleteRateCard}
        onViewRateCard={handleViewRateCard}
        onToggleVisibility={handleToggleVisibility}
      />
    </div>
  );
}