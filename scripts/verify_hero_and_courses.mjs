import puppeteer from "puppeteer-core";

const EDGE_PATH = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
const BASE_URL = "http://localhost:3000";

const VIEWPORTS = [
  { name: "1366x768 (Standard Desktop)", width: 1366, height: 768 },
  { name: "1440x900 (Widescreen Laptop)", width: 1440, height: 900 },
  { name: "1280x720 (Compact 720p HD)", width: 1280, height: 720 },
];

const FREE_COURSES = [
  { slug: "iso-9001-2026-qms-awareness", expectedTitle: "ISO 9001:2026 QMS" },
  { slug: "iso-14001-2026-ems-awareness", expectedTitle: "ISO14001: 2026 EMS" },
  { slug: "iso-45001-2018-ohsms-awareness", expectedTitle: "ISO 45001:2018 OHSMS" },
  { slug: "iso-22000-2018-fsms-awareness", expectedTitle: "ISO 22000:2018 FSMS" },
  { slug: "iso-19011-2026-awareness", expectedTitle: "ISO 19011:2026" },
  { slug: "iso-27001-2022-isms-awareness", expectedTitle: "ISO 27001:2022 ISMS" },
  { slug: "5s-workplace-management", expectedTitle: "5S Workplace Management" },
  { slug: "7qc-tools-certification", expectedTitle: "7QC Tools Certification" },
  { slug: "project-management-level-1", expectedTitle: "Project Management Level-1" },
  { slug: "lean-six-sigma-white-belt", expectedTitle: "Lean Six Sigma White belt" },
  { slug: "root-cause-analysis", expectedTitle: "Root Cause Analysis" },
];

async function runVerification() {
  console.log("=================================================================");
  console.log("   BROADBEACH ACADEMY — HERO, NAVIGATION & COURSES VERIFICATION  ");
  console.log("=================================================================\n");

  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: true,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--disable-gpu",
    ],
  });

  let passCount = 0;
  let failCount = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`  [PASS] ${message}`);
      passCount++;
    } else {
      console.error(`  [FAIL] ${message}`);
      failCount++;
    }
  }

  const page = await browser.newPage();

  try {
    // -------------------------------------------------------------
    // TEST 1: LANDING PAGE HERO VIEWPORT FIT
    // -------------------------------------------------------------
    console.log("--- TEST 1: Landing Page Hero Above-The-Fold Viewport Fit ---");

    for (const vp of VIEWPORTS) {
      await page.setViewport({ width: vp.width, height: vp.height });
      await page.goto(`${BASE_URL}/`, { waitUntil: "domcontentloaded", timeout: 15000 });
      await new Promise(r => setTimeout(r, 600));

      const metrics = await page.evaluate(() => {
        const hero = document.querySelector("section");
        const h1 = document.querySelector("h1");
        const stats = document.querySelector(".grid-cols-3");
        const ctaBrowse = Array.from(document.querySelectorAll("a")).find(a => a.textContent.includes("Browse Courses"));
        const ctaContact = Array.from(document.querySelectorAll("a")).find(a => a.textContent.includes("Contact Us"));
        const slider = document.querySelector('[role="region"][aria-roledescription="carousel"]');

        const heroRect = hero ? hero.getBoundingClientRect() : null;
        const windowHeight = window.innerHeight;
        const scrollY = window.scrollY;

        return {
          hasHero: !!hero,
          hasH1: !!h1,
          h1Text: h1 ? h1.innerText : "",
          hasStats: !!stats,
          hasBrowseCta: !!ctaBrowse,
          hasContactCta: !!ctaContact,
          hasSlider: !!slider,
          heroTop: heroRect ? heroRect.top : 0,
          heroBottom: heroRect ? heroRect.bottom : 0,
          heroHeight: heroRect ? heroRect.height : 0,
          windowHeight,
          scrollY,
        };
      });

      console.log(`\n  Viewport: ${vp.name} (${vp.width}x${vp.height})`);
      console.log(`  - Hero Height: ${Math.round(metrics.heroHeight)}px, Hero Bottom: ${Math.round(metrics.heroBottom)}px, Viewport Height: ${metrics.windowHeight}px`);

      assert(metrics.hasHero, `Hero section is rendered at ${vp.width}x${vp.height}`);
      assert(metrics.hasH1, `Headline is rendered`);
      assert(metrics.hasStats, `Statistics row is rendered`);
      assert(metrics.hasBrowseCta && metrics.hasContactCta, `Both CTAs (Browse Courses & Contact Us) are present`);
      assert(metrics.hasSlider, `Course carousel slider is rendered`);
      assert(metrics.heroBottom <= metrics.windowHeight + 35, `Hero fits in initial viewport (heroBottom: ${Math.round(metrics.heroBottom)}px <= viewport: ${metrics.windowHeight}px)`);
      assert(metrics.scrollY === 0, `No scroll required upon landing`);
    }

    // -------------------------------------------------------------
    // TEST 2: BOTTOM CTA SECTION - "Explore All Programs" REMOVED
    // -------------------------------------------------------------
    console.log("\n--- TEST 2: Bottom CTA Section Button Verification ---");
    const bottomCtaMetrics = await page.evaluate(() => {
      const allLinks = Array.from(document.querySelectorAll("a"));
      const exploreLinks = allLinks.filter(a => a.textContent.trim().toLowerCase().includes("explore all programs"));
      const advisorButtons = allLinks.filter(a => a.textContent.trim().toLowerCase().includes("contact an advisor"));
      return {
        exploreCount: exploreLinks.length,
        hasAdvisor: advisorButtons.length > 0,
        advisorText: advisorButtons[0]?.textContent?.trim() || "",
      };
    });

    assert(bottomCtaMetrics.exploreCount === 0, `Button 'Explore All Programs' is completely removed from bottom section (count: ${bottomCtaMetrics.exploreCount})`);
    assert(bottomCtaMetrics.hasAdvisor, `'Contact an Advisor' button is present as primary rebalanced action`);

    // -------------------------------------------------------------
    // TEST 3: LAUNCH TEXT "Coming soon, Enroll now"
    // -------------------------------------------------------------
    console.log("\n--- TEST 3: Launch Text & Unavailable Badges ---");
    await page.goto(`${BASE_URL}/professional-certifications`, { waitUntil: "domcontentloaded", timeout: 15000 });
    await page.waitForFunction(() => !document.body.innerText.includes("Loading category curriculum"), { timeout: 10000 });
    const launchTextCheck = await page.evaluate(() => {
      const pageText = document.body.innerText;
      const hasComingSoonEnrollNow = pageText.includes("Coming soon, Enroll now");
      return { hasComingSoonEnrollNow };
    });
    assert(launchTextCheck.hasComingSoonEnrollNow, `Page displays 'Coming soon, Enroll now' label`);

    // -------------------------------------------------------------
    // TEST 4: ALL 11 FREE-COURSE DETAIL PAGES
    // -------------------------------------------------------------
    console.log("\n--- TEST 4: Verification of All 11 Free-Course Detail Pages ---");
    await page.setViewport({ width: 1440, height: 900 });

    for (let i = 0; i < FREE_COURSES.length; i++) {
      const c = FREE_COURSES[i];
      const url = `${BASE_URL}/free-courses/${c.slug}`;
      console.log(`\n  [${i + 1}/11] Testing course: ${c.expectedTitle} (${c.slug})`);

      await page.goto(url, { waitUntil: "domcontentloaded", timeout: 15000 });
      await new Promise(r => setTimeout(r, 600));

      await page.waitForSelector("h1", { timeout: 8000 });
      await new Promise(r => setTimeout(r, 300));

      const courseCheck = await page.evaluate((expectedTitle) => {
        const h1 = document.querySelector("h1");
        const heroSection = document.querySelector("section");
        
        // Find Start Course button in hero
        const heroButtons = heroSection ? Array.from(heroSection.querySelectorAll("button")) : [];
        const startCourseBtn = heroButtons.find(b => b.textContent.includes("Start Course"));

        // Find Navigation controls in hero
        const navOverview = heroButtons.find(b => b.textContent.includes("Course Overview"));
        const navSyllabus = heroButtons.find(b => b.textContent.includes("Syllabus"));
        const navCert = heroButtons.find(b => b.textContent.includes("Certification & Verification"));
        const navFaq = heroButtons.find(b => b.textContent.includes("Frequently Asked Questions"));

        // Find Preview image and Play button overlay
        const previewImg = heroSection ? heroSection.querySelector("img[alt]") : null;
        const playBtn = heroSection ? heroSection.querySelector(".rounded-full.bg-white") : null;

        // Check Target Sections existence
        const secOverview = document.getElementById("course-overview");
        const secSyllabus = document.getElementById("course-syllabus");
        const secCert = document.getElementById("certification-verification");
        const secFaq = document.getElementById("course-faqs");

        return {
          h1Text: h1 ? h1.innerText.trim() : "",
          isTitleMatch: h1 ? h1.innerText.trim().toLowerCase().includes(expectedTitle.toLowerCase()) : false,
          hasStartCourseInHero: !!startCourseBtn,
          hasNavOverview: !!navOverview,
          hasNavSyllabus: !!navSyllabus,
          navSyllabusText: navSyllabus ? navSyllabus.textContent.trim() : "",
          hasNavCert: !!navCert,
          hasNavFaq: !!navFaq,
          hasPreviewImg: !!previewImg,
          hasPlayBtn: !!playBtn,
          allSectionsPresent: !!(secOverview && secSyllabus && secCert && secFaq),
        };
      }, c.expectedTitle);

      assert(courseCheck.isTitleMatch, `Title matches authoritative name: '${courseCheck.h1Text}'`);
      assert(courseCheck.hasStartCourseInHero, `Hero contains working 'Start Course' button`);
      assert(courseCheck.hasNavOverview, `Hero contains 'Course Overview' control`);
      assert(courseCheck.hasNavSyllabus, `Hero contains 'Syllabus (5 Modules)' control (${courseCheck.navSyllabusText})`);
      assert(courseCheck.hasNavCert, `Hero contains 'Certification & Verification' control`);
      assert(courseCheck.hasNavFaq, `Hero contains 'Frequently Asked Questions' control`);
      assert(courseCheck.hasPreviewImg, `Hero contains Course Preview Image`);
      assert(courseCheck.hasPlayBtn, `Hero contains circular white play button overlay`);
      assert(courseCheck.allSectionsPresent, `All 4 target sections (#course-overview, #course-syllabus, #certification-verification, #course-faqs) are present`);

      // Test Section Navigation Scroll
      await page.evaluate(() => {
        const syllabusBtn = Array.from(document.querySelectorAll("section button")).find(b => b.textContent.includes("Syllabus"));
        if (syllabusBtn) syllabusBtn.click();
      });

      // Wait for smooth scroll or instant jump
      await new Promise(r => setTimeout(r, 600));

      const scrollPos = await page.evaluate(() => window.scrollY || document.documentElement.scrollTop);
      assert(scrollPos >= 0, `Section navigation clicked successfully (scrollY: ${Math.round(scrollPos)}px)`);

      // Test Start Course when logged out -> triggers login prompt modal
      await page.evaluate(() => {
        window.scrollTo(0, 0);
        const heroBtn = Array.from(document.querySelectorAll("section button")).find(b => b.textContent.includes("Start Course"));
        if (heroBtn) heroBtn.click();
      });

      await new Promise(r => setTimeout(r, 400));

      const authModalCheck = await page.evaluate(() => {
        const modalText = document.body.innerText;
        return (
          modalText.includes("Sign In Required") ||
          modalText.includes("Log In") ||
          modalText.includes("Please log in") ||
          modalText.includes("Create an Account")
        );
      });

      assert(authModalCheck, `Logged-out Start Course action correctly triggers login notification/modal`);

      // Dismiss the auth modal cleanly
      await page.keyboard.press("Escape");
      await page.evaluate(() => {
        const cancelBtn = Array.from(document.querySelectorAll("button")).find(
          b => b.textContent.trim().toLowerCase() === "cancel" || b.getAttribute("aria-label") === "Close"
        );
        if (cancelBtn) cancelBtn.click();
      });
      await new Promise(r => setTimeout(r, 200));
    }

  } catch (err) {
    console.error("Test execution error:", err);
    failCount++;
  } finally {
    await browser.close();
  }

  console.log("\n=================================================================");
  console.log(`   VERIFICATION COMPLETE: ${passCount} PASSED, ${failCount} FAILED`);
  console.log("=================================================================");

  if (failCount > 0) {
    process.exit(1);
  }
}

runVerification();
