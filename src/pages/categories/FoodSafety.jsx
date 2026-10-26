import { FaUtensils } from "react-icons/fa";

import CategoryLandingPage from "./CategoryLandingPage";

const FoodSafety = () => {
  const courses = [
    {
      id: 323,
      title: "ISO 22000:2018 FSMS Awareness",
      description:
        "Understand the fundamentals of food safety management systems and ISO 22000.",
      level: "Awareness",
      duration: "Self-paced",
      rating: "4.9",
      students: "1,100+",
    },
  ];

  return (
    <CategoryLandingPage
      title="Food Safety"
      eyebrow="Food Safety · Quality · Compliance"
      description="Build awareness of food safety management systems and the principles supporting safe and controlled food operations."
      heroDescription="Develop practical knowledge of food safety systems and the structured approach used to manage food safety risks."
      courses={courses}
      icon={FaUtensils}
      stats={[
        { value: "5+", label: "Food Safety Programs" },
        { value: "4.9/5", label: "Learner Rating" },
        { value: "2K+", label: "Learners" },
        { value: "ISO", label: "Standards Focus" },
      ]}
      benefits={[
        {
          title: "Food Safety",
          description:
            "Understand the fundamentals of systematic food safety management.",
        },
        {
          title: "Risk Awareness",
          description:
            "Build awareness of identifying and controlling food safety risks.",
        },
        {
          title: "Standards Knowledge",
          description:
            "Understand important food safety management system principles.",
        },
        {
          title: "Professional Skills",
          description:
            "Develop knowledge useful for food industry professionals.",
        },
      ]}
    />
  );
};

export default FoodSafety;