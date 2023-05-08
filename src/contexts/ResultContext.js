import React, {useReducer, useMemo, createContext} from 'react';
import PropTypes from 'prop-types';

const initialState = {
  loading: false,
  success: false,
  error: null,
  results: [],
  result: null,
  message: '',
  response: null,
  dashboard: null
};

const initialContext = [{...initialState}, () => {}];

export const ResultContext = createContext(initialContext);

const resultReducer = (state, action) => {
  switch (action.type) {
    case 'GET_RESULTS':
      return {
        ...state,
        loading: true,
      };
    case 'GET_RESULTS_SUCCESS':
      return {
        ...state,
        loading: false,
        success: true,
        response: action.payload.response,
        results: action.payload.response.results
      };
    case 'GET_RESULTS_FAILURE':
      return {
        ...state,
        loading: false,
        success: false,
        error: action.payload.error,
      };
    case 'CREATE_RESULT':
      return {
        ...state,
        loading: true,
      };
    case 'CREATE_RESULT_SUCCESS':
      return {
        ...state,
        loading: false,
        success: true,
        result: action.payload.response,
      };
    case 'CREATE_RESULT_FAILURE':
      return {
        ...state,
        loading: false,
        success: false,
        error: action.payload.error,
      };
    case 'UPDATE_RESULT':
      return {
        ...state,
        loading: true,
      };
    case 'UPDATE_RESULT_SUCCESS':
      return {
        ...state,
        loading: false,
        success: true,
        result: action.payload.response,
      };
    case 'UPDATE_RESULT_FAILURE':
      return {
        ...state,
        loading: false,
        success: false,
        error: action.payload.error,
      };
    case 'DELETE_RESULT':
      return {
        ...state,
        loading: true,
      };
    case 'DELETE_RESULT_SUCCESS':
      return {
        ...state,
        loading: false,
        success: true,
        result: action.payload.response,
      };
    case 'DELETE_RESULT_FAILURE':
      return {
        ...state,
        loading: false,
        success: false,
        error: action.payload.error,
      };
    case 'GET_RESULT_BY_ID':
      return {
        ...state,
        loading: true,
      };
    case 'GET_RESULT_BY_ID_SUCCESS':
      return {
        ...state,
        loading: false,
        success: true,
        result: action.payload.response,
      };
    case 'GET_RESULT_BY_ID_FAILURE':
      return {
        ...state,
        loading: false,
        success: false,
        error: action.payload.error,
      };
    case 'UPLOAD_RESULT':
      return {
        ...state,
        loading: true,
      };
    case 'UPLOAD_RESULT_SUCCESS':
      return {
        ...state,
        loading: false,
        success: true,
        message: action.payload.message,
      };
    case 'UPLOAD_RESULT_FAILURE':
      return {
        ...state,
        loading: false,
        success: false,
        error: action.payload.error,
      };
    case 'DOWNLOAD_RESULT':
      return {
        ...state,
        loading: true,
      };
    case 'DOWNLOAD_RESULT_SUCCESS':
      return {
        ...state,
        loading: false,
        success: true,
        message: action.payload.message,
      };
    case 'DOWNLOAD_RESULT_FAILURE':
      return {
        ...state,
        loading: false,
        success: false,
        error: action.payload.error,
      };
        case 'GET_DASHBOARD':
            return {
                ...state,
                loading: true
            };
        case 'GET_DASHBOARD_SUCCESS':
            return {
                ...state,
                loading: false,
                success: true,
                dashboard: action.payload.response
            };
        case 'GET_DASHBOARD_FAILURE':
            return {
                ...state,
                loading: false,
                success: false,
                error: action.payload.error
            };
        case 'GET_DASHBOARD_BY_STATE':
            return {
                ...state,
                loading: true
            };
        case 'GET_DASHBOARD_BY_STATE_SUCCESS':
            return {
                ...state,
                loading: false,
                success: true,
                dashboard: action.payload.response
            };
        case 'GET_DASHBOARD_BY_STATE_FAILURE':
            return {
                ...state,
                loading: false,
                success: false,
                error: action.payload.error
            };
        case 'GET_DASHBOARD_BY_SENATORIAL_DISTRICT':
            return {
                ...state,
                loading: true
            };
        case 'GET_DASHBOARD_BY_SENATORIAL_DISTRICT_SUCCESS':
            return {
                ...state,
                loading: false,
                success: true,
                response: action.payload.response
            };
        case 'GET_DASHBOARD_BY_SENATORIAL_DISTRICT_FAILURE':
            return {
                ...state,
                loading: false,
                success: false,
                error: action.payload.error
            };
        case 'GET_DASHBOARD_BY_LGA':
            return {
                ...state,
                loading: true
            };
        case 'GET_DASHBOARD_BY_LGA_SUCCESS':
            return {
                ...state,
                loading: false,
                success: true,
                response: action.payload.response
            };
        case 'GET_DASHBOARD_BY_LGA_FAILURE':
            return {
                ...state,
                loading: false,
                success: false,
                error: action.payload.error
            };
    case 'FILTER_RESULTS':
      return {
        ...state,
        loading: true,
      };
    case 'FILTER_RESULTS_SUCCESS':
      return {
        ...state,
        loading: false,
        success: true,
        response: action.payload.response,
        results: action.payload.response.results
      };
    case 'FILTER_RESULTS_FAILURE':
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

export function ResultController(props) {
  const [state, dispatch] = useReducer(resultReducer, initialState);
  const value = useMemo(() => [state, dispatch], [state]);

  return (
    <ResultContext.Provider value={value}>{props.children}</ResultContext.Provider>
  );
}

ResultController.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
};
