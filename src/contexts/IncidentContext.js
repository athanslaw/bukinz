import React, {useReducer, useMemo, createContext} from 'react';
import PropTypes from 'prop-types';

const initialState = {
  loading: false,
  success: false,
  error: null,
  incidents: [],
  incident: null,
  message: '',
  response: null,
  dashboard: null
};

const initialContext = [{...initialState}, () => {}];

export const IncidentContext = createContext(initialContext);

const incidentReducer = (state, action) => {
  switch (action.type) {
    case 'GET_INCIDENTS':
      return {
        ...state,
        loading: true,
      };
    case 'GET_INCIDENTS_SUCCESS':
      return {
        ...state,
        loading: false,
        success: true,
        response: action.payload.response,
        incidents: action.payload.response.incidents
      };
    case 'GET_INCIDENTS_FAILURE':
      return {
        ...state,
        loading: false,
        success: false,
        error: action.payload.error,
      };
    case 'CREATE_INCIDENT':
      return {
        ...state,
        loading: true,
      };
    case 'CREATE_INCIDENT_SUCCESS':
      return {
        ...state,
        loading: false,
        success: true,
        incident: action.payload.response,
      };
    case 'CREATE_INCIDENT_FAILURE':
      return {
        ...state,
        loading: false,
        success: false,
        error: action.payload.error,
      };
    case 'UPDATE_INCIDENT':
      return {
        ...state,
        loading: true,
      };
    case 'UPDATE_INCIDENT_SUCCESS':
      return {
        ...state,
        loading: false,
        success: true,
        incident: action.payload.response,
      };
    case 'UPDATE_INCIDENT_FAILURE':
      return {
        ...state,
        loading: false,
        success: false,
        error: action.payload.error,
      };
    case 'DELETE_INCIDENT':
      return {
        ...state,
        loading: true,
      };
    case 'DELETE_INCIDENT_SUCCESS':
      return {
        ...state,
        loading: false,
        success: true,
        incident: action.payload.response,
      };
    case 'DELETE_INCIDENT_FAILURE':
      return {
        ...state,
        loading: false,
        success: false,
        error: action.payload.error,
      };
    case 'GET_INCIDENT_BY_ID':
      return {
        ...state,
        loading: true,
      };
    case 'GET_INCIDENT_BY_ID_SUCCESS':
      return {
        ...state,
        loading: false,
        success: true,
        incident: action.payload.response,
      };
    case 'GET_INCIDENT_BY_ID_FAILURE':
      return {
        ...state,
        loading: false,
        success: false,
        error: action.payload.error,
      };
    case 'UPLOAD_INCIDENT':
      return {
        ...state,
        loading: true,
      };
    case 'UPLOAD_INCIDENT_SUCCESS':
      return {
        ...state,
        loading: false,
        success: true,
        message: action.payload.message,
      };
    case 'UPLOAD_INCIDENT_FAILURE':
      return {
        ...state,
        loading: false,
        success: false,
        error: action.payload.error,
      };
    case 'DOWNLOAD_INCIDENT':
      return {
        ...state,
        loading: true,
      };
    case 'DOWNLOAD_INCIDENT_SUCCESS':
      return {
        ...state,
        loading: false,
        success: true,
        message: action.payload.message,
      };
    case 'DOWNLOAD_INCIDENT_FAILURE':
      return {
        ...state,
        loading: false,
        success: false,
        error: action.payload.error,
      };
    case 'GET_INCIDENT_DASHBOARD':
        return {
            ...state,
            loading: true
        };
    case 'GET_INCIDENT_DASHBOARD_SUCCESS':
        return {
            ...state,
            loading: false,
            success: true,
            dashboard: action.payload.response
        };
    case 'GET_INCIDENT_DASHBOARD_FAILURE':
        return {
            ...state,
            loading: false,
            success: false,
            error: action.payload.error
        };
    default:
      return {
        ...initialState,
      };
  }
};

export function IncidentController(props) {
  const [state, dispatch] = useReducer(incidentReducer, initialState);
  const value = useMemo(() => [state, dispatch], [state]);

  return (
    <IncidentContext.Provider value={value}>{props.children}</IncidentContext.Provider>
  );
}

IncidentController.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
};
