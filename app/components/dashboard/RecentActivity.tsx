'use client'
import { TrendingUp } from "lucide-react";
import ActivityItemComponent, { ActivityItem } from "./ActivityItems";
import { useState } from "react";

const RecentActivity: React.FC = () => {
  const [activities] = useState<ActivityItem[]>([
    {
      id: 1,
      type: 'payment',
      title: 'Payment received',
      amount: '₦200,000',
      description: 'From Lagos Food Processing Ltd',
      product: 'Maize (200kg)',
      grade: 'Grade A',
      bgColor: 'bg-skyBlue/70'
    },
    {
      id: 2,
      type: 'inspector',
      title: 'Quality Inspector Assigned (Rice)',
      description: 'Schedule: Aug 30, 2025 | 2:00 P.M.',
      processor: 'John Adebayo',
      bgColor: 'bg-yellow-500'
    },
    {
      id: 3,
      type: 'message',
      title: 'Message Request',
      description: 'Product Request: Sweet Potato Tubers',
      processor: 'Mokinde Okwu',
      bgColor: 'bg-skyBlue/70'
    },
    {
      id: 4,
      type: 'request',
      title: 'Message Request',
      description: 'Product Request: Long Grain Rice',
      processor: 'Mokinde Okwu',
      bgColor: 'bg-skyBlue/70'
    },
    {
      id: 5,
      type: 'message',
      title: 'Message Request',
      description: 'Product Request: Sweet Potato Tubers',
      processor: 'Mokinde Okwu',
      bgColor: 'bg-skyBlue/70' // Custom color example
    },
    {
      id: 6,
      type: 'payment',
      title: 'Payment received',
      amount: '₦12,500',
      description: 'From Lagos Food Processing Ltd',
      product: 'Maize (50kg)',
      grade: 'Grade A',
      bgColor: 'bg-emerald-600' // Custom color example
    }
  ]);

  return (
    <div className="w-full  bg-white ">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <h2 className="font-medium">Recent Activity</h2>
        <button className="p-1 hover:bg-gray-100 rounded-md transition-colors">
          <TrendingUp className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      {/* Activity List */}
      <div className="divide-y divide-gray-100">
        {activities.map((activity) => (
          <ActivityItemComponent key={activity.id} activity={activity} />
        ))}
      </div>

      {/* Footer - Optional "View All" button */}
      <div className="p-4 border-t border-gray-200">
        <button className="w-full text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors">
          View All Activity
        </button>
      </div>
    </div>
  );
};

export default RecentActivity;