import { formatQuantity } from './index';
import type { BuyRequest } from '../types';

export interface PurchaseOrderData {
  requestNumber: string;
  buyer: {
    companyName?: string;
    firstName: string;
    lastName: string;
    email?: string;
    phoneNumber?: string;
    farmAddress?: string;
    state?: string;
    country?: string;
  };
  seller: {
    farmName?: string;
    firstName: string;
    lastName: string;
    email?: string;
    phoneNumber?: string;
    farmAddress?: string;
    state?: string;
    country?: string;
  } | null;
  productName: string;
  quantityKg: string;
  unitPrice: string;
  totalAmount: string;
  deliveryLocation?: string;
  estimatedDeliveryDate?: string;
  paymentTerms?: string;
  qualitySpec?: string;
  currency?: string;
}

export function buildPurchaseOrderDataFromBuyRequest(br: BuyRequest): PurchaseOrderData {
  const total = parseFloat(br.pricePerKgOffer || '0') * parseFloat(br.productQuantityKg || '0');
  const productName = br.product?.name || br.cropType?.name || br.description || 'Product';
  const currency = 'NGN';

  return {
    requestNumber: String(br.requestNumber ?? br.id),
    buyer: {
      companyName: (br.buyer as { companyName?: string }).companyName ?? undefined,
      firstName: br.buyer.firstName || '',
      lastName: br.buyer.lastName || '',
      email: br.buyer.email ?? undefined,
      phoneNumber: br.buyer.phoneNumber ?? undefined,
      farmAddress: br.buyer.farmAddress ?? undefined,
      state: br.buyer.state ?? undefined,
      country: br.buyer.country ?? undefined,
    },
    seller: br.seller
      ? {
          farmName: br.seller.farmName ?? undefined,
          firstName: br.seller.firstName || '',
          lastName: br.seller.lastName || '',
          email: br.seller.email ?? undefined,
          phoneNumber: br.seller.phoneNumber ?? undefined,
          farmAddress: br.seller.farmAddress ?? undefined,
          state: br.seller.state ?? undefined,
          country: br.seller.country ?? undefined,
        }
      : null,
    productName,
    quantityKg: br.productQuantityKg || '0',
    unitPrice: br.pricePerKgOffer || '0',
    totalAmount: total.toFixed(2),
    deliveryLocation: br.deliveryLocation,
    estimatedDeliveryDate: br.estimatedDeliveryDate,
    paymentTerms: br.preferredPaymentMethod
      ? br.preferredPaymentMethod.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())
      : undefined,
    qualitySpec: (br as BuyRequest & { qualityStandardType?: { name?: string } }).qualityStandardType?.name,
    currency,
  };
}

/** Build PurchaseOrderData from CreateNewRequest form values (Quick Order flow) */
export interface CreateRequestFormData {
  productName: string;
  quantityKg: string;
  pricePerKg: string;
  deliveryLocation: string;
  estimatedDeliveryDate: string;
  paymentTerms: string;
  qualitySpec?: string;
}

export interface CreateRequestParty {
  companyName?: string;
  firstName: string;
  lastName: string;
  email?: string;
  phoneNumber?: string;
  farmAddress?: string;
  state?: string;
  country?: string;
  farmName?: string;
}

export function buildPurchaseOrderDataFromFormValues(
  formData: CreateRequestFormData,
  buyer: CreateRequestParty,
  seller: CreateRequestParty | null
): PurchaseOrderData {
  const total = parseFloat(formData.pricePerKg || '0') * parseFloat(formData.quantityKg || '0');
  const paymentFormatted = formData.paymentTerms?.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());

  return {
    requestNumber: 'DRAFT-' + Date.now(),
    buyer: {
      companyName: buyer.companyName ?? undefined,
      firstName: buyer.firstName || '',
      lastName: buyer.lastName || '',
      email: buyer.email ?? undefined,
      phoneNumber: buyer.phoneNumber ?? undefined,
      farmAddress: buyer.farmAddress ?? undefined,
      state: buyer.state ?? undefined,
      country: buyer.country ?? undefined,
    },
    seller: seller
      ? {
          farmName: seller.farmName ?? undefined,
          firstName: seller.firstName || '',
          lastName: seller.lastName || '',
          email: seller.email ?? undefined,
          phoneNumber: seller.phoneNumber ?? undefined,
          farmAddress: seller.farmAddress ?? undefined,
          state: seller.state ?? undefined,
          country: seller.country ?? undefined,
        }
      : null,
    productName: formData.productName || 'Product',
    quantityKg: formData.quantityKg || '0',
    unitPrice: formData.pricePerKg || '0',
    totalAmount: total.toFixed(2),
    deliveryLocation: formData.deliveryLocation,
    estimatedDeliveryDate: formData.estimatedDeliveryDate || undefined,
    paymentTerms: paymentFormatted,
    qualitySpec: formData.qualitySpec,
    currency: 'NGN',
  };
}

/** Simple number-to-words for amounts (e.g. for TOTAL VALUE in words) */
function numberToWords(num: number): string {
  const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
  const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
  if (num === 0) return 'Zero';
  if (num < 20) return ones[Math.floor(num)];
  if (num < 100) return tens[Math.floor(num / 10)] + (num % 10 ? ' ' + ones[num % 10] : '');
  if (num < 1000) return ones[Math.floor(num / 100)] + ' Hundred' + (num % 100 ? ' and ' + numberToWords(num % 100) : '');
  if (num < 1000000) return numberToWords(Math.floor(num / 1000)) + ' Thousand' + (num % 1000 ? ' ' + numberToWords(num % 1000) : '');
  if (num < 1000000000) return numberToWords(Math.floor(num / 1000000)) + ' Million' + (num % 1000000 ? ' ' + numberToWords(num % 1000000) : '');
  return numberToWords(Math.floor(num / 1000000000)) + ' Billion' + (num % 1000000000 ? ' ' + numberToWords(num % 1000000000) : '');
}

export function generatePurchaseOrderHTML(data: PurchaseOrderData): string {
  const symbol = data.currency === 'NGN' ? '₦' : '$';
  const currencyCode = data.currency || 'NGN';

  const buyerName = data.buyer.companyName || `${data.buyer.firstName} ${data.buyer.lastName}`.trim() || 'Buyer';
  const buyerAddr1 = data.buyer.farmAddress || '';
  const buyerAddr2 = [data.buyer.state, data.buyer.country].filter(Boolean).join(', ') || '';

  const sellerName = data.seller
    ? data.seller.farmName || `${data.seller.firstName} ${data.seller.lastName}`.trim() || 'Supplier'
    : 'Supplier';
  const sellerAddr = data.seller
    ? [data.seller.farmAddress, data.seller.state, data.seller.country].filter(Boolean).join(', ') || 'N/A'
    : 'N/A';
  const sellerAttn = data.seller ? `${data.seller.firstName} ${data.seller.lastName}`.trim() || 'Procurement Dept' : 'Procurement Dept';

  const qtyFormatted = formatQuantity(data.quantityKg);
  const unitPriceFormatted = parseFloat(data.unitPrice).toLocaleString('en-NG', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  const totalFormatted = parseFloat(data.totalAmount).toLocaleString('en-NG', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  const totalInt = Math.floor(parseFloat(data.totalAmount));
  const totalKobo = Math.round((parseFloat(data.totalAmount) - totalInt) * 100);
  const totalInWords = numberToWords(totalInt) + (totalKobo > 0 ? ` and ${totalKobo}/100` : '') + ' Only';

  const deliveryDate = data.estimatedDeliveryDate
    ? new Date(data.estimatedDeliveryDate).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : 'As per agreed schedule';
  const poDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Purchase Order - ${data.requestNumber}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Georgia', 'Times New Roman', serif; font-size: 11px; line-height: 1.4; color: #1a1a1a; background: #fff; padding: 24px 40px; max-width: 210mm; }
    .po-title { font-size: 22px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.02em; text-align: center; margin-bottom: 8px; padding-bottom: 8px; border-bottom: 1px solid #1a1a1a; }
    .page1-top { display: flex; justify-content: space-between; align-items: flex-start; gap: 24px; margin-bottom: 20px; }
    .buyer-block { text-align: right; flex: 1; }
    .buyer-block strong { display: block; font-size: 12px; margin-bottom: 4px; }
    .buyer-block .addr-line { margin-bottom: 2px; }
    .buyer-block .contact { margin-top: 4px; }
    .po-meta { margin-top: 8px; font-size: 11px; }
    .two-col { display: flex; gap: 48px; margin: 28px 0; }
    .col-left { flex: 1; padding-bottom: 24px; }
    .col-right { flex: 1; text-align: right; padding-bottom: 24px; }
    .block-title { font-weight: 700; font-size: 11px; text-transform: uppercase; margin-bottom: 6px; }
    .block-value { margin-bottom: 6px; }
    .re-subject { font-weight: 700; font-size: 12px; text-transform: uppercase; text-align: center; margin: 20px 0 12px; }
    .intro { margin-bottom: 16px; }
    table { width: 100%; border-collapse: collapse; margin: 16px 0; font-size: 11px; }
    th, td { border: 1px solid #333; padding: 8px 10px; text-align: left; }
    th { background: #f5f5f5; font-weight: 700; font-size: 10px; text-transform: uppercase; }
    .table-footer { display: flex; justify-content: space-between; align-items: flex-start; gap: 48px; margin-top: 12px; }
    .footer-left .block-title { margin-bottom: 4px; }
    .footer-right { text-align: right; }
    .footer-right .line { margin-bottom: 4px; }
    .section-title { font-weight: 700; font-size: 11px; text-transform: uppercase; margin-top: 16px; margin-bottom: 6px; }
    .section-body { margin-bottom: 10px; font-size: 11px; }
    .section-body ul { margin-left: 20px; margin-top: 4px; }
    .section-body li { margin-bottom: 2px; }
    .signature-block { margin-top: 24px; padding-top: 12px; }
    .signature-block .line { border-bottom: 1px solid #333; margin-top: 20px; width: 220px; padding-top: 2px; font-size: 10px; color: #555; }
    .page-break { page-break-before: always; }
    @media print { body { padding: 16px; } .page-break { page-break-before: always; } }
  </style>
</head>
<body>
  <h1 class="po-title">Purchase Order</h1>

  <div class="page1-top">
    <div style="flex: 1;"></div>
    <div class="buyer-block">
      <strong>${buyerName}</strong>
      ${buyerAddr1 ? `<div class="addr-line">${buyerAddr1}</div>` : ''}
      ${buyerAddr2 ? `<div class="addr-line">${buyerAddr2}</div>` : ''}
      <div class="contact">Phone: ${data.buyer.phoneNumber || 'N/A'} | Email: ${data.buyer.email || 'N/A'}</div>
      <div class="po-meta">PO Number: <strong>PO-${data.requestNumber}</strong></div>
      <div class="po-meta">Date: ${poDate}</div>
    </div>
  </div>

  <div class="two-col" style="margin-top: 32px;">
    <div class="col-left">
      <div class="block-title">TO:</div>
      <div class="block-value"><strong>${sellerName}</strong></div>
      <div class="block-value">${sellerAddr}</div>
      <div class="block-value">Attn: ${sellerAttn}</div>
      <div class="block-title" style="margin-top: 12px;">Supplier/Vendor Information:</div>
      <div class="block-value">Vendor ID: N/A</div>
      <div class="block-value">Payment Terms: ${data.paymentTerms || 'As per agreed terms'}</div>
    </div>
    <div class="col-right">
      <div class="block-title">Ship To / Delivery Address:</div>
      <div class="block-value"><strong>${buyerName} – Receiving</strong></div>
      <div class="block-value">${data.deliveryLocation || buyerAddr1 || 'As per agreement'}</div>
      <div class="block-value">${buyerAddr2 || ''}</div>
    </div>
  </div>

  <p class="re-subject">RE: PURCHASE OF ${data.productName.toUpperCase()}</p>
  <p class="intro">Dear Sir/Madam,<br><br>Please accept this Purchase Order for the supply of the following goods in accordance with the terms and conditions stated below.</p>

  <table>
    <thead>
      <tr>
        <th>Item #</th>
        <th>Description</th>
        <th>Quantity (Kg)</th>
        <th>Unit Price (${currencyCode}/kg)</th>
        <th>Total Amount (${currencyCode})</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>01</td>
        <td>${data.productName}</td>
        <td>${qtyFormatted}</td>
        <td>${symbol} ${unitPriceFormatted}</td>
        <td>${symbol} ${totalFormatted}</td>
      </tr>
    </tbody>
  </table>

  <div class="table-footer">
    <div class="footer-left">
      <div class="block-title">TOTAL QUANTITY: ${qtyFormatted} kg</div>
      <div class="block-title">TOTAL VALUE: ${totalInWords}</div>
    </div>
    <div class="footer-right">
      <div class="line">Subtotal: ${symbol} ${totalFormatted}</div>
      <div class="line">Freight/Shipping (if applicable): ${symbol} 0.00</div>
      <div class="line" style="font-weight: 700; margin-top: 6px;">TOTAL ORDER VALUE: ${symbol} ${totalFormatted}</div>
    </div>
  </div>

  <div class="page-break"></div>

  <p class="section-title">DELIVERY SCHEDULE:</p>
  <ul class="section-body">
    <li>Delivery Date: ${deliveryDate}</li>
    <li>Incoterms: As per agreed terms</li>
    <li>Delivery Location: ${data.deliveryLocation || 'As per agreement'}</li>
  </ul>

  <p class="section-title">QUALITY SPECIFICATIONS:</p>
  <p class="section-body">The goods must conform to the following standards:</p>
  <ul class="section-body">
    ${data.qualitySpec ? `<li>${data.qualitySpec}</li>` : '<li>As per product specification and agreed quality standards</li>'}
  </ul>

  <p class="section-title">INSPECTION:</p>
  <p class="section-body">Goods are subject to inspection by the buyer or a nominated third-party inspector prior to shipment/discharge.</p>

  <p class="section-title">PAYMENT TERMS:</p>
  <p class="section-body">${data.paymentTerms || 'As per agreed terms'}</p>

  <p class="section-title">SHIPPING INSTRUCTIONS:</p>
  <p class="section-body">Please ensure all shipping documents include this PO Number (PO-${data.requestNumber}). Required documents include:</p>
  <ul class="section-body">
    <li>Commercial Invoice (3 copies)</li>
    <li>Packing List</li>
    <li>Bill of Lading</li>
    <li>Certificate of Origin</li>
    <li>Phytosanitary Certificate</li>
    <li>Weight and Quality Certificate</li>
  </ul>

  <p class="section-title">AUTHORIZATION:</p>
  <p class="section-body">This Purchase Order is considered legally binding upon acknowledgment by ${sellerName}.</p>
  <div class="signature-block">
    <p><strong>For ${buyerName}:</strong></p>
    <div class="line">[Name of Authorized Signatory]</div>
    <div class="line">[Title]</div>
    <div class="line">Date: ________________</div>
  </div>

  <div class="signature-block">
    <p class="section-title">ACKNOWLEDGMENT OF PURCHASE ORDER</p>
    <p class="section-body">To be completed and returned by ${sellerName}.</p>
    <p class="section-body">We acknowledge receipt of this Purchase Order and agree to supply the goods as specified above.</p>
    <p style="margin-top: 12px;"><strong>For ${sellerName}:</strong></p>
    <div class="line">[Name of Authorized Signatory]</div>
    <div class="line">[Title]</div>
    <div class="line">Date: ________________</div>
    <div class="line">Company Stamp: ________________</div>
  </div>
</body>
</html>`;
}

export function openPurchaseOrderPrint(data: PurchaseOrderData): void {
  const html = generatePurchaseOrderHTML(data);
  const printWindow = window.open('', '_blank');
  if (!printWindow) return;
  printWindow.document.write(html);
  printWindow.document.close();
  printWindow.onload = () => {
    setTimeout(() => {
      printWindow.print();
    }, 250);
  };
}
