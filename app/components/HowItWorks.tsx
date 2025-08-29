import React from 'react'
import settings from '@/app/assets/images/settings-01.png'
import Image from 'next/image'
import ServicesSection from './Gallery'
import JourneyCards from './JourneyCards'

export default function HowItWorks() {
  return (
    <div className='pb-12 px-[7%] relative'>
        <div className='absolute -top-10 right-0'>
            <Image src={settings} alt="leaf" width={250} height={100}/>
        </div>
        <p className='text-3xl text-mainGreen'>How It Works</p>
        <p className='mt-4 mb-6 text-lg'>Simple steps to connect farmers and processors with quality assurance built-in</p>
            <JourneyCards/>
    </div>
  )
}
