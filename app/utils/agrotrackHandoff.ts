import type { BuyRequest } from "@/app/types";
import { config } from "@/app/config";

const NIGERIAN_STATES = [
  "Abia",
  "Adamawa",
  "Akwa Ibom",
  "Anambra",
  "Bauchi",
  "Bayelsa",
  "Benue",
  "Borno",
  "Cross River",
  "Delta",
  "Ebonyi",
  "Edo",
  "Ekiti",
  "Enugu",
  "FCT",
  "Federal Capital Territory",
  "Gombe",
  "Imo",
  "Jigawa",
  "Kaduna",
  "Kano",
  "Katsina",
  "Kebbi",
  "Kogi",
  "Kwara",
  "Lagos",
  "Nasarawa",
  "Niger",
  "Ogun",
  "Ondo",
  "Osun",
  "Oyo",
  "Plateau",
  "Rivers",
  "Sokoto",
  "Taraba",
  "Yobe",
  "Zamfara",
] as const;

const CARGO_TYPE_BY_CROP: Array<{ match: RegExp; cargo: string }> = [
  { match: /rice|maize|corn|wheat|sorghum|millet|grain|cereal/i, cargo: "Grains & Cereals" },
  { match: /yam|cassava|potato|tomato|onion|pepper|vegetable|fruit|produce/i, cargo: "Fresh Produce" },
  { match: /feed|fodder/i, cargo: "Livestock Feed" },
  { match: /flour|oil|processed/i, cargo: "Processed Goods" },
];

export type ParsedLocation = {
  state: string;
  lga: string;
};

function normalizeStateName(raw: string): string {
  const trimmed = raw.trim();
  if (!trimmed) return "";
  const lower = trimmed.toLowerCase();
  if (lower === "fct" || lower.includes("federal capital")) {
    return "FCT";
  }
  const found = NIGERIAN_STATES.find(
    (state) => state.toLowerCase() === lower || lower.includes(state.toLowerCase()),
  );
  if (!found) return "";
  return found === "Federal Capital Territory" ? "FCT" : found;
}

/** Best-effort parse of free-text like "Ikeja, Lagos". Never invents LGA. */
export function parseDeliveryLocation(raw: string | null | undefined): ParsedLocation {
  const text = (raw || "").trim();
  if (!text) return { state: "", lga: "" };

  const state = normalizeStateName(text);
  if (!state) return { state: "", lga: "" };

  // Prefer "Something, State" → treat left side as LGA candidate
  const parts = text.split(",").map((p) => p.trim()).filter(Boolean);
  if (parts.length >= 2) {
    const last = parts[parts.length - 1];
    const lastAsState = normalizeStateName(last);
    if (lastAsState) {
      const left = parts.slice(0, -1).join(", ").trim();
      const leftIsState = Boolean(normalizeStateName(left));
      return {
        state: lastAsState,
        lga: leftIsState ? "" : left,
      };
    }
  }

  return { state, lga: "" };
}

export function mapCropToCargoType(cropName: string | null | undefined): string {
  const name = cropName || "";
  for (const entry of CARGO_TYPE_BY_CROP) {
    if (entry.match.test(name)) return entry.cargo;
  }
  return "Other";
}

function buyerDisplayName(request: BuyRequest): string {
  const buyer = request.buyer;
  return (
    buyer.companyName?.trim() ||
    `${buyer.firstName || ""} ${buyer.lastName || ""}`.trim() ||
    ""
  );
}

function sellerDisplayName(request: BuyRequest): string {
  const seller = request.seller;
  if (!seller) return "";
  return (
    seller.farmName?.trim() ||
    `${seller.firstName || ""} ${seller.lastName || ""}`.trim() ||
    ""
  );
}

function toIsoDate(value: string | null | undefined): string {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toISOString().slice(0, 10);
}

function buildNotes(request: BuyRequest): string {
  const parts = [
    `REQ-${request.requestNumber}`,
    `okoRequestId: ${request.id}`,
    request.cropType?.name ? `crop: ${request.cropType.name}` : "",
    request.qualityStandardType?.name
      ? `quality: ${request.qualityStandardType.name}`
      : "",
    request.deliveryLocation
      ? `Oko delivery: ${request.deliveryLocation}`
      : "",
    request.seller?.farmAddress
      ? `farm: ${request.seller.farmAddress}`
      : "",
    request.description ? `notes: ${request.description}` : "",
  ].filter(Boolean);

  return parts.join(" | ");
}

export function getAgroTrackBaseUrl(): string {
  return config.agroTrackUrl;
}

/** Build AgroTrack new-shipment deep link for an accepted Oko buy request. */
export function buildAgroTrackHandoffUrl(request: BuyRequest): string {
  const base = getAgroTrackBaseUrl();
  const delivery = parseDeliveryLocation(request.deliveryLocation);
  const pickupState = normalizeStateName(request.seller?.state || "");
  const qty = parseFloat(request.productQuantityKg || "0");
  const price = parseFloat(request.pricePerKgOffer || "0");
  const estimatedValue =
    Number.isFinite(qty) && Number.isFinite(price) && qty > 0 && price > 0
      ? String(Math.round(qty * price))
      : "";

  const params = new URLSearchParams();
  params.set("source", "oko-agro");
  params.set("okoRequestId", request.id);
  params.set("okoRequestNumber", String(request.requestNumber));
  params.set("direction", "sending");

  if (pickupState) params.set("pickup_state", pickupState);
  const pickupName = sellerDisplayName(request);
  if (pickupName) params.set("pickup_contact_name", pickupName);
  if (request.seller?.phoneNumber) {
    params.set("pickup_phone", request.seller.phoneNumber);
  }
  if (request.seller?.farmAddress) {
    params.set("pickup_street_address", request.seller.farmAddress);
    params.set("pickup_address", request.seller.farmAddress);
  }

  if (delivery.state) params.set("delivery_state", delivery.state);
  if (delivery.lga) params.set("delivery_lga", delivery.lga);
  if (request.deliveryLocation) {
    params.set("delivery_location_raw", request.deliveryLocation);
    params.set("delivery_street_address", request.deliveryLocation);
    params.set("delivery_address", request.deliveryLocation);
  }

  const recipient = buyerDisplayName(request);
  if (recipient) params.set("delivery_name", recipient);
  if (request.buyer.phoneNumber) {
    params.set("delivery_phone", request.buyer.phoneNumber);
  }
  if (request.buyer.email) {
    params.set("delivery_email", request.buyer.email);
  }

  params.set("cargo_type", mapCropToCargoType(request.cropType?.name));
  if (request.productQuantityKg) {
    params.set("cargo_weight", String(request.productQuantityKg));
  }
  if (estimatedValue) params.set("cargo_value", estimatedValue);

  const preferredDate = toIsoDate(request.estimatedDeliveryDate);
  if (preferredDate) params.set("preferred_date", preferredDate);

  params.set("notes", buildNotes(request));

  return `${base}/dashboard/new-shipment?${params.toString()}`;
}

export function openAgroTrackHandoff(request: BuyRequest): void {
  const url = buildAgroTrackHandoffUrl(request);
  window.open(url, "_blank", "noopener,noreferrer");
}

/** Public AgroTrack track page for a linked tracking number. */
export function buildAgroTrackTrackUrl(trackingNumber: string): string {
  const code = trackingNumber.trim().replace(/^#/, "").toUpperCase();
  const params = new URLSearchParams();
  params.set("code", code);
  return `${getAgroTrackBaseUrl()}/find-my-shipment?${params.toString()}`;
}

export function openAgroTrackTrack(trackingNumber: string): void {
  window.open(buildAgroTrackTrackUrl(trackingNumber), "_blank", "noopener,noreferrer");
}

/** Normalize tracking from AgroTrack return / paste. */
export function normalizeTrackingNumber(raw: string): string {
  return raw.trim().replace(/^#/, "").replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
}
