"use strict";

/**
 * 4Geeks Student API Authentication Skill
 *
 * Verifies the FOUR_GEEKS_TOKEN by calling the student profile endpoint.
 * Uses the exact format specified in official 4Geeks/BreatheCode documentation.
 *
 * Requirements:
 * - Environment variable: FOUR_GEEKS_TOKEN
 * - Endpoint: GET https://breathecode.herokuapp.com/v1/admissions/user/me
 * - Header: Authorization: Token ${FOUR_GEEKS_TOKEN}
 */

class AuthenticateSkill {
  constructor() {
    this.baseURL = 'https://breathecode.herokuapp.com';
    this.endpoint = '/v1/admissions/user/me';
    this.token = process.env.FOUR_GEEKS_TOKEN;

    if (!this.token) {
      throw new Error('FOUR_GEEKS_TOKEN environment variable is required');
    }
  }

  async authenticate() {
    const url = `${this.baseURL}${this.endpoint}`;

    const headers = {
      'Authorization': `Token ${this.token}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: headers,
        signal: AbortSignal.timeout(10000)
      });

      const responseText = await response.text();

      if (!response.ok) {
        return {
          success: false,
          status: response.status,
          statusText: response.statusText,
          response: responseText
        };
      }

      const data = JSON.parse(responseText);

      return {
        success: true,
        status: response.status,
        data: data
      };

    } catch (error) {
      return {
        success: false,
        error: error.message,
        status: 'ERROR'
      };
    }
  }

  async testWithInvalidToken() {
    const originalToken = this.token;
    this.token = 'invalid_token_for_testing';

    try {
      const result = await this.authenticate();
      return {
        test: 'invalid_token',
        result: result
      };
    } finally {
      this.token = originalToken;
    }
  }
}

module.exports = AuthenticateSkill;
