export const carSeedData = [
  {
    name: "Toyota Innova",
    slug: "toyota-innova",
    brand: "Toyota",
    type: "MPV",
    seatingCapacity: 7,
    ac: true,
    pricePerKm: 15,
    minBookingKm: 60,
    luggage: "4 medium bags",
    summary: "The most requested family and outstation touring car for Khajuraho and Panna routes.",
    description:
      "Toyota Innova is a trusted premium people mover for family temple visits, wedding movement, airport pickup, Panna trips, and outstation bookings. It offers strong comfort, luggage space, and road stability.",
    highlights: [
      "Best for 6 to 7 travelers",
      "Smooth suspension for long drives",
      "Spacious luggage capacity",
      "Preferred for temple and safari routes"
    ],
    images: [
      "/media/innova-1.svg",
      "/media/innova-2.svg",
      "/media/innova-3.svg"
    ],
    driverProfile: {
      name: "Raghav Tiwari",
      languages: ["Hindi", "English", "Bundeli"],
      experience: "8 years local and outstation touring",
      videoUrl: "",
      bio: "Raghav is known for punctual pickup, guest-friendly communication, and excellent route planning for temple circuits and Panna day trips."
    },
    featured: true
  },
  {
    name: "Maruti Ertiga",
    slug: "maruti-ertiga",
    brand: "Maruti Suzuki",
    type: "MUV",
    seatingCapacity: 6,
    ac: true,
    pricePerKm: 12,
    minBookingKm: 40,
    luggage: "3 medium bags",
    summary: "A balanced car for value-conscious families wanting reliable comfort and AC travel.",
    description:
      "Ertiga is an efficient and comfortable car for family visits, station transfer, hotel movement, and local sightseeing in Khajuraho. It offers excellent practical value for full-day bookings.",
    highlights: [
      "Budget-friendly family option",
      "Comfortable AC cabin",
      "Good for local temple circuits",
      "Ideal for 5 to 6 travelers"
    ],
    images: [
      "/media/ertiga-1.svg",
      "/media/ertiga-2.svg",
      "/media/ertiga-3.svg"
    ],
    driverProfile: {
      name: "Salim Khan",
      languages: ["Hindi", "English", "Urdu"],
      experience: "6 years guest transport and local tours",
      videoUrl: "",
      bio: "Salim is appreciated for polite guest handling, clear communication, and reliable local support for family travelers."
    },
    featured: true
  },
  {
    name: "Kia Seltos",
    slug: "kia-seltos",
    brand: "Kia",
    type: "SUV",
    seatingCapacity: 5,
    ac: true,
    pricePerKm: 14,
    minBookingKm: 40,
    luggage: "3 cabin bags",
    summary: "A stylish premium SUV for couples, business travelers, and upscale local bookings.",
    description:
      "Kia Seltos combines comfort, premium road feel, and clean interiors, making it a strong choice for airport pickup, heritage temple tours, and executive movement in Khajuraho.",
    highlights: [
      "Premium SUV experience",
      "Clean modern interiors",
      "Best for couples and executive rides",
      "Strong road presence"
    ],
    images: [
      "/media/seltos-1.svg",
      "/media/seltos-2.svg",
      "/media/seltos-3.svg"
    ],
    driverProfile: {
      name: "Ankit Dubey",
      languages: ["Hindi", "English"],
      experience: "5 years premium tourist transport",
      videoUrl: "",
      bio: "Ankit supports premium guest bookings, airport pickup, and business travel with calm service and route awareness."
    },
    featured: true
  },
  {
    name: "Scorpio N",
    slug: "scorpio-n",
    brand: "Mahindra",
    type: "SUV",
    seatingCapacity: 6,
    ac: true,
    pricePerKm: 16,
    minBookingKm: 50,
    luggage: "3 medium bags",
    summary: "A bold premium SUV for VIP movement, special guests, and rugged route comfort.",
    description:
      "Scorpio N is a standout choice for premium group movement, wedding guests, and tourists who prefer a stronger SUV stance while visiting Khajuraho and nearby destinations.",
    highlights: [
      "Excellent for VIP travel",
      "Powerful road presence",
      "Comfortable for mixed local and highway routes",
      "Ideal for 5 to 6 travelers"
    ],
    images: [
      "/media/scorpio-1.svg",
      "/media/scorpio-2.svg",
      "/media/scorpio-3.svg"
    ],
    driverProfile: {
      name: "Vikram Singh",
      languages: ["Hindi", "English", "Basic French phrases"],
      experience: "9 years tourism and premium guest handling",
      videoUrl: "",
      bio: "Vikram is valued for professional etiquette, multilingual guest support, and special-event transport coordination."
    },
    featured: true
  }
];

export const faqSeedData = [
  {
    question: "What areas do you cover?",
    answer: "We serve Khajuraho, Panna, Raneh Falls, Panna National Park, airport pickup, railway transfer, and custom outstation routes."
  },
  {
    question: "How is price calculated?",
    answer: "Price is calculated on per-kilometer basis with car-specific rates and a minimum billable kilometer policy."
  },
  {
    question: "Are drivers educated and multilingual?",
    answer: "Yes, our drivers are experienced, educated, and can communicate in Hindi, English, and helpful regional or guest-support languages."
  }
];

export const packageSeedData = [
  {
    name: "Khajuraho Local Tour",
    price: 2000,
    duration: "1 Day",
    includedKm: 80,
    extraPerKm: 12,
    description:
      "Ideal for temple sightseeing, hotel pickup, local market visits, and a complete one-day Khajuraho city circuit.",
    heroImage: "/media/travel-khajuraho.svg",
    ogImage: "/media/travel-khajuraho.svg",
    featured: true,
    bestSeller: true
  },
  {
    name: "Khajuraho → Bageshwar Dham",
    price: 3500,
    duration: "1 Day",
    includedKm: 0,
    extraPerKm: 12,
    description:
      "Same-day drop and return package for Bageshwar Dham travelers who want a comfortable full-day round trip.",
    heroImage: "/media/travel-raneh.svg",
    ogImage: "/media/travel-raneh.svg",
    featured: true,
    bestSeller: false
  },
  {
    name: "Khajuraho → Panna Tour",
    price: 4000,
    duration: "1 Day",
    includedKm: 150,
    extraPerKm: 12,
    description:
      "A complete one-day Panna package covering comfortable transfer, sightseeing movement, and flexible return timing.",
    heroImage: "/media/travel-panna.svg",
    ogImage: "/media/travel-panna.svg",
    featured: true,
    bestSeller: true
  }
];

export const blogSeedData = [
  {
    title: "Top places to visit in Khajuraho",
    excerpt:
      "Plan a smooth sightseeing day around the Western, Eastern, and Southern temple groups with practical taxi tips and timing suggestions.",
    description:
      "Explore the top places to visit in Khajuraho with taxi-friendly route planning, temple timings, and practical local travel advice.",
    keywords: [
      "top places to visit in Khajuraho",
      "Khajuraho sightseeing",
      "Khajuraho taxi service",
      "Khajuraho temple tour"
    ],
    heroImage: "/media/travel-khajuraho.svg",
    ogImage: "/media/travel-khajuraho.svg",
    publishedAt: "2026-03-18",
    status: "published",
    sections: [
      {
        heading: "Start with the Western Group of Temples",
        body:
          "Most travelers begin here because the best-known temple complex is compact, visually rich, and easy to cover with a hotel pickup and local cab. Morning visits are ideal for cooler weather, softer light, and cleaner photo opportunities."
      },
      {
        heading: "Add Eastern and Southern temples in one circuit",
        body:
          "A dedicated taxi makes it easier to combine multiple temple clusters, local markets, and lunch stops without relying on scattered transport. This is especially useful for families and same-day tourists arriving by flight or train."
      },
      {
        heading: "Finish with evening cultural plans",
        body:
          "Many guests pair temple sightseeing with the sound and light show, local dining, and a relaxed return to the hotel. Booking a local Khajuraho taxi for the full day keeps the route simple and avoids waiting gaps."
      }
    ]
  },
  {
    title: "Khajuraho to Panna travel guide",
    excerpt:
      "Everything tourists ask before booking a same-day or flexible return cab from Khajuraho to Panna and nearby safari points.",
    description:
      "Read a practical Khajuraho to Panna travel guide with taxi booking tips, route planning, sightseeing ideas, and fare clarity.",
    keywords: [
      "Khajuraho to Panna travel guide",
      "Khajuraho to Panna taxi",
      "Panna tour package",
      "Panna National Park taxi"
    ],
    heroImage: "/media/travel-panna.svg",
    ogImage: "/media/travel-panna.svg",
    publishedAt: "2026-03-24",
    status: "published",
    sections: [
      {
        heading: "Why travelers choose a dedicated cab",
        body:
          "Panna trips often include flexible start times, hotel pickups, photo stops, temple detours, and return planning. A dedicated cab from Khajuraho keeps the day comfortable and gives tourists more control than fragmented transport."
      },
      {
        heading: "Popular inclusions for a one-day route",
        body:
          "Guests usually combine Panna town, nearby viewpoints, and park-side movement when they want a full-day outing. Fixed packages help when travelers want clear pricing, while per-kilometer rides work well for custom plans."
      },
      {
        heading: "Best fit vehicles for the route",
        body:
          "Toyota Innova and Scorpio N are the most requested options for family and outstation comfort, while Ertiga works well for value-focused bookings. Kia Seltos suits couples and smaller premium transfers."
      }
    ]
  },
  {
    title: "Best taxi service in Khajuraho",
    excerpt:
      "How tourists choose the right local taxi service for airport pickup, temple circuits, multilingual drivers, and transparent fares.",
    description:
      "Learn what makes the best taxi service in Khajuraho for airport transfers, temple tours, local rides, and outstation bookings.",
    keywords: [
      "best taxi service in Khajuraho",
      "car rental in Khajuraho",
      "Khajuraho airport pickup",
      "Khajuraho cab booking"
    ],
    heroImage: "/media/travel-raneh.svg",
    ogImage: "/media/travel-raneh.svg",
    publishedAt: "2026-04-01",
    status: "published",
    sections: [
      {
        heading: "Look for route clarity and fare transparency",
        body:
          "Tourists want to understand what they are paying for before they confirm a ride. Clear per-kilometer pricing, package inclusions, and booking status updates remove confusion and build trust quickly."
      },
      {
        heading: "Driver quality matters more than brochures",
        body:
          "Educated drivers who can communicate in Hindi and English make sightseeing smoother, especially for first-time visitors. Local route knowledge also helps with hotel transfers, airport timing, and temple planning."
      },
      {
        heading: "Choose a service that supports both local and outstation plans",
        body:
          "Travelers often need more than one ride during a trip. A provider that handles local temple movement, Panna tours, and airport pickup from the same platform gives a more reliable overall experience."
      }
    ]
  }
];
