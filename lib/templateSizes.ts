import { GeneratedArtwork, Template, PrintSizeOption } from "@/types";
import { TEMPLATES } from "@/data/templates";
import { PRINT_SIZES } from "@/data/print-sizes";

export interface ArtworkSizeOption {
  id: string;
  name: string;
  dimensions: string;
  priceNum: number;
  price: string;
  isPopular?: boolean;
}

/**
 * Resolves the parent template for a given generated artwork based on:
 * 1. Explicit templateId stored on the artwork
 * 2. Active selected templates list in studio
 * 3. Matched image URI
 * 4. Matched title/category
 * 5. Deterministic fallback
 */
export function getTemplateForArtwork(
  art: GeneratedArtwork,
  selectedTemplates: string[] = []
): Template | undefined {
  // 1. Direct template ID
  if (art.templateId) {
    const found = TEMPLATES.find(
      (t) => t.id === art.templateId || t.slug === art.templateId
    );
    if (found) return found;
  }

  // 2. Map by studio selected templates
  if (art.id === "gen-poster-1" && selectedTemplates[0]) {
    const t = TEMPLATES.find((t) => t.id === selectedTemplates[0]);
    if (t) return t;
  }
  if (art.id === "gen-poster-2") {
    const t = TEMPLATES.find((t) => t.id === (selectedTemplates[1] || selectedTemplates[0]));
    if (t) return t;
  }
  if (art.id === "gen-poster-3") {
    const t = TEMPLATES.find((t) => t.id === (selectedTemplates[2] || selectedTemplates[0]));
    if (t) return t;
  }
  if (art.id === "gen-poster-4") {
    const t = TEMPLATES.find((t) => t.id === selectedTemplates[0]);
    if (t) return t;
  }

  // 3. Match by image source
  if (art.image) {
    const artSrc = decodeURI(art.image).toLowerCase();
    const found = TEMPLATES.find((t) => {
      const tSrc = decodeURI(t.image).toLowerCase();
      return artSrc.includes(tSrc) || tSrc.includes(artSrc);
    });
    if (found) return found;
  }

  // 4. Match by title
  if (art.title) {
    const artTitle = art.title.toLowerCase();
    const found = TEMPLATES.find(
      (t) => artTitle.includes(t.name.toLowerCase()) || t.name.toLowerCase().includes(artTitle)
    );
    if (found) return found;
  }

  // 5. Deterministic fallback by index
  if (art.id === "gen-poster-1") return TEMPLATES[0];
  if (art.id === "gen-poster-2") return TEMPLATES[1];
  if (art.id === "gen-poster-3") return TEMPLATES[2];
  if (art.id === "gen-poster-4") return TEMPLATES[3];

  return TEMPLATES[0];
}

/**
 * Returns available print sizes specifically for the template corresponding to the artwork.
 */
export function getAvailableSizesForArtwork(
  art: GeneratedArtwork,
  selectedTemplates: string[] = []
): ArtworkSizeOption[] {
  const template = getTemplateForArtwork(art, selectedTemplates);

  if (template?.availableSizes && template.availableSizes.length > 0) {
    return template.availableSizes.map((opt: PrintSizeOption) => {
      const standardSize = PRINT_SIZES.find((s) => s.id === opt.id);
      const matchingPrices = template.pricing?.filter((p) => p.size === opt.id);
      const preferredPrice =
        matchingPrices?.find((p) => p.gsm === "250gsm") || matchingPrices?.[0];

      const priceNum = preferredPrice?.price || standardSize?.priceNum || 1299;
      const price = preferredPrice?.formattedPrice || standardSize?.price || `₹${priceNum.toLocaleString("en-IN")}`;

      return {
        id: opt.id,
        name: opt.name,
        dimensions: opt.dimensions,
        priceNum,
        price,
        isPopular: opt.id === "a2",
      };
    });
  }

  // Fallback if template has no availableSizes array
  return PRINT_SIZES.slice(0, 4).map((s) => ({
    id: s.id,
    name: s.label,
    dimensions: s.dimensions,
    priceNum: s.priceNum,
    price: s.price,
    isPopular: s.popular,
  }));
}

/**
 * Returns the best default size ID for an artwork (A2 if available, else first available).
 */
export function getDefaultSizeForArtwork(
  art: GeneratedArtwork,
  selectedTemplates: string[] = []
): string {
  const sizes = getAvailableSizesForArtwork(art, selectedTemplates);
  if (sizes.some((s) => s.id === "a2")) return "a2";
  if (sizes.some((s) => s.id === "a3")) return "a3";
  return sizes[0]?.id || "a2";
}
