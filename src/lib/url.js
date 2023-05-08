import env from '../config/env.config';

export const baseUrl = env().baseUrl;
export const version = env().version;

//----AUTH URLS----//
export const login = `${baseUrl}/api/v${version}/login`;

//----USER URLS----//
export const users = `${baseUrl}/api/v${version}/users`;
export const usersSearch = `${baseUrl}/api/v${version}/users/search`;
export const deleteUserById = `${baseUrl}/api/v${version}/user/id`;
export const getUsers = `${baseUrl}/api/v${version}/user`;
export const register = `${baseUrl}/api/v${version}/register`;
export const uploadUser = `${baseUrl}/api/v${version}/user/upload`;

//----STATE URLS----//
export const allStates = `${baseUrl}/api/v${version}/states`;
export const createState = `${baseUrl}/api/v${version}/state`;
export const getStateById = `${baseUrl}/api/v${version}/state`;
export const getStateByCode = `${baseUrl}/api/v${version}/state`;
export const updateState = `${baseUrl}/api/v${version}/state`;
export const deleteState = `${baseUrl}/api/v${version}/state/delete`;
export const filterStateByName = `${baseUrl}/api/v${version}/state/filter`;
export const changeDefaultState = `${baseUrl}/api/v${version}/state/set-default`;

//----LGA URLS----//
export const allLgas = `${baseUrl}/api/v${version}/lgas`;
export const createLga = `${baseUrl}/api/v${version}/lga`;
export const getLgaById = `${baseUrl}/api/v${version}/lga`;
export const getLgaByCode = `${baseUrl}/api/v${version}/lga`;
export const updateLga = `${baseUrl}/api/v${version}/lga`;
export const getLga = `${baseUrl}/api/v${version}/lga`;
export const deleteLga = `${baseUrl}/api/v${version}/lga/delete`;
export const filterLgaByName = `${baseUrl}/api/v${version}/lga/filter`;
export const getLgasByStateId = `${baseUrl}/api/v${version}/lga/state`;
export const getLgasBySenatorialDistrict = `${baseUrl}/api/v${version}/lga/senatorial-district`;
export const uploadLga = `${baseUrl}/api/v${version}/lga/upload`;

//----WARD URLS----//
export const allWards = `${baseUrl}/api/v${version}/wards`;
export const createWard = `${baseUrl}/api/v${version}/ward`;
export const getWardById = `${baseUrl}/api/v${version}/ward`;
export const getWard = `${baseUrl}/api/v${version}/ward`;
export const getWardByCode = `${baseUrl}/api/v${version}/ward`;
export const updateWard = `${baseUrl}/api/v${version}/ward`;
export const deleteWard = `${baseUrl}/api/v${version}/ward/delete`;
export const filterWardByName = `${baseUrl}/api/v${version}/ward/filter`;
export const getWardsByLgaId = `${baseUrl}/api/v${version}/ward/lga`;
export const uploadWard = `${baseUrl}/api/v${version}/ward/upload`;

//----POLLING UNIT URLS----//
export const allPollingUnits = `${baseUrl}/api/v${version}/polling-unit/all`;
export const getPollingUnit = `${baseUrl}/api/v${version}/polling-unit`;
export const createPollingUnit = `${baseUrl}/api/v${version}/polling-unit`;
export const getPollingUnitById = `${baseUrl}/api/v${version}/polling-unit`;
export const getPollingUnitByCode = `${baseUrl}/api/v${version}/polling-unit`;
export const updatePollingUnit = `${baseUrl}/api/v${version}/polling-unit`;
export const deletePollingUnit = `${baseUrl}/api/v${version}/polling-unit/delete`;
export const filterPollingUnitByName = `${baseUrl}/api/v${version}/polling-unit/filter`;
export const getPollingUnitsByWardId = `${baseUrl}/api/v${version}/polling-unit/ward`;
export const uploadPollingUnit = `${baseUrl}/api/v${version}/polling-unit/upload`;

//----POLITICAL PARTY URLS----//
export const allParties = `${baseUrl}/api/v${version}/political-party/all`;
export const politicalPartiesByState = `${baseUrl}/api/v${version}/political-party/state`;
export const createParty = `${baseUrl}/api/v${version}/political-party`;
export const getPartyById = `${baseUrl}/api/v${version}/political-party`;
export const getPartyByCode = `${baseUrl}/api/v${version}/political-party`;
export const filterPartyByName = `${baseUrl}/api/v${version}/political-party/filter`;
export const updateParty = `${baseUrl}/api/v${version}/political-party`;
export const deleteParty = `${baseUrl}/api/v${version}/political-party/delete`;

//----AGENT URLS----//
export const allAgents = `${baseUrl}/api/v${version}/party-agent/filter/state`;
export const createAgent = `${baseUrl}/api/v${version}/party-agent`;
export const getAgentByPhone = `${baseUrl}/api/v${version}/party-agent/phone`;
export const filterAgentByName = `${baseUrl}/api/v${version}/party-agent/search`;
export const getAgent = `${baseUrl}/api/v${version}/party-agent/all`;
export const updateAgent = `${baseUrl}/api/v${version}/party-agent`;
export const deleteAgent = `${baseUrl}/api/v${version}/party-agent/delete`;
export const uploadAgent = `${baseUrl}/api/v${version}/party-agent/upload`;
export const filterAgents = `${baseUrl}/api/v${version}/party-agent/filter`;
export const filterAgentsByLga = `${baseUrl}/api/v${version}/party-agent/filter/lga`;
export const filterAgentsByWard = `${baseUrl}/api/v${version}/party-agent/filter/ward`;
export const filterAgentsByPollingUnit = `${baseUrl}/api/v${version}/party-agent/filter/polling-unit`;

//----RESULT URLS----//
export const allResults = `${baseUrl}/api/v${version}/result/state`;
export const createResult = `${baseUrl}/api/v${version}/result`;
export const getResultById = `${baseUrl}/api/v${version}/result`;
export const updateResult = `${baseUrl}/api/v${version}/result`;
export const deleteResult = `${baseUrl}/api/v${version}/result/delete`;
export const uploadResult = `${baseUrl}/api/v${version}/result/upload`;
export const filterResults = `${baseUrl}/api/v${version}/result/filter`;
export const filterResultsByLga = `${baseUrl}/api/v${version}/result/filter/lga`;
export const filterResultsByWard = `${baseUrl}/api/v${version}/result/filter/ward`;
export const filterResultsByPollingUnit = `${baseUrl}/api/v${version}/result/filter/polling-unit`;

//----INCIDENT URLS----//
export const allIncidents = `${baseUrl}/api/v${version}/incident/all`;
export const getLgaIncidents = `${baseUrl}/api/v${version}/incident/lga`;
export const getSenatorialIncidents = `${baseUrl}/api/v${version}/incident/senatorial`;

export const filterIncidents = `${baseUrl}/api/v${version}/incident`;
export const filterIncidentsLga = `${baseUrl}/api/v${version}/incident/lga`;
export const filterIncidentsWard = `${baseUrl}/api/v${version}/incident/ward`;
export const filterIncidentsPU = `${baseUrl}/api/v${version}/incident/polling-unit`;

export const createIncident = `${baseUrl}/api/v${version}/incident`;
export const getIncidentById = `${baseUrl}/api/v${version}/incident`;
export const updateIncident = `${baseUrl}/api/v${version}/incident`;
export const deleteIncident = `${baseUrl}/api/v${version}/incident/delete`;
export const uploadIncident = `${baseUrl}/api/v${version}/incident/upload`;

// --- INCIDENT GROUPS --- //
export const incidentGroup = `${baseUrl}/api/v${version}/incident-group`;

// --- EVENTS --- //
export const event = `${baseUrl}/api/v${version}/event`;
export const eventRecord = `${baseUrl}/api/v${version}/event-record`;

//----SENATORIAL DISTRICT URLS----//
export const getSenatorialDistrictsByStateId = `${baseUrl}/api/v${version}/senatorial-district/state`;
export const getSenatorialDistrictsForDefaultState = `${baseUrl}/api/v${version}/senatorial-district/state/default`;
export const getDefaultState = `${baseUrl}/api/v${version}/state/default`;

//---- VOTING LEVELS URLS----//
export const allVotingLevels = `${baseUrl}/api/v${version}/voting-level/all`;

//---- INCIDENT LEVELS URLS----//
export const allIncidentLevels = `${baseUrl}/api/v${version}/incident-level/all`;

//---- INCIDENT TYPES URLS----//
export const allIncidentTypes = `${baseUrl}/api/v${version}/incident-type/all`;

//---- DASHBOARD URLS----//
export const getDashboard = `${baseUrl}/api/v${version}/dashboard`;
export const getDashboardByState = `${baseUrl}/api/v${version}/dashboard`;
export const getDashboardByCountry = `${baseUrl}/api/v${version}/dashboard/national`;
export const getDashboardBySenatorialDistrict = `${baseUrl}/api/v${version}/dashboard/senatorial-district`;
export const getDashboardByLga = `${baseUrl}/api/v${version}/dashboard/lga`;

export const getDashboardEvents = `${baseUrl}/api/v${version}/dashboard/events`;

export const getIncidentDashboard = `${baseUrl}/api/v${version}/dashboard/incidents`;
export const getIncidentDashboardBySenatorialDistrict = `${baseUrl}/api/v${version}/dashboard/incidents/senatorial-district`;
export const getIncidentDashboardByLga = `${baseUrl}/api/v${version}/dashboard/incidents/lga`;
export const getGeoPoliticalZones = `${baseUrl}/api/v${version}/zones`;

export const electionTypes = `${baseUrl}/api/v${version}/election-types`;