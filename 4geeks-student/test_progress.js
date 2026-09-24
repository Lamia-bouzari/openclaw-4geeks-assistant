"use strict";

/**
 * Test runner for GetProgressSkill.
 *
 * Endpoint: GET /v1/assignment/user/me/task (no task_status filter)
 * Tests:
 * 1. Valid token — confirms real account progress summary returned with HTTP 200
 * 2. Missing token — constructor throws
 * 3. Invalid token — returns HTTP 401
 *
 * The token value is never printed. Only status codes and success flags are shown.
 */

const GetProgressSkill = require('./progress.js');

async function testValidToken() {
  console.log('=== Test 1: Valid Token — Get Progress Summary ===');
  console.log('Token present:', !!process.env.FOUR_GEEKS_TOKEN);

  try {
    const skill = new GetProgressSkill();
    const result = await skill.getProgress();

    if (result.success) {
      console.log('HTTP Status:', result.status);
      console.log('Success:', result.success);

      const data = result.data;
      console.log('Total tasks:', data.total);
      console.log('Pages fetched:', data.pages_fetched);

      console.log('\nStatus breakdown:');
      console.log('  PENDING:', data.pending);
      console.log('  DONE:', data.done);
      console.log('  APPROVED:', data.approved);
      console.log('  REJECTED:', data.rejected);

      console.log('\nType breakdown:');
      console.log('  PROJECT:', data.by_type.PROJECT);
      console.log('  EXERCISE:', data.by_type.EXERCISE);
      console.log('  LESSON:', data.by_type.LESSON);
      console.log('  QUIZ:', data.by_type.QUIZ);

      console.log('\nDerived progress percentage:', data.progress_percent + '%');
      console.log('  Note:', data.progress_percent_note);

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
  console.log('\n=== Test 2: Missing Token ===');
  const saved = process.env.FOUR_GEEKS_TOKEN;
  delete process.env.FOUR_GEEKS_TOKEN;

  try {
    const skill = new GetProgressSkill();
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
  console.log('\n=== Test 3: Invalid Token ===');
  const saved = process.env.FOUR_GEEKS_TOKEN;
  process.env.FOUR_GEEKS_TOKEN = 'invali…test';

  try {
    const skill = new GetProgressSkill();
    const result = await skill.getProgress();
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
  console.log('4Geeks Get Progress Summary — Test Suite\n');

  const t1 = await testValidToken();
  const t2 = await testMissingToken();
  const t3 = await testInvalidToken();

  console.log('\n=== Summary ===');
  console.log('Test 1 (valid token):', t1 ? 'PASS' : 'FAIL');
  console.log('Test 2 (missing token):', t2 ? 'PASS' : 'FAIL');
  console.log('Test 3 (invalid token):', t3 ? 'PASS' : 'FAIL');

  const allPass = t1 && t2 && t3;
  console.log('\nOverall:', allPass ? 'ALL PASS' : 'SOME FAILED');
  process.exit(allPass ? 0 : 1);
}

main().catch(err => {
  console.error('Test runner crashed:', err);
  process.exit(2);
});
