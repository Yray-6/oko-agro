import React from 'react';

interface ScheduleSummaryData {
  upcoming: number;
  today: number;
  inspections: number;
  deliveries: number;
  harvests: number;
}

interface ScheduleSummaryProps {
  data?: ScheduleSummaryData;
  className?: string;
}

const ScheduleSummary: React.FC<ScheduleSummaryProps> = ({
  data = {
    upcoming: 3,
    today: 1,
    inspections: 1,
    deliveries: 1,
    harvests: 1
  },
  className = ''
}) => {
  return (
    <div className={`bg-white rounded-lg border border-gray-200 p-6 shadow-sm ${className}`}>
      {/* Header */}
      <h2 className="text-lg font-semibold text-gray-900 mb-6">Schedule Summary</h2>
      
      {/* Summary Cards Row */}
      <div className="grid grid-cols-2 gap-6 mb-6">
        {/* Upcoming Card */}
        <div className="bg-gray-50 rounded-lg p-4 text-center">
          <div className="text-3xl font-medium text-gray-900 mb-1">{data.upcoming}</div>
          <div className="text-sm text-mainGreen">Upcoming</div>
        </div>
        
        {/* Today Card */}
        <div className="bg-gray-50 rounded-lg p-4 text-center">
          <div className="text-3xl font-medium text-gray-900 mb-1">{data.today}</div>
          <div className="text-sm text-mainGreen">Today</div>
        </div>
      </div>
      
      {/* Activity Breakdown */}
      <div className="space-y-3">
        {/* Inspections */}
        <div className="flex items-center justify-between">
          <span className="text-gray-700 ">Inspections</span>
          <span className="text-gray-900 font-semibold">{data.inspections}</span>
        </div>
        
        {/* Deliveries */}
        <div className="flex items-center justify-between">
          <span className="text-gray-700 ">Deliveries</span>
          <span className="text-gray-900 font-semibold">{data.deliveries}</span>
        </div>
        
        {/* Harvests */}
        <div className="flex items-center justify-between">
          <span className="text-gray-700 ">Harvests</span>
          <span className="text-gray-900 font-semibold">{data.harvests}</span>
        </div>
      </div>
    </div>
  );
};

// Example usage component
const ScheduleSummaryExample: React.FC = () => {
  return (
    <div className="max-w-md mx-auto p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>
      
      <ScheduleSummary />
      
      {/* Example with custom data */}
      <div className="mt-6">
        <ScheduleSummary
          data={{
            upcoming: 5,
            today: 2,
            inspections: 2,
            deliveries: 2,
            harvests: 1
          }}
        />
      </div>
    </div>
  );
};

export { ScheduleSummary, ScheduleSummaryExample };
export default ScheduleSummary;