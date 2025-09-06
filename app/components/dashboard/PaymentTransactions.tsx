'use client'
import React, { useState } from 'react';
import { Eye, Clock, AlertTriangle, ArrowUpRight, ArrowDownRight } from 'lucide-react';

type TransactionStatus = 'completed' | 'pending' | 'overdue';
type TransactionType = 'incoming' | 'outgoing' | 'overdue' ;
type FilterStatus = 'all' | TransactionStatus;

interface Transaction {
  id: string;
  title: string;
  from: string;
  amount: string;
  method: string;
  date: string;
  status: TransactionStatus;
  type: TransactionType;
  expected?: string;
  due?: string;
}

const PaymentTransactions: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<FilterStatus>('all');

  // Sample transaction data based on the image
  const transactions: Transaction[] = [
    {
      id: 'OKO-2025-0148',
      title: 'Payment for Long Grain Rice (350kg)',
      from: 'Lagos Food Processing Ltd',
      amount: '+₦350,000',
      method: 'M-Pesa',
      date: 'Aug 18, 2025 14:30',
      status: 'completed',
      type: 'incoming'
    },
    {
      id: 'OKO-2025-0142',
      title: 'Payment for Sweet Potato (250kg)',
      from: 'Fresh Market Abuja',
      amount: '+₦500,000',
      method: 'Bank Transfer',
      date: 'Aug 17, 2025 10:15',
      status: 'pending',
      type: 'incoming',
      expected: 'Aug 22, 2025'
    },
    {
      id: 'OKO-2025-0138',
      title: 'Payment for Long Grain Rice (350kg)',
      from: 'Urban Fresh Markets',
      amount: '+₦350,000',
      method: 'M-Pesa',
      date: 'Aug 15, 2025 16:45',
      status: 'completed',
      type: 'incoming'
    },
    {
      id: 'platform-fee-001',
      title: 'Platform Transaction Fee',
      from: 'Oko Agro Solutions',
      amount: '-₦450',
      method: 'Auto-deduct',
      date: 'Aug 15, 2025 17:00',
      status: 'completed',
      type: 'outgoing'
    },
    {
      id: 'OKO-2025-0125',
      title: 'Payment for Fresh Maize (100kg)',
      from: 'Metro Groceries',
      amount: '+₦200,000',
      method: 'Bank Transfer',
      date: 'Aug 10, 2025 12:00',
      status: 'overdue',
      type: 'incoming',
      due: 'Aug 17, 2025'
    }
  ];

  // Status display mapping
  const statusDisplayMap: Record<string, FilterStatus> = {
    'All': 'all',
    'Completed': 'completed',
    'Pending': 'pending',
    'Overdue': 'overdue'
  };

  const availableStatusDisplayNames: string[] = Object.keys(statusDisplayMap);

  // Filter transactions based on active filter
  const filteredTransactions: Transaction[] = activeFilter === 'all' 
    ? transactions 
    : transactions.filter((transaction: Transaction) => transaction.status === activeFilter);

  const getButtonStyles = (displayName: string): string => {
    const baseStyles =
      "px-4 py-2 text-sm font-medium transition-all duration-200 border-b-2";
    const filterValue: FilterStatus = statusDisplayMap[displayName];

    if (activeFilter === filterValue) {
      return `${baseStyles} text-mainGreen border-mainGreen`;
    } else {
      return `${baseStyles} text-gray-500 border-transparent hover:text-gray-700`;
    }
  };

  const getStatusStyles = (status: TransactionStatus): string => {
    switch (status) {
      case 'completed':
        return 'bg-green text-white';
      case 'pending':
        return 'bg-yellow text-white';
      case 'overdue':
        return 'bg-red text-white';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-50 min-h-screen">
     

      {/* Filter Navigation */}
      <div className="bg-white  mb-6">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8">
            {availableStatusDisplayNames.map((displayName: string) => (
              <button
                key={displayName}
                onClick={() => setActiveFilter(statusDisplayMap[displayName])}
                className={getButtonStyles(displayName)}
              >
                <span>{displayName}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Transaction Cards */}
      <div className="space-y-4">
        {filteredTransactions.map((transaction: Transaction) => (
          <div key={transaction.id} className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200">
            <div className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-4 flex-1">
                    <div className={`p-2 rounded-full ${
                    transaction.status === 'overdue' ? 'bg-red-100' :
                    transaction.status === 'pending' ? 'bg-yellow-100' :
                    transaction.type === 'incoming' ? 'bg-green-100' : 'bg-red-100'
                  }`}>
                    {transaction.status === 'overdue' ? (
                      <AlertTriangle className="w-5 h-5 text-red-600" />
                    ) : transaction.status === 'pending' ? (
                      <Clock className="w-5 h-5 text-yellow" />
                    ) : transaction.type === 'incoming' ? (
                      <ArrowDownRight className="w-5 h-5 text-green-600" />
                    ) : (
                      <ArrowUpRight className="w-5 h-5 text-red-600" />
                    )}
                  </div>

                  {/* Transaction Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <div className=" font-medium flex items-center gap-2 text-gray-900 truncate">
                        {transaction.title} <span className={`inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusStyles(transaction.status)}`}>
                        
                          <span className="ml-1 capitalize">{transaction.status}</span>
                        </span>
                      </div>
                      <div className="flex items-center space-x-3">
                        {/* Status Badge */}
                        
                        {/* Amount */}
                        <span className={`text-lg font-semibold ${transaction.amount.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                          {transaction.amount}
                        </span>
                      </div>
                    </div>

                    <p className="text-sm text-mainGreen ">
                      From: {transaction.from}
                    </p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-6 text-sm text-mainGreen">
                        <span>Method: {transaction.method}</span>
                        <span>Date: {transaction.date}</span>
                        <span>Order: {transaction.id}</span>
                      </div>

                      <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Additional Status Information */}
                    {transaction.expected && (
                      <div className="mt-3 text-sm text-yellow">
                        Expected: {transaction.expected}
                      </div>
                    )}
                    {transaction.due && (
                      <div className="mt-3 text-sm text-red-600">
                        Due: {transaction.due}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredTransactions.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Clock className="w-12 h-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No transactions found</h3>
          <p className="text-gray-500">No transactions match the selected filter.</p>
        </div>
      )}
    </div>
  );
};

export default PaymentTransactions;