import React from 'react'
import Testimonials from './Testimonials'

export default function SuccessStories() {
  return (
    <div className='pb-8 sm:pb-12 px-4 sm:px-6 lg:px-[7%] relative'>
      {/* Responsive heading */}
      <p className='text-xl sm:text-2xl lg:text-3xl text-mainGreen font-semibold'>
        Success Stories
      </p>
      
      {/* Responsive description */}
      <p className='mt-3 sm:mt-4 mb-4 sm:mb-6 text-base sm:text-lg leading-relaxed'>
        Real farmers and processors sharing their experience with Oko Agro
      </p>
      
      <Testimonials/>
    </div>
  )
}