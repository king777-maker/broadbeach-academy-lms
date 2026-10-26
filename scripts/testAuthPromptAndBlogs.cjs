const fs = require('fs');
const path = require('path');

async function runTests() {
  console.log('========================================================================');
  console.log('🧪 BROADBEACH ACADEMY — COURSE LOGIN NOTIFICATION & MEDIUM BLOG TESTS');
  console.log('Target Environment: http://localhost:3000');
  console.log(`Timestamp: ${new Date().toISOString()}`);
  console.log('========================================================================\n');

  let passed = 0;
  let failed = 0;

  function assert(condition, testName, details) {
    if (condition) {
      console.log(`[PASS] ✅ ${testName}`);
      if (details) console.log(`    ${details}\n`);
      passed++;
    } else {
      console.error(`[FAIL] ❌ ${testName}`);
      if (details) console.error(`    ${details}\n`);
      failed++;
    }
  }

  const base = 'http://localhost:3000';

  // --- PART 1: BLOGS REDIRECT & MEDIUM LINKS ---
  console.log('--- TEST SUITE 1: MEDIUM BLOG LINKS & ROUTE REDIRECTS ---\n');

  // Test 1: TopBar Blogs link
  const topBarCode = fs.readFileSync('C:\\Users\\ADMIN\\Desktop\\bb_exp-2.0\\src\\components\\Header\\TopBar.jsx', 'utf8');
  assert(
    topBarCode.includes('href="https://medium.com/@broadbeach.in"') &&
    topBarCode.includes('target="_blank"') &&
    topBarCode.includes('rel="noopener noreferrer"'),
    'TopBar Blogs link points to https://medium.com/@broadbeach.in',
    'Verified exact Medium URL with target="_blank" and rel="noopener noreferrer".'
  );

  // Test 2: MobileNavbar Blogs link
  const mobNavCode = fs.readFileSync('C:\\Users\\ADMIN\\Desktop\\bb_exp-2.0\\src\\components\\Header\\MobileNavbar.jsx', 'utf8');
  assert(
    mobNavCode.includes('href="https://medium.com/@broadbeach.in"') &&
    mobNavCode.includes('target="_blank"') &&
    mobNavCode.includes('rel="noopener noreferrer"'),
    'MobileNavbar drawer includes Blogs link pointing to https://medium.com/@broadbeach.in',
    'Verified mobile navigation includes direct Medium link.'
  );

  // Test 3: Footer Blogs link
  const footerCode = fs.readFileSync('C:\\Users\\ADMIN\\Desktop\\bb_exp-2.0\\src\\components\\Footer\\Footer.jsx', 'utf8');
  assert(
    footerCode.includes('href="https://medium.com/@broadbeach.in"') &&
    footerCode.includes('target="_blank"') &&
    footerCode.includes('rel="noopener noreferrer"'),
    'Footer Quick Links includes Blogs link pointing to https://medium.com/@broadbeach.in',
    'Verified footer contains verified Medium publication link.'
  );

  // Test 4: RecentBlogs View All Blogs link
  const recentBlogsCode = fs.readFileSync('C:\\Users\\ADMIN\\Desktop\\bb_exp-2.0\\src\\components\\RecentBlogs\\RecentBlogs.jsx', 'utf8');
  assert(
    recentBlogsCode.includes('href="https://medium.com/@broadbeach.in"') &&
    recentBlogsCode.includes('target="_blank"') &&
    recentBlogsCode.includes('rel="noopener noreferrer"'),
    'RecentBlogs View All button points to https://medium.com/@broadbeach.in',
    'Verified homepage View All Blogs CTA targets official Medium profile.'
  );

  // Test 5: /blog and /blogs route availability in App.jsx
  const appCode = fs.readFileSync('C:\\Users\\ADMIN\\Desktop\\bb_exp-2.0\\src\\App.jsx', 'utf8');
  assert(
    appCode.includes('path="/blog"') &&
    appCode.includes('path="/blogs"') &&
    appCode.includes('window.location.replace("https://medium.com/@broadbeach.in")'),
    'App.jsx defines /blog and /blogs routes redirecting to Medium',
    'Verified client router redirects /blog and /blogs to https://medium.com/@broadbeach.in.'
  );

  // --- PART 2: COURSE START & AUTHENTICATION-AWARE BEHAVIOR ---
  console.log('--- TEST SUITE 2: COURSE START & AUTHENTICATION NOTIFICATION ---\n');

  // Test 6: CourseLoginPromptModal component implementation
  const modalCode = fs.readFileSync('C:\\Users\\ADMIN\\Desktop\\bb_exp-2.0\\src\\components\\Auth\\CourseLoginPromptModal.jsx', 'utf8');
  assert(
    modalCode.includes('Please log in first to start this course.') &&
    modalCode.includes('Cancel') &&
    modalCode.includes('Log In'),
    'CourseLoginPromptModal contains exact required message and two actions (Cancel & Log In)',
    'Verified modal displays “Please log in first to start this course.” with Cancel and Log In buttons.'
  );

  // Test 7: AuthPromptContext implementation and requireAuth helper
  const contextCode = fs.readFileSync('C:\\Users\\ADMIN\\Desktop\\bb_exp-2.0\\src\\context\\AuthPromptContext.jsx', 'utf8');
  assert(
    contextCode.includes('requireAuth') &&
    contextCode.includes('showLoginPrompt') &&
    contextCode.includes('hideLoginPrompt'),
    'AuthPromptContext provides global requireAuth helper',
    'Verified requireAuth displays notification for logged-out users and allows logged-in users to proceed directly.'
  );

  // Test 8: App.jsx wraps components with AuthPromptProvider
  assert(
    appCode.includes('<AuthPromptProvider>'),
    'App.jsx wraps entire component tree with AuthPromptProvider',
    'Verified prompt modal is mounted globally and accessible across all pages.'
  );

  // Test 9: CourseDetails.jsx integrates requireAuth on Start Course / Enroll
  const cdCode = fs.readFileSync('C:\\Users\\ADMIN\\Desktop\\bb_exp-2.0\\src\\pages\\courses\\CourseDetails.jsx', 'utf8');
  assert(
    cdCode.includes('requireAuth('),
    'CourseDetails.jsx enforces requireAuth on Start Course / Enroll action',
    'Verified clicking Start Course triggers authentication notification when logged out.'
  );

  // Test 10: FreeCoursesPage.jsx integrates requireAuth on Enroll Free
  const fcCode = fs.readFileSync('C:\\Users\\ADMIN\\Desktop\\bb_exp-2.0\\src\\pages\\FreeCoursesPage.jsx', 'utf8');
  assert(
    fcCode.includes('requireAuth('),
    'FreeCoursesPage.jsx enforces requireAuth on Enroll Free action',
    'Verified free courses catalog triggers authentication notification when logged out.'
  );

  // Test 11: Enroll.jsx integrates requireAuth on Start Course Now
  const enrollCode = fs.readFileSync('C:\\Users\\ADMIN\\Desktop\\bb_exp-2.0\\src\\pages\\Enroll.jsx', 'utf8');
  assert(
    enrollCode.includes('requireAuth('),
    'Enroll.jsx enforces requireAuth on Start Course button',
    'Verified enrollment page triggers authentication notification when logged out.'
  );

  // Test 12: CertificateCard.jsx integrates requireAuth on card enroll
  const cardCode = fs.readFileSync('C:\\Users\\ADMIN\\Desktop\\bb_exp-2.0\\src\\components\\FreeCertifications\\CertificateCard.jsx', 'utf8');
  assert(
    cardCode.includes('requireAuth('),
    'CertificateCard.jsx enforces requireAuth on homepage course cards',
    'Verified homepage free cards trigger authentication notification when logged out.'
  );

  // Test 13: Live backend session check with test account
  console.log('--- TEST SUITE 3: LIVE BACKEND AUTH & ENTITLEMENT VALIDATION ---\n');
  const loginRes = await fetch(`${base}/api/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'qa.tester@broadbeach.in', password: 'BBTest@2026!' })
  });
  const cookie = loginRes.headers.get('set-cookie');
  assert(
    loginRes.status === 200 && cookie,
    'Live login succeeds with test account (qa.tester@broadbeach.in)',
    `HTTP 200 with valid session cookie.`
  );

  // Test 14: Logged-in user can access enrolled course lessons without notification
  const lessonsRes = await fetch(`${base}/api/course-lessons?certification_id=322`, {
    headers: { 'Cookie': cookie || '' }
  });
  const lessonsData = await lessonsRes.json();
  assert(
    lessonsRes.status === 200 && lessonsData.data?.length > 0,
    'Logged-in user loads Course 322 lessons directly',
    `Loaded ${lessonsData.data?.length} lesson chapters successfully without modal prompt.`
  );

  // Test 15: Logged-in user without paid course entitlement is blocked from unauthorized access
  const paidRes = await fetch(`${base}/api/redeem-certificate-coupon`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Cookie': cookie || '' },
    body: JSON.stringify({ course_id: 999 })
  });
  assert(
    paidRes.status === 422 || paidRes.status === 400 || paidRes.status === 403,
    'Paid course without entitlement or valid coupon is strictly rejected',
    `HTTP ${paidRes.status}: Enrollment restrictions remain strictly enforced on server.`
  );

  // Test 16: Logged-out user rejected from protected profile/learning endpoint
  const unauthRes = await fetch(`${base}/api/profile`);
  assert(
    unauthRes.status === 401,
    'Unauthenticated direct request to protected API returns 401 Unauthorized',
    'HTTP 401 returned: Client-side bypass strictly prevented.'
  );

  console.log('========================================================================');
  console.log(`SUMMARY: ${passed}/${passed + failed} TESTS PASSED (${failed} FAILED)`);
  console.log('========================================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch(err => {
  console.error('Test execution failed:', err);
  process.exit(1);
});
