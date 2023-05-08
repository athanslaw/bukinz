import React, {useReducer, useMemo, createContext} from 'react';
import PropTypes from 'prop-types';

const initialState = {
  loading: false,
  success: false,
  error: null,
  wards: [],
  ward: null,
  message: '',
  response: null
};

const initialContext = [{...initialState}, () => {}];

export const WardContext = createContext(initialContext);

const wardReducer = (state, action) => {
  switch (action.type) {
    case 'GET_WARDS':
      return {
        ...state,
        loading: true,
      };
    case 'GET_WARDS_SUCCESS':
      return {
        ...state,
        loading: false,
        success: true,
        response: action.payload.response,
        wards: action.payload.response.wards,
      };
    case 'GET_WARDS_FAILURE':
      return {
        ...state,
        loading: false,
        success: false,
        error: action.payload.error,
      };
    case 'CREATE_WARD':
      return {
        ...state,
        loading: true,
      };
    case 'CREATE_WARD_SUCCESS':
      return {
        ...state,
        loading: false,
        success: true,
        response: action.payload.response,
      };
    case 'CREATE_WARD_FAILURE':
      return {
        ...state,
        loading: false,
        success: false,
        error: action.payload.error,
      };
    case 'UPDATE_WARD':
      return {
        ...state,
        loading: true,
      };
    case 'UPDATE_WARD_SUCCESS':
      return {
        ...state,
        loading: false,
        success: true,
        response: action.payload.response,
      };
    case 'UPDATE_WARD_FAILURE':
      return {
        ...state,
        loading: false,
        success: false,
        error: action.payload.error,
      };
    case 'DELETE_WARD':
      return {
        ...state,
        loading: true,
      };
    case 'DELETE_WARD_SUCCESS':
      return {
        ...state,
        loading: false,
        success: true,
        response: action.payload.response,
      };
    case 'DELETE_WARD_FAILURE':
      return {
        ...state,
        loading: false,
        success: false,
        error: action.payload.error,
      };
    case 'GET_WARD_BY_ID':
      return {
        ...state,
        loading: true,
      };
    case 'GET_WARD_BY_ID_SUCCESS':
      return {
        ...state,
        loading: false,
        success: true,
        response: action.payload.response,
      };
    case 'GET_WARD_BY_ID_FAILURE':
      return {
        ...state,
        loading: false,
        success: false,
        error: action.payload.error,
      };
    case 'GET_WARD_BY_CODE':
      return {
        ...state,
        loading: true,
      };
    case 'GET_WARD_BY_CODE_SUCCESS':
      return {
        ...state,
        loading: false,
        success: true,
        response: action.payload.response,
      };
    case 'GET_WARD_BY_CODE_FAILURE':
      return {
        ...state,
        loading: false,
        success: false,
        error: action.payload.error,
      };
      case 'UPLOAD_WARD':
      return {
        ...state,
        loading: true,
      };
    case 'UPLOAD_WARD_SUCCESS':
      return {
        ...state,
        loading: false,
        success: true,
        message: action.payload.message,
      };
    case 'UPLOAD_WARD_FAILURE':
      return {
        ...state,
        loading: false,
        success: false,
        error: action.payload.error,
      };
    case 'DOWNLOAD_WARD':
      return {
        ...state,
        loading: true,
      };
    case 'DOWNLOAD_WARD_SUCCESS':
      return {
        ...state,
        loading: false,
        success: true,
        message: action.payload.message,
      };
    case 'DOWNLOAD_WARD_FAILURE':
      return {
        ...state,
        loading: false,
        success: false,
        error: action.payload.error,
      };
    case 'SEARCH_WARD_BY_NAME':
      return {
        ...state,
        loading: true,
      };
    case 'SEARCH_WARD_BY_NAME_SUCCESS':
      return {
        ...state,
        loading: false,
        success: true,
        response: action.payload.response,
      };
    case 'SEARCH_WARD_BY_NAME_FAILURE':
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

export function WardController(props) {
  const [state, dispatch] = useReducer(wardReducer, initialState);
  const value = useMemo(() => [state, dispatch], [state]);

  return (
    <WardContext.Provider value={value}>{props.children}</WardContext.Provider>
  );
}

WardController.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
};
