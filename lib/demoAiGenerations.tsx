export interface TimelineItem {
  time: string
  label: string
}

export interface AiGenerationJob {
  id: string
  cleanId: string
  customer: string
  customerId?: string
  template: string
  templates: string
  type: "Individual" | "Combined"
  state: "Completed" | "Processing" | "Failed" | "Queued"
  time: string
  customText?: string
  attempt: string
  carPhotoInfo: {
    fileName: string
    dimensions: string
    image?: string
  }
  outputInfo?: {
    image?: string
    dimensions?: string
  } | null
  error?: string | null
  timeline: TimelineItem[]
  customerUsage: {
    individualUsed: number
    individualTotal: number
    combinedUsed: number
    combinedTotal: number
  }
}

export interface AiGenerationStats {
  totalGenerations: number
  queued?: number
  processing: number
  completedToday: number
  failedToday: number
}

export const AI_STATS: AiGenerationStats = {
  totalGenerations: 2796,
  queued: 4,
  processing: 7,
  completedToday: 96,
  failedToday: 5,
}

export const DEMO_AI_JOBS: AiGenerationJob[] = [
  {
    id: "#G-8830",
    cleanId: "G-8830",
    customer: "s.roy@mail.com",
    customerId: "2",
    template: "Neon Night",
    templates: "Neon Night",
    customText: "Not used",
    type: "Individual",
    state: "Failed",
    time: "16 Nov 18:40",
    attempt: "2 of 3 allowed",
    carPhotoInfo: {
      fileName: "car-photo.jpg",
      dimensions: "4032 x 3024 px",
    },
    outputInfo: null,
    error: "Image provider rejected the request (content check). Customer was told to try a different photo.",
    timeline: [
      { time: "18:40:02", label: "Queued" },
      { time: "18:40:05", label: "Processing" },
      { time: "18:40:19", label: "Failed" },
      { time: "18:40:20", label: "Failure email sent" },
    ],
    customerUsage: {
      individualUsed: 9,
      individualTotal: 20,
      combinedUsed: 1,
      combinedTotal: 5,
    },
  },
  {
    id: "#G-8841",
    cleanId: "G-8841",
    customer: "a.khan@mail.com",
    customerId: "1",
    template: "Retro Racer",
    templates: "Retro Racer",
    customText: "Retro 911",
    type: "Individual",
    state: "Completed",
    time: "17 Nov 10:12",
    attempt: "1 of 3 allowed",
    carPhotoInfo: {
      fileName: "porsche-gt3.jpg",
      dimensions: "3840 x 2160 px",
      image: "/template photo/1.webp",
    },
    outputInfo: {
      image: "/template photo/1.webp",
      dimensions: "6000 x 8000 px",
    },
    error: null,
    timeline: [
      { time: "10:11:45", label: "Queued" },
      { time: "10:11:48", label: "Processing" },
      { time: "10:12:12", label: "Completed" },
      { time: "10:12:15", label: "High-res poster generated" },
    ],
    customerUsage: {
      individualUsed: 14,
      individualTotal: 20,
      combinedUsed: 3,
      combinedTotal: 5,
    },
  },
  {
    id: "#G-8842",
    cleanId: "G-8842",
    customer: "a.khan@mail.com",
    customerId: "1",
    template: "Retro Racer + Neon Night",
    templates: "Retro Racer + Neon Night",
    customText: "Not used",
    type: "Combined",
    state: "Processing",
    time: "17 Nov 10:14",
    attempt: "1 of 3 allowed",
    carPhotoInfo: {
      fileName: "dual-cars.jpg",
      dimensions: "4000 x 3000 px",
      image: "/template photo/13.webp",
    },
    outputInfo: null,
    error: null,
    timeline: [
      { time: "10:13:58", label: "Queued" },
      { time: "10:14:02", label: "Processing" },
    ],
    customerUsage: {
      individualUsed: 14,
      individualTotal: 20,
      combinedUsed: 3,
      combinedTotal: 5,
    },
  },
  {
    id: "#G-8843",
    cleanId: "G-8843",
    customer: "j.lee@mail.com",
    customerId: "3",
    template: "Clean Line",
    templates: "Clean Line",
    customText: "Not used",
    type: "Individual",
    state: "Queued",
    time: "17 Nov 10:15",
    attempt: "1 of 3 allowed",
    carPhotoInfo: {
      fileName: "bmw-m3.jpg",
      dimensions: "4032 x 3024 px",
    },
    outputInfo: null,
    error: null,
    timeline: [{ time: "10:15:00", label: "Queued" }],
    customerUsage: {
      individualUsed: 0,
      individualTotal: 20,
      combinedUsed: 0,
      combinedTotal: 5,
    },
  },
  {
    id: "#G-8840",
    cleanId: "G-8840",
    customer: "m.das@mail.com",
    customerId: "4",
    template: "Tokyo Drift Skyline",
    templates: "Tokyo Drift Skyline",
    customText: "Not used",
    type: "Individual",
    state: "Completed",
    time: "17 Nov 09:55",
    attempt: "1 of 3 allowed",
    carPhotoInfo: {
      fileName: "skyline-r34.jpg",
      dimensions: "3840 x 2160 px",
      image: "/template photo/4.webp",
    },
    outputInfo: {
      image: "/template photo/4.webp",
      dimensions: "6000 x 8000 px",
    },
    error: null,
    timeline: [
      { time: "09:54:30", label: "Queued" },
      { time: "09:54:35", label: "Processing" },
      { time: "09:55:00", label: "Completed" },
    ],
    customerUsage: {
      individualUsed: 20,
      individualTotal: 20,
      combinedUsed: 8,
      combinedTotal: 8,
    },
  },
  {
    id: "#G-8839",
    cleanId: "G-8839",
    customer: "l.vance@mail.com",
    customerId: "5",
    template: "Silverstone Legend",
    templates: "Silverstone Legend",
    customText: "Vance Spec",
    type: "Individual",
    state: "Completed",
    time: "17 Nov 09:30",
    attempt: "1 of 3 allowed",
    carPhotoInfo: {
      fileName: "aston-martin.jpg",
      dimensions: "4032 x 3024 px",
      image: "/template photo/5.webp",
    },
    outputInfo: {
      image: "/template photo/5.webp",
      dimensions: "6000 x 8000 px",
    },
    error: null,
    timeline: [
      { time: "09:29:40", label: "Queued" },
      { time: "09:29:45", label: "Processing" },
      { time: "09:30:10", label: "Completed" },
    ],
    customerUsage: {
      individualUsed: 8,
      individualTotal: 20,
      combinedUsed: 2,
      combinedTotal: 5,
    },
  },
  {
    id: "#G-8838",
    cleanId: "G-8838",
    customer: "t.ross@mail.com",
    customerId: "6",
    template: "Monza Historic 1967",
    templates: "Monza Historic 1967",
    customText: "Ross Racing",
    type: "Combined",
    state: "Completed",
    time: "17 Nov 09:12",
    attempt: "1 of 3 allowed",
    carPhotoInfo: {
      fileName: "ferrari-classic.jpg",
      dimensions: "4000 x 3000 px",
      image: "/template photo/6.webp",
    },
    outputInfo: {
      image: "/template photo/6.webp",
      dimensions: "6000 x 8000 px",
    },
    error: null,
    timeline: [
      { time: "09:11:30", label: "Queued" },
      { time: "09:11:35", label: "Processing" },
      { time: "09:12:00", label: "Completed" },
    ],
    customerUsage: {
      individualUsed: 12,
      individualTotal: 20,
      combinedUsed: 4,
      combinedTotal: 5,
    },
  },
  {
    id: "#G-8837",
    cleanId: "G-8837",
    customer: "c.martin@mail.com",
    customerId: "7",
    template: "Retro Racer",
    templates: "Retro Racer",
    customText: "Not used",
    type: "Individual",
    state: "Completed",
    time: "17 Nov 08:45",
    attempt: "1 of 3 allowed",
    carPhotoInfo: {
      fileName: "vintage-porsche.jpg",
      dimensions: "3840 x 2160 px",
      image: "/template photo/1.webp",
    },
    outputInfo: {
      image: "/template photo/1.webp",
      dimensions: "6000 x 8000 px",
    },
    error: null,
    timeline: [
      { time: "08:44:20", label: "Queued" },
      { time: "08:44:25", label: "Processing" },
      { time: "08:45:00", label: "Completed" },
    ],
    customerUsage: {
      individualUsed: 3,
      individualTotal: 20,
      combinedUsed: 0,
      combinedTotal: 5,
    },
  },
  {
    id: "#G-8836",
    cleanId: "G-8836",
    customer: "e.drake@mail.com",
    customerId: "8",
    template: "Apex Predator GT3",
    templates: "Apex Predator GT3",
    customText: "Not used",
    type: "Combined",
    state: "Processing",
    time: "17 Nov 08:20",
    attempt: "1 of 3 allowed",
    carPhotoInfo: {
      fileName: "corvette-c8.jpg",
      dimensions: "4032 x 3024 px",
      image: "/template photo/8.webp",
    },
    outputInfo: null,
    error: null,
    timeline: [
      { time: "08:19:50", label: "Queued" },
      { time: "08:20:00", label: "Processing" },
    ],
    customerUsage: {
      individualUsed: 19,
      individualTotal: 20,
      combinedUsed: 5,
      combinedTotal: 5,
    },
  },
  {
    id: "#G-8835",
    cleanId: "G-8835",
    customer: "o.brooks@mail.com",
    customerId: "9",
    template: "Neon Night",
    templates: "Neon Night",
    customText: "Not used",
    type: "Individual",
    state: "Completed",
    time: "17 Nov 07:55",
    attempt: "1 of 3 allowed",
    carPhotoInfo: {
      fileName: "miata-na.jpg",
      dimensions: "3840 x 2160 px",
      image: "/template photo/4.webp",
    },
    outputInfo: {
      image: "/template photo/4.webp",
      dimensions: "6000 x 8000 px",
    },
    error: null,
    timeline: [
      { time: "07:54:30", label: "Queued" },
      { time: "07:54:35", label: "Processing" },
      { time: "07:55:00", label: "Completed" },
    ],
    customerUsage: {
      individualUsed: 2,
      individualTotal: 20,
      combinedUsed: 0,
      combinedTotal: 5,
    },
  },
  {
    id: "#G-8834",
    cleanId: "G-8834",
    customer: "a.morales@mail.com",
    customerId: "11",
    template: "Porsche 911 GT3 RS Minimalist Spec",
    templates: "Porsche 911 GT3 RS Minimalist Spec",
    customText: "Not used",
    type: "Individual",
    state: "Completed",
    time: "17 Nov 07:30",
    attempt: "1 of 3 allowed",
    carPhotoInfo: {
      fileName: "911-gt3rs.jpg",
      dimensions: "4032 x 3024 px",
      image: "/template photo/2.webp",
    },
    outputInfo: {
      image: "/template photo/2.webp",
      dimensions: "6000 x 8000 px",
    },
    error: null,
    timeline: [
      { time: "07:29:20", label: "Queued" },
      { time: "07:29:25", label: "Processing" },
      { time: "07:30:00", label: "Completed" },
    ],
    customerUsage: {
      individualUsed: 7,
      individualTotal: 20,
      combinedUsed: 1,
      combinedTotal: 5,
    },
  },
  {
    id: "#G-8833",
    cleanId: "G-8833",
    customer: "j.hayes@mail.com",
    customerId: "12",
    template: "Dark Knight GT + Retro Racer",
    templates: "Dark Knight GT + Retro Racer",
    customText: "Hayes Garage",
    type: "Combined",
    state: "Completed",
    time: "16 Nov 23:10",
    attempt: "1 of 3 allowed",
    carPhotoInfo: {
      fileName: "mercedes-amg.jpg",
      dimensions: "4000 x 3000 px",
      image: "/template photo/12.webp",
    },
    outputInfo: {
      image: "/template photo/12.webp",
      dimensions: "6000 x 8000 px",
    },
    error: null,
    timeline: [
      { time: "23:09:30", label: "Queued" },
      { time: "23:09:35", label: "Processing" },
      { time: "23:10:00", label: "Completed" },
    ],
    customerUsage: {
      individualUsed: 18,
      individualTotal: 20,
      combinedUsed: 6,
      combinedTotal: 6,
    },
  },
  {
    id: "#G-8832",
    cleanId: "G-8832",
    customer: "c.bennett@mail.com",
    customerId: "13",
    template: "Vintage Monza Sprint",
    templates: "Vintage Monza Sprint",
    customText: "Not used",
    type: "Individual",
    state: "Completed",
    time: "16 Nov 22:40",
    attempt: "1 of 3 allowed",
    carPhotoInfo: {
      fileName: "alfa-romeo.jpg",
      dimensions: "3840 x 2160 px",
      image: "/template photo/11.webp",
    },
    outputInfo: {
      image: "/template photo/11.webp",
      dimensions: "6000 x 8000 px",
    },
    error: null,
    timeline: [
      { time: "22:39:20", label: "Queued" },
      { time: "22:39:25", label: "Processing" },
      { time: "22:40:00", label: "Completed" },
    ],
    customerUsage: {
      individualUsed: 4,
      individualTotal: 20,
      combinedUsed: 1,
      combinedTotal: 5,
    },
  },
  {
    id: "#G-8831",
    cleanId: "G-8831",
    customer: "l.miller@mail.com",
    customerId: "14",
    template: "Midnight Turbo 911",
    templates: "Midnight Turbo 911",
    customText: "Not used",
    type: "Individual",
    state: "Failed",
    time: "16 Nov 21:15",
    attempt: "3 of 3 allowed",
    carPhotoInfo: {
      fileName: "damaged-car.jpg",
      dimensions: "4032 x 3024 px",
    },
    outputInfo: null,
    error: "Vehicle detection model could not identify chassis orientation with confidence > 85%.",
    timeline: [
      { time: "21:14:40", label: "Queued" },
      { time: "21:14:45", label: "Processing" },
      { time: "21:15:10", label: "Failed" },
      { time: "21:15:12", label: "Failure email sent" },
    ],
    customerUsage: {
      individualUsed: 11,
      individualTotal: 20,
      combinedUsed: 3,
      combinedTotal: 5,
    },
  },
  {
    id: "#G-8829",
    cleanId: "G-8829",
    customer: "n.coleman@mail.com",
    customerId: "16",
    template: "Cyberpunk Neon Phantom",
    templates: "Cyberpunk Neon Phantom",
    customText: "Night City 2077",
    type: "Combined",
    state: "Completed",
    time: "16 Nov 17:35",
    attempt: "1 of 3 allowed",
    carPhotoInfo: {
      fileName: "cyber-gtr.jpg",
      dimensions: "3840 x 2160 px",
      image: "/template photo/14.webp",
    },
    outputInfo: {
      image: "/template photo/14.webp",
      dimensions: "6000 x 8000 px",
    },
    error: null,
    timeline: [
      { time: "17:34:20", label: "Queued" },
      { time: "17:34:25", label: "Processing" },
      { time: "17:35:00", label: "Completed" },
    ],
    customerUsage: {
      individualUsed: 9,
      individualTotal: 20,
      combinedUsed: 2,
      combinedTotal: 5,
    },
  },
  {
    id: "#G-8828",
    cleanId: "G-8828",
    customer: "d.ward@mail.com",
    customerId: "17",
    template: "Heritage Carrera RS",
    templates: "Heritage Carrera RS",
    customText: "Not used",
    type: "Individual",
    state: "Completed",
    time: "16 Nov 16:50",
    attempt: "1 of 3 allowed",
    carPhotoInfo: {
      fileName: "carrera-rs.jpg",
      dimensions: "4032 x 3024 px",
      image: "/template photo/15.webp",
    },
    outputInfo: {
      image: "/template photo/15.webp",
      dimensions: "6000 x 8000 px",
    },
    error: null,
    timeline: [
      { time: "16:49:15", label: "Queued" },
      { time: "16:49:20", label: "Processing" },
      { time: "16:50:00", label: "Completed" },
    ],
    customerUsage: {
      individualUsed: 16,
      individualTotal: 20,
      combinedUsed: 4,
      combinedTotal: 5,
    },
  },
  {
    id: "#G-8827",
    cleanId: "G-8827",
    customer: "h.davis@mail.com",
    customerId: "18",
    template: "Retro Racer",
    templates: "Retro Racer",
    customText: "Davis Spec",
    type: "Individual",
    state: "Completed",
    time: "16 Nov 15:20",
    attempt: "1 of 3 allowed",
    carPhotoInfo: {
      fileName: "classic-911.jpg",
      dimensions: "3840 x 2160 px",
      image: "/template photo/1.webp",
    },
    outputInfo: {
      image: "/template photo/1.webp",
      dimensions: "6000 x 8000 px",
    },
    error: null,
    timeline: [
      { time: "15:19:20", label: "Queued" },
      { time: "15:19:25", label: "Processing" },
      { time: "15:20:00", label: "Completed" },
    ],
    customerUsage: {
      individualUsed: 6,
      individualTotal: 20,
      combinedUsed: 1,
      combinedTotal: 5,
    },
  },
  {
    id: "#G-8826",
    cleanId: "G-8826",
    customer: "a.ramirez@mail.com",
    customerId: "19",
    template: "Agera RS Thunderstorm",
    templates: "Agera RS Thunderstorm",
    customText: "Record Breaker",
    type: "Combined",
    state: "Completed",
    time: "16 Nov 14:05",
    attempt: "1 of 3 allowed",
    carPhotoInfo: {
      fileName: "agera-rs.jpg",
      dimensions: "4000 x 3000 px",
      image: "/template photo/29.webp",
    },
    outputInfo: {
      image: "/template photo/29.webp",
      dimensions: "6000 x 8000 px",
    },
    error: null,
    timeline: [
      { time: "14:04:10", label: "Queued" },
      { time: "14:04:15", label: "Processing" },
      { time: "14:05:00", label: "Completed" },
    ],
    customerUsage: {
      individualUsed: 20,
      individualTotal: 20,
      combinedUsed: 7,
      combinedTotal: 7,
    },
  },
  {
    id: "#G-8825",
    cleanId: "G-8825",
    customer: "i.rossi@mail.com",
    customerId: "20",
    template: "Huracán Tecnica Sunset",
    templates: "Huracán Tecnica Sunset",
    customText: "Break The Rules",
    type: "Individual",
    state: "Completed",
    time: "16 Nov 13:40",
    attempt: "1 of 3 allowed",
    carPhotoInfo: {
      fileName: "huracan.jpg",
      dimensions: "3840 x 2160 px",
      image: "/template photo/30.webp",
    },
    outputInfo: {
      image: "/template photo/30.webp",
      dimensions: "6000 x 8000 px",
    },
    error: null,
    timeline: [
      { time: "13:39:15", label: "Queued" },
      { time: "13:39:20", label: "Processing" },
      { time: "13:40:00", label: "Completed" },
    ],
    customerUsage: {
      individualUsed: 18,
      individualTotal: 20,
      combinedUsed: 5,
      combinedTotal: 5,
    },
  },
  {
    id: "#G-8824",
    cleanId: "G-8824",
    customer: "c.foster@mail.com",
    customerId: "21",
    template: "Clean Line Spec",
    templates: "Clean Line Spec",
    customText: "Not used",
    type: "Individual",
    state: "Queued",
    time: "16 Nov 12:15",
    attempt: "1 of 3 allowed",
    carPhotoInfo: {
      fileName: "supra.jpg",
      dimensions: "4032 x 3024 px",
    },
    outputInfo: null,
    error: null,
    timeline: [{ time: "12:15:00", label: "Queued" }],
    customerUsage: {
      individualUsed: 3,
      individualTotal: 20,
      combinedUsed: 0,
      combinedTotal: 5,
    },
  },
  {
    id: "#G-8823",
    cleanId: "G-8823",
    customer: "s.price@mail.com",
    customerId: "22",
    template: "Le Mans Night Racer",
    templates: "Le Mans Night Racer",
    customText: "Price Collection",
    type: "Combined",
    state: "Completed",
    time: "16 Nov 11:30",
    attempt: "1 of 3 allowed",
    carPhotoInfo: {
      fileName: "ford-gt.jpg",
      dimensions: "4000 x 3000 px",
      image: "/template photo/18.webp",
    },
    outputInfo: {
      image: "/template photo/18.webp",
      dimensions: "6000 x 8000 px",
    },
    error: null,
    timeline: [
      { time: "11:29:20", label: "Queued" },
      { time: "11:29:25", label: "Processing" },
      { time: "11:30:00", label: "Completed" },
    ],
    customerUsage: {
      individualUsed: 10,
      individualTotal: 20,
      combinedUsed: 2,
      combinedTotal: 5,
    },
  },
  {
    id: "#G-8822",
    cleanId: "G-8822",
    customer: "sophia.chen@example.com",
    customerId: "23",
    template: "Supra Turbo Spec",
    templates: "Supra Turbo Spec",
    customText: "Not used",
    type: "Individual",
    state: "Completed",
    time: "16 Nov 10:45",
    attempt: "1 of 3 allowed",
    carPhotoInfo: {
      fileName: "mk4-supra.jpg",
      dimensions: "3840 x 2160 px",
      image: "/template photo/19.webp",
    },
    outputInfo: {
      image: "/template photo/19.webp",
      dimensions: "6000 x 8000 px",
    },
    error: null,
    timeline: [
      { time: "10:44:15", label: "Queued" },
      { time: "10:44:20", label: "Processing" },
      { time: "10:45:00", label: "Completed" },
    ],
    customerUsage: {
      individualUsed: 15,
      individualTotal: 20,
      combinedUsed: 4,
      combinedTotal: 5,
    },
  },
  {
    id: "#G-8821",
    cleanId: "G-8821",
    customer: "e.rostova@example.com",
    customerId: "24",
    template: "Countach Synthwave",
    templates: "Countach Synthwave",
    customText: "Synthwave Sunset",
    type: "Individual",
    state: "Completed",
    time: "16 Nov 09:20",
    attempt: "1 of 3 allowed",
    carPhotoInfo: {
      fileName: "countach-lp500.jpg",
      dimensions: "4032 x 3024 px",
      image: "/template photo/20.webp",
    },
    outputInfo: {
      image: "/template photo/20.webp",
      dimensions: "6000 x 8000 px",
    },
    error: null,
    timeline: [
      { time: "09:19:20", label: "Queued" },
      { time: "09:19:25", label: "Processing" },
      { time: "09:20:00", label: "Completed" },
    ],
    customerUsage: {
      individualUsed: 7,
      individualTotal: 20,
      combinedUsed: 2,
      combinedTotal: 5,
    },
  },
]

export function getDemoAiJobById(idOrCleanId: string): AiGenerationJob | undefined {
  const q = idOrCleanId.toLowerCase().replace(/^#/, "").trim()
  return DEMO_AI_JOBS.find(
    (j) =>
      j.id.toLowerCase().replace(/^#/, "").trim() === q ||
      j.cleanId.toLowerCase().trim() === q
  )
}
