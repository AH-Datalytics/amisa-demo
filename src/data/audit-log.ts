import { AuditLogEntry } from "@/lib/types";

export const auditLog: AuditLogEntry[] = [
  {
    id: "log-001",
    timestamp: "2026-04-05T14:30:00Z",
    userId: "admin-hq",
    userName: "Dr. Dereck Rhoads",
    action: "Login",
    details: "Logged in from 198.51.100.42",
    schoolId: null
  },
  {
    id: "log-002",
    timestamp: "2026-04-05T14:15:00Z",
    userId: "admin-hq",
    userName: "Dr. Dereck Rhoads",
    action: "Data Export",
    details: "Exported benchmarking report as PDF for all schools",
    schoolId: null
  },
  {
    id: "log-003",
    timestamp: "2026-04-05T10:20:00Z",
    userId: "admin-interamericano",
    userName: "Patricia Mendoza",
    action: "Login",
    details: "Logged in from 201.141.32.15",
    schoolId: "colegio-interamericano-norte"
  },
  {
    id: "log-004",
    timestamp: "2026-04-05T08:15:00Z",
    userId: "user-superintendent-tropical",
    userName: "Isabella Vargas",
    action: "Login",
    details: "Logged in from 186.72.91.88",
    schoolId: "academia-tropical"
  },
  {
    id: "log-005",
    timestamp: "2026-04-04T16:20:00Z",
    userId: "user-learning-austral",
    userName: "Sofia Valenzuela",
    action: "Data Submission",
    details: "Submitted 2025-26 enrollment data for Learning Office",
    schoolId: "academia-austral"
  },
  {
    id: "log-006",
    timestamp: "2026-04-04T11:20:00Z",
    userId: "user-hr-academia",
    userName: "Juliana Oliveira",
    action: "Login",
    details: "Logged in from 189.45.201.77",
    schoolId: "academia-americana-sp"
  },
  {
    id: "log-007",
    timestamp: "2026-04-04T09:15:00Z",
    userId: "admin-academia",
    userName: "Maria Santos",
    action: "Login",
    details: "Logged in from 189.45.201.76",
    schoolId: "academia-americana-sp"
  },
  {
    id: "log-008",
    timestamp: "2026-04-03T13:40:00Z",
    userId: "user-admissions-istmo",
    userName: "Carmen Delgado",
    action: "Data Submission",
    details: "Submitted 2025-26 enrollment data for Admissions Office",
    schoolId: "instituto-del-istmo"
  },
  {
    id: "log-009",
    timestamp: "2026-04-03T11:45:00Z",
    userId: "user-admissions",
    userName: "Carlos Rivera",
    action: "Login",
    details: "Logged in from 189.45.201.78",
    schoolId: "academia-americana-sp"
  },
  {
    id: "log-010",
    timestamp: "2026-04-02T14:55:00Z",
    userId: "user-medical-island",
    userName: "Jennifer Williams",
    action: "Login",
    details: "Logged in from 192.168.23.101",
    schoolId: "island-international"
  },
  {
    id: "log-011",
    timestamp: "2026-04-02T08:45:00Z",
    userId: "admin-colombiano",
    userName: "Ana Lucia Gutierrez",
    action: "Survey Completed",
    details: "Completed Annual Enrollment & Tuition Data Collection survey",
    schoolId: "instituto-colombiano"
  },
  {
    id: "log-012",
    timestamp: "2026-04-01T14:15:00Z",
    userId: "user-business-colombiano",
    userName: "Felipe Cardenas",
    action: "Data Export",
    details: "Exported financial benchmarking data as Excel",
    schoolId: "instituto-colombiano"
  },
  {
    id: "log-013",
    timestamp: "2026-03-31T12:10:00Z",
    userId: "admin-caribe",
    userName: "Rafael Diaz",
    action: "Login",
    details: "Logged in from 187.44.23.99",
    schoolId: "colegio-caribe"
  },
  {
    id: "log-014",
    timestamp: "2026-03-30T11:30:00Z",
    userId: "admin-pacifico",
    userName: "Ricardo Flores",
    action: "User Created",
    details: "Created new user account for Alumni Office",
    schoolId: "colegio-pacifico"
  },
  {
    id: "log-015",
    timestamp: "2026-03-29T10:25:00Z",
    userId: "admin-andino",
    userName: "Diego Morales",
    action: "Login",
    details: "Logged in from 190.124.56.33",
    schoolId: "colegio-andino"
  },
  {
    id: "log-016",
    timestamp: "2026-03-28T15:30:00Z",
    userId: "user-hr-interamericano",
    userName: "Jorge Ramirez",
    action: "Data Submission",
    details: "Submitted faculty compensation data for HR Office",
    schoolId: "colegio-interamericano-norte"
  },
  {
    id: "log-017",
    timestamp: "2026-03-27T09:50:00Z",
    userId: "admin-centroamericana",
    userName: "Miguel Angel Torres",
    action: "Login",
    details: "Logged in from 190.56.88.44",
    schoolId: "escuela-centroamericana"
  },
  {
    id: "log-018",
    timestamp: "2026-03-26T16:40:00Z",
    userId: "admin-bolivariano",
    userName: "Gabriela Paz",
    action: "Survey Completed",
    details: "Completed Annual Enrollment & Tuition Data Collection survey",
    schoolId: "instituto-bolivariano"
  },
  {
    id: "log-019",
    timestamp: "2026-03-25T15:10:00Z",
    userId: "user-alumni-pacifico",
    userName: "Rodrigo Silva",
    action: "Login",
    details: "Logged in from 152.168.23.77",
    schoolId: "colegio-pacifico"
  },
  {
    id: "log-020",
    timestamp: "2026-03-24T13:20:00Z",
    userId: "admin-hq",
    userName: "Dr. Dereck Rhoads",
    action: "Survey Approved",
    details: "Approved Faculty Compensation Survey for distribution",
    schoolId: null
  },
  {
    id: "log-021",
    timestamp: "2026-03-23T10:35:00Z",
    userId: "admin-academia",
    userName: "Maria Santos",
    action: "Role Changed",
    details: "Updated user role from school_user to school_admin for Carlos Rivera",
    schoolId: "academia-americana-sp"
  },
  {
    id: "log-022",
    timestamp: "2026-03-22T14:45:00Z",
    userId: "admin-hq",
    userName: "Dr. Dereck Rhoads",
    action: "Data Export",
    details: "Exported MAP assessment trends report as PDF",
    schoolId: null
  },
  {
    id: "log-023",
    timestamp: "2026-03-21T09:15:00Z",
    userId: "user-admissions",
    userName: "Carlos Rivera",
    action: "Password Reset",
    details: "Requested password reset via email",
    schoolId: "academia-americana-sp"
  },
  {
    id: "log-024",
    timestamp: "2026-03-20T16:30:00Z",
    userId: "admin-colombiano",
    userName: "Ana Lucia Gutierrez",
    action: "User Created",
    details: "Created new user account for Business Office",
    schoolId: "instituto-colombiano"
  },
  {
    id: "log-025",
    timestamp: "2026-03-19T11:00:00Z",
    userId: "admin-hq",
    userName: "Dr. Dereck Rhoads",
    action: "Survey Approved",
    details: "Approved Annual Enrollment & Tuition Data Collection survey for distribution",
    schoolId: null
  }
];
