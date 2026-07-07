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
