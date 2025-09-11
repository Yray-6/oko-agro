import React from "react";
import Card from "../components/dashboard/Cards";
import Revenue from "../assets/icons/Revenue";
import Listings from "../assets/icons/Listings";
import ViewOrders from "../assets/icons/ViewOrders";
import Star from "../assets/icons/Star";
import LinkCard from "../components/dashboard/LinkCard";
import FindProcessor from "../assets/icons/FindProcessor";
import Calendar from "../assets/icons/Calendar";
import ProductCardContainer from "../components/dashboard/ProductCardContainer";
import RecentActivity from "../components/dashboard/RecentActivity";

export default function page() {
  return (
    <div>
      <div className="text-2xl">Hello, Oghenevwaire</div>
      <div className="grid grid-cols-4 py-4 gap-4">
        <Card
          title="Revenue"
          value="₦250,000"
          subtitle="+12% from last month"
          subtitleColor="text-green"
          iconColor="text-green"
          icon={Revenue} // ✅ Pass component reference, not JSX
        />
        <Card
          title=" Active Listings"
          value="9"
          subtitle="Inventory: 70% left"
          subtitleColor="text-black"
          iconColor="text-blue"
          icon={Listings}
        />
        <Card
          title="Pending Orders"
          value="3"
          subtitle="Due in 5 days"
          subtitleColor="text-black"
          iconColor="text-yellow"
          icon={ViewOrders}
        />
        <Card
          title="Quality Score"
          value="4.5"
          subtitle="44 Reviews"
          subtitleColor="text-black"
          icon={Star}
        />
      </div>
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-9">
          <div className="rounded-lg border border-gray-200 p-2">
            <p className="font-medium mb-2">Quick Actions</p>
            <div className="grid grid-cols-4 gap-2  ">
              <LinkCard
                title={"Find Farmer"}
                icon={FindProcessor}
                href="/dashboard/find-farmer"
              />
              <LinkCard title={"New Request"} icon={Listings} href="/dashboard/new-request" />
              <LinkCard title={"View Orders"} icon={ViewOrders} href="/dashboard/orders" />
              <LinkCard title={"View Schedule"} icon={Calendar} href="/dashboard/calendar" />
            </div>
          </div>
          <div className="p-2 mt-3">
            <ProductCardContainer />
          </div>
        </div>
        <div className="col-span-3 rounded-lg border border-gray-200 p-2">
                <RecentActivity/>
        </div>
      </div>
    </div>
  );
}
