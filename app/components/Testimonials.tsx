import React from 'react';
import { Star } from 'lucide-react';

interface Testimonial {
  id: string;
  name: string;
  role: string;
  location: string;
  quote: string;
  rating: number;
  initials: string;
}

interface TestimonialCardProps {
  testimonial: Testimonial;
}

interface TestimonialsProps {
  testimonials?: Testimonial[];
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({ testimonial }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6 shadow-sm hover:shadow-md transition-shadow duration-300 h-full flex flex-col">
      {/* Star Rating */}
      <div className="flex items-center mb-3 sm:mb-4">
        {Array.from({ length: 5 }, (_, index) => (
          <Star
            key={index}
            className={`w-4 h-4 sm:w-5 sm:h-5 ${
              index < testimonial.rating
                ? 'text-yellow-400 fill-current'
                : 'text-gray-300'
            }`}
          />
        ))}
      </div>

      {/* Quote - grows to fill space */}
      <blockquote className="text-gray-700 text-sm sm:text-base leading-relaxed mb-4 sm:mb-6 flex-grow">
        "{testimonial.quote}"
      </blockquote>

      {/* Customer Info */}
      <div className="flex items-center mt-auto">
        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-800 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
          <span className="text-white text-xs sm:text-sm font-semibold">
            {testimonial.initials}
          </span>
        </div>
        <div className="min-w-0 flex-1">
          <h4 className="font-semibold text-gray-900 text-sm sm:text-base truncate">
            {testimonial.name}
          </h4>
          <p className="text-gray-600 text-xs sm:text-sm">
            {testimonial.role}, {testimonial.location}
          </p>
        </div>
      </div>
    </div>
  );
};

const Testimonials: React.FC<TestimonialsProps> = ({ testimonials = defaultTestimonials }) => {
  return (
    <div className="max-w-6xl mx-auto py-4 sm:py-6">
      {/* Responsive grid - 1 col on mobile, 2 on tablet, 3 on desktop */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {testimonials.map((testimonial) => (
          <TestimonialCard key={testimonial.id} testimonial={testimonial} />
        ))}
      </div>
    </div>
  );
};

const defaultTestimonials: Testimonial[] = [
  {
    id: '1',
    name: 'Amaka Nwafor',
    role: 'Cassava Farmer',
    location: 'Nigeria',
    quote: 'Oko Agro helped me get 30% better prices by connecting directly with processors. No more middlemen taking my profits!',
    rating: 5,
    initials: 'AN'
  },
  {
    id: '2',
    name: 'Clement Jerry',
    role: 'Food Processor',
    location: 'Nigeria',
    quote: 'The quality assurance system gives me confidence in my sourcing. I know exactly what I\'m getting before it arrives.',
    rating: 5,
    initials: 'CJ'
  },
  {
    id: '3',
    name: 'Ibrahim Muhammad',
    role: 'Yam Farmer',
    location: 'Nigeria',
    quote: 'Even with poor internet, I can list my crops and get buyers. The mobile app works offline perfectly.',
    rating: 5,
    initials: 'IM'
  }
];

export default Testimonials;