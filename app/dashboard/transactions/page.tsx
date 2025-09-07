import PaymentTransactions from "@/app/components/dashboard/PaymentTransactions";
import TransactionCards from "@/app/components/dashboard/TransactionCards";
import { Building, Download } from "lucide-react";
import Link from "next/link";
import React from "react";

export default function page() {
  return (
    <div>
      <div className="justify-between flex items-center py-4">
        <div>
          <p className="font-medium text-lg">Transaction History</p>
          <p className="text-sm text-gray-600">
            Track your earnings and manage payment methods
          </p>
        </div>
        <div>
          <Link href={"/dashboard/products"}>
            <button className="flex gap-2 items-center px-4 py-2 rounded-lg text-sm text-white bg-mainGreen hover:bg-green-600 transition-colors">
              <Download color="white" size={16} />
              Export History
            </button>
          </Link>
        </div>
      </div>
      <div>
        <TransactionCards />
      </div>
      <div className=" grid grid-cols-12 gap-5">
        <div className="col-span-8">
          <PaymentTransactions />
        </div>
        <div className="col-span-4">
             <div className=" border border-gray-200 rounded-lg p-6  bg-white">
          <div className="flex justify-between items-center mb-4">
            <p>Payment Methods</p>
            <p className="text-sm">+ Add Method</p>
          </div>
          <div className="border border-gray-200 rounded-lg p-4 flex justify-between items-center">
            <div className="flex items-center gap-2 text-sm">
              <div><Building/></div>
              <div>
                <p>Access Bank</p>
                <p className="text-xs">****8901</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
                <span className="bg-green py-1 rounded-full px-3  text-xs text-white">active</span>
                <span className="text-sm">Edit</span>
            </div>
          </div>
        </div>
        </div>
       
      </div>
    </div>
  );
}
