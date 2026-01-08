
export type SchoolType = 'صناعي' | 'فندقي' | 'تجاري' | 'زراعي';

export interface Checklist {
  teamFormed: boolean;
  visionMission: boolean;
  safetyProcedures: boolean;
  attendanceStats: boolean;
  qualityDatabase: boolean;
  programFiles: boolean;
  assignmentsLog: boolean;
  warningSigns: boolean;
  fireExtinguishers: boolean;
  trainingNeeds: boolean;
}

export interface School {
  id: string;
  name: string;
  type: SchoolType;
  areaId: string;
  adminId: string;
  accreditationDate: string;
  checklist: Checklist;
  completionPercentage: number;
}

export interface Area {
  id: string;
  name: string;
  adminId: string;
}

export interface User {
  id: string;
  username: string;
  name: string;
  role: 'admin' | 'superadmin';
  areaId?: string;
}

export interface Stats {
  totalSchools: number;
  overallCompletion: number;
  typeCompletion: Record<SchoolType, number>;
  areaCompletion: Record<string, number>;
}
