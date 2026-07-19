const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const PORT = process.env.PORT || 5000;
const BASE_URL = `http://localhost:${PORT}/api`;

const runTests = async () => {
  console.log('=== STARTING BACKEND REST API VERIFICATION ===');

  let adminToken = '';
  let ownerToken = '';
  let userToken = '';
  let testInquiryId = '';
  let testTourId = '';

  try {
    // 1. Health Check
    console.log('\n[TEST 1] GET /api/health');
    const healthRes = await fetch(`${BASE_URL}/health`);
    const healthData = await healthRes.json();
    console.log('Response:', healthRes.status, healthData);
    if (healthRes.status !== 200 || healthData.status !== 'ok') {
      throw new Error('Health check failed');
    }
    console.log('✓ Health check passed');

    // 2. Admin Login
    if (!process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD || !process.env.OWNER_EMAIL || !process.env.OWNER_PASSWORD) {
      throw new Error(
        'ADMIN_EMAIL, ADMIN_PASSWORD, OWNER_EMAIL, and OWNER_PASSWORD must all be set in server/.env before verifying — no default credentials are baked into the code.'
      );
    }

    console.log('\n[TEST 2] POST /api/auth/login (Admin — seeded accounts are pre-verified)');
    const adminLoginRes = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: process.env.ADMIN_EMAIL,
        password: process.env.ADMIN_PASSWORD,
      }),
    });
    const adminLoginData = await adminLoginRes.json();
    console.log('Response status:', adminLoginRes.status);
    if (adminLoginRes.status !== 200 || !adminLoginData.token) {
      throw new Error('Admin login failed');
    }
    adminToken = adminLoginData.token;
    console.log('✓ Admin logged in successfully. Role:', adminLoginData.role);

    // 3. Owner Login
    console.log('\n[TEST 3] POST /api/auth/login (Owner)');
    const ownerLoginRes = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: process.env.OWNER_EMAIL,
        password: process.env.OWNER_PASSWORD,
      }),
    });
    const ownerLoginData = await ownerLoginRes.json();
    console.log('Response status:', ownerLoginRes.status);
    if (ownerLoginRes.status !== 200 || !ownerLoginData.token) {
      throw new Error('Owner login failed');
    }
    ownerToken = ownerLoginData.token;
    console.log('✓ Owner logged in successfully. Role:', ownerLoginData.role);

    // 4. Public Tours List
    console.log('\n[TEST 4] GET /api/tours (Public)');
    const toursRes = await fetch(`${BASE_URL}/tours`);
    const tours = await toursRes.json();
    console.log('Response:', toursRes.status, `Found ${tours.length} tours`);
    if (toursRes.status !== 200 || tours.length === 0) {
      throw new Error('Failed to get public tours');
    }
    testTourId = tours[0]._id;
    console.log('✓ Tours list retrieved. First tour slug:', tours[0].slug);

    // 5. Get Tour by Slug
    console.log(`\n[TEST 5] GET /api/tours/:slug (${tours[0].slug})`);
    const tourDetailRes = await fetch(`${BASE_URL}/tours/${tours[0].slug}`);
    const tourDetail = await tourDetailRes.json();
    console.log('Response status:', tourDetailRes.status);
    if (tourDetailRes.status !== 200 || !tourDetail.slug) {
      throw new Error('Failed to get tour details');
    }
    console.log('✓ Tour details retrieved successfully.');

    // 6. Signup validation failure (weak password) — checks the
    // { errors: [{ field, message }] } shape from validators.js (FE-10)
    console.log('\n[TEST 6] POST /api/auth/signup (invalid — weak password, expect 400 with field errors)');
    const badSignupRes = await fetch(`${BASE_URL}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Bad Pw', email: `badpw_${Date.now()}@example.com`, password: 'short' }),
    });
    const badSignupData = await badSignupRes.json();
    console.log('Response status:', badSignupRes.status, badSignupData);
    if (badSignupRes.status !== 400 || !Array.isArray(badSignupData.errors) || !badSignupData.errors.length) {
      throw new Error('Expected 400 with field errors for weak password signup');
    }
    console.log('✓ Weak-password signup correctly rejected with field-level errors');

    // 7. User Signup (email + password) — account is created UNVERIFIED (§3.7)
    const testUserEmail = `tourist_${Date.now()}@example.com`;
    console.log(`\n[TEST 7] POST /api/auth/signup (Email: ${testUserEmail})`);
    const signupRes = await fetch(`${BASE_URL}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Test Tourist',
        email: testUserEmail,
        password: 'Password123',
        phoneCountryCode: '+86',
        phone: '1380000000'.slice(0, 10),
        wechatId: 'test_wechat',
        country: 'China',
      }),
    });
    const signupData = await signupRes.json();
    console.log('Response status:', signupRes.status, signupData);
    if (signupRes.status !== 201) {
      throw new Error('Signup should return 201');
    }
    console.log('✓ User signed up successfully');

    // 8. Login directly (no OTP verification needed)
    console.log('\n[TEST 8] POST /api/auth/login');
    const loginRes = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: testUserEmail, password: 'Password123' }),
    });
    const loginData = await loginRes.json();
    console.log('Response status:', loginRes.status, loginData);
    if (loginRes.status !== 200 || !loginData.token) {
      throw new Error('Login failed');
    }
    userToken = loginData.token;
    console.log('✓ Login successful, JWT issued. Role:', loginData.role);

    // 10. Get Profile (Me)
    console.log('\n[TEST 10] GET /api/auth/me (User)');
    const meRes = await fetch(`${BASE_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${userToken}` },
    });
    const meData = await meRes.json();
    console.log('Response status:', meRes.status, 'Name:', meData.name, 'Verified:', meData.emailVerified);
    if (meRes.status !== 200 || meData.role !== 'user' || !meData.emailVerified) {
      throw new Error('Get profile failed');
    }
    console.log('✓ Profile retrieved successfully');

    // 11. Submit Inquiry (verified user, JWT required per C-6)
    console.log('\n[TEST 11] POST /api/inquiries (Logged in + verified)');
    const inquiryRes = await fetch(`${BASE_URL}/inquiries`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userToken}`,
      },
      body: JSON.stringify({
        name: 'Test Tourist',
        email: testUserEmail,
        phone: '1380000000',
        phoneCountryCode: '+86',
        tourId: testTourId,
        groupSize: 4,
        travelDate: 'October 2026',
        message: 'Looking forward to visiting the Bodhi Tree!',
      }),
    });
    const inquiryData = await inquiryRes.json();
    console.log('Response status:', inquiryRes.status, inquiryData);
    if (inquiryRes.status !== 201 || !inquiryData.id) {
      throw new Error('Submit inquiry failed');
    }
    testInquiryId = inquiryData.id;
    console.log('✓ Inquiry submitted and snapshotted successfully');

    // 12. View My Inquiries
    console.log('\n[TEST 12] GET /api/inquiries/mine (User History)');
    const myInquiriesRes = await fetch(`${BASE_URL}/inquiries/mine`, {
      headers: { Authorization: `Bearer ${userToken}` },
    });
    const myInquiries = await myInquiriesRes.json();
    console.log('Response status:', myInquiriesRes.status, `Found ${myInquiries.length} history items`);
    if (myInquiriesRes.status !== 200 || myInquiries.length === 0) {
      throw new Error('View my inquiries failed');
    }
    console.log('✓ My inquiries history retrieved successfully. Status of first item:', myInquiries[0].status);

    // 13. Owner List Inquiries
    console.log('\n[TEST 13] GET /api/inquiries (Owner Dashboard)');
    const allInquiriesRes = await fetch(`${BASE_URL}/inquiries`, {
      headers: { Authorization: `Bearer ${ownerToken}` },
    });
    const allInquiries = await allInquiriesRes.json();
    console.log('Response status:', allInquiriesRes.status, `Found ${allInquiries.length} total inquiries`);
    if (allInquiriesRes.status !== 200) {
      throw new Error('Owner failed to list inquiries');
    }
    console.log('✓ Operator listed inquiries successfully');

    // 14. Owner Edit Inquiry (Update Status & Private Note)
    console.log(`\n[TEST 14] PATCH /api/inquiries/${testInquiryId} (Owner Update)`);
    const updateInquiryRes = await fetch(`${BASE_URL}/inquiries/${testInquiryId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${ownerToken}`,
      },
      body: JSON.stringify({
        status: 'contacted',
        adminNote: 'Sent quote of USD 5,140 for 4 pax via WeChat on 18th July.',
      }),
    });
    const updatedInquiry = await updateInquiryRes.json();
    console.log('Response status:', updateInquiryRes.status);
    if (updateInquiryRes.status !== 200 || updatedInquiry.status !== 'contacted') {
      throw new Error('Update inquiry failed');
    }
    console.log('✓ Inquiry status and admin notes updated successfully');

    // 15. Public Settings Retrieval (public again in v1.5 — C-6)
    console.log('\n[TEST 15] GET /api/settings (Public)');
    const settingsRes = await fetch(`${BASE_URL}/settings`);
    const settings = await settingsRes.json();
    console.log('Response status:', settingsRes.status, 'Phone:', settings.phone);
    if (settingsRes.status !== 200 || !settings.email) {
      throw new Error('Failed to get site settings');
    }
    console.log('✓ Global site settings retrieved successfully');

    // 16. RBAC Gating: Owner trying to query Accounts (Admin-only)
    console.log('\n[TEST 16] GET /api/accounts (Security test: Owner calling Admin route)');
    const unauthorizedRes = await fetch(`${BASE_URL}/accounts`, {
      headers: { Authorization: `Bearer ${ownerToken}` },
    });
    console.log('Response status:', unauthorizedRes.status);
    if (unauthorizedRes.status !== 403) {
      throw new Error('RBAC Failure: Owner was allowed to access accounts panel!');
    }
    console.log('✓ RBAC check passed: Owner was rejected with 403 Forbidden');

    // 17. Admin querying Accounts
    console.log('\n[TEST 17] GET /api/accounts (Admin calling Admin route)');
    const authorizedRes = await fetch(`${BASE_URL}/accounts`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    const accounts = await authorizedRes.json();
    console.log('Response status:', authorizedRes.status, `Staff account count: ${accounts.length}`);
    if (authorizedRes.status !== 200 || accounts.length === 0) {
      throw new Error('Admin failed to query accounts list');
    }
    console.log('✓ Admin successfully authorized and retrieved staff account list');

    console.log('\n=== ALL TESTS COMPLETED SUCCESSFULLY! ===');
    process.exit(0);
  } catch (err) {
    console.error('\n✕ VERIFICATION FAILED:', err.message);
    process.exit(1);
  }
};

// Wait 2 seconds for server to boot up before testing
setTimeout(runTests, 2000);
