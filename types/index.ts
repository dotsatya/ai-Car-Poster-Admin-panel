export type PrintSizeId = "a4" | "a3" | "12x18" | "a2";
export type PaperGsmId = "200gsm" | "250gsm" | "300gsm";

export interface PrintSizeOption {
  id: PrintSizeId;
  name: string;
  dimensions: string;
}

export interface PaperGsmOption {
  id: PaperGsmId;
  name: string;
  label: string;
}

export interface SizeGsmPrice {
  size: PrintSizeId;
  gsm: PaperGsmId;
  price: number;
  formattedPrice: string;
}

export interface Template {
  id: string;
  slug: string;
  name: string;
  subtitle: string;
  category: string;
  tag: string;
  image: string;
  description: string;
  longDescription?: string;
  accent: string;
  features?: string[];
  supportsCustomText?: boolean;
  recommendedAspect?: string;
  availableSizes?: PrintSizeOption[];
  availableGsm?: PaperGsmOption[];
  pricing?: SizeGsmPrice[];
  startingPrice?: number;
  formattedStartingPrice?: string;
}

export interface PrintSize {
  id: string;
  label: string;
  dimensions: string;
  priceNum: number;
  price: string;
  popular: boolean;
  description?: string;
}

export interface FaqItem {
  question: string;
  answer: string;
  category?: string;
}

export interface User {
  email: string;
}

export type StudioState = "configure" | "generating" | "review";

export type GenerationJobStatus = "queued" | "processing" | "completed";

export interface GeneratedArtwork {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  image: string;
  badge: string;
  size: string;
  quantity: number;
  selected: boolean;
  templateId?: string;
}

export interface CartItem {
  id: string;
  title: string;
  size: string;
  gsm?: string;
  dimensions: string;
  price: number;
  quantity: number;
  total: number;
  isCombined: boolean;
  image: string;
  currency?: string;
  formattedPrice?: string;
  templateSlug?: string;
}
