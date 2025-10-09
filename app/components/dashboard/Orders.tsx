"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { X, Download, FileText } from "lucide-react";
import ViewOrders from "@/app/assets/icons/ViewOrders";
import AddChat from "@/app/assets/icons/AddChar";
import UserCard from "@/app/assets/icons/UserCard";
import Logo from "@/app/assets/icons/Logo";

export interface Order {
  id: string;
  buyRequestId?: string;
  productName: string;
  quantity: string;
  price: string;
  certification: string;
  status: "Pending" | "Active" | "Completed";
  createdDate: string;
  deliveryDate?: string;
  orderValue: string;
  paymentTerms: string;
  buyerName: string;
  buyerLocation: string;
  productImage: string;
  originalStatus?: string;
}

interface InvoiceData {
  orderNumber: string;
  createdDate: string;
  productName: string;
  quantity: string;
  price: string;
  certification: string;
  productImage: string;
  farmerName: string;
  farmerLocation: string;
  farmerImage?: string;
  orderValue: string;
  paymentTerms: string;
  deliveryDate: string;
  paymentStatus: "Completed" | "Pending" | "Failed";
}

interface InvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  invoiceData: InvoiceData;
}

// Invoice Modal Component
const InvoiceModal: React.FC<InvoiceModalProps> = ({
  isOpen,
  onClose,
  invoiceData,
}) => {
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  const handleDownloadPDF = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const invoiceHTML = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Invoice - ${invoiceData.orderNumber}</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.4; color: #333; background: white; padding: 40px; }
            .invoice-container { max-width: 800px; margin: 0 auto; background: white; border-radius: 12px; border: 1px solid #e5e7eb; overflow: hidden; }
            .invoice-header { text-align: center; padding: 30px; background: #f9fafb; border-bottom: 1px solid #e5e7eb; }
            .invoice-title { font-size: 32px; font-weight: 600; color: #1f2937; margin-bottom: 20px; }
            .order-info { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0; }
            .order-number { font-size: 16px; color: #374151; display: flex; align-items: center; gap: 8px; }
            .created-date { font-size: 14px; color: #6b7280; }
            .invoice-content { padding: 40px; }
            .section-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; margin-bottom: 40px; }
            .section-title { font-size: 16px; font-weight: 500; color: #374151; margin-bottom: 16px; }
            .product-info, .farmer-info { display: flex; gap: 16px; align-items: flex-start; }
            .info-details h3 { font-size: 16px; font-weight: 500; color: #111827; margin-bottom: 8px; }
            .info-details p { font-size: 14px; color: #6b7280; margin-bottom: 4px; }
            .order-summary { background: #f0f9ff; border-radius: 8px; padding: 24px; margin-bottom: 40px; }
            .summary-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
            .summary-item h4 { font-size: 14px; color: #6b7280; margin-bottom: 8px; }
            .summary-item p { font-size: 16px; font-weight: 600; color: #111827; }
            .order-value p { color: #059669 !important; font-size: 18px; }
            .payment-status { text-align: center; margin-bottom: 40px; }
            .payment-status h4 { font-size: 14px; color: #6b7280; margin-bottom: 8px; }
            .status-badge { display: inline-block; padding: 8px 16px; border-radius: 20px; font-size: 14px; font-weight: 500; }
            .status-completed { background: #d1fae5; color: #065f46; }
            .status-pending { background: #fef3c7; color: #92400e; }
            .company-footer { text-align: center; padding: 30px; border-top: 1px solid #e5e7eb; background: #f9fafb; }
            .company-name { font-size: 18px; font-weight: 600; color: #059669; }
            .company-tagline { font-size: 14px; color: #059669; font-style: italic; }
            @media print { body { padding: 0; } }
          </style>
        </head>
        <body>
          <div class="invoice-container">
            <div class="invoice-header">
              <h1 class="invoice-title">Invoice</h1>
              <div class="order-info">
                <div class="order-number"><span>📄</span>Order: #${invoiceData.orderNumber}</div>
                <div class="created-date">Created ${invoiceData.createdDate}</div>
              </div>
            </div>
            <div class="invoice-content">
              <div class="section-grid">
                <div>
                  <h3 class="section-title">Product Details</h3>
                  <div class="product-info">
                    <div style="width: 60px; height: 60px; background: #d1d5db; border-radius: 8px;"></div>
                    <div class="info-details">
                      <h3>${invoiceData.productName}</h3>
                      <p>Quantity: ${invoiceData.quantity} | ${invoiceData.price}</p>
                      <p>Certification: ${invoiceData.certification}</p>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 class="section-title">Buyer Information</h3>
                  <div class="farmer-info">
                    <div style="width: 60px; height: 60px; background: #d1d5db; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 500; color: #6b7280;">
                      ${invoiceData.farmerName.charAt(0)}
                    </div>
                    <div class="info-details">
                      <h3>${invoiceData.farmerName}</h3>
                      <p>${invoiceData.farmerLocation}</p>
                    </div>
                  </div>
                </div>
              </div>
              <div class="order-summary">
                <div class="summary-grid">
                  <div class="summary-item order-value"><h4>Order Value</h4><p>${invoiceData.orderValue}</p></div>
                  <div class="summary-item"><h4>Payment Terms</h4><p>${invoiceData.paymentTerms}</p></div>
                  <div class="summary-item"><h4>Delivery Date</h4><p>${invoiceData.deliveryDate}</p></div>
                </div>
              </div>
              <div class="payment-status">
                <h4>Payment Status</h4>
                <span class="status-badge status-${invoiceData.paymentStatus.toLowerCase()}">${invoiceData.paymentStatus}</span>
              </div>
            </div>
            <div class="company-footer">
              <div class="company-logo">
                <div class="logo-icon"></div>
                <span class="company-name">Oko Agro</span>
              </div>
              <p class="company-tagline">Bridging the Gap Between Harvest and Industry</p>
            </div>
          </div>
        </body>
      </html>
    `;

    printWindow.document.write(invoiceHTML);
    printWindow.document.close();
    
    printWindow.onload = () => {
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 250);
    };
  };

  if (!isOpen) return null;

  const getPaymentStatusStyle = () => {
    switch (invoiceData.paymentStatus) {
      case "Completed":
        return " text-green";
      case "Pending":
        return " text-yellow-800";
      case "Failed":
        return " text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-black/50 transition-opacity" onClick={onClose} />
      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div className="relative bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden" onClick={(e) => e.stopPropagation()}>
          <div className="flex justify-between items-center p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Invoice</h2>
            <div className="flex items-center gap-3">
              <button onClick={handleDownloadPDF} className="flex items-center gap-2 px-4 py-2 bg-mainGreen text-white rounded-md hover:bg-mainGreen/90 transition-colors font-medium">
                <Download className="w-4 h-4" />
                Download Invoice
              </button>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors p-1 hover:bg-gray-100 rounded-full">
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          <div className="overflow-y-auto max-h-[calc(90vh-100px)]">
            <div className="text-center py-4 px-6 bg-gray-50 border-b border-gray-200">
              <h1 className="text-2xl font-semibold text-gray-900 mb-6">Invoice</h1>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2 text-gray-700">
                  <FileText className="w-5 h-5" />
                  <span className="font-medium">Order: #{invoiceData.orderNumber}</span>
                </div>
                <div className="text-sm text-gray-500">Created {invoiceData.createdDate}</div>
              </div>
            </div>

            <div className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div>
                  <h3 className="text-base font-medium text-gray-900 mb-4">Product Details</h3>
                  <div className="flex items-start gap-4">
                    <div className="w-15 h-15 bg-yellow-200 rounded-lg flex-shrink-0 overflow-hidden">
                      {invoiceData.productImage ? (
                        <Image src={invoiceData.productImage} alt={invoiceData.productName} width={60} height={60} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-15 h-15 bg-yellow-200 rounded-lg"></div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 mb-2">{invoiceData.productName}</h4>
                      <p className="text-sm text-gray-600 mb-1">Quantity: {invoiceData.quantity} | {invoiceData.price}</p>
                      <p className="text-sm text-gray-600">Certification: {invoiceData.certification}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-base font-medium text-gray-900 mb-4">Buyer Information</h3>
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-green-200 rounded-full flex items-center justify-center">
                      <span className="text-lg font-medium text-gray-600">{invoiceData.farmerName.charAt(0)}</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 mb-1">{invoiceData.farmerName}</h4>
                      <p className="text-sm text-gray-600">{invoiceData.farmerLocation}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-skyBlue rounded-lg px-6 py-2">
                <div className="space-y-6 flex flex-col justify-center text-center items-center">
                  <div>
                    <p className="text-sm text-gray-600 mb-2">Order Value</p>
                    <p className="text-lg font-semibold text-mainGreen">{invoiceData.orderValue}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-2">Payment Terms</p>
                    <p className="font-medium text-gray-900">{invoiceData.paymentTerms}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-2">Delivery Date</p>
                    <p className="font-medium text-gray-900">{invoiceData.deliveryDate}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-2">Payment Status</p>
                    <span className={`inline-block px-4 rounded-full font-medium ${getPaymentStatusStyle()}`}>
                      {invoiceData.paymentStatus}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center py-8 px-6 bg-gray-50 border-t border-gray-200">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Logo color="#004829"/>
                <span className="text-lg font-semibold text-mainGreen">Oko Agro</span>
              </div>
              <p className="text-sm text-mainGreen italic">Bridging the Gap Between Harvest and Industry</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

interface OrdersProps {
  orders: Order[];
  onAcceptOrder?: (orderId: string) => void;
  onDeclineOrder?: (orderId: string) => void;
  onViewProfile?: (orderId: string) => void;
  onMessage?: (orderId: string) => void;
}

type StatusFilter = "All" | "Pending" | "Active" | "Completed";

const Orders: React.FC<OrdersProps> = ({
  orders,
  onAcceptOrder,
  onDeclineOrder,
  onViewProfile,
  onMessage,
}) => {
  const [activeFilter, setActiveFilter] = useState<StatusFilter>("All");
  const [selectedInvoice, setSelectedInvoice] = useState<InvoiceData | null>(null);
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);

  const convertOrderToInvoiceData = (order: Order): InvoiceData => {
    return {
      orderNumber: order.id,
      createdDate: order.createdDate,
      productName: order.productName,
      quantity: order.quantity,
      price: order.price,
      certification: order.certification,
      productImage: order.productImage,
      farmerName: order.buyerName,
      farmerLocation: order.buyerLocation,
      farmerImage: "",
      orderValue: order.orderValue,
      paymentTerms: order.paymentTerms,
      deliveryDate: order.deliveryDate || "TBD",
      paymentStatus: order.status === "Completed" ? "Completed" : "Pending",
    };
  };

  const handleViewInvoice = (orderId: string) => {
    const order = orders.find(o => o.id === orderId);
    if (order) {
      const invoiceData = convertOrderToInvoiceData(order);
      setSelectedInvoice(invoiceData);
      setIsInvoiceModalOpen(true);
    }
  };

  const closeInvoiceModal = () => {
    setIsInvoiceModalOpen(false);
    setSelectedInvoice(null);
  };

  const statusDisplayMap: Record<string, StatusFilter> = {
    "All Orders": "All",
    "Pending Orders": "Pending",
    "Active Orders": "Active",
    "Completed Orders": "Completed",
  };

  const availableStatusDisplayNames = [
    "All Orders",
    "Pending Orders",
    "Active Orders",
    "Completed Orders",
  ];

  const filteredOrders =
    activeFilter === "All"
      ? orders
      : orders.filter((order) => order.status === activeFilter);

  const getButtonStyles = (displayName: string) => {
    const baseStyles =
      "px-4 py-2 text-sm font-medium transition-all duration-200 border-b-2";
    const filterValue = statusDisplayMap[displayName];

    if (activeFilter === filterValue) {
      return `${baseStyles} text-mainGreen border-mainGreen`;
    } else {
      return `${baseStyles} text-gray-500 border-transparent hover:text-gray-700`;
    }
  };

  const StatusBadge: React.FC<{ status: Order["status"]; originalStatus?: string }> = ({ status, originalStatus }) => {
    const getStatusStyles = () => {
      switch (status) {
        case "Pending":
          return "bg-yellow text-white";
        case "Active":
          return "bg-green text-white";
        case "Completed":
          return "bg-blue-100 text-blue-800 border border-blue-200";
        default:
          return "bg-gray-100 text-gray-800 border border-gray-200";
      }
    };

    return (
      <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusStyles()}`}>
        {originalStatus || status}
      </span>
    );
  };

  const OrderCard: React.FC<{ order: Order }> = ({ order }) => {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-start space-x-2">
            <ViewOrders color="black" className="pt-1" />
            <div>
              <span className="font-medium">Order: #{order.id}</span>
              <div className="text-sm text-gray-600 ">
                Created {order.createdDate}
              </div>
            </div>
          </div>
          <StatusBadge status={order.status} originalStatus={order.originalStatus} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium mb-4">Product Details</h4>
            <div className="flex items-start space-x-4">
              <Image
                src={order.productImage}
                alt={order.productName}
                width={60}
                height={60}
                className="rounded-lg object-cover flex-shrink-0"
              />
              <div className="flex-1">
                <h5 className="font-medium  mb-2">{order.productName}</h5>
                <div className="text-sm text-gray-600 space-y-1">
                  <p>
                    Quantity: {order.quantity} | {order.price}
                  </p>
                  <p>Certification: {order.certification}</p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-medium text-gray-900 mb-4">
              Buyer Information
            </h4>
            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-medium text-gray-600">
                  {order.buyerName.charAt(0)}
                </span>
              </div>
              <div className="flex-1">
                <h5 className="font-medium text-gray-900">{order.buyerName}</h5>
                <p className="text-sm text-gray-600">{order.buyerLocation}</p>
                <div className="flex items-center space-x-4 mt-4">
                  {onMessage && (
                    <button
                      onClick={() => onMessage(order.id)}
                      className="text-sm flex gap-1 items-center text-mainGreen hover:text-mainGreen"
                    >
                      <AddChat size={15} /> Message
                    </button>
                  )}
                  {onViewProfile && (
                    <button
                      onClick={() => onViewProfile(order.id)}
                      className="text-sm flex gap-1 items-center text-mainGreen hover:text-mainGreen"
                    >
                      <UserCard size={18} /> View profile
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6 mt-6 pt-6 bg-skyBlue/70 p-4 rounded-lg">
          <div>
            <p className="text-sm text-gray-600 mb-3">Order Value</p>
            <p className="font-semibold text-green-600 text-lg">
              {order.orderValue}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-3">Payment Terms</p>
            <p className="font-medium text-gray-900">{order.paymentTerms}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-3">Delivery Date</p>
            <p className="font-medium text-gray-900">
              {order.deliveryDate || "TBD"}
            </p>
          </div>
        </div>

        {order.status === "Pending" && (onAcceptOrder || onDeclineOrder) && (
          <div className="flex items-center space-x-3 mt-6 pt-6 border-t border-gray-100">
            {onAcceptOrder && (
              <button
                onClick={() => onAcceptOrder(order.id)}
                className="px-10 py-2 bg-mainGreen text-white rounded-md hover:bg-mainGreen/80 transition-colors font-medium"
              >
                Accept Order
              </button>
            )}
            {onDeclineOrder && (
              <button
                onClick={() => onDeclineOrder(order.id)}
                className="px-10 py-2 border border-red text-red rounded-md hover:bg-red-50 transition-colors font-medium"
              >
                Decline
              </button>
            )}
          </div>
        )}

        {order.status !== "Pending" && (
          <button 
            onClick={() => handleViewInvoice(order.id)}
            className="px-10 mt-5 py-2 flex items-center gap-2 border-mainGreen text-mainGreen border rounded-md hover:bg-green-50 transition-colors font-medium"
          >
            <ViewOrders color="#004829" size={20} /> View Invoice
          </button>
        )}
      </div>
    );
  };

  const getDisplayNameForFilter = (filter: StatusFilter) => {
    const entry = Object.entries(statusDisplayMap).find(
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      ([_, value]) => value === filter
    );
    return entry ? entry[0] : filter;
  };

  return (
    <div className="w-full space-y-6">
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {availableStatusDisplayNames.map((displayName) => (
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

      <div className="space-y-4">
        {filteredOrders.length > 0 ? (
          filteredOrders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))
        ) : (
          <div className="text-center py-12">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              No orders found
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {activeFilter === "All"
                ? "No orders available at the moment."
                : `No orders with status "${getDisplayNameForFilter(
                    activeFilter
                  )}" found.`}
            </p>
            {activeFilter !== "All" && (
              <button
                onClick={() => setActiveFilter("All")}
                className="mt-3 text-sm text-green-600 hover:text-green-500 font-medium"
              >
                View all orders
              </button>
            )}
          </div>
        )}
      </div>

      {filteredOrders.length > 0 && filteredOrders.length >= 10 && (
        <div className="text-center pt-6">
          <button className="px-6 py-3 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium">
            Load More Orders
          </button>
        </div>
      )}

      {selectedInvoice && (
        <InvoiceModal
          isOpen={isInvoiceModalOpen}
          onClose={closeInvoiceModal}
          invoiceData={selectedInvoice}
        />
      )}
    </div>
  );
};

export default Orders;