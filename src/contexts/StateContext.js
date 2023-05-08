import React, {useReducer, useMemo, createContext} from 'react';
import PropTypes from 'prop-types';

const initialState = {
  loading: false,
  success: false,
  error: null,
  states: [],
  sttae: null,
  response: null
};

const initialContext = [{...initialState}, () => {}];

export const StateContext = createContext(initialContext);

const stateReducer = (state, action) => {
  switch (action.type) {
    case 'GET_STATES':
      return {
        ...state,
        loading: true,
      };
    case 'GET_STATES_SUCCESS':
      return {
        ...state,
        loading: false,
        success: true,
        states: action.payload.response.states,
        response: action.payload.response
      };
    case 'GET_STATES_FAILURE':
      return {
        ...state,
        loading: false,
        success: false,
        error: action.payload.error,
      };
    case 'CREATE_STATE':
      return {
        ...state,
        loading: true,
      };
    case 'CREATE_STATE_SUCCESS':
      return {
        ...state,
        loading: false,
        success: true,
        response: action.payload.response,
      };
    case 'CREATE_STATE_FAILURE':
      return {
        ...state,
        loading: false,
        success: false,
        error: action.payload.error,
      };
    case 'UPDATE_STATE':
      return {
        ...state,
        loading: true,
      };
    case 'UPDATE_STATE_SUCCESS':
      return {
        ...state,
        loading: false,
        success: true,
        response: action.payload.response,
      };
    case 'UPDATE_STATE_FAILURE':
      return {
        ...state,
        loading: false,
        success: false,
        error: action.payload.error,
      };
    case 'DELETE_STATE':
      return {
        ...state,
        loading: true,
      };
    case 'DELETE_STATE_SUCCESS':
      return {
        ...state,
        loading: false,
        success: true,
        response: action.payload.response,
      };
    case 'DELETE_STATE_FAILURE':
      return {
        ...state,
        loading: false,
        success: false,
        error: action.payload.error,
      };
    case 'GET_STATE_BY_ID':
      return {
        ...state,
        loading: true,
      };
    case 'GET_STATE_BY_ID_SUCCESS':
      return {
        ...state,
        loading: false,
        success: true,
        response: action.payload.response,
      };
    case 'GET_STATE_BY_ID_FAILURE':
      return {
        ...state,
        loading: false,
        success: false,
        error: action.payload.error,
      };
    case 'SEARCH_STATE_BY_NAME':
      return {
        ...state,
        loading: true,
      };
    case 'SEARCH_STATE_BY_NAME_SUCCESS':
      return {
        ...state,
        loading: false,
        success: true,
        response: action.payload.response,
      };
    case 'SEARCH_STATE_BY_NAME_FAILURE':
      return {
        ...state,
        loading: false,
        success: false,
        error: action.payload.error,
      };
    case 'SET_DEFAULT_STATE':
      return {
        ...state,
        loading: true,
      };
    case 'SET_DEFAULT_STATE_SUCCESS':
      return {
        ...state,
        loading: false,
        success: true,
        response: action.payload.response,
      };
    case 'SET_DEFAULT_STATE_FAILURE':
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
