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

    console.log('\n[TEST 2] POST /api/auth/login (Admin)');
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
    // Store first tour's info for inquiry testing
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

    // 6. User Signup
    const testUserEmail = `tourist_${Date.now()}@example.com`;
    console.log(`\n[TEST 6] POST /api/auth/signup (Email: ${testUserEmail})`);
    const signupRes = await fetch(`${BASE_URL}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Test Tourist',
        email: testUserEmail,
        password: 'Password123!',
        phone: '+86-13800000000',
        wechatId: 'test_wechat',
        country: 'China',
      }),
    });
    const signupData = await signupRes.json();
    console.log('Response status:', signupRes.status);
    if (signupRes.status !== 201 || !signupData.token) {
      throw new Error('User signup failed');
    }
    userToken = signupData.token;
    console.log('✓ User signed up successfully. Role:', signupData.role);

    // 7. Get Profile (Me)
    console.log('\n[TEST 7] GET /api/auth/me (User)');
    const meRes = await fetch(`${BASE_URL}/auth/me`, {
      headers: { 'Authorization': `Bearer ${userToken}` },
    });
    const meData = await meRes.json();
    console.log('Response status:', meRes.status, 'Name:', meData.name);
    if (meRes.status !== 200 || meData.role !== 'user') {
      throw new Error('Get profile failed');
    }
    console.log('✓ Profile retrieved successfully');

    // 8. Submit Inquiry (User Logged In)
    console.log('\n[TEST 8] POST /api/inquiries (Logged in)');
    const inquiryRes = await fetch(`${BASE_URL}/inquiries`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${userToken}`,
      },
      body: JSON.stringify({
        name: 'Test Tourist',
        email: testUserEmail,
        phone: '+86-13800000000',
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

    // 9. View My Inquiries
    console.log('\n[TEST 9] GET /api/inquiries/mine (User History)');
    const myInquiriesRes = await fetch(`${BASE_URL}/inquiries/mine`, {
      headers: { 'Authorization': `Bearer ${userToken}` },
    });
    const myInquiries = await myInquiriesRes.json();
    console.log('Response status:', myInquiriesRes.status, `Found ${myInquiries.length} history items`);
    if (myInquiriesRes.status !== 200 || myInquiries.length === 0) {
      throw new Error('View my inquiries failed');
    }
    console.log('✓ My inquiries history retrieved successfully. Status of first item:', myInquiries[0].status);

    // 10. Owner List Inquiries
    console.log('\n[TEST 10] GET /api/inquiries (Owner Dashboard)');
    const allInquiriesRes = await fetch(`${BASE_URL}/inquiries`, {
      headers: { 'Authorization': `Bearer ${ownerToken}` },
    });
    const allInquiries = await allInquiriesRes.json();
    console.log('Response status:', allInquiriesRes.status, `Found ${allInquiries.length} total inquiries`);
    if (allInquiriesRes.status !== 200) {
      throw new Error('Owner failed to list inquiries');
    }
    console.log('✓ Operator listed inquiries successfully');

    // 11. Owner Edit Inquiry (Update Status & Private Note)
    console.log(`\n[TEST 11] PATCH /api/inquiries/${testInquiryId} (Owner Update)`);
    const updateInquiryRes = await fetch(`${BASE_URL}/inquiries/${testInquiryId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${ownerToken}`,
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

    // 12. Public Settings Retrieval
    console.log('\n[TEST 12] GET /api/settings (Public)');
    const settingsRes = await fetch(`${BASE_URL}/settings`);
    const settings = await settingsRes.json();
    console.log('Response status:', settingsRes.status, 'Phone:', settings.phone);
    if (settingsRes.status !== 200 || !settings.email) {
      throw new Error('Failed to get site settings');
    }
    console.log('✓ Global site settings retrieved successfully');

    // 13. RBAC Gating: Owner trying to query Accounts (Admin-only)
    console.log('\n[TEST 13] GET /api/accounts (Security test: Owner calling Admin route)');
    const unauthorizedRes = await fetch(`${BASE_URL}/accounts`, {
      headers: { 'Authorization': `Bearer ${ownerToken}` },
    });
    console.log('Response status:', unauthorizedRes.status);
    if (unauthorizedRes.status !== 403) {
      throw new Error('RBAC Failure: Owner was allowed to access accounts panel!');
    }
    console.log('✓ RBAC check passed: Owner was rejected with 403 Forbidden');

    // 14. Admin querying Accounts
    console.log('\n[TEST 14] GET /api/accounts (Admin calling Admin route)');
    const authorizedRes = await fetch(`${BASE_URL}/accounts`, {
      headers: { 'Authorization': `Bearer ${adminToken}` },
    });
    const accounts = await authorizedRes.json();
    console.log('Response status:', authorizedRes.status, `Staff account count: ${accounts.length}`);
    if (authorizedRes.status !== 200 || accounts.length === 0) {
      throw new Error('Admin failed to query accounts list');
    }
    console.log('✓ Admin successfully authorized and retrieved staff account list');

    console.log('\n=== ALL 14 TESTS COMPLETED SUCCESSFULLY! ===');
    process.exit(0);

  } catch (err) {
    console.error('\n✕ VERIFICATION FAILED:', err.message);
    process.exit(1);
  }
};

// Wait 2 seconds for server to boot up before testing
setTimeout(runTests, 2000);
