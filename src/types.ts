/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  image: string;
  closeupImage?: string;
  closeupDetails?: string;
  category: string;
  features: string[];
}

export interface PortfolioItem {
  id: string;
  title: string;
  category: 'tshirts' | 'blouses' | 'sports' | 'corporate' | 'school' | 'events' | 'family';
  image: string;
  description: string;
  tag: string;
}

export interface TestimonialItem {
  id: string;
  name: string;
  role: string;
  avatar: string;
  rating: number;
  review: string;
  product: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

export interface StatItem {
  id: string;
  label: string;
  value: string;
  suffix: string;
  description: string;
}

export interface QuoteRequest {
  name: string;
  phone: string;
  email: string;
  requirement: string;
  quantity: number;
  message: string;
}

export interface ProductReview {
  id: string;
  author: string;
  rating: number;
  date: string;
  comment: string;
  fit: 'Runs Small' | 'True to Size' | 'Runs Large';
  verified: boolean;
}

export interface ShopProduct {
  id: string;
  title: string;
  tagline: string;
  price: number; // in INR
  originalPrice: number; // for discount display
  category: 'streetwear' | 'hoodies' | 'boutique' | 'sports' | 'accessories';
  rating: number;
  reviewCount: number;
  images: string[]; // slideshow images
  colors: { name: string; hex: string }[];
  sizes: string[];
  description: string;
  specifications: string[];
  reviews: ProductReview[];
  isBestSeller?: boolean;
  isNewArrival?: boolean;
  stockRemaining?: number;
}

export interface CustomApparelDesign {
  garmentType: 'tshirt' | 'hoodie' | 'sweatshirt' | 'polo';
  color: { name: string; hex: string };
  printMethod: 'screen' | 'digital' | 'foil' | 'embroidery';
  customText: string;
  textPosition: 'chest' | 'back' | 'pocket' | 'sleeve';
  fontFamily: string;
  textColor: string;
  stickerUrl?: string;
  customLogoUrl?: string; // Simulated file upload
  printReadyFileUrl?: string; // Real Firebase Storage URL for print-ready file (PDF/PNG)
  printReadyFileName?: string; // Original filename of print-ready file
}

export interface CartItem {
  id: string; // Unique string including product ID, color, size, and design hash
  productId: string;
  title: string;
  price: number;
  image: string;
  color: { name: string; hex: string };
  size: string;
  quantity: number;
  isCustom?: boolean;
  customDesign?: CustomApparelDesign;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
}

