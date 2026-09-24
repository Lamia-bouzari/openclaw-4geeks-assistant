"use strict";

/**
 * Test runner for PendingWorkSkill.
 *
 * Endpoint: GET /v1/assignment/user/me/task?task_status=PENDING
 * Tests:
 * 1. Valid token — confirms real account pending tasks returned with HTTP 200
 * 2. Valid token — getAllPendingWork() fetches all pages automatically
 * 3. Missing token — constructor throws
 * 4. Invalid token — returns HTTP 401
 *
 * The token value is never printed. Only status codes and success flags are shown.
 */

const PendingWorkSkill = require('./pending-work.js');

async function testValidToken() {
  console.log('=== Test 1: Valid Token — Get Pending Work (single page) ===');
  console.log('Token present:', !!process.env.FOUR_GEEKS_TOKEN);

  try {
    const skill = new PendingWorkSkill();
    const result = await skill.getPendingWork(50, 0);

    if (result.success) {
      console.log('HTTP Status:', result.status);
      console.log('Success:', result.success);

      const data = result.data;
      let results = [];
      if (Array.isArray(data)) {
        results = data;
      } else if (data && Array.isArray(data.results)) {
        results = data.results;
      }

      console.log('Pending task count (page 1):', results.length);

      const counts = {};
      for (const t of results) {
        const type = t.task_type || '(unknown)';
        counts[type] = (counts[type] || 0) + 1;
      }
      console.log('Task type breakdown (page 1):', JSON.stringify(counts));

      if (results.length > 0) {
        console.log('\nSample pending tasks (first 5):');
        const sampleSize = Math.min(5, results.length);
        for (let i = 0; i < sampleSize; i++) {
          const p = results[i];
          console.log(`  [${i}] Title: ${p.title || p.name || '(no title)'} | task_type: ${p.task_type || '(no type)'} | task_status: ${p.task_status || '(no status)'}`);
        }
      }

      return true;
    } else {
      console.log('HTTP Status:', result.status);
      console.log('Success:', result.success);
      console.log('Response:', result.response);
      return false;
    }
  } catch (err) {
    console.log('Unexpected error:', err.message);
    return false;
  }
}

async function testGetAllPendingWork() {
  console.log('\n=== Test 2: Get All Pending Work (auto-pagination) ===');

  try {
    const skill = new PendingWorkSkill();
    const result = await skill.getAllPendingWork();

    if (result.success) {
      console.log('HTTP Status:', result.status);
      console.log('Success:', result.success);

      const data = result.data;
      const results = data && Array.isArray(data.results) ? data.results : [];

      console.log('Total pending tasks (all pages):', data.count || results.length);
      console.log('Pages fetched:', data.pages_fetched || 'unknown');

      // Count by task_type
      const counts = {};
      for (const t of results) {
        const type = t.task_type || '(unknown)';
        counts[type] = (counts[type] || 0) + 1;
      }
      console.log('Task type breakdown:', JSON.stringify(counts));

      if (results.length > 0) {
        console.log('\nSample pending tasks (first 5):');
        const sampleSize = Math.min(5, results.length);
        for (let i = 0; i < sampleSize; i++) {
          const p = results[i];
          console.log(`  [${i}] Title: ${p.title || p.name || '(no title)'} | task_type: ${p.task_type || '(no type)'} | task_status: ${p.task_status || '(no status)'}`);
        }
      }

      return true;
    } else {
      console.log('HTTP Status:', result.status);
      console.log('Success:', result.success);
      console.log('Response:', result.response);
      return false;
    }
  } catch (err) {
    console.log('Unexpected error:', err.message);
    return false;
  }
}

async function testMissingToken() {
  console.log('\n=== Test 3: Missing Token ===');
  const saved = process.env.FOUR_GEEKS_TOKEN;
  delete process.env.FOUR_GEEKS_TOKEN;

  try {
    const skill = new PendingWorkSkill();
    console.log('ERROR: Constructor should have thrown');
    return false;
  } catch (err) {
    console.log('Expected error:', err.message);
    return err.message.includes('FOUR_GEEKS_TOKEN');
  } finally {
    if (saved !== undefined) {
      process.env.FOUR_GEEKS_TOKEN = saved;
    }
  }
}

async function testInvalidToken() {
  console.log('\n=== Test 4: Invalid Token ===');
  const saved = process.env.FOUR_GEEKS_TOKEN;
  process.env.FOUR_GEEKS_TOKEN = 'invalid_token_test';

  try {
    const skill = new PendingWorkSkill();
    const result = await skill.getPendingWork(50, 0);
    console.log('HTTP Status:', result.status);
    console.log('Success:', result.success);
    return !result.success && (result.status === 401 || result.status === 403 || result.status === 'ERROR');
  } catch (err) {
    console.log('Unexpected error:', err.message);
    return false;
  } finally {
    if (saved !== undefined) {
      process.env.FOUR_GEEKS_TOKEN = saved;
    }
  }
}

async function main() {
  console.log('4Geeks Get Pending Work — Test Suite\n');

  const t1 = await testValidToken();
  const t2 = await testGetAllPendingWork();
  const t3 = await testMissingToken();
  const t4 = await testInvalidToken();

  console.log('\n=== Summary ===');
  console.log('Test 1 (valid token, single page):', t1 ? 'PASS' : 'FAIL');
  console.log('Test 2 (all pending work, auto-pagination):', t2 ? 'PASS' : 'FAIL');
  console.log('Test 3 (missing token):', t3 ? 'PASS' : 'FAIL');
  console.log('Test 4 (invalid token):', t4 ? 'PASS' : 'FAIL');

  const allPass = t1 && t2 && t3 && t4;
  console.log('\nOverall:', allPass ? 'ALL PASS' : 'SOME FAILED');
  process.exit(allPass ? 0 : 1);
}

main().catch(err => {
  console.error('Test runner crashed:', err);
  process.exit(2);
});
