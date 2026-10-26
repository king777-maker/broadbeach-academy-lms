import { FaHardHat } from "react-icons/fa";

import CategoryLandingPage from "./CategoryLandingPage";

const EHSCertifications = () => {
  const courses = [
    {
      id: 322,
      title: "ISO 45001:2018 OHSMS Awareness",
      description:
        "Understand the fundamentals of occupational health and safety management systems and ISO 45001 requirements.",
      level: "Awareness",
      duration: "Self-paced",
      rating: "4.9",
      students: "1,200+",
    },
    {
      id: 321,
      title: "ISO 14001:2026 EMS Awareness",
      description:
        "Build an understanding of environmental management systems and the principles behind ISO 14001.",
      level: "Awareness",
      duration: "Self-paced",
      rating: "4.9",
      students: "1,000+",
    },
    {
      id: 327,
      title: "7QC Tools Certification",
      description:
        "Learn practical quality improvement tools used to identify, analyze and solve workplace problems.",
      level: "Certification",
      duration: "Self-paced",
      rating: "4.8",
      students: "800+",
    },
  ];

  return (
    <CategoryLandingPage
      title="EHS Certifications"
      eyebrow="Health · Safety · Environment"
      description="Develop practical knowledge across environmental management, occupational health and safety, and workplace improvement."
      heroDescription="Build the knowledge and confidence needed to understand modern Health, Safety and Environment management systems."
      courses={courses}
      icon={FaHardHat}
      stats={[
        { value: "10+", label: "Professional Programs" },
        { value: "4.9/5", label: "Learner Rating" },
        { value: "5K+", label: "Learners" },
        { value: "Global", label: "Standards Focus" },
      ]}
      benefits={[
        {
          title: "Industry Standards",
          description:
            "Understand internationally recognized management system principles.",
        },
        {
          title: "Practical Learning",
          description:
            "Focus on knowledge that can be applied in real workplace situations.",
        },
        {
          title: "Career Development",
          description:
            "Build knowledge that supports professional growth in EHS roles.",
        },
        {
          title: "Structured Programs",
          description:
            "Follow clearly organized lessons and assessments.",
        },
      ]}
    />
  );
};

export default EHSCertifications;