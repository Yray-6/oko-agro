import React from 'react'
import leaf from '@/app/assets/images/leaf-01.png'
import Image from 'next/image'
import ServicesSection from './Gallery'

export default function Choose() {
  return (
    <div className='py-8 sm:py-12 px-4 sm:px-6 lg:px-[7%] relative'>
        {/* Responsive leaf positioning */}
        <div className='absolute -top-6 sm:-top-10 right-2 sm:right-4 lg:right-[5%]'>
            <Image 
              src={leaf} 
              alt="leaf" 
              width={150} 
              height={60}
              className='sm:w-[200px] lg:w-[250px] '
            />
        </div>
        
        {/* Responsive heading */}
        <p className='text-xl sm:text-2xl lg:text-3xl text-mainGreen font-semibold'>
          Why Choose Oko Agro Solutions
        </p>
        
        {/* Responsive description */}
        <p className='mt-3 sm:mt-4 text-base sm:text-lg leading-relaxed'>
          Our platform addresses the core challenges in African agricultural supply chains 
          <span className='hidden sm:inline'><br /></span>
          <span className='sm:hidden'> </span>
          through technology and quality assurance.
        </p>
       
       <ServicesSection/>
    </div>
  )
}