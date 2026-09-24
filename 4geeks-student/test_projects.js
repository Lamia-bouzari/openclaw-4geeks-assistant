"use strict";

/**
 * Test runner for GetProjectsSkill (corrected endpoint).
 *
 * Endpoint: GET /v1/assignment/user/me/task?task_type=PROJECT
 * Tests:
 * 1. Valid token — confirms real account projects returned with HTTP 200
 * 2. Missing token — constructor throws
 * 3. Invalid token — returns HTTP 401
 *
 * The token value is never printed. Only status codes and success flags are shown.
 */

const GetProjectsSkill = require('./projects.js');

async function testValidToken() {
  console.log('=== Test 1: Valid Token — Get My Projects ===');
  console.log('Token present:', !!process.env.FOUR_GEEKS_TOKEN);

  try {
    const skill = new GetProjectsSkill();
    const result = await skill.getProjects(50, 0);

    if (result.success) {
      console.log('HTTP Status:', result.status);
      console.log('Success:', result.success);

      const data = result.data;
      // Handle both array and paginated response formats
      let results = [];
      if (Array.isArray(data)) {
        results = data;
      } else if (data && Array.isArray(data.results)) {
        results = data.results;
      } else if (data && Array.isArray(data)) {
        results = data;
      }

      console.log('Project count:', results.length);

      if (results.length > 0) {
        console.log('\nSample project (first 3):');
        const sampleSize = Math.min(3, results.length);
        for (let i = 0; i < sampleSize; i++) {
          const p = results[i];
          console.log(`  [${i}] Title: ${p.title || p.name || '(no title)'} | task_status: ${p.task_status || '(no status)'}`);
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
  console.log('\n=== Test 2: Missing Token ===');
  const saved = process.env.FOUR_GEEKS_TOKEN;
  delete process.env.FOUR_GEEKS_TOKEN;

  try {
    const skill = new GetProjectsSkill();
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
  process.env.FOUR_GEEKS_TOKEN = 'invalid_token_for_testing';

  try {
    const skill = new GetProjectsSkill();
    const result = await skill.getProjects(50, 0);
    console.log('HTTP Status:', result.status);
    console.log('Success:', result.success);
    return !result.success && (result.status === 401 || result.status === 403);
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
  console.log('4Geeks Get Projects — Test Suite\n');

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