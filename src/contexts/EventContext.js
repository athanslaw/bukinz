import PropTypes from 'prop-types';
import React, { createContext, useMemo, useReducer } from 'react';

const initialState = {
  loading: false,
  success: false,
  error: null,
  events: [],
  response: null,
  event: null
};

const initialContext = [{...initialState}, () => {}];

export const EventContext = createContext(initialContext);

const eventReducer = (state, action) => {
  switch (action.type) {
    case 'GET_EVENTS':
      return {
        ...state,
        loading: true,
      };
    case 'GET_EVENTS_SUCCESS':
      return {
        ...state,
        loading: false,
        success: true,
        response: action.payload.response,
        events: action.payload.response.politicalParties
      };
    case 'GET_EVENTS_FAILURE':
      return {
        ...state,
        loading: false,
        success: false,
        error: action.payload.error,
      };
    case 'CREATE_EVENT':
      return {
        ...state,
        loading: true,
      };
    case 'CREATE_EVENT_SUCCESS':
      return {
        ...state,
        loading: false,
        success: true,
        response: action.payload.response,
      };
    case 'CREATE_EVENT_FAILURE':
      return {
        ...state,
        loading: false,
        success: false,
        error: action.payload.error,
      };
    case 'UPDATE_EVENT':
      return {
        ...state,
        loading: true,
      };
    case 'UPDATE_EVENT_SUCCESS':
      return {
        ...state,
        loading: false,
        success: true,
        response: action.payload.response,
      };
    case 'UPDATE_EVENT_FAILURE':
      return {
        ...state,
        loading: false,
        success: false,
        error: action.payload.error,
      };
    case 'DELETE_EVENT':
      return {
        ...state,
        loading: true,
      };
    case 'DELETE_EVENT_SUCCESS':
      return {
        ...state,
        loading: false,
        success: true,
        response: action.payload.response,
      };
    case 'DELETE_EVENT_FAILURE':
      return {
        ...state,
        loading: false,
        success: false,
        error: action.payload.error,
      };
    case 'GET_EVENT_BY_CODE':
      return {
        ...state,
        loading: true,
      };
    case 'GET_EVENT_BY_CODE_SUCCESS':
      return {
        ...state,
        loading: false,
        success: true,
        response: action.payload.response,
      };
    case 'GET_EVENT_BY_CODE_FAILURE':
      return {
        ...state,
        loading: false,
        success: false,
        error: action.payload.error,
      };
    case 'SEARCH_EVENT_BY_NAME':
      return {
        ...state,
        loading: true,
      };
    case 'SEARCH_EVENT_BY_NAME_SUCCESS':
      return {
        ...state,
        loading: false,
        success: true,
        response: action.payload.response,
        events: action.payload.response.politicalParties
      };
    case 'SEARCH_EVENT_BY_NAME_FAILURE':
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

export function PartyController(props) {
  const [state, dispatch] = useReducer(eventReducer, initialState);
  const value = useMemo(() => [state, dispatch], [state]);

  return (
    <EventContext.Provider value={value}>{props.children}</EventContext.Provider>
  );
}

PartyController.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
};
