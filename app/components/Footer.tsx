import React from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';
import Logo from '../assets/icons/Logo';

interface FooterLink {
  label: string;
  href: string;
}

interface FooterSection {
  title: string;
  links: FooterLink[];
}

interface ContactInfo {
  email: string;
  phone: string;
  location: string;
}

interface FooterProps {
  contactInfo?: ContactInfo;
  sections?: FooterSection[];
  companyDescription?: string;
}

const Footer: React.FC<FooterProps> = ({
  contactInfo = defaultContactInfo,
  sections = defaultSections,
  companyDescription = defaultDescription
}) => {
  return (
    <footer className="bg-mainGreen text-white pt-8 sm:pt-12 pb-16 sm:pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Main footer content grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-10 gap-6 sm:gap-8">
          {/* Company Info Section */}
          <div className="sm:col-span-2 lg:col-span-4">
            {/* Logo */}
            <div className="flex items-center mb-4 sm:mb-6">
              <Logo/>
              <h2 className="text-xl sm:text-2xl font-bold ml-2">Oko Agro</h2>
            </div>

            {/* Description */}
            <p className="text-green-100 mb-4 sm:mb-6 text-sm sm:text-base leading-relaxed">
              {companyDescription}
            </p>

            {/* Contact Information */}
            <div className="space-y-2 sm:space-y-3">
              <div className="flex items-center">
                <Mail className="w-4 h-4 mr-2 sm:mr-3 text-green-200 flex-shrink-0" />
                <a 
                  href={`mailto:${contactInfo.email}`}
                  className="text-green-100 hover:text-white transition-colors text-sm sm:text-base break-all sm:break-normal"
                >
                  {contactInfo.email}
                </a>
              </div>
              
              <div className="flex items-center">
                <Phone className="w-4 h-4 mr-2 sm:mr-3 text-green-200 flex-shrink-0" />
                <a 
                  href={`tel:${contactInfo.phone}`}
                  className="text-green-100 hover:text-white transition-colors text-sm sm:text-base"
                >
                  {contactInfo.phone}
                </a>
              </div>
              
              <div className="flex items-center">
                <MapPin className="w-4 h-4 mr-2 sm:mr-3 text-green-200 flex-shrink-0" />
                <span className="text-green-100 text-sm sm:text-base">
                  {contactInfo.location}
                </span>
              </div>
            </div>
          </div>

          {/* Footer Sections - Responsive layout */}
          <div className="sm:col-span-2 lg:col-span-6 grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-3 gap-6 sm:gap-8">
            {sections.map((section, index) => (
              <div key={index} className="">
                <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-white">
                  {section.title}
                </h3>
                <ul className="space-y-2 sm:space-y-3">
                  {section.links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <a
                        href={link.href}
                        className="text-green-100 hover:text-white transition-colors text-sm sm:text-base inline-block"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Copyright section */}
        <div className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-green-700">
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <p className="text-green-100 text-xs sm:text-sm text-center sm:text-left mb-2 sm:mb-0">
              © {new Date().getFullYear()} Oko Agro Solutions. All rights reserved.
            </p>
            <div className="flex space-x-4">
              <a href="/privacy" className="text-green-100 hover:text-white text-xs sm:text-sm transition-colors">
                Privacy
              </a>
              <a href="/terms" className="text-green-100 hover:text-white text-xs sm:text-sm transition-colors">
                Terms
              </a>
              <a href="/cookies" className="text-green-100 hover:text-white text-xs sm:text-sm transition-colors">
                Cookies
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

// Default data
const defaultContactInfo: ContactInfo = {
  email: 'hello@okoagrosolutions.com',
  phone: '+2347045672892',
  location: 'Lagos, Nigeria'
};

const defaultDescription = 'Connecting African agriculture through technology and quality assurance.';

const defaultSections: FooterSection[] = [
  {
    title: 'Platform',
    links: [
      { label: 'For Farmers', href: '/farmers' },
      { label: 'For Processors', href: '/processors' },
      { label: 'Quality Inspection', href: '/quality' }
    ]
  },
  {
    title: 'Support',
    links: [
      { label: 'Help Center', href: '/help' },
      { label: 'Contact Us', href: '/contact' },
      { label: 'FAQs', href: '/faqs' }
    ]
  },
  {
    title: 'Company',
    links: [
      { label: 'About Us', href: '/about' },
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Terms of Service', href: '/terms' }
    ]
  }
];

export default Footer;