import PropTypes from 'prop-types';
import React, { createContext, useMemo, useReducer } from 'react';

const initialState = {
  loading: false,
  success: false,
  error: null,
  states: [],
  sttae: null,
  response: null
};

const initialContext = [{...initialState}, () => {}];

export const IncidentGroupContext = createContext(initialContext);

const stateReducer = (state, action) => {
  switch (action.type) {
    case 'GET_INCIDENT_GROUPS':
      return {
        ...state,
        loading: true,
      };
    case 'GET_INCIDENT_GROUPS_SUCCESS':
      return {
        ...state,
        loading: false,
        success: true,
        states: action.payload.response.states,
        response: action.payload.response
      };
    case 'GET_INCIDENT_GROUPS_FAILURE':
      return {
        ...state,
        loading: false,
        success: false,
        error: action.payload.error,
      };
    case 'CREATE_INCIDENT_GROUP':
      return {
        ...state,
        loading: true,
      };
    case 'CREATE_INCIDENT_GROUP_SUCCESS':
      return {
        ...state,
        loading: false,
        success: true,
        response: action.payload.response,
      };
    case 'CREATE_INCIDENT_GROUP_FAILURE':
      return {
        ...state,
        loading: false,
        success: false,
        error: action.payload.error,
      };
    case 'UPDATE_INCIDENT_GROUP':
      return {
        ...state,
        loading: true,
      };
    case 'UPDATE_INCIDENT_GROUP_SUCCESS':
      return {
        ...state,
        loading: false,
        success: true,
        response: action.payload.response,
      };
    case 'UPDATE_INCIDENT_GROUP_FAILURE':
      return {
        ...state,
        loading: false,
        success: false,
        error: action.payload.error,
      };
    case 'DELETE_INCIDENT_GROUP':
      return {
        ...state,
        loading: true,
      };
    case 'DELETE_INCIDENT_GROUP_SUCCESS':
      return {
        ...state,
        loading: false,
        success: true,
        response: action.payload.response,
      };
    case 'DELETE_INCIDENT_GROUP_FAILURE':
      return {
        ...state,
        loading: false,
        success: false,
        error: action.payload.error,
      };
    case 'GET_INCIDENT_GROUP_BY_ID':
      return {
        ...state,
        loading: true,
      };
    case 'GET_INCIDENT_GROUP_BY_ID_SUCCESS':
      return {
        ...state,
        loading: false,
        success: true,
        response: action.payload.response,
      };
    case 'GET_INCIDENT_GROUP_BY_ID_FAILURE':
      return {
        ...state,
        loading: false,
        success: false,
        error: action.payload.error,
      };
    case 'SEARCH_INCIDENT_GROUP_BY_NAME':
      return {
        ...state,
        loading: true,
      };
    case 'SEARCH_INCIDENT_GROUP_BY_NAME_SUCCESS':
      return {
        ...state,
        loading: false,
        success: true,
        response: action.payload.response,
      };
    case 'SEARCH_INCIDENT_GROUP_BY_NAME_FAILURE':
      return {
        ...state,
        loading: false,
        success: false,
        error: action.payload.error,
      };
    case 'SET_DEFAULT_INCIDENT_GROUP':
      return {
        ...state,
        loading: true,
      };
    case 'SET_DEFAULT_INCIDENT_GROUP_SUCCESS':
      return {
        ...state,
        loading: false,
        success: true,
        response: action.payload.response,
      };
    case 'SET_DEFAULT_INCIDENT_GROUP_FAILURE':
      return {
        ...state,
        loading: false,
        success: false,
        error: action.payload.error,
      };
    default:
      return {
        ...initialState,
      };
  }
};

export function StateController(props) {
  const [state, dispatch] = useReducer(stateReducer, initialState);
  const value = useMemo(() => [state, dispatch], [state]);

  return (
    <StateContext.Provider value={value}>{props.children}</StateContext.Provider>
  );
}

StateController.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
};
