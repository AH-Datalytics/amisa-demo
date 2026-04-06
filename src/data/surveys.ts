import { Survey } from "@/lib/types";

export const surveys: Survey[] = [
  {
    id: "survey-enrollment-tuition",
    title: "Annual Enrollment & Tuition Data Collection",
    status: "distributed",
    createdBy: "AMISA HQ",
    createdAt: "2025-09-15",
    distributedAt: "2025-10-01",
    dueDate: "2025-11-30",
    totalSchools: 12,
    completedSchools: 8,
    questionCount: 10,
    completions: [
      {
        schoolId: "academia-americana-sp",
        schoolName: "Academia Americana de Sao Paulo",
        completed: true,
        completedAt: "2025-10-15T14:30:00Z"
      },
      {
        schoolId: "colegio-interamericano-norte",
        schoolName: "Colegio Interamericano del Norte",
        completed: true,
        completedAt: "2025-10-22T09:45:00Z"
      },
      {
        schoolId: "instituto-colombiano",
        schoolName: "Instituto Colombiano Internacional",
        completed: true,
        completedAt: "2025-10-28T16:20:00Z"
      },
      {
        schoolId: "colegio-pacifico",
        schoolName: "Colegio Pacifico",
        completed: true,
        completedAt: "2025-11-05T11:10:00Z"
      },
      {
        schoolId: "academia-austral",
        schoolName: "Academia Austral",
        completed: true,
        completedAt: "2025-11-08T13:55:00Z"
      },
      {
        schoolId: "escuela-centroamericana",
        schoolName: "Escuela Centroamericana",
        completed: true,
        completedAt: "2025-11-12T10:30:00Z"
      },
      {
        schoolId: "instituto-del-istmo",
        schoolName: "Instituto del Istmo",
        completed: true,
        completedAt: "2025-11-18T15:45:00Z"
      },
      {
        schoolId: "colegio-andino",
        schoolName: "Colegio Andino Internacional",
        completed: true,
        completedAt: "2025-11-25T08:20:00Z"
      },
      {
        schoolId: "academia-tropical",
        schoolName: "Academia Tropical",
        completed: false,
        completedAt: null
      },
      {
        schoolId: "colegio-caribe",
        schoolName: "Colegio Caribe",
        completed: false,
        completedAt: null
      },
      {
        schoolId: "island-international",
        schoolName: "Island International Academy",
        completed: false,
        completedAt: null
      },
      {
        schoolId: "instituto-bolivariano",
        schoolName: "Instituto Bolivariano",
        completed: false,
        completedAt: null
      }
    ]
  },
  {
    id: "survey-faculty-comp",
    title: "Faculty Compensation Survey",
    status: "distributed",
    createdBy: "AMISA HQ",
    createdAt: "2025-11-01",
    distributedAt: "2025-11-15",
    dueDate: "2026-01-15",
    totalSchools: 12,
    completedSchools: 2,
    questionCount: 15,
    completions: [
      {
        schoolId: "academia-americana-sp",
        schoolName: "Academia Americana de Sao Paulo",
        completed: true,
        completedAt: "2025-12-10T10:15:00Z"
      },
      {
        schoolId: "colegio-interamericano-norte",
        schoolName: "Colegio Interamericano del Norte",
        completed: false,
        completedAt: null
      },
      {
        schoolId: "instituto-colombiano",
        schoolName: "Instituto Colombiano Internacional",
        completed: true,
        completedAt: "2025-12-18T14:30:00Z"
      },
      {
        schoolId: "colegio-pacifico",
        schoolName: "Colegio Pacifico",
        completed: false,
        completedAt: null
      },
      {
        schoolId: "academia-austral",
        schoolName: "Academia Austral",
        completed: false,
        completedAt: null
      },
      {
        schoolId: "escuela-centroamericana",
        schoolName: "Escuela Centroamericana",
        completed: false,
        completedAt: null
      },
      {
        schoolId: "instituto-del-istmo",
        schoolName: "Instituto del Istmo",
        completed: false,
        completedAt: null
      },
      {
        schoolId: "colegio-andino",
        schoolName: "Colegio Andino Internacional",
        completed: false,
        completedAt: null
      },
      {
        schoolId: "academia-tropical",
        schoolName: "Academia Tropical",
        completed: false,
        completedAt: null
      },
      {
        schoolId: "colegio-caribe",
        schoolName: "Colegio Caribe",
        completed: false,
        completedAt: null
      },
      {
        schoolId: "island-international",
        schoolName: "Island International Academy",
        completed: false,
        completedAt: null
      },
      {
        schoolId: "instituto-bolivariano",
        schoolName: "Instituto Bolivariano",
        completed: false,
        completedAt: null
      }
    ]
  },
  {
    id: "survey-parent-satisfaction",
    title: "Parent Satisfaction Survey",
    status: "pending_approval",
    createdBy: "Academia Americana de Sao Paulo",
    createdAt: "2026-01-10",
    distributedAt: null,
    dueDate: null,
    totalSchools: 12,
    completedSchools: 0,
    questionCount: 12,
    completions: [
      {
        schoolId: "academia-americana-sp",
        schoolName: "Academia Americana de Sao Paulo",
        completed: false,
        completedAt: null
      },
      {
        schoolId: "colegio-interamericano-norte",
        schoolName: "Colegio Interamericano del Norte",
        completed: false,
        completedAt: null
      },
      {
        schoolId: "instituto-colombiano",
        schoolName: "Instituto Colombiano Internacional",
        completed: false,
        completedAt: null
      },
      {
        schoolId: "colegio-pacifico",
        schoolName: "Colegio Pacifico",
        completed: false,
        completedAt: null
      },
      {
        schoolId: "academia-austral",
        schoolName: "Academia Austral",
        completed: false,
        completedAt: null
      },
      {
        schoolId: "escuela-centroamericana",
        schoolName: "Escuela Centroamericana",
        completed: false,
        completedAt: null
      },
      {
        schoolId: "instituto-del-istmo",
        schoolName: "Instituto del Istmo",
        completed: false,
        completedAt: null
      },
      {
        schoolId: "colegio-andino",
        schoolName: "Colegio Andino Internacional",
        completed: false,
        completedAt: null
      },
      {
        schoolId: "academia-tropical",
        schoolName: "Academia Tropical",
        completed: false,
        completedAt: null
      },
      {
        schoolId: "colegio-caribe",
        schoolName: "Colegio Caribe",
        completed: false,
        completedAt: null
      },
      {
        schoolId: "island-international",
        schoolName: "Island International Academy",
        completed: false,
        completedAt: null
      },
      {
        schoolId: "instituto-bolivariano",
        schoolName: "Instituto Bolivariano",
        completed: false,
        completedAt: null
      }
    ]
  },
  {
    id: "survey-strategic",
    title: "Strategic Planning Priorities",
    status: "draft",
    createdBy: "AMISA HQ",
    createdAt: "2026-02-20",
    distributedAt: null,
    dueDate: null,
    totalSchools: 12,
    completedSchools: 0,
    questionCount: 8,
    completions: [
      {
        schoolId: "academia-americana-sp",
        schoolName: "Academia Americana de Sao Paulo",
        completed: false,
        completedAt: null
      },
      {
        schoolId: "colegio-interamericano-norte",
        schoolName: "Colegio Interamericano del Norte",
        completed: false,
        completedAt: null
      },
      {
        schoolId: "instituto-colombiano",
        schoolName: "Instituto Colombiano Internacional",
        completed: false,
        completedAt: null
      },
      {
        schoolId: "colegio-pacifico",
        schoolName: "Colegio Pacifico",
        completed: false,
        completedAt: null
      },
      {
        schoolId: "academia-austral",
        schoolName: "Academia Austral",
        completed: false,
        completedAt: null
      },
      {
        schoolId: "escuela-centroamericana",
        schoolName: "Escuela Centroamericana",
        completed: false,
        completedAt: null
      },
      {
        schoolId: "instituto-del-istmo",
        schoolName: "Instituto del Istmo",
        completed: false,
        completedAt: null
      },
      {
        schoolId: "colegio-andino",
        schoolName: "Colegio Andino Internacional",
        completed: false,
        completedAt: null
      },
      {
        schoolId: "academia-tropical",
        schoolName: "Academia Tropical",
        completed: false,
        completedAt: null
      },
      {
        schoolId: "colegio-caribe",
        schoolName: "Colegio Caribe",
        completed: false,
        completedAt: null
      },
      {
        schoolId: "island-international",
        schoolName: "Island International Academy",
        completed: false,
        completedAt: null
      },
      {
        schoolId: "instituto-bolivariano",
        schoolName: "Instituto Bolivariano",
        completed: false,
        completedAt: null
      }
    ]
  }
];
