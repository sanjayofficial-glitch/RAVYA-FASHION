/** Shared inventory vocabulary (PRD Phase 5). Importable from routes and UI. */

export const STATUSES = ['in-store', 'tried', 'sold', 'restocked'] as const;
export type InventoryStatus = (typeof STATUSES)[number];

export interface InventoryEntry {
  status: InventoryStatus;
  updatedAt: string;
}
