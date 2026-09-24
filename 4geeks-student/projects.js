"use strict";

/**
 * 4Geeks Student API Get Projects Skill
 *
 * Retrieves the student's assigned PROJECT tasks from the BreatheCode API
 * using the /v1/assignment/user/me/task endpoint with task_type=PROJECT.
 * Supports pagination via limit and offset query parameters.
 *
 * Requirements:
 * - Environment variable: FOUR_GEEKS_TOKEN
 * - Endpoint: GET https://breathecode.herokuapp.com/v1/assignment/user/me/task
 * - Query params: task_type=PROJECT, limit (optional, default 50), offset (optional, default 0)
 * - Header: Authorization: Token ${FOUR_GEEKS_TOKEN}
 */

class GetProjectsSkill {
  constructor() {
    this.baseURL = 'https://breathecode.herokuapp.com';
    this.endpoint = '/v1/assignment/user/me/task';
    this.token = process.env.FOUR_GEEKS_TOKEN;

    if (!this.token) {
      throw new Error('FOUR_GEEKS_TOKEN environment variable is required');
    }
  }

  /**
   * Get assigned project tasks with pagination
   * @param {number} limit - Number of projects to return (default: 50)
   * @param {number} offset - Number of projects to skip (default: 0)
   * @returns {Promise<Object>} Result object with success status and data
   */
  async getProjects(limit = 50, offset = 0) {
    const url = `${this.baseURL}${this.endpoint}`;

    // Build query parameters
    const params = new URLSearchParams();
    params.append('task_type', 'PROJECT');
    if (limit !== undefined && limit !== null) params.append('limit', limit);
    if (offset !== undefined && offset !== null) params.append('offset', offset);

    const fullUrl = `${url}?${params.toString()}`;

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

module.exports = GetProjectsSkill;