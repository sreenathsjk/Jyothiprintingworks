/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ShopProduct } from '../types';

// Let's define the available printing sizes and their corresponding prices (from ₹100 to ₹500)
export const DESIGN_SIZES = [
  'Pocket Size (4"x4")',
  'Chest Size (6"x6")',
  'Medium Print (A5)',
  'Large Print (A4)',
  'Poster Print (A3)'
];

export function getPriceForSize(size: string): { price: number; originalPrice: number } {
  if (size.includes('Pocket')) {
    return { price: 100, originalPrice: 199 };
  }
  if (size.includes('Chest')) {
    return { price: 200, originalPrice: 399 };
  }
  if (size.includes('Medium') || size.includes('A5')) {
    return { price: 300, originalPrice: 599 };
  }
  if (size.includes('Large') || size.includes('A4')) {
    return { price: 400, originalPrice: 799 };
  }
  if (size.includes('Poster') || size.includes('A3') || size.includes('Full')) {
    return { price: 500, originalPrice: 999 };
  }
  // Default to Pocket
  return { price: 100, originalPrice: 199 };
}

export const shopProducts: ShopProduct[] = [
  {
    id: 'design-1',
    title: 'Design #1: Royal Maharaja Festive Elephant',
    tagline: 'Traditional Indian Heritage Motif • Ideal for Silk Sarees & Blouses',
    price: 100, // Starts at Pocket Size price
    originalPrice: 199,
    category: 'boutique', // Boutique for Silk Sarees/Blouses
    rating: 4.9,
    reviewCount: 148,
    images: [
      'https://images.unsplash.com/photo-1581850518616-bcb8077fa212?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&q=80&w=600'
    ],
    colors: [
      { name: 'Royal Silk Red', hex: '#8B0000' },
      { name: 'Heritage Gold', hex: '#DAA520' },
      { name: 'Raw Mustard Silk', hex: '#E1AD01' }
    ],
    sizes: DESIGN_SIZES,
    description: 'A beautifully rich, intricate Indian elephant design wearing traditional royal ornaments. Perfect for printing or high-density embroidery on premium traditional silk sarees and designer festival blouses.',
    specifications: [
      'High-resolution multi-color vector artwork',
      'Wash-resistant premium quality fabric print',
      'Suitable for premium silk, cotton, or georgette',
      'Authentic traditional Jyothi heritage series'
    ],
    reviews: [
      {
        id: 'r-d1-1',
        author: 'Meera Sharma',
        rating: 5,
        date: '2026-06-15',
        comment: 'This royal elephant looks absolutely stunning when printed on my silk blouse! Highly recommend!',
        fit: 'True to Size',
        verified: true
      }
    ],
    isBestSeller: true,
    isNewArrival: false,
    stockRemaining: 15
  },
  {
    id: 'design-3',
    title: 'Design #3: Vibrant Mandala Tribal Elephant',
    tagline: 'Chromatic Boho Elephant Pattern • Perfect for Blouses or T-Shirts',
    price: 100,
    originalPrice: 199,
    category: 'boutique',
    rating: 4.8,
    reviewCount: 92,
    images: [
      'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&q=80&w=600'
    ],
    colors: [
      { name: 'Off-White Canvas', hex: '#F5F5F7' },
      { name: 'Midnight Charcoal', hex: '#1E1E1E' },
      { name: 'Teal Green Silk', hex: '#008080' }
    ],
    sizes: DESIGN_SIZES,
    description: 'An eye-catching, highly vibrant tribal mandala style elephant. This gorgeous modern-folk fusion design is incredibly versatile and looks stunning printed on casual cotton t-shirts, boutique blouses, or designer kurtis.',
    specifications: [
      'Intricate detailed mandala design lines',
      'Supports high-density screen printing',
      'Soft texture print feeling on the skin',
      'Non-fade, long lasting organic inks'
    ],
    reviews: [
      {
        id: 'r-d3-1',
        author: 'Kavya R.',
        rating: 5,
        date: '2026-06-20',
        comment: 'I ordered the A4 Large size for my black T-shirt. The colors are incredibly vibrant and exactly match the photo!',
        fit: 'True to Size',
        verified: true
      }
    ],
    isBestSeller: false,
    isNewArrival: true,
    stockRemaining: 4
  },
  {
    id: 'design-14',
    title: 'Design #14: Rainbow Splash Tropical Macaw',
    tagline: 'Vibrant Colorful Bird Design • Best for Streetwear T-Shirts & Hoodies',
    price: 100,
    originalPrice: 199,
    category: 'streetwear', // Streetwear for T-Shirts
    rating: 4.7,
    reviewCount: 205,
    images: [
      'https://images.unsplash.com/photo-1552728089-57bdde30ebd3?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&q=80&w=600'
    ],
    colors: [
      { name: 'Pure White', hex: '#FFFFFF' },
      { name: 'Pitch Black', hex: '#0B0B0C' },
      { name: 'Sunny Yellow', hex: '#FFCC00' }
    ],
    sizes: DESIGN_SIZES,
    description: 'Bring tropical warmth with this highly detailed rainbow splash macaw design. Perfectly suited for oversized graphic tees, street culture t-shirts, and cozy pullover hoodies.',
    specifications: [
      'Stunning multi-color gradient separation',
      'Breathable print style that stays soft',
      '100% organic cotton base apparel match',
      'Eco-friendly water-soluble inks used'
    ],
    reviews: [
      {
        id: 'r-d14-1',
        author: 'Arjun Das',
        rating: 5,
        date: '2026-06-28',
        comment: 'I printed this macaw on an oversized black hoodie (Poster Size print). It looks elite. Total streetwear vibes.',
        fit: 'True to Size',
        verified: true
      }
    ],
    isBestSeller: true,
    isNewArrival: false,
    stockRemaining: 7
  },
  {
    id: 'design-18',
    title: 'Design #18: Golden Mughal Royal Parrots',
    tagline: 'Classical Courtyard Parrots • Ideal for Silk Sarees & Blouses',
    price: 100,
    originalPrice: 199,
    category: 'boutique',
    rating: 4.9,
    reviewCount: 74,
    images: [
      'https://images.unsplash.com/photo-1484557985045-edf25e08da73?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&q=80&w=600'
    ],
    colors: [
      { name: 'Heritage Gold', hex: '#DAA520' },
      { name: 'Mughal Emerald', hex: '#004B23' },
      { name: 'Crimson Red Silk', hex: '#9E1B1B' }
    ],
    sizes: DESIGN_SIZES,
    description: 'A traditional royal parrot motif inspired by Mughal architecture. Elegant symmetrical artwork framed with floral borders, perfectly suited for printing or gold zari embroidery on traditional sarees and raw silk blouses.',
    specifications: [
      'Traditional heritage symmetrical layout',
      'Excellent for gold zari embroidery mapping',
      'Printed on heavy silk with premium sheen',
      'Designed for weddings and festival wear'
    ],
    reviews: [
      {
        id: 'r-d18-1',
        author: 'Aanya Gupta',
        rating: 5,
        date: '2026-06-12',
        comment: 'The golden detailing is exquisite. It looks like hand-painted couture.',
        fit: 'True to Size',
        verified: true
      }
    ],
    isBestSeller: false,
    isNewArrival: true
  },
  {
    id: 'design-23',
    title: 'Design #23: Prismatic Mosaic Butterfly',
    tagline: 'Vibrant Geometric Butterfly • Premium Hoodie & T-Shirt Print',
    price: 100,
    originalPrice: 199,
    category: 'hoodies', // Hoodies
    rating: 4.6,
    reviewCount: 110,
    images: [
      'https://images.unsplash.com/photo-1560114928-40f1f1eb26a0?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&q=80&w=600'
    ],
    colors: [
      { name: 'Space Grey', hex: '#708090' },
      { name: 'Obsidian Black', hex: '#1C1C1C' },
      { name: 'Lavender Hue', hex: '#E6E6FA' }
    ],
    sizes: DESIGN_SIZES,
    description: 'An elegant, mosaic bead-style butterfly illustration with highly saturated color cells. Specially curated for center chest prints on heavy fleece hoodies or streetwear crewneck sweatshirts.',
    specifications: [
      'Precision sharp edge vector detailing',
      'Premium rubberized soft-touch print finish',
      'Suits heavy 400 GSM loopback cotton fleece',
      'Eco-friendly durable inks'
    ],
    reviews: [
      {
        id: 'r-d23-1',
        author: 'Rohan Joshi',
        rating: 4,
        date: '2026-06-19',
        comment: 'Looks super stylish on grey hoodies. The colors pop beautifully under warm lights.',
        fit: 'True to Size',
        verified: true
      }
    ],
    isBestSeller: false,
    isNewArrival: false,
    stockRemaining: 8
  },
  {
    id: 'design-26',
    title: 'Design #26: Majestic Golden Plumes Peacock',
    tagline: 'Regal Golden Peacock Motif • Best for Sarees & Blouses',
    price: 100,
    originalPrice: 199,
    category: 'boutique',
    rating: 4.9,
    reviewCount: 180,
    images: [
      'https://images.unsplash.com/photo-1508962914676-134849a727f0?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=600'
    ],
    colors: [
      { name: 'Deep Royal Blue', hex: '#002366' },
      { name: 'Emerald Velvet', hex: '#046307' },
      { name: 'Champagne Gold', hex: '#F1E5AC' }
    ],
    sizes: DESIGN_SIZES,
    description: 'A luxurious golden peacock print detailed with fine zari and gemstone aesthetics. Perfect for placing on the back panel of blouses or running along the majestic borders of premium silk sarees.',
    specifications: [
      'Elegant golden zari outline detail',
      'Optimized for silk and premium handlooms',
      'Over 85,000 dense stitch embroidery compatibility',
      'Premium wedding and festive collection'
    ],
    reviews: [
      {
        id: 'r-d26-1',
        author: 'Ananya Krishnan',
        rating: 5,
        date: '2026-06-14',
        comment: 'Stunning design! Everyone at the family wedding asked where I got this gorgeous peacock border printed.',
        fit: 'True to Size',
        verified: true
      }
    ],
    isBestSeller: true,
    isNewArrival: false
  },
  {
    id: 'design-35',
    title: 'Design #35: Tirupati Sacred Shanku Chakra',
    tagline: 'Divine Spiritual Symbolism • Perfect for Devotional T-Shirts',
    price: 100,
    originalPrice: 199,
    category: 'streetwear',
    rating: 5.0,
    reviewCount: 320,
    images: [
      'https://images.unsplash.com/photo-1609137144813-7d9921338f04?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&q=80&w=600'
    ],
    colors: [
      { name: 'Saffron Orange', hex: '#FF9933' },
      { name: 'Sacred White', hex: '#FFFFFF' },
      { name: 'Temple Black', hex: '#111111' }
    ],
    sizes: DESIGN_SIZES,
    description: 'An elegant depiction of the sacred Vaishnava Shanku, Chakra, and Namam of Lord Venkateswara. Designed specifically for printing on premium spiritual cotton t-shirts, devotional shawls, and temple wear.',
    specifications: [
      'Gilded golden accents with traditional lines',
      'High breathability digital screen print',
      'Perfect placement for center-chest layouts',
      'Auspicious religious iconography'
    ],
    reviews: [
      {
        id: 'r-d35-1',
        author: 'Siddharth Rao',
        rating: 5,
        date: '2026-06-25',
        comment: 'Incredible clarity in the lines. Felt very peaceful wearing this beautiful Shanku Chakra print during prayers.',
        fit: 'True to Size',
        verified: true
      }
    ],
    isBestSeller: true,
    isNewArrival: false
  },
  {
    id: 'design-41',
    title: 'Design #41: Celestial Lord Shiva Portrait',
    tagline: 'Divine Cosmic Shiva Art • Best for Hoodies & Graphic Tees',
    price: 100,
    originalPrice: 199,
    category: 'hoodies',
    rating: 4.9,
    reviewCount: 260,
    images: [
      'https://images.unsplash.com/photo-1620168348203-df33a105f884?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&q=80&w=600'
    ],
    colors: [
      { name: 'Cosmic Blue', hex: '#1E3A8A' },
      { name: 'Shiva Charcoal', hex: '#2A2A2A' },
      { name: 'Pristine Snow', hex: '#F9FAFB' }
    ],
    sizes: DESIGN_SIZES,
    description: 'An ethereal, cosmic meditation portrait of Lord Shiva in divine serenity. Features rich gradients of deep blue, crescent moon details, and flowing tresses. Looks outstanding on large back-print hoodies or front-center graphic tees.',
    specifications: [
      'Ultra high density digital color separation',
      'Resilient non-cracking premium ink layers',
      'Matches heavy-duty combed cotton fleece',
      'Specially designed for Shivratri & spiritual wear'
    ],
    reviews: [
      {
        id: 'r-d41-1',
        author: 'Rahul Verma',
        rating: 5,
        date: '2026-06-29',
        comment: 'Absolutely breathtaking! The cosmic blue hues look surreal on the black hoodie. Highly recommended!',
        fit: 'True to Size',
        verified: true
      }
    ],
    isBestSeller: true,
    isNewArrival: false
  },
  {
    id: 'design-53',
    title: 'Design #53: Festive Floral Lord Ganesha',
    tagline: 'Auspicious Floral Ganesha Print • Perfect for Blouses & Sarees',
    price: 100,
    originalPrice: 199,
    category: 'boutique',
    rating: 4.9,
    reviewCount: 195,
    images: [
      'https://images.unsplash.com/photo-1561361513-2d000a50f0db?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&q=80&w=600'
    ],
    colors: [
      { name: 'Vermilion Red', hex: '#E32636' },
      { name: 'Marigold Yellow', hex: '#FFBF00' },
      { name: 'Forest Green Silk', hex: '#0B6623' }
    ],
    sizes: DESIGN_SIZES,
    description: 'A beautiful, vibrant Ganesha design adorned with festive Indian flowers, roses, and gold patterns. Perfect for printing or embroidery on wedding sarees, traditional blouses, or festive ethnic wear.',
    specifications: [
      'Vibrant auspicious color palette',
      'Premium high density gold ink compatibility',
      'Excellent for festival season wear',
      'Smooth integration on soft silk and handloom'
    ],
    reviews: [
      {
        id: 'r-d53-1',
        author: 'Saanvi Nair',
        rating: 5,
        date: '2026-06-18',
        comment: 'Beautiful floral Ganesha print. The yellow marigold details look so cheerful and sacred.',
        fit: 'True to Size',
        verified: true
      }
    ],
    isBestSeller: false,
    isNewArrival: true
  },
  {
    id: 'design-61',
    title: 'Design #61: Radha Krishna Eternal Love',
    tagline: 'Divine Couple Hand-Painted Style • Ideal for Silk Sarees & Blouses',
    price: 100,
    originalPrice: 199,
    category: 'boutique',
    rating: 4.8,
    reviewCount: 88,
    images: [
      'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&q=80&w=600'
    ],
    colors: [
      { name: 'Peacock Blue Silk', hex: '#0F52BA' },
      { name: 'Lotus Pink', hex: '#FF91A4' },
      { name: 'Heritage Gold', hex: '#DAA520' }
    ],
    sizes: DESIGN_SIZES,
    description: 'A sublime hand-painted style watercolor depiction of Radha and Krishna in an eternal divine embrace, accented with peacock feathers. Beautifully optimized for elegant center prints on premium sarees or blouses.',
    specifications: [
      'Realistic watercolor effect digital print',
      'High-end wash resistant fabric color lock',
      'Specially designed for traditional family functions',
      'Vibrant contrasting hues'
    ],
    reviews: [
      {
        id: 'r-d61-1',
        author: 'Tara Prasad',
        rating: 5,
        date: '2026-06-11',
        comment: 'Perfect print on my silk saree pallu! The colors are incredibly soft and divine.',
        fit: 'True to Size',
        verified: true
      }
    ],
    isBestSeller: false,
    isNewArrival: false
  },
  {
    id: 'design-80',
    title: 'Design #80: Elegant Classical Red Rose',
    tagline: 'Detailed Botanical Rose Emblem • Great for Sarees, Blouses or T-Shirts',
    price: 100,
    originalPrice: 199,
    category: 'boutique',
    rating: 4.7,
    reviewCount: 114,
    images: [
      'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&q=80&w=600'
    ],
    colors: [
      { name: 'Rose Petal Red', hex: '#C21E56' },
      { name: 'Classic Black', hex: '#1C1C1C' },
      { name: 'Soft Cream White', hex: '#FFFDD0' }
    ],
    sizes: DESIGN_SIZES,
    description: 'A classically rendered red rose with gold-bordered green leaves and stems. A highly aesthetic, vintage design that looks exquisite printed on t-shirts, sarees, or boutique blouses.',
    specifications: [
      'Timeless vintage botanical rendering',
      'Supports high-definition digital textile print',
      'Looks magnificent on both light and dark cotton',
      'Soft finish for maximum fabric comfort'
    ],
    reviews: [
      {
        id: 'r-d80-1',
        author: 'Neha Verma',
        rating: 5,
        date: '2026-06-22',
        comment: 'I printed a Medium size on a cream blouse. It looks incredibly elegant and sophisticated.',
        fit: 'True to Size',
        verified: true
      }
    ],
    isBestSeller: false,
    isNewArrival: false
  },
  {
    id: 'design-124',
    title: 'Design #124: Dreamy Sunset Beach & Hibiscus',
    tagline: 'Tropical Vibe Graphic Art • Best for Streetwear T-Shirts & Jerseys',
    price: 100,
    originalPrice: 199,
    category: 'streetwear',
    rating: 4.8,
    reviewCount: 220,
    images: [
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=600'
    ],
    colors: [
      { name: 'Sunset Orange', hex: '#FF5E36' },
      { name: 'Coconut White', hex: '#FDFEFF' },
      { name: 'Abyss Black', hex: '#0A0A0B' }
    ],
    sizes: DESIGN_SIZES,
    description: 'A vibrant sunset coastal landscape framed inside high-contrast tropical hibiscus blossoms and palm silhouettes. Ideal for oversized comfort t-shirts, sports jerseys, or beach vacation wear.',
    specifications: [
      'Vibrant retro-modern aesthetic colors',
      'Optimized for heavy-weight summer t-shirts',
      'Breathable print matrix that prevents sweating',
      'Fade-proof under heavy sunlight exposure'
    ],
    reviews: [
      {
        id: 'r-d124-1',
        author: 'Pranav Saxena',
        rating: 5,
        date: '2026-06-27',
        comment: 'I bought this printed on a sports jersey for our beach trip. The print breathability is superb, and the color matches the sky!',
        fit: 'True to Size',
        verified: true
      }
    ],
    isBestSeller: true,
    isNewArrival: false
  },
  {
    id: 'design-125',
    title: 'Design #125: Magical Winter River Cabin',
    tagline: 'Cozy Mountain Landscape Art • Best for Heavyweight Hoodies',
    price: 100,
    originalPrice: 199,
    category: 'hoodies',
    rating: 4.6,
    reviewCount: 84,
    images: [
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80&w=600'
    ],
    colors: [
      { name: 'Alpine Teal', hex: '#004953' },
      { name: 'Melange Grey', hex: '#BEBFC5' },
      { name: 'Pitch Black', hex: '#0F0F0F' }
    ],
    sizes: DESIGN_SIZES,
    description: 'A breathtakingly cozy winter mountain landscape with a flowing river and rustic timber cabins. Highly suitable for center-chest hoodie printing, creating an atmospheric, artistic outdoor vibe.',
    specifications: [
      'Fine stroke wilderness detailing',
      'High insulation print layer thickness',
      'Designed to pair beautifully with heavy loopback fleece',
      'Double-cured ink layers for extreme longevity'
    ],
    reviews: [
      {
        id: 'r-d125-1',
        author: 'Yash Patel',
        rating: 5,
        date: '2026-06-16',
        comment: 'Perfect cozy winter hoodie design. The river cabin print detail looks incredibly high-quality.',
        fit: 'True to Size',
        verified: true
      }
    ],
    isBestSeller: false,
    isNewArrival: true
  },
  {
    id: 'design-139',
    title: 'Design #139: Playful Dolphin Ocean Splash',
    tagline: 'Cheerful Dolphin Cartoon Design • Best for Kids T-Shirts & Sports Kits',
    price: 100,
    originalPrice: 199,
    category: 'sports', // Sports Kits
    rating: 4.8,
    reviewCount: 132,
    images: [
      'https://images.unsplash.com/photo-1570481662006-a3a13746fe4e?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&q=80&w=600'
    ],
    colors: [
      { name: 'Ocean Aqua Blue', hex: '#00F0FF' },
      { name: 'Pure White', hex: '#FFFFFF' },
      { name: 'Navy Blue Jersey', hex: '#000080' }
    ],
    sizes: DESIGN_SIZES,
    description: 'A playful and friendly cartoon dolphin splashing out of crystal clear water. A perfect, joyful print choice for kids t-shirts, moisture-wicking sports jerseys, and swimming gear.',
    specifications: [
      'Ultra-bright non-fading pigments',
      'Dri-fit micro-polyester fabric compatible',
      'Hypoallergenic kid-safe skin inks used',
      'Smooth sublimated permanent print feel'
    ],
    reviews: [
      {
        id: 'r-d139-1',
        author: 'Riya Sen',
        rating: 5,
        date: '2026-06-24',
        comment: 'My son loves his custom dolphin print jersey! The print has been through many washes and still looks brand new.',
        fit: 'True to Size',
        verified: true
      }
    ],
    isBestSeller: false,
    isNewArrival: false
  },
  {
    id: 'design-143',
    title: 'Design #143: Scenic Golden Deer Woods',
    tagline: 'Elegant Birch Forest Deer Family • Best for Hoodies & Sarees',
    price: 100,
    originalPrice: 199,
    category: 'hoodies',
    rating: 4.9,
    reviewCount: 108,
    images: [
      'https://images.unsplash.com/photo-1484406566174-9da000fda645?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&q=80&w=600'
    ],
    colors: [
      { name: 'Forest Moss Green', hex: '#3B7A57' },
      { name: 'Warm Mustard Sand', hex: '#E1AD01' },
      { name: 'Midnight Pitch Black', hex: '#0E0F10' }
    ],
    sizes: DESIGN_SIZES,
    description: 'An elegant scenery of a graceful deer family in a golden birch forest. This aesthetic woodland design works beautifully when printed on soft pullover hoodies, custom kurtis, or as a continuous floral/woodland border on traditional sarees.',
    specifications: [
      'Aesthetic natural warm color palette',
      'High precision ink flow for fine tree lines',
      'Suitable for premium organic apparel base',
      'Long-lasting wash resistant ink layers'
    ],
    reviews: [
      {
        id: 'r-d143-1',
        author: 'Sneha Murthy',
        rating: 5,
        date: '2026-06-17',
        comment: 'Extremely elegant. It looks so beautiful on my forest green custom hoodie! High print quality.',
        fit: 'True to Size',
        verified: true
      }
    ],
    isBestSeller: false,
    isNewArrival: true
  }
];
