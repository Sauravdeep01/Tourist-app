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

    // 16. RBAC Gating: Owner trying to query Owner management (Admin-only, §2.5.1)
    console.log('\n[TEST 16] GET /api/owners (Security test: Owner calling Admin route)');
    const unauthorizedRes = await fetch(`${BASE_URL}/owners`, {
      headers: { Authorization: `Bearer ${ownerToken}` },
    });
    console.log('Response status:', unauthorizedRes.status);
    if (unauthorizedRes.status !== 403) {
      throw new Error('RBAC Failure: Owner was allowed to access the Owner-management panel!');
    }
    console.log('✓ RBAC check passed: Owner was rejected with 403 Forbidden');

    // 17. Admin querying Owners (includes computed tourCount, §5.2)
    console.log('\n[TEST 17] GET /api/owners (Admin calling Admin route)');
    const authorizedRes = await fetch(`${BASE_URL}/owners`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    const owners = await authorizedRes.json();
    console.log('Response status:', authorizedRes.status, `Owner account count: ${owners.length}`);
    if (authorizedRes.status !== 200 || owners.length === 0 || owners[0].tourCount === undefined) {
      throw new Error('Admin failed to query the Owner list (with tourCount)');
    }
    console.log('✓ Admin listed Owner accounts successfully');

    // 18. Admin registers a second Owner (multi-tenant, §2.5.0)
    const secondOwnerEmail = `owner2_${Date.now()}@example.com`;
    console.log(`\n[TEST 18] POST /api/owners (Admin creates a second Owner: ${secondOwnerEmail})`);
    const createOwnerRes = await fetch(`${BASE_URL}/owners`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${adminToken}` },
      body: JSON.stringify({ name: 'Second Owner', email: secondOwnerEmail, password: 'Password123' }),
    });
    const createOwnerData = await createOwnerRes.json();
    console.log('Response status:', createOwnerRes.status);
    if (createOwnerRes.status !== 201) {
      throw new Error('Admin failed to create a second Owner account');
    }
    const secondOwnerId = createOwnerData._id;
    console.log('✓ Second Owner created successfully');

    // 19. Second Owner logs in and creates their own tour
    console.log('\n[TEST 19] POST /api/auth/login + POST /api/tours (Second Owner creates their own tour)');
    const secondOwnerLoginRes = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: secondOwnerEmail, password: 'Password123' }),
    });
    const secondOwnerLoginData = await secondOwnerLoginRes.json();
    if (secondOwnerLoginRes.status !== 200 || !secondOwnerLoginData.token) {
      throw new Error('Second Owner login failed');
    }
    const secondOwnerToken = secondOwnerLoginData.token;

    const secondOwnerTourRes = await fetch(`${BASE_URL}/tours`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${secondOwnerToken}` },
      body: JSON.stringify({
        slug: `verify-second-owner-tour-${Date.now()}`,
        title: { en: 'Second Owner Test Tour', zh: '第二业主测试团' },
        days: 3,
        nights: 2,
      }),
    });
    const secondOwnerTour = await secondOwnerTourRes.json();
    console.log('Response status:', secondOwnerTourRes.status);
    if (secondOwnerTourRes.status !== 201 || String(secondOwnerTour.ownerId) !== String(secondOwnerId)) {
      throw new Error('Second Owner failed to create their own tour with the correct ownerId');
    }
    const secondOwnerTourId = secondOwnerTour._id;
    console.log('✓ Second Owner created a tour, ownerId stamped correctly from the token');

    // 20. Ownership isolation: first Owner must NOT be able to edit the second Owner's tour
    console.log('\n[TEST 20] PUT /api/tours/:id (Security test: first Owner editing second Owner\'s tour)');
    const crossOwnerEditRes = await fetch(`${BASE_URL}/tours/${secondOwnerTourId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${ownerToken}` },
      body: JSON.stringify({ priceFrom: 999 }),
    });
    console.log('Response status:', crossOwnerEditRes.status);
    if (crossOwnerEditRes.status !== 403) {
      throw new Error('Ownership isolation failure: an Owner edited another Owner\'s tour!');
    }
    console.log('✓ Ownership isolation check passed: cross-Owner edit rejected with 403 Forbidden');

    // 21. GET /api/tours/manage must not leak the second Owner's tour to the first Owner
    console.log('\n[TEST 21] GET /api/tours/manage (first Owner should not see second Owner\'s tour)');
    const manageToursRes = await fetch(`${BASE_URL}/tours/manage`, {
      headers: { Authorization: `Bearer ${ownerToken}` },
    });
    const manageTours = await manageToursRes.json();
    console.log('Response status:', manageToursRes.status, `Tours visible: ${manageTours.length}`);
    if (manageToursRes.status !== 200 || manageTours.some((t) => t._id === secondOwnerTourId)) {
      throw new Error('Data scoping failure: first Owner could see second Owner\'s tour in /tours/manage');
    }
    console.log('✓ /tours/manage correctly scoped to the signed-in Owner');

    // 22. Admin bypasses ownership and can edit any Owner's tour
    console.log('\n[TEST 22] PUT /api/tours/:id (Admin editing second Owner\'s tour)');
    const adminEditRes = await fetch(`${BASE_URL}/tours/${secondOwnerTourId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${adminToken}` },
      body: JSON.stringify({ priceFrom: 888 }),
    });
    console.log('Response status:', adminEditRes.status);
    if (adminEditRes.status !== 200) {
      throw new Error('Admin failed to bypass ownership and edit another Owner\'s tour');
    }
    console.log('✓ Admin successfully bypassed ownership scoping');

    // 23. Admin reassigns the earlier test inquiry to the second Owner (§2.5.2)
    console.log(`\n[TEST 23] PATCH /api/inquiries/${testInquiryId}/assign (Admin reassigns inquiry)`);
    const assignRes = await fetch(`${BASE_URL}/inquiries/${testInquiryId}/assign`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${adminToken}` },
      body: JSON.stringify({ ownerId: secondOwnerId }),
    });
    const assignData = await assignRes.json();
    console.log('Response status:', assignRes.status);
    if (assignRes.status !== 200 || String(assignData.ownerId?._id || assignData.ownerId) !== String(secondOwnerId)) {
      throw new Error('Admin failed to reassign the inquiry to the second Owner');
    }
    console.log('✓ Inquiry reassigned to the second Owner successfully');

    // 24. Analytics — Owner sees only their own totals
    console.log('\n[TEST 24] GET /api/analytics (Owner totals)');
    const ownerAnalyticsRes = await fetch(`${BASE_URL}/analytics`, {
      headers: { Authorization: `Bearer ${ownerToken}` },
    });
    const ownerAnalytics = await ownerAnalyticsRes.json();
    console.log('Response status:', ownerAnalyticsRes.status, ownerAnalytics.totals);
    if (ownerAnalyticsRes.status !== 200 || !ownerAnalytics.totals) {
      throw new Error('Owner failed to retrieve their own analytics');
    }
    console.log('✓ Owner analytics retrieved successfully');

    // 25. Analytics — Admin sees platform-wide totals including Owner count
    console.log('\n[TEST 25] GET /api/analytics (Admin platform-wide totals)');
    const adminAnalyticsRes = await fetch(`${BASE_URL}/analytics`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    const adminAnalytics = await adminAnalyticsRes.json();
    console.log('Response status:', adminAnalyticsRes.status, adminAnalytics.totals);
    if (adminAnalyticsRes.status !== 200 || adminAnalytics.totals?.owners === undefined) {
      throw new Error('Admin failed to retrieve platform-wide analytics');
    }
    console.log('✓ Admin platform-wide analytics retrieved successfully');

    // 26. Audit log — Admin can review the trail left by the actions above (§8.2)
    console.log('\n[TEST 26] GET /api/audit-logs (Admin reviews the audit trail)');
    const auditLogsRes = await fetch(`${BASE_URL}/audit-logs`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    const auditLogsData = await auditLogsRes.json();
    console.log('Response status:', auditLogsRes.status, `Log entries: ${auditLogsData.total}`);
    if (auditLogsRes.status !== 200 || !Array.isArray(auditLogsData.logs) || auditLogsData.total === 0) {
      throw new Error('Admin failed to retrieve the audit log, or no entries were recorded');
    }
    console.log('✓ Audit log recorded and retrieved successfully');

    // 27. RBAC Gating: Owner trying to read the audit log (Admin-only, §8.2 AL-3)
    console.log('\n[TEST 27] GET /api/audit-logs (Security test: Owner calling Admin route)');
    const unauthorizedAuditRes = await fetch(`${BASE_URL}/audit-logs`, {
      headers: { Authorization: `Bearer ${ownerToken}` },
    });
    console.log('Response status:', unauthorizedAuditRes.status);
    if (unauthorizedAuditRes.status !== 403) {
      throw new Error('RBAC Failure: Owner was allowed to read the audit log!');
    }
    console.log('✓ RBAC check passed: Owner was rejected with 403 Forbidden');

    // 28. Cleanup: Admin deletes the second Owner (soft-hides their tours, §5.2 policy note)
    console.log(`\n[TEST 28] DELETE /api/owners/${secondOwnerId} (Admin deletes the second Owner)`);
    const deleteOwnerRes = await fetch(`${BASE_URL}/owners/${secondOwnerId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    console.log('Response status:', deleteOwnerRes.status);
    if (deleteOwnerRes.status !== 200) {
      throw new Error('Admin failed to delete the second Owner account');
    }
    console.log('✓ Second Owner deleted successfully (tours soft-hidden, not orphaned)');

    // 29. Token Revocation & Logout Test
    console.log('\n[TEST 29] POST /api/auth/logout & Revocation Check');
    const logoutRes = await fetch(`${BASE_URL}/auth/logout`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${userToken}` },
    });
    console.log('Logout response status:', logoutRes.status);
    if (logoutRes.status !== 200) {
      throw new Error('Logout failed');
    }

    // Verify revoked token is now rejected
    const revokedCheckRes = await fetch(`${BASE_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${userToken}` },
    });
    console.log('Revoked token request status:', revokedCheckRes.status);
    if (revokedCheckRes.status !== 401) {
      throw new Error('Token revocation failure: Revoked token was accepted!');
    }
    console.log('✓ Logout and token revocation verified successfully');

    console.log('\n=== ALL TESTS COMPLETED SUCCESSFULLY! ===');
    process.exit(0);
  } catch (err) {
    console.error('\n✕ VERIFICATION FAILED:', err.message);
    process.exit(1);
  }
};

// Wait 2 seconds for server to boot up before testing
setTimeout(runTests, 2000);
