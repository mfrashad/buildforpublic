export * from "@/convex/positionsData";

import { POSITIONS, type Department, type Position } from "@/convex/positionsData";

export const OPEN_POSITIONS = POSITIONS.filter((p) => !p.filled);

export const DEPARTMENTS: Department[] = [
  "Events",
  "Outreach",
  "Content",
  "Finance",
  "Tech",
];

export function byDepartment(positions: Position[] = POSITIONS) {
  return DEPARTMENTS.map((dept) => ({
    department: dept,
    positions: positions.filter((p) => p.department === dept),
  })).filter((g) => g.positions.length > 0);
}
