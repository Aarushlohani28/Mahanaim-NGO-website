// Test script for volunteer module verification
const BASE_URL = 'http://localhost:3000';

async function runTests() {
  console.log('--- STARTING VOLUNTEER MODULE VALIDATION TESTS ---');

  // Test 1: Public Registration with missing fields
  console.log('\n[Test 1] Public Registration missing required fields...');
  const invalidRes = await fetch(`${BASE_URL}/api/volunteers`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: 'Incomplete User' })
  });
  const invalidJson = await invalidRes.json();
  console.log('Status:', invalidRes.status, 'Response:', invalidJson);
  if (invalidRes.status === 400 && !invalidJson.success) {
    console.log('✅ Test 1 Passed: Validation correctly rejected incomplete payload.');
  } else {
    console.error('❌ Test 1 Failed');
  }

  // Test 2: Public Registration with valid payload
  console.log('\n[Test 2] Public Registration with valid payload...');
  const validPayload = {
    name: 'Aarav Sharma',
    phone: '+91 98765 43210',
    email: 'aarav.sharma@example.com',
    address: '42 MG Road, Bengaluru, Karnataka, 560001',
    availableDays: ['Saturday', 'Sunday'],
    availabilityTime: 'Morning',
    areasOfInterest: ['Education', 'Community Outreach'],
    skills: 'Teaching, English & Hindi fluency, Basic First Aid',
    occupation: 'Software Engineer',
    message: 'I would love to teach underprivileged children during weekends.',
    consentToContact: true
  };

  const regRes = await fetch(`${BASE_URL}/api/volunteers`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(validPayload)
  });
  const regJson = await regRes.json();
  console.log('Status:', regRes.status, 'Response:', regJson);
  const createdVolunteerId = regJson.id;

  if (regRes.status === 201 && regJson.success && regJson.id) {
    console.log('✅ Test 2 Passed: Successfully created volunteer application. ID:', createdVolunteerId);
  } else {
    console.error('❌ Test 2 Failed');
  }

  // Test 3: Public Privacy Check (ensure sensitive data is not returned in public response)
  console.log('\n[Test 3] Privacy verification on public response...');
  if (!regJson.phone && !regJson.address && !regJson.adminNotes) {
    console.log('✅ Test 3 Passed: Sensitive fields (phone, address, notes) were NOT leaked to public API.');
  } else {
    console.error('❌ Test 3 Failed: Sensitive data leaked in public response!');
  }

  // Test 4: Unauthorized Admin Access
  console.log('\n[Test 4] Unauthorized GET /api/volunteers...');
  const unauthGetRes = await fetch(`${BASE_URL}/api/volunteers`);
  console.log('Status:', unauthGetRes.status);
  if (unauthGetRes.status === 401) {
    console.log('✅ Test 4 Passed: Unauthorized GET request correctly returned 401.');
  } else {
    console.error('❌ Test 4 Failed');
  }

  // Test 5: Authorized Admin GET
  console.log('\n[Test 5] Authorized GET /api/volunteers...');
  const adminSecret = process.env.ADMIN_SECRET_TOKEN || 'mahanaim_secure_admin_token_2026';
  const authGetRes = await fetch(`${BASE_URL}/api/volunteers`, {
    headers: { 'Authorization': `Bearer ${adminSecret}` }
  });
  const authGetJson = await authGetRes.json();
  console.log('Status:', authGetRes.status, 'Total volunteers retrieved:', authGetJson.volunteers?.length);
  const foundVolunteer = authGetJson.volunteers?.find(v => v.id === createdVolunteerId);
  if (authGetRes.status === 200 && foundVolunteer) {
    console.log('✅ Test 5 Passed: Authorized admin successfully retrieved volunteer details including address & phone.');
    console.log('Retrieved record status:', foundVolunteer.status, 'Available days:', foundVolunteer.availableDays);
  } else {
    console.error('❌ Test 5 Failed');
  }

  // Test 6: Authorized Admin PATCH (Update Status & Notes)
  console.log('\n[Test 6] Authorized Admin Status Update & Notes...');
  const patchRes = await fetch(`${BASE_URL}/api/volunteers`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${adminSecret}`
    },
    body: JSON.stringify({
      id: createdVolunteerId,
      status: 'APPROVED',
      adminNotes: 'Interviewed via phone on Sept 30. Approved for weekend education drives.'
    })
  });
  const patchJson = await patchRes.json();
  console.log('Status:', patchRes.status, 'Response:', patchJson);
  if (patchRes.status === 200 && patchJson.success) {
    console.log('✅ Test 6 Passed: Volunteer status and admin notes updated successfully.');
  } else {
    console.error('❌ Test 6 Failed');
  }

  // Test 7: Unauthorized Admin PATCH
  console.log('\n[Test 7] Unauthorized PATCH /api/volunteers...');
  const unauthPatchRes = await fetch(`${BASE_URL}/api/volunteers`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id: createdVolunteerId, status: 'REJECTED' })
  });
  console.log('Status:', unauthPatchRes.status);
  if (unauthPatchRes.status === 401) {
    console.log('✅ Test 7 Passed: Unauthorized PATCH correctly blocked with 401.');
  } else {
    console.error('❌ Test 7 Failed');
  }

  console.log('\n--- ALL BACKEND & AUTHORIZATION TESTS COMPLETED ---');
}

runTests().catch(console.error);
