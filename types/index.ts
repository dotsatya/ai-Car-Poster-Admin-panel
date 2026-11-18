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
