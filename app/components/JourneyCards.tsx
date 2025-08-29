import React from 'react';
import Dot from '../assets/icons/Dot';

interface JourneyStep {
  title: string;
  description: string;
}

interface JourneyCardProps {
  title: string;
  subtitle: string;
  steps: JourneyStep[];
  cardColor: string;
  className?: string;
}

const farmerSteps: JourneyStep[] = [
  {
    title: "Register & Create Profile",
    description: "Sign up with farm details, crop types, and location information"
  },
  {
    title: "List Your Products",
    description: "Upload photos and details of your agricultural products with quantity and pricing"
  },
  {
    title: "Quality Inspection",
    description: "Professional inspectors verify your product quality and assign grade certification"
  },
  {
    title: "Connect With Buyers",
    description: "Receive inquiries from processors and negotiate directly for best prices"
  },
  {
    title: "Secure Payment",
    description: "Get paid within 24 hours through mobile money integration. Track all transactions with complete transparency."
  }
];

const processorSteps: JourneyStep[] = [
  {
    title: "Register & Verify Business",
    description: "Create business profile with processing requirements and compliance details"
  },
  {
    title: "Set Sourcing Requirements",
    description: "Define your crop needs, quality standards, quantities, and delivery preferences"
  },
  {
    title: "Search Quality Products",
    description: "Browse certified products from verified farmers matching your specifications"
  },
  {
    title: "Place Orders & Negotiate",
    description: "Contact farmers directly, negotiate terms, and place secure orders"
  },
  {
    title: "Track & Pay",
    description: "Monitor delivery progress and complete payment through secure channels"
  }
];

const JourneyCard: React.FC<JourneyCardProps> = ({
  title,
  subtitle,
  steps,
  cardColor,
  className = ""
}) => {
  return (
    <div className={`relative z-50 bg-white/50 rounded-2xl pb-6 px-5 shadow-lg border border-gray-200 h-full ${className}`}>
      <div className="mb-6">
        <div className={`${cardColor} text-mainGreen px-4 py-3 rounded-b-xl inline-block font-semibold text-sm`}>
          {title}
        </div>
        <p className="text-gray-600 mt-3 text-xs leading-relaxed">
          {subtitle}
        </p>
      </div>

      <div className="space-y-4">
        {steps.map((step, index) => (
          <div key={index} className="flex items-center px-5 py-4 shadow rounded bg-white/50 gap-4">
            <div className="flex-shrink-0 mt-0.5">
          <Dot/>
            </div>
            <div className="flex-1  min-w-0">
              <h3 className=" text-mainGreen text-sm mb-2">
                {step.title}
              </h3>
              <p className="text-black text-xs leading-relaxed">
                {step.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Main component showing both cards side by side
const JourneyCards: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 ">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-8 items-start">
          <JourneyCard
            title="Farmer Journey"
            subtitle="From listing your crops to getting paid - here's how farmers succeed on our platform"
            steps={farmerSteps}
            cardColor="bg-[#EEEEEE]"
          />
          
          <JourneyCard
            title="Processor Journey"
            subtitle="From sourcing requirements to delivery - here's how processors find quality suppliers"
            steps={processorSteps}
            cardColor="bg-[#EEEEEE]"
          />
        </div>
      </div>
    </div>
  );
};

export default JourneyCards;