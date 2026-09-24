"use strict";

/**
 * 4Geeks Student API Get Pending Work Skill
 *
 * Retrieves ALL pending tasks (PROJECT, EXERCISE, LESSON, etc.)
 * from the BreatheCode API using the /v1/assignment/user/me/task endpoint
 * with task_status=PENDING. Does NOT filter by task_type.
 * Supports pagination via limit and offset query parameters.
 *
 * Requirements:
 * - Environment variable: FOUR_GEEKS_TOKEN
 * - Endpoint: GET https://breathecode.herokuapp.com/v1/assignment/user/me/task
 * - Query params: task_status=PENDING, limit (optional, default 50), offset (optional, default 0)
 * - Header: Authorization: Token ${FOUR_GEEKS_TOKEN}
 */

class PendingWorkSkill {
  constructor() {
    this.baseURL = 'https://breathecode.herokuapp.com';
    this.endpoint = '/v1/assignment/user/me/task';
    this.token = process.env.FOUR_GEEKS_TOKEN;

    if (!this.token) {
      throw new Error('FOUR_GEEKS_TOKEN environment variable is required');
    }
  }

  /**
   * Build the full URL for a pending-work request.
   * @param {number|null} limit - Number of tasks per page (null = API default)
   * @param {number} offset - Number of tasks to skip
   * @returns {string} Full URL with query parameters
   */
  _buildUrl(limit, offset) {
    const url = `${this.baseURL}${this.endpoint}`;
    const params = new URLSearchParams();
    params.append('task_status', 'PENDING');
    if (limit !== undefined && limit !== null) params.append('limit', limit);
    if (offset !== undefined && offset !== null) params.append('offset', offset);
    return `${url}?${params.toString()}`;
  }

  /**
   * Fetch a single page of pending tasks.
   * @param {number} limit - Number of tasks to return (default: 50)
   * @param {number} offset - Number of tasks to skip (default: 0)
   * @returns {Promise<Object>} Result object with success status and data
   */
  async getPendingWork(limit = 50, offset = 0) {
    const fullUrl = this._buildUrl(limit, offset);

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

  /**
   * Fetch ALL pages of pending tasks automatically by following pagination links.
   * Uses limit=50 per page to ensure proper pagination across all pages.
   * @returns {Promise<Object>} Result object with success status and all data combined
   */
  async getAllPendingWork() {
    const allResults = [];
    let nextUrl = this._buildUrl(50, 0); // First page with explicit limit
    let lastStatus = 200;
    let pagesFetched = 0;

    while (nextUrl) {
      const headers = {
        'Authorization': `Token ${this.token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      };

      try {
        const response = await fetch(nextUrl, {
          method: 'GET',
          headers: headers,
          signal: AbortSignal.timeout(10000)
        });

        const responseText = await response.text();
        lastStatus = response.status;

        if (!response.ok) {
          return {
            success: false,
            status: response.status,
            statusText: response.statusText,
            response: responseText,
            pagesFetched: pagesFetched
          };
        }

        const data = JSON.parse(responseText);
        pagesFetched++;

        // Append results from this page
        if (data && Array.isArray(data.results)) {
          allResults.push(...data.results);
        } else if (Array.isArray(data)) {
          allResults.push(...data);
        }

        // Follow the 'next' link if present
        nextUrl = (data && data.next) ? data.next : null;

      } catch (error) {
        return {
          success: false,
          error: error.message,
          status: 'ERROR',
          pagesFetched: pagesFetched
        };
      }
    }

    return {
      success: true,
      status: lastStatus,
      data: {
        count: allResults.length,
        results: allResults,
        pages_fetched: pagesFetched
      }
    };
  }
}

module.exports = PendingWorkSkill;
