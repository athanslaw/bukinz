import React, {useReducer, useMemo, createContext} from 'react';
import PropTypes from 'prop-types';

const initialState = {
  loading: false,
  success: false,
  error: null,
  agents: [],
  agent: null,
  message: '',
  response: null
};

const initialContext = [{...initialState}, () => {}];

export const AgentContext = createContext(initialContext);

const agentReducer = (state, action) => {
  switch (action.type) {
    case 'GET_AGENTS':
      return {
        ...state,
        loading: true,
      };
    case 'GET_AGENTS_SUCCESS':
      return {
        ...state,
        loading: false,
        success: true,
        response: action.payload.response,
        agents: action.payload.response.partyAgentDtoList
      };
    case 'GET_AGENTS_FAILURE':
      return {
        ...state,
        loading: false,
        success: false,
        error: action.payload.error,
      };
    case 'FILTER_AGENTS':
      return {
        ...state,
        loading: true,
      };
    case 'FILTER_AGENTS_SUCCESS':
      return {
        ...state,
        loading: false,
        success: true,
        response: action.payload.response,
        agents: action.payload.response.partyAgentDtoList
      };
    case 'FILTER_AGENTS_FAILURE':
      return {
        ...state,
        loading: false,
        success: false,
        error: action.payload.error,
      };
    case 'CREATE_AGENT':
      return {
        ...state,
        loading: true,
      };
    case 'CREATE_AGENT_SUCCESS':
      return {
        ...state,
        loading: false,
        success: true,
        response: action.payload.response,
      };
    case 'CREATE_AGENT_FAILURE':
      return {
        ...state,
        loading: false,
        success: false,
        error: action.payload.error,
      };
    case 'UPDATE_AGENT':
      return {
        ...state,
        loading: true,
      };
    case 'UPDATE_AGENT_SUCCESS':
      return {
        ...state,
        loading: false,
        success: true,
        response: action.payload.response,
      };
    case 'UPDATE_AGENT_FAILURE':
      return {
        ...state,
        loading: false,
        success: false,
        error: action.payload.error,
      };
    case 'DELETE_AGENT':
      return {
        ...state,
        loading: true,
      };
    case 'DELETE_AGENT_SUCCESS':
      return {
        ...state,
        loading: false,
        success: true,
        response: action.payload.response,
      };
    case 'DELETE_AGENT_FAILURE':
      return {
        ...state,
        loading: false,
        success: false,
        error: action.payload.error,
      };
    case 'GET_AGENT_BY_ID':
      return {
        ...state,
        loading: true,
      };
    case 'GET_AGENT_BY_ID_SUCCESS':
      return {
        ...state,
        loading: false,
        success: true,
        response: action.payload.response,
      };
    case 'GET_AGENT_BY_ID_FAILURE':
      return {
        ...state,
        loading: false,
        success: false,
        error: action.payload.error,
      };
    case 'GET_AGENT_BY_PHONE_NUMBER':
      return {
        ...state,
        loading: true,
      };
    case 'GET_AGENT_BY_PHONE_NUMBER_SUCCESS':
      return {
        ...state,
        loading: false,
        success: true,
        response: action.payload.response,
      };
    case 'GET_AGENT_BY_PHONE_NUMBER_FAILURE':
      return {
        ...state,
        loading: false,
        success: false,
        error: action.payload.error,
      };
      case 'UPLOAD_AGENT':
      return {
        ...state,
        loading: true,
      };
    case 'UPLOAD_AGENT_SUCCESS':
      return {
        ...state,
        loading: false,
        success: true,
        message: action.payload.message,
      };
    case 'UPLOAD_AGENT_FAILURE':
      return {
        ...state,
        loading: false,
        success: false,
        error: action.payload.error,
      };
    case 'DOWNLOAD_AGENT':
      return {
        ...state,
        loading: true,
      };
    case 'DOWNLOAD_AGENT_SUCCESS':
      return {
        ...state,
        loading: false,
        success: true,
        message: action.payload.message,
      };
    case 'DOWNLOAD_AGENT_FAILURE':
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

export function AgentController(props) {
  const [state, dispatch] = useReducer(agentReducer, initialState);
  const value = useMemo(() => [state, dispatch], [state]);

  return (
    <AgentContext.Provider value={value}>{props.children}</AgentContext.Provider>
  );
}

AgentController.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
};
