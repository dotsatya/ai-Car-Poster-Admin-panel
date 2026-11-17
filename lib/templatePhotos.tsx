import {
  PrintSizeId,
  PaperGsmId,
  PrintSizeOption,
  PaperGsmOption,
  SizeGsmPrice,
  Template,
} from "@/types";

export type { PrintSizeId, PaperGsmId, PrintSizeOption, PaperGsmOption, SizeGsmPrice };

export const ALL_PRINT_SIZES: Record<PrintSizeId, PrintSizeOption> = {
  a4: {
    id: "a4",
    name: "A4",
    dimensions: "21.0 × 29.7 cm",
  },
  a3: {
    id: "a3",
    name: "A3",
    dimensions: "29.7 × 42.0 cm",
  },
  "12x18": {
    id: "12x18",
    name: "12 × 18 inches",
    dimensions: "30.5 × 45.7 cm (12 × 18\")",
  },
  a2: {
    id: "a2",
    name: "A2",
    dimensions: "42.0 × 59.4 cm",
  },
};

export const ALL_PAPER_GSM: Record<PaperGsmId, PaperGsmOption> = {
  "200gsm": {
    id: "200gsm",
    name: "200 GSM",
    label: "200 GSM Satin Finish",
  },
  "250gsm": {
    id: "250gsm",
    name: "250 GSM",
    label: "250 GSM Heavy Matte",
  },
  "300gsm": {
    id: "300gsm",
    name: "300 GSM",
    label: "300 GSM Museum Cotton Rag",
  },
};

export interface RawTemplatePhoto {
  id: number;
  name: string;
  slug: string;
  src: string;
  vehicle: string;
  category: string;
  tag: string;
  description: string;
}

export interface TemplatePhoto extends RawTemplatePhoto {
  availableSizes: PrintSizeOption[];
  availableGsm: PaperGsmOption[];
  pricing: SizeGsmPrice[];
  startingPrice: number;
  formattedStartingPrice: string;
}

interface TemplateConfig {
  basePrice: number;
  sizes: PrintSizeId[];
  gsms: PaperGsmId[];
}

// Deterministic combinations ensuring diverse sizes (1, 2, 3, or 4) and GSMs (1, 2, or 3)
const TEMPLATE_CONFIGS: Record<number, TemplateConfig> = {
  1: { basePrice: 499, sizes: ["a4", "a3", "12x18", "a2"], gsms: ["200gsm", "250gsm", "300gsm"] },
  2: { basePrice: 549, sizes: ["a3", "a2"], gsms: ["250gsm", "300gsm"] },
  3: { basePrice: 449, sizes: ["a3", "12x18"], gsms: ["200gsm", "250gsm"] },
  4: { basePrice: 499, sizes: ["a4", "a3", "12x18"], gsms: ["200gsm", "250gsm", "300gsm"] },
  5: { basePrice: 449, sizes: ["12x18"], gsms: ["250gsm", "300gsm"] },
  6: { basePrice: 599, sizes: ["a2"], gsms: ["300gsm"] },
  7: { basePrice: 549, sizes: ["a3", "12x18", "a2"], gsms: ["250gsm", "300gsm"] },
  8: { basePrice: 549, sizes: ["12x18", "a2"], gsms: ["250gsm", "300gsm"] },
  9: { basePrice: 449, sizes: ["a4", "a3", "12x18"], gsms: ["200gsm", "250gsm"] },
  10: { basePrice: 599, sizes: ["a4", "a3", "12x18", "a2"], gsms: ["200gsm", "250gsm", "300gsm"] },
  11: { basePrice: 599, sizes: ["a2"], gsms: ["300gsm"] },
  12: { basePrice: 499, sizes: ["a4", "a3", "a2"], gsms: ["200gsm", "250gsm", "300gsm"] },
  13: { basePrice: 449, sizes: ["a4", "a3"], gsms: ["200gsm", "250gsm", "300gsm"] },
  14: { basePrice: 449, sizes: ["a4", "a3", "12x18"], gsms: ["200gsm", "250gsm"] },
  15: { basePrice: 449, sizes: ["a3", "12x18"], gsms: ["200gsm", "250gsm"] },
  17: { basePrice: 499, sizes: ["a4", "a3", "a2"], gsms: ["200gsm", "250gsm", "300gsm"] },
  18: { basePrice: 549, sizes: ["12x18"], gsms: ["250gsm", "300gsm"] },
  19: { basePrice: 549, sizes: ["a4", "a3", "12x18", "a2"], gsms: ["200gsm", "250gsm", "300gsm"] },
  20: { basePrice: 449, sizes: ["a4", "a3"], gsms: ["200gsm", "250gsm"] },
  21: { basePrice: 499, sizes: ["a4", "a3", "12x18", "a2"], gsms: ["200gsm", "250gsm", "300gsm"] },
  22: { basePrice: 499, sizes: ["a3", "a2"], gsms: ["250gsm", "300gsm"] },
  23: { basePrice: 499, sizes: ["a3", "12x18", "a2"], gsms: ["250gsm", "300gsm"] },
  24: { basePrice: 499, sizes: ["a3"], gsms: ["250gsm"] },
  25: { basePrice: 449, sizes: ["a4", "a3", "a2"], gsms: ["200gsm", "250gsm"] },
  26: { basePrice: 549, sizes: ["12x18", "a2"], gsms: ["250gsm", "300gsm"] },
  27: { basePrice: 599, sizes: ["a4", "a3", "12x18", "a2"], gsms: ["200gsm", "250gsm", "300gsm"] },
  28: { basePrice: 449, sizes: ["a3", "12x18"], gsms: ["200gsm", "250gsm", "300gsm"] },
  29: { basePrice: 549, sizes: ["a3", "12x18", "a2"], gsms: ["250gsm", "300gsm"] },
  30: { basePrice: 549, sizes: ["a4", "a3", "12x18", "a2"], gsms: ["200gsm", "250gsm", "300gsm"] },
};

function buildPricingMatrix(
  basePrice: number,
  sizeIds: PrintSizeId[],
  gsmIds: PaperGsmId[]
): SizeGsmPrice[] {
  const sizeOffsets: Record<PrintSizeId, number> = {
    a4: 0,
    a3: 300,
    "12x18": 450,
    a2: 700,
  };

  const gsmOffsets: Record<PrintSizeId, Record<PaperGsmId, number>> = {
    a4: { "200gsm": 0, "250gsm": 100, "300gsm": 200 },
    a3: { "200gsm": 0, "250gsm": 100, "300gsm": 200 },
    "12x18": { "200gsm": 0, "250gsm": 150, "300gsm": 300 },
    a2: { "200gsm": 0, "250gsm": 200, "300gsm": 400 },
  };

  const matrix: SizeGsmPrice[] = [];
  for (const size of sizeIds) {
    for (const gsm of gsmIds) {
      const price = basePrice + sizeOffsets[size] + gsmOffsets[size][gsm];
      matrix.push({
        size,
        gsm,
        price,
        formattedPrice: `₹${price.toLocaleString("en-IN")}`,
      });
    }
  }
  return matrix;
}

function attachTemplateOptions(raw: RawTemplatePhoto): TemplatePhoto {
  const config = TEMPLATE_CONFIGS[raw.id] || {
    basePrice: 499,
    sizes: ["a4", "a3", "12x18", "a2"] as PrintSizeId[],
    gsms: ["200gsm", "250gsm", "300gsm"] as PaperGsmId[],
  };

  const availableSizes = config.sizes.map((s) => ALL_PRINT_SIZES[s]);
  const availableGsm = config.gsms.map((g) => ALL_PAPER_GSM[g]);
  const pricing = buildPricingMatrix(config.basePrice, config.sizes, config.gsms);
  const startingPrice = Math.min(...pricing.map((p) => p.price));
  const formattedStartingPrice = `₹${startingPrice.toLocaleString("en-IN")}`;

  return {
    ...raw,
    availableSizes,
    availableGsm,
    pricing,
    startingPrice,
    formattedStartingPrice,
  };
}

const RAW_TEMPLATE_PHOTOS: RawTemplatePhoto[] = [
  {
    id: 1,
    name: "Porsche 911 GT3 RS Minimalist Spec",
    slug: "porsche-911-gt3-rs-minimalist-spec",
    src: "/template photo/1.webp",
    vehicle: "Porsche 911 GT3 RS (992)",
    category: "Technical Spec",
    tag: "Most Popular",
    description: "Architectural white gallery poster featuring bold giant '911' backdrop typography, chassis specifications, and German engineering heritage badge.",
  },
  {
    id: 2,
    name: "Porsche 911 GT3 RS British Racing Green & Gold",
    slug: "porsche-911-gt3-rs-racing-green-gold",
    src: "/template photo/2.webp",
    vehicle: "Porsche 911 GT3 RS",
    category: "Heritage Racing",
    tag: "Collector's Pick",
    description: "Deep British racing green backdrop with distressed gold lettering, Porsche crest emblem, and white Weissach GT3 RS on gold magnesium wheels.",
  },
  {
    id: 3,
    name: "McLaren 720S Red Street Graffiti Edition",
    slug: "mclaren-720s-red-graffiti",
    src: "/template photo/3.webp",
    vehicle: "McLaren 720S",
    category: "Street Art & Graffiti",
    tag: "Trending",
    description: "Memphis red spray graffiti typography over a glossy 720S with dihedral doors raised in an industrial studio atelier setting.",
  },
  {
    id: 4,
    name: "Porsche 911 Turbo S Shark Blue Tokyo Cyber",
    slug: "porsche-911-turbo-s-shark-blue-cyber",
    src: "/template photo/4.webp",
    vehicle: "Porsche 911 Turbo S (992)",
    category: "Futuristic & Cyber",
    tag: "Trending",
    description: "Shark Blue 911 Turbo S with Japanese kanji calligraphy, gothic typography, barcodes, and vibrant cyan street posters aesthetic.",
  },
  {
    id: 5,
    name: "Ford Mustang GT350 Heritage Racing Stripe",
    slug: "ford-mustang-gt350-heritage-stripe",
    src: "/template photo/5.webp",
    vehicle: "Ford Mustang Shelby GT350",
    category: "Classic Muscle",
    tag: "Heritage",
    description: "Clean symmetrical front view of a classic Shelby Mustang in Grabber Blue with bold dual Wimbledon white racing stripes.",
  },
  {
    id: 6,
    name: "Pagani Zonda Obsidian Noir No. 17",
    slug: "pagani-zonda-obsidian-noir-17",
    src: "/template photo/6.webp",
    vehicle: "Pagani Zonda Trans Am",
    category: "Signature Luxury",
    tag: "Hypercar",
    description: "Low-key obsidian black hypercar portrait with giant subtle number 17 graphic and Italian artisan Pagani crest badge.",
  },
  {
    id: 7,
    name: "Porsche 992 GT3 RS Modern Minimalist Dual Stripe",
    slug: "porsche-992-gt3-rs-minimalist-stripe",
    src: "/template photo/7.webp",
    vehicle: "Porsche 911 GT3 RS",
    category: "Modern Gallery",
    tag: "Fine Art",
    description: "Contemporary architectural gallery composition in silver and chalk grey with clean twin vertical stripes and Swiss International typography.",
  },
  {
    id: 8,
    name: "Lamborghini Aventador SVJ Crimson Storm",
    slug: "lamborghini-aventador-svj-crimson-storm",
    src: "/template photo/8.webp",
    vehicle: "Lamborghini Aventador SVJ",
    category: "Fine Art",
    tag: "Artisan",
    description: "Dramatic oil-painting textured sunset with tempestuous crimson clouds reflecting over a stealth grey Aventador SVJ on wet tarmac.",
  },
  {
    id: 9,
    name: "Porsche GT3 RS Neon Pink Halo Graffiti",
    slug: "porsche-gt3-rs-neon-pink-graffiti",
    src: "/template photo/9.webp",
    vehicle: "Porsche 911 GT3 RS",
    category: "Street Art & Graffiti",
    tag: "Modern",
    description: "High-octane neon pink background with bright white halo spray calligraphy and white Weissach GT3 RS on bronze multi-piece wheels.",
  },
  {
    id: 10,
    name: "Bugatti Chiron Super Sport 300+ Quad Telemetry",
    slug: "bugatti-chiron-super-sport-300-plus",
    src: "/template photo/10.webp",
    vehicle: "Bugatti Chiron Super Sport 300+",
    category: "Technical Spec",
    tag: "300+ MPH Record",
    description: "Multi-panel architectural layout celebrating the 304.77 mph record with cockpit detail insets, orange racing livery, and telemetry data.",
  },
  {
    id: 11,
    name: "Ferrari F40 Atrium Architectural Sculpture",
    slug: "ferrari-f40-atrium-sculpture",
    src: "/template photo/11.webp",
    vehicle: "Ferrari F40",
    category: "Architectural & Iconic",
    tag: "Legend",
    description: "Cinematic gallery installation of an iconic white Ferrari F40 suspended in mid-air in a brutalist modern concrete museum atrium.",
  },
  {
    id: 12,
    name: "Porsche Carrera GT German Engineering Spec Sheet",
    slug: "porsche-carrera-gt-engineering-spec",
    src: "/template photo/12.webp",
    vehicle: "Porsche Carrera GT (2003)",
    category: "Technical Spec",
    tag: "V10 Purist",
    description: "Pure white museum spec sheet with GT Silver Carrera GT, natural aspiration 5.7L V10 telemetry, 6-speed manual callout, and Stuttgart crest.",
  },
  {
    id: 13,
    name: "Mazda RX-7 Veilside Tokyo Drift Han Edition",
    slug: "mazda-rx7-veilside-tokyo-drift",
    src: "/template photo/13.webp",
    vehicle: "Mazda RX-7 Veilside Fortune",
    category: "JDM Legends",
    tag: "Cinema Icon",
    description: "Sunset orange and black Veilside RX-7 tribute with Han (Sung Kang), distressed poster weathering, Japanese kanji drift graphics, and twin rotor specs.",
  },
  {
    id: 14,
    name: "Toyota GR Supra MK5 Sunburst Yellow",
    slug: "toyota-gr-supra-mk5-sunburst-yellow",
    src: "/template photo/14.webp",
    vehicle: "Toyota GR Supra MK5",
    category: "Modern JDM",
    tag: "Sport",
    description: "Sunburst yellow GR Supra with vertical condensed typography, roof detail insets, and Toyota Gazoo Racing badge.",
  },
  {
    id: 15,
    name: "Toyota GR Supra Crimson Red Adrenaline Poster",
    slug: "toyota-gr-supra-crimson-red",
    src: "/template photo/15.webp",
    vehicle: "Toyota GR Supra A90",
    category: "Modern JDM",
    tag: "Gazoo Racing",
    description: "Deep red asphalt poster featuring 'Built to Reignite the Thrill of Driving', barcode authentication, and oversized condensed block letters.",
  },
  {
    id: 17,
    name: "Toyota MK4 Supra 2JZ Fast & Furious Edition",
    slug: "toyota-mk4-supra-2jz-fast-and-furious",
    src: "/template photo/17.webp",
    vehicle: "Toyota Supra MK4 (JZA80)",
    category: "JDM Legends",
    tag: "Legend",
    description: "Iconic Lamborghini pearl orange MK4 Supra with gladiator side vinyl, twin turbo 2JZ-GTE specifications, and Tokyo night skyline backdrop.",
  },
  {
    id: 18,
    name: "Koenigsegg Jesko Absolut 1600HP Red Studio",
    slug: "koenigsegg-jesko-absolut-1600hp",
    src: "/template photo/18.webp",
    vehicle: "Koenigsegg Jesko Absolut",
    category: "Signature Luxury",
    tag: "Top Speed King",
    description: "Low-key dark studio with intense red vertical light pillars highlighting the 1600 HP Swedish hypercar and 531 km/h top speed dials.",
  },
  {
    id: 19,
    name: "Porsche GT3 RS 2022 Low-Key Matte Obsidian",
    slug: "porsche-gt3-rs-2022-matte-obsidian",
    src: "/template photo/19.webp",
    vehicle: "Porsche 911 GT3 RS",
    category: "Signature Luxury",
    tag: "Collector's Pick",
    description: "Matte dark anthracite canvas leaning against polished industrial concrete with rear diffuser perspective, 525 PS, and German flag badge.",
  },
  {
    id: 20,
    name: "Nissan 240SX Underground Rain Garage Spec",
    slug: "nissan-240sx-underground-rain-spec",
    src: "/template photo/20.webp",
    vehicle: "Nissan 240SX (1990)",
    category: "JDM Legends",
    tag: "Drift Icon",
    description: "Black S13 hatchback with glowing taillights in a rain-soaked underground industrial parking structure with silver Enkei wheels and JDM specs.",
  },
  {
    id: 21,
    name: "Nissan Skyline GTR R33 1000+ HP Dark Texture",
    slug: "nissan-skyline-gtr-r33-1000hp",
    src: "/template photo/21.webp",
    vehicle: "Nissan Skyline GT-R (BCNR33)",
    category: "JDM Legends",
    tag: "Godzilla",
    description: "Aggressive widebody R33 GT-R against dark crumpled silk texture with massive block 'GTR' lettering, RB26 single turbo telemetry, and 330+ km/h top speed.",
  },
  {
    id: 22,
    name: "Mercedes-AMG CLE 53 Triple Panel Showcase",
    slug: "mercedes-amg-cle-53-triple-panel",
    src: "/template photo/22.webp",
    vehicle: "Mercedes-AMG CLE 53 4MATIC+",
    category: "Modern Luxury",
    tag: "AMG Veloce",
    description: "Triple architectural vertical split panel featuring the Panamericana grille and sculpted matte graphite coupe profile.",
  },
  {
    id: 23,
    name: "BMW M4 G82 Competition Apex Edition",
    slug: "bmw-m4-g82-competition-apex",
    src: "/template photo/23.webp",
    vehicle: "BMW M4 G82 Competition",
    category: "Modern Motorsport",
    tag: "M Power",
    description: "Dramatic stormy cloudscape backdrop highlighting the bold vertical kidney grilles, 510 HP, 3.0L twin-turbo S58, and wet track reflections.",
  },
  {
    id: 24,
    name: "BMW M4 CSL One Life Just One Canvas",
    slug: "bmw-m4-csl-one-life-just-one",
    src: "/template photo/24.webp",
    vehicle: "BMW M4 CSL",
    category: "Motorsport & Track",
    tag: "Limited Run",
    description: "Landscape aspect poster featuring the Frozen Brooklyn Grey M4 CSL with red grille accents under dramatic moorland clouds: 'ONE LIFE. JUST ONE.'",
  },
  {
    id: 25,
    name: "Porsche 911 Turbo S Risograph Mesh Poster",
    slug: "porsche-911-turbo-s-risograph-mesh",
    src: "/template photo/25.webp",
    vehicle: "Porsche 911 Turbo S",
    category: "Technical Art",
    tag: "Fine Art",
    description: "Monochromatic black-and-white risograph layout with aerodynamic air-wireframe grid, multi-angle detail insets, and vintage Turbo S cursive logo.",
  },
  {
    id: 26,
    name: "Ferrari 812 GTS Golden Hour Checkered Courtyard",
    slug: "ferrari-812-gts-golden-hour",
    src: "/template photo/26.webp",
    vehicle: "Ferrari 812 GTS (2020)",
    category: "Signature Luxury",
    tag: "V12 Maranello",
    description: "Nero Daytona Ferrari 812 GTS resting on an Italian checkered marble terrace at sunset with the yellow Giallo Modena Ferrari crest and 799 CV telemetry.",
  },
  {
    id: 27,
    name: "McLaren P1 GTR London Street Golden Hour Spec",
    slug: "mclaren-p1-gtr-london-golden-hour",
    src: "/template photo/27.webp",
    vehicle: "McLaren P1 GTR (2015)",
    category: "Signature Luxury",
    tag: "Hypercar",
    description: "Ultra-rare road-legal McLaren P1 GTR parked outside a classic Mayfair London storefront with UK Union Jack telemetry and 1000 CV hybrid specs.",
  },
  {
    id: 28,
    name: "McLaren 720S Dynamic Red & White Speed Graphic",
    slug: "mclaren-720s-speed-graphic",
    src: "/template photo/28.webp",
    vehicle: "McLaren 720S",
    category: "Modern Motorsport",
    tag: "Speed Spec",
    description: "High-contrast dynamic diagonal split in Ferrari red, black, and white racing pattern with speed streaks across a stealth black 720S.",
  },
  {
    id: 29,
    name: "Koenigsegg Agera RS Thunderstorm Afterburner",
    slug: "koenigsegg-agera-rs-thunderstorm",
    src: "/template photo/29.webp",
    vehicle: "Koenigsegg Agera RS",
    category: "Hypercar",
    tag: "Record Breaker",
    description: "Swedish hypercar accelerating into a stormy electrical tempest with fiery afterburner exhaust flame trails and glowing orange wheel rings.",
  },
  {
    id: 30,
    name: "Lamborghini Huracán Tecnica Break The Rules Sunset",
    slug: "lamborghini-huracan-tecnica-break-the-rules",
    src: "/template photo/30.webp",
    vehicle: "Lamborghini Huracán Tecnica",
    category: "Signature Luxury",
    tag: "V10 Exotica",
    description: "Arancio Xanto orange Huracán Tecnica outside a modernist glass architectural villa at dusk with graffiti typography: 'BREAK THE RULES!'",
  },
];

export const TEMPLATE_PHOTOS: TemplatePhoto[] = RAW_TEMPLATE_PHOTOS.map(attachTemplateOptions);

export function getTemplatePhotoById(id: number): TemplatePhoto | undefined {
  return TEMPLATE_PHOTOS.find((p) => p.id === id);
}

export function getTemplatePhotoBySlug(slug: string): TemplatePhoto | undefined {
  return TEMPLATE_PHOTOS.find((p) => p.slug === slug);
}

export function getTemplatePrice(
  template: TemplatePhoto | Template,
  sizeId: PrintSizeId | string,
  gsmId: PaperGsmId | string
): SizeGsmPrice | undefined {
  return template.pricing?.find((p) => p.size === sizeId && p.gsm === gsmId);
}


