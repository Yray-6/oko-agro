import React from 'react'
import settings from '@/app/assets/images/settings-01.png'
import Image from 'next/image'
import JourneyCards from './JourneyCards'

export default function HowItWorks() {
  return (
    <div className='pb-8 sm:pb-12 px-4 sm:px-6 lg:px-[7%] relative'>
        {/* Responsive settings image */}
        <div className='absolute -top-6 sm:-top-10 right-2 sm:right-4 lg:right-0'>
            <Image 
              src={settings} 
              alt="settings" 
              width={150} 
              height={60}
              className='sm:w-[200px]  lg:w-[250px] '
            />
        </div>
        
        {/* Responsive heading */}
        <p className='text-xl sm:text-2xl lg:text-3xl text-mainGreen font-semibold'>
          How It Works
        </p>
        
        {/* Responsive description */}
        <p className='mt-3 sm:mt-4 mb-4 sm:mb-6 text-base sm:text-lg leading-relaxed'>
          Simple steps to connect farmers and processors with quality assurance built-in
        </p>
        
        <JourneyCards/>
    </div>
  )
}