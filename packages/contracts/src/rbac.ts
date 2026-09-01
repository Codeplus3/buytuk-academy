// =============================================================================
// BuyTuk Academy - RBAC Contracts
// =============================================================================

import { UserRole } from "./enums.js";

export type PermissionScope = "global" | "school" | "class" | "personal";
export type PermissionAction = "create" | "read" | "update" | "delete" | "manage";

export interface Permission {
  resource: string;
  action: PermissionAction;
  scope: PermissionScope;
}

export interface Role {
  id: string;
  name: UserRole;
  displayName: string;
  permissions: Permission[];
  isSystem: boolean;
}

export interface RoleAssignment {
  userId: number;
  roleId: string;
  scopeId?: string | null; // e.g., classId or schoolId
  assignedAt: Date;
  assignedBy: number;
}

export interface CheckPermissionRequest {
  userId: number;
  resource: string;
  action: PermissionAction;
  scopeId?: string;
}

export const SYSTEM_ROLES: Record<UserRole, Role> = {
  [UserRole.ADMIN]: {
    id: "admin",
    name: UserRole.ADMIN,
    displayName: "مسؤول النظام",
    permissions: [{ resource: "*", action: "manage", scope: "global" }],
    isSystem: true,
  },
  [UserRole.PRINCIPAL]: {
    id: "principal",
    name: UserRole.PRINCIPAL,
    displayName: "مدير المدرسة",
    permissions: [
      { resource: "students", action: "read", scope: "school" },
      { resource: "teachers", action: "manage", scope: "school" },
      { resource: "classes", action: "manage", scope: "school" },
      { resource: "reports", action: "read", scope: "school" },
    ],
    isSystem: true,
  },
  [UserRole.TEACHER]: {
    id: "teacher",
    name: UserRole.TEACHER,
    displayName: "المعلم",
    permissions: [
      { resource: "students", action: "read", scope: "class" },
      { resource: "classes", action: "manage", scope: "class" },
      { resource: "passages", action: "manage", scope: "class" },
      { resource: "reports", action: "read", scope: "class" },
    ],
    isSystem: true,
  },
  [UserRole.PARENT]: {
    id: "parent",
    name: UserRole.PARENT,
    displayName: "ولي الأمر",
    permissions: [
      { resource: "children", action: "read", scope: "personal" },
      { resource: "reports", action: "read", scope: "personal" },
    ],
    isSystem: true,
  },
  [UserRole.STUDENT]: {
    id: "student",
    name: UserRole.STUDENT,
    displayName: "الطالب",
    permissions: [
      { resource: "own_profile", action: "read", scope: "personal" },
      { resource: "own_reports", action: "read", scope: "personal" },
      { resource: "passages", action: "read", scope: "global" },
    ],
    isSystem: true,
  },
};