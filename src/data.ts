/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ServiceItem, PortfolioItem, TestimonialItem, FAQItem, StatItem } from './types';

export const servicesData: ServiceItem[] = [
  {
    id: 'tshirt-printing',
    title: 'Custom T-Shirt Printing',
    description: 'Premium quality screen, vinyl, and direct-to-garment (DTG) printing for personalized, retail-ready T-shirts.',
    longDescription: 'Our signature T-shirt printing utilizes state-of-the-art technology to ensure vibrant, non-cracking graphics. Whether you need single custom pieces, fashion brand inventory, or group wear, we supply premium cotton fabrics combined with ultra-durable print methods.',
    image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&q=80&w=800',
    category: 'apparel',
    features: ['100% Combed Cotton Fabrics', 'Non-fade Plastisol & DTG prints', 'No Minimum Order options', 'Unisex & Custom Sizes']
  },
  {
    id: 'blouse-printing',
    title: 'Designer Blouse Printing',
    description: 'Precision digital and custom sublimation printing on premium silks, velvets, and satin blouse fabrics.',
    longDescription: 'Create spellbinding ethnic wear with custom printed blouse fabrics. Ideal for boutique designers, bridal wear, and festive collections, we print intricate floral, geometric, and traditional motifs with high-definition accuracy and glitter/gold foil finishes.',
    image: 'https://images.unsplash.com/photo-1610030469668-93535c17b6b3?auto=format&fit=crop&q=80&w=800',
    category: 'ethnic',
    features: ['High-Definition Silk & Satin Print', 'Glitter, Foil, & Embossed finishes', 'Perfect matching with saree palettes', 'Eco-friendly skin-safe pigments']
  },
  {
    id: 'sports-jersey',
    title: 'Sports Jersey Printing',
    description: 'Full-sublimation, moisture-wicking customized athletic jerseys for schools, colleges, and local leagues.',
    longDescription: 'Get game-ready with dry-fit, highly breathable custom team uniforms. Our full sublimation printing embeds the dye deep into the fabric threads, guaranteeing that numbers, sponsor logos, and player names will never peel, fade, or crack.',
    image: 'https://images.unsplash.com/photo-1587280501635-68a0e82cd5ff?auto=format&fit=crop&q=80&w=800',
    category: 'athletic',
    features: ['Active Moisture-Wicking Mesh', 'Full sublimation seamless graphics', 'Individual player name & number customizing', 'Lightweight & Ultra-durable']
  },
  {
    id: 'corporate-uniforms',
    title: 'Corporate Uniform Printing',
    description: 'Professional, elegant polo shirts and formal uniforms embroidered or printed with your company logo.',
    longDescription: 'Align your team’s identity with professional corporate polos, shirts, and blazers. We specialize in high-quality embroidery and premium heat-press logos that stay intact through heavy wear and repeated industrial washing.',
    image: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&q=80&w=800',
    category: 'corporate',
    features: ['Polyester-Cotton Premium Blends', 'High-density micro-embroidery', 'Color matching with brand guidelines', 'Elegant custom collars & cuffs']
  },
  {
    id: 'school-uniforms',
    title: 'School Uniform Printing',
    description: 'Standard, highly durable, and soft uniform shirts, athletic tracks, and belt/ties with official school crests.',
    longDescription: 'Serving academic institutions for years, we produce anti-pilling, breathable school uniforms. From preschool t-shirts to formal high school uniforms, we deliver unmatched color fastness and sturdy double-stitch finishes to withstand daily playground activities.',
    image: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&q=80&w=800',
    category: 'school',
    features: ['Anti-shrink & Anti-pilling fabric', 'Authorized crest embroidery & print', 'All-season comfortable cotton-blends', 'Bulk sizing and cost-effective pricing']
  },
  {
    id: 'college-fests',
    title: 'College Fest T-Shirts',
    description: 'Trendy, energetic, and affordable group T-shirts for college fests, clubs, symposiums, and sports meets.',
    longDescription: 'Make your college event legendary with matching custom t-shirts. We offer fast turnaround times and high-density screen printing to bring campus slogans, mascot designs, and department themes to life on high-energy, budget-friendly apparel.',
    image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=800',
    category: 'events',
    features: ['Special student budget discounts', 'Express 48-hour rush delivery', 'Trendy oversized & standard fits', 'Glow-in-the-dark and neon color options']
  },
  {
    id: 'couple-tshirts',
    title: 'Couple & Theme T-Shirts',
    description: 'Aesthetic, matching, and personalized duo T-shirts for pre-wedding shoots, anniversaries, and holidays.',
    longDescription: 'Celebrate togetherness with matching couple designs. Perfect for romantic getaways, maternity shoots, wedding announcement teasers, or anniversaries, we print customized matching text, split graphics, or illustrations on soft organic fabrics.',
    image: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&q=80&w=800',
    category: 'custom',
    features: ['Supersoft Premium Ringspun Cotton', 'Complementary custom text & typography', 'Beautiful custom vector templates', 'Perfect gift-ready luxury packaging']
  },
  {
    id: 'birthday-tshirts',
    title: 'Birthday & Event T-Shirts',
    description: 'Fun, customized party wear for birthday squads, milestone celebrations, and family holiday parties.',
    longDescription: 'Turn heads at your next birthday celebration! We print vibrant custom graphics, age milestones, "Squad Leader" titles, or photo collages on comfortable, lightweight cotton fabrics for kids, teens, and adults.',
    image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&q=80&w=800',
    category: 'custom',
    features: ['Bright, photo-realistic fabric printing', 'Gold/Silver metallic accents', 'Sizes ranging from newborn to 5XL', 'Custom names printed on sleeves']
  },
  {
    id: 'festival-tshirts',
    title: 'Festival & Cultural Wear',
    description: 'Traditional and fusion printed apparel for grand celebrations including Diwali, Holi, Navratri, and Pongal.',
    longDescription: 'Celebrate cultural heritage with modern printed apparel. We specialize in printing metallic gold mandalas, traditional script typography, and vibrant festival illustrations on ethnic cotton tees, kurtis, and stoles for massive cultural groups and temple events.',
    image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&q=80&w=800',
    category: 'ethnic',
    features: ['Golden foil and metallic paste prints', 'Vibrant non-toxic organic dyes', 'Breathable fabric for long celebrations', 'Custom regional language calligraphy']
  },
  {
    id: 'logo-printing',
    title: 'Corporate Logo & Branding',
    description: 'Precision brand printing on merchandise, caps, bags, umbrellas, and general corporate branding materials.',
    longDescription: 'Establish brand authority with impeccable precision. We leverage high-resolution pad printing, vinyl transfers, and silk screens to transfer your corporate logo onto a wide array of fabrics and promotional gifts with exact Pantone color matching.',
    image: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&q=80&w=800',
    category: 'branding',
    features: ['Exact Pantone (PMS) color matching', 'High durability multi-surface prints', 'Micro-details and text resolution', 'Corporate gifting bundled packages']
  },
  {
    id: 'bulk-printing',
    title: 'Industrial Bulk Orders',
    description: 'High-speed automatic screen printing for large campaigns, retail brands, and massive corporate deployments.',
    longDescription: 'Our industrial printing floor handles volume orders starting from 100 to 10,000+ pieces with flawless color consistency. Perfect for national product launches, political campaigns, global fests, and garment resellers who expect quick turnarounds and rock-bottom prices.',
    image: 'https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?auto=format&fit=crop&q=80&w=800',
    category: 'bulk',
    features: ['Automatic high-speed carousel presses', 'Significant tiered volume discounts', 'Direct wholesale fabric sourcing', 'Consistent quality-control inspections']
  },
  {
    id: 'custom-orders',
    title: 'Fabric & Bespoke Orders',
    description: 'Specialized fabric roll printing, custom embroidery, and pattern placements according to tailored spec-sheets.',
    longDescription: 'Bring extreme customizations to life. If you have custom fabric choices, specific seam placement guidelines, or unique cut-and-sew requirements, our team works directly with your design sheets to execute a custom-printed master product.',
    image: 'https://images.unsplash.com/photo-1520004481444-a955a155c27f?auto=format&fit=crop&q=80&w=800',
    category: 'custom',
    features: ['Direct-to-Fabric roll printing', 'Detailed tech-pack implementation', 'Sample testing and fabric prototyping', 'Dedicated design coordinator support']
  }
];

export const portfolioData: PortfolioItem[] = [
  {
    id: 'p1',
    title: 'Minimalist Typography Tee',
    category: 'tshirts',
    image: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&q=80&w=800',
    description: 'Clean typography print on premium ringspun 180 GSM bio-washed black cotton.',
    tag: 'Screen Print'
  },
  {
    id: 'p2',
    title: 'Summer Edition Organic Tee',
    category: 'tshirts',
    image: 'https://images.unsplash.com/photo-1554568218-0f1715e72254?auto=format&fit=crop&q=80&w=800',
    description: 'Eco-friendly water-based discharge printing resulting in an incredibly soft, breathable feel.',
    tag: 'Discharge Ink'
  },
  {
    id: 'p3',
    title: 'Royal Bridal Saree Blouse',
    category: 'blouses',
    image: 'https://images.unsplash.com/photo-1610030469668-93535c17b6b3?auto=format&fit=crop&q=80&w=800',
    description: 'Exquisite custom gold foil mandala printed blouse with matching hand-embellished beads.',
    tag: 'Foil Print'
  },
  {
    id: 'p4',
    title: 'Handloom block-printed silk fabric',
    category: 'blouses',
    image: 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&q=80&w=800',
    description: 'Elegant custom continuous fabric prints on raw mulberry silk with natural dyes.',
    tag: 'Direct Printing'
  },
  {
    id: 'p5',
    title: 'Thunder FC Sublimated Jersey',
    category: 'sports',
    image: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&q=80&w=800',
    description: 'Dynamic gradient sports jersey printed on moisture-wicking interlock mesh fabric.',
    tag: 'Full Sublimation'
  },
  {
    id: 'p6',
    title: 'Marathon Finisher Singlet',
    category: 'sports',
    image: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&q=80&w=800',
    description: 'Ultra lightweight, friction-free active singlet printed with reflective security inks.',
    tag: 'Reflective Print'
  },
  {
    id: 'p7',
    title: 'Apex Tech Corp Corporate Polos',
    category: 'corporate',
    image: 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?auto=format&fit=crop&q=80&w=800',
    description: 'Classic navy pique polo shirts featuring custom high-density 3D corporate embroidery.',
    tag: '3D Embroidery'
  },
  {
    id: 'p8',
    title: 'St. Mary’s Senior Blazer Crest',
    category: 'school',
    image: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&q=80&w=800',
    description: 'High thread-count woven crest embroidery and matching screen printed institutional shirts.',
    tag: 'Institution Badge'
  },
  {
    id: 'p9',
    title: 'E-Summit Campus Crew Over-sized Tee',
    category: 'events',
    image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&q=80&w=800',
    description: 'Trendy heavy-weight 240 GSM oversized graphic tee representing campus tech leaders.',
    tag: 'Plastisol Screen'
  },
  {
    id: 'p10',
    title: 'Golden Diwali Family Squad Tees',
    category: 'family',
    image: 'https://images.unsplash.com/photo-1543807535-eceef0bc6599?auto=format&fit=crop&q=80&w=800',
    description: 'Warm festive maroon t-shirts customized with names and printed with metallic bronze overlay.',
    tag: 'Metallic Print'
  }
];

export const testimonialsData: TestimonialItem[] = [
  {
    id: 't1',
    name: 'Anjali Sharma',
    role: 'Founder, Bella Boutique',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150',
    rating: 5,
    review: 'Jyothi Printing Works has completely changed my boutique business. The custom blouse prints are flawless, and the gold foil prints stay pristine even after multiple chemical washes. Unparalleled craftsmanship!',
    product: 'Blouse Printing'
  },
  {
    id: 't2',
    name: 'Rohan Deshmukh',
    role: 'Sports Coordinator, IIT Bombay',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
    rating: 5,
    review: 'Ordered 800+ full sublimation soccer jerseys for our annual sports meet. The color vibrancy was fantastic, the fabric is extremely breathable, and player names were 100% accurate. Highly recommended for bulk sports orders!',
    product: 'Sports Jerseys'
  },
  {
    id: 't3',
    name: 'Vikram Aditya',
    role: 'HR Director, Innotech Solutions',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150',
    rating: 5,
    review: 'Our corporate polos look highly professional. The embroidery logo is tight, clean, and has Zero loose threads. Jyothi Printing delivers VistaPrint-level packaging with local attention and incredibly fast turnarounds.',
    product: 'Corporate Uniforms'
  },
  {
    id: 't4',
    name: 'Priya Iyer',
    role: 'Event Manager, Crimson Marcom',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150',
    rating: 5,
    review: 'The couple t-shirts and squad shirts for our destination wedding were an absolute hit! The design team helped us edit our typography and delivered everything within 3 days. Super polite and professional.',
    product: 'Custom Event Tees'
  }
];

export const faqsData: FAQItem[] = [
  {
    id: 'faq1',
    question: 'What is the Minimum Order Quantity (MOQ)?',
    answer: 'For screen printing and bulk runs, our MOQ is just 10 pieces per design. However, for specialized digital printing (DTG) and custom couple or birthday orders, there is NO minimum quantity—you can order a single premium piece!',
    category: 'Orders'
  },
  {
    id: 'faq2',
    question: 'How long does printing and delivery take?',
    answer: 'Our standard production time is 5 to 7 working days from design approval. For urgent events, we offer an Express Delivery Service of 48 hours for an additional rush fee. Shipping timelines depend on your pincode (typically 1-3 days across major cities).',
    category: 'Delivery'
  },
  {
    id: 'faq3',
    question: 'What printing methods do you use?',
    answer: 'We operate a multi-technology printing studio including Automatic Screen Printing (Plastisol, Water-based, High-Density, Puff), Computerized Embroidery, Full Fabric Sublimation, Direct-To-Garment (DTG) digital printing, and Premium Heat Vinyl transfers.',
    category: 'Methods'
  },
  {
    id: 'faq4',
    question: 'What kind of fabrics do you offer for T-Shirts?',
    answer: 'We supply high-grade apparel. Our standard T-shirts are 100% combed cotton (180 GSM, 200 GSM, 240 GSM oversized) with premium bio-wash processing for extreme softness and anti-shrinkage. For athletic wear, we utilize moisture-wicking interlock dry-fit polyester.',
    category: 'Quality'
  },
  {
    id: 'faq5',
    question: 'What are the payment terms for Bulk Orders?',
    answer: 'For bulk corporate, school, or college orders, we require a 50% advance payment to initiate material sourcing and design sampling. The remaining 50% balance is payable upon final printing completion prior to dispatch.',
    category: 'Payments'
  },
  {
    id: 'faq6',
    question: 'Do you offer custom design assistance?',
    answer: 'Absolutely! Our in-house designers review every single upload. If your design is low-resolution, we will trace it into a high-definition vector format for free. We also help you choose colors that look best on the chosen fabric shades.',
    category: 'Design'
  }
];

export const statsData: StatItem[] = [
  {
    id: 's1',
    label: 'Happy Customers',
    value: '1000',
    suffix: '+',
    description: 'Local and global clients'
  },
  {
    id: 's2',
    label: 'Products Printed',
    value: '5000',
    suffix: '+',
    description: 'High precision garments'
  },
  {
    id: 's3',
    label: 'Bulk Orders',
    value: '100',
    suffix: '+',
    description: 'Schools, colleges, events'
  },
  {
    id: 's4',
    label: 'Customer Rating',
    value: '5',
    suffix: '/5★',
    description: 'Excellent service proof'
  }
];
