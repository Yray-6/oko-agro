import SecuritySettings from "@/app/components/dashboad-processor/Change-password";
import EditProfileProcessor from "@/app/components/dashboad-processor/EditProfile";
import React from "react";

export default function page() {
  return (
    <div>
      <div className="justify-between flex items-center py-4">
        <div>
          <p className="font-medium text-lg">Settings</p>
          <p className="text-sm text-gray-600">
            Communicate with buyers, inspectors, and suppliers
          </p>
        </div>
      </div>
      <div className="grid gap-3 grid-cols-3">
        <div className="col-span-2">
          <EditProfileProcessor />
        </div>
        <div className="col-span-1">
            <SecuritySettings/>
        </div>
      </div>
    </div>
  );
}
