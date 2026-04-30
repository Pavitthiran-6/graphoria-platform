import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://gqurrylkhkkffruevioz.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdxdXJyeWxraGtrZmZydWV2aW96Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzczNjM1NjEsImV4cCI6MjA5MjkzOTU2MX0.2WalDFVZINk6JyvPRrLqLvUyYDNfB3uAgQ0KaVwQxUU';

const supabase = createClient(supabaseUrl, supabaseKey);

const projects = [
  {
    slug: "zenith-brand-identity",
    category: "Branding",
    cover_image: "https://images.unsplash.com/photo-1626785774573-4b799315345d?q=80&w=2071&auto=format&fit=crop",
    cover_title: "Zenith Brand Identity",
    cover_description: "A futuristic visual system for a high-tech aerospace startup.",
    cover_tags: ["Branding", "Identity", "Minimalism"],
    title: "Zenith: Reimagining the Future of Space Travel",
    description: "Zenith is an aerospace startup focused on commercial space travel. They needed a brand identity that felt both futuristic and accessible.",
    client: "Zenith Aerospace",
    problem: "The aerospace industry is often seen as cold and unreachable. Zenith wanted to break this mold with a warm yet high-tech identity.",
    goals: ["Create a memorable logo symbol", "Develop a cohesive color palette", "Design all brand touchpoints"],
    approach: {
      research: "We analyzed the visual history of space travel and identified a gap in friendly, modern aerospace branding.",
      direction: "The 'Celestial Minimalist' direction was chosen, focusing on simple geometric forms and deep blues with neon accents.",
      execution: "We crafted a logo inspired by planetary alignment and applied it across web, print, and interior signage."
    },
    images: [
      "https://images.unsplash.com/photo-1626785774573-4b799315345d?q=80&w=2071&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1634942537034-2531766767d1?q=80&w=2070&auto=format&fit=crop"
    ],
    results: {
      impact: "Successfully secured $20M in Series A funding following the rebrand.",
      brand_improvement: "Brand recognition increased by 45% in the first quarter.",
      positioning: "Positioned as the most consumer-friendly space travel brand."
    }
  },
  {
    slug: "lumina-skincare-packaging",
    category: "Packaging",
    cover_image: "https://images.unsplash.com/photo-1556229010-6c3f2c9ca5f8?q=80&w=2070&auto=format&fit=crop",
    cover_title: "Lumina Premium Skincare",
    cover_description: "Elegant and sustainable packaging for a luxury skincare line.",
    cover_tags: ["Packaging", "Sustainable", "Luxury"],
    title: "Lumina: Sustainable Elegance in Beauty",
    description: "Lumina is a premium skincare brand that prioritizes organic ingredients and zero-waste packaging.",
    client: "Lumina Botanicals",
    problem: "Luxury skincare often relies on heavy plastics and excessive waste. Lumina needed a way to feel premium while remaining eco-conscious.",
    goals: ["Design 100% recyclable glass containers", "Use soy-based inks for printing", "Maintain a high-end shelf presence"],
    approach: {
      research: "Investigated sustainable materials that maintain structural integrity and premium feel.",
      direction: "Minimalist apothecary style with frosted glass and embossed recycled paper.",
      execution: "Production of a modular packaging system that reduces shipping waste by 30%."
    },
    images: [
      "https://images.unsplash.com/photo-1556229010-6c3f2c9ca5f8?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1612817288484-6f916006741a?q=80&w=2070&auto=format&fit=crop"
    ],
    results: {
      impact: "Reduced overall plastic usage by 95% across the product line.",
      brand_improvement: "Won the 'Eco-Design Excellence' award 2025.",
      positioning: "Established Lumina as a leader in sustainable luxury."
    }
  },
  {
    slug: "neon-nights-festival",
    category: "Posters",
    cover_image: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=2070&auto=format&fit=crop",
    cover_title: "Neon Nights Music Festival",
    cover_description: "A vibrant series of posters for an underground electronic music event.",
    cover_tags: ["Posters", "Typography", "Events"],
    title: "Neon Nights: Visualizing Sound and Light",
    description: "Neon Nights is a boutique music festival celebrating the intersection of electronic music and digital art.",
    client: "Pulse Events",
    problem: "The festival needed a visual language that felt as high-energy and experimental as the music itself.",
    goals: ["Design a series of 10 unique posters", "Incorporate kinetic typography", "Create a digital-first campaign"],
    approach: {
      research: "Studied early rave culture and modern digital glitch aesthetics.",
      direction: "High-contrast neon palettes with distorted, layered typography.",
      execution: "Custom 3D type treatments and generative patterns that react to audio frequencies."
    },
    images: [
      "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1514525253361-bee8718a74a2?q=80&w=1964&auto=format&fit=crop"
    ],
    results: {
      impact: "Sold out festival tickets in record time (under 4 hours).",
      brand_improvement: "Festival posters became a sought-after collectible item.",
      positioning: "Defined the visual standard for future electronic music events."
    }
  },
  {
    slug: "vortex-fintech-app",
    category: "Websites & UI Design",
    cover_image: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?q=80&w=1974&auto=format&fit=crop",
    cover_title: "Vortex Fintech Platform",
    cover_description: "A dark-themed investment dashboard with real-time data visualization.",
    cover_tags: ["UI Design", "Fintech", "Product"],
    title: "Vortex: Empowering the Modern Investor",
    description: "Vortex is a next-generation investment platform designed for clarity and speed.",
    client: "Vortex Labs",
    problem: "Financial apps are often cluttered and intimidating for new users. Vortex needed to simplify complex data.",
    goals: ["Design an intuitive mobile dashboard", "Create clear data visualizations", "Optimize for low-latency updates"],
    approach: {
      research: "User testing with both expert and novice investors to identify pain points in data analysis.",
      direction: "Dark mode interface with vibrant primary colors for key actions and data points.",
      execution: "Development of a custom design system with over 200 responsive components."
    },
    images: [
      "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?q=80&w=1974&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop"
    ],
    results: {
      impact: "User retention increased by 60% compared to the previous version.",
      brand_improvement: "Rated #1 Best UI/UX in Fintech by Design Weekly.",
      positioning: "Standardized the 'simplified-pro' aesthetic in investment apps."
    }
  },
  {
    slug: "ethos-organic-tea",
    category: "Packaging",
    cover_image: "https://images.unsplash.com/photo-1594631252845-29fc458631b6?q=80&w=1974&auto=format&fit=crop",
    cover_title: "Ethos Organic Tea",
    cover_description: "Artisanal tea packaging using hand-drawn botanical illustrations.",
    cover_tags: ["Packaging", "Illustration", "Organic"],
    title: "Ethos: Bringing Nature to the Tea Experience",
    description: "Ethos is a premium tea brand that sources unique blends from small-scale organic farms.",
    client: "Ethos Tea Co.",
    problem: "The tea market is saturated with generic branding. Ethos needed to highlight its artisanal and ethical roots.",
    goals: ["Create unique illustrations for each blend", "Use biodegradable tea bags and tins", "Tell the story of the farmers"],
    approach: {
      research: "Studied traditional botanical drawings and woodblock printing techniques.",
      direction: "Earth-toned palette with detailed hand-drawn sketches of tea leaves and flowers.",
      execution: "Printed on uncoated textured paper to enhance the tactile experience."
    },
    images: [
      "https://images.unsplash.com/photo-1594631252845-29fc458631b6?q=80&w=1974&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1563911191283-d48ae4721a80?q=80&w=2070&auto=format&fit=crop"
    ],
    results: {
      impact: "Direct-to-consumer sales grew by 120% in the first 6 months.",
      brand_improvement: "Successfully expanded into high-end retail boutiques.",
      positioning: "Perceived as the most authentic artisanal tea brand."
    }
  },
  {
    slug: "nova-space-agency",
    category: "Branding",
    cover_image: "https://images.unsplash.com/photo-1614728263952-84ea206f99b6?q=80&w=1974&auto=format&fit=crop",
    cover_title: "Nova Space Agency",
    cover_description: "A bold and inspiring identity for a European satellite launch company.",
    cover_tags: ["Branding", "Corporate", "Aerospace"],
    title: "Nova: Launching the Next Generation of Exploration",
    description: "Nova specializes in putting research satellites into orbit with unprecedented precision.",
    client: "Nova Space",
    problem: "Their existing brand looked dated and failed to represent the precision of their engineering.",
    goals: ["Refined logo that suggests motion and accuracy", "Comprehensive brand guidelines", "Livery design for rockets"],
    approach: {
      research: "Analysis of aerodynamic shapes and technical blueprints.",
      direction: "Clean, architectural typography with a sharp, vector-based icon system.",
      execution: "Deployment of identity across physical assets and a digital-first communication strategy."
    },
    images: [
      "https://images.unsplash.com/photo-1614728263952-84ea206f99b6?q=80&w=1974&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1517976487492-5750f3195933?q=80&w=2070&auto=format&fit=crop"
    ],
    results: {
      impact: "Increased partnership inquiries from major research institutions by 30%.",
      brand_improvement: "New brand identity adopted with 100% internal alignment.",
      positioning: "Modernized the image of European aerospace."
    }
  },
  {
    slug: "cyber-city-2077",
    category: "Posters",
    cover_image: "https://images.unsplash.com/photo-1614850523296-e8c0a0631248?q=80&w=2070&auto=format&fit=crop",
    cover_title: "Cyber City 2077 Expo",
    cover_description: "Futuristic exhibition posters using isometric grid layouts.",
    cover_tags: ["Posters", "3D", "Cyberpunk"],
    title: "Cyber City: Visualizing the Urban Future",
    description: "An art exhibition exploring the architecture and lifestyle of future mega-cities.",
    client: "Neo Arts Foundation",
    problem: "The expo needed a visual hook that felt technical yet artistic to attract architects and digital artists.",
    goals: ["Large-format street posters", "Digital billboard animations", "Limited edition print series"],
    approach: {
      research: "Exploration of architectural renders and futuristic city planning concepts.",
      direction: "Blueprint-inspired layouts with glowing neon structural lines.",
      execution: "Combination of 3D modeling and 2D graphic overlays for a layered, deep effect."
    },
    images: [
      "https://images.unsplash.com/photo-1614850523296-e8c0a0631248?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1545156521-77bd85671d30?q=80&w=2070&auto=format&fit=crop"
    ],
    results: {
      impact: "Record-breaking attendance for the foundation's exhibition series.",
      brand_improvement: "Poster series won 'Best Event Visual' at the City Design Awards.",
      positioning: "Established the foundation as a hub for speculative design."
    }
  },
  {
    slug: "flux-ecommerce",
    category: "Websites & UI Design",
    cover_image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2015&auto=format&fit=crop",
    cover_title: "Flux Luxury E-commerce",
    cover_description: "A minimal and high-performance store for an independent fashion label.",
    cover_tags: ["UI Design", "E-commerce", "Fashion"],
    title: "Flux: A Seamless Shopping Journey",
    description: "Flux is an independent fashion house focused on sustainable, high-end apparel.",
    client: "Flux Studio",
    problem: "Their previous store was slow and didn't reflect the high quality of their products.",
    goals: ["Ultra-fast loading times", "Mobile-first shopping experience", "Minimal checkout process"],
    approach: {
      research: "Shopping behavior analysis showing high cart abandonment on mobile.",
      direction: "Clean, whitespace-heavy design with high-quality editorial photography.",
      execution: "Custom Next.js storefront integrated with a headless CMS for content agility."
    },
    images: [
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2015&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2070&auto=format&fit=crop"
    ],
    results: {
      impact: "Conversion rate increased by 2.4% within the first month.",
      brand_improvement: "Bounce rate on product pages dropped by 40%.",
      positioning: "Defined Flux as a digitally mature fashion brand."
    }
  },
  {
    slug: "apex-sportswear",
    category: "Branding",
    cover_image: "https://images.unsplash.com/photo-1541339907198-e08756ebafe3?q=80&w=2070&auto=format&fit=crop",
    cover_title: "Apex Sportswear",
    cover_description: "Dynamic and aggressive branding for a high-performance activewear line.",
    cover_tags: ["Branding", "Sports", "Energy"],
    title: "Apex: Reach Your Absolute Peak",
    description: "Apex creates technical apparel for elite endurance athletes.",
    client: "Apex Performance",
    problem: "Existing branding felt too similar to mass-market sportswear and lacked an 'elite' edge.",
    goals: ["Aggressive, forward-leaning logo", "High-visibility color system", "Durable application for fabric"],
    approach: {
      research: "Analyzed the visual cues of speed and power in nature (cheetahs, lightning).",
      direction: "Sharp angles, italicized typography, and a 'Volt' green primary color.",
      execution: "Development of a mark that remains legible even when distorted on moving fabrics."
    },
    images: [
      "https://images.unsplash.com/photo-1541339907198-e08756ebafe3?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070&auto=format&fit=crop"
    ],
    results: {
      impact: "New collection saw a 200% increase in pre-orders compared to previous launches.",
      brand_improvement: "Secured sponsorship deals with 5 Olympic-level athletes.",
      positioning: "The definitive brand for high-performance endurance gear."
    }
  },
  {
    slug: "mesa-coffee-co",
    category: "Packaging",
    cover_image: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?q=80&w=2070&auto=format&fit=crop",
    cover_title: "Mesa Specialty Coffee",
    cover_description: "Eco-friendly coffee packaging with vibrant topographic patterns.",
    cover_tags: ["Packaging", "Coffee", "Graphic"],
    title: "Mesa: From Peak to Cup",
    description: "Mesa specializes in high-altitude specialty beans from South America.",
    client: "Mesa Coffee Roasters",
    problem: "The coffee market is overwhelmed with kraft-paper-and-black branding. Mesa needed to stand out on the shelf.",
    goals: ["Represent the origin altitude of each bean", "Ensure long-lasting freshness", "Use 100% compostable bags"],
    approach: {
      research: "Topographic maps of the regions where Mesa beans are grown.",
      direction: "Colorful, abstract topographic patterns that wrap around the bag.",
      execution: "Digital printing on matte bio-plastic with metallic ink highlights."
    },
    images: [
      "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1580915411954-282cb1b0d780?q=80&w=1974&auto=format&fit=crop"
    ],
    results: {
      impact: "Shelf velocity in specialty grocery stores increased by 35%.",
      brand_improvement: "Packaging featured in Dieline's Best of the Year.",
      positioning: "The most visually distinct specialty coffee brand."
    }
  },
  {
    slug: "minimalist-expo",
    category: "Posters",
    cover_image: "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?q=80&w=2067&auto=format&fit=crop",
    cover_title: "Minimalist Art Expo",
    cover_description: "Clean and bold posters exploring white space and basic geometry.",
    cover_tags: ["Posters", "Minimalism", "Art"],
    title: "Minimalist: The Power of Less",
    description: "A traveling art exhibition showcasing 21st-century minimalist painters.",
    client: "Global Arts Council",
    problem: "The expo needed to represent minimalism without being 'boring' or invisible.",
    goals: ["Create a series of 5 primary posters", "Consistent brand across digital and print", "Interactive AR poster component"],
    approach: {
      research: "Studied the works of Malevich and the Bauhaus movement.",
      direction: "Primary colors only (Red, Blue, Yellow) with heavy reliance on negative space.",
      execution: "Silk-screen printed posters on heavy-weight architectural paper."
    },
    images: [
      "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?q=80&w=2067&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1533154683836-84ea7a0bc310?q=80&w=1974&auto=format&fit=crop"
    ],
    results: {
      impact: "Sold over 5,000 limited edition poster prints.",
      brand_improvement: "The 'Yellow Circle' poster became a viral design icon.",
      positioning: "Redefined minimalism for a new generation of art lovers."
    }
  },
  {
    slug: "soli-real-estate",
    category: "Websites & UI Design",
    cover_image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=1973&auto=format&fit=crop",
    cover_title: "Soli Premium Real Estate",
    cover_description: "An immersive property search experience for luxury homes.",
    cover_tags: ["UI Design", "Real Estate", "Luxury"],
    title: "Soli: Find Your Foundation",
    description: "Soli connects high-net-worth individuals with off-market luxury properties.",
    client: "Soli Properties",
    problem: "Real estate portals are usually data-heavy and ugly. Soli needed to feel like a concierge service.",
    goals: ["Ultra-clean listing views", "Immersive 360-degree tour integration", "Simple inquiry management for agents"],
    approach: {
      research: "Analyzed luxury brand experiences outside of real estate (yachts, fine watches).",
      direction: "Serif typography, oversized imagery, and soft gold accents.",
      execution: "Full-stack web application with a focus on image optimization and smooth transitions."
    },
    images: [
      "https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=1973&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2070&auto=format&fit=crop"
    ],
    results: {
      impact: "Agent productivity increased by 40% due to better lead quality.",
      brand_improvement: "Client satisfaction score reached 98%.",
      positioning: "The premier digital destination for luxury real estate."
    }
  },
  {
    slug: "titan-heavy-ind",
    category: "Branding",
    cover_image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=2070&auto=format&fit=crop",
    cover_title: "Titan Heavy Industries",
    cover_description: "Solid and reliable branding for a global construction and engineering firm.",
    cover_tags: ["Branding", "Industrial", "Global"],
    title: "Titan: Building the World's Infrastructure",
    description: "Titan is a multi-billion dollar firm responsible for massive bridge and tunnel projects.",
    client: "Titan Group",
    problem: "Their identity was fragmented across 20 different subsidiaries.",
    goals: ["Unify all subsidiaries under one brand", "Develop a system for industrial vehicle livery", "Clear safety-first communication"],
    approach: {
      research: "Interviewed engineers and site workers to understand the importance of visibility and trust.",
      direction: "Heavy, blocky typography and a high-contrast 'Titan Orange' for safety.",
      execution: "A modular brand architecture that allows subsidiaries to maintain their niche focus."
    },
    images: [
      "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=2070&auto=format&fit=crop"
    ],
    results: {
      impact: "Brand consistency score improved from 30% to 95%.",
      brand_improvement: "Global recognition increased by 15% in international markets.",
      positioning: "Perceived as the world's most reliable engineering firm."
    }
  },
  {
    slug: "velvet-wine",
    category: "Packaging",
    cover_image: "https://images.unsplash.com/photo-1510850473359-183957504f96?q=80&w=2070&auto=format&fit=crop",
    cover_title: "Velvet Reserve Wine",
    cover_description: "Luxury wine label design with tactile velvet-finish paper.",
    cover_tags: ["Packaging", "Wine", "Texture"],
    title: "Velvet: A Taste of Sophistication",
    description: "Velvet is a boutique vineyard producing limited edition red blends.",
    client: "Velvet Vineyards",
    problem: "The premium wine sector is highly traditional. Velvet wanted to attract a younger, design-conscious audience.",
    goals: ["Tactile label experience", "Unconventional typographic layout", "Premium gift box design"],
    approach: {
      research: "Sensory analysis of how consumers choose wine in-store.",
      direction: "Deep maroon palette with minimalist white serif typography.",
      execution: "Foil-stamping on velvet-textured paper for a luxurious hand-feel."
    },
    images: [
      "https://images.unsplash.com/photo-1510850473359-183957504f96?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1506377247377-2a5b3b0ca3ef?q=80&w=2070&auto=format&fit=crop"
    ],
    results: {
      impact: "Entire limited reserve sold out in pre-orders.",
      brand_improvement: "Brand perceived as 50% more premium in blind testing.",
      positioning: "The ultimate 'modern luxury' wine brand."
    }
  },
  {
    slug: "future-beats",
    category: "Posters",
    cover_image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=2070&auto=format&fit=crop",
    cover_title: "Future Beats Event Series",
    cover_description: "Experimental poster series for a warehouse party collective.",
    cover_tags: ["Posters", "Underground", "Culture"],
    title: "Future Beats: The Sound of the Underground",
    description: "A series of monthly events showcasing future-bass and lo-fi producers.",
    client: "Beats Collective",
    problem: "Standard club posters looked too commercial. This needed to look like high-art street culture.",
    goals: ["Gritty, DIY aesthetic", "Scanning code for hidden event locations", "Consistent but evolving series"],
    approach: {
      research: "Studied xerox art and DIY zine culture from the 90s.",
      direction: "Black and white base with a single spot color per month.",
      execution: "Low-fidelity printing techniques mixed with high-quality digital layouts."
    },
    images: [
      "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1459749411177-042180ce673c?q=80&w=2070&auto=format&fit=crop"
    ],
    results: {
      impact: "Event attendance grew from 200 to 1,500 in one year.",
      brand_improvement: "Collective recognized as the leader in local underground culture.",
      positioning: "The most authentic event series in the city."
    }
  },
  {
    slug: "orbit-saas-platform",
    category: "Websites & UI Design",
    cover_image: "https://images.unsplash.com/photo-1454165833767-027ffea9e77b?q=80&w=2070&auto=format&fit=crop",
    cover_title: "Orbit SaaS Platform",
    cover_description: "A clean and powerful dashboard for project management teams.",
    cover_tags: ["UI Design", "SaaS", "Productivity"],
    title: "Orbit: Keep Your Team in Motion",
    description: "Orbit is an all-in-one workspace for remote design teams.",
    client: "Orbit Tech",
    problem: "Competitors were too complex. Orbit needed a tool that got out of the way of the creative process.",
    goals: ["Ultra-fast task management", "Integrated whiteboarding", "Light and Dark mode parity"],
    approach: {
      research: "Shadowing creative teams to see how they actually use project management tools.",
      direction: "Soft shadows, pastel color accents, and a custom icon set.",
      execution: "Built using a component-based architecture for easy scaling."
    },
    images: [
      "https://images.unsplash.com/photo-1454165833767-027ffea9e77b?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1504868584819-f8e905263543?q=80&w=2076&auto=format&fit=crop"
    ],
    results: {
      impact: "User error rate decreased by 25% due to clearer UI cues.",
      brand_improvement: "Best New SaaS 2025 by Product Hunt.",
      positioning: "The designer's choice for project management."
    }
  },
  {
    slug: "gaia-eco-resort",
    category: "Branding",
    cover_image: "https://images.unsplash.com/photo-1540541338287-41700207dee6?q=80&w=2070&auto=format&fit=crop",
    cover_title: "Gaia Eco-Resort",
    cover_description: "Natural and earthy branding for a sustainable luxury resort in Bali.",
    cover_tags: ["Branding", "Travel", "Sustainable"],
    title: "Gaia: Luxury in Harmony with Nature",
    description: "Gaia offers an off-grid luxury experience that supports local reforestation.",
    client: "Gaia Resorts",
    problem: "Luxury resorts often feel like an intrusion on the landscape. Gaia needed to feel like a part of it.",
    goals: ["Organic, hand-stamped logo", "Natural color palette (terracotta, moss, slate)", "Signage using reclaimed wood"],
    approach: {
      research: "Studied traditional Balinese art and local natural materials.",
      direction: "Hand-crafted aesthetic with high-end typographic finishing.",
      execution: "Deployment of identity across physical products, web, and social channels."
    },
    images: [
      "https://images.unsplash.com/photo-1540541338287-41700207dee6?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?q=80&w=2080&auto=format&fit=crop"
    ],
    results: {
      impact: "100% occupancy within the first three months of launch.",
      brand_improvement: "Featured in Condé Nast Traveler's 'Hot List' 2025.",
      positioning: "The global benchmark for high-end eco-tourism."
    }
  },
  {
    slug: "prism-fragrance",
    category: "Packaging",
    cover_image: "https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=2044&auto=format&fit=crop",
    cover_title: "Prism Fragrance",
    cover_description: "Holographic perfume packaging that changes color with light.",
    cover_tags: ["Packaging", "Fragrance", "Modern"],
    title: "Prism: Capturing the Spectrum of Scent",
    description: "Prism is a gender-neutral fragrance house focused on synthetic-natural blends.",
    client: "Prism Scents",
    problem: "The fragrance world is deeply gendered. Prism needed a bottle that felt truly universal and modern.",
    goals: ["Holographic foil finish", "Minimalist glass bottle shape", "Vibrant, tech-inspired secondary packaging"],
    approach: {
      research: "Exploration of prism-like light refraction and modern glass manufacturing.",
      direction: "Sleek, sharp-edged bottle with rainbow-holographic accents.",
      execution: "Collaborated with glass blowers and specialty printers to achieve the prism effect."
    },
    images: [
      "https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=2044&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1592914610354-fd354ea45e48?q=80&w=1935&auto=format&fit=crop"
    ],
    results: {
      impact: "Top-selling fragrance at Sephora's 'New & Notable' section.",
      brand_improvement: "Packaging won the 'Most Innovative Design' at LuxePack 2025.",
      positioning: "The brand that redefined gender-neutral luxury in scent."
    }
  },
  {
    slug: "abstract-vision",
    category: "Posters",
    cover_image: "https://images.unsplash.com/photo-1550684376-efcbd6e3f031?q=80&w=2070&auto=format&fit=crop",
    cover_title: "Abstract Vision Gallery",
    cover_description: "A series of posters exploring the relationship between geometry and color.",
    cover_tags: ["Posters", "Abstract", "Color"],
    title: "Abstract Vision: A Study in Form",
    description: "An open-call gallery show for digital-only abstract artists.",
    client: "Visionary Arts",
    problem: "Digital art exhibitions often struggle to feel as legitimate as physical ones. This needed a very high-end visual anchor.",
    goals: ["Ultra-vibrant digital color display", "Consistent social media kit", "Printed limited catalog"],
    approach: {
      research: "Explored the psychology of color and its impact on emotional resonance.",
      direction: "Complex, multi-layered geometric shapes with deep gradients.",
      execution: "Posters designed using a mixture of vector math and digital hand-painting."
    },
    images: [
      "https://images.unsplash.com/photo-1550684376-efcbd6e3f031?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1557682250-33bd709cbe85?q=80&w=2029&auto=format&fit=crop"
    ],
    results: {
      impact: "Gallery became the most tagged art space on Instagram for three months.",
      brand_improvement: "Secured a permanent physical space following the success of the digital show.",
      positioning: "The leading voice for digital abstract art curation."
    }
  },
  {
    slug: "sync-project-tool",
    category: "Websites & UI Design",
    cover_image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop",
    cover_title: "Sync Team Collaboration",
    cover_description: "A high-performance web app for managing complex engineering workflows.",
    cover_tags: ["UI Design", "Productivity", "Enterprise"],
    title: "Sync: Precision Collaboration",
    description: "Sync is a specialized tool for distributed hardware engineering teams.",
    client: "Sync Systems",
    problem: "Engineering tools are notoriously difficult to use. Sync needed to be as precise as CAD but as easy as a chat app.",
    goals: ["Integrated version control visualization", "High-density data views", "Zero-lag interaction"],
    approach: {
      research: "Workshops with aerospace and automotive engineers to understand their documentation pain points.",
      direction: "Monospaced typography, technical grid layouts, and high-contrast color markers.",
      execution: "Built using a custom Canvas-based rendering engine for large data sets."
    },
    images: [
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1558655146-d09347e92766?q=80&w=1964&auto=format&fit=crop"
    ],
    results: {
      impact: "Reduced documentation time for engineering teams by 30%.",
      brand_improvement: "Selected as the internal tool for two major EV manufacturers.",
      positioning: "The mission-critical tool for modern engineering."
    }
  }
];

async function seed() {
  console.log('Clearing existing projects...');
  const { error: deleteError } = await supabase.from('projects').delete().neq('id', 0);
  
  if (deleteError) {
    console.error('Error clearing projects:', deleteError);
    return;
  }

  console.log('Inserting 20 sample projects...');
  const { error: insertError } = await supabase.from('projects').insert(projects);

  if (insertError) {
    console.error('Error seeding projects:', insertError);
  } else {
    console.log('Successfully seeded 20 projects!');
  }
}

seed();
