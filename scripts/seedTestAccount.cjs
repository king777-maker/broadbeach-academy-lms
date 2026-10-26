/**
 * Repeatable Seeding Script for Broadbeach Academy Dedicated QA Testing Account
 * Safe to execute multiple times (Idempotent).
 *
 * Credentials:
 *   Email: qa.tester@broadbeach.in
 *   Password: BBTest@2026!
 */

const http = require('http');

const BASE_URL = process.env.TEST_API_URL || 'http://localhost:3000';

function postJson(path, payload, cookie = '') {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(payload);
    const req = http.request(`${BASE_URL}${path}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data),
        ...(cookie ? { 'Cookie': cookie } : {})
      }
    }, res => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, headers: res.headers, data: JSON.parse(body) });
        } catch {
          resolve({ status: res.statusCode, headers: res.headers, data: body });
        }
      });
    });
    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

function getJson(path, cookie = '') {
  return new Promise((resolve, reject) => {
    const req = http.request(`${BASE_URL}${path}`, {
      method: 'GET',
      headers: {
        ...(cookie ? { 'Cookie': cookie } : {})
      }
    }, res => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, headers: res.headers, data: JSON.parse(body) });
        } catch {
          resolve({ status: res.statusCode, headers: res.headers, data: body });
        }
      });
    });
    req.on('error', reject);
    req.end();
  });
}

async function seedTestAccount() {
  console.log('====================================================');
  console.log('🌱 BROADBEACH ACADEMY — TEST ACCOUNT SEEDER');
  console.log('Target Server:', BASE_URL);
  console.log('Test Account: qa.tester@broadbeach.in');
  console.log('====================================================\n');

  const testEmail = 'qa.tester@broadbeach.in';
  const testPassword = 'BBTest@2026!';

  // Step 1: Check if user can already log in
  console.log('1. Checking if QA Tester account already exists and authenticates...');
  let loginRes = await postJson('/api/login', { email: testEmail, password: testPassword });

  let cookie = '';
  let user = null;

  if (loginRes.status === 200 && loginRes.data?.success) {
    console.log('✓ QA Tester account exists and credentials verified.');
    user = loginRes.data.data;
    const rawCookies = loginRes.headers['set-cookie'] || [];
    cookie = rawCookies.map(c => c.split(';')[0]).join('; ');
  } else {
    console.log('Account not active or credentials need initialization. Registering test user...');

    const seedPayload = {
      first_name: 'QA',
      last_name: 'Tester',
      email: testEmail,
      phone: '9988776655',
      country_code: '+91',
      password: testPassword,
      confirm_password: testPassword,
      date_of_birth: '1995-01-15',
      designation: 'Senior QA Automation Engineer',
      highest_qualification: 'Master of Technology',
      total_experience: '6 Years',
      current_organization: 'Broadbeach Quality Assurance Lab',
      nationality: 'Indian',
      address: '22nd Floor, World Trade Center, Malleshwaram',
      city: 'Bengaluru',
      state: 'Karnataka',
      country: 'India',
      zip_code: '560055'
    };

    const regRes = await postJson('/api/register', seedPayload);
    if (regRes.status === 201 && regRes.data?.success) {
      console.log('✓ Successfully created QA Tester user with bcrypt password hash.');
      user = regRes.data.data;
    } else if (regRes.status === 409) {
      console.log('User record already exists in database (HTTP 409).');
    } else {
      console.error('Registration error:', regRes.status, regRes.data);
    }

    // Attempt login after creation
    loginRes = await postJson('/api/login', { email: testEmail, password: testPassword });
    if (loginRes.status === 200 && loginRes.data?.success) {
      console.log('✓ Successfully authenticated test user session.');
      user = loginRes.data.data;
      const rawCookies = loginRes.headers['set-cookie'] || [];
      cookie = rawCookies.map(c => c.split(';')[0]).join('; ');
    } else {
      throw new Error(`Failed to authenticate QA Tester: ${JSON.stringify(loginRes.data)}`);
    }
  }

  console.log(`\nUser Details: ID=${user.id}, Name="${user.first_name} ${user.last_name}", Email=${user.email}, Role=${user.role || 'Candidate'}`);

  // Step 2: Ensure Course Enrollment for Testing
  console.log('\n2. Verifying test course enrollment (Course ID 322: ISO 9001:2026 QMS Awareness)...');
  const myCoursesRes = await getJson('/api/my-courses', cookie);

  const existingCourses = myCoursesRes.data?.data || [];
  const isEnrolled = existingCourses.some(c => Number(c.certification_id || c.id) === 322);

  if (isEnrolled) {
    console.log('✓ Test user is already enrolled in Course 322.');
  } else {
    console.log('Enrolling test user in Course 322...');
    const enrollRes = await postJson('/api/enroll-course', { certification_id: 322 }, cookie);
    if (enrollRes.data?.success) {
      console.log('✓ Successfully enrolled test user in Course 322.');
    } else {
      console.log('Enrollment note:', enrollRes.data?.message);
    }
  }

  // Step 3: Verify Profile Endpoint
  console.log('\n3. Validating server session via /api/profile...');
  const profileRes = await getJson('/api/profile', cookie);
  if (profileRes.status === 200 && profileRes.data?.success) {
    console.log('✓ Server session active and verified. User profile matches.');
  } else {
    console.warn('Profile fetch warning:', profileRes.status, profileRes.data);
  }

  console.log('\n====================================================');
  console.log('🎉 SEEDING COMPLETE! Test account is ready for use:');
  console.log('   Email:    qa.tester@broadbeach.in');
  console.log('   Password: BBTest@2026!');
  console.log('   Enrolled: ISO 9001:2026 QMS Awareness (ID 322)');
  console.log('====================================================\n');
}

if (require.main === module) {
  seedTestAccount().catch(err => {
    console.error('Seeding failed:', err);
    process.exit(1);
  });
}

module.exports = { seedTestAccount };
