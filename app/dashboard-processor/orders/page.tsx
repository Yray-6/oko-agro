"use client";
import { Plus } from "lucide-react";
import React from "react";
import rice from "@/app/assets/images/rice.png";
import cassava from "@/app/assets/images/yam.png";
import maize from "@/app/assets/images/maize.png";
import potato from "@/app/assets/images/potato.png";
import Card from "@/app/components/dashboard/Cards";
import ViewOrders from "@/app/assets/icons/ViewOrders";
import OrderCard from "@/app/components/dashboard/OrderCard";
import Tick from "@/app/assets/icons/Tick";
import Truck from "@/app/assets/icons/Truck";
import Package from "@/app/assets/icons/Package";
import Link from "next/link";
import OrdersProcessorWithInvoice from "@/app/components/dashboad-processor/OrdersProcessor";

export default function Page() {
  // Sample orders data - replace with your actual data source
  const sampleOrders = [
    {
      id: "OA20398474",
      productName: "Long Grain Rice",
      quantity: "500kg",
      price: "₦1,000/kg",
      certification: "Grade A",
      status: "Pending" as const,
      createdDate: "Aug 18, 2025",
      deliveryDate: "28 Sept 2025",
      orderValue: "₦350,000",
      paymentTerms: "On Delivery",
      buyerName: "Augustus Processing Company",
      buyerLocation: "Lagos, Nigeria",
      productImage: rice.src,
    },
    {
      id: "OA20398475",
      productName: "Premium Cassava Flour",
      quantity: "200kg",
      price: "₦800/kg",
      certification: "Organic",
      status: "Active" as const,
      createdDate: "Aug 15, 2025",
      deliveryDate: "25 Sept 2025",
      orderValue: "₦160,000",
      paymentTerms: "50% Advance",
      buyerName: "Golden Foods Ltd",
      buyerLocation: "Abuja, Nigeria",
      productImage: cassava.src,
    },
    {
      id: "OA20398476",
      productName: "Fresh Yam Tubers",
      quantity: "100kg",
      price: "₦500/kg",
      certification: "Grade B",
      status: "Completed" as const,
      createdDate: "Aug 10, 2025",
      deliveryDate: "20 Sept 2025",
      orderValue: "₦50,000",
      paymentTerms: "Cash on Delivery",
      buyerName: "Healthy Farms Market",
      buyerLocation: "Kano, Nigeria",
      productImage: potato.src,
    },
    {
      id: "OA20398477",
      productName: "Dried Maize",
      quantity: "300kg",
      price: "₦600/kg",
      certification: "Grade A",
      status: "Pending" as const,
      createdDate: "Aug 20, 2025",
      deliveryDate: "30 Sept 2025",
      orderValue: "₦180,000",
      paymentTerms: "Bank Transfer",
      buyerName: "Livestock Feed Co.",
      buyerLocation: "Kaduna, Nigeria",
      productImage: maize.src,
    },
    {
      id: "OA20398478",
      productName: "Sweet Potato",
      quantity: "150kg",
      price: "₦400/kg",
      certification: "Organic",
      status: "Active" as const,
      createdDate: "Aug 17, 2025",
      deliveryDate: "27 Sept 2025",
      orderValue: "₦60,000",
      paymentTerms: "On Delivery",
      buyerName: "Fresh Mart Stores",
      buyerLocation: "Port Harcourt, Nigeria",
      productImage: "/api/placeholder/60/60",
    },
  ];

  // Order action handlers
  const handleAcceptOrder = (orderId: string) => {
    console.log("Accepting order:", orderId);
    // Implement your accept order logic here
    // e.g., API call to accept the order
  };

  const handleDeclineOrder = (orderId: string) => {
    console.log("Declining order:", orderId);
    // Implement your decline order logic here
    // e.g., API call to decline the order
  };

  const handleViewProfile = (orderId: string) => {
    console.log("Viewing buyer profile for order:", orderId);
    // Implement navigation to buyer profile
    // e.g., router.push(`/buyer-profile/${buyerId}`)
  };

  const handleMessage = (orderId: string) => {
    console.log("Opening message for order:", orderId);
    // Implement messaging functionality
    // e.g., open chat modal or navigate to messages
  };

  return (
    <div>
      <div className="justify-between flex items-center py-4">
        <div>
          <p className="font-medium text-lg">Orders & Requests</p>
          <p className="text-sm text-gray-600">
            Track and manage your product orders
          </p>
        </div>
        <div>
          <Link href={"/dashboard/products"}>
            <button className="flex gap-2 items-center px-4 py-2 rounded-lg text-sm text-white bg-mainGreen hover:bg-mainGreen/90 transition-colors">
              <Plus color="white" size={16} />
              New Request
            </button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-9">
          <OrdersProcessorWithInvoice
            orders={sampleOrders}
            onAcceptOrder={handleAcceptOrder}
            onDeclineOrder={handleDeclineOrder}
            onViewProfile={handleViewProfile}
            onMessage={handleMessage}
          />
        </div>
        <div className="col-span-3 space-y-2 mt-10">
          <Card
            title="Total Orders"
            value="12"
            subtitle="Value: ₦1,200,000"
            subtitleColor="text-black"
            iconColor="text-mainGreen"
            icon={ViewOrders} // ✅ Pass component reference, not JSX
          />
          <OrderCard
            text="Completed Orders"
            count={5}
            icon={Tick}
            iconColor="#0BA964"
            bgColor="bg-green/10"
          />
          <OrderCard
            text="Active Orders"
            count={1}
            icon={Truck}
            iconColor="#0B99A9"
            bgColor="bg-skyBlue"
          />

          <OrderCard
            text="Pending Orders"
            count={2}
            icon={Package}
            iconColor="#FFDD55"
            bgColor="bg-yellow/10"
          />
        </div>
      </div>
    </div>
  );
}
