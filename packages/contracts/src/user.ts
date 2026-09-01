// =============================================================================
// BuyTuk Academy - User Contracts
// =============================================================================

import { UserRole } from "./enums.js";

export interface BaseUser {
  id: number;
  username: string;
  role: UserRole;
  email?: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt?: Date | null;
}

export interface StudentProfile {
  id: number;
  userId: number;
  displayName?: string | null;
  grade?: string | null;
  nativeLanguage?: string | null;
  learningDisabilities?: Record<string, any> | null;
  parentContact?: string | null;
}

export interface TeacherProfile {
  id: number;
  userId: number;
  displayName?: string | null;
  bio?: string | null;
  specialization?: string | null;
}

export interface ParentProfile {
  id: number;
  userId: number;
  displayName?: string | null;
  phone?: string | null;
  relationship?: string | null;
}

export interface PrincipalProfile {
  id: number;
  userId: number;
  displayName?: string | null;
  schoolName?: string | null;
}

export type UserProfile = StudentProfile | TeacherProfile | ParentProfile | PrincipalProfile;

export interface UserWithProfile extends BaseUser {
  profile?: UserProfile;
}