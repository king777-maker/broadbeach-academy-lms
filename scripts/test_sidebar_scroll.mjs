import puppeteer from "puppeteer-core";

const EDGE_PATH = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";

async function runTests() {
  console.log("=== STARTING ADMIN SIDEBAR SCROLL & LAYOUT VERIFICATION ===");
  
  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: true,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--disable-gpu",
      "--window-size=1440,900"
    ]
  });

  const page = await browser.newPage();

  // Helper to initialize session
  async function setupAdminSession() {
    const envContent = fs.existsSync(".env") ? fs.readFileSync(".env", "utf8") : "";
    const match = envContent.match(/^VITE_ADMIN_LOGIN_PATH=(.+)$/m);
    const adminLoginPath = match ? match[1].trim() : "/admin/login";
    await page.goto(`http://localhost:3000${adminLoginPath}`, { waitUntil: "domcontentloaded" });
    await page.evaluate(async () => {
      const loginRes = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: "admin@broadbeachlearning.com",
          password: "broad_beach_admin_2026",
        }),
      }).then((r) => r.json());

      if (loginRes?.challenge_id) {
        const mfaRes = await fetch("/api/admin/login-2fa", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            challenge_id: loginRes.challenge_id,
            code: "123456",
          }),
        }).then((r) => r.json());

        if (mfaRes?.data) {
          localStorage.setItem("bb_admin_user", JSON.stringify(mfaRes.data));
        }
      }
    });
    await new Promise((r) => setTimeout(r, 500));
  }

  const results = {
    desktop_1440_900: {},
    laptop_1280_720: {},
    tablet_768_1024: {},
    mobile_390_844: {},
    modules_navigation: {},
    allPassed: true
  };

  try {
    await setupAdminSession();

    // =========================================================================
    // TEST 1: Desktop Viewport (1440 x 900)
    // =========================================================================
    console.log("\n[TEST 1] Testing Desktop Viewport (1440 x 900)...");
    await page.setViewport({ width: 1440, height: 900 });
    await page.goto("http://localhost:3000/admin", { waitUntil: "domcontentloaded" });
    await new Promise((r) => setTimeout(r, 1000));

    const desktopMetrics = await page.evaluate(() => {
      const aside = document.querySelector('aside[aria-label="Admin Sidebar Navigation"]');
      const header = document.querySelector('header');
      const nav = document.querySelector('.admin-sidebar-nav');
      const supportCard = aside?.querySelector('a[href="/"]')?.parentElement;
      const initialScrollY = window.scrollY;

      const asideRect = aside ? aside.getBoundingClientRect() : null;
      const asideStyle = aside ? window.getComputedStyle(aside) : null;
      const navStyle = nav ? window.getComputedStyle(nav) : null;

      // Scroll window down by 600px
      window.scrollTo(0, 600);
      const scrolledY = window.scrollY;
      const asideRectAfterScroll = aside ? aside.getBoundingClientRect() : null;

      const horizontalOverflow = document.documentElement.scrollWidth > document.documentElement.clientWidth;

      return {
        asideFound: !!aside,
        asidePosition: asideStyle ? asideStyle.position : null,
        asideInitialTop: asideRect ? asideRect.top : null,
        asideInitialLeft: asideRect ? asideRect.left : null,
        asideInitialWidth: asideRect ? asideRect.width : null,
        asideInitialHeight: asideRect ? asideRect.height : null,
        asideTopAfterScroll: asideRectAfterScroll ? asideRectAfterScroll.top : null,
        asideLeftAfterScroll: asideRectAfterScroll ? asideRectAfterScroll.left : null,
        asideOverflowY: asideStyle ? asideStyle.overflowY : null,
        navOverflowY: navStyle ? navStyle.overflowY : null,
        initialScrollY,
        scrolledY,
        horizontalOverflow,
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth
      };
    });

    console.log("Desktop metrics:", JSON.stringify(desktopMetrics, null, 2));

    const d1Passed =
      desktopMetrics.asideFound &&
      desktopMetrics.asidePosition === "fixed" &&
      desktopMetrics.asideInitialTop === 0 &&
      desktopMetrics.asideTopAfterScroll === 0 &&
      desktopMetrics.scrolledY >= 200 &&
      !desktopMetrics.horizontalOverflow;

    results.desktop_1440_900 = { ...desktopMetrics, passed: d1Passed };
    console.log(`Desktop (1440x900) stationary test: ${d1Passed ? "PASSED" : "FAILED"}`);
    if (!d1Passed) results.allPassed = false;

    // Test Collapse Toggle on Desktop
    console.log("Testing collapse toggle on Desktop...");
    const collapseTest = await page.evaluate(async () => {
      const toggleBtn = document.querySelector('header button[aria-label="Toggle sidebar navigation"]');
      if (!toggleBtn) return { success: false, reason: "No toggle button" };

      const asideBefore = document.querySelector('aside[aria-label="Admin Sidebar Navigation"]');
      const widthBefore = asideBefore ? asideBefore.getBoundingClientRect().width : 0;

      toggleBtn.click();
      await new Promise((r) => setTimeout(r, 400));

      const widthAfter = asideBefore ? asideBefore.getBoundingClientRect().width : 0;

      // Toggle back
      toggleBtn.click();
      await new Promise((r) => setTimeout(r, 400));
      const widthRestored = asideBefore ? asideBefore.getBoundingClientRect().width : 0;

      return {
        widthBefore,
        widthAfter,
        widthRestored,
        collapsedCorrectly: widthAfter <= 90 && widthBefore > 200 && widthRestored > 200
      };
    });
    console.log("Collapse test results:", JSON.stringify(collapseTest, null, 2));

    // =========================================================================
    // TEST 2: Laptop Viewport (1280 x 720)
    // =========================================================================
    console.log("\n[TEST 2] Testing Laptop Viewport (1280 x 720)...");
    await page.setViewport({ width: 1280, height: 720 });
    await page.goto("http://localhost:3000/admin", { waitUntil: "domcontentloaded" });
    await new Promise((r) => setTimeout(r, 1000));

    const laptopMetrics = await page.evaluate(() => {
      const aside = document.querySelector('aside[aria-label="Admin Sidebar Navigation"]');
      window.scrollTo(0, 0);
      const rectBefore = aside ? aside.getBoundingClientRect() : null;

      window.scrollTo(0, 450);
      const scrolledY = window.scrollY;
      const rectAfter = aside ? aside.getBoundingClientRect() : null;

      const horizontalOverflow = document.documentElement.scrollWidth > document.documentElement.clientWidth;

      return {
        asidePosition: aside ? window.getComputedStyle(aside).position : null,
        topBefore: rectBefore ? rectBefore.top : null,
        topAfter: rectAfter ? rectAfter.top : null,
        scrolledY,
        horizontalOverflow
      };
    });

    console.log("Laptop metrics:", JSON.stringify(laptopMetrics, null, 2));
    const l1Passed =
      laptopMetrics.asidePosition === "fixed" &&
      laptopMetrics.topBefore === 0 &&
      laptopMetrics.topAfter === 0 &&
      laptopMetrics.scrolledY >= 400 &&
      !laptopMetrics.horizontalOverflow;

    results.laptop_1280_720 = { ...laptopMetrics, passed: l1Passed };
    console.log(`Laptop (1280x720) stationary test: ${l1Passed ? "PASSED" : "FAILED"}`);
    if (!l1Passed) results.allPassed = false;

    // =========================================================================
    // TEST 3: Tablet Viewport (768 x 1024)
    // =========================================================================
    console.log("\n[TEST 3] Testing Tablet Viewport (768 x 1024)...");
    await page.setViewport({ width: 768, height: 1024 });
    await page.goto("http://localhost:3000/admin", { waitUntil: "domcontentloaded" });
    await new Promise((r) => setTimeout(r, 1000));

    const tabletMetrics = await page.evaluate(async () => {
      const desktopAside = document.querySelector('aside[aria-label="Admin Sidebar Navigation"]');
      const desktopAsideVisible = desktopAside ? window.getComputedStyle(desktopAside).display !== "none" : false;

      const toggleBtn = document.querySelector('header button[aria-label="Toggle sidebar navigation"]');

      // Click toggle to open mobile drawer
      if (toggleBtn) toggleBtn.click();
      await new Promise((r) => setTimeout(r, 300));

      const bodyOverflowWhenOpen = window.getComputedStyle(document.body).overflow;
      const drawerVisible = !!document.querySelector('.lg\\:hidden.fixed.inset-0.z-50');

      // Click close button inside drawer
      const closeBtn = document.querySelector('button[aria-label="Close menu"]');
      if (closeBtn) closeBtn.click();
      await new Promise((r) => setTimeout(r, 300));

      const bodyOverflowAfterClose = window.getComputedStyle(document.body).overflow;
      const drawerClosed = !document.querySelector('.lg\\:hidden.fixed.inset-0.z-50');

      const horizontalOverflow = document.documentElement.scrollWidth > document.documentElement.clientWidth;

      return {
        desktopAsideHiddenOnTablet: !desktopAsideVisible,
        toggleBtnFound: !!toggleBtn,
        drawerOpened: drawerVisible,
        bodyOverflowWhenOpen,
        bodyOverflowAfterClose,
        drawerClosed,
        horizontalOverflow
      };
    });

    console.log("Tablet metrics:", JSON.stringify(tabletMetrics, null, 2));
    const t1Passed =
      tabletMetrics.desktopAsideHiddenOnTablet &&
      tabletMetrics.drawerOpened &&
      tabletMetrics.bodyOverflowWhenOpen === "hidden" &&
      tabletMetrics.bodyOverflowAfterClose !== "hidden" &&
      tabletMetrics.drawerClosed &&
      !tabletMetrics.horizontalOverflow;

    results.tablet_768_1024 = { ...tabletMetrics, passed: t1Passed };
    console.log(`Tablet (768x1024) test: ${t1Passed ? "PASSED" : "FAILED"}`);
    if (!t1Passed) results.allPassed = false;

    // =========================================================================
    // TEST 4: Mobile Viewport (390 x 844)
    // =========================================================================
    console.log("\n[TEST 4] Testing Mobile Viewport (390 x 844)...");
    await page.setViewport({ width: 390, height: 844 });
    await page.goto("http://localhost:3000/admin", { waitUntil: "domcontentloaded" });
    await new Promise((r) => setTimeout(r, 1000));

    const mobileMetrics = await page.evaluate(async () => {
      const toggleBtn = document.querySelector('header button[aria-label="Toggle sidebar navigation"]');
      if (toggleBtn) toggleBtn.click();
      await new Promise((r) => setTimeout(r, 300));

      const bodyOverflowWhenOpen = window.getComputedStyle(document.body).overflow;
      const drawerVisible = !!document.querySelector('.lg\\:hidden.fixed.inset-0.z-50');

      const closeBtn = document.querySelector('button[aria-label="Close menu"]');
      if (closeBtn) closeBtn.click();
      await new Promise((r) => setTimeout(r, 300));

      const bodyOverflowAfterClose = window.getComputedStyle(document.body).overflow;
      const horizontalOverflow = document.documentElement.scrollWidth > document.documentElement.clientWidth;

      return {
        drawerVisible,
        bodyOverflowWhenOpen,
        bodyOverflowAfterClose,
        horizontalOverflow
      };
    });

    console.log("Mobile metrics:", JSON.stringify(mobileMetrics, null, 2));
    const m1Passed =
      mobileMetrics.drawerVisible &&
      mobileMetrics.bodyOverflowWhenOpen === "hidden" &&
      mobileMetrics.bodyOverflowAfterClose !== "hidden" &&
      !mobileMetrics.horizontalOverflow;

    results.mobile_390_844 = { ...mobileMetrics, passed: m1Passed };
    console.log(`Mobile (390x844) test: ${m1Passed ? "PASSED" : "FAILED"}`);
    if (!m1Passed) results.allPassed = false;

    // =========================================================================
    // TEST 5: Module Navigation Layout Preservation (All 5 Modules)
    // =========================================================================
    console.log("\n[TEST 5] Testing navigation across all 5 admin modules...");
    await page.setViewport({ width: 1440, height: 900 });

    const modules = [
      { name: "Overview Dashboard", path: "/admin" },
      { name: "Online Cert Master", path: "/admin/online-certs" },
      { name: "Manual Cert Master", path: "/admin/manual-certs" },
      { name: "Ticket Master", path: "/admin/tickets" },
      { name: "Trash Bin", path: "/admin/trash" },
      { name: "Admin Access", path: "/admin/access" }
    ];

    for (const mod of modules) {
      await page.goto("http://localhost:3000" + mod.path, { waitUntil: "domcontentloaded" });
      await new Promise((r) => setTimeout(r, 600));

      const modCheck = await page.evaluate(() => {
        const aside = document.querySelector('aside[aria-label="Admin Sidebar Navigation"]');
        const pos = aside ? window.getComputedStyle(aside).position : null;
        const rect = aside ? aside.getBoundingClientRect() : null;
        const horizontalOverflow = document.documentElement.scrollWidth > document.documentElement.clientWidth;
        const scrollY = window.scrollY;

        return {
          asidePosition: pos,
          asideTop: rect ? rect.top : null,
          asideWidth: rect ? rect.width : null,
          horizontalOverflow,
          scrollY
        };
      });

      const passed =
        modCheck.asidePosition === "fixed" &&
        modCheck.asideTop === 0 &&
        modCheck.asideWidth >= 250 &&
        !modCheck.horizontalOverflow &&
        modCheck.scrollY === 0;

      results.modules_navigation[mod.name] = { ...modCheck, passed };
      console.log(`Module [${mod.name}]: ${passed ? "PASSED" : "FAILED"}`);
      if (!passed) results.allPassed = false;
    }

  } catch (err) {
    console.error("Test execution error:", err);
    results.allPassed = false;
    results.error = err.message;
  } finally {
    await browser.close();
  }

  console.log("\n=== FINAL TEST RESULTS ===");
  console.log(JSON.stringify(results, null, 2));

  process.exit(results.allPassed ? 0 : 1);
}

runTests();
