"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import {
  MapPin,
  ArrowLeft,
  Loader2,
  Phone,
  Building2,
  Calendar,
  Package,
  MessageSquare,
  TruckIcon,
  Tag,
  BoxIcon,
} from "lucide-react";
import { useProductStore } from "@/app/store/useProductStore";
import { useEventStore } from "@/app/store/useEventStore";
import { useBuyRequestStore } from "@/app/store/useRequestStore"; 
import CalendarViewProcessor from "@/app/components/dashboad-processor/CalendarViewProcessor";
import ContactProcessorModal from "@/app/components/dashboard/ContactProcessorModal";
import rice from "@/app/assets/images/rice.png";
import { UserProfile, BuyRequest } from "@/app/types";
import AnimatedLoading from "@/app/Loading";

export default function ProcessorDetailsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const processorId = searchParams.get("processorId");

  const { events, isFetching: isFetchingEvents, fetchUserEvents } = useEventStore();
  const { userRequests, isFetching: isFetchingRequests, fetchUserRequests } = useBuyRequestStore();

  const [processorDetails, setProcessorDetails] = useState<UserProfile | null>(null);
  const [isLoadingProcessor, setIsLoadingProcessor] = useState(true);
  
  // Contact modal state
  const [contactModal, setContactModal] = useState<{
    isOpen: boolean;
    selectedRequest: BuyRequest | null;
  }>({
    isOpen: false,
    selectedRequest: null,
  });

  // Fetch processor details from the processors list in store
  useEffect(() => {
    if (processorId) {
      const { processors } = useProductStore.getState();
      const processor = processors.find((p) => p.id === processorId);
      
      if (processor) {
        setProcessorDetails(processor);
        setIsLoadingProcessor(false);
      } else {
        setIsLoadingProcessor(false);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Fetch processor's buy requests
  useEffect(() => {
    if (processorId) {
      fetchUserRequests(processorId);
    }
  }, [processorId, fetchUserRequests]);

  // Fetch processor's events
  useEffect(() => {
    if (processorId) {
      fetchUserEvents(processorId);
    }
  }, [processorId, fetchUserEvents]);

  // Filter to only show requests where seller is null (general requests)
  const availableRequests = userRequests.filter(request => request.seller === null);

  const handleBack = () => {
    router.back();
  };

  const handleContact = () => {
    // If there are available requests, open contact modal for the first one
    if (availableRequests.length > 0) {
      setContactModal({
        isOpen: true,
        selectedRequest: availableRequests[0],
      });
    } else {
      console.log("Contact processor:", processorId);
    }
  };

  const handleContactRequest = (request: BuyRequest) => {
    setContactModal({
      isOpen: true,
      selectedRequest: request,
    });
  };

  const handleCloseContactModal = () => {
    setContactModal({
      isOpen: false,
      selectedRequest: null,
    });
  };

  if (isLoadingProcessor) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-mainGreen" />
      </div>
    );
  }

  // Get processor info from first buy request if available
  const processorInfo = userRequests[0]?.buyer;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-mainGreen hover:underline mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Processors
          </button>

          <div className="flex items-start gap-6">
            {/* Processor Profile Image */}
            <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0 bg-gray-200">
              <Image
                src={rice.src}
                alt={processorInfo?.companyName || "Processor"}
                width={96}
                height={96}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Processor Info */}
            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    {processorInfo?.companyName || `${processorDetails?.firstName} ${processorDetails?.lastName}`}
                  </h1>
                  <p className="text-gray-600 mt-1">
                    {processorDetails?.firstName} {processorDetails?.lastName}
                  </p>
                  {processorInfo?.businessType && (
                    <p className="text-sm text-gray-500 mt-1 capitalize">
                      {processorInfo.businessType}
                    </p>
                  )}
                </div>

                {/* <div className="flex gap-3">
                  <button 
                    onClick={handleContact}
                    className="px-6 py-2 bg-white text-mainGreen border border-mainGreen flex items-center gap-2 justify-center rounded-lg hover:bg-mainGreen/5 transition-colors"
                  >
                    <Phone size={16}/>
                    Contact
                  </button>
                </div> */}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPin className="w-4 h-4 text-mainGreen" />
                  <span>
                    {processorDetails?.state}, {processorDetails?.country}
                  </span>
                </div>

                {/* {processorInfo?.phoneNumber && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Phone className="w-4 h-4 text-mainGreen" />
                    <span>{processorInfo.phoneNumber}</span>
                  </div>
                )}

                {processorInfo?.email && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Mail className="w-4 h-4 text-mainGreen" />
                    <span>{processorInfo.email}</span>
                  </div>
                )} */}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Processor Details */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="bg-white rounded-lg p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Processor Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {processorDetails?.farmAddress && (
              <div>
                <p className="text-sm text-gray-500">Business Address</p>
                <p className="text-gray-900 font-medium">
                  {processorDetails.farmAddress}
                </p>
              </div>
            )}

            {processorInfo?.businessRegNumber && (
              <div>
                <p className="text-sm text-gray-500">Registration Number</p>
                <p className="text-gray-900 font-medium">
                  {processorInfo.businessRegNumber}
                </p>
              </div>
            )}

            {processorInfo?.yearEstablished && (
              <div>
                <p className="text-sm text-gray-500">Year Established</p>
                <p className="text-gray-900 font-medium">
                  {processorInfo.yearEstablished}
                </p>
              </div>
            )}

            {processorInfo?.processsingCapacitySize && (
              <div>
                <p className="text-sm text-gray-500">Processing Capacity</p>
                <p className="text-gray-900 font-medium">
                  {processorInfo.processsingCapacitySize} {processorInfo.processsingCapacityUnit}
                </p>
              </div>
            )}

            {processorInfo?.operatingDaysPerWeek && (
              <div>
                <p className="text-sm text-gray-500">Operating Days</p>
                <p className="text-gray-900 font-medium">
                  {processorInfo.operatingDaysPerWeek} days/week
                </p>
              </div>
            )}

            {processorInfo?.storageCapacity && (
              <div>
                <p className="text-sm text-gray-500">Storage Capacity</p>
                <p className="text-gray-900 font-medium">
                  {processorInfo.storageCapacity}
                </p>
              </div>
            )}

            {processorInfo?.minimumOrderQuality && (
              <div>
                <p className="text-sm text-gray-500">Minimum Order</p>
                <p className="text-gray-900 font-medium">
                  {processorInfo.minimumOrderQuality}
                </p>
              </div>
            )}

            {processorInfo?.operationsType && (
              <div>
                <p className="text-sm text-gray-500">Operations Type</p>
                <p className="text-gray-900 font-medium capitalize">
                  {processorInfo.operationsType}
                </p>
              </div>
            )}
          </div>

          {/* Crops they're interested in */}
          {processorDetails?.crops && processorDetails.crops.length > 0 && (
            <div className="mt-6">
              <p className="text-sm text-gray-500 mb-2">Crops of Interest</p>
              <div className="flex flex-wrap gap-2">
                {processorDetails.crops.map((crop) => (
                  <span
                    key={crop.id}
                    className="px-3 py-1 bg-mainGreen/10 text-mainGreen rounded-full text-sm"
                  >
                    {crop.name}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Active Buy Requests Section */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-semibold">Active Buy Requests</h2>
              <p className="text-sm text-gray-500 mt-1">
                Open requests available for fulfillment
              </p>
            </div>
            <span className="text-sm text-gray-600">
              {availableRequests.length} {availableRequests.length === 1 ? "request" : "requests"} available
            </span>
          </div>

          {isFetchingRequests ? (
            <div className="flex items-center justify-center py-12 bg-white rounded-lg">
              <Loader2 className="w-8 h-8 animate-spin text-mainGreen" />
            </div>
          ) : availableRequests.length > 0 ? (
            <div className="space-y-4">
              {availableRequests.map((request) => (
                <div
                  key={request.id}
                  className="bg-white rounded-xl border border-gray-200 hover:border-mainGreen/30 hover:shadow-lg transition-all overflow-hidden"
                >
                  <div className="p-6">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-mainGreen/10 rounded-lg flex items-center justify-center">
                          <Package className="w-6 h-6 text-mainGreen" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            {request.cropType?.name || 'Unknown Product'}
                          </h3>
                          <p className="text-sm text-gray-500">
                            Request #{request.requestNumber}
                          </p>
                        </div>
                      </div>
                      <span
                        className={`px-3 py-1 text-xs font-medium rounded-full ${
                          request.status === "pending"
                            ? "bg-yellow-100 text-yellow-700"
                            : request.status === "accepted"
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {request.status}
                      </span>
                    </div>

                    {/* Description */}
                    <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                      {request.description}
                    </p>

                    {/* Details Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      {/* Quantity */}
                      <div className="bg-gray-50 rounded-lg p-3">
                        <div className="flex items-center gap-2 mb-1">
                          <Package className="w-4 h-4 text-gray-500" />
                          <span className="text-xs text-gray-500 uppercase">Quantity</span>
                        </div>
                        <p className="font-semibold text-gray-900">
                          {request.productQuantity} {request.productQuantityUnit}
                        </p>
                      </div>

                      {/* Price Offer */}
                      <div className="bg-mainGreen/5 rounded-lg p-3">
                        <div className="flex items-center gap-2 mb-1">
                          <BoxIcon className="w-4 h-4 text-mainGreen" />
                          <span className="text-xs text-gray-500 uppercase">Price Offer</span>
                        </div>
                        <p className="font-semibold text-mainGreen">
                          {request.pricePerUnitOffer}/unit
                        </p>
                      </div>

                      {/* Delivery Date */}
                      <div className="bg-gray-50 rounded-lg p-3">
                        <div className="flex items-center gap-2 mb-1">
                          <Calendar className="w-4 h-4 text-gray-500" />
                          <span className="text-xs text-gray-500 uppercase">Delivery</span>
                        </div>
                        <p className="font-semibold text-gray-900 text-sm">
                          {new Date(request.estimatedDeliveryDate).toLocaleDateString("en-GB", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })}
                        </p>
                      </div>

                      {/* Payment Method */}
                      <div className="bg-gray-50 rounded-lg p-3">
                        <div className="flex items-center gap-2 mb-1">
                          <Tag className="w-4 h-4 text-gray-500" />
                          <span className="text-xs text-gray-500 uppercase">Payment</span>
                        </div>
                        <p className="font-semibold text-gray-900 text-sm capitalize">
                          {request.preferredPaymentMethod.replace(/_/g, ' ')}
                        </p>
                      </div>
                    </div>

                    {/* Delivery Location */}
                    <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                      <div className="flex items-start gap-2">
                        <TruckIcon className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-xs text-blue-600 uppercase font-medium mb-1">
                            Delivery Location
                          </p>
                          <p className="text-sm text-gray-900">
                            {request.deliveryLocation}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Quality Standard */}
                    {request.qualityStandardType && (
                      <div className="mb-4">
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-500 uppercase">Quality Standard:</span>
                          <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs font-medium">
                            {request.qualityStandardType?.name || 'N/A'}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Action Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleContactRequest(request);
                      }}
                      className="w-full py-3 bg-mainGreen text-white rounded-lg font-medium hover:bg-green-800 transition-colors flex items-center justify-center gap-2"
                    >
                      <MessageSquare className="w-5 h-5" />
                      Contact Seller
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg p-12 text-center">
              <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 font-medium">No available buy requests</p>
              <p className="text-sm text-gray-400 mt-1">
                All requests have been assigned to sellers
              </p>
            </div>
          )}
        </div>

        {/* Calendar View */}
        <div className="mt-12">
          <h2 className="text-xl font-semibold mb-4">Schedule & Calendar</h2>
          {isFetchingEvents ? (
            <div className="flex items-center justify-center py-12 bg-white rounded-lg">
              <Loader2 className="w-8 h-8 animate-spin text-mainGreen" />
            </div>
          ) : (
            <CalendarViewProcessor events={events} />
          )}
        </div>
      </div>
      {(isFetchingRequests || isFetchingEvents) && <AnimatedLoading/>}

      {/* Contact Processor Modal */}
      {contactModal.selectedRequest && processorId && (
        <ContactProcessorModal
          isOpen={contactModal.isOpen}
          onClose={handleCloseContactModal}
          buyRequest={contactModal.selectedRequest}
          processorId={processorId}
          processorName={processorInfo?.companyName || `${processorDetails?.firstName || ''} ${processorDetails?.lastName || ''}`.trim() || 'Processor'}
        />
      )}
    </div>
  );
}