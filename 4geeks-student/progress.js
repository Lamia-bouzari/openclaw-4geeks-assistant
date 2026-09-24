"use strict";

/**
 * 4Geeks Student API Get Progress Summary Skill
 *
 * Calculates a progress summary from ALL assigned tasks (no task_status filter)
 * from the BreatheCode API using /v1/assignment/user/me/task.
 *
 * The API does NOT provide a dedicated progress endpoint, so this skill
 * aggregates the complete task list locally and computes summary metrics.
 *
 * Requirements:
 * - Environment variable: FOUR_GEEKS_TOKEN
 * - Endpoint: GET https://breathecode.herokuapp.com/v1/assignment/user/me/task
 * - Query params: limit (optional, default 50), offset (optional, default 0)
 * - Header: Authorization: Token ${FOUR_GEEKS_TOKEN}
 *
 * WARNING: progress_percent is a DERIVED metric calculated by this skill
 * as (DONE + APPROVED) / total * 100. It is NOT an official 4Geeks
 * progress percentage and should be labeled as such.
 */

class GetProgressSkill {
  constructor() {
    this.baseURL = 'https://breathecode.herokuapp.com';
    this.endpoint = '/v1/assignment/user/me/task';
    this.token = process.env.FOUR_GEEKS_TOKEN;

    if (!this.token) {
      throw new Error('FOUR_GEEKS_TOKEN environment variable is required');
    }
  }

  /**
   * Build the full URL for an all-tasks request (no task_status filter).
   * @param {number|null} limit - Number of tasks per page (null = API default)
   * @param {number} offset - Number of tasks to skip
   * @returns {string} Full URL with query parameters
   */
  _buildUrl(limit, offset) {
    const url = `${this.baseURL}${this.endpoint}`;
    const params = new URLSearchParams();
    if (limit !== undefined && limit !== null) params.append('limit', limit);
    if (offset !== undefined && offset !== null) params.append('offset', offset);
    return `${url}?${params.toString()}`;
  }

  /**
   * Fetch a single page of all assigned tasks.
   * @param {number} limit - Number of tasks to return (default: 50)
   * @param {number} offset - Number of tasks to skip (default: 0)
   * @returns {Promise<Object>} Result object with success status and data
   */
  async getTasks(limit = 50, offset = 0) {
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
   * Fetch ALL pages of assigned tasks automatically by following pagination links.
   * Does NOT filter by task_status — returns every assigned task.
   * @returns {Promise<Object>} Result object with success status and all data combined
   */
  async getAllTasks() {
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

  /**
   * Aggregate a complete task list into a progress summary.
   * @param {Array} results - Array of task objects
   * @returns {Object} Aggregated summary
   */
  _aggregate(results) {
    const statusCounts = {
      PENDING: 0,
      DONE: 0,
      APPROVED: 0,
      REJECTED: 0
    };
    const typeCounts = {
      PROJECT: 0,
      EXERCISE: 0,
      LESSON: 0,
      QUIZ: 0
    };

    for (const task of results) {
      const status = task.task_status;
      if (status && statusCounts.hasOwnProperty(status)) {
        statusCounts[status]++;
      }

      const type = task.task_type;
      if (type && typeCounts.hasOwnProperty(type)) {
        typeCounts[type]++;
      }
    }

    const total = results.length;
    const completed = statusCounts.DONE + statusCounts.APPROVED;
    const progressPercent = total > 0 ? Math.round((completed / total) * 10000) / 100 : 0;

    return {
      total,
      pending: statusCounts.PENDING,
      done: statusCounts.DONE,
      approved: statusCounts.APPROVED,
      rejected: statusCounts.REJECTED,
      by_type: {
        PROJECT: typeCounts.PROJECT,
        EXERCISE: typeCounts.EXERCISE,
        LESSON: typeCounts.LESSON,
        QUIZ: typeCounts.QUIZ
      },
      progress_percent: progressPercent,
      progress_percent_note: 'DERIVED METRIC: Calculated by this skill as (DONE + APPROVED) / total * 100. This is NOT an official 4Geeks progress percentage.'
    };
  }

  /**
   * Get the full progress summary across all assigned tasks.
   * @returns {Promise<Object>} Result object with success status and summary data
   */
  async getProgress() {
    const result = await this.getAllTasks();

    if (!result.success) {
      return result;
    }

    const summary = this._aggregate(result.data.results);

    return {
      success: true,
      status: result.status,
      data: {
        ...summary,
        pages_fetched: result.data.pages_fetched,
        raw_count: result.data.count
      }
    };
  }
}

module.exports = GetProgressSkill;