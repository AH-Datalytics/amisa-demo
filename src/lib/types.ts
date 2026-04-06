export type Role = "network_admin" | "school_admin" | "school_user";
export type CurriculumType = "AP" | "IB" | "AP & IB";
export type SurveyStatus = "draft" | "pending_approval" | "approved" | "distributed" | "completed";
export type Office = "superintendent" | "learning" | "hr" | "admissions" | "business" | "medical" | "alumni";

export interface School {
  id: string;
  name: string;
  country: string;
  city: string;
  region: "South America" | "Central America" | "Caribbean" | "North America";
  enrollment: number;
  gradeRange: string;
  curriculum: CurriculumType;
  accreditation: string;
  founded: number;
  tuitionLow: number;
  tuitionHigh: number;
  sizeCategory: "large" | "medium" | "small";
  stateDeptAssisted: boolean;
}

export interface AnnualMetrics {
  schoolId: string;
  year: number;
  enrollment: number;
  applications: number;
  acceptances: number;
  enrolledNew: number;
  retentionRate: number;
  studentTeacherRatio: number;
  facultyCount: number;
  facultyTurnoverRate: number;
  tuitionLow: number;
  tuitionHigh: number;
  operatingBudget: number;
  financialAidPercent: number;
  facultyHostCountry: number;
  facultyUS: number;
  facultyThirdCountry: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  schoolId: string | null;
  office: Office | null;
  lastLogin: string;
}

export interface Survey {
  id: string;
  title: string;
  status: SurveyStatus;
  createdBy: string;
  createdAt: string;
  distributedAt: string | null;
  dueDate: string | null;
  totalSchools: number;
  completedSchools: number;
  completions: SurveyCompletion[];
  questionCount: number;
}

export interface SurveyCompletion {
  schoolId: string;
  schoolName: string;
  completed: boolean;
  completedAt: string | null;
}

export interface MAPScore {
  schoolId: string;
  year: number;
  term: "fall" | "winter" | "spring";
  grade: number;
  subject: "Mathematics" | "Reading" | "Language Usage" | "Science";
  meanRIT: number;
  percentile: number;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  action: string;
  details: string;
  schoolId: string | null;
}

export interface FilterState {
  sizeCategory: string[];
  tuitionBand: string[];
  region: string[];
  curriculum: string[];
  country: string[];
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  chartConfig?: ChartConfig | null;
  timestamp: Date;
}

export interface ChartConfig {
  type: "bar" | "line" | "pie" | "horizontal_bar";
  title: string;
  data: Record<string, unknown>[];
  xKey: string;
  yKey: string | string[];
  colors?: string[];
}
