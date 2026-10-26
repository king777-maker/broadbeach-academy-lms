import { getAuthoritativeCourseName } from "./freeCoursesData.js";

export const COURSE_ASSESSMENT_CATALOG = {
  // =========================================================================
  // COURSE 322: ISO 9001:2026 QMS Awareness (Quality Management System)
  // =========================================================================
  322: {
    id: 322,
    certification_id: 322,
    course_slug: "iso-9001-2026-qms-awareness",
    course_title: "ISO 9001:2026 QMS",
    title: "ISO 9001:2026 QMS Final Assessment",
    duration_minutes: 30,
    passing_percentage: 70,
    total_questions: 13,
    questions: [
      {
        id: 1,
        question: "What is the primary purpose and scope of ISO 9001?",
        options: [
          "Environmental Management System",
          "Quality Management System to meet customer and regulatory requirements",
          "Occupational Health and Safety management",
          "Information Security Management"
        ],
        correct_answer: "Quality Management System to meet customer and regulatory requirements"
      },
      {
        id: 2,
        question: "Which management cycle serves as the operating principle of ISO 9001?",
        options: [
          "Plan-Do-Check-Act (PDCA)",
          "Design-Develop-Test-Release",
          "Analyze-Estimate-Deliver-Review",
          "Define-Measure-Analyze-Improve"
        ],
        correct_answer: "Plan-Do-Check-Act (PDCA)"
      },
      {
        id: 3,
        question: "How many Quality Management Principles (QMPs) form the foundation of ISO 9001?",
        options: [
          "5 Principles",
          "7 Principles",
          "10 Principles",
          "12 Principles"
        ],
        correct_answer: "7 Principles"
      },
      {
        id: 4,
        question: "Which clause of ISO 9001 specifies requirements for Leadership and management commitment?",
        options: [
          "Clause 4",
          "Clause 5",
          "Clause 6",
          "Clause 7"
        ],
        correct_answer: "Clause 5"
      },
      {
        id: 5,
        question: "Who is formally accountable for establishing, implementing, and maintaining the Quality Policy?",
        options: [
          "External ISO Auditors",
          "Line Supervisors",
          "Top Management",
          "Human Resources Department"
        ],
        correct_answer: "Top Management"
      },
      {
        id: 6,
        question: "What systematic discipline does ISO 9001 use to address risks and opportunities across all processes?",
        options: [
          "Risk-based thinking",
          "Annual insurance underwriting",
          "Financial contingency reserves",
          "Unplanned corrective firefighting"
        ],
        correct_answer: "Risk-based thinking"
      },
      {
        id: 7,
        question: "Clause 6 of ISO 9001 is primarily dedicated to which management activity?",
        options: [
          "Operation",
          "Planning",
          "Support",
          "Improvement"
        ],
        correct_answer: "Planning"
      },
      {
        id: 8,
        question: "Under Clause 9.2, internal audits must be conducted at:",
        options: [
          "Random unannounced moments",
          "Planned intervals",
          "Only when customer complaints exceed limits",
          "Every five years"
        ],
        correct_answer: "Planned intervals"
      },
      {
        id: 9,
        question: "Management review meetings are conducted to evaluate the QMS for its continuing:",
        options: [
          "Suitability, adequacy, and effectiveness",
          "Lowest procurement cost",
          "Stock price and market valuation",
          "Public relations marketing viability"
        ],
        correct_answer: "Suitability, adequacy, and effectiveness"
      },
      {
        id: 10,
        question: "Monitoring customer perceptions and satisfaction is an explicit requirement under:",
        options: [
          "Clause 7: Support",
          "Clause 8: Operation",
          "Clause 9: Performance Evaluation",
          "Clause 4: Context"
        ],
        correct_answer: "Clause 9: Performance Evaluation"
      },
      {
        id: 11,
        question: "What is the primary objective of corrective action under Clause 10.2?",
        options: [
          "To punish staff involved in mistakes",
          "To eliminate the root cause of non-conformities so they do not recur",
          "To hide documentation discrepancies from auditors",
          "To replace existing suppliers"
        ],
        correct_answer: "To eliminate the root cause of non-conformities so they do not recur"
      },
      {
        id: 12,
        question: "ISO 9001 shares a common high-level text, definitions, and 10-clause structure known as:",
        options: [
          "Annex SL (High-Level Structure)",
          "Six Sigma DMAIC",
          "Agile Scrum Framework",
          "ITIL Service Lifecycle"
        ],
        correct_answer: "Annex SL (High-Level Structure)"
      },
      {
        id: 13,
        question: "Continual improvement under ISO 9001 aims to enhance:",
        options: [
          "Process performance and customer satisfaction",
          "Office interior decoration",
          "Employee dress code compliance",
          "Social media follower count"
        ],
        correct_answer: "Process performance and customer satisfaction"
      }
    ]
  },

  // =========================================================================
  // COURSE 332: ISO 14001:2026 EMS Awareness (Environmental Management System)
  // =========================================================================
  332: {
    id: 332,
    certification_id: 332,
    course_slug: "iso-14001-2026-ems-awareness",
    course_title: "ISO14001: 2026 EMS",
    title: "ISO14001: 2026 EMS Final Assessment",
    duration_minutes: 30,
    passing_percentage: 70,
    total_questions: 13,
    questions: [
      {
        id: 1,
        question: "What is the primary purpose of ISO 14001?",
        options: [
          "Financial Management",
          "Environmental Management System",
          "Human Resource Management",
          "Information Security"
        ],
        correct_answer: "Environmental Management System"
      },
      {
        id: 2,
        question: "Which cycle is the foundation of ISO 14001?",
        options: [
          "Plan-Do-Check-Act",
          "Design-Test-Deploy",
          "Research-Develop-Launch",
          "Analyze-Build-Test"
        ],
        correct_answer: "Plan-Do-Check-Act"
      },
      {
        id: 3,
        question: "Which clause of ISO 14001 focuses on Leadership?",
        options: [
          "Clause 4",
          "Clause 5",
          "Clause 6",
          "Clause 7"
        ],
        correct_answer: "Clause 5"
      },
      {
        id: 4,
        question: "Environmental policy should be approved by:",
        options: [
          "Customers",
          "Employees",
          "Top Management",
          "Suppliers"
        ],
        correct_answer: "Top Management"
      },
      {
        id: 5,
        question: "Which document identifies environmental risks and opportunities?",
        options: [
          "Risk Assessment",
          "Sales Report",
          "Invoice",
          "Purchase Order"
        ],
        correct_answer: "Risk Assessment"
      },
      {
        id: 6,
        question: "What is the focus of Clause 6 in ISO 14001?",
        options: [
          "Operation",
          "Planning",
          "Support",
          "Evaluation"
        ],
        correct_answer: "Planning"
      },
      {
        id: 7,
        question: "Internal audits must be conducted at:",
        options: [
          "Random times",
          "Planned intervals",
          "Only when incidents occur",
          "Every 5 years"
        ],
        correct_answer: "Planned intervals"
      },
      {
        id: 8,
        question: "Management review is conducted to ensure:",
        options: [
          "Profit increase",
          "Employee attendance",
          "Continuing suitability, adequacy, and effectiveness",
          "Customer complaints"
        ],
        correct_answer: "Continuing suitability, adequacy, and effectiveness"
      },
      {
        id: 9,
        question: "Which is an environmental aspect?",
        options: [
          "Air pollution",
          "Emission to air",
          "Soil contamination",
          "Water disease"
        ],
        correct_answer: "Emission to air"
      },
      {
        id: 10,
        question: "Corrective actions are taken to:",
        options: [
          "Blame workers",
          "Hide issues",
          "Eliminate root cause of non-conformities",
          "Ignore errors"
        ],
        correct_answer: "Eliminate root cause of non-conformities"
      },
      {
        id: 11,
        question: "ISO 14001 follows which structure?",
        options: [
          "High-Level Structure (Annex SL)",
          "Six Sigma",
          "Agile Framework",
          "Scrum"
        ],
        correct_answer: "High-Level Structure (Annex SL)"
      },
      {
        id: 12,
        question: "Emergency preparedness procedures should be:",
        options: [
          "Ignored",
          "Kept secret",
          "Periodically tested",
          "Used only once"
        ],
        correct_answer: "Periodically tested"
      },
      {
        id: 13,
        question: "Continual improvement aims to:",
        options: [
          "Increase paperwork",
          "Enhance environmental performance",
          "Add more rules",
          "Slow down processes"
        ],
        correct_answer: "Enhance environmental performance"
      }
    ]
  },

  // =========================================================================
  // COURSE 323: ISO 45001:2018 OHSMS Awareness (Health & Safety)
  // =========================================================================
  323: {
    id: 323,
    certification_id: 323,
    course_slug: "iso-45001-2018-ohsms-awareness",
    course_title: "ISO 45001:2018 OHSMS",
    title: "ISO 45001:2018 OHSMS Final Assessment",
    duration_minutes: 30,
    passing_percentage: 70,
    total_questions: 10,
    questions: [
      {
        id: 1,
        question: "What is the primary aim of an ISO 45001 Occupational Health & Safety Management System?",
        options: [
          "Prevent work-related injury and ill health and provide safe workplaces",
          "Increase product production speed",
          "Reduce customer return rates",
          "Maximize marketing outreach"
        ],
        correct_answer: "Prevent work-related injury and ill health and provide safe workplaces"
      },
      {
        id: 2,
        question: "What is the most effective level in the Hierarchy of Controls?",
        options: [
          "Personal Protective Equipment (PPE)",
          "Administrative controls",
          "Elimination of the hazard",
          "Engineering controls"
        ],
        correct_answer: "Elimination of the hazard"
      },
      {
        id: 3,
        question: "Clause 5.4 of ISO 45001 specifically mandates:",
        options: [
          "Consultation and participation of non-managerial workers",
          "Dismissal of uncooperative personnel",
          "Quarterly bonus disbursements",
          "Public stock filings"
        ],
        correct_answer: "Consultation and participation of non-managerial workers"
      },
      {
        id: 4,
        question: "In OH&S terminology, a 'hazard' is best defined as:",
        options: [
          "A source with a potential to cause injury and ill health",
          "An insurance invoice",
          "An approved safety certificate",
          "A completed PPE checklist"
        ],
        correct_answer: "A source with a potential to cause injury and ill health"
      },
      {
        id: 5,
        question: "Near-miss reporting is vital in safety management because it helps to:",
        options: [
          "Identify and control hazards before an injury occurs",
          "Penalize careless technicians",
          "Reduce employee breaks",
          "Cancel machine maintenance"
        ],
        correct_answer: "Identify and control hazards before an injury occurs"
      },
      {
        id: 6,
        question: "Which clause in ISO 45001 covers Hazard Identification and Risk Assessment (HIRA)?",
        options: [
          "Clause 4",
          "Clause 6: Planning",
          "Clause 8: Operation",
          "Clause 10: Improvement"
        ],
        correct_answer: "Clause 6: Planning"
      },
      {
        id: 7,
        question: "Top management demonstrates leadership in ISO 45001 by:",
        options: [
          "Protecting workers from reprisals when reporting incidents and hazards",
          "Delegating safety entirely to junior trainees",
          "Exempting executives from safety helmets in hazard zones",
          "Cancelling emergency drills to save hours"
        ],
        correct_answer: "Protecting workers from reprisals when reporting incidents and hazards"
      },
      {
        id: 8,
        question: "Operational planning and control (Clause 8.1) requires organizations to manage:",
        options: [
          "Contractors and procurement of hazardous products",
          "Social media PR campaigns",
          "Employee payroll taxation",
          "Customer credit lines"
        ],
        correct_answer: "Contractors and procurement of hazardous products"
      },
      {
        id: 9,
        question: "Under ISO 45001, who is permitted to remove themselves from situations of imminent danger?",
        options: [
          "Only safety managers",
          "Any worker, without fear of undue negative consequences",
          "Only certified union leaders",
          "Only external government inspectors"
        ],
        correct_answer: "Any worker, without fear of undue negative consequences"
      },
      {
        id: 10,
        question: "Emergency preparedness plans under ISO 45001 must include:",
        options: [
          "Periodic testing and exercises of planned response capabilities",
          "One-time safety video shown at hiring only",
          "Unpublished secret fire escape routes",
          "Verbal instructions without written drills"
        ],
        correct_answer: "Periodic testing and exercises of planned response capabilities"
      }
    ]
  },

  // =========================================================================
  // COURSE 324: ISO 22000:2018 FSMS Awareness (Food Safety)
  // =========================================================================
  324: {
    id: 324,
    certification_id: 324,
    course_slug: "iso-22000-2018-fsms-awareness",
    course_title: "ISO 22000:2018 FSMS",
    title: "ISO 22000:2018 FSMS Final Assessment",
    duration_minutes: 30,
    passing_percentage: 70,
    total_questions: 10,
    questions: [
      {
        id: 1,
        question: "What is the primary objective of an ISO 22000 Food Safety Management System?",
        options: [
          "Ensure food is safe at the time of human consumption",
          "Increase taste ratings of food products",
          "Lower agricultural transport costs",
          "Improve restaurant visual branding"
        ],
        correct_answer: "Ensure food is safe at the time of human consumption"
      },
      {
        id: 2,
        question: "Which four key elements are integrated in the ISO 22000 standard?",
        options: [
          "Interactive communication, system management, prerequisite programmes, and HACCP principles",
          "Marketing, sales, delivery, and accounting",
          "Flavor testing, packaging, discount coupons, and storage",
          "Hiring, firing, overtime, and shift rostering"
        ],
        correct_answer: "Interactive communication, system management, prerequisite programmes, and HACCP principles"
      },
      {
        id: 3,
        question: "In food safety, what does CCP stand for?",
        options: [
          "Critical Control Point",
          "Customer Care Protocol",
          "Commercial Cleaning Process",
          "Central Cold Pantry"
        ],
        correct_answer: "Critical Control Point"
      },
      {
        id: 4,
        question: "What differentiates an OPRP (Operational Prerequisite Programme) from a CCP?",
        options: [
          "OPRP controls likelihood of introducing hazards, while CCP applies measurable critical limits to prevent or eliminate a hazard",
          "OPRP applies only to beverages",
          "CCP has no critical limits",
          "OPRP requires government approval"
        ],
        correct_answer: "OPRP controls likelihood of introducing hazards, while CCP applies measurable critical limits to prevent or eliminate a hazard"
      },
      {
        id: 5,
        question: "A measurable boundary that separates acceptable from unacceptable food product safety is called a:",
        options: [
          "Critical Limit",
          "Price ceiling",
          "Volume batch",
          "Flavor index"
        ],
        correct_answer: "Critical Limit"
      },
      {
        id: 6,
        question: "Traceability systems in ISO 22000 (Clause 8.3) must be able to uniquely identify product lots:",
        options: [
          "One step back (suppliers) and one step forward (distribution customers)",
          "Only for items produced in the current week",
          "Only when raw material invoices are missing",
          "Without lot numbers or dispatch dates"
        ],
        correct_answer: "One step back (suppliers) and one step forward (distribution customers)"
      },
      {
        id: 7,
        question: "Which of the following is considered an allergen hazard under modern food safety regulations?",
        options: [
          "Peanuts and tree nuts",
          "Filtered tap water",
          "Stainless steel mixing bowls",
          "Cardboard outer cartons"
        ],
        correct_answer: "Peanuts and tree nuts"
      },
      {
        id: 8,
        question: "When a critical limit at a CCP is exceeded, the affected food lot must be treated as:",
        options: [
          "Potentially unsafe product and quarantined immediately",
          "Discounted and sold in clearance aisles",
          "Blended with new batches without testing",
          "Shipped normally if smell appears pleasant"
        ],
        correct_answer: "Potentially unsafe product and quarantined immediately"
      },
      {
        id: 9,
        question: "Food defense and food fraud mitigation strategies primarily protect products from:",
        options: [
          "Intentional contamination and economically motivated adulteration",
          "Natural weather fluctuations",
          "Legitimate supplier price renegotiations",
          "Seasonal harvest shortages"
        ],
        correct_answer: "Intentional contamination and economically motivated adulteration"
      },
      {
        id: 10,
        question: "Mock product recall exercises should be conducted at planned intervals to verify:",
        options: [
          "Speed and effectiveness of the withdrawal and recall procedure",
          "Delivery driver overtime rates",
          "Customer credit scores",
          "Cardboard box packaging tensile strength"
        ],
        correct_answer: "Speed and effectiveness of the withdrawal and recall procedure"
      }
    ]
  },

  // =========================================================================
  // COURSE 333: ISO 27001:2022 ISMS Awareness (Information Security)
  // =========================================================================
  333: {
    id: 333,
    certification_id: 333,
    course_slug: "iso-27001-2022-isms-awareness",
    course_title: "ISO 27001:2022 ISMS",
    title: "ISO 27001:2022 ISMS Final Assessment",
    duration_minutes: 30,
    passing_percentage: 70,
    total_questions: 10,
    questions: [
      {
        id: 1,
        question: "What core triad of security objectives does ISO/IEC 27001 protect?",
        options: [
          "Confidentiality, Integrity, and Availability (CIA)",
          "Cost, Innovation, and Agility",
          "Compliance, Insurance, and Auditing",
          "Coding, Infrastructure, and Architecture"
        ],
        correct_answer: "Confidentiality, Integrity, and Availability (CIA)"
      },
      {
        id: 2,
        question: "What document lists the selected Annex A controls and justifies exclusions?",
        options: [
          "Statement of Applicability (SoA)",
          "Company Employee Handbook",
          "Server Purchase Order",
          "Software License Agreement"
        ],
        correct_answer: "Statement of Applicability (SoA)"
      },
      {
        id: 3,
        question: "How many control themes are established in ISO/IEC 27001:2022 Annex A?",
        options: [
          "4 Themes (Organizational, People, Physical, Technological)",
          "14 Domains with no themes",
          "25 Categories",
          "50 Clauses"
        ],
        correct_answer: "4 Themes (Organizational, People, Physical, Technological)"
      },
      {
        id: 4,
        question: "Information security risk assessment must compare estimated risks against:",
        options: [
          "Organizational risk acceptance criteria",
          "Competitor press releases",
          "Social media cybersecurity trends",
          "Stock price movements"
        ],
        correct_answer: "Organizational risk acceptance criteria"
      },
      {
        id: 5,
        question: "The principle of 'Least Privilege' dictates that users should be granted:",
        options: [
          "Only the minimum access necessary to perform their legitimate job duties",
          "Full administrator permissions on every company server",
          "Shared passwords across team departments",
          "Unlimited access after passing probation"
        ],
        correct_answer: "Only the minimum access necessary to perform their legitimate job duties"
      },
      {
        id: 6,
        question: "Which of the following constitutes an Information Security Incident?",
        options: [
          "An unauthorized database breach or ransomware encryption event",
          "A regular scheduled software patch installation",
          "An employee updating their approved password",
          "A server restarting after an announced maintenance window"
        ],
        correct_answer: "An unauthorized database breach or ransomware encryption event"
      },
      {
        id: 7,
        question: "Multi-Factor Authentication (MFA) requires credentials from at least two different categories:",
        options: [
          "Something you know, something you have, or something you are",
          "Two different password hints written on paper",
          "Email address and secondary email address",
          "Home phone number and office extension"
        ],
        correct_answer: "Something you know, something you have, or something you are"
      },
      {
        id: 8,
        question: "Physical security perimeters and clear desk policies protect against:",
        options: [
          "Unauthorized physical access, theft, or viewing of sensitive assets",
          "Network bandwidth congestion",
          "Software syntax compile errors",
          "Cloud storage billing spikes"
        ],
        correct_answer: "Unauthorized physical access, theft, or viewing of sensitive assets"
      },
      {
        id: 9,
        question: "Secure software coding guidelines and change management controls prevent:",
        options: [
          "Vulnerabilities from being deployed into production systems",
          "Developers from taking lunch breaks",
          "Open source library usage in any capacity",
          "Clients from submitting feature requests"
        ],
        correct_answer: "Vulnerabilities from being deployed into production systems"
      },
      {
        id: 10,
        question: "Incident response readiness in ISO 27001 requires organizations to:",
        options: [
          "Report, assess, contain, and learn from security incidents systematically",
          "Conceal breaches to avoid regulatory fines",
          "Delete server logs immediately following an intrusion",
          "Avoid contacting law enforcement or data protection authorities"
        ],
        correct_answer: "Report, assess, contain, and learn from security incidents systematically"
      }
    ]
  },

  // =========================================================================
  // COURSE 329: Lean Six Sigma White Belt
  // =========================================================================
  329: {
    id: 329,
    certification_id: 329,
    course_slug: "lean-six-sigma-white-belt",
    course_title: "Lean Six Sigma White belt",
    title: "Lean Six Sigma White belt Final Assessment",
    duration_minutes: 30,
    passing_percentage: 70,
    total_questions: 10,
    questions: [
      {
        id: 1,
        question: "What is the primary objective of Lean methodology?",
        options: [
          "Eliminate non-value-added waste (Muda) and improve process flow",
          "Fire underperforming staff",
          "Increase machinery operating speeds beyond tolerance",
          "Eliminate all quality inspections"
        ],
        correct_answer: "Eliminate non-value-added waste (Muda) and improve process flow"
      },
      {
        id: 2,
        question: "What does the Six Sigma DMAIC acronym stand for?",
        options: [
          "Define, Measure, Analyze, Improve, Control",
          "Design, Market, Advertise, Implement, Check",
          "Deliver, Monitor, Assign, Inspect, Close",
          "Draft, Model, Assemble, Inspect, Complete"
        ],
        correct_answer: "Define, Measure, Analyze, Improve, Control"
      },
      {
        id: 3,
        question: "How many defects per million opportunities (DPMO) represent Six Sigma quality?",
        options: [
          "3.4 DPMO",
          "66,807 DPMO",
          "308 DPMO",
          "0.1 DPMO"
        ],
        correct_answer: "3.4 DPMO"
      },
      {
        id: 4,
        question: "Which acronym summarizes the 8 classic deadly wastes of Lean?",
        options: [
          "TIMWOODS",
          "SCAMPER",
          "SMART",
          "PESTLE"
        ],
        correct_answer: "TIMWOODS"
      },
      {
        id: 5,
        question: "In the Define phase of DMAIC, what document outlines project goals, scope, and timeline?",
        options: [
          "Project Charter",
          "Purchase Invoice",
          "Equipment Manual",
          "Tax Return"
        ],
        correct_answer: "Project Charter"
      },
      {
        id: 6,
        question: "What visual tool is used during the Analyze phase to brainstorm potential causes of a problem?",
        options: [
          "Fishbone (Ishikawa) Diagram",
          "Pie chart of quarterly sales",
          "Company organization tree",
          "Balance sheet statement"
        ],
        correct_answer: "Fishbone (Ishikawa) Diagram"
      },
      {
        id: 7,
        question: "What does the 5 Whys technique help teams uncover?",
        options: [
          "The underlying root cause of a defect",
          "Which worker to reprimand",
          "The best supplier price quotation",
          "The annual company profit margin"
        ],
        correct_answer: "The underlying root cause of a defect"
      },
      {
        id: 8,
        question: "In SIPOC, what does the letter 'C' stand for?",
        options: [
          "Customer",
          "Company",
          "Cost",
          "Control"
        ],
        correct_answer: "Customer"
      },
      {
        id: 9,
        question: "Poka-Yoke is a Japanese Lean term referring to:",
        options: [
          "Mistake-proofing mechanisms",
          "Continuous visual posters",
          "Daily morning stretching",
          "Executive bonus incentives"
        ],
        correct_answer: "Mistake-proofing mechanisms"
      },
      {
        id: 10,
        question: "What is the primary role of a Lean Six Sigma White Belt?",
        options: [
          "Understand basic Lean Six Sigma concepts and support project teams in local work areas",
          "Lead multi-million dollar corporate transformations as full-time Black Belt",
          "Write statistical regression algorithms in Python",
          "Manage external supplier legal litigation"
        ],
        correct_answer: "Understand basic Lean Six Sigma concepts and support project teams in local work areas"
      }
    ]
  },

  // =========================================================================
  // COURSE 325: ISO 19011:2026 (Auditing Guidelines)
  // =========================================================================
  325: {
    id: 325,
    certification_id: 325,
    course_slug: "iso-19011-2026-awareness",
    course_title: "ISO 19011:2026",
    title: "ISO 19011:2026 Final Assessment",
    duration_minutes: 25,
    passing_percentage: 70,
    total_questions: 5,
    questions: [
      {
        id: 1,
        question: "What is the primary scope of the ISO 19011 standard?",
        options: [
          "Guidelines for auditing management systems",
          "Requirements for manufacturing medical devices",
          "Rules for financial accounting audits",
          "Occupational safety PPE specifications"
        ],
        correct_answer: "Guidelines for auditing management systems"
      },
      {
        id: 2,
        question: "Which auditing principle requires auditors to report truthfully and accurately?",
        options: [
          "Fair presentation",
          "Due professional care",
          "Confidentiality",
          "Risk-based approach"
        ],
        correct_answer: "Fair presentation"
      },
      {
        id: 3,
        question: "A first-party audit is universally defined as a(n):",
        options: [
          "Internal audit of an organization's own systems",
          "Customer audit of a tier-1 supplier",
          "Certification body accreditation audit",
          "Government regulatory compliance inspection"
        ],
        correct_answer: "Internal audit of an organization's own systems"
      },
      {
        id: 4,
        question: "What constitutes objective evidence during an audit?",
        options: [
          "Verifiable facts, records, or statements of fact",
          "Auditor opinions and assumptions",
          "Informal rumours heard during lunch breaks",
          "Competitor marketing reports"
        ],
        correct_answer: "Verifiable facts, records, or statements of fact"
      },
      {
        id: 5,
        question: "Who holds responsibility for managing the overall annual audit programme?",
        options: [
          "The designated competent person managing the audit programme",
          "External certification sales representatives",
          "Individual department receptionists",
          "Temporary contractors"
        ],
        correct_answer: "The designated competent person managing the audit programme"
      }
    ]
  },

  // =========================================================================
  // COURSE 326: 5S Workplace Management
  // =========================================================================
  326: {
    id: 326,
    certification_id: 326,
    course_slug: "5s-workplace-management",
    course_title: "5S Workplace Management",
    title: "5S Workplace Management Final Assessment",
    duration_minutes: 20,
    passing_percentage: 70,
    total_questions: 5,
    questions: [
      {
        id: 1,
        question: "What are the 5 sequential pillars of the Japanese 5S methodology?",
        options: [
          "Seiri, Seiton, Seiso, Seiketsu, Shitsuke",
          "Sort, Speed, Standard, Safety, Ship",
          "Select, Sweep, Scrub, Secure, Save",
          "Schedule, Source, Store, Sell, Scale"
        ],
        correct_answer: "Seiri, Seiton, Seiso, Seiketsu, Shitsuke"
      },
      {
        id: 2,
        question: "What is the primary action during the 'Seiri' (Sort) step?",
        options: [
          "Eliminate unnecessary items from the work area",
          "Paint floor walkway boundaries",
          "Wash machine filters with detergent",
          "Write annual employee reviews"
        ],
        correct_answer: "Eliminate unnecessary items from the work area"
      },
      {
        id: 3,
        question: "'A place for everything, and everything in its place' describes which 5S pillar?",
        options: [
          "Seiton (Set in Order)",
          "Seiso (Shine)",
          "Seiketsu (Standardize)",
          "Shitsuke (Sustain)"
        ],
        correct_answer: "Seiton (Set in Order)"
      },
      {
        id: 4,
        question: "Red-tagging is an industry-standard visual technique utilized during:",
        options: [
          "The Sort (Seiri) phase to flag questionable or unneeded items",
          "Employee disciplinary hearings",
          "Shipping final pallet orders",
          "Safety fire evacuation drills"
        ],
        correct_answer: "The Sort (Seiri) phase to flag questionable or unneeded items"
      },
      {
        id: 5,
        question: "Which 5S pillar focuses on building self-discipline, audits, and long-term habits?",
        options: [
          "Shitsuke (Sustain)",
          "Seiton (Set in Order)",
          "Seiri (Sort)",
          "Seiso (Shine)"
        ],
        correct_answer: "Shitsuke (Sustain)"
      }
    ]
  },

  // =========================================================================
  // COURSE 327: 7QC Tools Certification
  // =========================================================================
  327: {
    id: 327,
    certification_id: 327,
    course_slug: "7qc-tools-certification",
    course_title: "7QC Tools Certification",
    title: "7 Quality Control Tools Final Assessment",
    duration_minutes: 25,
    passing_percentage: 70,
    total_questions: 5,
    questions: [
      {
        id: 1,
        question: "Which 7QC tool is used to separate the 'vital few' from the 'trivial many' using the 80/20 rule?",
        options: [
          "Pareto Chart",
          "Check Sheet",
          "Scatter Plot",
          "Histogram"
        ],
        correct_answer: "Pareto Chart"
      },
      {
        id: 2,
        question: "An Ishikawa diagram is also widely known as a:",
        options: [
          "Fishbone or Cause-and-Effect Diagram",
          "Control Chart",
          "Gantt Chart",
          "Stratification Matrix"
        ],
        correct_answer: "Fishbone or Cause-and-Effect Diagram"
      },
      {
        id: 3,
        question: "Which tool tracks process stability over time using statistically calculated upper and lower control limits?",
        options: [
          "Control Chart (Shewhart Chart)",
          "Check Sheet",
          "Flowchart",
          "Affinity Diagram"
        ],
        correct_answer: "Control Chart (Shewhart Chart)"
      },
      {
        id: 4,
        question: "A Scatter Diagram is primarily used to analyze:",
        options: [
          "The correlation or relationship between two continuous variables",
          "The sequence of software source code commits",
          "Annual departmental expenditure allocations",
          "Warehouse floor storage rack layouts"
        ],
        correct_answer: "The correlation or relationship between two continuous variables"
      },
      {
        id: 5,
        question: "What is the simplest tool designed for systematic real-time data collection at the workstation?",
        options: [
          "Check Sheet",
          "Neural network",
          "Gage R&R fixture",
          "Pareto distribution"
        ],
        correct_answer: "Check Sheet"
      }
    ]
  },

  // =========================================================================
  // COURSE 328: Project Management Level-1
  // =========================================================================
  328: {
    id: 328,
    certification_id: 328,
    course_slug: "project-management-level-1",
    course_title: "Project Management Level-1",
    title: "Project Management Level-1 Final Assessment",
    duration_minutes: 25,
    passing_percentage: 70,
    total_questions: 5,
    questions: [
      {
        id: 1,
        question: "What are the three interrelated constraints of the traditional Project Iron Triangle?",
        options: [
          "Scope, Time (Schedule), and Cost (Budget)",
          "Sales, Marketing, and Advertising",
          "Design, Packaging, and Shipping",
          "Hardware, Software, and Network"
        ],
        correct_answer: "Scope, Time (Schedule), and Cost (Budget)"
      },
      {
        id: 2,
        question: "Which formal document authorizes the project and gives the project manager authority to apply resources?",
        options: [
          "Project Charter",
          "Purchase Order",
          "Non-Disclosure Agreement",
          "Weekly Timesheet"
        ],
        correct_answer: "Project Charter"
      },
      {
        id: 3,
        question: "What does WBS stand for in project scope management?",
        options: [
          "Work Breakdown Structure",
          "Workforce Baseline System",
          "Weekly Billing Summary",
          "Warranty Bond Standard"
        ],
        correct_answer: "Work Breakdown Structure"
      },
      {
        id: 4,
        question: "The Critical Path in a project network schedule is defined as:",
        options: [
          "The sequence of dependent tasks that determines the shortest possible project completion duration",
          "The tasks with the highest financial budget",
          "The path with maximum slack/float time",
          "The list of subcontractor contracts"
        ],
        correct_answer: "The sequence of dependent tasks that determines the shortest possible project completion duration"
      },
      {
        id: 5,
        question: "What is the primary objective of maintaining an active Project Risk Register?",
        options: [
          "To identify, analyze, prioritize, and track risk response plans",
          "To guarantee zero unforeseen events happen",
          "To record equipment depreciation expenses",
          "To replace formal project status meetings"
        ],
        correct_answer: "To identify, analyze, prioritize, and track risk response plans"
      }
    ]
  },

  // =========================================================================
  // COURSE 330: Root Cause Analysis
  // =========================================================================
  330: {
    id: 330,
    certification_id: 330,
    course_slug: "root-cause-analysis",
    course_title: "Root Cause Analysis",
    title: "Root Cause Analysis (RCA) Final Assessment",
    duration_minutes: 25,
    passing_percentage: 70,
    total_questions: 5,
    questions: [
      {
        id: 1,
        question: "What is the core objective of conducting a Root Cause Analysis (RCA)?",
        options: [
          "To identify the underlying fundamental cause of a failure so it never recurs",
          "To quickly assign individual blame to machine operators",
          "To satisfy paperwork requirements without altering operations",
          "To lower product retail warranty periods"
        ],
        correct_answer: "To identify the underlying fundamental cause of a failure so it never recurs"
      },
      {
        id: 2,
        question: "How does the '5 Whys' technique uncover root causes?",
        options: [
          "By repeatedly asking 'Why' to drill past immediate symptoms down to origin causes",
          "By asking five different employees for their personal opinions",
          "By waiting five days before investigating an incident",
          "By issuing five written warnings to involved staff"
        ],
        correct_answer: "By repeatedly asking 'Why' to drill past immediate symptoms down to origin causes"
      },
      {
        id: 3,
        question: "What are the classical '6Ms' categories typically used in manufacturing Fishbone analyses?",
        options: [
          "Man, Machine, Material, Method, Measurement, Mother Nature (Environment)",
          "Money, Market, Marketing, Management, Margin, Momentum",
          "Monday, Month, Morning, Midday, Midnight, Minute",
          "Motor, Metal, Module, Monitor, Mechanism, Memory"
        ],
        correct_answer: "Man, Machine, Material, Method, Measurement, Mother Nature (Environment)"
      },
      {
        id: 4,
        question: "What does the quality management acronym CAPA stand for?",
        options: [
          "Corrective Action and Preventive Action",
          "Cost Accounting and Price Allocation",
          "Critical Assessment and Process Approval",
          "Customer Advisory and Product Assurance"
        ],
        correct_answer: "Corrective Action and Preventive Action"
      },
      {
        id: 5,
        question: "A corrective action is only considered successful and validated when:",
        options: [
          "Recurrence of the problem is proven to be prevented over an extended evaluation period",
          "The non-conformance ticket is closed immediately by the manager",
          "An email explanation is sent to the customer",
          "The operator promises to pay closer attention next time"
        ],
        correct_answer: "Recurrence of the problem is proven to be prevented over an extended evaluation period"
      }
    ]
  }
};

/**
 * Resolves assessment metadata by course ID or slug
 */
export const getAssessmentForCourse = (courseIdOrSlug) => {
  const str = String(courseIdOrSlug || "").trim().toLowerCase();
  
  let result = null;
  if (!isNaN(num) && COURSE_ASSESSMENT_CATALOG[num]) {
    result = COURSE_ASSESSMENT_CATALOG[num];
  } else {
    // Slug search
    result = Object.values(COURSE_ASSESSMENT_CATALOG).find(
      item => item.course_slug === str || item.course_title.toLowerCase().includes(str)
    ) || null;
  }

  if (result) {
    return {
      ...result,
      course_title: getAuthoritativeCourseName(result.id, result.course_title)
    };
  }
  return null;
};
