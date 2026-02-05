// User Types
export interface User {
  id: string;
  email: string;
  password?: string;
  name: string;
  role: 'superadmin' | 'admin' | 'member' | 'user';
  membershipStatus: 'active' | 'inactive' | 'suspended' | 'pending';
  createdAt: string;
  updatedAt: string;
  lastLogin?: string;
  avatar?: string;
  phone?: string;
  address?: Address;
  preferences?: UserPreferences;
}

export interface Address {
  street: string;
  city: string;
  province: string;
  postalCode: string;
  country: string;
}

export interface UserPreferences {
  newsletter: boolean;
  notifications: boolean;
  currency: string;
  language: string;
}

// Product Types
export interface Product {
  id: string;
  name: string;
  description: string;
  shortDescription: string;
  price: number;
  comparePrice?: number;
  sku: string;
  category: string;
  subcategory?: string;
  images: string[];
  stock: number;
  minOrderQuantity: number;
  maxOrderQuantity: number;
  weight: number;
  dimensions: Dimensions;
  specifications: ProductSpecification[];
  certifications: string[];
  tags: string[];
  isActive: boolean;
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
  rating: number;
  reviewCount: number;
}

export interface Dimensions {
  length: number;
  width: number;
  height: number;
  unit: string;
}

export interface ProductSpecification {
  label: string;
  value: string;
}

// Cart Types
export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Cart {
  items: CartItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  couponCode?: string;
  discount: number;
}

// Order Types
export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  shippingStatus: ShippingStatus;
  subtotal: number;
  tax: number;
  shipping: number;
  discount: number;
  total: number;
  shippingAddress: Address;
  billingAddress: Address;
  paymentMethod: string;
  createdAt: string;
  updatedAt: string;
  trackingNumber?: string;
  notes?: string;
}

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  total: number;
}

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded' | 'cancelled';
export type ShippingStatus = 'pending' | 'processing' | 'shipped' | 'in_transit' | 'delivered';

// PubMed Research Types
export interface PubMedArticle {
  pmid: string;
  title: string;
  abstract: string;
  authors: string[];
  journal: string;
  publicationDate: string;
  year: number;
  doi?: string;
  url: string;
  keywords: string[];
}

export interface PubMedSearchResponse {
  articles: PubMedArticle[];
  totalCount: number;
  page: number;
  perPage: number;
}

// Wellness Journal Types
export interface WellnessEntry {
  id: string;
  userId: string;
  date: string;
  notes: string;
  wellBeingScale: number;
  photos: string[];
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Reminder {
  id: string;
  userId: string;
  title: string;
  time: string;
  days: number[];
  isActive: boolean;
  createdAt: string;
}

// AI Agent Types
export interface AIAgent {
  id: string;
  name: string;
  description: string;
  provider: string;
  model: string;
  apiKey?: string;
  isActive: boolean;
  settings: Record<string, any>;
  usageStats: AgentUsageStats;
}

export interface AgentUsageStats {
  totalCalls: number;
  totalTokens: number;
  lastUsed: string;
  costEstimate: number;
}

// Payment Types
export interface PaymentMethod {
  id: string;
  type: 'stripe' | 'paypal' | 'crypto' | 'google_pay' | 'apple_pay';
  name: string;
  isActive: boolean;
  isTestMode: boolean;
  config: Record<string, string>;
}

export interface CryptoPayment {
  id: string;
  orderId: string;
  currency: string;
  amount: number;
  address: string;
  qrCode: string;
  status: 'pending' | 'confirmed' | 'expired';
  expiresAt: string;
}

// API Configuration Types
export interface APIConfig {
  id: string;
  name: string;
  provider: string;
  apiKey: string;
  baseUrl?: string;
  isActive: boolean;
  rateLimit?: number;
  usageCount: number;
}

// Dashboard Stats
export interface DashboardStats {
  totalUsers: number;
  totalOrders: number;
  totalRevenue: number;
  totalProducts: number;
  recentOrders: Order[];
  salesChart: ChartData[];
  userGrowth: ChartData[];
}

export interface ChartData {
  label: string;
  value: number;
  date?: string;
}

// Settings Types
export interface SiteSettings {
  siteName: string;
  siteDescription: string;
  contactEmail: string;
  supportPhone: string;
  address: string;
  socialLinks: SocialLinks;
  maintenanceMode: boolean;
  allowRegistration: boolean;
  defaultCurrency: string;
  taxRate: number;
  shippingRates: ShippingRate[];
}

export interface SocialLinks {
  facebook?: string;
  twitter?: string;
  instagram?: string;
  linkedin?: string;
  youtube?: string;
}

export interface ShippingRate {
  name: string;
  minWeight: number;
  maxWeight: number;
  price: number;
  region: string;
}

// Notification Types
export interface Notification {
  id: string;
  userId: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  actionUrl?: string;
}

// Search Filters
export interface ProductFilters {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  search?: string;
  sortBy?: 'price_asc' | 'price_desc' | 'name_asc' | 'name_desc' | 'newest' | 'popular';
}

export interface ResearchFilters {
  yearFrom?: number;
  yearTo?: number;
  journal?: string;
  author?: string;
  sortBy?: 'relevance' | 'date_desc' | 'date_asc';
}

// Distributor Types
export interface Distributor {
  id: string;
  userId: string;
  businessName: string;
  contactName: string;
  email: string;
  phone: string;
  address: Address;
  territory: string;
  province: string;
  city: string;
  status: 'pending' | 'approved' | 'suspended' | 'rejected';
  tier: 'bronze' | 'silver' | 'gold' | 'platinum';
  discountRate: number;
  minimumOrder: number;
  annualRevenue: number;
  joinedAt: string;
  lastOrderAt?: string;
  notes?: string;
  documents: DistributorDocument[];
}

export interface DistributorDocument {
  id: string;
  name: string;
  type: 'brochure' | 'price_sheet' | 'presentation' | 'contract' | 'marketing' | 'other';
  url: string;
  size: number;
  uploadedAt: string;
  downloadCount: number;
}

export interface DistributorApplication {
  id: string;
  businessName: string;
  contactName: string;
  email: string;
  phone: string;
  address: Address;
  territory: string;
  province: string;
  city: string;
  businessType: 'retail' | 'wholesale' | 'online' | 'clinic' | 'other';
  yearsInBusiness: number;
  currentBrands: string;
  whyInterested: string;
  estimatedMonthlyVolume: string;
  hasStorefront: boolean;
  hasOnlinePresence: boolean;
  status: 'pending' | 'under_review' | 'approved' | 'rejected';
  submittedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  rejectionReason?: string;
}

// Affiliate Types
export interface Affiliate {
  id: string;
  userId: string;
  name: string;
  email: string;
  phone?: string;
  website?: string;
  socialMedia: AffiliateSocialLink[];
  status: 'pending' | 'active' | 'suspended' | 'rejected';
  commissionRate: number;
  totalEarnings: number;
  pendingEarnings: number;
  totalClicks: number;
  totalConversions: number;
  conversionRate: number;
  referralCode: string;
  referralUrl: string;
  joinedAt: string;
  lastPayoutAt?: string;
  paymentMethod?: 'paypal' | 'bank_transfer' | 'crypto';
  paymentDetails?: string;
}

export interface AffiliateSocialLink {
  platform: 'instagram' | 'facebook' | 'twitter' | 'youtube' | 'tiktok' | 'blog' | 'other';
  url: string;
  followers: number;
}

export interface AffiliateApplication {
  id: string;
  name: string;
  email: string;
  phone?: string;
  website?: string;
  socialMedia: AffiliateSocialLink[];
  howDidYouHear: string;
  whyInterested: string;
  promotionMethods: string[];
  audienceDescription: string;
  status: 'pending' | 'under_review' | 'approved' | 'rejected';
  submittedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  rejectionReason?: string;
}

export interface Commission {
  id: string;
  affiliateId: string;
  orderId: string;
  amount: number;
  rate: number;
  status: 'pending' | 'approved' | 'paid' | 'cancelled';
  createdAt: string;
  approvedAt?: string;
  paidAt?: string;
}

// Forum Types
export interface ForumTopic {
  id: string;
  title: string;
  content: string;
  authorId: string;
  authorName: string;
  authorRole: 'distributor' | 'admin';
  category: 'strategy' | 'marketing' | 'products' | 'support' | 'general';
  tags: string[];
  replies: ForumReply[];
  views: number;
  isPinned: boolean;
  isLocked: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ForumReply {
  id: string;
  content: string;
  authorId: string;
  authorName: string;
  authorRole: 'distributor' | 'admin';
  likes: number;
  createdAt: string;
  updatedAt: string;
}

// Disease/Research Library Types
export interface DiseaseEntry {
  id: string;
  name: string;
  category: 'viral' | 'bacterial' | 'parasitic' | 'fungal' | 'other';
  description: string;
  searchTerms: string[];
  isActive: boolean;
  articleCount: number;
  lastSearchedAt?: string;
}

// API Key Types
export interface APIKey {
  id: string;
  name: string;
  service: 'openai' | 'anthropic' | 'google' | 'pubmed' | 'stripe' | 'paypal' | 'other';
  key: string;
  isActive: boolean;
  usageLimit?: number;
  usageCount: number;
  lastUsedAt?: string;
  createdAt: string;
  expiresAt?: string;
}

// AI Chat Types
export interface AIChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
}

export type ExtendedUserRole = 'visitor' | 'customer' | 'affiliate' | 'distributor' | 'admin' | 'superadmin';
