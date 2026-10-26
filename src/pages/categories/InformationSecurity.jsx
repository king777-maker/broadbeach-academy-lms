import { FaShieldAlt } from "react-icons/fa";

import CategoryLandingPage from "./CategoryLandingPage";

const InformationSecurity = () => {
  const courses = [
    {
      id: 325,
      title: "ISO 27001:2022 ISMS Awareness",
      description:
        "Understand information security management systems and the core concepts of ISO 27001.",
      level: "Awareness",
      duration: "Self-paced",
      rating: "4.9",
      students: "1,100+",
    },
    {
      id: 324,
      title: "ISO 19011:2026 Awareness",
      description:
        "Learn the principles and approach to management system auditing using ISO 19011.",
      level: "Awareness",
      duration: "Self-paced",
      rating: "4.8",
      students: "850+",
    },
  ];

  return (
    <CategoryLandingPage
      title="Information Security"
      eyebrow="Information Security · Business Continuity"
      description="Build awareness of information security management systems, auditing principles and organizational resilience."
      heroDescription="Develop practical knowledge for protecting information, understanding security systems and strengthening organizational resilience."
      courses={courses}
      icon={FaShieldAlt}
      stats={[
        { value: "10+", label: "Security Programs" },
        { value: "4.9/5", label: "Learner Rating" },
        { value: "3K+", label: "Learners" },
        { value: "ISO", label: "Standards Focus" },
      ]}
      benefits={[
        {
          title: "Security Awareness",
          description:
            "Understand the fundamental principles of information security management.",
        },
        {
          title: "Risk Perspective",
          description:
            "Build awareness of security risks and structured management approaches.",
        },
        {
          title: "Audit Knowledge",
          description:
            "Develop an understanding of management system auditing principles.",
        },
        {
          title: "Business Resilience",
          description:
            "Learn concepts that support organizational continuity and resilience.",
        },
      ]}
    />
  );
};

export default InformationSecurity;