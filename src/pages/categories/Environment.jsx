import { FaLeaf } from "react-icons/fa";

import CategoryLandingPage from "./CategoryLandingPage";

const Environment = () => {
  const courses = [
    {
      id: 321,
      title: "ISO 14001:2026 EMS Awareness",
      description:
        "Understand environmental management systems and the principles of ISO 14001.",
      level: "Awareness",
      duration: "Self-paced",
      rating: "4.9",
      students: "1,000+",
    },
  ];

  return (
    <CategoryLandingPage
      title="Environment"
      eyebrow="Environmental Management · Sustainability"
      description="Develop knowledge of environmental management systems and sustainability-focused practices."
      heroDescription="Build the knowledge required to understand environmental management and the role of structured environmental systems."
      courses={courses}
      icon={FaLeaf}
      stats={[
        { value: "5+", label: "Environment Programs" },
        { value: "4.9/5", label: "Learner Rating" },
        { value: "2K+", label: "Learners" },
        { value: "ISO", label: "Standards Focus" },
      ]}
      benefits={[
        {
          title: "Environmental Awareness",
          description:
            "Understand the fundamentals of environmental management systems.",
        },
        {
          title: "Sustainability",
          description:
            "Develop knowledge that supports responsible environmental practices.",
        },
        {
          title: "ISO Knowledge",
          description:
            "Understand the structure and principles behind environmental standards.",
        },
        {
          title: "Practical Learning",
          description:
            "Connect environmental concepts with workplace implementation.",
        },
      ]}
    />
  );
};

export default Environment;