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
      image:Image2
    },
    {
      id: 3,
      icon: Fair,
      title: "Fair & Fast Payment",
      description: "Transparent pricing with mobile money integration ensures farmers receive fair payment within 24 hours of delivery.",
      image:Image3
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
    <div className="bg-gradient-to-br from-blue-50 to-green-50 py-16 ">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service) => {
            const IconComponent = service.icon;
            return (
              <div
                key={service.id}
                className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden group"
              >
                {/* Image Section */}
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    width={1000}
                    height={200}
                    
                  />
               
                </div>

                {/* Content Section */}
                <div className="p-3">
                  {/* Icon */}
                  <div className="mb-3 inline-flex p-3 bg-mainGreen/20 rounded-full">
                    <IconComponent className="w-6 h-6 text-mainGreen" />
                  </div>

                  {/* Title */}
                  <h3 className="text-xl 0 mb-3 leading-tight">
                    {service.title}
                  </h3>

                  {/* Description */}
                  <p className="text-gray-600 text-sm leading-relaxed">
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