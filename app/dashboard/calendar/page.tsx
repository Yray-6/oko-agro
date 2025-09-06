import { Plus } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

export default function page() {
  return (
    <div>
         <div className="justify-between flex items-center py-4">
        <div>
          <p className="font-medium text-lg">Schedule & Calendar</p>
          <p className="text-sm text-gray-600">
          Manage your farming activities
          </p>
        </div>
        <div>
          <Link href={'/dashboard/products'}>
            <button className="flex gap-2 items-center px-4 py-2 rounded-lg text-sm text-white bg-mainGreen hover:bg-green-600 transition-colors">
              <Plus color="white" size={16} />
              Add Event </button>
          </Link>
        </div>
      </div>

    </div>
  )
}
