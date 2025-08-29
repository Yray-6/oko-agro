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
    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
      {/* Star Rating */}
      <div className="flex items-center mb-4">
        {Array.from({ length: 5 }, (_, index) => (
          <Star
            key={index}
            className={`w-5 h-5 ${
              index < testimonial.rating
                ? 'text-yellow-400 fill-current'
                : 'text-gray-300'
            }`}
          />
        ))}
      </div>

      {/* Quote */}
      <blockquote className="text-gray-700 text-sm leading-relaxed mb-6">
        "{testimonial.quote}"
      </blockquote>

      {/* Customer Info */}
      <div className="flex items-center">
        <div className="w-10 h-10 bg-green-800 rounded-full flex items-center justify-center mr-3">
          <span className="text-white text-sm font-semibold">
            {testimonial.initials}
          </span>
        </div>
        <div>
          <h4 className="font-semibold text-gray-900 text-sm">
            {testimonial.name}
          </h4>
          <p className="text-gray-600 text-xs">
            {testimonial.role}, {testimonial.location}
          </p>
        </div>
      </div>
    </div>
  );
};

const Testimonials: React.FC<TestimonialsProps> = ({ testimonials = defaultTestimonials }) => {
  return (
    <div className="max-w-6xl mx-auto py-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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