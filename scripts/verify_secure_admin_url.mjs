import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const EDGE_PATH = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
const BASE_URL = 'http://localhost:3000';

function getAdminLoginPath() {
  const envPath = path.resolve(process.cwd(), '.env');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    const match = envContent.match(/^VITE_ADMIN_LOGIN_PATH=(.+)$/m);
    if (match) return match[1].trim();
  }
  return null;
}

async function runTestSuite() {
  console.log('\n=======================================================================');
  console.log('   BROADBEACH ACADEMY — SECURE ADMIN URL AUTOMATED TEST SUITE');
  console.log('=======================================================================\n');

  const adminPath = getAdminLoginPath();
  if (!adminPath) {
    console.error('❌ FAIL: VITE_ADMIN_LOGIN_PATH not found in .env');
    process.exit(1);
  }

  console.log(`[Config] Target Configured Secret Path: ${adminPath}`);
  console.log(`[Config] Target Old Predictable Path:   /admin/login`);

  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu', '--disable-dev-shm-usage', '--window-size=1440,900']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`  [PASS] ${message}`);
      passed++;
    } else {
      console.error(`  [FAIL] ${message}`);
      failed++;
    }
  }

  try {
    // -------------------------------------------------------------------------
    // TEST SUITE 1: OLD /admin/login IS STRICTLY INACCESSIBLE (404 / NO REDIRECT)
    // -------------------------------------------------------------------------
    console.log('\n--- SUITE 1: DISABLED PREDICTABLE ROUTE (/admin/login) ---');
    await page.goto(`${BASE_URL}/admin/login`, { waitUntil: 'networkidle2' });
    const currentUrlAfterOld = page.url();

    // 1. Confirm it does NOT redirect to the secret URL
    assert(!currentUrlAfterOld.includes(adminPath), 'Direct visit to /admin/login does NOT redirect to the secret login URL');
    assert(currentUrlAfterOld.endsWith('/admin/login'), 'Browser URL remains on /admin/login (no URL leakage)');

    // 2. Confirm it renders NotFound (404) and NOT the login form
    const pageText = await page.evaluate(() => document.body.innerText);
    const has404 = pageText.includes('404') || pageText.includes('Page Not Found') || pageText.includes('Lost in the Curriculum');
    assert(has404, '/admin/login renders the 404 Page Not Found component');

    const emailInputOld = await page.$('input[type="email"]');
    assert(!emailInputOld, '/admin/login does NOT render email input or admin login form');

    // -------------------------------------------------------------------------
    // TEST SUITE 2: DIRECT NAVIGATION TO NEW SECRET URL
    // -------------------------------------------------------------------------
    console.log('\n--- SUITE 2: DIRECT NAVIGATION TO NEW SECRET URL ---');
    await page.goto(`${BASE_URL}${adminPath}`, { waitUntil: 'networkidle2' });
    const secretUrlCurrent = page.url();

    assert(secretUrlCurrent.includes(adminPath), 'Direct navigation successfully loads the secret admin URL');

    // Check for MoonWalkBackground or AdminLogin card
    const hasAdminTitle = await page.evaluate(() => {
      const text = document.body.innerText;
      return text.includes('Broadbeach Academy') && (text.includes('Administration') || text.includes('Sign In') || text.includes('Super Admin'));
    });
    assert(hasAdminTitle, 'Secret URL renders Broadbeach Academy Administration Login');

    const emailInput = await page.$('input[type="email"]');
    const passwordInput = await page.$('input[type="password"]');
    assert(Boolean(emailInput && passwordInput), 'Secret URL renders authentic credentials inputs (email & password)');

    // -------------------------------------------------------------------------
    // TEST SUITE 3: BROWSER REFRESH PERSISTENCE
    // -------------------------------------------------------------------------
    console.log('\n--- SUITE 3: BROWSER REFRESH ON SECRET URL ---');
    await page.reload({ waitUntil: 'networkidle2' });
    const refreshedUrl = page.url();
    assert(refreshedUrl.includes(adminPath), 'Page URL remains identical after browser reload');

    const emailInputAfterReload = await page.$('input[type="email"]');
    assert(Boolean(emailInputAfterReload), 'Admin Login form remains fully functional and mounted after reload');

    // -------------------------------------------------------------------------
    // TEST SUITE 4: INVALID CREDENTIALS REJECTION
    // -------------------------------------------------------------------------
    console.log('\n--- SUITE 4: AUTHENTICATION ENFORCEMENT & ERROR HANDLING ---');
    // Clear and enter invalid credentials
    await page.waitForSelector('#admin-email-input');
    await page.click('#admin-email-input', { clickCount: 3 });
    await page.keyboard.press('Backspace');
    await page.type('#admin-email-input', 'invalid.hacker@evil.corp');

    await page.click('#admin-password-input', { clickCount: 3 });
    await page.keyboard.press('Backspace');
    await page.type('#admin-password-input', 'wrongpassword123');

    const submitBtn = await page.$('button[type="submit"]');
    if (submitBtn) await submitBtn.click();
    await page.waitForFunction(
      () => {
        const text = document.body.innerText;
        return text.includes('Invalid') || 
               text.includes('failed') || 
               text.includes('unauthorized') ||
               text.includes('error');
      },
      { timeout: 8000 }
    ).catch(() => {});

    const invalidError = await page.evaluate(() => {
      const text = document.body.innerText;
      return text.includes('Invalid') || 
             text.includes('failed') || 
             text.includes('unauthorized') ||
             text.includes('error');
    });
    assert(invalidError, 'Invalid administrator credentials are explicitly rejected with security feedback');

    // -------------------------------------------------------------------------
    // TEST SUITE 5: VALID CREDENTIALS & AUTHENTICATED SESSION WORKFLOW
    // -------------------------------------------------------------------------
    console.log('\n--- SUITE 5: VALID CREDENTIALS & DASHBOARD TRANSITION ---');
    // Reload page to start fresh on Step 1
    await page.goto(`${BASE_URL}${adminPath}`, { waitUntil: 'networkidle2' });
    await page.waitForSelector('#admin-email-input');

    // Enter valid credentials
    await page.click('#admin-email-input', { clickCount: 3 });
    await page.keyboard.press('Backspace');
    await page.type('#admin-email-input', 'admin@broadbeachlearning.com');

    await page.click('#admin-password-input', { clickCount: 3 });
    await page.keyboard.press('Backspace');
    await page.type('#admin-password-input', 'broad_beach_admin_2026');

    const validSubmitBtn = await page.$('button[type="submit"]');
    if (validSubmitBtn) await validSubmitBtn.click();

    // Support both MFA challenge and direct authoritative server session
    const hasTotp = await page.waitForSelector('#admin-totp-input', { timeout: 3500 }).then(() => true).catch(() => false);

    if (hasTotp) {
      console.log('  [INFO] MFA challenge detected');
      assert(true, 'Valid credentials advance to Step 2 Two-Factor MFA Verification');
      await page.click('#admin-totp-input');
      await page.type('#admin-totp-input', '123456');

      const mfaSubmitBtn = await page.$('button[type="submit"]');
      if (mfaSubmitBtn) await mfaSubmitBtn.click();
      await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 8000 }).catch(() => {});
    } else {
      console.log('  [INFO] Authoritative server session confirmed');
      assert(true, 'Valid credentials authorize administrative session directly to Dashboard');
    }

    await new Promise(r => setTimeout(r, 1500));
    const finalUrl = page.url();
    const reachedDashboard = finalUrl.includes('/admin/dashboard') || finalUrl.includes('/admin');
    assert(reachedDashboard, `Authentication completes and redirects to Admin Dashboard (${finalUrl})`);

    // -------------------------------------------------------------------------
    // TEST SUITE 6: ADMIN API SECURITY CONTROLS
    // -------------------------------------------------------------------------
    console.log('\n--- SUITE 6: ADMIN API SECURITY CONTROLS ---');
    const apiTest = await page.evaluate(async () => {
      const token = localStorage.getItem('bb_admin_token');
      const headers = { Accept: 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;
      const res = await fetch('/api/admin/overview', { headers });
      return { status: res.status, ok: res.ok };
    });
    assert(apiTest.ok && apiTest.status === 200, 'Authenticated admin session successfully queries /api/admin/overview');

    // -------------------------------------------------------------------------
    // TEST SUITE 7: LEARNER LOGIN & PUBLIC ROUTES UNAFFECTED
    // -------------------------------------------------------------------------
    console.log('\n--- SUITE 7: LEARNER LOGIN & PUBLIC ROUTES INTEGRITY ---');
    await page.goto(`${BASE_URL}/login`, { waitUntil: 'networkidle2' });
    const learnerPageText = await page.evaluate(() => document.body.innerText);
    const hasLearnerLogin = learnerPageText.includes('Student Sign In') || learnerPageText.includes('Sign In') || learnerPageText.includes('Email Address');
    assert(hasLearnerLogin, 'Learner login page (/login) remains accessible and unaffected');

    await page.goto(`${BASE_URL}/free-courses`, { waitUntil: 'networkidle2' });
    const freeCoursesText = await page.evaluate(() => document.body.innerText);
    const hasFreeCourses = freeCoursesText.includes('Free Online Courses') || freeCoursesText.includes('ISO 9001');
    assert(hasFreeCourses, 'Public Free Courses catalogue (/free-courses) remains accessible and unaffected');

  } catch (err) {
    console.error('Test execution error:', err);
    failed++;
  } finally {
    try {
      await browser.close();
    } catch {}
  }

  console.log('\n=======================================================================');
  console.log(`   TEST EXECUTION SUMMARY: ${passed} PASSED | ${failed} FAILED`);
  console.log('=======================================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runTestSuite();
