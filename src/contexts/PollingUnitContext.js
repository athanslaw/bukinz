import React, {useReducer, useMemo, createContext} from 'react';
import PropTypes from 'prop-types';

const initialState = {
  loading: false,
  success: false,
  error: null,
  pollingUnits: [],
  pollingUnit: null,
  message: '',
  response: null
};

const initialContext = [{...initialState}, () => {}];

export const PUContext = createContext(initialContext);

const puReducer = (state, action) => {
  switch (action.type) {
    case 'GET_POLLING_UNITS':
      return {
        ...state,
        loading: true,
      };
    case 'GET_POLLING_UNITS_SUCCESS':
      return {
        ...state,
        loading: false,
        success: true,
        response: action.payload.response,
        pollingUnits: action.payload.response.pollingUnits,
      };
    case 'GET_POLLING_UNITS_FAILURE':
      return {
        ...state,
        loading: false,
        success: false,
        error: action.payload.error,
      };
    case 'CREATE_POLLING_UNIT':
      return {
        ...state,
        loading: true,
      };
    case 'CREATE_POLLING_UNIT_SUCCESS':
      return {
        ...state,
        loading: false,
        success: true,
        response: action.payload.response,
      };
    case 'CREATE_POLLING_UNIT_FAILURE':
      return {
        ...state,
        loading: false,
        success: false,
        error: action.payload.error,
      };
    case 'UPDATE_POLLING_UNIT':
      return {
        ...state,
        loading: true,
      };
    case 'UPDATE_POLLING_UNIT_SUCCESS':
      return {
        ...state,
        loading: false,
        success: true,
        response: action.payload.response,
      };
    case 'UPDATE_POLLING_UNIT_FAILURE':
      return {
        ...state,
        loading: false,
        success: false,
        error: action.payload.error,
      };
    case 'DELETE_POLLING_UNIT':
      return {
        ...state,
        loading: true,
      };
    case 'DELETE_POLLING_UNIT_SUCCESS':
      return {
        ...state,
        loading: false,
        success: true,
        response: action.payload.response,
      };
    case 'DELETE_POLLING_UNIT_FAILURE':
      return {
        ...state,
        loading: false,
        success: false,
        error: action.payload.error,
      };
    case 'GET_POLLING_UNIT_BY_ID':
      return {
        ...state,
        loading: true,
      };
    case 'GET_POLLING_UNIT_BY_ID_SUCCESS':
      return {
        ...state,
        loading: false,
        success: true,
        response: action.payload.response,
      };
    case 'GET_POLLING_UNIT_BY_ID_FAILURE':
      return {
        ...state,
        loading: false,
        success: false,
        error: action.payload.error,
      };
    case 'GET_POLLING_UNIT_BY_CODE':
      return {
        ...state,
        loading: true,
      };
    case 'GET_POLLING_UNIT_BY_CODE_SUCCESS':
      return {
        ...state,
        loading: false,
        success: true,
        response: action.payload.response,
      };
    case 'GET_POLLING_UNIT_BY_CODE_FAILURE':
      return {
        ...state,
        loading: false,
        success: false,
        error: action.payload.error,
      };
      case 'UPLOAD_POLLING_UNIT':
      return {
        ...state,
        loading: true,
      };
    case 'UPLOAD_POLLING_UNIT_SUCCESS':
      return {
        ...state,
        loading: false,
        success: true,
        message: action.payload.message,
      };
    case 'UPLOAD_POLLING_UNIT_FAILURE':
      return {
        ...state,
        loading: false,
        success: false,
        error: action.payload.error,
      };
    case 'DOWNLOAD_POLLING_UNIT':
      return {
        ...state,
        loading: true,
      };
    case 'DOWNLOAD_POLLING_UNIT_SUCCESS':
      return {
        ...state,
        loading: false,
        success: true,
        message: action.payload.message,
      };
    case 'DOWNLOAD_POLLING_UNIT_FAILURE':
      return {
        ...state,
        loading: false,
        success: false,
        error: action.payload.error,
      };
    case 'SEARCH_POLLING_UNIT_BY_NAME':
      return {
        ...state,
        loading: true,
      };
    case 'SEARCH_POLLING_UNIT_BY_NAME_SUCCESS':
      return {
        ...state,
        loading: false,
        success: true,
        response: action.payload.response,
      };
    case 'SEARCH_POLLING_UNIT_BY_NAME_FAILURE':
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

export function PUController(props) {
  const [state, dispatch] = useReducer(puReducer, initialState);
  const value = useMemo(() => [state, dispatch], [state]);

  return (
    <PUContext.Provider value={value}>{props.children}</PUContext.Provider>
  );
}

PUController.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
};
