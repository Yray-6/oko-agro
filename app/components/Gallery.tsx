import React from 'react';
import Direct from '../assets/icons/Direct';
import Quality from '../assets/icons/Quality';
import Fair from '../assets/icons/Fair';
import Customer from '../assets/icons/Customer';
import Image1 from '@/app/assets/images/image-1.png'
import Image2 from '@/app/assets/images/image-2.png'
import Image4 from '@/app/assets/images/image-4.png'
import Image3 from '@/app/assets/images/image-3.png'
import Image from 'next/image';

export default function ServicesSection() {
  const services = [
    {
      id: 1,
      icon: Direct,
      title: "Direct Market Access",
      description: "Connect farmers directly with processors, eliminating costly middlemen and increasing profit margins for all parties.",
      image: Image1
    },
    {
      id: 2,
      icon: Quality,
      title: "Quality Assurance",
      description: "Professional quality inspections and certifications ensure premium products meet market standards.",
      image: Image2
    },
    {
      id: 3,
      icon: Fair,
      title: "Fair & Fast Payment",
      description: "Transparent pricing with mobile money integration ensures farmers receive fair payment within 24 hours of delivery.",
      image: Image3
    },
    {
      id: 4,
      icon: Customer,
      title: "Excellent Customer Service",
      description: "Our dedicated support team ensures quick responses, clear communication, and personalized solutions.",
      image: Image4
    }
  ];
 
  return (
    <div className="py-8 sm:py-12 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Responsive grid - 1 col on mobile, 2 on tablet, 4 on desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6">
          {services.map((service) => {
            const IconComponent = service.icon;
            return (
              <div
                key={service.id}
                className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden group"
              >
                {/* Responsive Image Section */}
                <div className="relative h-40 sm:h-48 overflow-hidden">
                  <Image
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    width={1000}
                    height={200}
                    sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 25vw"
                  />                             
                </div>
                
                {/* Responsive Content Section */}
                <div className="p-4 sm:p-5 lg:p-3 xl:p-4">
                  {/* Responsive Icon */}
                  <div className="mb-3 sm:mb-4 lg:mb-2 xl:mb-3 inline-flex p-2.5 sm:p-3 bg-mainGreen/20 rounded-full">
                    <IconComponent className="w-5 h-5 sm:w-6 sm:h-6 lg:w-4 lg:h-4 xl:w-5 xl:h-5 text-mainGreen" />
                  </div>
                  
                  {/* Responsive Title */}
                  <h3 className="text-lg sm:text-xl lg:text-lg xl:text-lg text-mainGreen mb-3 sm:mb-4 lg:mb-3 leading-tight font-semibold">
                    {service.title}
                  </h3>
                  
                  {/* Responsive Description */}
                  <p className="text-gray-700 text-sm sm:text-base lg:text-sm xl:text-sm leading-relaxed">
                    {service.description}
                  </p>       
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}