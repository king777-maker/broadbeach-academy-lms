import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ROUTE_META = {
  "/": {
    title: "Broadbeach Academy — Leading Global Certification & LMS Platform",
    description: "Advance your career with accredited online courses and verifiable digital certifications in ISO 9001, ISO 14001, ISO 45001, ISO 27001, and Lean Six Sigma."
  },
  "/courses": {
    title: "Course Catalog & Professional Certifications | Broadbeach Academy",
    description: "Explore our full catalog of ISO internal auditor, lead auditor, aerospace, and operational excellence certifications."
  },
  "/course": {
    title: "Course Catalog & Professional Certifications | Broadbeach Academy",
    description: "Explore our full catalog of ISO internal auditor, lead auditor, aerospace, and operational excellence certifications."
  },
  "/free-courses": {
    title: "Free Courses & Verifiable Certifications | Broadbeach Academy",
    description: "Enroll in 100% free ISO foundation courses. Complete self-paced modules, take the assessment, and earn an instant verifiable certificate."
  },
  "/verify-certificate": {
    title: "Verify Certificate & Authenticate Credentials | Broadbeach Academy",
    description: "Verify the authenticity and validity of Broadbeach Academy issued certificates using our real-time credential verification registry."
  },
  "/certificate-access": {
    title: "Certificate Verification Registry | Broadbeach Academy",
    description: "Authenticate learner certificates and verify completion status in compliance with ISO/IEC standards."
  },
  "/my-courses": {
    title: "My Courses & Learning Dashboard | Broadbeach Academy",
    description: "Access your enrolled training programs, track progress, review course lessons, and launch certification examinations."
  },
  "/my-profile": {
    title: "My Profile & Account Settings | Broadbeach Academy",
    description: "Manage your learner profile, credential details, and account preferences securely on Broadbeach Academy."
  },
  "/contact": {
    title: "Contact Us & Regional Support Offices | Broadbeach Academy",
    description: "Get in touch with the Broadbeach Academy admissions, support, and corporate training team in Bengaluru, India and globally."
  },
  "/raise-a-ticket": {
    title: "Raise a Support Ticket & Grievance Redressal | Broadbeach Academy",
    description: "Submit a support ticket or grievance for prompt resolution by our academic coordination and compliance desk."
  },
  "/about": {
    title: "About Us — Quality Management Leadership | Broadbeach Academy",
    description: "Learn about Broadbeach Academy's heritage, accreditation alignments, and commitment to global professional excellence."
  },
  "/about-us": {
    title: "About Us — Quality Management Leadership | Broadbeach Academy",
    description: "Learn about Broadbeach Academy's heritage, accreditation alignments, and commitment to global professional excellence."
  },
  "/accreditations-approvals": {
    title: "Accreditations, Approvals & Standards | Broadbeach Academy",
    description: "Learn about our alignment with international ISO quality management, environmental, and auditing benchmarks."
  },
  "/terms-conditions": {
    title: "Terms & Conditions / Terms of Use | Broadbeach Academy",
    description: "Review the terms and conditions governing enrollment, account access, certification issuance, and acceptable use."
  },
  "/terms-of-use": {
    title: "Terms of Use | Broadbeach Academy",
    description: "Review the terms of use governing student accounts, academic integrity, and certification issuance."
  },
  "/privacy-policy": {
    title: "Privacy Policy (DPDP Act 2023 Compliant) | Broadbeach Academy",
    description: "Understand how Broadbeach Academy collects, processes, and protects personal data in compliance with the Digital Personal Data Protection Act, 2023."
  },
  "/cookie-policy": {
    title: "Cookie Policy & Tracker Disclosure | Broadbeach Academy",
    description: "Detailed inventory of cookies, local storage mechanisms, and third-party embeds utilized across Broadbeach Academy."
  },
  "/cancellation-refund-policy": {
    title: "Cancellation & Refund Policy | Broadbeach Academy",
    description: "Review our transparent cancellation terms, refund eligibility criteria, and duplicate payment resolution guidelines."
  },
  "/return-policy": {
    title: "Return & Refund Policy | Broadbeach Academy",
    description: "Transparent policy on refunds, cancellation timelines, and digital course access."
  },
  "/accessibility-statement": {
    title: "Accessibility Statement (WCAG 2.2 Level AA) | Broadbeach Academy",
    description: "Broadbeach Academy's commitment to digital accessibility, inclusive design, and WCAG 2.2 AA conformance."
  },
  "/data-compliance-policy": {
    title: "Data & Statutory Compliance Policy | Broadbeach Academy",
    description: "Overview of Broadbeach Academy's data governance architecture under the DPDP Act 2023, IT Act 2000, and Consumer Protection Act 2019."
  },
  "/internal-auditor": {
    title: "Internal Auditor Certification Programs | Broadbeach Academy",
    description: "First-party and second-party internal auditor certifications adhering to ISO 19011 auditing principles."
  },
  "/lead-auditor": {
    title: "Lead Auditor Certification Programs | Broadbeach Academy",
    description: "Executive third-party lead auditor courses recognized globally for quality, safety, environmental, and information security management."
  },
  "/aerospace": {
    title: "Aerospace & Defense Certifications (AS9100) | Broadbeach Academy",
    description: "Aviation, space, and defense quality management certifications covering AS9100 Rev D, AS9110, and AS9120."
  },
  "/lean-six-sigma": {
    title: "Lean Six Sigma Certifications (Yellow, Green, Black Belt) | Broadbeach Academy",
    description: "Operational excellence and DMAIC methodology certifications for engineers, managers, and process analysts."
  },
  "/professional-certifications": {
    title: "Professional Cross-Industry Certifications | Broadbeach Academy",
    description: "Specialized certifications in medical devices (ISO 13485), automotive quality (IATF 16949), and corporate ESG sustainability."
  }
};

const PageMetaTracker = () => {
  const location = useLocation();

  useEffect(() => {
    const pathname = location.pathname;

    let meta = ROUTE_META[pathname];

    // Handle dynamic course or category routes
    if (!meta) {
      if (pathname.startsWith("/courses/") || pathname.startsWith("/free-courses/")) {
        const slug = pathname.split("/")[2] || "Course";
        const formattedTitle = slug
          .replace(/-/g, " ")
          .replace(/\b\w/g, (c) => c.toUpperCase());
        meta = {
          title: `${formattedTitle} — Certification & Syllabus | Broadbeach Academy`,
          description: `Detailed syllabus, course modules, assessment criteria, and enrollment details for ${formattedTitle} on Broadbeach Academy.`
        };
      } else if (pathname.startsWith("/category/")) {
        const cat = pathname.replace("/category/", "").replace(/-/g, " ");
        const formattedCat = cat.replace(/\b\w/g, (c) => c.toUpperCase());
        meta = {
          title: `${formattedCat} Certifications & Training | Broadbeach Academy`,
          description: `Advance your career with certified training programs in ${formattedCat}.`
        };
      } else if (pathname.startsWith("/learning/")) {
        meta = {
          title: "Learning Portal & Course Modules | Broadbeach Academy",
          description: "Interactive online learning portal, video lessons, and syllabus slides for your enrolled certification."
        };
      } else if (pathname.startsWith("/assignment/")) {
        meta = {
          title: "Certification Assessment & Exam | Broadbeach Academy",
          description: "Online examination and knowledge assessment for your Broadbeach Academy certification."
        };
      } else if (pathname.startsWith("/certificate/")) {
        meta = {
          title: "Official Certificate of Completion | Broadbeach Academy",
          description: "View and download your official digitally verifiable Broadbeach Academy certificate of completion."
        };
      } else {
        meta = {
          title: "Broadbeach Academy — Leading Global Certification & LMS Platform",
          description: "Accredited online learning and verifiable certifications in ISO quality, environmental, safety, and continuous improvement."
        };
      }
    }

    if (meta) {
      document.title = meta.title;

      // Update or create meta description
      let metaDesc = document.querySelector('meta[name="description"]');
      if (!metaDesc) {
        metaDesc = document.createElement("meta");
        metaDesc.name = "description";
        document.head.appendChild(metaDesc);
      }
      metaDesc.content = meta.description;

      // Update OpenGraph Title & Description
      let ogTitle = document.querySelector('meta[property="og:title"]');
      if (ogTitle) ogTitle.content = meta.title;

      let ogDesc = document.querySelector('meta[property="og:description"]');
      if (ogDesc) ogDesc.content = meta.description;
    }
  }, [location.pathname]);

  return null;
};

export default PageMetaTracker;
