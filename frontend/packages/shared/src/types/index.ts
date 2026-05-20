// Provider types matching backend DTOs

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  pagination?: PaginationMeta;
  errors: string[];
  timestamp: string;
}

export interface PaginationMeta {
  currentPage: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasPrevious: boolean;
  hasNext: boolean;
}

export interface PaginatedResponse<T> {
  items: T[];
  pagination: PaginationMeta;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  expiresAt: string;
  user: UserDto;
}

export interface UserDto {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  avatar?: string;
  roles: string[];
  providerId?: string;
}

export interface ProviderDto {
  id: string;
  userId: string;
  businessName: string;
  slug: string;
  description?: string;
  phone?: string;
  email?: string;
  website?: string;
  logoUrl?: string;
  coverImageUrl?: string;
  status: ProviderStatus;
  providerType: ProviderType;
  isVerified: boolean;
  isFeatured: boolean;
  averageRating: number;
  totalReviews: number;
  followerCount: number;
  city?: string;
  state?: string;
  postalCode?: string;
  instagramUrl?: string;
  facebookUrl?: string;
  tikTokUrl?: string;
  linkedInUrl?: string;
  gitHubUrl?: string;
  businessHoursJson?: string;
  createdAt: string;
  services: ProviderServiceDto[];
  galleryImages: GalleryImageDto[];
  serviceAreas: string[];
}

export interface ProviderListDto {
  id: string;
  businessName: string;
  slug: string;
  description?: string;
  logoUrl?: string;
  coverImageUrl?: string;
  providerType: ProviderType;
  isVerified: boolean;
  isFeatured: boolean;
  averageRating: number;
  totalReviews: number;
  followerCount: number;
  city?: string;
  state?: string;
  categories: string[];
  primaryImageUrl?: string;
}

export interface ProviderServiceDto {
  id: string;
  name: string;
  description?: string;
  priceFrom?: number;
  priceTo?: number;
  priceNote?: string;
  durationMinutes?: number;
  categoryName?: string;
  categoryId: string;
}

export interface GalleryImageDto {
  id: string;
  imageUrl: string;
  thumbnailUrl?: string;
  altText?: string;
  caption?: string;
  sortOrder: number;
  isPrimary: boolean;
}

export interface CategoryDto {
  id: string;
  name: string;
  slug: string;
  iconName?: string;
  marketplaceType: ProviderType;
  parentCategoryId?: string;
  sortOrder: number;
  providerCount: number;
  subCategories: CategoryDto[];
}

export interface ReviewDto {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  providerId: string;
  rating: number;
  title?: string;
  comment?: string;
  status: ReviewStatus;
  providerReply?: string;
  createdAt: string;
}

export interface SuburbDto {
  id: string;
  name: string;
  slug: string;
  state: string;
  postCode: string;
  providerCount: number;
}

// Enums
export enum ProviderStatus {
  Pending = 0,
  Approved = 1,
  Suspended = 2,
  Rejected = 3,
}

export enum ProviderType {
  Beauty = 0,
  ITService = 1,
  HomeService = 2,
  HealthWellness = 3,
  Education = 4,
  EventsEntertainment = 5,
}

export enum ReviewStatus {
  Pending = 0,
  Approved = 1,
  Rejected = 2,
}

// Request types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  phoneNumber?: string;
}

export interface ProviderSearchRequest {
  searchTerm?: string;
  marketplaceType?: ProviderType;
  categoryId?: string;
  suburbId?: string;
  city?: string;
  isFeatured?: boolean;
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortDescending?: boolean;
}

export interface CreateProviderRequest {
  businessName: string;
  description?: string;
  phone?: string;
  email?: string;
  website?: string;
  providerType: ProviderType;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  instagramUrl?: string;
  facebookUrl?: string;
  tikTokUrl?: string;
  linkedInUrl?: string;
  gitHubUrl?: string;
  businessHoursJson?: string;
  serviceAreaSuburbIds?: string[];
}

export interface CreateReviewRequest {
  providerId: string;
  rating: number;
  title?: string;
  comment?: string;
}
