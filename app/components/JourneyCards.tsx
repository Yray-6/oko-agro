import React from 'react';
import Dot from '../assets/icons/Dot';
import Tractor from '../assets/icons/Tractor';
import Leaf from '../assets/icons/Leaf';
import Link from 'next/link';

interface JourneyStep {
  title: string;
  description: string;
}

interface JourneyCardProps {
  title: string;
  subtitle: string;
  steps: JourneyStep[];
  cardColor: string;
  buttonText: string;
  buttonIcon?: React.ReactNode;
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
  buttonText,
  buttonIcon,
  className = ""
}) => {
  return (
    <div className={`group relative z-50 bg-white/50 hover:bg-mainGreen/10 rounded-2xl pb-4 sm:pb-6 px-3 sm:px-5 shadow-lg border border-gray-200 h-full transition-all duration-300 hover:shadow-2xl hover:shadow-mainGreen/20 cursor-pointer ${className}`}>
      <div className="mb-4 sm:mb-6">
        <div className={`${cardColor} group-hover:bg-mainGreen group-hover:text-white text-mainGreen px-3 sm:px-4 py-2 sm:py-3 rounded-b-xl inline-block font-semibold text-xs sm:text-sm transition-all duration-300`}>
          {title}
        </div>
        <p className="text-gray-600 mt-2 sm:mt-3 text-xs sm:text-sm leading-relaxed">
          {subtitle}
        </p>
      </div>
       
      <div className="space-y-3 sm:space-y-4">
        {steps.map((step, index) => (
          <div key={index} className="flex items-start px-3 sm:px-5 py-3 sm:py-4 shadow rounded-xl bg-white/50 gap-3 sm:gap-4 transition-all duration-200 group-hover:bg-white/80">
            <div className="flex-shrink-0 mt-0.5">
              <Dot/>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-mainGreen font-semibold text-xs sm:text-sm mb-1 sm:mb-2 leading-tight">
                {step.title}
              </h3>
              <p className="text-black text-xs leading-relaxed">
                {step.description}
              </p>
            </div>
          </div>
        ))}
      </div>
      
      {/* Hover Button - Hidden on mobile, shown on hover for desktop */}
      <div className="flex justify-center mt-4 sm:mt-6 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-all duration-300 transform translate-y-0 sm:translate-y-2 sm:group-hover:translate-y-0">
        <Link href="/login-farmer" className='cursor-pointer'>
          <button className="bg-gray-200 hover:bg-gray-300 text-mainGreen px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-medium text-xs sm:text-sm flex items-center gap-2 transition-all duration-200 shadow-md">
            {buttonIcon}
            <span className="hidden sm:inline">{buttonText}</span>
            <span className="sm:hidden">Get Started</span>
          </button>
        </Link>
      </div>
    </div>
  );
};



// Main component showing both cards side by side
const JourneyCards: React.FC = () => {
  return (
    <div className="min-h-screen bg-transparent p-0 sm:p-4 lg:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Responsive grid - stack on mobile, side by side on larger screens */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 items-start">
          <JourneyCard
            title="Farmer Journey"
            subtitle="From listing your crops to getting paid - here's how farmers succeed on our platform"
            steps={farmerSteps}
            cardColor="bg-gray-200"
            buttonText="Get Started as A Farmer"
            buttonIcon={<Leaf color='#004829'/>}
          />
                     
          <JourneyCard
            title="Processor Journey"
            subtitle="From sourcing requirements to delivery - here's how processors find quality suppliers"
            steps={processorSteps}
            cardColor="bg-gray-200"
            buttonText="Get Started as A Processor"
            buttonIcon={<Tractor />}
          />
        </div>
      </div>
    </div>
  );
};

export default JourneyCards;