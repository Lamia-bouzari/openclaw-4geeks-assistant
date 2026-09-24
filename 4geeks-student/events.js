"use strict";

/**
 * 4Geeks Student API Get My Events Skill
 *
 * Retrieves upcoming and/or available events from the BreatheCode API
 * using GET /v1/events/all.
 *
 * Authentication: Authorization: Token ${FOUR_GEEKS_TOKEN}
 * Token is read only from process.env.FOUR_GEEKS_TOKEN; never hardcoded or logged.
 */

class GetEventsSkill {
  constructor() {
    this.baseURL = 'https://breathecode.herokuapp.com';
    this.endpoint = '/v1/events/all';
    this.token = process.env.FOUR_GEEKS_TOKEN;

    if (!this.token) {
      throw new Error('FOUR_GEEKS_TOKEN environment variable is required');
    }
  }

  /**
   * Fetch all upcoming and available events.
   * @returns {Promise<Object>} Result object with success status and data
   */
  async getEvents() {
    const fullUrl = `${this.baseURL}${this.endpoint}`;

    const headers = {
      'Authorization': `Token ${this.token}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };

    try {
      const response = await fetch(fullUrl, {
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
}

module.exports = GetEventsSkill;