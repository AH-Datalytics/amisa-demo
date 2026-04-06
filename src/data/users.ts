import { User } from "@/lib/types";

export const users: User[] = [
  // Demo login users
  {
    id: "admin-hq",
    name: "Dr. Dereck Rhoads",
    email: "dereck@amisa.us",
    role: "network_admin",
    schoolId: null,
    office: null,
    lastLogin: "2026-04-05T14:30:00Z"
  },
  {
    id: "admin-academia",
    name: "Maria Santos",
    email: "msantos@academia-sp.edu",
    role: "school_admin",
    schoolId: "academia-americana-sp",
    office: null,
    lastLogin: "2026-04-04T09:15:00Z"
  },
  {
    id: "user-admissions",
    name: "Carlos Rivera",
    email: "crivera@academia-sp.edu",
    role: "school_user",
    schoolId: "academia-americana-sp",
    office: "admissions",
    lastLogin: "2026-04-03T11:45:00Z"
  },
  // Additional users across schools
  {
    id: "admin-interamericano",
    name: "Sarah Mitchell",
    email: "smitchell@interamericano.edu.mx",
    role: "school_admin",
    schoolId: "colegio-interamericano-norte",
    office: null,
    lastLogin: "2026-04-05T10:20:00Z"
  },
  {
    id: "user-hr-interamericano",
    name: "Jorge Ramirez",
    email: "jramirez@interamericano.edu.mx",
    role: "school_user",
    schoolId: "colegio-interamericano-norte",
    office: "hr",
    lastLogin: "2026-03-28T15:30:00Z"
  },
  {
    id: "admin-colombiano",
    name: "Ana Lucia Gutierrez",
    email: "agutierrez@colombiano.edu.co",
    role: "school_admin",
    schoolId: "instituto-colombiano",
    office: null,
    lastLogin: "2026-04-02T08:45:00Z"
  },
  {
    id: "user-business-colombiano",
    name: "Felipe Cardenas",
    email: "fcardenas@colombiano.edu.co",
    role: "school_user",
    schoolId: "instituto-colombiano",
    office: "business",
    lastLogin: "2026-04-01T14:15:00Z"
  },
  {
    id: "admin-pacifico",
    name: "David Thompson",
    email: "dthompson@pacifico.edu.cl",
    role: "school_admin",
    schoolId: "colegio-pacifico",
    office: null,
    lastLogin: "2026-03-30T11:30:00Z"
  },
  {
    id: "user-learning-austral",
    name: "Emily Parker",
    email: "eparker@austral.edu.ar",
    role: "school_user",
    schoolId: "academia-austral",
    office: "learning",
    lastLogin: "2026-04-04T16:20:00Z"
  },
  {
    id: "admin-centroamericana",
    name: "Robert Campbell",
    email: "rcampbell@centroamericana.edu.gt",
    role: "school_admin",
    schoolId: "escuela-centroamericana",
    office: null,
    lastLogin: "2026-03-27T09:50:00Z"
  },
  {
    id: "user-admissions-istmo",
    name: "Carmen Delgado",
    email: "cdelgado@istmo.edu.pa",
    role: "school_user",
    schoolId: "instituto-del-istmo",
    office: "admissions",
    lastLogin: "2026-04-03T13:40:00Z"
  },
  {
    id: "admin-andino",
    name: "Diego Morales",
    email: "dmorales@andino.edu.ec",
    role: "school_admin",
    schoolId: "colegio-andino",
    office: null,
    lastLogin: "2026-03-29T10:25:00Z"
  },
  {
    id: "user-superintendent-tropical",
    name: "Isabella Vargas",
    email: "ivargas@tropical.edu.cr",
    role: "school_user",
    schoolId: "academia-tropical",
    office: "superintendent",
    lastLogin: "2026-04-05T08:15:00Z"
  },
  {
    id: "admin-caribe",
    name: "Rafael Diaz",
    email: "rdiaz@caribe.edu.do",
    role: "school_admin",
    schoolId: "colegio-caribe",
    office: null,
    lastLogin: "2026-03-31T12:10:00Z"
  },
  {
    id: "user-medical-island",
    name: "Jennifer Williams",
    email: "jwilliams@island-intl.edu",
    role: "school_user",
    schoolId: "island-international",
    office: "medical",
    lastLogin: "2026-04-02T14:55:00Z"
  },
  {
    id: "admin-bolivariano",
    name: "Gabriela Paz",
    email: "gpaz@bolivariano.edu.bo",
    role: "school_admin",
    schoolId: "instituto-bolivariano",
    office: null,
    lastLogin: "2026-03-26T16:40:00Z"
  },
  {
    id: "user-hr-academia",
    name: "Juliana Oliveira",
    email: "joliveira@academia-sp.edu",
    role: "school_user",
    schoolId: "academia-americana-sp",
    office: "hr",
    lastLogin: "2026-04-04T11:20:00Z"
  },
  {
    id: "user-alumni-pacifico",
    name: "James Hartley",
    email: "jhartley@pacifico.edu.cl",
    role: "school_user",
    schoolId: "colegio-pacifico",
    office: "alumni",
    lastLogin: "2026-03-25T15:10:00Z"
  }
];
