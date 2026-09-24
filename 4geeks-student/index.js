"use strict";

/**
 * 4Geeks Student API Skill — Entry Point
 *
 * Skill 1: Authenticate
 *   Verifies FOUR_GEEKS_TOKEN against the BreatheCode Admissions API.
 * Skill 2: Get Projects
 *   Retrieves the student's assigned projects from BreatheCode API.
 * Skill 3: Get Pending Work
 *   Retrieves ALL pending tasks (PROJECT, EXERCISE, LESSON, etc.)
 *   from the BreatheCode API.
 * Skill 4: Get Progress Summary
 *   Aggregates ALL assigned tasks (no task_status filter) into a progress summary.
 */

const AuthenticateSkill = require('./authenticate.js');
const GetProjectsSkill = require('./projects.js');
const PendingWorkSkill = require('./pending-work.js');
const GetProgressSkill = require('./progress.js');
const GetAssetsSkill = require('./assets.js');
const GetEventsSkill = require('./events.js');

module.exports = {
  AuthenticateSkill,
  GetProjectsSkill,
  PendingWorkSkill,
  GetProgressSkill,
  GetAssetsSkill,
  GetEventsSkill
};