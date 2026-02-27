"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useAdminStore } from "../../store/useAdminStore";
import Modal from "../../components/Modal";
import { InventoryItem, InventoryType } from "../../types";
import { getInventoryTypeLabel, getInventoryTypeBadgeStyle } from "../../helpers";
import AnimatedLoading from "../../Loading";

export default function InventoriesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [inventoryTypeFilter, setInventoryTypeFilter] = useState<InventoryType | "">("");
  const [selectedInventoryProduct, setSelectedInventoryProduct] = useState<InventoryItem | null>(null);
  const [showInventoryLogsModal, setShowInventoryLogsModal] = useState(false);

  const {
    inventories,
    inventoriesMeta,
    isLoadingInventories,
    fetchInventories,
    productInventoryLogs,
    isLoadingProductInventoryLogs,
    fetchProductInventoryLogs,
  } = useAdminStore();

  useEffect(() => {
    fetchInventories({
      search: searchQuery,
      type: inventoryTypeFilter || undefined,
      pageNumber: 1,
      pageSize: 20,
    });
  }, [searchQuery, inventoryTypeFilter, fetchInventories]);

  return (
    <div className="min-h-screen bg-[#F8F8F8]">
      {/* Top Header */}
      <div className="bg-[#F8F8F8] h-[104px] flex items-center justify-between px-12">
        <div className="flex items-center">
          <h1
            className="text-[28px] font-normal text-black"
            style={{ lineHeight: "1.5em", letterSpacing: "-1.1%" }}
          >
            Inventories
          </h1>
        </div>

        <div className="flex items-center gap-[27px]">
          <div className="flex items-center gap-3 px-[10px] py-0 bg-white rounded-[12px] border border-[rgba(0,0,0,0.4)] h-[50px] w-[638px]">
            <Image
              src="/icons/search-01.svg"
              alt="Search"
              width={18}
              height={18}
              className="flex-shrink-0"
            />
            <input
              type="text"
              placeholder="Search by product name or crop type..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 outline-none text-[16px] font-normal text-[#A2A2A2]"
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-12 pt-[20px] pb-[104px]">
        {/* Stats Cards */}
        <div className="grid grid-cols-4 gap-[17px] mb-[18px]">
          <div className="bg-white rounded-[20px] p-[21px] shadow-[0px_0px_2px_0px_rgba(0,0,0,0.25)] h-[120px]">
            <div className="flex justify-between items-start mb-[12px]">
              <p className="text-[16px] font-normal text-[#5B5B5B]" style={{ lineHeight: "1.5em" }}>
                Total Records
              </p>
              <Image src="/icons/package-delivered-01.svg" alt="Records" width={24} height={24} />
            </div>
            <p className="text-[32px] font-medium text-[#28433D]" style={{ lineHeight: "0.625em" }}>
              {isLoadingInventories ? "..." : inventoriesMeta?.totalRecord || 0}
            </p>
          </div>
          <div className="bg-white rounded-[20px] p-[21px] shadow-[0px_0px_2px_0px_rgba(0,0,0,0.25)] h-[120px]">
            <div className="flex justify-between items-start mb-[12px]">
              <p className="text-[16px] font-normal text-[#5B5B5B]" style={{ lineHeight: "1.5em" }}>
                Stock Added
              </p>
              <div className="w-3 h-3 rounded-full bg-green-500" />
            </div>
            <p className="text-[32px] font-medium text-[#28433D]" style={{ lineHeight: "0.625em" }}>
              {isLoadingInventories ? "..." : inventories.filter((i) => i.type === "addition").length}
            </p>
          </div>
          <div className="bg-white rounded-[20px] p-[21px] shadow-[0px_0px_2px_0px_rgba(0,0,0,0.25)] h-[120px]">
            <div className="flex justify-between items-start mb-[12px]">
              <p className="text-[16px] font-normal text-[#5B5B5B]" style={{ lineHeight: "1.5em" }}>
                In Transit
              </p>
              <div className="w-3 h-3 rounded-full bg-blue-500" />
            </div>
            <p className="text-[32px] font-medium text-[#28433D]" style={{ lineHeight: "0.625em" }}>
              {isLoadingInventories ? "..." : inventories.filter((i) => i.type === "reservation").length}
            </p>
          </div>
          <div className="bg-white rounded-[20px] p-[21px] shadow-[0px_0px_2px_0px_rgba(0,0,0,0.25)] h-[120px]">
            <div className="flex justify-between items-start mb-[12px]">
              <p className="text-[16px] font-normal text-[#5B5B5B]" style={{ lineHeight: "1.5em" }}>
                Sold
              </p>
              <div className="w-3 h-3 rounded-full bg-red-500" />
            </div>
            <p className="text-[32px] font-medium text-[#28433D]" style={{ lineHeight: "0.625em" }}>
              {isLoadingInventories ? "..." : inventories.filter((i) => i.type === "deduction").length}
            </p>
          </div>
        </div>

        {/* Table */}
        <div className="bg-[#FFFFFC] rounded-[12px] border border-[#EBE7E5] shadow-[0px_2px_8px_0px_rgba(51,117,54,0.08)]">
          {/* Table Header */}
          <div className="flex items-center justify-between px-[25px] pt-[25px] pb-[15px]">
            <h2
              className="text-[18px] font-normal text-[#004829]"
              style={{ fontFamily: "Effra, sans-serif", lineHeight: "1.333em" }}
            >
              Inventory Logs
            </h2>
            <div className="flex items-center gap-2 px-[13px] py-[9px] bg-[#FFFFFC] border border-[#F6F4F3] rounded-[10px] h-[40px]">
              <Image src="/icons/analytics-03.svg" alt="Filter" width={16} height={16} />
              <select
                value={inventoryTypeFilter}
                onChange={(e) => setInventoryTypeFilter(e.target.value as InventoryType | "")}
                className="bg-transparent outline-none text-[14px] text-[#0D3F11]"
                style={{ fontFamily: "Effra, sans-serif", lineHeight: "1.429em" }}
              >
                <option value="">All Types</option>
                <option value="addition">Stock Added</option>
                <option value="reservation">In Transit</option>
                <option value="release">Released</option>
                <option value="deduction">Sold</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#EBE7E5]">
                  <th className="px-4 py-[13.25px] text-left text-[14px] font-medium text-[#80726B]" style={{ fontFamily: "Effra, sans-serif", lineHeight: "1.429em" }}>
                    Product
                  </th>
                  <th className="px-4 py-[13.25px] text-left text-[14px] font-medium text-[#80726B]" style={{ fontFamily: "Effra, sans-serif", lineHeight: "1.429em" }}>
                    Crop Type
                  </th>
                  <th className="px-4 py-[13.25px] text-left text-[14px] font-medium text-[#80726B]" style={{ fontFamily: "Effra, sans-serif", lineHeight: "1.429em" }}>
                    Quantity (Kg)
                  </th>
                  <th className="px-4 py-[13.25px] text-left text-[14px] font-medium text-[#80726B]" style={{ fontFamily: "Effra, sans-serif", lineHeight: "1.429em" }}>
                    Product Stock
                  </th>
                  <th className="px-4 py-[13.25px] text-left text-[14px] font-medium text-[#80726B]" style={{ fontFamily: "Effra, sans-serif", lineHeight: "1.429em" }}>
                    Date
                  </th>
                  <th className="px-4 py-[13.25px] text-left text-[14px] font-medium text-[#80726B]" style={{ fontFamily: "Effra, sans-serif", lineHeight: "1.429em" }}>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {isLoadingInventories ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center">
                      <AnimatedLoading />
                    </td>
                  </tr>
                ) : inventories.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-[#80726B]">
                      No inventory records found
                    </td>
                  </tr>
                ) : (
                  inventories.map((item) => (
                    <tr key={item.id} className="border-b border-[#EBE7E5] hover:bg-gray-50/50 transition-colors">
                      <td className="px-4 py-4">
                        <div className="flex flex-col gap-1">
                          <p className="text-[14px] font-medium text-[#0D3F11]" style={{ fontFamily: "Effra, sans-serif", lineHeight: "1.429em" }}>
                            {item.product.name}
                          </p>
                          <p className="text-[12px] font-normal text-[#80726B]" style={{ fontFamily: "Effra, sans-serif", lineHeight: "1.333em" }}>
                            ID: {item.product.id.substring(0, 8).toUpperCase()}
                          </p>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span className="text-[14px] font-normal text-[#0D3F11]" style={{ fontFamily: "Effra, sans-serif", lineHeight: "1.429em" }}>
                          {item.product.cropType?.name || "N/A"}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <p className="text-[14px] font-medium text-[#0D3F11]" style={{ fontFamily: "Effra, sans-serif", lineHeight: "1.429em" }}>
                          {parseFloat(item.quantityKg).toLocaleString()} kg
                        </p>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex flex-col gap-0.5">
                          <p className="text-[14px] font-normal text-[#0D3F11]" style={{ fontFamily: "Effra, sans-serif", lineHeight: "1.429em" }}>
                            {parseFloat(item.product.quantityKg).toLocaleString()} kg
                          </p>
                          <p className="text-[11px] font-normal text-[#80726B]">
                            In Transit: {parseFloat(item.product.reservedQuantityKg).toLocaleString()} kg
                          </p>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <p className="text-[14px] font-normal text-[#80726B]" style={{ fontFamily: "Effra, sans-serif", lineHeight: "1.429em" }}>
                          {new Date(item.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                        </p>
                      </td>
                      <td className="px-4 py-4">
                        <button
                          onClick={async () => {
                            setSelectedInventoryProduct(item);
                            setShowInventoryLogsModal(true);
                            await fetchProductInventoryLogs(item.product.id);
                          }}
                          className="px-[13px] py-1 bg-[#FFFFFC] border border-[#EBE7E5] rounded-[10px] text-[14px] font-medium text-[#0D3F11] hover:bg-gray-50 transition-colors"
                          style={{ fontFamily: "Effra, sans-serif", lineHeight: "1.429em" }}
                        >
                          View Logs
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {inventoriesMeta && inventoriesMeta.totalRecord > inventoriesMeta.pageSize && (
            <div className="flex items-center justify-between px-6 py-3 border-t border-[#EAECF0]">
              <button
                onClick={() => {
                  if (inventoriesMeta.pageNumber > 1) {
                    fetchInventories({
                      search: searchQuery,
                      type: inventoryTypeFilter || undefined,
                      pageNumber: inventoriesMeta.pageNumber - 1,
                      pageSize: inventoriesMeta.pageSize,
                    });
                  }
                }}
                disabled={inventoriesMeta.pageNumber <= 1}
                className="flex items-center gap-2 px-[14px] py-2 bg-white border border-[#D0D5DD] rounded-lg shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] text-[14px] font-semibold text-[#344054] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12.5 15L7.5 10L12.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Previous
              </button>
              <span className="text-[14px] text-[#344054]">
                Page {inventoriesMeta.pageNumber} of {Math.ceil(inventoriesMeta.totalRecord / inventoriesMeta.pageSize)}
              </span>
              <button
                onClick={() => {
                  const totalPages = Math.ceil(inventoriesMeta.totalRecord / inventoriesMeta.pageSize);
                  if (inventoriesMeta.pageNumber < totalPages) {
                    fetchInventories({
                      search: searchQuery,
                      type: inventoryTypeFilter || undefined,
                      pageNumber: inventoriesMeta.pageNumber + 1,
                      pageSize: inventoriesMeta.pageSize,
                    });
                  }
                }}
                disabled={inventoriesMeta.pageNumber >= Math.ceil(inventoriesMeta.totalRecord / inventoriesMeta.pageSize)}
                className="flex items-center gap-2 px-[14px] py-2 bg-white border border-[#D0D5DD] rounded-lg shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] text-[14px] font-semibold text-[#344054] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M7.5 15L12.5 10L7.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Inventory Logs Modal */}
      <Modal
        isOpen={showInventoryLogsModal}
        onClose={() => {
          setShowInventoryLogsModal(false);
          setSelectedInventoryProduct(null);
        }}
        size="xl"
        className="bg-[#FAFAFA] rounded-[8px]"
        showCloseButton={false}
      >
        {selectedInventoryProduct && (
          <div className="p-[25px]">
            <div className="flex justify-between items-center mb-6 relative pr-12">
              <div>
                <h2 className="text-[18px] font-semibold text-[#272C34]" style={{ lineHeight: "1em", letterSpacing: "-2.5%" }}>
                  Inventory Logs
                </h2>
                <p className="text-[14px] text-[#80726B] mt-1">
                  {selectedInventoryProduct.product.name}
                </p>
              </div>
              <button
                onClick={() => {
                  setShowInventoryLogsModal(false);
                  setSelectedInventoryProduct(null);
                }}
                className="absolute top-0 right-0 w-[40px] h-[40px] flex items-center justify-center rounded-[6px] hover:bg-gray-100 transition-colors"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4 4L12 12M12 4L4 12" stroke="#272C34" strokeWidth="1.33" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            {/* Product Summary */}
            <div className="bg-white border border-[rgba(229,231,235,0.5)] rounded-[8px] p-4 mb-4 shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-[12px] text-[#80726B]">Crop Type</p>
                  <p className="text-[14px] font-medium text-[#0D3F11]">
                    {selectedInventoryProduct.product.cropType?.name || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-[12px] text-[#80726B]">Current Stock</p>
                  <p className="text-[14px] font-medium text-[#0D3F11]">
                    {parseFloat(selectedInventoryProduct.product.quantityKg).toLocaleString()} kg
                  </p>
                </div>
                <div>
                  <p className="text-[12px] text-[#80726B]">Price / Kg</p>
                  <p className="text-[14px] font-medium text-[#4CAE4F]">
                    {selectedInventoryProduct.product.priceCurrency?.toLowerCase() === "ngn" ? "₦" : selectedInventoryProduct.product.priceCurrency}
                    {parseFloat(selectedInventoryProduct.product.pricePerKg).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            {/* Logs Table */}
            <div className="bg-white border border-[rgba(229,231,235,0.5)] rounded-[8px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] overflow-hidden">
              {isLoadingProductInventoryLogs ? (
                <div className="py-8 flex justify-center">
                  <AnimatedLoading />
                </div>
              ) : productInventoryLogs.length === 0 ? (
                <div className="py-8 text-center text-[#80726B] text-[14px]">
                  No inventory logs found for this product
                </div>
              ) : (
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[#EBE7E5]">
                      <th className="px-4 py-3 text-left text-[12px] font-medium text-[#80726B]">Type</th>
                      <th className="px-4 py-3 text-left text-[12px] font-medium text-[#80726B]">Quantity (Kg)</th>
                      <th className="px-4 py-3 text-left text-[12px] font-medium text-[#80726B]">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {productInventoryLogs.map((log) => (
                      <tr key={log.id} className="border-b border-[#EBE7E5] last:border-b-0">
                        <td className="px-4 py-3">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getInventoryTypeBadgeStyle(log.type)}`}>
                            {getInventoryTypeLabel(log.type)}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-[14px] text-[#0D3F11]">
                          {parseFloat(log.quantityKg).toLocaleString()} kg
                        </td>
                        <td className="px-4 py-3 text-[14px] text-[#80726B]">
                          {new Date(log.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                          {" "}
                          <span className="text-[12px]">
                            {new Date(log.createdAt).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
