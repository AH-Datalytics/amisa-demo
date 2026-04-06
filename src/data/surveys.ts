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
    results: [
      {
        questionId: "q1",
        questionTitle: "Primary enrollment challenge this year",
        questionType: "multiple-choice",
        options: [
          { label: "Declining applications", count: 3 },
          { label: "Retention of current families", count: 4 },
          { label: "Competition from local schools", count: 2 },
          { label: "Visa/immigration barriers", count: 1 },
          { label: "No significant challenge", count: 2 },
        ],
        responseCount: 8,
      },
      {
        questionId: "q2",
        questionTitle: "Satisfaction with current tuition pricing model",
        questionType: "likert",
        average: 3.6,
        responseCount: 8,
      },
      {
        questionId: "q3",
        questionTitle: "Planned tuition increase for next year",
        questionType: "multiple-choice",
        options: [
          { label: "0-3%", count: 2 },
          { label: "3-5%", count: 4 },
          { label: "5-8%", count: 1 },
          { label: "8%+", count: 0 },
          { label: "Decrease planned", count: 1 },
        ],
        responseCount: 8,
      },
    ],
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
    results: [
      {
        questionId: "q1",
        questionTitle: "Average faculty salary range (USD)",
        questionType: "multiple-choice",
        options: [
          { label: "$30k-$45k", count: 0 },
          { label: "$45k-$60k", count: 1 },
          { label: "$60k-$80k", count: 1 },
          { label: "$80k+", count: 0 },
        ],
        responseCount: 2,
      },
      {
        questionId: "q2",
        questionTitle: "Satisfaction with faculty compensation competitiveness",
        questionType: "likert",
        average: 2.8,
        responseCount: 2,
      },
    ],
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
