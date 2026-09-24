"use strict";

/**
 * Test runner for 4Geeks Authenticate skill.
 *
 * Runs three cases:
 * 1. Valid token (real FOUR_GEEKS_TOKEN)
 * 2. Missing token (unset env var)
 * 3. Invalid token (garbage string)
 *
 * The token value is never printed. Only status codes and success flags are shown.
 */

const AuthenticateSkill = require('./authenticate.js');

function maskToken(value) {
  if (!value) return 'UNSET';
  return value.slice(0, 4) + '***' + value.slice(-4);
}

async function testValidToken() {
  console.log('=== Test 1: Valid Token ===');
  console.log('Token present:', !!process.env.FOUR_GEEKS_TOKEN);

  try {
    const auth = new AuthenticateSkill();
    const result = await auth.authenticate();
    console.log('Result:', JSON.stringify(result, null, 2));
    return result.success && result.status === 200;
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
    const auth = new AuthenticateSkill();
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
    const auth = new AuthenticateSkill();
    const result = await auth.authenticate();
    console.log('Result:', JSON.stringify(result, null, 2));
    return !result.success && result.status === 401;
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
  console.log('4Geeks Authenticate — Test Suite\n');

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