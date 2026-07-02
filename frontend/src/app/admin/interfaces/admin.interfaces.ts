export interface AdminUser {
  id: number;
  email: string;
  name?: string;
  role: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  user: AdminUser;
}

export interface Project {
  id?: number;
  title: string;
  titleEn?: string;
  description: string;
  descriptionEn?: string;
  imageUrl?: string;
  link?: string;
  github?: string;
  tags: string[];
  featured?: boolean;
  published?: boolean;
  order?: number;
  accent?: string;
  slug?: string;
  challenge?: string;
  challengeEn?: string;
  solution?: string;
  solutionEn?: string;
  results?: string[];
  resultsEn?: string[];
  role?: string;
  duration?: string;
}

export interface Experience {
  id?: number;
  company: string;
  position: string;
  positionEn?: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  description: string;
  descriptionEn?: string;
  skills: string[];
  order?: number;
}

export interface Education {
  id?: number;
  school: string;
  degree: string;
  field: string;
  startDate: string;
  endDate?: string;
  description?: string;
  order?: number;
}

export interface BlogPost {
  id?: number;
  title: string;
  titleEn?: string;
  slug?: string;
  summary: string;
  summaryEn?: string;
  content: string;
  contentEn?: string;
  imageUrl?: string;
  published?: boolean;
  featured?: boolean;
  readTime?: number;
  tags: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface Skill {
  id?: number;
  name: string;
  category: string;
  icon?: string;
  level?: number;
  order?: number;
}

export interface Profile {
  id?: number;
  name: string;
  title: string;
  titleEn?: string;
  bio: string;
  bioEn?: string;
  avatarUrl?: string;
  email?: string;
  phone?: string;
  location?: string;
  available?: boolean;
  socials?: Record<string, string>;
  cvUrl?: string;
  updatedAt?: string;
}

export interface ContactMessage {
  id: number;
  name: string;
  email: string;
  subject?: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export interface DashboardStats {
  projects: number;
  experience: number;
  education: number;
  blog: number;
  skills: number;
  messages: number;
  unreadMessages: number;
  updatedAt: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface QueryOptions {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
