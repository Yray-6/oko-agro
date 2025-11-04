'use client'
import React, { useState } from 'react';

interface ChartCardProps {
  title?: string;
  tabs?: string[];
  defaultTab?: string;
  children?: React.ReactNode;
  className?: string;
}

const ChartCard: React.FC<ChartCardProps> = ({
  title = "User Distribution",
  tabs = ["12 months", "30 days", "7 days", "24 hours"],
  defaultTab = "12 months",
  children,
  className = ""
}) => {
  const [activeTab, setActiveTab] = useState(defaultTab);

  return (
    <div className={`bg-white rounded-[20px] border border-[#EAECF0] shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] ${className}`}>
      <div className="flex flex-col gap-5 p-6">
        {/* Section Header */}
        <div className="flex flex-col gap-5">
          <h3 
            className="text-[18px] font-semibold text-[#101828]"
            style={{
              lineHeight: "1.556em",
              fontFamily: "Urbanist, sans-serif",
            }}
          >
            {title}
          </h3>
          
          {/* Tabs */}
          <div className="flex flex-col gap-2">
            <div className="flex gap-4 border-b border-[#EAECF0]">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`pb-[11px] px-1 text-[14px] font-semibold transition-colors ${
                    activeTab === tab
                      ? "text-[#004829] border-b-2 border-[#004829]"
                      : "text-[#667085]"
                  }`}
                  style={{
                    lineHeight: "1.429em",
                    fontFamily: "Urbanist, sans-serif",
                  }}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Chart Content */}
        <div className="h-[200px] relative">
          {children || (
            <div className="w-full h-full relative">
              <svg
                width="100%"
                height="200"
                viewBox="0 0 919 200"
                className="absolute inset-0"
                preserveAspectRatio="none"
              >
                {/* Chart background lines */}
                <line
                  x1="0"
                  y1="22.53"
                  x2="919"
                  y2="22.53"
                  stroke="#004829"
                  strokeWidth="2"
                />
                <line
                  x1="0"
                  y1="84.7"
                  x2="919"
                  y2="84.7"
                  stroke="#0B99A9"
                  strokeWidth="2"
                />
                {/* X-axis labels */}
                <g transform="translate(24, 177)">
                  {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((month, idx) => {
                    const spacing = 919 / 12;
                    const xPosition = (idx * spacing) + (spacing / 2);
                    return (
                      <text
                        key={month}
                        x={xPosition}
                        y="0"
                        textAnchor="middle"
                        fill="#475467"
                        fontSize="12"
                        style={{
                          fontFamily: "Inter, sans-serif",
                          fontWeight: 400,
                          lineHeight: "1.5em",
                        }}
                      >
                        {month}
                      </text>
                    );
                  })}
                </g>
              </svg>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChartCard;

