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
    <footer className="bg-mainGreen text-white py-12 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-10 gap-8">
          {/* Company Info Section */}
          <div className="lg:col-span-4">
            {/* Logo */}
            <div className="flex items-center mb-4">
           <Logo/>
              <h2 className="text-2xl font-bold">Oko Agro</h2>
            </div>

            {/* Description */}
            <p className="text-green-100 mb-6 text-sm leading-relaxed">
              {companyDescription}
            </p>

            {/* Contact Information */}
            <div className="space-y-3">
              <div className="flex items-center">
                <Mail className="w-4 h-4 mr-3 text-green-200" />
                <a 
                  href={`mailto:${contactInfo.email}`}
                  className="text-green-100 hover:text-white transition-colors text-sm"
                >
                  {contactInfo.email}
                </a>
              </div>
              
              <div className="flex items-center">
                <Phone className="w-4 h-4 mr-3 text-green-200" />
                <a 
                  href={`tel:${contactInfo.phone}`}
                  className="text-green-100 hover:text-white transition-colors text-sm"
                >
                  {contactInfo.phone}
                </a>
              </div>
              
              <div className="flex items-center">
                <MapPin className="w-4 h-4 mr-3 text-green-200" />
                <span className="text-green-100 text-sm">
                  {contactInfo.location}
                </span>
              </div>
            </div>
          </div>

          {/* Footer Sections */}
          {sections.map((section, index) => (
            <div key={index} className="lg:col-span-2">
              <h3 className="text-lg font-semibold mb-4 text-white">
                {section.title}
              </h3>
              <ul className="space-y-3">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <a
                      href={link.href}
                      className="text-green-100 hover:text-white transition-colors text-sm inline-block"
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