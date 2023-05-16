# Ticket Breakdown
We are a staffing company whose primary purpose is to book Agents at Shifts posted by Facilities on our platform. We're working on a new feature which will generate reports for our client Facilities containing info on how many hours each Agent worked in a given quarter by summing up every Shift they worked. Currently, this is how the process works:

- Data is saved in the database in the Facilities, Agents, and Shifts tables
- A function `getShiftsByFacility` is called with the Facility's id, returning all Shifts worked that quarter, including some metadata about the Agent assigned to each
- A function `generateReport` is then called with the list of Shifts. It converts them into a PDF which can be submitted by the Facility for compliance.

## You've been asked to work on a ticket. It reads:

**Currently, the id of each Agent on the reports we generate is their internal database id. We'd like to add the ability for Facilities to save their own custom ids for each Agent they work with and use that id when generating reports for them.**


Based on the information given, break this ticket down into 2-5 individual tickets to perform. Provide as much detail for each ticket as you can, including acceptance criteria, time/effort estimates, and implementation details. Feel free to make informed guesses about any unknown details - you can't guess "wrong".


You will be graded on the level of detail in each ticket, the clarity of the execution plan within and between tickets, and the intelligibility of your language. You don't need to be a native English speaker, but please proof-read your work.

## Your Breakdown Here

# Assumptions:
 * an agent will have only one custom_agent_id (T-01)
 * this field will be available for all users with access to agent data/report data. No authorization is required to access this information (read or/and write).
 * Users that can create/update agents can also update this information (the new field).
 * This new field will be visible for all agents regardless of their Facility. So we will not have the possibility to activate/deactivate custom_agent_id field for a specific facility.
 * we assume that this field is optional for agents in the same facility, and we might also have facilities that are not using this functionality (they are not changing/adding the custom_agent_id)
 * we have only internal API. If we have external API then this will require a new API version and a notification for this change as it will affect the agent endpoints.

# Story - S-01

Subject: Add custom_id for each Agent

Details: Currently, the id of each Agent on the reports we generate is their internal database id. We'd like to add the ability for Facilities to save their own custom ids for each Agent they work with and use that id when generating reports for them.

 * A new field 'custom_agent_id' varchar(255) should be added to each Agent - optional field
 * create/read/update agent endpoints and frontend should be updated to include this new field
 * AgentShiftFacility report should include this information for each agent

Acceptance 1: Administrator is able to add this new field to existing agents and also to new agents.

Acceptance 2: Reporter is able to retrieve this information for each agent when is accessing AgentShiftFacility report

Acceptance 3: unit/acceptance tests are updated accordingly.

Acceptance 4: Documentation is updated (product documentation, internal/external swagger documentation, others?)

# Task breakdown for this story

## T-01 - Confirm if an agent can work with multiple Facilities
 Details: We assume that an agent cannot work with multiple facilities. This should be confirmed with Product owner

 * As agents cannot work with multiple Facilities we assume that the field is unique for each Agent. 
   * this assumption should be confirmed with Product owner. In the situation when an agent can work with multiple Facilities then we need 
   to support multiple customer_agent_ids for each agent-facility.
   * should we support multiple custom_agent_ids for each agent/facility as this might help in the future extensions of this feature? We should take into account that if we want multiple custom ids for agents then a join will be required to retrieve this information.
 * This is a blocker for entire story as it might change the current ticket breakdown.

 * Acceptance 1: A decision is made for this issue. 

 * Acceptance 2: Tickets are reviewed according with the decision


## T-02 - Migration for database tables
 Details: A migration should be applied to existing db to add a new varchar optional field to the Agent table

 The relations between Agent/Facility/Shifts tables are not changed. These will still use the database id.

 Blocked by: T-01

 Acceptance 1: Migration file is created with both up/down implementation for adding/rollback the new field (Postgrator ?).

 Acceptance 2: The migration is executed in local/test/production environments without breaking the current implementation.

 Estimates: 2 hours, depending on the CI pipeline execution time, unit test coverage, possible changes to the unit/acceptance tests.

## T-03 - Change API to support the new field for create/read/update Agent entity

 Details: API should be changed to support the new field for create/read/update agent entity

 Unit tests/acceptance tests should be updated accordingly to properly test the new functionality.

 Blocked by: T-02

 Acceptance 1: Create/read/update agents endpoints are changed to include support for the new field. This includes the data validation schema and updating queries used to push the data to our database

 Acceptance 2: unit/acceptance tests are updated

 Acceptance 3: Swagger documentation is updated

 Estimates: 3 hours

## T-04 - Frontend changes to support the new Agent field

 Details: Agent management components should be changed to allow this new field.
 
 A discussion is required with our Designer to make sure that the new field is added correctly to the pages.

 Blocked by: T-03

 Acceptance 1: The create/read/update agent pages are updated to support the new field

 Acceptance 2: Tests are updated

 Estimates: 3 hours

## T-05 - Update AgentShiftFacility report

 Details: Return the new field in the AgentShiftFacility report.

 The endpoint for this report should not be changed as it is using the facility id.

 The report should contain the new field for each agent

 * `getShiftsByFacility` should be changed to return also this custom_agent_id
 * `generateReport` should be changed to properly generate the report with the new id.

 Acceptance 1: The AgentShiftFacility should contain the new id for each agent, when this is available.
 
 Blocked by: T-02

 Estimate: 2 hours

## T-06 - Update product documentation

Details: Product documentation should be updated to describe the new field

Acceptance: The documentation is updated properly.

Estimate: 1/2 hours