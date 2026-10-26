import { FaBriefcase } from "react-icons/fa";

import CategoryLandingPage from "./CategoryLandingPage";

const ManagementCertifications = () => {
  const courses = [
    {
      id: 320,
      title: "ISO 9001:2026 QMS Awareness",
      description:
        "Understand the principles and requirements of quality management systems and ISO 9001.",
      level: "Awareness",
      duration: "Self-paced",
      rating: "4.9",
      students: "1,500+",
    },
    {
      id: 328,
      title: "Project Management Level-1",
      description:
        "Develop foundational project management knowledge and understand structured project delivery.",
      level: "Level 1",
      duration: "Self-paced",
      rating: "4.8",
      students: "900+",
    },
    {
      id: 330,
      title: "Root Cause Analysis",
      description:
        "Learn structured approaches for identifying root causes and improving organizational performance.",
      level: "Professional",
      duration: "Self-paced",
      rating: "4.9",
      students: "700+",
    },
  ];

  return (
    <CategoryLandingPage
      title="Management Certifications"
      eyebrow="Management · Quality · Performance"
      description="Develop management and organizational improvement skills through structured professional learning programs."
      heroDescription="Strengthen your management capabilities with practical programs designed for today's organizations."
      courses={courses}
      icon={FaBriefcase}
      stats={[
        { value: "15+", label: "Programs" },
        { value: "4.9/5", label: "Learner Rating" },
        { value: "8K+", label: "Learners" },
        { value: "Global", label: "Recognition" },
      ]}
      benefits={[
        {
          title: "Management Skills",
          description:
            "Build knowledge that supports effective management and decision-making.",
        },
        {
          title: "Quality Focus",
          description:
            "Understand structured approaches to quality and continual improvement.",
        },
        {
          title: "Professional Growth",
          description:
            "Develop skills that can strengthen your professional profile.",
        },
        {
          title: "Practical Approach",
          description:
            "Learn concepts with a focus on real organizational application.",
        },
      ]}
    />
  );
};

export default ManagementCertifications;