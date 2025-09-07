
import CalendarView from "@/app/components/dashboard/CalendarView";
import ScheduleEvent from "@/app/components/dashboard/Schedule";
import ScheduleSummary from "@/app/components/dashboard/ScheduleSummary";
import { Clock, Plus } from "lucide-react";
import Link from "next/link";
import React from "react";

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
          <Link href={"/dashboard/products"}>
            <button className="flex gap-2 items-center px-4 py-2 rounded-lg text-sm text-white bg-mainGreen hover:bg-green-600 transition-colors">
              <Plus color="white" size={16} />
              Add Event{" "}
            </button>
          </Link>
        </div>
      </div>
      <div className="border border-mainGreen/20 rounded-lg p-5 ">
        <div className="flex items-center  gap-2">
          <Clock size={17}/> Today&apos;s Schedule <span className="text-mainGreen bg-mainGreen/20 rounded-full text-xs px-2 py-1 font-medium">1 event</span>
      
        </div>
        <div className="mt-6">
              <ScheduleEvent title="Farm Inspection" time="10:00 AM" location="Main Farm" status="upcoming" />
        </div>
      </div>
      <div className="grid grid-cols-3 mt-5 gap-4">
          <div className="col-span-2">
            <CalendarView/>
          </div>
            <div className="col-span-1">
                <ScheduleSummary/>
            </div>
      </div>
    </div>
  )
  
}
