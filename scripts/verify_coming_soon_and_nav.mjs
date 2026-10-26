import puppeteer from "puppeteer-core";

const EDGE_PATH = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
const BASE_URL = "http://localhost:3000";

const VIEWPORTS = [
  { name: "1366x768 (Standard Desktop)", width: 1366, height: 768 },
  { name: "1440x900 (Widescreen Laptop)", width: 1440, height: 900 },
  { name: "1280x720 (Compact 720p HD)", width: 1280, height: 720 },
];

const NON_FREE_PAGES = [
  { path: "/lead-auditor", name: "Lead Auditor" },
  { path: "/internal-auditor", name: "Internal Auditor" },
  { path: "/health-safety-hse", name: "Health & Safety (HSE)" },
  { path: "/professional-certifications", name: "Professional Certifications" },
  { path: "/category/environment", name: "Environment Certifications" },
];

async function run() {
  console.log("=================================================================");
  console.log("   BROADBEACH ACADEMY — NAVIGATION & COMING SOON QA VERIFICATION ");
  console.log("=================================================================\n");

  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-gpu", "--disable-dev-shm-usage"],
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
    // -----------------------------------------------------------------
    // TEST SUITE 1: COURSE SECTION NAVIGATION (NO HORIZONTAL OVERFLOW)
    // -----------------------------------------------------------------
    console.log("--- TEST SUITE 1: Course Section Navigation Horizontal Scroll Check ---");

    const navTestViewports = [
      { name: "1440x900 (Desktop)", width: 1440, height: 900 },
      { name: "1366x768 (Desktop)", width: 1366, height: 768 },
      { name: "768x1024 (Tablet)", width: 768, height: 1024 },
      { name: "375x812 (Mobile)", width: 375, height: 812 },
    ];

    for (const vp of navTestViewports) {
      await page.setViewport({ width: vp.width, height: vp.height });
      await page.goto(`${BASE_URL}/free-courses/iso-9001-2026-qms-awareness`, { waitUntil: "domcontentloaded", timeout: 15000 });
      await new Promise(r => setTimeout(r, 600));

      const navMetrics = await page.evaluate(() => {
        const nav = document.querySelector('[role="tablist"][aria-label="Course section navigation"]');
        if (!nav) return { exists: false };

        const buttons = Array.from(nav.querySelectorAll("button"));
        const navRect = nav.getBoundingClientRect();
        const hasHorizontalScroll = nav.scrollWidth > nav.clientWidth;
        const computedStyle = window.getComputedStyle(nav);

        const buttonDetails = buttons.map(b => {
          const r = b.getBoundingClientRect();
          return {
            text: b.textContent.trim(),
            width: r.width,
            height: r.height,
            visible: r.width > 0 && r.height > 0,
            rectRight: r.right,
          };
        });

        // Also check if entire page has unwanted horizontal scroll
        const pageHasHorizontalScroll = document.documentElement.scrollWidth > document.documentElement.clientWidth;

        return {
          exists: true,
          buttonCount: buttons.length,
          scrollWidth: nav.scrollWidth,
          clientWidth: nav.clientWidth,
          hasHorizontalScroll,
          flexWrap: computedStyle.flexWrap,
          overflowX: computedStyle.overflowX,
          buttonDetails,
          pageHasHorizontalScroll,
        };
      });

      console.log(`\n  Viewport: ${vp.name}`);
      console.log(`  - Nav scrollWidth: ${navMetrics.scrollWidth}px, clientWidth: ${navMetrics.clientWidth}px`);
      console.log(`  - flex-wrap: ${navMetrics.flexWrap}, overflow-x: ${navMetrics.overflowX}`);
      console.log(`  - Page horizontal scroll: ${navMetrics.pageHasHorizontalScroll}`);

      assert(navMetrics.exists, `Course section navigation exists at ${vp.name}`);
      assert(navMetrics.buttonCount === 4, `All 4 navigation buttons rendered (found: ${navMetrics.buttonCount})`);
      assert(!navMetrics.hasHorizontalScroll, `Navigation container has NO horizontal scrollbar (scrollWidth ${navMetrics.scrollWidth} <= clientWidth ${navMetrics.clientWidth})`);
      assert(navMetrics.flexWrap === "wrap", `Navigation container uses flex-wrap`);
      assert(navMetrics.overflowX !== "auto" && navMetrics.overflowX !== "scroll", `overflow-x is not auto/scroll on nav container`);
      assert(!navMetrics.pageHasHorizontalScroll, `No page-level horizontal overflow`);

      for (const btn of navMetrics.buttonDetails) {
        assert(btn.visible, `Button '${btn.text}' is fully visible (${Math.round(btn.width)}x${Math.round(btn.height)}px)`);
      }
    }

    // -----------------------------------------------------------------
    // TEST SUITE 2: SECTION NAVIGATION CLICK & SCROLL BEHAVIOR
    // -----------------------------------------------------------------
    console.log("\n--- TEST SUITE 2: Section Navigation In-Page Jump Verification ---");
    await page.setViewport({ width: 1440, height: 900 });
    await page.goto(`${BASE_URL}/free-courses/iso-9001-2026-qms-awareness`, { waitUntil: "domcontentloaded", timeout: 15000 });
    await new Promise(r => setTimeout(r, 600));

    const tabsToTest = [
      { name: "Syllabus", targetId: "course-syllabus" },
      { name: "Certification & Verification", targetId: "certification-verification" },
      { name: "Frequently Asked Questions", targetId: "course-faqs" },
      { name: "Course Overview", targetId: "course-overview" },
    ];

    for (const tab of tabsToTest) {
      await page.evaluate((tabName) => {
        const nav = document.querySelector('[role="tablist"][aria-label="Course section navigation"]');
        const btn = Array.from(nav.querySelectorAll("button")).find(b => b.textContent.includes(tabName));
        if (btn) btn.click();
      }, tab.name);

      await new Promise(r => setTimeout(r, 600));

      const targetVisible = await page.evaluate((targetId) => {
        const target = document.getElementById(targetId);
        if (!target) return false;
        const rect = target.getBoundingClientRect();
        // Visible if top is within upper portion of viewport (accounting for header)
        return rect.top >= -50 && rect.top <= window.innerHeight;
      }, tab.targetId);

      assert(targetVisible, `Clicking '${tab.name}' successfully navigates to #${tab.targetId}`);
    }

    // -----------------------------------------------------------------
    // TEST SUITE 3: COMING SOON PAGES HERO VIEWPORT FIT AT COMMON RESOLUTIONS
    // -----------------------------------------------------------------
    console.log("\n--- TEST SUITE 3: Coming Soon Pages Hero Viewport Fit ---");

    for (const vp of VIEWPORTS) {
      console.log(`\n  >>> Testing Viewport: ${vp.name} (${vp.width}x${vp.height}) <<<`);
      await page.setViewport({ width: vp.width, height: vp.height });

      for (const p of NON_FREE_PAGES) {
        await page.goto(`${BASE_URL}${p.path}`, { waitUntil: "domcontentloaded", timeout: 15000 });
        await page.waitForFunction(() => !document.body.innerText.includes("Loading category curriculum"), { timeout: 10000 });
        await page.waitForSelector("h1", { timeout: 10000 });
        await new Promise(r => setTimeout(r, 400));

        const heroCheck = await page.evaluate(() => {
          const header = document.querySelector("header") || document.querySelector("nav");
          const hero = document.querySelector("section");
          const h1 = document.querySelector("h1");
          const ctaBtn = Array.from(document.querySelectorAll("button, a")).find(
            el => el.textContent.includes("Coming soon, Enroll now")
          );

          const heroRect = hero ? hero.getBoundingClientRect() : null;
          const h1Rect = h1 ? h1.getBoundingClientRect() : null;
          const ctaRect = ctaBtn ? ctaBtn.getBoundingClientRect() : null;

          return {
            hasHero: !!hero,
            hasH1: !!h1,
            h1Text: h1 ? h1.innerText.trim() : "",
            hasCta: !!ctaBtn,
            ctaText: ctaBtn ? ctaBtn.innerText.trim() : "",
            heroHeight: heroRect ? heroRect.height : 0,
            heroBottom: heroRect ? heroRect.bottom : 0,
            h1Top: h1Rect ? h1Rect.top : 0,
            ctaTop: ctaRect ? ctaRect.top : 0,
            ctaBottom: ctaRect ? ctaRect.bottom : 0,
            windowHeight: window.innerHeight,
            scrollY: window.scrollY,
          };
        });

        console.log(`    Page: ${p.name} (${p.path})`);
        console.log(`    - Hero Bottom: ${Math.round(heroCheck.heroBottom)}px, Viewport Height: ${heroCheck.windowHeight}px`);
        console.log(`    - Primary CTA bottom: ${Math.round(heroCheck.ctaBottom)}px`);

        assert(heroCheck.hasHero, `${p.name}: Hero is rendered`);
        assert(heroCheck.hasH1, `${p.name}: H1 heading is rendered ('${heroCheck.h1Text}')`);
        assert(heroCheck.hasCta, `${p.name}: Primary action 'Coming soon, Enroll now' is present`);
        assert(
          heroCheck.ctaBottom <= heroCheck.windowHeight,
          `${p.name}: Essential hero content & CTA fits above-the-fold at ${vp.width}x${vp.height} (CTA bottom ${Math.round(heroCheck.ctaBottom)}px <= ${heroCheck.windowHeight}px)`
        );
        assert(heroCheck.scrollY === 0, `${p.name}: No initial vertical scroll required`);
      }
    }

    // -----------------------------------------------------------------
    // TEST SUITE 4: STANDARDIZED "Coming soon, Enroll now" WORDING & ENQUIRY CTA
    // -----------------------------------------------------------------
    console.log("\n--- TEST SUITE 4: Standardized Wording & Enquiry CTA Workflow ---");

    for (const p of NON_FREE_PAGES) {
      await page.goto(`${BASE_URL}${p.path}`, { waitUntil: "domcontentloaded", timeout: 15000 });
      await page.waitForFunction(() => !document.body.innerText.includes("Loading category curriculum"), { timeout: 10000 });
      await page.waitForSelector("h1", { timeout: 10000 });
      await new Promise(r => setTimeout(r, 400));

      const wordingCheck = await page.evaluate(() => {
        const bodyText = document.body.innerText;
        const hasEnrollNow = bodyText.includes("Coming soon, Enroll now");
        // Check cards
        const allButtons = Array.from(document.querySelectorAll("button, a"));
        const cardCtas = allButtons.filter(b => b.textContent.includes("Coming soon, Enroll now"));
        return {
          hasEnrollNow,
          cardCtaCount: cardCtas.length,
        };
      });

      assert(wordingCheck.hasEnrollNow, `${p.name}: Standardized wording 'Coming soon, Enroll now' is present`);
      assert(wordingCheck.cardCtaCount >= 1, `${p.name}: Found ${wordingCheck.cardCtaCount} 'Coming soon, Enroll now' CTAs`);

      // Click the primary CTA and verify scroll to enquiry form
      await page.evaluate(() => {
        window.scrollTo(0, 0);
        const cta = Array.from(document.querySelectorAll("button, a")).find(
          b => b.textContent.includes("Coming soon, Enroll now")
        );
        if (cta) cta.click();
      });

      await new Promise(r => setTimeout(r, 1200));

      const enquiryScrolled = await page.evaluate(() => {
        const enquirySec = document.getElementById("offline-enquiry-section") || document.getElementById("enquiry-section");
        if (!enquirySec) return false;
        const rect = enquirySec.getBoundingClientRect();
        return rect.top < window.innerHeight && rect.bottom > 0;
      });

      assert(enquiryScrolled, `${p.name}: Clicking 'Coming soon, Enroll now' smoothly scrolled to Enquiry section`);
    }

    // -----------------------------------------------------------------
    // TEST SUITE 5: FREE COURSES INTEGRITY (NOT MARKED COMING SOON)
    // -----------------------------------------------------------------
    console.log("\n--- TEST SUITE 5: Free Courses Integrity ---");
    await page.goto(`${BASE_URL}/free-courses`, { waitUntil: "domcontentloaded", timeout: 15000 });
    await page.waitForSelector("h1", { timeout: 10000 });
    // Wait for skeleton loaders to finish loading real courses
    await page.waitForFunction(() => !document.querySelector(".animate-pulse"), { timeout: 10000 });
    await new Promise(r => setTimeout(r, 400));

    const freeCoursesCheck = await page.evaluate(() => {
      const cards = Array.from(document.querySelectorAll("a, button"));
      const startCourseBtns = cards.filter(b => b.textContent.includes("Start Course") || b.textContent.includes("Enroll Free"));
      const comingSoonBtns = cards.filter(b => b.textContent.includes("Coming soon, Enroll now"));
      return {
        hasStartCourse: startCourseBtns.length > 0,
        startCourseCount: startCourseBtns.length,
        comingSoonCountOnFreeCatalogue: comingSoonBtns.length,
      };
    });

    assert(freeCoursesCheck.hasStartCourse, `Free Courses catalogue contains working course enrollment buttons (found ${freeCoursesCheck.startCourseCount})`);
    assert(freeCoursesCheck.comingSoonCountOnFreeCatalogue === 0, `Free Courses catalogue has 0 'Coming soon, Enroll now' buttons (all 11 courses remain free and available)`);

  } catch (err) {
    console.error("Test execution error:", err);
    failCount++;
  } finally {
    await browser.close();
  }

  console.log("\n=================================================================");
  console.log(`   FINAL VERIFICATION RESULTS: ${passCount} PASSED, ${failCount} FAILED`);
  console.log("=================================================================");

  if (failCount > 0) {
    process.exit(1);
  }
}

run();
