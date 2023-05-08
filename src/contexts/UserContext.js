import React, {useReducer, useMemo, createContext} from 'react';
import PropTypes from 'prop-types';

const initialState = {
  loading: false,
  success: false,
  error: null,
  users: [],
  user: null
};

const initialContext = [{...initialState}, () => {}];

export const UserContext = createContext(initialContext);

const userReducer = (state, action) => {
  switch (action.type) {
    case 'GET_USERS':
      return {
        ...state,
        loading: true,
      };
    case 'GET_USERS_SUCCESS':
      return {
        ...state,
        loading: false,
        success: true,
        users: action.payload.response,
      };
    case 'GET_USERS_FAILURE':
      return {
        ...state,
        loading: false,
        success: false,
        error: action.payload.error,
      };
    case 'CREATE_USER':
      return {
        ...state,
        loading: true,
      };
    case 'CREATE_USER_SUCCESS':
      return {
        ...state,
        loading: false,
        success: true,
        user: action.payload.response,
      };
    case 'CREATE_USER_FAILURE':
      return {
        ...state,
        loading: false,
        success: false,
        error: action.payload.error,
      };
    case 'UPDATE_USER':
      return {
        ...state,
        loading: true,
      };
    case 'UPDATE_USER_SUCCESS':
      return {
        ...state,
        loading: false,
        success: true,
        user: action.payload.response,
      };
    case 'UPDATE_USER_FAILURE':
      return {
        ...state,
        loading: false,
        success: false,
        error: action.payload.error,
      };
    case 'DELETE_USER':
      return {
        ...state,
        loading: true,
      };
    case 'DELETE_USER_SUCCESS':
      return {
        ...state,
        loading: false,
        success: true,
        user: action.payload.response,
      };
    case 'DELETE_USER_FAILURE':
      return {
        ...state,
        loading: false,
        success: false,
        error: action.payload.error,
      };
    case 'GET_USER_BY_NAME':
      return {
        ...state,
        loading: true,
      };
    case 'GET_USER_BY_ID':
      return {
        ...state,
        loading: true,
      };
    case 'GET_USER_BY_NAME_SUCCESS':
      return {
        ...state,
        loading: false,
        success: true,
        user: action.payload.response,
      };
    case 'GET_USER_BY_NAME_FAILURE':
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

export function UserController(props) {
  const [state, dispatch] = useReducer(userReducer, initialState);
  const value = useMemo(() => [state, dispatch], [state]);

  return (
    <UserContext.Provider value={value}>{props.children}</UserContext.Provider>
  );
}

UserController.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
};
