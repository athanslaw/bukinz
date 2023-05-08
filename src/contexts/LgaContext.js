import React, {useReducer, useMemo, createContext} from 'react';
import PropTypes from 'prop-types';

const initialState = {
  loading: false,
  success: false,
  error: null,
  lgas: [],
  lga: null,
  message: '',
  response: null
};

const initialContext = [{...initialState}, () => {}];

export const LgaContext = createContext(initialContext);

const lgaReducer = (state, action) => {
  switch (action.type) {
    case 'GET_LGAS':
      return {
        ...state,
        loading: true,
      };
    case 'GET_LGAS_SUCCESS':
      return {
        ...state,
        loading: false,
        success: true,
        response: action.payload.response,
        lgas: action.payload.response.lgas,
      };
    case 'GET_LGAS_FAILURE':
      return {
        ...state,
        loading: false,
        success: false,
        error: action.payload.error,
      };
    case 'CREATE_LGA':
      return {
        ...state,
        loading: true,
      };
    case 'CREATE_LGA_SUCCESS':
      return {
        ...state,
        loading: false,
        success: true,
        response: action.payload.response,
      };
    case 'CREATE_LGA_FAILURE':
      return {
        ...state,
        loading: false,
        success: false,
        error: action.payload.error,
      };
    case 'UPDATE_LGA':
      return {
        ...state,
        loading: true,
      };
    case 'UPDATE_LGA_SUCCESS':
      return {
        ...state,
        loading: false,
        success: true,
        response: action.payload.response,
      };
    case 'UPDATE_LGA_FAILURE':
      return {
        ...state,
        loading: false,
        success: false,
        error: action.payload.error,
      };
    case 'DELETE_LGA':
      return {
        ...state,
        loading: true,
      };
    case 'DELETE_LGA_SUCCESS':
      return {
        ...state,
        loading: false,
        success: true,
        response: action.payload.response,
      };
    case 'DELETE_LGA_FAILURE':
      return {
        ...state,
        loading: false,
        success: false,
        error: action.payload.error,
      };
    case 'GET_LGA_BY_ID':
      return {
        ...state,
        loading: true,
      };
    case 'GET_LGA_BY_ID_SUCCESS':
      return {
        ...state,
        loading: false,
        success: true,
        response: action.payload.response,
      };
    case 'GET_LGA_BY_ID_FAILURE':
      return {
        ...state,
        loading: false,
        success: false,
        error: action.payload.error,
      };
    case 'GET_LGA_BY_CODE':
      return {
        ...state,
        loading: true,
      };
    case 'GET_LGA_BY_CODE_SUCCESS':
      return {
        ...state,
        loading: false,
        success: true,
        response: action.payload.response,
      };
    case 'GET_LGA_BY_CODE_FAILURE':
      return {
        ...state,
        loading: false,
        success: false,
        error: action.payload.error,
      };
      case 'UPLOAD_LGA':
      return {
        ...state,
        loading: true,
      };
    case 'UPLOAD_LGA_SUCCESS':
      return {
        ...state,
        loading: false,
        success: true,
        message: action.payload.message,
      };
    case 'UPLOAD_LGA_FAILURE':
      return {
        ...state,
        loading: false,
        success: false,
        error: action.payload.error,
      };
    case 'DOWNLOAD_LGA':
      return {
        ...state,
        loading: true,
      };
    case 'DOWNLOAD_LGA_SUCCESS':
      return {
        ...state,
        loading: false,
        success: true,
        message: action.payload.message,
      };
    case 'DOWNLOAD_LGA_FAILURE':
      return {
        ...state,
        loading: false,
        success: false,
        error: action.payload.error,
      };
    case 'SEARCH_LGA_BY_NAME':
      return {
        ...state,
        loading: true,
      };
    case 'SEARCH_LGA_BY_NAME_SUCCESS':
      return {
        ...state,
        loading: false,
        success: true,
        response: action.payload.response,
      };
    case 'SEARCH_LGA_BY_NAME_FAILURE':
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

export function LgaController(props) {
  const [state, dispatch] = useReducer(lgaReducer, initialState);
  const value = useMemo(() => [state, dispatch], [state]);

  return (
    <LgaContext.Provider value={value}>{props.children}</LgaContext.Provider>
  );
}

LgaController.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
};
