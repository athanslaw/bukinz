import React, {useReducer, useMemo, createContext} from 'react';
import PropTypes from 'prop-types';
import { act } from 'react-dom/test-utils';

const initialState = {
  loading: false,
  success: false,
  error: null,
  parties: [],
  response: null,
  party: null
};

const initialContext = [{...initialState}, () => {}];

export const PartyContext = createContext(initialContext);

const partyReducer = (state, action) => {
  switch (action.type) {
    case 'GET_PARTIES':
      return {
        ...state,
        loading: true,
      };
    case 'GET_PARTIES_SUCCESS':
      return {
        ...state,
        loading: false,
        success: true,
        response: action.payload.response,
        parties: action.payload.response.politicalParties
      };
    case 'GET_PARTIES_FAILURE':
      return {
        ...state,
        loading: false,
        success: false,
        error: action.payload.error,
      };
    case 'CREATE_PARTY':
      return {
        ...state,
        loading: true,
      };
    case 'CREATE_PARTY_SUCCESS':
      return {
        ...state,
        loading: false,
        success: true,
        response: action.payload.response,
      };
    case 'CREATE_PARTY_FAILURE':
      return {
        ...state,
        loading: false,
        success: false,
        error: action.payload.error,
      };
    case 'UPDATE_PARTY':
      return {
        ...state,
        loading: true,
      };
    case 'UPDATE_PARTY_SUCCESS':
      return {
        ...state,
        loading: false,
        success: true,
        response: action.payload.response,
      };
    case 'UPDATE_PARTY_FAILURE':
      return {
        ...state,
        loading: false,
        success: false,
        error: action.payload.error,
      };
    case 'DELETE_PARTY':
      return {
        ...state,
        loading: true,
      };
    case 'DELETE_PARTY_SUCCESS':
      return {
        ...state,
        loading: false,
        success: true,
        response: action.payload.response,
      };
    case 'DELETE_PARTY_FAILURE':
      return {
        ...state,
        loading: false,
        success: false,
        error: action.payload.error,
      };
    case 'GET_PARTY_BY_CODE':
      return {
        ...state,
        loading: true,
      };
    case 'GET_PARTY_BY_CODE_SUCCESS':
      return {
        ...state,
        loading: false,
        success: true,
        response: action.payload.response,
      };
    case 'GET_PARTY_BY_CODE_FAILURE':
      return {
        ...state,
        loading: false,
        success: false,
        error: action.payload.error,
      };
    case 'SEARCH_PARTY_BY_NAME':
      return {
        ...state,
        loading: true,
      };
    case 'SEARCH_PARTY_BY_NAME_SUCCESS':
      return {
        ...state,
        loading: false,
        success: true,
        response: action.payload.response,
        parties: action.payload.response.politicalParties
      };
    case 'SEARCH_PARTY_BY_NAME_FAILURE':
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
  const [state, dispatch] = useReducer(partyReducer, initialState);
  const value = useMemo(() => [state, dispatch], [state]);

  return (
    <PartyContext.Provider value={value}>{props.children}</PartyContext.Provider>
  );
}

PartyController.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
};
