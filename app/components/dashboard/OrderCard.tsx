import React from 'react'
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type IconComponent = React.ComponentType<any>;

interface OrderCardProps{
    text:string;
    count:number;
    icon?: IconComponent;
    iconColor?:string;
    bgColor?:string;
}
export default function OrderCard({text,count,icon : Icon,iconColor,bgColor}:OrderCardProps) {
  return (
    <div className={`rounded-lg ${bgColor} p-4 w-full hover:shadow-sm  duration-200`}>
        <div className='flex justify-between items-center mb-2'>
            <p className='text-xs text-gray-600'>{text}</p>
            {Icon && <Icon color={iconColor} />}
        </div>
        <p className='text-2xl '>{count}</p>
    </div>
  )
}
