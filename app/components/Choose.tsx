import React from 'react'
import leaf from '@/app/assets/images/leaf-01.png'
import Image from 'next/image'
import ServicesSection from './Gallery'

export default function Choose() {
  return (
    <div className='py-12 px-[7%] relative'>
        <div className='absolute -top-10 right-[5%]'>
            <Image src={leaf} alt="leaf" width={250} height={100}/>
        </div>
        <p className='text-3xl text-mainGreen'>Why Choose Oko Agro Solutions</p>
        <p className='mt-4 text-lg'>Our platform addresses the core challenges in African agricultural supply chains <br /> through technology and quality assurance.</p>
       <ServicesSection/>
    </div>
  )
}
